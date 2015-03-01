var canvasPanel;

/**
 * Entry point of the application
 * This function is called once
 * @param attachPoint
 * @returns
 */
function GraphApp(attachPoint)
{
	//Create a canvas
	this.attachPoint = attachPoint;
	canvasPanel = new CanvasPanel("graphCanvas");

	//Download the data from the server
	$.ajax({url:'data/earthquakes.csv', dataType:'text'}).done(function(text) {
		handleData(CSVToArray(text));
	});
	
	//Create the stage(2D)/scene and set up cameras, lights and renderer(3D)
	
	
	//Setup the animation loop
	window.requestAnimationFrame(tick);
};

/**
 * Data function, called after the Ajax Request has returned.
 * This function is only called once
 * @param data CSV data converted into an array
 */
function handleData(data)
{
	//An example of how to deal with the data - you will instead be creating graph elements
	for (var i = 0; i < data.length; i++)
	{
		if (i ==0 ) //we ignore the first row, the header row
			continue;
		
		//In this loop - instead of just adding data to the page, use the data to create
		//shapes (or meshes) and position them according to their info
		var div = document.createElement("div");
		$(div).text("place: " + data[i][0] + " time: " + data[i][3] + "e: " + data[i][6]);
		$('article.attachPoint').append(div);
	}
	
}

/**
 * Animation function , called often
 * NB: the data may not have been returned yet, so be
 * careful
 */
function tick(event)
{
	//Update the stage/scene and and associated shapes/meshes
	
	
	
	
	//ask for a new tick
	window.requestAnimationFrame(tick);
}