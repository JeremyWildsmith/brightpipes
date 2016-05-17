/**
 * Pipe object
 * 
 * @param graphic - image of the pipe
 * @param connectionDirections - directions the pipe points to
 * @param type - the type of pipe
 */
function Pipe(graphic, connectionDirections, type)
{
    this.location = new Vector(0, 0);
    this.parentGrid = null;
    this.graphic = graphic;
    this.connectionDirections = connectionDirections;
    this.filled = false;
    this.leaked = false;
    this.pump = false;
    this.type = type;
}

/**
 * Attaches the pipe to the grid/world.
 * 
 * @param grid - main grid
 * @param location - location of the pipe
 */
Pipe.prototype.attach = function(grid, location) {
    this.parentGrid = grid;
    this.location = location;
};

/**
 * Detaches the pipe from the grid/world.
 */
Pipe.prototype.detach = function() {
    this.parentGrid = null;
    this.location = new Vector(0, 0);
};

/**
 * Set pipe fill state to full, or if already full, fill out pipes.
 * 
 * @param dir - direction of where the pipe is pumping from
 * @param filledPipes - array of pipes that have been filled
 */
Pipe.prototype.fill = function (dir, filledPipes) {
    if (filledPipes === undefined) {
        filledPipes = [];
    }
    
    if (filledPipes.indexOf(this) >= 0) {
        return;
    }
    
    filledPipes.push(this);
    
    if (this.filled) {
        var pipeArray = this.getConnections(dir);

        if (this.getConnections(null).length !== this.connectionDirections.length) {
            this.leaked = true;
        }
        
        
        for (i = 0; i < pipeArray.length; i++) {
            var delta = this.location.difference(pipeArray[i].location);
            pipeArray[i].fill(Direction.fromVector(delta), filledPipes);
        }
    } else
        this.filled = true; 
};

/**
 * Draw the pipe graphic.
 * 
 * @param g - graphic
 * @param x - x coordinate
 * @param y - y coordinate
 */
Pipe.prototype.draw = function (g, x, y) {
    this.graphic.draw(g, x, y);

};

/**
 * Returns an array of all of the legal pipe connections except for the pipe
 * where the pump direction is coming from. 
 * 
 * @param dir - direction of where the pipe is pumping from
 * @return pipeArray[]
 */
Pipe.prototype.getConnections = function (dir) {
    var pipeArray = [];
    var pipeUp =
            this.parentGrid.getPipe(this.location.add(Direction.Up.delta));
    var pipeDown =
            this.parentGrid.getPipe(this.location.add(Direction.Down.delta));
    var pipeRight =
            this.parentGrid.getPipe(this.location.add(Direction.Right.delta));
    var pipeLeft =
            this.parentGrid.getPipe(this.location.add(Direction.Left.delta));

    //sets the pipe where the pump is coming from to null
    switch (dir) {
        case Direction.Up:
            pipeUp = null;
            break;
        case Direction.Down:
            pipeDown = null;
            break;
        case Direction.Right:
            pipeRight = null;
            break;
        case Direction.Left:
            pipeLeft = null;
            break;
    }
    //add the pipes with legal connections to the array
    for (i = 0; i < this.connectionDirections.length; i++) {
        switch (this.connectionDirections[i]) {
            case Direction.Up:
                if (pipeUp !== null &&
                        pipeUp.getDirections().indexOf(Direction.Down) !== -1) {
                    pipeArray.push(pipeUp);
                }
                break;
            case Direction.Down:
                if (pipeDown !== null &&
                        pipeDown.getDirections().indexOf(Direction.Up) !== -1) {
                    pipeArray.push(pipeDown);
                }
                break;
            case Direction.Right:
                if (pipeRight !== null &&
                        pipeRight.getDirections().indexOf(Direction.Left) !== -1) {
                    pipeArray.push(pipeRight);
                }
                break;
            case Direction.Left:
                if (pipeLeft !== null &&
                        pipeLeft.getDirections().indexOf(Direction.Right) !== -1) {
                    pipeArray.push(pipeLeft);
                }
                break;
        }
    }

    return pipeArray;

};
//Probably wont do much, at least not now
Pipe.prototype.update = function (deltaTime) {
};
/**
 * Function used to see if the pipe is connected to the pump
 * 
 * @return pumpBoolean - boolean value of if the pump is connected to the pipe
 */
Pipe.prototype.connectedToPump = function () {
    var pipeArray = getConnections(null);
    var pumpBoolean = false;
    
    for (i = 0; i < pipeArray.length; i++) {
        if (pipeArray[i].isPump) {
            pumpBoolean = true;
        }
    }
    return pumpBoolean;
};

/**
 * Getter method for connectionDirections
 * 
 * @return this.connectionDirections 
 */
Pipe.prototype.getDirections = function () {
    return this.connectionDirections;
};

Pipe.prototype.getLocation = function() {
    return this.location;
};

/**
 * Sets the pipe as a pump
 * 
 */
Pipe.prototype.setAsPump = function() {
    this.pump = true;
};

/**
 * Getter method for pump
 * 
 * @return this.pump
 */
Pipe.prototype.isPump = function() {
    return this.pump;
};

/**
 * Getter method for filled
 * 
 * @return this.filled
 */
Pipe.prototype.isFilled = function() {
    return this.filled;
};

/**
 * Getter method for leaked
 * 
 * @return this.leaked
 */
Pipe.prototype.isLeaking = function() {
    return this.leaked;
};