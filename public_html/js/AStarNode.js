function AStarNode(parent, location) {
    this.parent = parent;
    this.location = location;
}
;

AStarNode.prototype.setParent = function (parent) {
    this.parent = parent;
};

AStarNode.prototype.getParent = function () {
    return this.parent;
};

AStarNode.prototype.getScore = function (start) {
    return this.getFScore(start) + this.getGScore(start);
};

AStarNode.prototype.getFScore = function (start) {
    var difference = this.location.difference(start);

    return Math.abs(difference.x) + Math.abs(difference.y);
};

AStarNode.prototype.getGScore = function () {
    return 1 + (this.parent === null ? 0 : this.parent.getGScore());
};

AStarNode.prototype.getLocation = function () {
    return this.location;
};

AStarNode.prototype.getDirections = function () {
    var directions = [];
    var nodes = [];

    var n = this;

    while (n !== null)
    {
        nodes.push(n);
        n = n.getParent();
    }

    for (var i = nodes.length - 1; i > 0; i--) {
        var previous = nodes[i - 1];
        var difference = previous.getLocation().difference(nodes[i].getLocation());

        directions.push(Direction.fromVector(difference));
    }

    return directions;
};

AStarNode.prototype.getSteps = function () {
    var directions = [];
    var nodes = [];

    var n = this;

    while (n !== null)
    {
        nodes.push(n);
        n = n.getParent();
    }

    for (var i = nodes.length - 1; i >= 0; i--) {
        directions.push(nodes[i].getLocation());
    }

    return directions;
};

AStarNode.prototype.getPipes = function() {
    var directions = this.getDirections();
    var pipes = [];
    
    for(var i = 0; i < directions.length; i++) {
        var nextDirection = i == directions.length ? null : directions[i + 1];
        
        switch(directions[i]) {
            case Direction.Right:
            {
                if(nextDirection === Direction.Up)
                    pipes.push(Pipes.LeftUp);
                else if(nextDirection === Direction.Down)
                    pipes.push(Pipes.LeftDown);
                else
                    pipes.push(Pipes.Horizontal);
            }
            break;
            
            case Direction.Left:
            {
                if(nextDirection === Direction.Up)
                    pipes.push(Pipes.RightUp);
                else if(nextDirection === Direction.Down)
                    pipes.push(Pipes.RightDown);
                else
                    pipes.push(Pipes.Horizontal);
            }
            break;
            
            case Direction.Down:
            {
                if(nextDirection === Direction.Right)
                    pipes.push(Pipes.RightUp);
                else if(nextDirection === Direction.Left)
                    pipes.push(Pipes.LeftUp);
                else
                    pipes.push(Pipes.Vertical);
            }
            break;
            
            case Direction.Up:
            {
                if(nextDirection === Direction.Right)
                    pipes.push(Pipes.RightDown);
                else if(nextDirection === Direction.Left)
                    pipes.push(Pipes.LeftDown);
                else
                    pipes.push(Pipes.Vertical);
            }
            break;
        }
    }
    
    return pipes;
};

AStarNode.prototype.equals = function(n) {
    return n.getLocation().equals(this.getLocation());
};

