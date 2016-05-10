function GraphicFactory() {
    
}

GraphicFactory.prototype.createFromFile = function(path, callback) {
    var img = new Image();
    img.onload = function() {
        callback(new Graphic(img, 0, 0, 0, 0, img.width, img.height));
    };
    
    img.src = path;
};