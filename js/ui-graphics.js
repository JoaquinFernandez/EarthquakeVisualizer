/**
 * Graphics Panel
 */
function CanvasPanel(className) {
	Panel.call(this, className); //call constructor
}
CanvasPanel.prototype = new Panel(); //set prototype
CanvasPanel.prototype.constructor = CanvasPanel; //fix constructor pointer
CanvasPanel.prototype.createElement = function(name) {
	return document.createElement("canvas");
};
/**
 * Score Panel
 */
function ScorePanel(className, initialScore) {
	Panel.call(this, className); //call constructor
	this.score = initialScore;
	
	this.updateScore = function(value) {
		score = value;
	};
}
ScorePanel.prototype = new Panel(); //set prototype
ScorePanel.prototype.constructor = ScorePanel; //fix constructor pointer
ScorePanel.prototype.getText = function() {
	return this.score + " points";
};
