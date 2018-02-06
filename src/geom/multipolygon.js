goog.provide('KMap.MultiPolygon');

goog.require('KMap');
goog.require('ol.geom.MultiPolygon');

/**
 * @constructor
 * @extends {KMap.Geometry}
 * @param  {Array.<Array.<Array.<ol.Coordinate>>> | ol.geom.MultiPolygon} coordinates
 * @api
 */
KMap.MultiPolygon = function (coordinates) {
    var geometry;
    if (coordinates instanceof ol.geom.MultiPolygon) {
        geometry = /**@type {ol.geom.MultiPolygon} */ (coordinates);
    } else {
        geometry = new ol.geom.MultiPolygon(coordinates);
    }
    KMap.Geometry.call(this, geometry);
}
ol.inherits(KMap.MultiPolygon, KMap.Geometry);

/**
 * @api
 * @return {Array.<ol.Coordinate>}
 */
KMap.MultiPolygon.prototype.getInteriorCoords = function () {
    return /** @type {ol.geom.MultiPolygon}*/ (this.geometry_).getInteriorPoints().getCoordinates();
}