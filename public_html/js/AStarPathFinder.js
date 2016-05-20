function AStarPathFinder(grid) {
    this.grid = grid;
    this.MAX_ITERATIONS = 200;
}

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

AStarPathFinder.prototype.contains = function(node, openSet) {
    for(var i = 0; i < openSet.length; i++) {
        if(openSet[i].equals(node))
            return true;
    }
    
    return false;
};

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

AStarPathFinder.prototype.isWalkable = function (node, dest) {
    
    if(node.getLocation().equals(dest))
        return true;
    
    if(!this.grid.getCellBounds().contains(node.getLocation()))
        return false;
    
    var pipe = this.grid.getPipe(node.getLocation());

    return pipe === null || pipe.canReplace();
};