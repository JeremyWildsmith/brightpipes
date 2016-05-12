function Game(width, height)
{
    this.width = width;
    this.height = height;
    this.count = 0;
    this.screen = new GameScreen(); 
}

Game.prototype.draw = function(g, x, y) {
    
    g.clearRect(0, 0, this.width, this.height);
    
    this.screen.draw(g, x, y);
};

Game.prototype.update = function(deltaTime) {
    this.count++;
    this.screen.update(deltaTime);
};