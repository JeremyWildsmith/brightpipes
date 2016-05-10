function Game(width, height)
{
    this.width = width;
    this.height = height;
    this.count = 0;
    
    this.test = new NullGraphic();
    var outer = this;
    new GraphicFactory().createFromFile("gfx/test.jpg", function(gfx) { 
        outer.test = gfx;
    });
}

Game.prototype.draw = function(g, x, y) {
    
    g.clearRect(0, 0, this.width, this.height);
    
    g.fillStyle = "#000";
    g.rect(0, 0, this.width, this.height);
    g.stroke();
    
    g.fillStyle = "#000";
    g.fillText("Sup Bro!" + this.count, 50, 50);
    this.test.draw(g, x + 25, y + 25);
};

Game.prototype.update = function(deltaTime) {
    this.count++;
};