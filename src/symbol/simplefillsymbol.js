goog.provide('KMap.SimpleFillSymbol');

goog.require('KMap.Symbol');
goog.require('ol.style.Fill');
goog.require('ol.style.Stroke');

/**
 * @api
 * @constructor
 * @extends {KMap.Symbol}
 * @param {MapX.FillSymbolOptions|ol.style.Style} options
 */
KMap.SimpleFillSymbol = function (options) {
    KMap.Symbol.call(this, options);
};
ol.inherits(KMap.SimpleFillSymbol, KMap.Symbol);

/**
 * @param {ol.style.Style} style
 * @param {Object} options
 */
KMap.SimpleFillSymbol.prototype.init = function (style, options) {
    var fillOptions = /** @type {MapX.FillSymbolOptions} */ (ol.obj.assign({}, options));
    if (options.stroke) {
        var stroke = options.stroke;
        style.setStroke(stroke.getStyle().getStroke());
    }
    if (options.fill) {
        var fill = new ol.style.Fill({
            color: fillOptions.fill
        });
        style.setFill(fill);
    }
};

/**
 * @return {KMap.Symbol.Type}
 */
KMap.SimpleFillSymbol.prototype.getType = function () {
    return KMap.Symbol.Type.SimpleFillSymbol;
};