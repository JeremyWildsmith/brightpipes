function GameScreen() {
    this.PUMP_INTERVAL = 20000;
    this.CELL_DIMENSIONS = 50;
    
    this.GRID_LOCATION = new Vector(10, 55);
    this.PIPE_SELECTION_LOCATION = new Vector(33, 270);

    this.elapsedSinceLastPump = 0;

    this.grid = new Grid(this.CELL_DIMENSIONS, 4, 4);
    this.pipeSelection = new PipeSelectionQueue();
    
    this.draggingPipe = null;
    this.draggingLocation = new Vector(0, 0);
}

GameScreen.prototype.update = function (deltaTime) {
    this.elapsedSinceLastPump += deltaTime;
    
    if (this.elapsedSinceLastPump > this.PUMP_INTERVAL)
    {
        this.elapsedSinceLastPump = 0;
        this.grid.pump();
    }
};

GameScreen.prototype.draw = function (g, x, y) {
    g.font = "15px Arial";
    g.fillText("Next Pump In: " + Math.round((this.PUMP_INTERVAL - this.elapsedSinceLastPump) / 1000) + "s", 10, 15);  //missing the function that counts the score
    g.fillText("Number of pipes used: ", 10, 35); // missing the function that counts the number of pipes used

    this.grid.draw(g, this.GRID_LOCATION.x, this.GRID_LOCATION.y);
    this.pipeSelection.draw(g, 33, 270);
    
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
    this.draggingPipe = null;
};

GameScreen.prototype.onMouseMove = function(currentLocation) {
    if(this.draggingPipe !== null)
        this.draggingLocation = currentLocation;
};
