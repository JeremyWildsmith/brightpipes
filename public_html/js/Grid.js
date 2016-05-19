/*
 * Grid used to store an arrangement of pipes
 */

 /* @param {type} cellDimensions Dimensions of each grid cell
 * @param {type} gridWidth The grid width in cells
 * @param {type} gridHeight The grid height in cells.
 * @returns {Grid}
 */

function Grid(cellDimensions, gridWidth, gridHeight) {
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    
    this.cellDimensions = cellDimensions;
    
    this.pipes = [];
    
    for(var x = 0; x < this.gridWidth; x++) {
        this.pipes[x] = [];
        
        for(var y = 0; y < this.gridHeight; y++) {
            this.pipes[x][y] = null;
        }
    }
}

/**
 * @returns {Number} Cell dimensions 
 */
Grid.prototype.getCellDimensions = function() {
    return this.cellDimensions;
};

/**
 * Tests if a specified location is a valid grid location.
 * @param {type} location Location to test if valid
 * @returns {Boolean} Whether the specified grid location is valid.
 */
Grid.prototype.validateLocation = function(location) {
    return (location.x >= 0 && location.y >= 0 &&
       location.x < this.gridWidth && location.y < this.gridHeight);
};

/**
 * Gets a pipe at a specified grid location.
 * @param {type} location Location to retrieve pipe from
 * @returns {Grid.prototype@arr;@arr;pipes} Pipe at the specified location or
 * null if location is empty.
 */
Grid.prototype.getPipe = function(location) {
   if(!this.validateLocation(location))
       return null;
   
   return this.pipes[location.x][location.y];
};

/**
 * Sets the pipe at a specified location.
 * @param {type} location Location to place a pipe.
 * @param {type} pipe The pipe to place at the specified location.
 * @returns {unresolved}
 */
Grid.prototype.setPipe = function(location, pipe) { 
   if(!this.validateLocation(location))
       return null;
   
   this.clearPipe(location);
   
   this.pipes[location.x][location.y] = pipe;
   
   pipe.attach(this, location);
};

/**
 * Clears a pipe at a specified grid location.
 * @param {type} location Location at which to clear the pipe/contents of.
 */
Grid.prototype.clearPipe = function(location) {
    if(this.pipes[location.x][location.y] !== null)
        this.pipes[location.x][location.y].detach();
    
   this.pipes[location.x][location.y] = null;
};

/**
 * Translates a vector from screen space to grid space.
 * @param {type} location Location to be translated in grid space.
 * @returns {Vector|Grid.prototype.screenToGrid.translation} Translated location.
 */
Grid.prototype.screenToGrid = function(location) {
    var translation = new Vector(location.x / this.cellDimensions, location.y / this.cellDimensions).floor();
    
    if(translation.x < 0 || translation.x > this.gridWidth ||
       translation.y < 0 || translation.y > this.gridHeight)
        throw "Specified coordinates are not inside screen bounds.";
    
    return translation;
};

/**
 * Translates from grid space to screen space.
 * @param {type} location The location to translate to screen space.
 * @returns {Vector} The translated location.
 */
Grid.prototype.gridToScreen = function(location) {
   return new Vector(location.x * this.cellDimensions, location.y * this.cellDimensions);
};

/**
 * Draws the grid.
 * @param {type} g The graphic context through which to draw the grid.
 * @param {type} x The x draw offset.
 * @param {type} y The y draw offset.
 * @returns {undefined}
 */
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
        for(var yLoc = 0; yLoc < this.gridHeight; yLoc++) {
            if(this.pipes[xLoc][yLoc] === null)
                continue;
            
            this.pipes[xLoc][yLoc].draw(g,
                            x + xLoc * this.cellDimensions + this.cellDimensions / 2,
                            y + yLoc * this.cellDimensions + this.cellDimensions / 2);
        }
    }
};

/**
 * Gets the screen space bounds of grid.
 * @returns {Rectangle} The screen space bounds of grid.
 */
Grid.prototype.getBounds = function() {
    return new Rectangle(new Vector(0,0), this.gridWidth * this.cellDimensions, this.gridHeight * this.cellDimensions);
};

Grid.prototype.getCellBounds = function() {
    return new Rectangle(new Vector(0,0), this.gridWidth, this.gridHeight);
};

/**
 * Gets a list of all filled pipes in the grid.
 * @returns {Array|Grid.prototype.getFilledPipes.filledPipes} Filled pipes in the grid.
 */
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
        for(var yLoc = 0; yLoc < this.gridHeight; yLoc++) {
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

/**
 * Returns a list of all pipes in grid.
 * @returns {Array|Grid.prototype.getPipes.pipes} List of all pipes in grid.
 */
Grid.prototype.getPipes = function() {
    var pipes = [];
    
    for(var xLoc = 0; xLoc < this.gridWidth; xLoc++) {   
        for(var yLoc = 0; yLoc < this.gridHeight; yLoc++) {
            if(this.pipes[xLoc][yLoc] !== null)
                pipes.push(this.pipes[xLoc][yLoc]);
        }
    }
    
    return pipes;
};
