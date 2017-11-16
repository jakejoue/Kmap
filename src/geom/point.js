goog.provide('KMap.Point');

goog.require('KMap');
goog.require('KMap.Geometry');
goog.require('ol.geom.Point');

/**
 * @constructor
 * @extends {KMap.Geometry}
 * @param {ol.Coordinate | ol.geom.Point} coordinate
 * @api
 */
KMap.Point = function (coordinate) {
  var geometry;
  if (coordinate instanceof ol.geom.Point) {
    geometry = /**@type {ol.geom.Point} */ (coordinate);
  } else {
    var coord = /**@type {ol.Coordinate} */ (coordinate);
    geometry = new ol.geom.Point(coord);
  }
  KMap.Geometry.call(this, geometry);
}
ol.inherits(KMap.Point, KMap.Geometry);

/**
 * @api
 * @param {ol.Coordinate} coord
 */
KMap.Point.prototype.setCoordinates = function (coord) {
  var geom = /**@type {ol.geom.Point} */ (this.getGeometry());
  geom.setCoordinates(coord);
}
