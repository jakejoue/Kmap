goog.provide('KMap.Collection');

goog.require('KMap');
goog.require('ol.Collection');

/**
 * @constructor
 * @extends {ol.Collection}
 * @param {!Array.<T>=} opt_array Array. 
 * @param {olx.CollectionOptions=} opt_options Collection options. 
 * @template T
 * @api
 */
KMap.Collection = function (opt_array, opt_options) {
    ol.Collection.call(this, opt_array, opt_options);
};
ol.inherits(KMap.Collection, ol.Collection);