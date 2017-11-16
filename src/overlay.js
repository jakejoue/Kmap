goog.provide('KMap.Overlay');

goog.require('KMap');
goog.require('ol.Overlay');

/**
 * @constructor
 * @extends {ol.Overlay}
 * @param {olx.OverlayOptions} opt_options 
 * @api
 */
KMap.Overlay = function (opt_options) {

    ol.Overlay.call(this, opt_options);

    /**
     * @type {KMap.Graphic}
     */
    this.selectedFeature_ = null;
};
ol.inherits(KMap.Overlay, ol.Overlay);

/**
 * @api
 */
KMap.Overlay.prototype.setPosition = function (position) {
    return ol.Overlay.prototype.setPosition.call(this, position);
}

/**
 * @api
 */
KMap.Overlay.prototype.setElement = function (position) {
    return ol.Overlay.prototype.setElement.call(this, position);
}