/**
 * Sixth tutorial screen.
 */

/**
 * Creates a new Tutorial Screen
 * @param {type} width The width of the canvas
 * @param {type} height The height of the canvas
 * @param {type} screenController The screen controller
 */
function TutorialScreen6(width, height, screenController) {
    this.CELL_DIMENSIONS = 50;
    
    this.MAIN_MENU_LOCATION = new Vector(0, 35);
    this.BACK_LOCATION = new Vector(0, 285);
    this.PLAY_LOCATION = new Vector(0, 285);
    this.TEXT_LOCATION = new Vector(0, 100);
    
    this.mainMenuButton = new Button("Main Menu", function() {screenController.setScreen(new MenuScreen(width, height, screenController));});
    this.playButton = new Button("Play", function() {screenController.setScreen(new GameScreen(width, height, screenController));});
    this.backButton = new Button("Back", function() {screenController.setScreen(new TutorialScreen5(width, height, screenController));});
    this.lastActiveControl = null;
    
    this.width = width;
    this.height = height;
}

/**
 * Performs any update to the logic in this screen.
 * @param {type} deltaTime The time that has past since this method was last invoked.
 */
TutorialScreen6.prototype.update = function (deltaTime) {

};

/**
 * Corrects the layout respective to the canvas size.
 */
TutorialScreen6.prototype.correctLayout = function() {
    this.BACK_LOCATION.x = ((this.width - this.backButton.getBounds().width) / 2) - 100;
    this.PLAY_LOCATION.x = ((this.width - this.playButton.getBounds().width) / 2) + 100;
    this.MAIN_MENU_LOCATION.x = ((this.width - this.mainMenuButton.getBounds().width) / 2) - 100;
    this.TEXT_LOCATION.x = this.MAIN_MENU_LOCATION.x;
};

/**
 * Draws game screen.
 * @param {Context2D} g Graphics context object through which to draw.
 * @param {Number} x The draw offset
 * @param {Number} y The draw offset
 */
TutorialScreen6.prototype.draw = function (g, x, y) {
    this.correctLayout();
    
    g.font = "20px Trade Winds";
    g.fillText("The longer you survive , the higher", this.TEXT_LOCATION.x, this.TEXT_LOCATION.y);
    g.fillText("you will score .", this.TEXT_LOCATION.x, this.TEXT_LOCATION.y + 25);
    g.fillText("Good luck !", this.TEXT_LOCATION.x, this.TEXT_LOCATION.y + 75);
    
    this.backButton.draw(g, x + this.BACK_LOCATION.x, y + this.BACK_LOCATION.y);
    this.playButton.draw(g, x + this.PLAY_LOCATION.x, y + this.PLAY_LOCATION.y);
    this.mainMenuButton.draw(g, x + this.MAIN_MENU_LOCATION.x, y + this.MAIN_MENU_LOCATION.y);
};

/**
 * On mouse down event handler.
 * @param {Vector} location Location of mouse cursor during event.
 */
TutorialScreen6.prototype.onMouseDown = function(location) {
    this.onMouseMove(location);
    
    if(this.lastActiveControl !== null)
        this.lastActiveControl.onMouseDown(location);
};

/**
 * On mouse up event handler, passes to active screen.
 * @param {Vector} location Location of mouse cursor during event.
 */
TutorialScreen6.prototype.onMouseUp = function(location) {
    if(this.lastActiveControl !== null)
        this.lastActiveControl.onMouseUp(location);
};

/**
 * On mouse down event handler.
 * @param {Vector} location Location of mouse cursor during event.
 */
TutorialScreen6.prototype.onMouseMove = function(location) {
    var selectedControl = null;
    
    if(this.backButton.getBounds().add(this.BACK_LOCATION).contains(location))
        selectedControl = this.backButton;
    else if(this.playButton.getBounds().add(this.PLAY_LOCATION).contains(location))
        selectedControl = this.playButton;
    else if(this.mainMenuButton.getBounds().add(this.MAIN_MENU_LOCATION).contains(location))
        selectedControl = this.mainMenuButton;
    
    if(selectedControl !== this.lastActiveControl) {
        if(this.lastActiveControl !== null)
            this.lastActiveControl.onMouseLeave();
        
        if(selectedControl !== null)
            selectedControl.onMouseEnter();
    }
    
    this.lastActiveControl = selectedControl;
};

/**
 * Handles key events for this screen.
 * @param {type} keyCode The key code for the key that was pressed.
 */
TutorialScreen6.prototype.onKeyDown = function(keyCode) {
    
};