/**
 * LeaderboardScreen handles all drawing and input related to the leaderboard screen.
 */

/**
 * Creates a new LeaderboardScreen
 * @param {type} width The width of the canvas
 * @param {type} height The height of the canvas
 * @param {type} screenController The screen controller
 */
function LeaderboardScreen(width, height, screenController) {
    this.CELL_DIMENSIONS = 50;

    this.SUBMIT_LOCATION = new Vector(0, 400);

    this.submitButton = new Button("Main Menu", function () {
        screenController.setScreen(new MenuScreen(width, height, screenController));
    });

    this.lastActiveControl = null;

    this.width = width;
    this.height = height;
    this.name = "";

    this.scores = [];

    var outer = this;
    
    var request = $.ajax({
        url: "rest/leaderboards/getScores.php",
        type: "GET"
    });

    request.done(function (msg) {
        outer.scores = JSON.parse(msg).scores;
    });
}

/**
 * Performs any update to the logic in this screen.
 * @param {type} deltaTime The time that has past since this method was last invoked.
 */
LeaderboardScreen.prototype.update = function (deltaTime) {

};

/**
 * Corrects the layout respective to the canvas size.
 */
LeaderboardScreen.prototype.correctLayout = function () {
    this.SUBMIT_LOCATION.x = ((this.width - this.submitButton.getBounds().width) / 2);
};

/**
 * Draws leaderboard screen.
 * @param {Context2D} g Graphics context object through which to draw.
 * @param {Number} x The draw offset
 * @param {Number} y The draw offset
 */
LeaderboardScreen.prototype.draw = function (g, x, y) {
    this.correctLayout();

    g.fillStyle = "#F4BF09";
    g.font = "60px Trade Winds";
    var text = "Leaderboard";
    var txtX = (this.width - g.measureText(text).width) / 2;
    g.fillText(text, x + txtX, 60);

    g.font = "20px Trade Winds";
    for (var i = 0; i < this.scores.length; i++) {
        var yOff = 100 + i * 30;
        var xOff = (this.width / 2);
        g.fillText(this.scores[i].name, x + xOff - 100, y + yOff);
        g.fillText(this.scores[i].score, x + xOff + 100, y + yOff);
    }

    this.submitButton.draw(g, x + this.SUBMIT_LOCATION.x, y + this.SUBMIT_LOCATION.y);

};

/**
 * On mouse down event handler.
 * @param {Vector} location Location of mouse cursor during event.
 */
LeaderboardScreen.prototype.onMouseDown = function (location) {
    this.onMouseMove(location);

    if (this.lastActiveControl !== null)
        this.lastActiveControl.onMouseDown(location);
};

/**
 * On mouse up event handler.
 * @param {Vector} location Location of mouse cursor during event.
 */
LeaderboardScreen.prototype.onMouseUp = function (location) {
    if (this.lastActiveControl !== null)
        this.lastActiveControl.onMouseUp(location);
};

/**
 * Handles mouse move events.
 * @param {type} location The current location of the mouse.
 */
LeaderboardScreen.prototype.onMouseMove = function (location) {
    var selectedControl = null;

    if (this.submitButton.getBounds().add(this.SUBMIT_LOCATION).contains(location))
        selectedControl = this.submitButton;

    if (selectedControl !== this.lastActiveControl) {
        if (this.lastActiveControl !== null)
            this.lastActiveControl.onMouseLeave();

        if (selectedControl !== null)
            selectedControl.onMouseEnter();
    }

    this.lastActiveControl = selectedControl;
};

/**
 * Handles key events for this screen.
 * @param {type} keyCode The key code for the key that was pressed.
 */
LeaderboardScreen.prototype.onKeyDown = function (keyCode) {

    //Backspace
    if (keyCode === 8 && this.name.length > 0 && this.name.length < 11) {
        this.name = this.name.slice(0, -1);
    } else if ((keyCode > 64 && keyCode < 91) ||
            (keyCode > 95 && keyCode < 112) ||
            (keyCode > 47 && keyCode < 58)) {
        this.name += String.fromCharCode(keyCode);
    }
};
