goog.provide('KMap.Interaction.Draw');

goog.require('KMap');
goog.require('KMap.Graphic');
goog.require('KMap.Symbol');
goog.require('KMap.GraphicsLayer');

goog.require('ol.interaction.Snap')
goog.require('ol.interaction.Draw');

/**
 * 绘图
 * @api
 * @constructor
 * @param {olx.interaction.DrawOptions} options
 * @extends {ol.interaction.Draw}
 */
KMap.Interaction.Draw = function (options) {
  options = options || {};

  /**
   * 初始化图层
   * @type {KMap.GraphicsLayer}
   */
  var layer = options['layer'];
  this._source = layer.getSource();
  this._snap = new ol.interaction.Snap({
    source: this._source
  });
  options['source'] = this._source;

  /**
   * 元素样式
   * @type {KMap.Symbol}
   */
  var symbol = options['symbol'];
  if (symbol) {
    options['style'] = symbol.getStyle();
  }

  ol.interaction.Draw.call(this, options);
};

ol.inherits(KMap.Interaction.Draw, ol.interaction.Draw);

/**
 * @api
 */
KMap.Interaction.Draw.prototype.setActive = function (active) {
  ol.interaction.Draw.prototype.setActive.call(this, active);
  this._snap.setActive(active);
}

/**
 * @api
 */
KMap.Interaction.Draw.prototype.on = function (type, listener, opt_this) {
  var handle = function (e) {
    var graphic = new KMap.Graphic(e.feature);
    listener.call(this, {
      'type': type,
      'target': this,
      'graphic': graphic
    });
  };
  listener['KEY'] = handle;
  return ol.interaction.Draw.prototype.on.call(this, type, handle, opt_this);
}

/**
 * @api
 */
KMap.Interaction.Draw.prototype.un = function (type, listener, opt_this) {
  var handle = listener['KEY'];
  ol.interaction.Draw.prototype.un.call(this, type, handle, opt_this);
}

/**
 * 禁用地图双击缩放
 * @private
 * @param {boolean} active
 * @param {ol.Map} e
 */
KMap.Interaction.Draw.prototype._enableDoubleClickZoom = function (active, e) {
  var map = e || this.getMap();
  if (map) {
    map.getInteractions().forEach(function (interaction) {
      if (interaction instanceof ol.interaction.DoubleClickZoom) {
        interaction.setActive(active);
      }
    }, this);
  }
}

/**
 * @param {ol.Map} map
 * @inheritDoc
 */
KMap.Interaction.Draw.prototype.setMap = function (map) {
  if (!map) {
    this._enableDoubleClickZoom(true, this.getMap());
    this.getMap().removeInteraction(this._snap);
  } else {
    this._enableDoubleClickZoom(false, map);
    map.addInteraction(this._snap);
  }
  ol.interaction.Draw.prototype.setMap.call(this, map);
}
