/**
 * Represents grid from which pipes are selected and placed on main game grid.
 */

function PipeSelectionQueue() {
    this.pipeGrid = new Grid(50, 3, 1);
}

PipeSelectionQueue.prototype.draw = function(g, x, y) {
    this.pipeGrid.draw(g, x, y);
};

PipeSelectionQueue.prototype.popPipe = function(location) {
    var coord = this.pipeGrid.screenToGrid(location);
    
    if(coord.x < 0 || coord.x > 2 || coord.y !== 0)
        return null;
    
    var pipe = this.pipeGrid.getPipe(coord);
    this.pipeGrid.clearPipe(coord);
    
    return pipe;
};

PipeSelectionQueue.prototype.clear = function() {
    for(var x = 0; x < 3; x++)
        this.pipeGrid.clearPipe(new Vector(x, 0));
};

PipeSelectionQueue.prototype.pushPipe = function(pipe) {
    for(var i = 0; i < 3; i++) {
        if(this.pipeGrid.getPipe(new Vector(i, 0)) === null) {
            this.pipeGrid.setPipe(new Vector(i, 0), pipe);
            return true;
        }
    }
    
    return false;
};

PipeSelectionQueue.prototype.getBounds = function() {
    return this.pipeGrid.getBounds();
};