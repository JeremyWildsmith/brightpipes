var Pipes = {
    Vertical: {value: 0, create: function() {
            
    }},
    Horizontal: {},
    
    RightDown: {},
    LeftDown: {},
    
    RightUp: {},
    LeftUp: {},
    values: function() {
        var array = [];
        
        array.push(Pipes.Vertical);
        array.push(Pipes.Horizontal);
        
        array.push(Pipes.LeftDown);
        array.push(Pipes.RightUp);
        
        array.push(Pipes.LeftUp);
        
        return array;
    }
};