goog.provide('KMap.Action');
goog.provide('KMap.Action.MapAction');

goog.require('KMap');

goog.require('ol.Map');
goog.require('ol.Object');
goog.require('ol.events.Event');

/**
 * @typedef {function(this: KMap.Action.MapAction):void}
 */
KMap.MapActionFunction;

/**
 * 地图动作基类
 * @constructor
 * @param {MapX.MapActionOptions} options
 * @extends {ol.Object}
 * @abstract
 * @api
 */
KMap.Action.MapAction = function (options) {

    ol.Object.call(this);
    
    /**
     * @type {string}
     * @api
     */
    this.actionName = options.actionName;
    /**
     * @type {KMap.Map}
     */
    this.map_ = null;
};
ol.inherits(KMap.Action.MapAction, ol.Object);

/**
 * @type {string}
 * @api
 */
KMap.Action.MapAction.prototype.actionName;

/**
 * 响应动作
 * @api
 */
KMap.Action.MapAction.prototype.activate = function () {
    console.log(this);
};

/**
 * 销毁Action
 * @api
 */
KMap.Action.MapAction.prototype.deactivate = function () {
    
};

/**
 * 设置为活动Action
 * @param {KMap.Map} map
 * @api
 */
KMap.Action.MapAction.prototype.setMap = function (map) {
    if (this.map_) {
        var thiz = /**@type {Object}*/ (this);
        thiz["deactivate"]();
        this.dispatchEvent(new ol.events.Event('deactivate'));
    }
    this.map_ = map;
    if (this.map_) {
        var thiz = /**@type {Object}*/ (this);
        thiz["activate"]();
        this.dispatchEvent(new ol.events.Event('activate'));
    }
};

/**
 * 返回内部地图对象
 * @return {KMap.Map}
 * @api
 */
KMap.Action.MapAction.prototype.getMap = function () {
    return this.map_;
};

/**
 * @api
 */
KMap.Action.MapAction.prototype.on = function (type, listener, opt_this) {
    return ol.Object.prototype.on.call(this, type, listener, opt_this);
};

/**
 * @api
 */
KMap.Action.MapAction.prototype.un = function (type, listener, opt_this) {
    ol.Object.prototype.un.call(this, type, listener, opt_this);
};