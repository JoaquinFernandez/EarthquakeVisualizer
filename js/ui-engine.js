/**
 * Panel class, used to hold widgets on a page
 * @param className CSS Class name to put on panel
 * @returns
 * 
 */
function Panel(className)
{
	this.elem = {};
	this.children = [];
	this.className = className;
	this.text = "";

	/**
	 * Attach an object. HTML elements are not created until
	 * the UI engine creates them
	 */
	Panel.prototype.attach = function(subobj) {
		this.children.push(subobj);
	};

	Panel.prototype.setText = function(textToDisplay) {
		this.text = textToDisplay;
	};

	Panel.prototype.domElement = function() {
		return this.elem;
	};
	
	/**
	 * This function should create the elements of myself and
	 * my children. It is designed so that Panels will build a structure like:
	 * 
	 * ARTICLE
	 * 		SECTION
	 * 			DIV
	 * 				DIV...
 	 *			DIV
 	 *				DIV....
 	 *		SECTION
 	 *			DIV
 	 *ARTICLE
 	 *		SECTION
	 */
	Panel.prototype.invokeEngine = function(attachPoint) {
		if (attachPoint instanceof Panel)
			{
				var tagName = attachPoint.domElement().tagName.toLowerCase();
				if (tagName == "article" || tagName == "aside")
					this.elem = this.createElement("section");
				else
					this.elem = this.createElement("div");
				this.setUpAndInvoke(attachPoint.domElement());
			}
		else
			{
				this.elem = this.createElement("article");
				this.setUpAndInvoke(attachPoint);
			}
			
	};
	
	Panel.prototype.getText = function() {
		return this.text
	};
	
	Panel.prototype.createElement = function(name) {
		return document.createElement(name);
	};
	
	/**
	 * Common functionality used by articles, sections and divs.
	 * Sets classnames, text and then tells the children to build themselves
	 */
	Panel.prototype.setUpAndInvoke = function(elem)
	{
		$(elem).append(this.elem);
		$(this.elem).addClass(this.className);
		$(this.elem).text(this.getText());
		
		for (var c = 0 ; c< this.children.length; c++)
		{
			this.children[c].invokeEngine(this);
		}
	};

};
