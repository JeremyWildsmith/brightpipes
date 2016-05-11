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
    var canvas = document.getElementById("mainCanvas");
    g.font = "15px Arial";
    g.fillText("Score: ", 10, 100);  //missing the function that counts the score
    g.fillText("Number of pipes used: ", 10, 120); // missing the function that counts the number of pipes used
};

