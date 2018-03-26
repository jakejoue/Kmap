goog.provide('KMap.Layer');

goog.require('KMap');

/**
 * 所在图层对象的包装基类
 * @api
 * @constructor
 * @param {string} id
 * @param {Object|ol.layer.Base} options
 */
KMap.Layer = function (id, options) {

  var layer = null;
  if (options instanceof ol.layer.Base) {
    layer = /** @type {ol.layer.Base} */ (options);
  } else {
    layer = this.createLayer(options);
    layer.set(KMap.Layer.Property.TYPE, this.getType());
  }

  /**
   * @protected
   * @type {ol.layer.Base}
   */
  this.layer_ = layer;

  this.setId(id);
};

/**
 * 返回图层的ID
 * @api
 * @return {string}
 */
KMap.Layer.prototype.getId = function () {
  return /**@type {string} */ (this.layer_.get(KMap.Layer.Property.ID));
};

/**
 * 设置图层的ID
 * @api
 * @param {string} id
 */
KMap.Layer.prototype.setId = function (id) {
  this.layer_.set(KMap.Layer.Property.ID, id);
};

/**
 * 反回图层的内部对象
 * @api
 * @return {ol.layer.Base}
 */
KMap.Layer.prototype.getLayer = function () {
  return this.layer_;
};

/** 设置图层的内部对象
 * @api
 * @param {ol.layer.Base} layer
 */
KMap.Layer.prototype.setLayer = function (layer) {
  this.layer_ = layer;
};

/**
 * 返回图层是否可以显示
 * @api
 * @return {boolean}
 */
KMap.Layer.prototype.getVisible = function () {
  var layer = this.getLayer();
  return layer.getVisible();
};

/**
 * 修改图层是否可以显示
 * @api
 * @param {boolean} visible
 */
KMap.Layer.prototype.setVisible = function (visible) {
  var layer = this.getLayer();
  layer.setVisible(visible);
};

/**
 * 返回图层的边界范围
 * @api
 * @return {ol.Extent|null|undefined}
 */
KMap.Layer.prototype.getExtent = function () {
  var layer = this.getLayer();
  return layer.getExtent();
};

/**
 * 设置图层的边界范围
 * @api
 * @param {ol.Extent} extent
 */
KMap.Layer.prototype.setExtent = function (extent) {
  var layer = this.getLayer();
  layer.setExtent(extent);
};

/**
 * 返回图层的最大显示密度
 * @api
 * @return {number}
 */
KMap.Layer.prototype.getMaxResolution = function () {
  var layer = this.getLayer();
  return layer.getMaxResolution();
};

/**
 * 设置图层的最大显示密度
 * @param {number} maxResolution
 * @return {KMap.Layer} 返回图层对象
 * @api
 */
KMap.Layer.prototype.setMaxResolution = function (maxResolution) {
  var layer = this.getLayer();
  layer.setMaxResolution(maxResolution);
  return this;
};

/**
 * 返回图层的最小显示密度
 * @api
 */
KMap.Layer.prototype.getMinResolution = function () {
  var layer = this.getLayer();
  return layer.getMinResolution();
};

/**
 * 设置图层的最小显示密度
 * @param {number} minResolution
 * @return {KMap.Layer} 返回图层对象
 * @api
 */
KMap.Layer.prototype.setMinResolution = function (minResolution) {
  var layer = this.getLayer();
  layer.setMinResolution(minResolution);
  return this;
};

/**
 * @param {Object} options 
 * @returns {ol.layer.Base}
 */
KMap.Layer.prototype.createLayer = function (options) {
  throw 'layer create error';
};

/**
 * @api
 * @param {ol.layer.Base} layer 
 * @returns {KMap.Layer}
 */
KMap.Layer.fromLayer = function (layer) {
  var layerType = /**@type {string}*/ (layer.get(KMap.Layer.Property.TYPE));
  switch (layerType) {
    case KMap.Layer.Type.ArcGISRestLayer:
      return KMap.ArcGISRestLayer.fromLayer(layer);
    case KMap.Layer.Type.ArcGISTileLayer:
      return KMap.ArcGISTileLayer.fromLayer(layer);
    case KMap.Layer.Type.BaiduLayer:
      return KMap.BaiduLayer.fromLayer(layer);
    case KMap.Layer.Type.FeatureLayer:
      return KMap.FeatureLayer.fromLayer(layer);
    case KMap.Layer.Type.GraphicsLayer:
      return KMap.GraphicsLayer.fromLayer(layer);
    case KMap.Layer.Type.GroupLayer:
      return KMap.GroupLayer.fromLayer(layer);
    case KMap.Layer.Type.TileWMSLayer:
      return KMap.TileWMSLayer.fromLayer(layer);
    case KMap.Layer.Type.WMSLayer:
      return KMap.WMSLayer.fromLayer(layer);
    case KMap.Layer.Type.WMTSLayer:
      return KMap.WMTSLayer.fromLayer(layer);
    case KMap.Layer.Type.AMapLayer:
      return KMap.AMapLayer.fromLayer(layer);
  };
  throw 'invalid layer type';
};

/**
 * 返回图层的类型
 * @return {KMap.Layer.Type}
 * @api
 */
KMap.Layer.prototype.getType = function () {
  throw 'invalid layer type';
};

/**
 * @enum {string}
 * @api
 */
KMap.Layer.Type = {
  ArcGISRestLayer: 'ArcGISRestLayer',
  ArcGISTileLayer: 'ArcGISTileLayer',
  BaiduLayer: 'BaiduLayer',
  FeatureLayer: 'FeatureLayer',
  GraphicsLayer: 'GraphicsLayer',
  GroupLayer: 'GroupLayer',
  TileWMSLayer: 'TileWMSLayer',
  WMSLayer: 'WMSLayer',
  WMTSLayer: 'WMTSLayer',
  AMapLayer: 'AMapLayer',
  TdtLayer: 'TdtLayer'
};

/**
 * @enum {string}
 * @api
 */
KMap.Layer.Property = {
  ID: 'LAYER_ID',
  TYPE: 'LAYER_TYPE'
};
