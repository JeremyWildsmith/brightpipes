/**
 * A graphic that can be used while it is loading.
 */

/**
 * Constructs a new LoadingGraphic object.
 * @param {type} path Path of graphic to be loaded and used.
 * @returns {LoadingGraphic}
 */
function LoadingGraphic(path, originX, originY) {
    this.gfx = new NullGraphic();
    
    var outer = this;
    new GraphicFactory().createFromFile(path, function(gfx) {
        outer.gfx = gfx;
    }, originX, originY);
};

/**
 * Draws NullGraphic, or the graphic if it has loaded.
 * @param {type} g The graphics context through which to draw image.
 * @param {type} x The draw offset.
 * @param {type} y The draw offset.
 * @returns {undefined}
 */
LoadingGraphic.prototype.draw = function(g, x, y) {
    this.gfx.draw(g, x, y);
};

/**
 * Returns the bounds of the graphic in its current state.
 * @returns {Rectangle} The bounds of the graphic.
 */
LoadingGraphic.prototype.getBounds = function() {
    return this.gfx.getBounds();
};