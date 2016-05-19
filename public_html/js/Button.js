function Button(label, callback) {
    this.defaultGraphic = new LoadingGraphic("gfx/btnUp.png", 0, 0);
    this.hoverGraphic = new LoadingGraphic("gfx/btnDown.png", 0, 0);
    this.label = label;
    this.callback = callback;
    this.hovering = false;
    this.hoverColor = "#DAAB08";
    this.defaultColor = "#F4BF09";
}

Button.prototype.draw = function(g, x, y) {
    g.font = "20px Showcard Gothic";
    
    var drawGraphic = this.hovering ? this.hoverGraphic : this.defaultGraphic;
    var textColor = this.hovering ? this.hoverColor : this.defaultColor;
    
    
    drawGraphic.draw(g, x, y);
    
    var txtDim = g.measureText(this.label);
    
    g.fillStyle = textColor;
    g.fillText(this.label, x + (this.getBounds().width - txtDim.width) / 2, 
                           y + (this.getBounds().height + 18) / 2);
};

Button.prototype.onMouseEnter = function() {
    //Go to hover graphic
    this.hovering = true;
};

Button.prototype.onMouseLeave = function() {
    //Go to default graphic
    this.hovering = false;
};

Button.prototype.onMouseUp = function(location) {
    this.callback();
};

Button.prototype.onMouseDown = function(location) {
};

Button.prototype.getBounds = function() {
    return this.defaultGraphic.getBounds();
};