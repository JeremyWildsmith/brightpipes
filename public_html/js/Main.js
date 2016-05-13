var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;

var world;

var cursorLocation = new Vector(0, 0);
var canvas = null;
var game = null;

function getLocation(e) {
    var x = 0;
    var y = 0;

    if (e.pageX || e.pageY) {
        x = e.pageX;
        y = e.pageY;
    } else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;

    return new Vector(x, y);
}

window.onload = function () {
    var dt = 33;
    canvas = document.getElementById("mainCanvas");
    var g = canvas.getContext("2d");
    game = new Game(CANVAS_WIDTH, CANVAS_HEIGHT);

    var last = Date.now();

    var cycle = function () {
        var now = Date.now();
        var deltaTime = now - last;
        last = now;
        game.update(deltaTime);
        game.draw(g, 0, 0);

        setTimeout(cycle, dt);
    };

    cycle();
};

document.onmousemove = function (e) {
    game.onMouseMove(getLocation(e));
};

document.onmousedown = function (e) {
    game.onMouseDown(getLocation(e));
};

document.onmouseup = function (e) {
    game.onMouseUp(getLocation(e));
};