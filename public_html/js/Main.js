/**
 * Main game loop and event handling code.
 */

var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;

var world;

var cursorLocation = new Vector(0, 0);
var canvas = null;
var game = null;

/**
 * Translate the page x & y coordinates of the specified event to canvas space
 * @param {type} e Even to get location from
 * @returns {Vector} The location in canvas space.
 */
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

    var logoFade = function () {
        var logoDiv = document.getElementById("logoDiv");
        var opacity = parseFloat(logoDiv.style.opacity === "" ? "1.0" : logoDiv.style.opacity);

        if (opacity > 0) {
            logoDiv.style.opacity = opacity - .05;
            setTimeout(logoFade, 100);
        }
    };

    logoFade();
    cycle();

    $("#mainDiv").scrollintoview({duration: 3000});
    
    var lastLocation = new Vector();
    canvas.addEventListener("touchstart", function (e) {
        e.preventDefault();
        lastLocation = getLocation(e.touches[e.touches.length - 1]);
        game.onMouseDown(lastLocation);
        canvas.scrollIntoView();
    }, false);

    canvas.addEventListener("touchend", function (e) {
        e.preventDefault();
        game.onMouseUp(lastLocation);
    }, false);

    canvas.addEventListener("touchmove", function (e) {
        e.preventDefault();
        lastLocation = getLocation(e.touches[e.touches.length - 1]);
        game.onMouseMove(lastLocation);
    }, false);

    canvas.onmousemove = function (e) {
        game.onMouseMove(getLocation(e));
    };

    canvas.onmousedown = function (e) {
        game.onMouseDown(getLocation(e));
    };

    canvas.onmouseup = function (e) {
        game.onMouseUp(getLocation(e));
    };
};