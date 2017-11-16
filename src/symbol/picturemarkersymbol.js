goog.provide('KMap.PictureMarkerSymbol');

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
KMap.PictureMarkerSymbol = function (options) {
    KMap.Symbol.call(this, options);
};
ol.inherits(KMap.PictureMarkerSymbol, KMap.Symbol);

/**
 * @param {ol.style.Style} style
 * @param {Object} options
 */
KMap.PictureMarkerSymbol.prototype.init = function (style, options) {
    var markerOptions = /** @type {MapX.MarkerSymbolOptions} */ (options);
    var circleOptions = /** @type {olx.style.IconOptions} */ ({
        anchor: markerOptions.anchor,
        opacity: markerOptions.opacity,
        rotation: markerOptions.rotation,
        size: markerOptions.size,
        offset: markerOptions.offset,
        color: markerOptions.color,
        scale: markerOptions.scale,
        src: markerOptions.src
    });
    var image = new ol.style.Icon(circleOptions);
    style.setImage(image);
};

/**
 * @return {KMap.Symbol.Type}
 */
KMap.PictureMarkerSymbol.prototype.getType = function () {
    return KMap.Symbol.Type.PictureMarkerSymbol;
};

/**
 * 
 * @param {number} opacity 
 * @api
 */
KMap.PictureMarkerSymbol.prototype.setOpacity = function (opacity) {
    var style = this.getStyle();
    var image = style.getImage();
    image.setOpacity(opacity);
};

/**
 * 
 * @param {number} rotation 
 * @api
 */
KMap.PictureMarkerSymbol.prototype.setRotation = function (rotation) {
    var style = this.getStyle();
    var image = style.getImage();
    image.setRotation(rotation);
};

/**
 * 
 * @param {number} angle 
 * @api
 */
KMap.PictureMarkerSymbol.prototype.setAngle = function (angle) {
    this.setRotation(angle * Math.PI / 180);
};

/**
 * 
 * @param {number} scale 
 * @api
 */
KMap.PictureMarkerSymbol.prototype.setScale = function (scale) {
    var style = this.getStyle();
    var image = style.getImage();
    image.setScale(scale);
};