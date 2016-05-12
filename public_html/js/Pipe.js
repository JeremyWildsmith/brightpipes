function Pipe(parentGrid, graphic, connectionDirections, location)
{
    this.location = location;
    this.parentGrid = parentGrid;
    this.graphic = graphic;
    this.connectionDirections = connectionDirections;
    this.filled = false;
    this.leaked = false;
    this.pump = false;
}

//Set pipe fill state to full, or if already full, fill out pipes
Pipe.prototype.fill = function (dir) {
    if (this.filled) {
        var pipeArray = getConnections(dir);

        if (pipeArray.length !== this.connectionDirections.length) {
            this.leaked = true;
        } else {
            for (i = 0; i < pipeArray.length; i++) {
                pipeArray[i].fill();
            }
        }
    } else
        this.filled = true;


};

//Draw the pipe graphic
Pipe.prototype.draw = function (g, x, y) {

};

Pipe.prototype.getConnections = function (dir) {
    var pipeArray = [];
    var pipeUp =
            this.parentGrid.getPipe(this.location.add(Direction.Up.delta));
    var pipeDown =
            this.parentGrid.getPipe(this.location.add(Direction.Down.delta));
    var pipeRight =
            this.parentGrid.getPipe(this.location.add(Direction.Right.delta));
    var pipeLeft =
            this.parentGrid.getPipe(this.location.add(Direction.Left.delta()));

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
    for (i = 0; i < this.connectionDirections.length; i++) {
        switch (this.connectionDirections[i]) {
            case Direction.Up:
                if (pipeUp !== null &&
                        pipeUp.getDirections.indexOf(Direction.Down) !== -1) {
                    pipeArray.push(pipeUp);
                }
                break;
            case Direction.Down:
                if (pipeDown !== null &&
                        pipeDown.getDirections.indexOf(Direction.Up) !== -1) {
                    pipeArray.push(pipeDown);
                }
                break;
            case Direction.Right:
                if (pipeRight !== null &&
                        pipeRight.getDirections.indexOf(Direction.Right) !== -1) {
                    pipeArray.push(pipeRight);
                }
                break;
            case Direction.Left:
                if (pipeLeft !== null &&
                        pipeLeft.getDirections.indexOf(Direction.Left) !== -1) {
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

Pipe.prototype.getDirections = function () {
    return this.connectionDirections;
};

Pipe.prototype.setAsPump = function() {
    this.pump = true;
};

Pipe.prototype.isPump = function() {
    return this.pump;
};