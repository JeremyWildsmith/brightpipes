/**
 * SubmitScoreScreen handles all drawing and input related to the submit score screen.
 */

/**
 * Creates a new SubmitScoreScreen
 * @param {type} width The width of the canvas
 * @param {type} height The height of the canvas
 * @param {type} screenController The screen controller
 * @param {type} score The score of the user entering this screen.
 */
function SubmitScoreScreen(width, height, screenController, score) {
    this.CELL_DIMENSIONS = 50;

    this.SUBMIT_LOCATION = new Vector(0, 385);

    var outer = this;
    this.submitButton = new Button("Submit Score", function () {
        var request = $.ajax({
            url: "rest/leaderboards/insertScore.php",
            type: "GET",
            data: {name: outer.name, score: score, level: 0, rand: Math.random()}
        });
        
        outer.submitButton.label = "Submitting...";

        request.done(function (msg) {
            screenController.setScreen(new LeaderboardScreen(width, height, screenController));
        });
    });

    this.lastActiveControl = null;

    this.width = width;
    this.height = height;
    this.score = score;
    this.name = "";
}

/**
 * Performs any update to the logic in this screen.
 * @param {type} deltaTime The time that has past since this method was last invoked.
 */
SubmitScoreScreen.prototype.update = function (deltaTime) {

};

/**
 * Corrects the layout respective to the canvas size.
 */
SubmitScoreScreen.prototype.correctLayout = function () {
    this.SUBMIT_LOCATION.x = ((this.width - this.submitButton.getBounds().width) / 2);
};

/**
 * Draws game screen.
 * @param {Context2D} g Graphics context object through which to draw.
 * @param {Number} x The draw offset
 * @param {Number} y The draw offset
 */
SubmitScoreScreen.prototype.draw = function (g, x, y) {
    this.correctLayout();

    g.fillStyle = "#F4BF09";
    g.font = "60px Trade Winds";
    var text = "Game Over!";
    var txtX = (this.width - g.measureText(text).width) / 2;
    g.fillText(text, x + txtX, 60);

    g.font = "40px Trade Winds";
    text = "Final Score: " + this.score;
    txtX = (this.width - g.measureText(text).width) / 2;
    g.fillText(text, x + txtX, 200);

    g.font = "30px Trade Winds";
    text = "Player Name: ";
    txtX = (this.width - g.measureText(text).width) / 2;
    g.fillText(text, x + txtX, 300);

    g.font = "20px Trade Winds";
    text = this.name.length === 0 ? "TYPE NAME" : this.name;
    txtX = (this.width - g.measureText(text).width) / 2;

    g.fillText(text, x + txtX, 350);

    this.submitButton.draw(g, x + this.SUBMIT_LOCATION.x, y + this.SUBMIT_LOCATION.y);

};

/**
 * On mouse down event handler.
 * @param {Vector} location Location of mouse cursor during event.
 */
SubmitScoreScreen.prototype.onMouseDown = function (location) {
    this.onMouseMove(location);

    if (this.lastActiveControl !== null)
        this.lastActiveControl.onMouseDown(location);
};

/**
 * On mouse up event handler, passes to active screen.
 * @param {Vector} location Location of mouse cursor during event.
 */
SubmitScoreScreen.prototype.onMouseUp = function (location) {
    if (this.lastActiveControl !== null)
        this.lastActiveControl.onMouseUp(location);
};

SubmitScoreScreen.prototype.onMouseMove = function (location) {
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
SubmitScoreScreen.prototype.onKeyDown = function (keyCode) {

    //Backspace
    if (keyCode === 8 && this.name.length > 0 && this.name.length < 11) {
        this.name = this.name.slice(0, -1);
    } else if ((keyCode > 64 && keyCode < 91) ||
            (keyCode > 95 && keyCode < 112) ||
            (keyCode > 47 && keyCode < 58)) {
        this.name += String.fromCharCode(keyCode);
    }
};