/**
 * GameOverScreen handles all drawing and input related to the game over screen.
 */

/**
 * Creates a new GameOverScreen
 * @param {type} width The width of the canvas
 * @param {type} height The height of the canvas
 * @param {type} screenController The screen controller
 * @param {type} score The score of the user entering this screen.
 */
function GameOverScreen(width, height, screenController, score) {
    this.CELL_DIMENSIONS = 50;

    this.GAME_OVER_LOCATION = new Vector(0, 35);
    this.MAIN_MENU_LOCATION = new Vector(0, 385);
    this.PLAY_AGAIN_LOCATION = new Vector(0, 385);
    this.SUBMIT_LOCATION = new Vector(0, 285);

    this.playAgainButton = new Button("Play Again", function () {
        screenController.setScreen(new GameScreen(width, height, screenController))
    });
    
    this.mainMenuButton = new Button("Main Menu", function () {
        screenController.setScreen(new MenuScreen(width, height, screenController))
    });
    
    this.submitButton = new Button("Submit Score", function() {
        screenController.setScreen(new SubmitScoreScreen(width, height, screenController, score));
    });
    
    this.lastActiveControl = null;

    this.width = width;
    this.height = height;
    this.score = score;
    
    new Audio('sound/Lose.wav').play();
}

/**
 * Performs any update to the logic in this screen.
 * @param {type} deltaTime The time that has past since this method was last invoked.
 */
GameOverScreen.prototype.update = function (deltaTime) {

};

/**
 * Corrects the layout respective to the canvas size.
 */
GameOverScreen.prototype.correctLayout = function () {
    
    this.PLAY_AGAIN_LOCATION.x = ((this.width - this.playAgainButton.getBounds().width) / 2) - 100;
    this.MAIN_MENU_LOCATION.x = ((this.width - this.mainMenuButton.getBounds().width) / 2) + 100;
    this.SUBMIT_LOCATION.x = ((this.width - this.submitButton.getBounds().width) / 2);
};

/**
 * Draws game screen.
 * @param {Context2D} g Graphics context object through which to draw.
 * @param {Number} x The draw offset
 * @param {Number} y The draw offset
 */
GameOverScreen.prototype.draw = function (g, x, y) {
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
                           
    this.playAgainButton.draw(g, x + this.PLAY_AGAIN_LOCATION.x, y + this.PLAY_AGAIN_LOCATION.y);
    this.mainMenuButton.draw(g, x + this.MAIN_MENU_LOCATION.x, y + this.MAIN_MENU_LOCATION.y);
    this.submitButton.draw(g, x + this.SUBMIT_LOCATION.x, y + this.SUBMIT_LOCATION.y);

};

/**
 * On mouse down event handler.
 * @param {Vector} location Location of mouse cursor during event.
 */
GameOverScreen.prototype.onMouseDown = function (location) {
    this.onMouseMove(location);

    if (this.lastActiveControl !== null)
        this.lastActiveControl.onMouseDown(location);
};

/**
 * On mouse up event handler.
 * @param {Vector} location Location of mouse cursor during event.
 */
GameOverScreen.prototype.onMouseUp = function (location) {
    if (this.lastActiveControl !== null)
        this.lastActiveControl.onMouseUp(location);
};

/**
 * Handles mouse move events.
 * @param {type} location The current location of the mouse.
 */
GameOverScreen.prototype.onMouseMove = function (location) {
    var selectedControl = null;

    if (this.playAgainButton.getBounds().add(this.PLAY_AGAIN_LOCATION).contains(location))
        selectedControl = this.playAgainButton;
    else if (this.mainMenuButton.getBounds().add(this.MAIN_MENU_LOCATION).contains(location))
        selectedControl = this.mainMenuButton;
    else if (this.submitButton.getBounds().add(this.SUBMIT_LOCATION).contains(location))
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
GameOverScreen.prototype.onKeyDown = function(keyCode) {
    
};