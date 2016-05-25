/**
 * SettingsScreen handles all drawing and input related to the game settings screen.
 */

/**
 * Creates a new SettingsScreen
 * @param {type} width The width of the canvas
 * @param {type} height The height of the canvas
 * @param {type} screenController The screen controller
 */
function SettingsScreen(width, height, screenController) {
    this.CELL_DIMENSIONS = 50;
    this.TOGGLE_SFX_LOCATION = new Vector(0, 35);
    this.TOGGLE_FX_LOCATION = new Vector(0, 85);
    this.BACK_LOCATION = new Vector(0,135);
    
    this.toggleSfx = new Button("SFX On", function() {});
    this.toggleFx = new Button("FX On", function() {});
    this.mainMenu = new Button("Main Menu", function() {screenController.setScreen(new MenuScreen(width, height, screenController));});
    this.lastActiveControl = null;
    
    this.width = width;
    this.height = height;
}

/**
 * Performs any update to the logic in this screen.
 * @param {type} deltaTime The time that has past since this method was last invoked.
 */
SettingsScreen.prototype.update = function (deltaTime) {

};

/**
 * Corrects the layout respective to the canvas size.
 */
SettingsScreen.prototype.correctLayout = function() {
    this.TOGGLE_SFX_LOCATION.x = (this.width - this.toggleSfx.getBounds().width) / 2;
    this.TOGGLE_FX_LOCATION.x = (this.width - this.toggleFx.getBounds().width) / 2;
    this.BACK_LOCATION.x = (this.width - this.mainMenu.getBounds().width) / 2;
};

/**
 * Draws game screen.
 * @param {Context2D} g Graphics context object through which to draw.
 * @param {Number} x The draw offset
 * @param {Number} y The draw offset
 */
SettingsScreen.prototype.draw = function (g, x, y) {
    this.correctLayout();
    this.toggleSfx.draw(g, x + this.TOGGLE_SFX_LOCATION.x, y + this.TOGGLE_SFX_LOCATION.y);
    this.toggleFx.draw(g, x + this.TOGGLE_FX_LOCATION.x, y + this.TOGGLE_FX_LOCATION.y);
    this.mainMenu.draw(g, x + this.BACK_LOCATION.x, y + this.BACK_LOCATION.y);
};

/**
 * On mouse down event handler.
 * @param {Vector} location Location of mouse cursor during event.
 */
SettingsScreen.prototype.onMouseDown = function(location) {
    this.onMouseMove(location);
    
    if(this.lastActiveControl !== null)
        this.lastActiveControl.onMouseDown(location);
};

/**
 * On mouse up event handler, passes to active screen.
 * @param {Vector} location Location of mouse cursor during event.
 */
SettingsScreen.prototype.onMouseUp = function(location) {
    if(this.lastActiveControl !== null)
        this.lastActiveControl.onMouseUp(location);
};

/**
 * Handles mouse move events.
 * @param {type} location The current location of the mouse.
 */
SettingsScreen.prototype.onMouseMove = function(location) {
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

/**
 * Handles key events for this screen.
 * @param {type} keyCode The key code for the key that was pressed.
 */
SettingsScreen.prototype.onKeyDown = function(keyCode) {
    
};