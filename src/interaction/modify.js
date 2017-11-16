goog.provide('KMap.Interaction.Modify');

goog.require('KMap');
goog.require('KMap.Graphic');
goog.require('KMap.GraphicsLayer');

goog.require('ol.Collection');
goog.require('ol.interaction.Select');
goog.require('ol.interaction.Modify');

/**
 * 编辑
 * @api
 * @constructor
 * @param {olx.interaction.ModifyOptions} options
 * @extends {ol.interaction.Modify}
 */
KMap.Interaction.Modify = function (options) {
  options = options || {};

  options['features'] = new ol.Collection([]);

  var graphics = /**@type {Array.<KMap.Graphic>}*/ (options['graphics']);
  if (graphics) {
    var features = graphics.map(function (graphic) {
      return graphic.getFeature();
    });
    options['features'] = new ol.Collection(features);
  }
  
  var select = /**@type {ol.interaction.Select}*/ (options['select']);
  if (select) {
    options['features'] = select.getFeatures();
  }

  this._features = options['features'];

  ol.interaction.Modify.call(this, options);
};

ol.inherits(KMap.Interaction.Modify, ol.interaction.Modify);

/**
 * @api
 * 添加可编辑图形
 * @param {Array.<KMap.Graphic>} graphics
 */
KMap.Interaction.Modify.prototype.addGraphics = function (graphics) {
  graphics.forEach(function (graphic) {
    var feature = graphic.getFeature();
    this._features.push(feature);
  }, this);
}

/**
 * @api
 * 移除可编辑图形
 * @param {Array.<KMap.Graphic>} graphics
 */
KMap.Interaction.Modify.prototype.removeGraphics = function (graphics) {
  graphics.forEach(function (graphic) {
    var feature = graphic.getFeature();
    this._features.remove(feature);
  }, this);
}

/**
 * @api
 * 获取所有可编辑的图形
 * @return {Array.<KMap.Graphic>}
 */
KMap.Interaction.Modify.prototype.getGraphics = function () {
  var graphics = this._features.getArray().map(function (feature) {
    return new KMap.Graphic(feature);
  });
  return graphics;
}

/**
 * @api
 * 清空编辑项
 */
KMap.Interaction.Modify.prototype.clear = function () {
  this._features.clear();
}

/**
 * @api
 */
KMap.Interaction.Modify.prototype.on = function (type, listener, opt_this) {
  var handle = function (e) {
    var graphics = e.features.getArray().map(function (feature) {
      return new KMap.Graphic(feature);
    });
    listener.call(this, {
      'target': this,
      'graphics': graphics,
      'mapBrowserEvent': e['mapBrowserEvent']
    });
  }
  listener['KEY'] = handle;
  return ol.interaction.Modify.prototype.on.call(this, type, handle, opt_this);
}

/**
 * @api
 */
KMap.Interaction.Modify.prototype.un = function (type, listener, opt_this) {
  var handle = listener['KEY'];
  ol.interaction.Modify.prototype.un.call(this, type, handle, opt_this);
}

/**
 * @api
 */
KMap.Interaction.Modify.prototype.setActive = function (active) {
  ol.interaction.Modify.prototype.setActive.call(this, active);
}
