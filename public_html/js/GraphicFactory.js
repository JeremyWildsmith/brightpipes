function GraphicFactory() {
    
}

GraphicFactory.prototype.createFromFile = function(path, callback) {
    var img = new Image();
    
    img.onload = function() {
        callback(new Graphic(img, img.width / 2, img.height / 2, 0, 0, img.width, img.height));
    };
    
    img.src = path;
};