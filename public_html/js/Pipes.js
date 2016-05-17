/**
 * A list of pipes that can be used in the game as well as methods to easily create
 * them.
 */

var Pipes = {
    Vertical: {value: 0, create: function() {
            var dirs = [];
            
            dirs.push(Direction.Up);
            dirs.push(Direction.Down);
            
            var graphic = new LoadingGraphic("gfx/vertical.png");
            
            return new Pipe(graphic, dirs, Pipes.Vertical, true);
    }},

    Horizontal: {value: 1, create: function() {
            var dirs = [];
            
            dirs.push(Direction.Left);
            dirs.push(Direction.Right);
            
            var graphic = new LoadingGraphic("gfx/horizontal.png");
            
            return new Pipe(graphic, dirs, Pipes.Horizontal, true);
    }},
    
    RightDown: {value: 2, create: function() {
            var dirs = [];
            
            dirs.push(Direction.Right);
            dirs.push(Direction.Down);
            
            var graphic = new LoadingGraphic("gfx/rightDown.png");
            
            return new Pipe(graphic, dirs, Pipes.RightDown, true);
    }},

    LeftDown: {value: 3, create: function() {
            var dirs = [];
            
            dirs.push(Direction.Left);
            dirs.push(Direction.Down);
            
            var graphic = new LoadingGraphic("gfx/leftDown.png");
            
            return new Pipe(graphic, dirs, Pipes.LeftDown, true);
    }},
    
    RightUp: {value: 4, create: function() {
            var dirs = [];
            
            dirs.push(Direction.Right);
            dirs.push(Direction.Up);
            
            var graphic = new LoadingGraphic("gfx/rightUp.png");
            
            return new Pipe(graphic, dirs, Pipes.RightUp, true);
    }},

    LeftUp: {value: 5, create: function() {
            var dirs = [];
            
            dirs.push(Direction.Left);
            dirs.push(Direction.Up);
            
            var graphic = new LoadingGraphic("gfx/leftUp.png");
            
            return new Pipe(graphic, dirs, Pipes.LeftUp, true);
    }},

    Pump: {value: 6, create: function() {
            var dirs = [];
            
            dirs.push(Direction.Down);
            
            var graphic = new LoadingGraphic("gfx/pump.png");
            
            var p = new Pipe(graphic, dirs, Pipes.Pump, false);
            p.setAsPump();
            p.fill(null);
            
            return p;
    }},

    Drain: {value: 6, create: function() {
            var dirs = [];
            
            dirs.push(Direction.Up);
            dirs.push(Direction.Down);
            dirs.push(Direction.Left);
            dirs.push(Direction.Right);
            
            var graphic = new LoadingGraphic("gfx/drain.png");
            
            var p = new Pipe(graphic, dirs, Pipes.Drain, false);
            
            return p;
    }},

    Obstacle: {value: 7, create: function() {
            var dirs = [];
            
            var graphic = new LoadingGraphic("gfx/demoblock.png");
            
            return new Pipe(graphic, dirs, Pipes.Obstacle, false);
    }},

    values: function() {
        var array = [];
        
        array.push(Pipes.Vertical);
        array.push(Pipes.Horizontal);
        
        array.push(Pipes.RightDown);
        array.push(Pipes.LeftDown);
        
        array.push(Pipes.RightUp);
        array.push(Pipes.LeftUp);
        
        return array;
    }
};