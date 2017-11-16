goog.provide('KMap.SimpleTextSymbol');

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
KMap.SimpleTextSymbol = function (options) {
    KMap.Symbol.call(this, options);
};
ol.inherits(KMap.SimpleTextSymbol, KMap.Symbol);

/**
 * @param {ol.style.Style} style
 * @param {Object} options
 */
KMap.SimpleTextSymbol.prototype.init = function (style, options) {
    /**
     * @type {ol.style.Text}
     */
    var text = new ol.style.Text({
        font: options["font"],
        offsetX: options["offsetX"],
        offsetY: options["offsetY"],
        text: options["text"]
    });
    if (options.stroke) {
        var stroke = new ol.style.Stroke({
            color: options["stroke"],
            width: options["width"]
        });
        text.setStroke(stroke);
    }
    if (options.fill) {
        var fill = new ol.style.Fill({
            color: options["fill"]
        });
        text.setFill(fill);
    }
    style.setText(text);
};

/**
 * @return {KMap.Symbol.Type}
 */
KMap.SimpleTextSymbol.prototype.getType = function () {
    return KMap.Symbol.Type.SimpleTextSymbol;
};

/**
 * @return {string|undefined}
 * @api
 */
KMap.SimpleTextSymbol.prototype.getText = function () {
    var style = this.getStyle();
    var text = style.getText();
    return text.getText();
};

/**
 * @param {string} value
 * @api
 */
KMap.SimpleTextSymbol.prototype.setText = function (value) {
    var style = this.getStyle();
    var text = style.getText();
    text.setText(value);
};