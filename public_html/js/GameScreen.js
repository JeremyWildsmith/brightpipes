function GameScreen() {
    this.PUMP_INTERVAL = 20000;
    this.CELL_DIMENSIONS = 40;

    this.elapsedSinceLastPump = 0;

    this.grid = new Grid(this.CELL_DIMENSIONS, 5, 5);
    this.pipeSelection = new PipeSelectionQueue();
    

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

    this.grid.draw(g, 10, 55);
    this.pipeSelection.draw(g, 10, 270);

};

