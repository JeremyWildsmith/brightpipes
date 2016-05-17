function Button(label, callback) {
    this.callback = callback;
}

Button.prototype.draw = function(g, x, y) {
    this.graphic.draw(g, x, y);
};

Button.prototype.mouseEnter = function() {
    //Go to hover graphic
};

Button.prototype.mouseLeave = function() {
    //Go to default graphic
};

Button.prototype.mouseDown = function(location) {
    this.callback();
};