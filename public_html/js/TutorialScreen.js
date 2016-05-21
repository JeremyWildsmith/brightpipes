/**
 * TutorialScreen handles all drawing and input related to the tutorial screen.
 */

/**
 * Creates a new GameOverScreen
 * @param {type} width The width of the canvas
 * @param {type} height The height of the canvas
 * @param {type} screenController The screen controller
 */
function TutorialScreen(width, height, screenController) {
    this.CELL_DIMENSIONS = 50;
    
    this.MAIN_MENU_LOCATION = new Vector(0, 35);
    this.BACK_LOCATION = new Vector(0, 285);
    this.NEXT_LOCATION = new Vector(0, 285);
    
    this.mainMenuButton = new Button("Main Menu", function() {screenController.setScreen(new MenuScreen(width, height, screenController))});
    this.nextButton = new Button("Next", function() {});
    this.backButton = new Button("Back", function() {});
    this.lastActiveControl = null;
    
    this.width = width;
    this.height = height;
}

/**
 * Performs any update to the logic in this screen.
 * @param {type} deltaTime The time that has past since this method was last invoked.
 */
TutorialScreen.prototype.update = function (deltaTime) {

};

/**
 * Corrects the layout respective to the canvas size.
 */
TutorialScreen.prototype.correctLayout = function() {
    this.BACK_LOCATION.x = ((this.width - this.backButton.getBounds().width) / 2) - 100;
    this.NEXT_LOCATION.x = ((this.width - this.nextButton.getBounds().width) / 2) + 100;
    this.MAIN_MENU_LOCATION.x = ((this.width - this.mainMenuButton.getBounds().width) / 2) - 100;
};

/**
 * Draws game screen.
 * @param {Context2D} g Graphics context object through which to draw.
 * @param {Number} x The draw offset
 * @param {Number} y The draw offset
 */
TutorialScreen.prototype.draw = function (g, x, y) {
    this.correctLayout();
    this.backButton.draw(g, x + this.BACK_LOCATION.x, y + this.BACK_LOCATION.y);
    this.nextButton.draw(g, x + this.NEXT_LOCATION.x, y + this.NEXT_LOCATION.y);
    this.mainMenuButton.draw(g, x + this.MAIN_MENU_LOCATION.x, y + this.MAIN_MENU_LOCATION.y);
};

/**
 * On mouse down event handler.
 * @param {Vector} location Location of mouse cursor during event.
 */
TutorialScreen.prototype.onMouseDown = function(location) {
    this.onMouseMove(location);
    
    if(this.lastActiveControl !== null)
        this.lastActiveControl.onMouseDown(location);
};

/**
 * On mouse up event handler, passes to active screen.
 * @param {Vector} location Location of mouse cursor during event.
 */
TutorialScreen.prototype.onMouseUp = function(location) {
    if(this.lastActiveControl !== null)
        this.lastActiveControl.onMouseUp(location);
};

/**
 * On mouse down event handler.
 * @param {Vector} location Location of mouse cursor during event.
 */
TutorialScreen.prototype.onMouseMove = function(location) {
    var selectedControl = null;
    
    if(this.backButton.getBounds().add(this.BACK_LOCATION).contains(location))
        selectedControl = this.backButton;
    else if(this.nextButton.getBounds().add(this.NEXT_LOCATION).contains(location))
        selectedControl = this.nextButton;
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
TutorialScreen.prototype.onKeyDown = function(keyCode) {
    
};