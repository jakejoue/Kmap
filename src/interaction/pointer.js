goog.provide('KMap.Interaction.Pointer');

goog.require('KMap');
goog.require('ol.interaction.Pointer');

/**
 * 选择
 * @api
 * @constructor
 * @param {olx.interaction.PointerOptions} options
 * @extends {ol.interaction.Pointer}
 */
KMap.Interaction.Pointer = function (options) {
    ol.interaction.Pointer.call(this, options);
};
ol.inherits(KMap.Interaction.Pointer, ol.interaction.Pointer);

