goog.provide('KMap.Extent');

goog.require('KMap');
goog.require('KMap.Point');
goog.require('ol.extent');

/**
 * @param {ol.Extent} extent
 * @param {number} value
 * @return {ol.Extent}
 * @api
 */
KMap.Extent.expand = function (extent, value) {
    var center = ol.extent.getCenter(extent);
    var width = ol.extent.getWidth(extent) * value;
    var height = ol.extent.getHeight(extent) * value;
    return [center[0] - (width / 2), center[1] - (height / 2), center[0] + (width / 2), center[1] + (height / 2)];
};

/**
 * @param {ol.Extent} extent
 * @param {KMap.Point | ol.Coordinate} point
 * @return {boolean}
 * @api
 */
KMap.Extent.contains = function (extent, point) {
    if (!extent || !point) {
        return false;
    }
    var coord = [];
    if (point instanceof KMap.Point) {
        coord = point.getCoordinates();
    } else {
        coord = /**@type {ol.Coordinate} */ (point);
    }
    return ol.extent.containsCoordinate(extent, coord);
};