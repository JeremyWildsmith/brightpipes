/**
 * A list of pipes that can be used in the game as well as methods to easily create
 * them.
 */

var Pipes = {
    Vertical: {value: 0, create: function () {
            var dirs = [];

            dirs.push(Direction.Up);
            dirs.push(Direction.Down);

            var graphic = new LoadingGraphic("gfx/vertical.png");

            return new Pipe(graphic, dirs, Pipes.Vertical, true);
        }},
    Horizontal: {value: 1, create: function () {
            var dirs = [];

            dirs.push(Direction.Left);
            dirs.push(Direction.Right);

            var graphic = new LoadingGraphic("gfx/horizontal.png");

            return new Pipe(graphic, dirs, Pipes.Horizontal, true);
        }},
    RightDown: {value: 2, create: function () {
            var dirs = [];

            dirs.push(Direction.Right);
            dirs.push(Direction.Down);

            var graphic = new LoadingGraphic("gfx/rightDown.png");

            return new Pipe(graphic, dirs, Pipes.RightDown, true);
        }},
    LeftDown: {value: 3, create: function () {
            var dirs = [];

            dirs.push(Direction.Left);
            dirs.push(Direction.Down);

            var graphic = new LoadingGraphic("gfx/leftDown.png");

            return new Pipe(graphic, dirs, Pipes.LeftDown, true);
        }},
    RightUp: {value: 4, create: function () {
            var dirs = [];

            dirs.push(Direction.Right);
            dirs.push(Direction.Up);

            var graphic = new LoadingGraphic("gfx/rightUp.png");

            return new Pipe(graphic, dirs, Pipes.RightUp, true);
        }},
    LeftUp: {value: 5, create: function () {
            var dirs = [];

            dirs.push(Direction.Left);
            dirs.push(Direction.Up);

            var graphic = new LoadingGraphic("gfx/leftUp.png");

            return new Pipe(graphic, dirs, Pipes.LeftUp, true);
        }},
    
    FixedVertical: {value: 6, create: function () {
            var dirs = [];

            dirs.push(Direction.Up);
            dirs.push(Direction.Down);

            var graphic = new LoadingGraphic("gfx/vertical.png");

            return new Pipe(graphic, dirs, Pipes.Vertical, false);
        }},
    FixedHorizontal: {value: 7, create: function () {
            var dirs = [];

            dirs.push(Direction.Left);
            dirs.push(Direction.Right);

            var graphic = new LoadingGraphic("gfx/horizontal.png");

            return new Pipe(graphic, dirs, Pipes.Horizontal, false);
        }},
    FixedRightDown: {value: 8, create: function () {
            var dirs = [];

            dirs.push(Direction.Right);
            dirs.push(Direction.Down);

            var graphic = new LoadingGraphic("gfx/rightDown.png");

            return new Pipe(graphic, dirs, Pipes.RightDown, false);
        }},
    FixedLeftDown: {value: 9, create: function () {
            var dirs = [];

            dirs.push(Direction.Left);
            dirs.push(Direction.Down);

            var graphic = new LoadingGraphic("gfx/leftDown.png");

            return new Pipe(graphic, dirs, Pipes.LeftDown, false);
        }},
    FixedRightUp: {value: 10, create: function () {
            var dirs = [];

            dirs.push(Direction.Right);
            dirs.push(Direction.Up);

            var graphic = new LoadingGraphic("gfx/rightUp.png");

            return new Pipe(graphic, dirs, Pipes.RightUp, false);
        }},
    FixedLeftUp: {value: 11, create: function () {
            var dirs = [];

            dirs.push(Direction.Left);
            dirs.push(Direction.Up);

            var graphic = new LoadingGraphic("gfx/leftUp.png");

            return new Pipe(graphic, dirs, Pipes.LeftUp, false);
        }},
    ////////////
    Pump: {value: 12, create: function () {
            var dirs = [];

            dirs.push(Direction.Down);

            var graphic = new LoadingGraphic("gfx/pump.png");

            var p = new Pipe(graphic, dirs, Pipes.Pump, false);
            p.setAsPump();

            return p;
        }},
    Drain: {value: 13, create: function () {
            var dirs = [];

            dirs.push(Direction.Up);
            dirs.push(Direction.Down);
            dirs.push(Direction.Left);
            dirs.push(Direction.Right);

            var graphic = new LoadingGraphic("gfx/drain.png");

            var p = new Pipe(graphic, dirs, Pipes.Drain, false, false);

            return p;
        }},
    Obstacle: {value: 14, create: function () {
            var dirs = [];

            var graphic = new LoadingGraphic("gfx/demoblock.png");

            var p = new Pipe(graphic, dirs, Pipes.Obstacle, false);

            return p;
        }},
    LeftRightDown: {value: 15, create: function () {
            var dirs = [];

            dirs.push(Direction.Down);
            dirs.push(Direction.Left);
            dirs.push(Direction.Right);

            var graphic = new LoadingGraphic("gfx/leftRightDown.png");

            return new Pipe(graphic, dirs, Pipes.LeftRightDown, false);
        }},
    LeftRightUp: {value: 16, create: function () {
            var dirs = [];

            dirs.push(Direction.Up);
            dirs.push(Direction.Left);
            dirs.push(Direction.Right);

            var graphic = new LoadingGraphic("gfx/leftRightUp.png");

            return new Pipe(graphic, dirs, Pipes.LeftRightUp, false);
        }},
    LeftUpDown: {value: 17, create: function () {
            var dirs = [];

            dirs.push(Direction.Down);
            dirs.push(Direction.Left);
            dirs.push(Direction.Up);

            var graphic = new LoadingGraphic("gfx/leftUpDown.png");

            return new Pipe(graphic, dirs, Pipes.LeftUpDown, false);
        }},
    RightUpDown: {value: 18, create: function () {
            var dirs = [];

            dirs.push(Direction.Down);
            dirs.push(Direction.Up);
            dirs.push(Direction.Right);

            var graphic = new LoadingGraphic("gfx/rightUpDown.png");

            return new Pipe(graphic, dirs, Pipes.RightUpDown, false);
        }},
    CrossPipe: {value: 19, create: function () {
            var dirs = [];

            dirs.push(Direction.Down);
            dirs.push(Direction.Up);
            dirs.push(Direction.Right);
            dirs.push(Direction.Left);

            var graphic = new LoadingGraphic("gfx/crossPipe.png");

            return new Pipe(graphic, dirs, Pipes.RightUpDown, false);
        }},
    
    values: function (includeComplex) {
        var array = [];

        array.push(Pipes.Vertical);
        array.push(Pipes.Horizontal);

        array.push(Pipes.RightDown);
        array.push(Pipes.LeftDown);

        array.push(Pipes.RightUp);
        array.push(Pipes.LeftUp);

        if (includeComplex) {
            array.push(Pipes.LeftRightDown);
            array.push(Pipes.LeftRightUp);
            array.push(Pipes.LeftUpDown);
            array.push(Pipes.RightUpDown);
        }

        return array;
    },
    complexValues: function () {
        var array = [];
        array.push(Pipes.LeftRightDown);
        array.push(Pipes.LeftRightUp);
        array.push(Pipes.LeftUpDown);
        array.push(Pipes.RightUpDown);

        return array;
    },
    obstacles: function () {
        var array = [];

        array.push(Pipes.Obstacle);

        array.push(Pipes.FixedVertical);
        array.push(Pipes.FixedHorizontal);

        array.push(Pipes.FixedRightDown);
        array.push(Pipes.FixedLeftDown);

        array.push(Pipes.FixedRightUp);
        array.push(Pipes.FixedLeftUp);
        return array;
    }
};