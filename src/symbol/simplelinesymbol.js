goog.provide('KMap.SimpleLineSymbol');

goog.require('KMap.Symbol');
goog.require('ol.style.Stroke');

/**
 * @api
 * @constructor
 * @extends {KMap.Symbol}
 * @param {MapX.LineSymbolOptions|ol.style.Style} options
 */
KMap.SimpleLineSymbol = function (options) {
    KMap.Symbol.call(this, options);
};
ol.inherits(KMap.SimpleLineSymbol, KMap.Symbol);


/**
 * @param {ol.style.Style} style
 * @param {Object} options
 */
KMap.SimpleLineSymbol.prototype.init = function(style, options) {
    var lineOptions = /** @type {MapX.LineSymbolOptions} */ (ol.obj.assign({}, options));
    var stroke = new ol.style.Stroke({
        color: lineOptions.stroke,
        width: lineOptions.width,
        lineCap: lineOptions.lineCap,
        lineJoin: lineOptions.lineJoin,
        lineDash: lineOptions.lineDash,
        lineDashOffset: lineOptions.lineDashOffset,
        miterLimit: lineOptions.miterLimit
    });
    style.setStroke(stroke);
};

/**
 * @return {KMap.Symbol.Type}
 */
KMap.SimpleLineSymbol.prototype.getType = function () {
    return KMap.Symbol.Type.SimpleLineSymbol;
};