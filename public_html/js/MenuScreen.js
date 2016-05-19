function MenuScreen(width, height, screenController) {
    this.CELL_DIMENSIONS = 50;
    
    this.START_BUTTON_LOCATION = new Vector(0, 35);
    this.LEADERBOARDS_BUTTON_LOCATION = new Vector(0, 85);
    this.TUTORIAL_BUTTON_LOCATION = new Vector(0, 135);
    this.SETTINGS_BUTTON_LOCATION = new Vector(0, 185);
    
    this.grassTiles = new TilingGraphic(new LoadingGraphic("gfx/grassTile.png", 0, 0), width, 50);
    this.dirtTiles = new TilingGraphic(new LoadingGraphic("gfx/dirtTile.png", 0, 0), width, height);

    this.startButton = new Button("Start", function() {screenController.setScreen(new GameScreen(width, height, screenController))});
    this.leaderboardsButton = new Button("Leaderboard", function() {});
    this.tutorialButton = new Button("Tutorial", function() {screenController.setScreen(new TutorialScreen(width, height, screenController))});
    this.settingsButton = new Button("Settings", function() {
        screenController.setScreen(new SettingsScreen(width, height, screenController));
    });
    
    this.lastActiveControl = null;
    
    this.width = width;
    this.height = height;
}

MenuScreen.prototype.update = function (deltaTime) {

};

MenuScreen.prototype.correctLayout = function() {
    this.START_BUTTON_LOCATION.x = (this.width - this.startButton.getBounds().width) / 2;
    this.LEADERBOARDS_BUTTON_LOCATION.x = (this.width - this.leaderboardsButton.getBounds().width) / 2;
    this.TUTORIAL_BUTTON_LOCATION.x = (this.width - this.leaderboardsButton.getBounds().width) / 2;
    this.SETTINGS_BUTTON_LOCATION.x = (this.width - this.settingsButton.getBounds().width) / 2;
};

/**
 * Draws game screen.
 * @param {Context2D} g Graphics context object through which to draw.
 * @param {Number} x The draw offset
 * @param {Number} y The draw offset
 */
MenuScreen.prototype.draw = function (g, x, y) {
    this.dirtTiles.draw(g, x, y);
    this.grassTiles.draw(g, x, y);
    
    this.correctLayout();
    this.startButton.draw(g, x + this.START_BUTTON_LOCATION.x, y + this.START_BUTTON_LOCATION.y);
    this.leaderboardsButton.draw(g, x + this.LEADERBOARDS_BUTTON_LOCATION.x, y + this.LEADERBOARDS_BUTTON_LOCATION.y);
    this.tutorialButton.draw(g, x + this.TUTORIAL_BUTTON_LOCATION.x, y + this.TUTORIAL_BUTTON_LOCATION.y);
    this.settingsButton.draw(g, x + this.SETTINGS_BUTTON_LOCATION.x, y + this.SETTINGS_BUTTON_LOCATION.y);

};

/**
 * On mouse down event handler, passes to active screen.
 * @param {Vector} location Location of mouse cursor during event.
 */
MenuScreen.prototype.onMouseDown = function(location) {
    this.onMouseMove(location);
    
    if(this.lastActiveControl !== null)
        this.lastActiveControl.onMouseDown(location);
};

/**
 * On mouse up event handler, passes to active screen.
 * @param {Vector} location Location of mouse cursor during event.
 */
MenuScreen.prototype.onMouseUp = function(location) {
    if(this.lastActiveControl !== null)
        this.lastActiveControl.onMouseUp(location);
};

MenuScreen.prototype.onMouseMove = function(location) {
    var selectedControl = null;
    
    if(this.startButton.getBounds().add(this.START_BUTTON_LOCATION).contains(location))
        selectedControl = this.startButton;
    else if(this.leaderboardsButton.getBounds().add(this.LEADERBOARDS_BUTTON_LOCATION).contains(location))
        selectedControl = this.leaderboardsButton;
    else if (this.tutorialButton.getBounds().add(this.TUTORIAL_BUTTON_LOCATION).contains(location))
        selectedControl = this.tutorialButton;
    else if(this.settingsButton.getBounds().add(this.SETTINGS_BUTTON_LOCATION).contains(location))
        selectedControl = this.settingsButton;
    
    if(selectedControl !== this.lastActiveControl) {
        if(this.lastActiveControl !== null)
            this.lastActiveControl.onMouseLeave();
        
        if(selectedControl !== null)
            selectedControl.onMouseEnter();
    }
    
    this.lastActiveControl = selectedControl;
};
