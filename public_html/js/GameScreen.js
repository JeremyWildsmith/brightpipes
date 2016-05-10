function GameScreen() {
    this.PUMP_INTERVAL = 20000;

    this.elapsedSinceLastPump = 0;

    this.grid = new Grid();

}

GameScreen.prototype.update = function (deltaTime) {
    this.elapsedSinceLastPump += deltaTime;
    
    if (this.elapsedSinceLastPump > PUMP_INTERVAL)
    {
        this.elapsedSinceLastPump = 0;
        this.grid.pump();
    }
};

GameScreen.prototype.draw = function (g, x, y) {

}
