goog.provide('KMap.Polygon');

goog.require('KMap');
goog.require('ol.geom.Polygon');

/**
 * @constructor
 * @extends {KMap.Geometry}
 * @param  {Array.<Array.<ol.Coordinate>> | ol.geom.Polygon} coordinates
 * @api
 */
KMap.Polygon = function (coordinates) {
    var geometry;
    if (coordinates instanceof ol.geom.Polygon) {
        geometry = /**@type {ol.geom.Polygon} */ (coordinates);
    } else {
        geometry = new ol.geom.Polygon(coordinates);
    }
    KMap.Geometry.call(this, geometry);
}
ol.inherits(KMap.Polygon, KMap.Geometry);

/**
 * @api
 * @return {ol.Coordinate}
 */
KMap.Polygon.prototype.getInteriorCoord = function () {
    return /** @type {ol.geom.Polygon}*/ (this.geometry_).getInteriorPoint().getCoordinates();
}
