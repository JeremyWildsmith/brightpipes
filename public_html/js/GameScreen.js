/**
 * Object represent the main game play screen.
 */

/**
 * @returns {GameScreen} A new GameScreen object.
 */
function GameScreen(width, height, screenController, drainLocation, score) {
    this.PUMP_INTERVAL = 3000;
    this.CELL_DIMENSIONS = 50;
    this.PIPES_PLACED_BEFORE_PLAY = 5;
    this.PASS_LEVEL_SCORE = 200;
    
    this.GRID_LOCATION = new Vector(30, 35);
    this.PIPE_SELECTION_LOCATION = new Vector(53, 300);

    this.playing = true;

    this.pipesPlaced = 0;

    this.elapsedSinceLastPump = this.PUMP_INTERVAL;

    this.pipeSelection = new PipeSelectionQueue();
    this.grid = new Grid(this.CELL_DIMENSIONS, 6, 7);

    this.drain = Pipes.Drain.create();
    this.pump = Pipes.Pump.create();

    this.GRID_LOCATION.x = (width - this.grid.getBounds().width) / 2;

    this.PIPE_SELECTION_LOCATION.x = (width - this.pipeSelection.getBounds().width) / 2;
    this.PIPE_SELECTION_LOCATION.y = this.GRID_LOCATION.y + this.grid.getBounds().height + 20;
    
    this.generateLevel(2, 7, drainLocation);

    this.draggingPipe = null;
    this.draggingLocation = new Vector(0, 0);

    this.newlyFilledPipes = [];

    this.fillPipeSelection();

    this.screenController = screenController;
    this.width = width;
    this.height = height;
    
    this.score = score === undefined ? 0 : score;
}

GameScreen.prototype.randomizePlacement = function(object) {
    object.detach();
    var gridBounds = this.grid.getCellBounds();
    
    var location;
    do {
        location = new Vector(Math.floor(Math.random() * gridBounds.width),
                                Math.floor(Math.random() * gridBounds.height));
    } while(this.grid.getPipe(location) !== null);
    
    this.grid.setPipe(location, object);
};

GameScreen.prototype.generateLevel = function(minDistance, maxDistance, drainLocation) {
    do {
        if(drainLocation === undefined)
            this.randomizePlacement(this.pump);
        else
            this.grid.setPipe(drainLocation, this.pump);
        
        this.randomizePlacement(this.drain);
    } while(!this.isLevelSolvable() ||
            this.pump.getLocation().difference(this.drain.getLocation()).getLength() > maxDistance ||
            this.pump.getLocation().difference(this.drain.getLocation()).getLength() < minDistance);
    
    var obstacles = Pipes.obstacles();
    
    for(var x = 0; x < 15; x++) {
        var obstacle = obstacles[Math.floor(Math.random() * obstacles.length)].create();
        do {
            this.randomizePlacement(obstacle);
        } while(!this.isLevelSolvable());    
    }
};

GameScreen.prototype.isLevelSolvable = function() {
    var pathFinder = new AStarPathFinder(this.grid);
    
    var start = this.pump.getLocation().add(this.pump.getDirections()[0].delta);
    
    return pathFinder.findPath(start, this.drain.getLocation()) !== null;
};

/**
 * Refreshes the pipe selection area with new pipes.
 */
GameScreen.prototype.refreshPipeSelection = function () {
    this.pipeSelection.clear();
    this.fillPipeSelection();
};

/**
 * Fills the pipe selection area with new pipes in open slots.
 */
GameScreen.prototype.fillPipeSelection = function () {
    
    //Count number of useable pipes in selection queue.
    var containedUseablePipe = 0;
    var containedPipes = this.pipeSelection.getPipes();
    for(var i = 0; i < containedPipes.length; i++) {
        if(this.isPipeUseable(containedPipes[i].type))
            containedUseablePipe++;
        
        console.log("Contained useable pipe: " + this.containedPipes[i].type.value);
    }
    
    var generatedPipes = [];

    //If there are no useable pipes, make sure we add one.
    if(containedUseablePipe === 0) {
        var pipe = this.getUsefulPipe();

        if(pipe !== null) {
            this.pipeSelection.pushPipe(pipe.create());
            generatedPipes.push(pipe);
        }
    }
    
    var pipes = Pipes.values();

    do {
        do {
            pipe = pipes[Math.floor(Math.random() * pipes.length)];
        } while(generatedPipes.indexOf(pipe) >= 0);
        
        generatedPipes.push(pipe);

    } while (this.pipeSelection.pushPipe(pipe.create()));
};

GameScreen.prototype.shiftInPipe = function () {
    var pipes = Pipes.values();
    
    //Count number of useable pipes in selection queue.
    var containedUseablePipe = 0;
    var containedPipes = this.pipeSelection.getPipes();
    
    //Start from 1, because 0 will be shifted out.
    for(var i = 1; i < containedPipes.length; i++) {
        if(this.isPipeUseable(containedPipes[i].type))
            containedUseablePipe++;
    }

    var pipe = pipes[Math.floor(Math.random() * pipes.length)];
    //If there are no useable pipes, make sure we add one.
    if(containedUseablePipe === 0) {
        var useful = this.getUsefulPipe();
        pipe = useful === null ? pipe : useful;
    }
    
    this.pipeSelection.shiftIn(pipe.create());
};

GameScreen.prototype.getUsefulPipe = function () {
    var pipes = Pipes.values();
    var pipe = null;

    for (var i = 0; i < 100; i++) {
        pipe = pipes[Math.floor(Math.random() * pipes.length)];
        if (this.isPipeUseable(pipe))
            return pipe;
    }
    
    return null;
};

GameScreen.prototype.isPipeUseable = function (pipeType) {
    var pipe = pipeType.create();
    pipe.fill(null);
    var starts = [];

    if (this.newlyFilledPipes.length > 0) {
        for (var i = 0; i < this.newlyFilledPipes.length; i++) {
            starts.push(this.newlyFilledPipes[i]);
        }
    } else
        starts.push(this.pump);

    var pathFinder = new AStarPathFinder(this.grid);

    for (var i = 0; i < starts.length; i++) {
        var drainDirections = this.getDrainDirections(starts[i]);

        for (var x = 0; x < drainDirections.length; x++) {
            var newLocation = starts[i].getLocation().add(drainDirections[x].delta);

            if (this.grid.getPipe(newLocation) !== null ||
                    !this.grid.getCellBounds().contains(newLocation))
                continue;

            this.grid.setPipe(newLocation, pipe);

            var n = null;
            //Check if pipe is connecting to the start point
            if (pipe.getConnections().indexOf(starts[i]) >= 0) {
                var newDrainDirections = this.getDrainDirections(pipe);
                for (var y = 0; y < newDrainDirections.length; y++) {
                    var testLocation = pipe.getLocation().add(newDrainDirections[i].delta);

                    if (!this.grid.getCellBounds().contains(testLocation))
                        continue;

                    n = pathFinder.findPath(pipe.getLocation().add(newDrainDirections[i].delta), this.drain.getLocation());

                    if (n !== null)
                        break;
                }
            }

            this.grid.clearPipe(newLocation);

            if (n !== null)
                return true;
        }
    }

    return false;
};

/**
 * Updates game screen logic. Controls pumping.
 * @param {Number} deltaTime The delta in milliseconds from last call to update.
 */
GameScreen.prototype.update = function (deltaTime) {
    this.searchForEasterEgg();

    if (!this.playing)
        return;

    var pipes = this.grid.getPipes();
    for (var i = 0; i < pipes.length; i++)
    {
        if (pipes[i].isLeaking() && pipes[i] !== this.drain && pipes[i] !== this.drain)
        {
            this.playing = false;
            this.screenController.setScreen(new GameOverScreen(this.width, this.height, this.screenController, this.score));
        }
    }

    if (this.pump.getConnections().length > 0 || this.pipesPlaced >= this.PIPES_PLACED_BEFORE_PLAY)
    {
        this.elapsedSinceLastPump += deltaTime;

        if (this.elapsedSinceLastPump > this.PUMP_INTERVAL)
        {
            this.elapsedSinceLastPump -= this.PUMP_INTERVAL;
            this.newlyFilledPipes = this.grid.pump();

            if (this.drain.isFilled()) {
                this.screenController.setScreen(new GameScreen(this.width, this.height, this.screenController, this.drain.getLocation(), this.score + this.PASS_LEVEL_SCORE - this.pipesPlaced * 10));
                this.playing = false;
            }
            
            this.shiftInPipe();
        }
    }
};

/**
 * Searches for the easter egg condition
 */
GameScreen.prototype.searchForEasterEgg = function () {
    var pipes = this.grid.getPipes();
    for (var i = 0; i < pipes.length; i++) {
        var pipe = pipes[i];

        if (pipe.type === Pipes.RightDown) {
            var right = this.grid.getPipe(pipe.getLocation().add(Direction.Right.delta));
            var down = this.grid.getPipe(pipe.getLocation().add(Direction.Down.delta));
            var accross = this.grid.getPipe(pipe.getLocation().add(Direction.Down.delta.add(Direction.Right.delta)));

            if (right === null || down === null || accross === null)
                continue;

            if (right.type === Pipes.LeftDown && down.type === Pipes.RightUp && accross.type === Pipes.LeftUp)
            {
                if (!pipe.isFilled()) {
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
    g.font = "15px Trade Winds";
    g.fillText("Number of pipes used: " + this.pipesPlaced, this.GRID_LOCATION.x, 23); // missing the function that counts the number of pipes used

    this.grid.draw(g, this.GRID_LOCATION.x + x, this.GRID_LOCATION.y + y);
    this.pipeSelection.draw(g, this.PIPE_SELECTION_LOCATION.x + x, this.PIPE_SELECTION_LOCATION.y + y);

    this.drawWater(g, x, y);

    if (this.draggingPipe !== null)
        this.draggingPipe.draw(g, x + this.draggingLocation.x, y + this.draggingLocation.y);

};

/**
 * On mouse down event handler, passes to active screen.
 * @param {Vector} location Location of mouse cursor during event.
 */
GameScreen.prototype.onMouseDown = function (location) {
    var selectionBounds = this.pipeSelection.getBounds().add(this.PIPE_SELECTION_LOCATION);

    if (selectionBounds.contains(location)) {
        var pipe = this.pipeSelection.popPipe(location.difference(this.PIPE_SELECTION_LOCATION));
        this.draggingPipe = pipe;
        this.draggingLocation = location;
    }
};

/**
 * On mouse up event handler, passes to active screen.
 * @param {Vector} location Location of mouse cursor during event.
 */
GameScreen.prototype.onMouseUp = function (location) {
    if (this.draggingPipe !== null) {
        var gridBounds = this.grid.getBounds().add(this.GRID_LOCATION);

        if (gridBounds.contains(location)) {
            var gridCoord = this.grid.screenToGrid(location.difference(this.GRID_LOCATION));

            var oldPipe = this.grid.getPipe(gridCoord);

            if (oldPipe !== null && !oldPipe.canReplace())
                this.pipeSelection.pushPipe(this.draggingPipe);
            else {
                this.grid.setPipe(gridCoord, this.draggingPipe);
                this.pipesPlaced++;
                this.shiftInPipe();
                
                this.draggingPipe = null;
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
GameScreen.prototype.onMouseMove = function (currentLocation) {
    if (this.draggingPipe !== null)
        this.draggingLocation = currentLocation;
};

/**
 * Draws game water.
 * @param {Context2D} g Graphics context object through which to draw.
 * @param {Number} x The draw offset
 * @param {Number} y The draw offset
 */

GameScreen.prototype.drawWater = function (g, x, y) {

    var pipes = this.grid.getPipes();

    for (var i = 0; i < pipes.length; i++)
        this.drawPipeWater(g, x, y, pipes[i]);
};

/**
 * Draws water effects for individual pipe.
 * @param {Context2D} g Graphics context object through which to draw.
 * @param {Number} x The draw offset
 * @param {Number} y The draw offset
 * @param {Pipe} pipe The pipe to draw water effects for.
 */
GameScreen.prototype.drawPipeWater = function (g, x, y, pipe) {
    if (!pipe.isFilled() || pipe.type === Pipes.Pump)
        return;

    var inProgression = Math.min(1.0, this.elapsedSinceLastPump / (this.PUMP_INTERVAL / 2));
    var outProgression = Math.max(0, this.elapsedSinceLastPump / (this.PUMP_INTERVAL / 2) - inProgression);

    if (this.newlyFilledPipes.indexOf(pipe) === -1)
        inProgression = outProgression = 1.0;

    var pipeCentreLocation = this.GRID_LOCATION.add(this.grid.gridToScreen(pipe.getLocation().add(new Vector(0.5, 0.5))));

    var fillDirections = this.getFillDirections(pipe);
    var drainDirections = this.getDrainDirections(pipe);

    g.lineWidth = 8;
    g.strokeStyle = "#003399";

    for (var i = 0; i < fillDirections.length; i++) {
        var start = pipeCentreLocation.add(fillDirections[i].delta.scale(this.grid.getCellDimensions() / 2));
        var end = pipeCentreLocation.add(fillDirections[i].delta.inverse().scale(g.lineWidth / 2));
        var diff = end.difference(start);
        var current = start.add(diff.scale(inProgression));

        g.beginPath();
        g.moveTo(start.x, start.y);
        g.lineTo(current.x, current.y);
        g.stroke();
    }

    for (var i = 0; i < drainDirections.length; i++) {
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
GameScreen.prototype.getFillDirections = function (pipe) {
    var connections = pipe.getConnections(null);
    var fillDirections = [];

    for (var i = 0; i < connections.length; i++) {
        if (connections[i].isFilled()) {
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
GameScreen.prototype.getDrainDirections = function (pipe) {
    var fillDirections = this.getFillDirections(pipe);
    var allDirections = pipe.getDirections();
    var drainDirections = [];

    for (var i = 0; i < allDirections.length; i++)
    {
        if (fillDirections.indexOf(allDirections[i]) === -1)
            drainDirections.push(allDirections[i]);
    }

    return drainDirections;
};

GameScreen.prototype.onKeyDown = function(keyCode) {
    
};