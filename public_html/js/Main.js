var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;

var world;

window.onload = function() {
    var dt = 1000/30;
    var canvas = document.getElementById("mainCanvas").getContext("2d");
    game = new Game(CANVAS_WIDTH, CANVAS_HEIGHT);

    var last = Date.now();
    setInterval(function() {
      var now = Date.now();
      var deltaTime = now - last;
      last = now;
      game.update(deltaTime);
      game.draw(canvas, 0, 0);
    }, dt);
    
};