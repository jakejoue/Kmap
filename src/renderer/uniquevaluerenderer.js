goog.provide('KMap.UniqueValueRenderer');

goog.require('KMap');
goog.require('KMap.Symbol');

/**
 * @constructor
 * @extends {KMap.Renderer}
 * @param {KMap.Symbol} defaultSymbol
 * @param {string} attributeField
 * @api
 */
KMap.UniqueValueRenderer = function (defaultSymbol, attributeField) {
    KMap.Renderer.call(this);

    /**
     * @type {KMap.Symbol}
     */
    this.defaultSymbol_ = defaultSymbol;
    /**
     * @type {boolean}
     */
    this.defaultEnable_ = true;
    /**
     * @type {string}
     */
    this.attributeField_ = attributeField;
    /**
     * @type {Object.<string, KMap.Symbol>}
     */
    this.symbols_ = {};
};
ol.inherits(KMap.UniqueValueRenderer, KMap.Renderer);

/**
 * 
 * @param {KMap.Graphic} graphic
 * @return {KMap.Symbol}
 * @api
 */
KMap.UniqueValueRenderer.prototype.getSymbol = function (graphic) {
    var symbol = null;
    if (graphic) {
        var value = graphic.getAttribute(this.attributeField_);
        if (value !== undefined && value !== null) {
            symbol = this.symbols_[value.toString()];
        }
    }
    return symbol;
};

/**
 * 
 * 
 * @param {string} value 
 * @param {KMap.Symbol} symbol
 * @api
 */
KMap.UniqueValueRenderer.prototype.addValue = function (value, symbol) {
    this.symbols_[value.toString()] = symbol;
};

/**
 * 
 * @param {string} value 
 * @api
 */
KMap.UniqueValueRenderer.prototype.removeValue = function (value) {
    if (this.symbols_[value.toString()]) {
        delete this.symbols_[value];
    }
};