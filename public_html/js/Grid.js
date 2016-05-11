function Grid(cellDimensions) {
    this.GRID_WIDTH = 5;
    this.GRID_HEIGHT = 5;
    
    this.cellDimensions = cellDimensions;
    
    this.pipes = [];
    this.obstacles = [];
    
    for(var x = 0; x < this.GRID_WIDTH; x++) {
        this.pipes[x] = [];
        this.obstacles[x] = [];
        
        for(var y = 0; y < this.GRID_WIDTH; y++) {
            this.pipes[x][y] = null;
            this.obstacles[x][y] = null;
        }
    }
}

Grid.prototype.validateLocation = function(location) {
    if(location.x > this.GRID_WIDTH || location.y > this.GRID_HEIGHT ||
       location.x < 0 || location.y > 0)
   {
       throw "Provided location it outside of grid bounds.";
   }
};

Grid.prototype.getPipe = function(location) {
   validateLocation(location);
   return this.pipes[location.x][location.y];
};

Grid.prototype.setPipe = function(location, pipe) { 
   validateLocation(location);
   pipe.location = location;
   this.pipes[location.x, location.y] = pipe;
};

Grid.prototype.clearPipe = function(location) {
   this.pipes[location.x, location.y] = null;
};

Grid.prototype.draw = function(g, x, y) {
    g.strokeStyle = "#000";
    for(var xLoc = 0; xLoc < this.GRID_WIDTH; xLoc++) {   
        for(var yLoc = 0; yLoc < this.GRID_WIDTH; yLoc++) {
            g.rect(x + xLoc * this.cellDimensions,
                  y + yLoc * this.cellDimensions,
                  this.cellDimensions,
                  this.cellDimensions);
            
            g.stroke();
        }
    }
    
    for(var xLoc = 0; xLoc < this.GRID_WIDTH; xLoc++) {   
        for(var yLoc = 0; yLoc < this.GRID_WIDTH; yLoc++) {
            if(this.pipes[xLoc][yLoc] === null)
                continue;
            
            this.pipes[x][y].draw(g,
                            x + xLoc * this.cellDimensions + this.cellDimensions / 2,
                            y + yLoc * this.cellDimensions + this.cellDimensions / 2);
        }
    }
};