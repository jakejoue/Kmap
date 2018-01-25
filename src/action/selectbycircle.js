goog.provide('KMap.Action.SelectByCircle');

goog.require('KMap');

goog.require('KMap.Action');
goog.require('KMap.Action.MapAction');

goog.require('ol.interaction.Draw');

/**
 * 圈选动作
 * @constructor
 * @extends {KMap.Action.MapAction}
 * @param {*} options
 * @api
 */
KMap.Action.SelectByCircle = function (options) {
  KMap.Action.MapAction.call(this, {
    actionName: options.actionName
  });

  /**
   * @type {ol.interaction.Draw}
   */
  this.drawCircle_ = new ol.interaction.Draw({
    type: /** @type {ol.geom.GeometryType} */ ("Circle"),
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        width: 3,
        color: [255, 0, 146, 1]
      }),
      fill: new ol.style.Fill({
        color: [255, 0, 146, 0.4]
      })
    }),
    freehand: true
  });
};
ol.inherits(KMap.Action.SelectByCircle, KMap.Action.MapAction);

KMap.Action.SelectByCircle.prototype.handleCircleStart = function () {
  this.dispatchEvent(new KMap.Action.SelectByCircle.Event('circleStart'));
};

KMap.Action.SelectByCircle.prototype.handleCircleEnd = function (event) {
  var extent = event.feature.getGeometry().getExtent();
  this.dispatchEvent(new KMap.Action.SelectByCircle.Event('circleEnd', extent));
};

/**
 * @override
 */
KMap.Action.SelectByCircle.prototype.activate = function () {
  this.drawCircle_.on("drawstart", this.handleCircleStart, this);
  this.drawCircle_.on("drawend", this.handleCircleEnd, this);
  var map = this.map_.getMap();
  map.addInteraction(this.drawCircle_)
};

/**
 * @override
 */
KMap.Action.SelectByCircle.prototype.deactivate = function () {
  this.drawCircle_.un("drawstart", this.handleCircleStart, this);
  this.drawCircle_.un("drawend", this.handleCircleEnd, this);
  var map = this.map_.getMap();
  map.removeInteraction(this.drawCircle_);
};

/**
 * @api
 * @constructor
 * @extends {ol.events.Event}
 * @param {string} type
 * @param {ol.Extent=} extent
 */
KMap.Action.SelectByCircle.Event = function (type, extent) {

  ol.events.Event.call(this, type);
  /**
   * @api
   * @type {ol.Extent|undefined|null}
   */
  this.extent = extent;
};
ol.inherits(KMap.Action.SelectByCircle.Event, ol.events.Event);
