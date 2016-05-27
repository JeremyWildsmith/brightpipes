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

    if (e.offsetX && e.offsetY)
        return new Vector(e.offsetX, e.offsetY);
    else {
        var canvasRect = canvas.getBoundingClientRect();
        return new Vector(e.clientX - canvasRect.left, e.clientY - canvasRect.top);
    }
}

/**
 * Sets up the game loop.
 */
window.onload = function () {
    lowLag.init();
    
    var bgrMusic = new Audio('sound/thisislife.wav');
    var repeatMethod = function () {
        bgrMusic = new Audio('sound/thisislife.wav');
        bgrMusic.addEventListener('ended', repeatMethod, false);
        bgrMusic.play();
    };
    bgrMusic.addEventListener('ended', repeatMethod, false);
    bgrMusic.play();

    var dt = 33;
    canvas = document.getElementById("mainCanvas");
    canvas.width = window.innerWidth;
    var g = canvas.getContext("2d");
    game = new Game(canvas.width, canvas.height);

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
        var logoDiv = document.getElementById("logoImg");
        var opacity = parseFloat(logoDiv.style.opacity === "" ? "1.0" : logoDiv.style.opacity);
        if (opacity > 0) {
            logoDiv.style.opacity = opacity - .05;
            setTimeout(logoFade, 100);
        }

        if (opacity === 0.7)
            $("#mainDiv").scrollintoview({duration: 3000});
    };

    setTimeout(function () {
        logoFade();
    }, 1000);

    cycle();

    var lastLocation = new Vector();
    canvas.addEventListener("touchstart", function (e) {
        e.preventDefault();
        lastLocation = getLocation(e.touches[e.touches.length - 1]);
        game.onMouseDown(lastLocation);
        return false;
    }, false);

    canvas.addEventListener("touchend", function (e) {
        e.preventDefault();
        game.onMouseUp(lastLocation);
        return false;
    }, false);

    canvas.addEventListener("touchmove", function (e) {
        e.preventDefault();
        lastLocation = getLocation(e.touches[e.touches.length - 1]);
        game.onMouseMove(lastLocation);
        return false;
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

/**
 * Register an event listener to tunnel all key events in to the game.
 */
window.addEventListener('keydown', function (e) {
    game.onKeyDown(e.keyCode);
    e.preventDefault();
}, false);
