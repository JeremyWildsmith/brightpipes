/**
 * A graphic that can be used while it is loading.
 */

/**
 * Constructs a new LoadingGraphic object.
 * @param {type} path Path of graphic to be loaded and used.
 * @returns {LoadingGraphic}
 */
function LoadingGraphic(path) {
    this.gfx = new NullGraphic();
    
    var outer = this;
    new GraphicFactory().createFromFile(path, function(gfx) {
        outer.gfx = gfx;
    });
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