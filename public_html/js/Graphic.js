function Graphic(srcImage, originX, originY, srcX, srcY, width, height) {
    this.srcImage = srcImage;
    
    this.originX = originX;
    this.originY = originY;
   
    this.srcX = srcX;
    this.srcY = srcY;
    
    this.width = width;
    this.height = height;
}

Graphic.prototype.draw = function(g, x, y) {
    g.drawImage(this.srcImage,
                this.srcX, this.srcY,
                this.width, this.height, 
                x - this.originX, y - this.originY,
                this.width, this.height);
};