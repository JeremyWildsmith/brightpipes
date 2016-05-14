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

Grid.prototype.getCellDimensions = function() {
    return this.cellDimensions;
};

Grid.prototype.validateLocation = function(location) {
    return (location.x >= 0 && location.y >= 0 &&
       location.x < this.gridWidth && location.y < this.gridHeight);
};

Grid.prototype.getPipe = function(location) {
   if(!this.validateLocation(location))
       return null;
   
   return this.pipes[location.x][location.y];
};

Grid.prototype.setPipe = function(location, pipe) { 
   if(!this.validateLocation(location))
       return null;
   
   this.clearPipe(location);
   
   this.pipes[location.x][location.y] = pipe;
   
   pipe.attach(this, location);
};

Grid.prototype.clearPipe = function(location) {
    if(this.pipes[location.x][location.y] !== null)
        this.pipes[location.x][location.y].detach();
    
   this.pipes[location.x][location.y] = null;
};

Grid.prototype.screenToGrid = function(location) {
    var translation = new Vector(location.x / this.cellDimensions, location.y / this.cellDimensions).floor();
    
    if(translation.x < 0 || translation.x > this.gridWidth ||
       translation.y < 0 || translation.y > this.gridHeight)
        throw "Specified coordinates are not inside screen bounds.";
    
    return translation;
};

Grid.prototype.gridToScreen = function(location) {
   return new Vector(location.x * this.cellDimensions, location.y * this.cellDimensions);
};

Grid.prototype.draw = function(g, x, y) {
    g.strokeStyle = "#000";
    g.lineWidth = 0.4;
    
    for(var xLoc = 0; xLoc < this.gridWidth; xLoc++) {   
        for(var yLoc = 0; yLoc < this.gridHeight; yLoc++) {
            
            g.beginPath();
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
            
            this.pipes[xLoc][yLoc].draw(g,
                            x + xLoc * this.cellDimensions + this.cellDimensions / 2,
                            y + yLoc * this.cellDimensions + this.cellDimensions / 2);
        }
    }
};

Grid.prototype.getBounds = function() {
    return new Rectangle(new Vector(0,0), this.gridWidth * this.cellDimensions, this.gridHeight * this.cellDimensions);
};

Grid.prototype.getFilledPipes = function() {
    var filledPipes = [];

    var pipes = this.getPipes();
    for(var i = 0; i < pipes.length; i++) {
        if(pipes[i] !== null && pipes[i].isFilled())
            filledPipes.push(pipes[i]);
    }
    
    return filledPipes;
};

/**
 * 
 * @returns Array of pipes that were filled in this pump cycle.
 */
Grid.prototype.pump = function() {
    
    var pipesFilledBeforePump = this.getFilledPipes();
    
    for(var xLoc = 0; xLoc < this.gridWidth; xLoc++) {   
        for(var yLoc = 0; yLoc < this.gridWidth; yLoc++) {
            var pipe = this.pipes[xLoc][yLoc];
            
            if(pipe !== null && pipe.isPump())
                pipe.fill(null);
        }
    }
    
    var pipesFilledAfterPump = this.getFilledPipes();
    var newPipesFilled = [];
    
    for(var i = 0; i < pipesFilledAfterPump.length; i++) {
        if(pipesFilledBeforePump.indexOf(pipesFilledAfterPump[i]) === -1)
            newPipesFilled.push(pipesFilledAfterPump[i]);
    }
    
    return newPipesFilled;

};

Grid.prototype.getPipes = function() {
    var pipes = [];
    
    for(var xLoc = 0; xLoc < this.gridWidth; xLoc++) {   
        for(var yLoc = 0; yLoc < this.gridHeight; yLoc++) {
            if(this.pipes[xLoc][yLoc] !== null)
                pipes.push(this.pipes[xLoc][yLoc]);
        }
    }
    
    return pipes;
}
