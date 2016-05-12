function Rectangle(location, width, height) {
    this.location = location;
    this.width = width;
    this.height = height;
}

Rectangle.prototype.contains = function(location) {
    return (location.x > this.location && location.y > this.location &&
            location.x <= this.location.x + this.width &&
            location.y <= this.location.y + this.height);
};

Rectangle.prototype.add = function(location) { 
    this.location = this.location.add(location);
};