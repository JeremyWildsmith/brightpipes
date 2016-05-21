/**
 * Represents a single node or step in an A-Star path.
 */

/**
 * Creates a new A Star node.
 * @param {type} parent The steps previous to this steps.
 * @param {type} location The Location of this step.
 * @returns {AStarNode}
 */
function AStarNode(parent, location) {
    this.parent = parent;
    this.location = location;
};

/**
 * Sets the parent AStar node.
 * @param {type} parent The parent AStar node.
 * @returns {undefined}
 */
AStarNode.prototype.setParent = function (parent) {
    this.parent = parent;
};

/**
 * Gets the parent A Star node.
 * @returns {type} The parent AStar Node.
 */
AStarNode.prototype.getParent = function () {
    return this.parent;
};

/**
 * Gets the net score of the current node respective to a specified location.
 * @param {type} start The location that you are attempting to reach this node from.
 * @returns {Number} The total score for this node.
 */
AStarNode.prototype.getScore = function (start) {
    return this.getFScore(start) + this.getGScore(start);
};

/**
 * Gets the F-Score (approximate distance) respective to a particular location.
 * @param {type} start The location you are attempting to reach this node from.
 * @returns {Number} the F-Score
 */
AStarNode.prototype.getFScore = function (start) {
    var difference = this.location.difference(start);

    return Math.abs(difference.x) + Math.abs(difference.y);
};

/**
 * Gets the GScore (approximate number of steps traveresed to reach this node.)
 * @returns {Number} The G-Score
 */
AStarNode.prototype.getGScore = function () {
    return 1 + (this.parent === null ? 0 : this.parent.getGScore());
};

/**
 * Gets the node location.
 * @returns {type} The node location.
 */
AStarNode.prototype.getLocation = function () {
    return this.location;
};

/**
 * Gets an array of directions required to traverse the path this node is apart of.
 * @returns {Array|AStarNode.prototype.getDirections.directions} Directions to traverse path.
 */
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

/**
 * Gets an array of pipes required to traverse this path.
 * @returns {Array|AStarNode.prototype.getPipes.pipes}
 */
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


/**
* Tests whether two nodes, if placed in the same path, are equal.
 * @param {type} n The node to test against.
 * @returns {Boolean} Whether the two nodes are equal.
 */
AStarNode.prototype.equals = function(n) {
    return n.getLocation().equals(this.getLocation());
};

