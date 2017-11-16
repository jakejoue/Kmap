goog.provide('KMap.SimpleRenderer');

goog.require('KMap');
goog.require('KMap.Symbol');
goog.require('ol.style.Fill');
goog.require('ol.style.Stroke');

/**
 * @constructor
 * @extends {KMap.Renderer}
 * @param {KMap.Symbol} symbol
 * @api
 */
KMap.SimpleRenderer = function(symbol) {
    KMap.Renderer.call(this);

    /**
     * @type {KMap.Symbol}
     */
    this.symbol_ = symbol;
};
ol.inherits(KMap.SimpleRenderer, KMap.Renderer);

 /**
  * 
  * @param {KMap.Graphic} graphic
  * @return {KMap.Symbol}
  * @api
  */
 KMap.SimpleRenderer.prototype.getSymbol = function (graphic) {
     return this.symbol_;
 };