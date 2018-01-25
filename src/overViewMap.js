goog.provide('KMap.OverViewMap');

goog.require('KMap.Map');

goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.layer.Group');

/**
 * 鹰眼地图
 * @constructor
 * @param {string} target
 * @param {KMap.Map} kmap
 * @param {*} options
 * @api
 */
KMap.OverViewMap = function (target, kmap, options) {
  var center = kmap.getCenter();
  if (options.center) {
    center[0] = options.center[0] || center[0];
    center[1] = options.center[1] || center[1];
  }
  /**
   * @type {ol.View}
   */
  this.view_ = new ol.View({
    projection: options.projection,
    center: center,
    extent: options.extent,
    resolutions: options.resolutions,
    minResolution: options.minResolution,
    maxResolution: options.maxResolution,
    resolution: options.zoom ? undefined : options.resolution,
    minZoom: options.minZoom,
    maxZoom: options.maxZoom,
    zoom: options.zoom || 0,
    zoomFactor: options.zoomFactor
  });
  this.minZoom_ = options.minZoom || 0;

  /**
   * @type {ol.Map}
   */
  this.map_ = new ol.Map({
    controls: [],
    interactions: [],
    view: this.view_,
    target: target
  });

  /**
   * @type {KMap.Map}
   */
  this.kmap = kmap;
  var kview = /** @type {ol.View} */ (kmap.view_);
  /**
   * 添加监听（设置联动更新）
   */
  ol.events.listen(kview, ol.ObjectEventType.PROPERTYCHANGE, this.update_, this);

  var baseLayer = this.kmap.getBaseLayers().getLayer();
  this.map_.addLayer(baseLayer);

  var source = new ol.source.Vector();
  var layer = new ol.layer.Vector({
    source: source,
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 0, 146, 0.2)'
      }),
      stroke: new ol.style.Stroke({
        color: 'rgba(255, 0, 146, 1)',
        width: 1
      })
    })
  });
  this.geom = new ol.geom.Polygon([]);
  var feature = new ol.Feature(this.geom);
  source.addFeature(feature);
  this.map_.addLayer(layer);
  this.pointerInteraction = new ol.interaction.Pointer({
    handleDownEvent: this.pointerdown_.bind(this),
    handleDragEvent: this.pointerdrag_.bind(this),
    handleUpEvent: this.pointerup_.bind(this)
  });
  this.map_.addInteraction(this.pointerInteraction);

  this.firstCoor = null;
  this.lastCoor = null;
  this.updating = true;
  //目标像素范围
  this.size = this.map_.getSize();
  var targetDom = document.getElementById(target);
  this.xy = [targetDom.offsetLeft, targetDom.offsetLeft];
};

KMap.OverViewMap.prototype.inTarget = function (pixel) {
  var x = pixel[0] - this.xy[0];
  var y = pixel[1] - this.xy[1];
  if (x <= this.size[0] && y <= this.size[1] && x >= 0 && y >= 0) {
    return true;
  }
  return false;
};

KMap.OverViewMap.prototype.pointerdown_ = function (e) {
  var extent = this.geom.getExtent();
  this.firstCoor = e.coordinate;
  this.lastCoor = null;
  if (ol.extent.containsCoordinate(extent, e.coordinate)) {
    this.updating = false;
    return true;
  } else {
    return false;
  }
};

KMap.OverViewMap.prototype.pointerdrag_ = function (e) {
  if (this.inTarget(e.pixel)) {
    if (this.lastCoor) {
      var offsetX = e.coordinate[0] - this.lastCoor[0];
      var offsetY = e.coordinate[1] - this.lastCoor[1];

      var coor = this.geom.getCoordinates()[0];
      var newCoor = coor.map(function (e) {
        return [e[0] + offsetX, e[1] + offsetY];
      });
      this.geom.setCoordinates([newCoor]);
      this.lastCoor = e.coordinate;
    } else {
      this.lastCoor = e.coordinate;
    }
  }
};

KMap.OverViewMap.prototype.pointerup_ = function (e) {
  this.updating = true;
  var offsetX = e.coordinate[0] - this.firstCoor[0];
  var offsetY = e.coordinate[1] - this.firstCoor[1];
  var center = this.kmap.getCenter();
  this.kmap.panTo([center[0] + offsetX, center[1] + offsetY]);
};

/**
 * 更新小地图小框
 * @private
 */
KMap.OverViewMap.prototype.updateBox_ = function (zoom, extent) {
  var perx = (extent[2] - extent[0]) / 4;
  var pery = (extent[3] - extent[1]) / 4;
  if ((zoom - 2) > this.minZoom_) {
    var coor = [
      [
        [extent[0] + perx * 1, extent[1] + pery * 1],
        [extent[0] + perx * 3, extent[1] + pery * 1],
        [extent[0] + perx * 3, extent[1] + pery * 3],
        [extent[0] + perx * 1, extent[1] + pery * 3],
        [extent[0] + perx * 1, extent[1] + pery * 1]
      ]
    ];
    this.geom.setCoordinates(coor);
    return zoom - 2;
  } else {
    this.geom.setCoordinates([]);
    return this.view_.getZoom;
  }
};

/**
 * 地图联动
 * @private
 */
KMap.OverViewMap.prototype.update_ = function (event) {
  if (this.updating) {
    var center = this.kmap.getCenter();
    var extent = this.kmap.getExtent();
    var zoom = this.kmap.getZoom();
    zoom = this.updateBox_(zoom, extent);
    if (this.view_.getAnimating()) {
      this.view_.cancelAnimations();
    }
    this.view_.animate({
      center: center,
      zoom: zoom,
      duration: 250,
      easing: ol.easing.easeOut
    });
  }
};
