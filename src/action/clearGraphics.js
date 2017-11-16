goog.provide('KMap.Action.ClearGraphics');

goog.require('KMap');

goog.require('KMap.Action');
goog.require('KMap.Action.MapAction');

goog.require('ol.Sphere');
goog.require('ol.source.Vector');
goog.require('ol.Overlay');

/**
 * 框选动作
 * @constructor
 * @extends {KMap.Action.MapAction}
 * @param {MapX.MapActionOptions} options
 * @api
 */
KMap.Action.ClearGraphics = function (options) {
    KMap.Action.MapAction.call(this, { actionName: options.actionName });
};
ol.inherits(KMap.Action.ClearGraphics, KMap.Action.MapAction);

/**
 * @override
 */
KMap.Action.ClearGraphics.prototype.activate = function () {
    
};

/**
 * @override
 */
KMap.Action.ClearGraphics.prototype.deactivate = function () {
    
};
