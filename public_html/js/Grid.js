function Grid(cellDimensions, gridWidth, gridHeight) {
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    
    this.cellDimensions = cellDimensions;
    
    this.pipes = [];
    this.obstacles = [];
    
    for(var x = 0; x < this.gridWidth; x++) {
        this.pipes[x] = [];
        this.obstacles[x] = [];
        
        for(var y = 0; y < this.gridWidth; y++) {
            this.pipes[x][y] = null;
            this.obstacles[x][y] = null;
        }
    }
}

Grid.prototype.validateLocation = function(location) {
    if(location.x > this.gridWidth || location.y > this.gridHeight ||
       location.x < 0 || location.y > 0)
   {
       throw "Provided location it outside of grid bounds.";
   }
};

Grid.prototype.getPipe = function(location) {
   validateLocation(location);
   return this.pipes[location.x][location.y];
};

Grid.prototype.setPipe = function(pipe, location) { 
   validateLocation(location);
   
   clearPipe(location);
   
   this.pipes[location.x, location.y] = pipe;
   
   pipe.attach(this, location);
};

Grid.prototype.clearPipe = function(location) {
    
    if(this.pipes[location.x, location.y] !== null)
        this.pipes[location.x, location.y].detach();
    
   this.pipes[location.x, location.y] = null;
};

Grid.prototype.screenToGrid = function(location) {
    translation = new Vector(location.x / this.cellDimensions, location.y / this.cellDimensions);
    
    if(translation.x < 0 || translation.x > this.gridWidth ||
       translation.y < 0 || translation.y > this.gridHeight)
        throw "Specified coordinates are not inside screen bounds.";
    
    return translation;
};

Grid.prototype.draw = function(g, x, y) {
    g.strokeStyle = "#000";
    for(var xLoc = 0; xLoc < this.gridWidth; xLoc++) {   
        for(var yLoc = 0; yLoc < this.gridHeight; yLoc++) {
            g.rect(x + xLoc * this.cellDimensions,
                  y + yLoc * this.cellDimensions,
                  this.cellDimensions,
                  this.cellDimensions);
            
            g.stroke();
        }
    }
    
    for(var xLoc = 0; xLoc < this.gridWidth; xLoc++) {   
        for(var yLoc = 0; yLoc < this.gridWidth; yLoc++) {
            if(this.pipes[xLoc][yLoc] === null)
                continue;
            
            this.pipes[x][y].draw(g,
                            x + xLoc * this.cellDimensions + this.cellDimensions / 2,
                            y + yLoc * this.cellDimensions + this.cellDimensions / 2);
        }
    }
};

Grid.prototype.getBounds = function() {
    return new Rectangle(new Vector(0,0), this.gridWidth * this.cellDimensions, this.gridHeight * this.cellDimensions);
};