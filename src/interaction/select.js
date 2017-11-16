goog.provide('KMap.Interaction.Select');

goog.require('KMap');
goog.require('KMap.Symbol');
goog.require('KMap.Graphic');
goog.require('KMap.GraphicsLayer');

goog.require('ol.interaction.Select');

/**
 * 选择
 * @api
 * @constructor
 * @param {olx.interaction.SelectOptions} options
 * @extends {ol.interaction.Select}
 */
KMap.Interaction.Select = function (options) {
  options = options || {};

  /**
   * @type {string}
   */
  var condition = options['condition'];
  if (condition) {
    options['condition'] = KMap.Conditions[condition];
  }

  /**
   * @type {Array.<KMap.GraphicsLayer>}
   */
  var layers = options['layers'];
  if (layers) {
    options['layers'] = layers.map(function (layer) {
      return layer.getLayer();
    });
  }

  /**
   * @type {KMap.Symbol}
   */
  var symbol = options['symbol'];
  if (symbol) {
    options['style'] = symbol.getStyle();
  }

  ol.interaction.Select.call(this, options);
};

ol.inherits(KMap.Interaction.Select, ol.interaction.Select);

/**
 * 是否是有效选择
 * @api
 */
KMap.Interaction.Select.prototype.isSelect = function () {
  if (this.getFeatures().getLength() > 0) {
    return true;
  }
  return false;
}

/**
 * 获得所选
 * @api
 * @return {Array.<KMap.Graphic>}
 */
KMap.Interaction.Select.prototype.getSelect = function () {
  var graphics = [];
  if (this.isSelect()) {
    var featureArr = this.getFeatures().getArray();
    graphics = featureArr.map(function (feature) {
      return new KMap.Graphic(feature);
    });
  }
  return graphics;
}

/**
 * 删除所选
 * @api
 */
KMap.Interaction.Select.prototype.deleteSelect = function () {
  if (this.isSelect()) {
    this.getFeatures().forEach(function (feature) {
      var source = this.getLayer(feature).getSource();
      source.removeFeature(feature);
    }, this);
    this.clearSelect();
  }
}

/**
 * 清空选择
 * @api
 */
KMap.Interaction.Select.prototype.clearSelect = function () {
  this.getFeatures().clear();
}

/**
 * @api
 */
KMap.Interaction.Select.prototype.on = function (type, listener, opt_this) {
  return ol.interaction.Select.prototype.on.call(this, type, listener, opt_this);
}

/**
 * @api
 */
KMap.Interaction.Select.prototype.un = function (type, listener, opt_this) {
  ol.interaction.Select.prototype.un.call(this, type, listener, opt_this);
}

/**
 * @api
 */
KMap.Interaction.Select.prototype.setActive = function (active) {
  if (!active) this.clearSelect();
  ol.interaction.Select.prototype.setActive.call(this, active);
}

/**
 * @api
 */
KMap.Conditions = {
  'altKeyOnly': ol.events.condition.altKeyOnly,
  'altShiftKeysOnly': ol.events.condition.altShiftKeysOnly,
  'always': ol.events.condition.always,
  'click': ol.events.condition.click,
  'doubleClick': ol.events.condition.doubleClick,
  'mouseOnly': ol.events.condition.mouseOnly,
  'never': ol.events.condition.never,
  'noModifierKeys': ol.events.condition.noModifierKeys,
  'platformModifierKeyOnly': ol.events.condition.platformModifierKeyOnly,
  'pointerMove': ol.events.condition.pointerMove,
  'primaryAction': ol.events.condition.primaryAction,
  'shiftKeyOnly': ol.events.condition.shiftKeyOnly,
  'singleClick': ol.events.condition.singleClick,
  'targetNotEditable': ol.events.condition.targetNotEditable
}
