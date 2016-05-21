/**
 * Creats a new A Start Path Finder instance for the specified game grid.
 * @param {type} grid The game grid to locate the path for.
 * @returns {AStarPathFinder}
 */
function AStarPathFinder(grid) {
    this.grid = grid;
    this.MAX_ITERATIONS = 200;
}

/**
 * Attempts to find a path between two specified points in the game grid.
 * @param {type} start The start of the path
 * @param {type} end The location you want to path to.
 * @returns {AStarNode} An AStarNode equal to the end location or null if no path could be found.
 */
AStarPathFinder.prototype.findPath = function (start, end) {
    var open = [];
    var closed = [];

    var startNode = new AStarNode(null, start);

    if(!this.isWalkable(startNode, end))
        return null;

    open.push(startNode);

    for (var i = 0; i < this.MAX_ITERATIONS; i++)
    {
        if(open.length === 0)
            return null;
        
        var smallestScore = this.smallestScore(open, end);

        if (smallestScore.getLocation().equals(end))
            return smallestScore;

        var possibleDirections = Direction.values();

        for (var x = 0; x < possibleDirections.length; x++)
        {
            var d = possibleDirections[x];

            var movement = new AStarNode(smallestScore, smallestScore.getLocation().add(d.delta));
            if (this.isWalkable(movement, end) && !this.contains(movement, open) && !this.contains(movement, closed))
                open.push(movement);
        }

        closed.push(smallestScore);
        open.splice(open.indexOf(smallestScore), 1);
    }

    return null;
};

/**
 * Test whether a node is contained in a specified set.
 * @param {type} node The node to test
 * @param {type} set The set to test against.
 * @returns {Boolean} Whether the node is contained in the specified set.
 */
AStarPathFinder.prototype.contains = function(node, set) {
    for(var i = 0; i < set.length; i++) {
        if(set[i].equals(node))
            return true;
    }
    
    return false;
};

/**
 * Gets the smallest scored node in a specified set.
 * @param {type} adjacent Set of nodes to search
 * @param {type} start Start location of path.
 * @returns {AStarNode} The smallest score node in specified set.
 */
AStarPathFinder.prototype.smallestScore = function (adjacent, start) {
    var smallestScore = Number.MAX_VALUE;
    var smallest = null;

    for (var i = 0; i < adjacent.length; i++) {
        var n = adjacent[i];

        var fValue = n.getScore(start);

        if (fValue < smallestScore) {
            smallest = n;
            smallestScore = fValue;
        }
    }

    return smallest;
};

/**
 * Tests whether a node is 'walkable', or can have pipes placed on it.
 * @param {type} node The node to test the useability of.
 * @param {type} dest The destination you are trying to reach.
 * @returns {Boolean} Whether the specified node can have pipes placed on it.
 */
AStarPathFinder.prototype.isWalkable = function (node, dest) {
    
    if(node.getLocation().equals(dest))
        return true;
    
    if(!this.grid.getCellBounds().contains(node.getLocation()))
        return false;
    
    var pipe = this.grid.getPipe(node.getLocation());

    return pipe === null || pipe.canReplace();
};