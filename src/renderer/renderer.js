goog.provide('KMap.Renderer');

goog.require('KMap.Symbol');

/**
 * @constructor
 * @api
 */
KMap.Renderer = function() {

};

 /**
  * 
  * @param {KMap.Graphic} graphic
  * @return {KMap.Symbol}
  * @api
  */
 KMap.Renderer.prototype.getSymbol = function (graphic) {
     return null;
 };