/**
 * Represents a point in 2d space.
 */

/**
 * @param {type} x The x component of a vector.
 * @param {type} y The y component of a vector.
 */
function Vector(x, y) {
    this.x = x;
    this.y = y;
}

/**
 * Adds this vector to another vector and return the sum.
 * @param {type} vec The vector to add.
 * @returns {Vector} The sum of the two vectors.
 */
Vector.prototype.add = function(vec) {
    return new Vector(this.x + vec.x, this.y + vec.y);
};

/**
 * Gets the difference between two vectors.
 * @param {type} vec The vector to take the difference of.
 * @returns {Vector} The difference between the two vectors.
 */
Vector.prototype.difference = function(vec) {
    return new Vector(this.x - vec.x, this.y - vec.y);
};

/**
 * Returns a vector with all of its components floored.
 * @returns {Vector} Vector with all of its components floored.
 */
Vector.prototype.floor = function() {
    return new Vector(Math.floor(this.x), Math.floor(this.y));
};

/**
 * Scales a vectors components
 * @param {type} factor The factor to scale the components by.
 * @returns {Vector} The vector with its components scaled.
 */
Vector.prototype.scale = function(factor) { 
    return new Vector(this.x * factor, this.y * factor);
};

/**
 * Tests if a vector is equal to another vector.
 * @param {type} v The vector to test against.
 * @returns {Boolean} Whether the two vectors are equal.
 */
Vector.prototype.equals = function(v) {
    return this.x === v.x && v.y === this.y;
};

/**
 * Takes the inverse of the two vectors numbers.
 * @returns {Vector} The vector with its components inverted.
 */
Vector.prototype.inverse = function() {
    return new Vector(-this.x, -this.y);
};

/**
 * Returns the length of the vector.
 * @returns {Number} The length of the vector.
 */
Vector.prototype.getLength = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};