var Direction = {
    Up : {value: 0, name: "Up", delta: new Vector(0, -1) },
    Down : {value: 1, name: "Up", delta: new Vector(0, 1) },
    Right : {value: 2, name: "Up", delta: new Vector(1, 0) },
    Left : {value: 3, name: "Up", delta: new Vector(-1, 0) },
    values: function() {
        var array = [];
        array.push(Direction.Up);
        array.push(Direction.Down);
        array.push(Direction.Right);
        array.push(Direction.Left);
        return array;
    }
};