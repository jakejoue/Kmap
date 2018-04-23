goog.provide('KMap.DynamicRenderer');

goog.require('KMap');
goog.require('KMap.Symbol');

/**
 * @constructor
 * @extends {KMap.Renderer}
 * @param {Function} getSymbol
 * @param {KMap.Symbol} defaultSymbol
 * @api
 */
KMap.DynamicRenderer = function(getSymbol, defaultSymbol) {
    KMap.Renderer.call(this);

    /**
     * @type {KMap.Symbol}
     */
    this.defaultSymbol_ = defaultSymbol;
    /**
     * @type {Function}
     */
    this.getSymbol_ = getSymbol;
};
ol.inherits(KMap.DynamicRenderer, KMap.Renderer);

/**
 * 
 * @param {KMap.Graphic} graphic
 * @return {KMap.Symbol}
 * @api
 */
KMap.DynamicRenderer.prototype.getSymbol = function(graphic) {
    var symbol = /**@type {KMap.Symbol}*/ (this.getSymbol_(graphic)) || this.defaultSymbol_;
    return symbol;
};
