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

/**
 * Tests whether the rectangle contains a specified vector.
 * @param {Vector} location Location to check against the rectangle.
 * @returns {Boolean} Whether the location is inside of the recangle.
 */
Rectangle.prototype.contains = function(location) {
    return (location.x >= this.location.x && 
            location.y >= this.location.y &&
            location.x < this.location.x + this.width &&
            location.y < this.location.y + this.height);
};

/**
 * Creates a new rectangle with the same width/height but offset by the specified location.
 * @param {type} location The location to offset the rectangle by.
 * @returns {Rectangle} A new rectangle of the same width/height but offset by the specified location.
 */
Rectangle.prototype.add = function(location) { 
    var location = this.location.add(location);
    
    return new Rectangle(location, this.width, this.height);
};