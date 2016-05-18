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

Vector.prototype.scale = function(factor) { 
    return new Vector(this.x * factor, this.y * factor);
};

Vector.prototype.equals = function(v) {
    return this.x === v.x && v.y === this.y;
};

Vector.prototype.inverse = function(v) {
    return new Vector(-this.x, -this.y);
};

Vector.prototype.getLength = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vector.prototype.randomStart = function() {
    var startValues = [[0,0],[0,1],[0,2],[0,3],[1,0],[2,0],[3,0],[3,1],[3,2],[3,3],[1,3],[2,3]];
    var randNum = Math.floor(Math.random() * 11);
    this.x = startValues[randNum][0];
    this.y = startValues[randNum][1];
};