function MenuScreen(width, height, screenController) {
    this.CELL_DIMENSIONS = 50;
    this.TOGGLE_SFX_LOCATION = new Vecotr(0, 35);
    this.TOGGLE_FX_LOCATION = new Vector(0, 50);
    this.BACK_LOCATION = new Vector(0,85);
    
    this.grassTiles = new TilingGraphic(new LoadingGraphic("gfx/grassTile.png", 0, 0), width, 50);
    this.dirtTiles = new TilingGraphic(new LoadingGraphic("gfx/dirtTile.png", 0, 0), width, height);

    this.toggleSfx = new Button("SFX On", function() {});
    this.toggleFx = new Button("FX On", function() {});
    this.mainMenu = new Button("Main Menu", function() {screenController.setScreen(new GameScreen(width, height, screenController))});
    this.lastActiveControl = null;
    
    this.width = width;
    this.height = height;
}

MenuScreen.prototype.update = function (deltaTime) {

};

MenuScreen.prototype.correctLayout = function() {
    this.TOGGLE_SFX_LOCATION.x = (this.width - this.toggleSfx.getBounds().width) / 2;
    this.TOGGLE_FX_LOCATION.x = (this.width - this.toggleFx.getBounds().widht) / 2;
    this.BACK_LOCATION.x = (this.width - this.mainMenu.getBounds().widht) / 2;
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
    this.toggleSfx.draw(g, x + this.TOGGLE_SFX_LOCATION.x, y + this.TOGGLE_SFX_LOCATION.y);
    this.toggleFx.draw(g, x + this.TOGGLE_FX_LOCATION.x, y + this.TOGGLE_FX_LOCATION.y);
    this.mainMenu.draw(g, x + this.BACK_LOCATION.x, y + this.BACK_LOCATION.y);
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
    
    if(this.toggleSfx.getBounds().add(this.TOGGLE_SFX_LOCATION).contains(location))
        selectedControl = this.toggleSfx;
    else if(this.toggleFx.getBounds().add(this.TOGGLE_FX_LOCATION).contains(location))
        selectedControl = this.toggleFx;
    else if(this.mainMenu.getBounds().add(this.BACK_LOCATION).contains(location))
        selectedControl = this.mainMenu;
    
    if(selectedControl !== this.lastActiveControl) {
        if(this.lastActiveControl !== null)
            this.lastActiveControl.onMouseLeave();
        
        if(selectedControl !== null)
            selectedControl.onMouseEnter();
    }
    
    this.lastActiveControl = selectedControl;
};