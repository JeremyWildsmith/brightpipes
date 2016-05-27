/**
 * SettingsButton class
 */

/**
 * Creates a settings gear button.
 * @param {type} callback The callback method to invoke when the button is pressed.
 * @returns {Button}
 */
function SettingsButton(callback) {
    this.graphic = new LoadingGraphic("gfx/gear.png", 0, 0);
    this.callback = callback;
}

/**
 * Draws the button through the specified graphic context at the specified location.
 * @param {type} g The graphic context to use for drawing.
 * @param {type} x The x draw offset.
 * @param {type} y The y draw offset.
 */
SettingsButton.prototype.draw = function(g, x, y) {
    this.graphic.draw(g, x, y);
};

/**
 * Handles on mouse enter events.
 */
SettingsButton.prototype.onMouseEnter = function() {
    new Audio('sound/Sound 1.wav').play();
};

/**
 * Handles on mouse leave events.
 */
SettingsButton.prototype.onMouseLeave = function() {
};

/**
 * Handles on mouse up events.
 * @param {Vector} location The location where the event occured on the button.
 */
SettingsButton.prototype.onMouseUp = function(location) {
    this.callback();
};

/**
 * Handles on mouse down events.
 * @param {Vector} location The location where the event occured on the button.
 */
SettingsButton.prototype.onMouseDown = function(location) {
};

/**
 * Gets the bounds of the button.
 * @returns {Rectnagle} The bounds of the button.
 */
SettingsButton.prototype.getBounds = function() {
    return this.graphic.getBounds();
};