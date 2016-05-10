function Game(width, height)
{
    this.width = width;
    this.height = height;
    this.count = 0;
}

Game.prototype.draw = function(g, x, y) {
    
    g.clearRect(0, 0, this.width, this.height);
    
    g.fillStyle = "#000";
    g.rect(0, 0, this.width, this.height);
    g.stroke();
    
    g.fillStyle = "#000";
    g.fillText("Sup Bro!" + this.count, 50, 50);
};

Game.prototype.update = function(deltaTime) {
    this.count++;
};