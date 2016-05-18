function Button(defaultGraphic, hoverGraphic, label, callback) {
    this.defaultGraphic = defaultGraphic;
    this.hoverGraphic = hoverGraphic;
    this.label = label;
    this.callback = callback;
    this.hovering = false;
}

Button.prototype.draw = function(g, x, y) {
    g.font = "15px Arial";
    g.fillText(label, x, y);
    
    if (this.hovering) {
        this.hoverGraphic.draw(g, x, y);
    } else {
        this.defaultGraphic.draw(g, x, y);
    }
};

Button.prototype.mouseEnter = function() {
    //Go to hover graphic
    this.hovering = true;
};

Button.prototype.mouseLeave = function() {
    //Go to default graphic
    this.hovering = false;
};

Button.prototype.mouseDown = function(location) {
    this.callback();
};