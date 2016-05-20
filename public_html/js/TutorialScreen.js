function TutorialScreen(width, height, screenController) {
    this.CELL_DIMENSIONS = 50;
    
    this.MAIN_MENU_LOCATION = new Vector(0, 85);
    this.PLAY_LOCATION = new Vector(0, 135);

    this.playButton = new Button("Play", function() {screenController.setScreen(new GameScreen(width, height, screenController))});
    this.mainMenuButton = new Button("Main Menu", function() {screenController.setScreen(new MenuScreen(width, height, screenController))});
    this.lastActiveControl = null;
    
    this.width = width;
    this.height = height;
}

TutorialScreen.prototype.update = function (deltaTime) {

};

TutorialScreen.prototype.correctLayout = function() {
    this.PLAY_LOCATION.x = (this.width - this.playButton.getBounds().width) / 2;
    this.MAIN_MENU_LOCATION.x = (this.width - this.mainMenuButton.getBounds().width) / 2;
};

/**
 * Draws game screen.
 * @param {Context2D} g Graphics context object through which to draw.
 * @param {Number} x The draw offset
 * @param {Number} y The draw offset
 */
TutorialScreen.prototype.draw = function (g, x, y) {
    this.correctLayout();
    this.playButton.draw(g, x + this.PLAY_LOCATION.x, y + this.PLAY_LOCATION.y);
    this.mainMenuButton.draw(g, x + this.MAIN_MENU_LOCATION.x, y + this.MAIN_MENU_LOCATION.y);
};

/**
 * On mouse down event handler, passes to active screen.
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

TutorialScreen.prototype.onMouseMove = function(location) {
    var selectedControl = null;
    
    if(this.playButton.getBounds().add(this.PLAY_LOCATION).contains(location))
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