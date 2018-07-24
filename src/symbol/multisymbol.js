goog.provide('KMap.MultiSymbol');

goog.require('KMap.Symbol');
goog.require('ol.style.Fill');
goog.require('ol.style.Stroke');
goog.require('ol.style.Text');

/**
 * @api
 * @constructor
 * @extends {KMap.Symbol}
 * @param {Object|ol.style.Style} options
 */
KMap.MultiSymbol = function(options) {
    KMap.Symbol.call(this, options);
};
ol.inherits(KMap.MultiSymbol, KMap.Symbol);

/**
 * @param {ol.style.Style} style
 * @param {Object} options
 */
KMap.MultiSymbol.prototype.init = function(style, options) {
    if (options.Fill) {
        style.setFill(options.Fill.getStyle().getFill());
    }
    if (options.Image) {
        style.setImage(options.Image.getStyle().getImage());
    }
    if (options.Stroke) {
        style.setFill(options.Stroke.getStyle().getStroke());
    }
    if (options.Text) {
        style.setText(options.Text.getStyle().getText());
    }
};

/**
 * @api
 */
KMap.MultiSymbol.prototype.getType = function() {
    return KMap.Symbol.Type.MultiSymbol;
}