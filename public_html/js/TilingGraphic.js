/**
 * Represents a graphic that is scaled by tiling it.
 */

/**
 * Creates a new Tiling Graphic
 * @param {type} srcGraphic The source graphic.
 * @param {type} width The width of the tiling graphic.
 * @param {type} height The height of the tiling graphic.
 * @returns {TilingGraphic}
 */

function TilingGraphic(srcGraphic, width, height) {
    this.srcGraphic = srcGraphic;
    
    this.width = width;
    this.height = height;
}

/**
 * Draws the tiled graphic to screen.
 * @param {Context2D} g Graphics context object through which to draw.
 * @param {Number} xOffset The draw offset
 * @param {Number} yOffset The draw offset
 */
TilingGraphic.prototype.draw = function(g, xOffset, yOffset) {
    var srcBounds = this.srcGraphic.getBounds();
    
    if(srcBounds.width === 0 || srcBounds.height === 0)
        return;
    
    for(var x = 0; x < this.width; x += srcBounds.width) {
        for(var y = 0; y < this.height; y += srcBounds.height) {
            this.srcGraphic.draw(g, x + xOffset, y + yOffset);
        }
    }
};

/**
 * Returns the bounds of the tiling graphic.
 * @returns {Rectangle} A rectangle representing the bounds of the tiling graphic.
 */
TilingGraphic.prototype.getBounds = function() {
    return new Rectangle(new Vector(0,0), this.width, this.height);
};