function GameOverScreen(width, height, screenController) {
    this.CELL_DIMENSIONS = 50;
    
    this.GAME_OVER_LOCATION = new Vector(0, 35);
    this.MAIN_MENU_LOCATION = new Vector(0, 285);
    this.PLAY_AGAIN_LOCATION = new Vector(0, 285);
    
    this.grassTiles = new TilingGraphic(new LoadingGraphic("gfx/grassTile.png", 0, 0), width, 50);
    this.dirtTiles = new TilingGraphic(new LoadingGraphic("gfx/dirtTile.png", 0, 0), width, height);

    this.playAgainButton = new Button("Play Again", function() {screenController.setScreen(new GameScreen(width, height, screenController))});
    this.mainMenuButton = new Button("Main Menu", function() {screenController.setScreen(new MenuScreen(width, height, screenController))});
    this.lastActiveControl = null;
    
    this.width = width;
    this.height = height;
}

GameOverScreen.prototype.update = function (deltaTime) {

};

GameOverScreen.prototype.correctLayout = function() {
    this.PLAY_AGAIN_LOCATION.x = ((this.width - this.playAgainButton.getBounds().width) / 2) - 100;
    this.MAIN_MENU_LOCATION.x = ((this.width - this.mainMenuButton.getBounds().width) / 2) + 100;
};

/**
 * Draws game screen.
 * @param {Context2D} g Graphics context object through which to draw.
 * @param {Number} x The draw offset
 * @param {Number} y The draw offset
 */
GameOverScreen.prototype.draw = function (g, x, y) {
    this.dirtTiles.draw(g, x, y);
    this.grassTiles.draw(g, x, y);
    
    this.correctLayout();
    this.playAgainButton.draw(g, x + this.PLAY_AGAIN_LOCATION.x, y + this.PLAY_AGAIN_LOCATION.y);
    this.mainMenuButton.draw(g, x + this.MAIN_MENU_LOCATION.x, y + this.MAIN_MENU_LOCATION.y);

};

/**
 * On mouse down event handler, passes to active screen.
 * @param {Vector} location Location of mouse cursor during event.
 */
GameOverScreen.prototype.onMouseDown = function(location) {
    this.onMouseMove(location);
    
    if(this.lastActiveControl !== null)
        this.lastActiveControl.onMouseDown(location);
};

/**
 * On mouse up event handler, passes to active screen.
 * @param {Vector} location Location of mouse cursor during event.
 */
GameOverScreen.prototype.onMouseUp = function(location) {
    if(this.lastActiveControl !== null)
        this.lastActiveControl.onMouseUp(location);
};

GameOverScreen.prototype.onMouseMove = function(location) {
    var selectedControl = null;
    
    if(this.playAgainButton.getBounds().add(this.PLAY_AGAIN_LOCATION).contains(location))
        selectedControl = this.playAgainButton;
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