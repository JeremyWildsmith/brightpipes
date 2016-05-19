/**
 * Object represent the main game play screen.
 */

/**
 * @returns {GameScreen} A new GameScreen object.
 */
function GameScreen(width, height) {
    this.PUMP_INTERVAL = 5000;
    this.CELL_DIMENSIONS = 50;
    
    this.GRID_LOCATION = new Vector(30, 35);
    this.PIPE_SELECTION_LOCATION = new Vector(53, 300);
    
    this.playing = true;

    this.pipesPlaced = 0;

    this.elapsedSinceLastPump = this.PUMP_INTERVAL;

    this.pipeSelection = new PipeSelectionQueue();
    this.grid = new Grid(this.CELL_DIMENSIONS, 
                Math.min(10, Math.floor((width) / this.CELL_DIMENSIONS)), 
                Math.min(10, Math.floor((height - 300) / this.CELL_DIMENSIONS)));
        
    this.drain = Pipes.Drain.create();
    this.pump = Pipes.Pump.create();
    
    this.GRID_LOCATION.x = (width - this.grid.getBounds().width) / 2;
    
    this.PIPE_SELECTION_LOCATION.x = (width - this.pipeSelection.getBounds().width) / 2;
    this.PIPE_SELECTION_LOCATION.y = this.GRID_LOCATION.y + this.grid.getBounds().height + 20;
    
    //var pumpVector = new Vector();
    //var drainVector = new Vector();
    //pumpVector.randomStart();
    //drainVector.randomStart();
    
    //while (pumpVector === drainVector) {
    //    var drainVector = Vector.randomStart();
    //}
    
    this.grid.setPipe(new Vector(0, 0), this.pump);
    this.grid.setPipe(new Vector(2, 1), this.drain);
    this.grid.setPipe(new Vector(1,2), Pipes.Obstacle.create());
    this.grid.setPipe(new Vector(2,2), Pipes.Obstacle.create());
    this.grid.setPipe(new Vector(3,2), Pipes.Obstacle.create());
    
    this.draggingPipe = null;
    this.draggingLocation = new Vector(0, 0);
    
    this.newlyFilledPipes = [];
    
    this.fillPipeSelection();
    
    this.grassTiles = new TilingGraphic(new LoadingGraphic("gfx/grassTile.png", 0, 0), width, 50);
    this.dirtTiles = new TilingGraphic(new LoadingGraphic("gfx/dirtTile.png", 0, 0), width, height);
}

/**
 * Refreshes the pipe selection area with new pipes.
 */
GameScreen.prototype.refreshPipeSelection = function() {
    this.pipeSelection.clear();
    this.fillPipeSelection();
};

/**
 * Fills the pipe selection area with new pipes in open slots.
 */
GameScreen.prototype.fillPipeSelection = function() {
    var pipes = Pipes.values();
    
    var generatedPipes = [];
    
    var pipe = null;
    
    do {
        pipe = this.getUsefulPipe();
        if(pipe === null)
            break;
    } while(this.pipeSelection.pushPipe(pipe.create()));
};

GameScreen.prototype.getUsefulPipe = function() {
    var pathFinder = new AStarPathFinder(this.grid);
    
    var start = this.newlyFilledPipes.length === 0 ? this.pump.getLocation() : this.newlyFilledPipes[0].getLocation();
    
    var pipes = pathFinder.findPath(start, this.drain.getLocation()).getPipes();
    
    return pipes[0];
};

/**
 * Updates game screen logic. Controls pumping.
 * @param {Number} deltaTime The delta in milliseconds from last call to update.
 */
GameScreen.prototype.update = function (deltaTime) {
    this.searchForEasterEgg();
    
    if(!this.playing)
        return;
    
    var pipes = this.grid.getPipes();
    for(var i = 0; i < pipes.length; i++)
    {
        if(pipes[i].isLeaking() && pipes[i] !== this.drain && pipes[i] !== this.drain)
        {
            alert("Your pipes are leaking. You lost this level!");
            this.playing = false;
            return;
        }
    }
    
    if(this.pump.getConnections().length > 0)
    {
        this.elapsedSinceLastPump += deltaTime;
    
        if (this.elapsedSinceLastPump > this.PUMP_INTERVAL)
        {
            this.elapsedSinceLastPump -= this.PUMP_INTERVAL;
            this.newlyFilledPipes = this.grid.pump();

            if(this.drain.isFilled()) {
                alert("You beat this level!");
                this.playing = false;
            }

            this.draggingPipe = null;
            this.refreshPipeSelection();
            this.fillPipeSelection();
        }
    }
};

/**
 * Searches for the easter egg condition
 */
GameScreen.prototype.searchForEasterEgg = function() {
    var pipes = this.grid.getPipes();
    for(var i = 0; i < pipes.length; i++) {
        var pipe = pipes[i];
        
        if(pipe.type === Pipes.RightDown) {
            var right = this.grid.getPipe(pipe.getLocation().add(Direction.Right.delta));
            var down = this.grid.getPipe(pipe.getLocation().add(Direction.Down.delta));
            var accross = this.grid.getPipe(pipe.getLocation().add(Direction.Down.delta.add(Direction.Right.delta)));

            if(right === null || down === null || accross === null)
                continue;
            
            if(right.type === Pipes.LeftDown && down.type === Pipes.RightUp && accross.type === Pipes.LeftUp)
            {
                if(!pipe.isFilled()) {
                    pipe.setAsPump();
                }
            }
        }
    }
};

/**
 * Draws game screen.
 * @param {Context2D} g Graphics context object through which to draw.
 * @param {Number} x The draw offset
 * @param {Number} y The draw offset
 */
GameScreen.prototype.draw = function (g, x, y) {
    this.dirtTiles.draw(g, x, y);
    this.grassTiles.draw(g, x, y);
    
    g.font = "15px Trade Winds";
    g.fillText("Number of pipes used: " + this.pipesPlaced, this.GRID_LOCATION.x, 23); // missing the function that counts the number of pipes used

    this.grid.draw(g, this.GRID_LOCATION.x + x, this.GRID_LOCATION.y + y);
    this.pipeSelection.draw(g, this.PIPE_SELECTION_LOCATION.x + x, this.PIPE_SELECTION_LOCATION.y + y);
    
    this.drawWater(g, x, y);
    
    if(this.draggingPipe !== null)
        this.draggingPipe.draw(g, x + this.draggingLocation.x, y + this.draggingLocation.y);
    
};

/**
 * On mouse down event handler, passes to active screen.
 * @param {Vector} location Location of mouse cursor during event.
 */
GameScreen.prototype.onMouseDown = function(location) {
    var selectionBounds = this.pipeSelection.getBounds().add(this.PIPE_SELECTION_LOCATION);
    
    if(selectionBounds.contains(location)) {
        var pipe = this.pipeSelection.popPipe(location.difference(this.PIPE_SELECTION_LOCATION));
        this.draggingPipe = pipe;
        this.draggingLocation = location;
    }
};

/**
 * On mouse up event handler, passes to active screen.
 * @param {Vector} location Location of mouse cursor during event.
 */
GameScreen.prototype.onMouseUp = function(location) {
    if(this.draggingPipe !== null) {
        var gridBounds = this.grid.getBounds().add(this.GRID_LOCATION);
        
        if(gridBounds.contains(location)) {
            var gridCoord = this.grid.screenToGrid(location.difference(this.GRID_LOCATION));
            
            var oldPipe = this.grid.getPipe(gridCoord);
 
            if(oldPipe !== null && !oldPipe.canReplace())
                this.pipeSelection.pushPipe(this.draggingPipe);
            else {
                this.grid.setPipe(gridCoord, this.draggingPipe);
                this.pipesPlaced++;
            }
        } else
            this.pipeSelection.pushPipe(this.draggingPipe);
    }
    
    this.draggingPipe = null;
};

/**
 * On mouse move event handler, passes to active screen.
 * @param {Vector} currentLocation - location of mouse cursor during event.
 */
GameScreen.prototype.onMouseMove = function(currentLocation) {
    if(this.draggingPipe !== null)
        this.draggingLocation = currentLocation;
};

/**
 * Draws game water.
 * @param {Context2D} g Graphics context object through which to draw.
 * @param {Number} x The draw offset
 * @param {Number} y The draw offset
 */

GameScreen.prototype.drawWater = function(g, x, y) {
    
    var pipes = this.grid.getPipes();
    
    for(var i = 0; i < pipes.length; i++)
        this.drawPipeWater(g, x, y, pipes[i]);
};

/**
 * Draws water effects for individual pipe.
 * @param {Context2D} g Graphics context object through which to draw.
 * @param {Number} x The draw offset
 * @param {Number} y The draw offset
 * @param {Pipe} pipe The pipe to draw water effects for.
 */
GameScreen.prototype.drawPipeWater = function(g, x, y, pipe) {
    if(!pipe.isFilled() || pipe.type === Pipes.Pump)
        return;
    
    var inProgression = Math.min(1.0, this.elapsedSinceLastPump / (this.PUMP_INTERVAL / 2));
    var outProgression = Math.max(0, this.elapsedSinceLastPump / (this.PUMP_INTERVAL / 2) - inProgression);
    
    if(this.newlyFilledPipes.indexOf(pipe) === -1)
        inProgression = outProgression = 1.0;
    
    var pipeCentreLocation = this.GRID_LOCATION.add(this.grid.gridToScreen(pipe.getLocation().add(new Vector(0.5, 0.5))));
    
    var fillDirections = this.getFillDirections(pipe);
    var drainDirections = this.getDrainDirections(pipe);

    g.lineWidth = 8;
    g.strokeStyle = "#003399";

    for(var i = 0; i < fillDirections.length; i++) {
        var start = pipeCentreLocation.add(fillDirections[i].delta.scale(this.grid.getCellDimensions() / 2));
        var end = pipeCentreLocation.add(fillDirections[i].delta.inverse().scale(g.lineWidth / 2));
        var diff = end.difference(start);
        var current = start.add(diff.scale(inProgression));
        
        g.beginPath();
        g.moveTo(start.x, start.y);
        g.lineTo(current.x, current.y);
        g.stroke();
    }
    
    for(var i = 0; i < drainDirections.length; i++) {
        var start = pipeCentreLocation;
        var end = pipeCentreLocation.add(drainDirections[i].delta.scale(this.grid.getCellDimensions() / 2));
        var diff = end.difference(start);
        
        var current = start.add(diff.scale(outProgression));
        
        g.beginPath();
        g.moveTo(start.x, start.y);
        g.lineTo(current.x, current.y);
        g.stroke();
    }
    
    g.beginPath();
};

/**
 * Gets directions respective to pipe that the pipe is being filled through
 * @param {Pipe} pipe
 * @returns {Array|GameScreen.prototype.getFillDirections.fillDirections}
 */
GameScreen.prototype.getFillDirections = function(pipe) {
    var connections = pipe.getConnections(null);
    var fillDirections = [];
    
    for(var i = 0; i < connections.length; i++) {
        if(connections[i].isFilled()) {
            var delta = connections[i].getLocation().difference(pipe.getLocation());
            fillDirections.push(Direction.fromVector(delta));
        }
    }
    
    return fillDirections;
};

/**
 * Gets directions in respect to pipe of where the pipe is draining to.
 * @param {Pipe} pipe
 * @returns {Array|GameScreen.prototype.getDrainDirections.drainDirections}
 */
GameScreen.prototype.getDrainDirections = function(pipe) {
    var fillDirections = this.getFillDirections(pipe);
    var allDirections = pipe.getDirections();
    var drainDirections = [];
    
    for(var i = 0; i < allDirections.length; i++)
    {
        if(fillDirections.indexOf(allDirections[i]) === -1)
            drainDirections.push(allDirections[i]);
    }
    
    return drainDirections;
};