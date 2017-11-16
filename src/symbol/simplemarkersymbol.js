goog.provide('KMap.SimpleMarkerSymbol');

goog.require('KMap.Symbol');
goog.require('ol.style.Icon');
goog.require('ol.style.Circle');
goog.require('ol.style.Fill');

/**
 * @api
 * @constructor
 * @extends {KMap.Symbol}
 * @param {MapX.MarkerSymbolOptions|ol.style.Style} options
 */
KMap.SimpleMarkerSymbol = function (options) {
    KMap.Symbol.call(this, options);
};
ol.inherits(KMap.SimpleMarkerSymbol, KMap.Symbol);

/**
 * @param {ol.style.Style} style
 * @param {Object} options
 */
KMap.SimpleMarkerSymbol.prototype.init = function (style, options) {
    var markerOptions = /** @type {MapX.MarkerSymbolOptions} */ (options);
    var circleOptions = /** @type {olx.style.CircleOptions} */ ({
        radius: markerOptions.radius,
        anchor: markerOptions.anchor,
        opacity: markerOptions.opacity,
        offset: markerOptions.offset,
        scale: markerOptions.scale,
        stroke: new ol.style.Stroke({
            color: markerOptions.stroke,
            width: markerOptions.width
        }),
        fill: new ol.style.Fill({
            color: markerOptions.fill
        })
    });
    var image = new ol.style.Circle(circleOptions);
    style.setImage(image);
};

/**
 * @return {KMap.Symbol.Type}
 */
KMap.SimpleMarkerSymbol.prototype.getType = function () {
    return KMap.Symbol.Type.SimpleMarkerSymbol;
};

/**
 * 
 * @param {number} opacity 
 * @api
 */
KMap.SimpleMarkerSymbol.prototype.setOpacity = function (opacity) {
    var style = this.getStyle();
    var image = style.getImage();
    image.setOpacity(opacity);
};

/**
 * 
 * @param {number} rotation 
 * @api
 */
KMap.SimpleMarkerSymbol.prototype.setRotation = function (rotation) {
    var style = this.getStyle();
    var image = style.getImage();
    image.setRotation(rotation);
};

/**
 * 
 * @param {number} angle 
 * @api
 */
KMap.SimpleMarkerSymbol.prototype.setAngle = function (angle) {
    var style = this.getStyle();
    var image = style.getImage();
    image.setRotation(angle * Math.PI / 180);
};

/**
 * 
 * @param {number} scale 
 * @api
 */
KMap.SimpleMarkerSymbol.prototype.setScale = function (scale) {
    var style = this.getStyle();
    var image = style.getImage();
    image.setScale(scale);
};