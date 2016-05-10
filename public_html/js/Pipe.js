function Pipe(parentGrid, graphic, connectionDirections, location) 
{
    this.location = location;
    this.parentGrid = parentGrid;
    this.graphic = graphic;
    this.connnectionDirections = connectionDirections;
}

//Set pipe fill state to full, or if already full, fill out pipes
Pipe.prototype.fill = function() {
    
};

//Draw the pipe graphic
Pipe.prototype.draw = function(g, x, y) { 
    
};

Pipe.prototype.getConnections = function(g, x, y) {
    
};

//Probably wont do much, at least not now
Pipe.prototype.update = function(deltaTime) {
    
};