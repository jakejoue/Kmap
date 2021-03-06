goog.provide('KMap.Circle');

goog.require('KMap');
goog.require('KMap.Point');

goog.require('ol.geom.Circle');

/**
 * @constructor
 * @extends {KMap.Geometry}
 * @param  {ol.Coordinate | ol.geom.Circle | KMap.Point} options
 * @param  {number} radius
 * @api
 */
KMap.Circle = function (options, radius) {
    var geometry;
    if (options instanceof ol.geom.Circle) {
        geometry = /**@type {ol.geom.Circle} */ (options);
    } else if (options instanceof KMap.Point) {
        var center  = /**@type {KMap.Point} */ (options);
        geometry = new ol.geom.Circle(center.getCoordinates(), radius); 
    } else {
        var center = /**@type {ol.Coordinate} */ (options);
        geometry = new ol.geom.Circle(center, radius); 
    }
    KMap.Geometry.call(this, geometry);
}
ol.inherits(KMap.Circle, KMap.Geometry);
