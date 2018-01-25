goog.provide('KMap.DrawTool');

goog.require('KMap');
goog.require('KMap.Map');

goog.require('KMap.Graphic');
goog.require('KMap.GraphicsLayer');

goog.require('ol.interaction.Draw');

/**
 * 绘画工具
 * @constructor
 * @param {*} options
 * @api
 */
KMap.DrawTool = function (options) {
  this.target_ = options.target;
  this.className_ = options.className || '';
  /**
   * @type {Array.<string>}
   */
  this.types_ = options.types ? options.types.filter(function (e) {
    return KMap.DrawTool.TYPES.indexOf(e) == -1;
  }) : KMap.DrawTool.TYPES;

  /**
   * @type {KMap.GraphicsLayer}
   */
  this.layer_ = options.layer || new KMap.GraphicsLayer('', {});
  /**
   * @type {Function | undefined}
   */
  this.symbol_ = options.symbol || undefined;

  this.dom_ = null;
  /**
   * @type {ol.interaction.Draw}
   */
  this.draw_ = null;

  /**
   * @type {KMap.Map}
   */
  this.map_ = null;
};

/**
 * 渲染画图工具dom并绑定事件
 */
KMap.DrawTool.prototype.renderDom = function () {
  var self = this;
  if (!this.dom_) {
    var dom = document.createElement("ul");
    dom.className = "drawtool " + this.className_;
    this.types_.forEach(function (e) {
      var li = document.createElement("li");
      li.className = /** @type {string}*/ (e).toLowerCase();;
      li.onclick = function () {
        self.switch(e);
      };
      dom.appendChild(li);
    });
    this.dom_ = dom;
    document.getElementById(this.target_).appendChild(this.dom_);
  } else {
    document.getElementById(this.target_).removeChild(this.dom_);
    this.dom_ = null;
  }
};

/**
 * 切换
 * @param {string | undefined} type
 */
KMap.DrawTool.prototype.switch = function (type) {
  var self = this;
  this.map_.removeInteraction(this.draw_);
  if (type) {
    var type_ = type.split('Free')[0];
    this.draw_ = new ol.interaction.Draw({
      type: /** @type {ol.geom.GeometryType} */ (type_),
      freehand: /** @type {boolean} */ (type.indexOf('Free') != -1)
    });
    this.draw_.on('drawend', function (e) {
      var graphic = new KMap.Graphic(e.feature);
      if (self.symbol_) {
        graphic.setSymbol(self.symbol_(type_));
      } else {
        e.feature.setStyle(KMap.DrawTool.GETSYMBOL(type_))
      }
      self.layer_.add(graphic);
      setTimeout(function () {
        self.switch(undefined);
      }, 1);
    });
    this.map_.addInteraction(this.draw_);
  }
};

/**
 * @param {KMap.Map} map
 */
KMap.DrawTool.prototype.setMap = function (map) {
  if (map) {
    this.map_ = map;
    this.renderDom();
    map.addGraphicsLayer(this.layer_);
  } else {
    map = this.map_;
    this.renderDom();
    map.removeInteraction(this.draw_);
    map.removeGraphicsLayer(this.layer_);
  }
};

KMap.DrawTool.TYPES = ['Point', 'LineString', 'LineStringFree', 'Polygon', 'PolygonFree', 'Circle', 'CircleFree'];
KMap.DrawTool.GETSYMBOL = function (type) {
  return ol.style.Style.createDefaultEditing()[type];
};
