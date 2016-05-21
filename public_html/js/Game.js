/**
 * The game object manages and delegates render/control to
 * individual game screens.
 */

/**
 * Constructs a new game object
 * @param {Number} width The game canvas width
 * @param {Number} height the game canvas height
 */
function Game(width, height)
{
    this.width = width;
    this.height = height;
    this.screen = new MenuScreen(width, height, this); 
    
    this.grassTiles = new TilingGraphic(new LoadingGraphic("gfx/grassTile.png", 0, 0), width, 50);
    this.dirtTiles = new TilingGraphic(new LoadingGraphic("gfx/dirtTile.png", 0, 0), width, height);
}

/**
 * Sets the active game screen.
 * @param {type} screen The screen to make the new active game screen.
 */
Game.prototype.setScreen = function(screen) {
    this.screen = screen;
};

/**
 * Draws the current game screen.
 * @param {type} g Graphics context through which to draw.
 * @param {type} x Offset of draw operation
 * @param {type} y Offse of draw operation.
 */
Game.prototype.draw = function(g, x, y) {
    
    g.clearRect(0, 0, this.width, this.height);
    this.dirtTiles.draw(g, x, y);
    this.grassTiles.draw(g, x, y);

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
 * On mouse up event handler, passed to active screen.
 * @param {Vector} location Location of mouse cursor during event.
 */
Game.prototype.onMouseUp = function(location) {
    this.screen.onMouseUp(location);
};

/**
 * On key down event handler, passed to active screen.
 * @param {type} keyCode The key-code of key that was pressed down.
 */
Game.prototype.onKeyDown = function(keyCode) {
    return this.screen.onKeyDown(keyCode);
};