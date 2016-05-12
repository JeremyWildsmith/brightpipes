function LoadingGraphic(path) {
    this.gfx = new NullGraphic();
    
    var outer = this;
    new GraphicFactory().createFromFile(path, function(gfx) {
        outer.gfx = gfx;
    });
};

LoadingGraphic.prototype.draw = function(g, x, y) {
    this.gfx.draw(g, x, y);
};