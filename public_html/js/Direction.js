
/**
 * Siginfies different possible directions in the game,
 * their name and their representation as a vector.
 */
var Direction = {
    Up : {value: 0, name: "Up", delta: new Vector(0, -1) },
    Down : {value: 1, name: "Down", delta: new Vector(0, 1) },
    Right : {value: 2, name: "Right", delta: new Vector(1, 0) },
    Left : {value: 3, name: "Left", delta: new Vector(-1, 0) },
    /**
     * Generates array of all possible directions.
     * @returns {Array|Direction.values.array} List of all directions.
     */
    values: function() {
        var array = [];
        array.push(Direction.Up);
        array.push(Direction.Down);
        array.push(Direction.Right);
        array.push(Direction.Left);
        return array;
    },
    fromVector: function(v) {
        var dirs = this.values();
        
        for(var i = 0; i < dirs.length; i++) {
            if(v.equals(dirs[i].delta))
                return dirs[i];
        }
        
        throw "Unrecognized direction vecotr.";
    }
};