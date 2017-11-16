goog.provide('KMap.Action.MapLocation');

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
 * @param {MapX.MapLocationOptions} options
 * @api
 */
KMap.Action.MapLocation = function (options) {
    KMap.Action.MapAction.call(this, { actionName: options.actionName });

    /**
     * @type {MapX.LocationFunction}
     */
    this.locationFunction_ = options.locationFunction;
};
ol.inherits(KMap.Action.MapLocation, KMap.Action.MapAction);

/**
 * @override
 */
KMap.Action.MapLocation.prototype.activate = function () {
    var map = this.map_.getMap();
    map.once('click', function (e) {
        this.locationFunction_(e.coordinate);
    }, this);
};

/**
 * @override
 */
KMap.Action.MapLocation.prototype.deactivate = function () {

};
