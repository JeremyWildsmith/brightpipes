/**
 * Represents grid from which pipes are selected and placed on main game grid.
 */

/**
 * Creates a new pipe selection queue.
 */
function PipeSelectionQueue() {
    this.pipeGrid = new Grid(50, 3, 1);
}

/**
 * Draws PipeSelectionQueue.
 * @param {Context2D} g Graphics context object through which to draw.
 * @param {Number} x The draw offset
 * @param {Number} y The draw offset
 */
PipeSelectionQueue.prototype.draw = function(g, x, y) {
    this.pipeGrid.draw(g, x, y);
};

/**
 * Pops the pipe out of the specified location in the selection queue.
 * @param {type} location The location where the pipe is to be popped out of.
 * @returns {Pipe} The pipe removed from the queue.
 */
PipeSelectionQueue.prototype.popPipe = function(location) {
    var coord = this.pipeGrid.screenToGrid(location);
    
    if(coord.x < 0 || coord.x > 2 || coord.y !== 0)
        return null;
    
    var pipe = this.pipeGrid.getPipe(coord);
    this.pipeGrid.clearPipe(coord);
    return pipe;
};

/**
 * Clears the pipe selection queue.
 */
PipeSelectionQueue.prototype.clear = function() {
    for(var x = 0; x < 3; x++)
        this.pipeGrid.clearPipe(new Vector(x, 0));
};

/**
 * Pushes a specified pipe into the selection queue.
 * @param {type} pipe The pipe to be pushed into the queue.
 * @returns {Boolean} Whether there was room to push the pipe.
 */
PipeSelectionQueue.prototype.pushPipe = function(pipe) {
    for(var i = 0; i < 3; i++) {
        if(this.pipeGrid.getPipe(new Vector(i, 0)) === null) {
            this.pipeGrid.setPipe(new Vector(i, 0), pipe);
            return true;
        }
    }
    return false;
};

/**
 * Gets an array of pipes in the queue.
 * @returns {Array} An array of pipes in the queue.
 */
PipeSelectionQueue.prototype.getPipes = function() {
    return this.pipeGrid.getPipes();
};

/**
 * Gets the bounds of the selection queue.
 * @returns {Rectangle} A rectangle representing the bounds.
 */
PipeSelectionQueue.prototype.getBounds = function() {
    return this.pipeGrid.getBounds();
};

/**
 * Shifts all pipes in the queue left one.
 */
PipeSelectionQueue.prototype.shiftLeft = function() {
    if(this.pipeGrid.getPipe(new Vector(1, 0)) !== null)
        this.pipeGrid.setPipe(new Vector(0, 0), this.pipeGrid.getPipe(new Vector(1, 0)));
    
    this.pipeGrid.setPipe(new Vector(1, 0), this.pipeGrid.getPipe(new Vector(2, 0)));
    this.pipeGrid.clearPipe(new Vector(2, 0));
};

/**
 * Shifts a pipe into the right hand side of the selection queue.
 * @param {type} pipe The pipe to be pushed into the queue.
 */
PipeSelectionQueue.prototype.shiftIn = function(pipe) {
    if(this.pipeGrid.getPipe(new Vector(2, 0)) !== null)
        this.shiftLeft();

    this.pipeGrid.setPipe(new Vector(2, 0), pipe);
};