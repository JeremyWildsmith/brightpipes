/**
 * Used to create graphic objects.
 */

function GraphicFactory() {
    
}

/**
 * Creates a graphic image from the specified path
 * @param {type} path The path of the image to load/create
 * @param {type} callback The callback, which is invoked when the image has loaded.
 * @returns {undefined}
 */
GraphicFactory.prototype.createFromFile = function(path, callback, originX, originY) {
    var img = new Image();
    
    img.onload = function() {
        callback(new Graphic(img, 
            originX === undefined ? img.width / 2 : originX,
            originY === undefined ? img.height / 2 : originY,
            0, 0,
            img.width, img.height));
    };
    
    img.src = path;
};