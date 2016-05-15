/**
 * Rectangle object.
 */

/**
 * 
 * @param {type} location as a vector
 * @param {type} width width of rectangle
 * @param {type} height heighto of rectangle.
 * @returns {Rectangle}
 */
function Rectangle(location, width, height) {
    this.location = location;
    this.width = width;
    this.height = height;
}

Rectangle.prototype.contains = function(location) {
    return (location.x >= this.location.x && 
            location.y > this.location.y &&
            location.x <= this.location.x + this.width &&
            location.y <= this.location.y + this.height);
};

Rectangle.prototype.add = function(location) { 
    var location = this.location.add(location);
    
    return new Rectangle(location, this.width, this.height);
};