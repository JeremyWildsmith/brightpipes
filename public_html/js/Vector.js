function Vector(x, y) {
    this.x = x;
    this.y = y;
}

Vector.prototype.add = function(vec) {
    return new Vector(this.x + vec.x, this.y + vec.y);
};

Vector.prototype.difference = function(vec) {
    return new Vector(this.x - vec.x, this.y - vec.y);
};

Vector.prototype.floor = function() {
    return new Vector(Math.floor(this.x), Math.floor(this.y));
};

Vector.prototype.equals = function(v) {
    return this.x === v.x && v.y === this.y;
};