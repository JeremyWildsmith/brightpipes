/**
 * Represent a image to be drawn to the screne.
 * @param {Image} srcImage Source Image object
 * @param {Number} originX Centre of image to draw
 * @param {Number} originY Centre of image to draw
 * @param {Number} srcX Source x coordinate from srcImage
 * @param {Number} srcY Source y coordinate from srcImage
 * @param {Number} width Width of image.
 * @param {Number} height Height of image.
 * @returns {Graphic}
 */
function Graphic(srcImage, originX, originY, srcX, srcY, width, height) {
    this.srcImage = srcImage;
    
    this.originX = originX;
    this.originY = originY;
   
    this.srcX = srcX;
    this.srcY = srcY;
    
    this.width = width;
    this.height = height;
}

/**
 * Draws the image via the specified graphic context.
 * @param {type} g The graphics context through which to draw this image.
 * @param {type} x The x draw offset.
 * @param {type} y The y draw offset.
 * @returns {undefined}
 */
Graphic.prototype.draw = function(g, x, y) {
    g.drawImage(this.srcImage,
                this.srcX, this.srcY,
                this.width, this.height, 
                x - this.originX, y - this.originY,
                this.width, this.height);
};