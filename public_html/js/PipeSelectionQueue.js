function PipeSelectionQueue() {
    this.pipeGrid = new Grid(50, 3, 1);
}

PipeSelectionQueue.prototype.draw = function(g, x, y) {
    this.pipeGrid.draw(g, x, y);
};

PipeSelectionQueue.prototype.popPipe = function(location) {
    
};

PipeSelectionQueue.prototype.pushPipe = function(pipe) {
    
};

PipeSelectionQueue.prototype.getBounds = function() {
    return this.pipeGrid.getBounds();
};