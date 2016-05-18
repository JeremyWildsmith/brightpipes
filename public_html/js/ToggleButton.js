function Button(toggleOffGraphic, toggleOnGraphic) {
    this.toggleOffGraphic = toggleOffGraphic;
    this.toggleOnGraphic = toggleOnGraphic;
    this.toggle = true;
}

Button.prototype.draw = function(g, x, y) {
    if (this.toggle) {
        this.toggleOnGraphic.draw(g, x, y);
    } else {
        this.toggleOffGraphic.draw(g, x, y);
    }
};

Button.prototype.mouseEnter = function() {
    //Go to hover graphic
    this.hovering = true;
};

Button.prototype.mouseClick = function() {
    if (this.toggle) {
        this.toggle = false;
    } else {
        this.toggle = true;
    }
};