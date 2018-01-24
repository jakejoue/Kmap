goog.provide('KMap.MultiPoint');

goog.require('KMap');
goog.require('ol.geom.MultiPoint');

/**
 * @constructor
 * @extends {KMap.Geometry}
 * @param  {Array.<ol.Coordinate> | ol.geom.MultiPoint} coordinates
 * @api
 */
KMap.MultiPoint = function (coordinates) {
    var geometry;
    if (coordinates instanceof ol.geom.MultiPoint) {
        geometry = /**@type {ol.geom.MultiPoint} */ (coordinates);
    } else {
        geometry = new ol.geom.MultiPoint(coordinates);
    }
    KMap.Geometry.call(this, geometry);
}
ol.inherits(KMap.MultiPoint, KMap.Geometry);