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

Button.prototype.mouseDown = function(location) {
    if (this.toggle) {
        this.toggle = false;
    } else {
        this.toggle = true;
    }
};

Button.protoype.getState = function() {
    return this.toggle;
};