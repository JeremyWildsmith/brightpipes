function GameScreen() {
    this.PUMP_INTERVAL = 5000;
    this.CELL_DIMENSIONS = 50;
    
    this.GRID_LOCATION = new Vector(10, 55);
    this.PIPE_SELECTION_LOCATION = new Vector(33, 270);
    
    this.playing = true;

    this.elapsedSinceLastPump = this.PUMP_INTERVAL;

    this.grid = new Grid(this.CELL_DIMENSIONS, 4, 4);
    this.pipeSelection = new PipeSelectionQueue();
        
    this.drain = Pipes.Drain.create();
    this.pump = Pipes.Pump.create();
    
    this.grid.setPipe(new Vector(1,0), this.pump);
    this.grid.setPipe(new Vector(3,3), this.drain);
    
    this.draggingPipe = null;
    this.draggingLocation = new Vector(0, 0);
    
    this.newlyFilledPipes = [];
    
    this.fillPipeSelection();
}

GameScreen.prototype.refreshPipeSelection = function() {
    this.pipeSelection.clear();
    this.fillPipeSelection();
};

GameScreen.prototype.fillPipeSelection = function() {
    var pipes = Pipes.values();
    
    var generatedPipes = [];
    
    var pipe = null;
    
    do {
        do {
            pipe = pipes[Math.floor(Math.random()*pipes.length)];
        } while(generatedPipes.indexOf(pipe) !== -1);
        
        generatedPipes.push(pipe);
    } while(this.pipeSelection.pushPipe(pipe.create()));
};

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

GameScreen.prototype.searchForEasterEgg = function() {
    var pipes = this.grid.getPipes();
    for(var i = 0; i < pipes.length; i++) {
        var pipe = pipes[i];
        
        if(pipe.type === Pipes.RightDown) {
            var right = this.grid.getPipe(pipe.getLocation().add(Direction.Right.delta));
            var down = this.grid.getPipe(pipe.getLocation().add(Direction.Down.delta));
            var accross = this.grid.getPipe(pipe.getLocation().add(Direction.Down.delta.add(Direction.Right.delta)));

            if(right === null || down === null || accross === null)
                return;
            
            if(right.type === Pipes.LeftDown && down.type === Pipes.RightUp && accross.type === Pipes.LeftUp)
            {
                if(!pipe.isFilled()) {
                    pipe.setAsPump();
                }
            }
        }
    }
};

GameScreen.prototype.draw = function (g, x, y) {
    g.font = "15px Arial";
    g.fillText("Number of pipes used: ", 10, 35); // missing the function that counts the number of pipes used

    this.grid.draw(g, this.GRID_LOCATION.x, this.GRID_LOCATION.y);
    this.pipeSelection.draw(g, 33, 270);
    
    this.drawWater(g, x, y);
    
    if(this.draggingPipe !== null)
        this.draggingPipe.draw(g, x + this.draggingLocation.x, y + this.draggingLocation.y);
    
};

GameScreen.prototype.onMouseDown = function(location) {
    var selectionBounds = this.pipeSelection.getBounds().add(this.PIPE_SELECTION_LOCATION);
    
    if(selectionBounds.contains(location)) {
        var pipe = this.pipeSelection.popPipe(location.difference(this.PIPE_SELECTION_LOCATION));
        this.draggingPipe = pipe;
        this.draggingLocation = location;
    }
};

GameScreen.prototype.onMouseUp = function(location) {
    if(this.draggingPipe !== null) {
        var gridBounds = this.grid.getBounds().add(this.GRID_LOCATION);
        
        if(gridBounds.contains(location)) {
            var gridCoord = this.grid.screenToGrid(location.difference(this.GRID_LOCATION));
            
            var oldPipe = this.grid.getPipe(gridCoord);
 
            if(oldPipe !== null && oldPipe.isFilled())
                this.pipeSelection.pushPipe(this.draggingPipe);
            else
                this.grid.setPipe(gridCoord, this.draggingPipe);
        } else
            this.pipeSelection.pushPipe(this.draggingPipe);
    }
    
    this.draggingPipe = null;
};

GameScreen.prototype.onMouseMove = function(currentLocation) {
    if(this.draggingPipe !== null)
        this.draggingLocation = currentLocation;
};

GameScreen.prototype.drawWater = function(g, x, y) {
    
    var pipes = this.grid.getPipes();
    
    for(var i = 0; i < pipes.length; i++)
        this.drawPipeWater(g, x, y, pipes[i]);
};

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
    g.strokeStyle = "#60AFFF";

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