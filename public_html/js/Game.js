/**
 * 
 * @param {type} width
 * The game object manages and delegates render/control to
 * individual game screens.
 */

/**
 * Constructs a new game object
 * @param {Number} width The game canvas width
 * @param {Number} height the game canvas height
 * @returns {Game}
 */
function Game(width, height)
{
    this.width = width;
    this.height = height;
    this.screen = new GameScreen(); 
}

/**
 * Draws the current game screen.
 * @param {type} g Graphics context through which to draw.
 * @param {type} x Offset of draw operation
 * @param {type} y Offse of draw operation.
 */
Game.prototype.draw = function(g, x, y) {
    
    g.clearRect(0, 0, this.width, this.height);
    
    this.screen.draw(g, x, y);
};

/**
 * Updates logic for current game screen
 * @param {Number} deltaTime Delta from last update all in milliseconds
 */
Game.prototype.update = function(deltaTime) {
    this.screen.update(deltaTime);
};

/**
 * On mouse move event handler, passes to active screen.
 * @param {Vector} location Location of mouse cursor during event.
 */
Game.prototype.onMouseMove = function(location) {
    this.screen.onMouseMove(location);
};

/**
 * On mouse down event handler, passes to active screen.
 * @param {Vector} location Location of mouse cursor during event.
 */
Game.prototype.onMouseDown = function (location) {
    this.screen.onMouseDown(location);
};

/**
 * On mouse up event handler, passes to active screen.
 * @param {Vector} location Location of mouse cursor during event.
 */
Game.prototype.onMouseUp = function(location) {
    this.screen.onMouseUp(location);
};