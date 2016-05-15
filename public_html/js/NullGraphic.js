/**
 * NullGraphic has no behaviour but has same interface as Graphic. For use when
 * a graphic is being loaded or failed in being loaded.
 */


function NullGraphic() {}

NullGraphic.prototype.draw = function(g, x, y) { };