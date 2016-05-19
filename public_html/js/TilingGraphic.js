function TilingGraphic(srcGraphic, width, height) {
    this.srcGraphic = srcGraphic;
    
    this.width = width;
    this.height = height;
}


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

TilingGraphic.prototype.getBounds = function() {
    return new Rectangle(new Vector(0,0), this.width, this.height);
};