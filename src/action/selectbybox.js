goog.provide('KMap.Action.SelectByBox');

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
 * @param {MapX.SelectByBoxOptions} options
 * @api
 */
KMap.Action.SelectByBox = function (options) {
    KMap.Action.MapAction.call(this, { actionName: options.actionName });

    /**
     * @type {ol.EventsConditionType}
     */
    this.condition_ = ol.events.condition.always; // ol.events.condition.platformModifierKeyOnly

    /**
     * @type {ol.interaction.DragBox}
     */
    this.dragBox_ = null;
};
ol.inherits(KMap.Action.SelectByBox, KMap.Action.MapAction);

KMap.Action.SelectByBox.prototype.handleBoxEnd = function () {
    var extent = this.dragBox_.getGeometry().getExtent();
    this.dispatchEvent(new KMap.Action.SelectByBox.Event('boxEnd', extent));
};

KMap.Action.SelectByBox.prototype.handleBoxStart = function () {
    this.dispatchEvent(new KMap.Action.SelectByBox.Event('boxStart'));
};

/**
 * @override
 */
KMap.Action.SelectByBox.prototype.activate = function () {
    // a DragBox interaction used to select features by drawing boxes
    this.dragBox_ = new ol.interaction.DragBox({
        condition: this.condition_
    });

    this.dragBox_.on('boxstart', this.handleBoxStart, this);
    this.dragBox_.on('boxend', this.handleBoxEnd, this);

    var map = this.map_.getMap();
    map.addInteraction(this.dragBox_);
};

/**
 * @override
 */
KMap.Action.SelectByBox.prototype.deactivate = function () {
    if (this.dragBox_) {
        this.dragBox_.un('boxstart', this.handleBoxStart, this);
        this.dragBox_.un('boxend', this.handleBoxEnd, this);

        var map = this.map_.getMap();
        map.removeInteraction(this.dragBox_);
        this.dragBox_ = null;
    }
};

/**
 * @api
 * @constructor
 * @extends {ol.events.Event}
 * @param {string} type
 * @param {ol.Extent=} extent
 */
KMap.Action.SelectByBox.Event = function (type, extent) {

    ol.events.Event.call(this, type);
    /**
     * @api
     * @type {ol.Extent|undefined|null}
     */
    this.extent = extent;
};
ol.inherits(KMap.Action.SelectByBox.Event, ol.events.Event);