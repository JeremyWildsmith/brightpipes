var gfx = new NullGraphic();

function draw(g, x, y) {
    g.clearRect(0, 0, this.width, this.height);
    
    gfx.draw(g, x + 25, y + 25);
};

function update(deltaTime) { };

window.onload = function() {
    var dt = 1000/30;
    var canvas = document.getElementById("mainCanvas").getContext("2d");
    
    new GraphicFactory().createFromFile("/gfx/test.jpg", function(_gfx) {
        gfx = _gfx;
    });
    
    setInterval(function() {
        update(dt);
        draw(canvas, 0, 0);
    }, dt);
    
};