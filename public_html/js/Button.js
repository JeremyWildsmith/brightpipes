/**
 * Button class used for all buttons in the game.
 */

/**
 * Creates a button.
 * @param {type} label The label or text of the button.
 * @param {type} callback The callback method to invoke when the button is pressed.
 * @returns {Button}
 */
function Button(label, callback) {
    this.defaultGraphic = new LoadingGraphic("gfx/btnUp.png", 0, 0);
    this.hoverGraphic = new LoadingGraphic("gfx/btnDown.png", 0, 0);
    this.label = label;
    this.callback = callback;
    this.hovering = false;
    this.hoverColor = "#DAAB08";
    this.defaultColor = "#F4BF09";
}

/**
 * Draws the button through the specified graphic context at the specified location.
 * @param {type} g The graphic context to use for drawing.
 * @param {type} x The x draw offset.
 * @param {type} y The y draw offset.
 */
Button.prototype.draw = function(g, x, y) {
    g.font = "20px Trade Winds";
    
    var drawGraphic = this.hovering ? this.hoverGraphic : this.defaultGraphic;
    var textColor = this.hovering ? this.hoverColor : this.defaultColor;
    
    
    drawGraphic.draw(g, x, y);
    
    var txtDim = g.measureText(this.label);
    
    g.fillStyle = textColor;
    g.fillText(this.label, x + (this.getBounds().width - txtDim.width) / 2, 
                           y + (this.getBounds().height + 18) / 2);
};

/**
 * Handles on mouse enter events.
 */
Button.prototype.onMouseEnter = function() {
    //Go to hover graphic
    this.hovering = true;
    new Audio('sound/Sound 1.wav').play();
};

/**
 * Handles on mouse leave events.
 */
Button.prototype.onMouseLeave = function() {
    //Go to default graphic
    this.hovering = false;
};

/**
 * Handles on mouse up events.
 * @param {Vector} location The location where the event occured on the button.
 */
Button.prototype.onMouseUp = function(location) {
    this.callback();
};

/**
 * Handles on mouse down events.
 * @param {Vector} location The location where the event occured on the button.
 */
Button.prototype.onMouseDown = function(location) {
};

/**
 * Gets the bounds of the button.
 * @returns {Rectnagle} The bounds of the button.
 */
Button.prototype.getBounds = function() {
    return this.defaultGraphic.getBounds();
};