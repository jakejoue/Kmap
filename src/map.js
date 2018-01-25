goog.provide('KMap.Map');

goog.require('KMap');
goog.require('KMap.Layer');
goog.require('KMap.GroupLayer');
goog.require('KMap.Interaction.Location');

goog.require('KMap.Action.MeasureArea');
goog.require('KMap.Action.MeasureLength');
goog.require('KMap.Action.SelectByBox');
goog.require('KMap.Action.ClearGraphics');

goog.require('ol.Map');
goog.require('ol.layer.Group');
goog.require('ol.Collection');
goog.require('ol.CollectionEventType');

/**
 * 
 * @constructor
 * @param {string} target
 * @param {MapX.MapOptions} options 
 * @api
 */
KMap.Map = function (target, options) {
    /**
    * 内部地图对象
    */
    this.map_ = new ol.Map({
        target: target,
        controls: [],//ol.control.defaults(),
        logo: false,
        loadTilesWhileAnimating: true,
        loadTilesWhileInteracting: true
    });

    /**
    * 地图底图
    */
    this.baseLayers_ = new KMap.GroupLayer('baseLayers', null);
    this.map_.addLayer(this.baseLayers_.getLayer());

    /**
    * 动态图层
    */
    this.dynamicLayers_ = new KMap.GroupLayer('dynamicLayers', null);
    this.map_.addLayer(this.dynamicLayers_.getLayer());

    /**
    * 绘画图层
    */
    this.graphicsLayers_ = new KMap.GroupLayer('graphicsLayers', null);
    this.map_.addLayer(this.graphicsLayers_.getLayer());

    /**
     * 默认的GraphicsLayer
     * @type {KMap.GraphicsLayer}
     */
    this.graphics_ = new KMap.GraphicsLayer("graphics", {});
    this.map_.addLayer(this.graphics_.getLayer());

    /**
    * 视图
    */
    var center = [0, 0];
    if (options.center) {
        center[0] = options.center[0] || center[0];
        center[1] = options.center[1] || center[1];
    }

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
    this.map_.setView(this.view_);

    /**
    * 坐标拾取
    */
    this.locationAction_ = new KMap.Interaction.Location();
    this.map_.addInteraction(this.locationAction_);

    /**
    * 鼠标坐标
    */
    var mousePositionControl = new ol.control.MousePosition({
        coordinateFormat: function (coordinate) {
            return ol.coordinate.format(coordinate, '{x}, {y}', 6);
        },
        className: 'custom-mouse-position',
        undefinedHTML: '超出范围'
    });
    this.map_.addControl(mousePositionControl);

    /**
    * 比例尺
    */
    var scaleLineControl = new ol.control.ScaleLine({ minWidth: 38 });
    this.map_.addControl(scaleLineControl);

    /**
     * @type {KMap.Action.MapAction}
     */
    this.mapAction_ = null;

    /**
     * @type {boolean|undefined}
     */
    this.geodesic_ = options.geodesic;

    /**
     * @type {KMap.Popup}
     * @api
     */
    this.infoWindow = null;
};

/**
 * 地图坐标转屏幕坐标
 * @api
 * @param {ol.Coordinate} coordinate 地图坐标
 * @return {ol.Pixel} 像素点对应的地图坐标
 */
KMap.Map.prototype.getPixelFromCoordinate = function (coordinate) {
    return this.map_.getPixelFromCoordinate(coordinate);
};

/**
 * 屏幕坐标转地图坐标
 * @param {ol.Pixel} pixel 屏幕像素点.
 * @return {ol.Coordinate} 地图坐标对应的像素点.
 * @api
 */
KMap.Map.prototype.getCoordinateFromPixel = function (pixel) {
    return this.map_.getCoordinateFromPixel(pixel);
};

/**
 * Detect features that intersect a pixel on the viewport, and execute a
 * callback with each intersecting feature. Layers included in the detection can
 * be configured through `opt_layerFilter`.
 * @param {ol.Pixel} pixel Pixel.
 * @param {function(this: S, (KMap.Graphic),
 *     KMap.Layer): T} callback Feature callback. The callback will be
 *     called with two arguments. The first argument is one
 *     {@link KMap.Graphic graphic} at the pixel, the second is
 *     the {@link KMap.Layer kLayer} of the feature and will be null for
 *     unmanaged layers. To stop detection, callback functions can return a
 *     truthy value.
 * @param {olx.AtPixelOptions=} opt_options Optional options.
 * @return {T|undefined} Callback result, i.e. the return value of last
 * callback execution, or the first truthy callback return value.
 * @template S,T
 * @api
 */
KMap.Map.prototype.forEachFeatureAtPixel = function (pixel, callback, opt_options) {
    var map = this.map_;
    return map.forEachFeatureAtPixel(pixel, function (feature, layer) {
        /**@type {KMap.Graphic} */
        var graphic = new KMap.Graphic(/** @type {ol.Feature} */(feature));
        /**@type {KMap.Layer} */
        var kLayer = layer ? KMap.Layer.fromLayer(layer) : null;
        return callback(graphic, kLayer);
    }, opt_options);
};

/**
 * Detect layers that have a color value at a pixel on the viewport, and
 * execute a callback with each matching layer. Layers included in the
 * detection can be configured through `opt_layerFilter`.
 * @param {ol.Pixel} pixel Pixel.
 * @param {function(this: S, KMap.Layer, (Uint8ClampedArray|Uint8Array)): T} callback
 *     Layer callback. This callback will recieve two arguments: first is the
 *     {@link KMap.Layer layer}, second argument is an array representing
 *     [R, G, B, A] pixel values (0 - 255) and will be `null` for layer types
 *     that do not currently support this argument. To stop detection, callback
 *     functions can return a truthy value.
 * @param {S=} opt_this Value to use as `this` when executing `callback`.
 * @param {(function(this: U, KMap.Layer): boolean)=} opt_layerFilter Layer
 *     filter function. The filter function will receive one argument, the
 *     {@link KMap.Layer layer-candidate} and it should return a boolean
 *     value. Only layers which are visible and for which this function returns
 *     `true` will be tested for features. By default, all visible layers will
 *     be tested.
 * @param {U=} opt_this2 Value to use as `this` when executing `layerFilter`.
 * @return {T|undefined} Callback result, i.e. the return value of last
 * callback execution, or the first truthy callback return value.
 * @template S,T,U
 * @api
 */
KMap.Map.prototype.forEachLayerAtPixel = function (pixel, callback, opt_this, opt_layerFilter, opt_this2) {
    var map = this.map_;
    return map.forEachLayerAtPixel(pixel, function (layer, arr) {
        if (callback) {
            return callback.call(opt_this, KMap.Layer.fromLayer(layer), arr);
        }
    }, opt_this, function (layer) {
        if (opt_layerFilter) {
            return opt_layerFilter.call(opt_this2, KMap.Layer.fromLayer(layer));
        }
        return true;
    }, opt_this2);
};

/**
 * 地图单击要素时，弹出要素信息
 */
KMap.Map.prototype.handleMouseClick_ = function (e) {
    var map = this.map_;
    var coordinate = e.coordinate;
    var pixel = this.getPixelFromCoordinate(coordinate);

    console.log(coordinate.join(','));

    var selectFeature = map.forEachFeatureAtPixel(pixel, function (feature, layer) {
        var graphic = new KMap.Graphic(feature);
        if (graphic.getVisible()) {
            if (this.infoWindow) {
                this.infoWindow.hide();
                var selectLayer = graphic.getLayer();

                var template = graphic.getInfoTemplate();
                if (template) {
                    this.infoWindow.setSelectedFeature(graphic);
                    var geometry = graphic.getGeometry();
                    if (geometry.getType() === 'point') {
                        coordinate = geometry.getCoordinates();
                    }
                    this.infoWindow.show(coordinate);
                    return feature;
                }
            }
        }
    }.bind(this), { hitTolerance: 0 });

    if (!selectFeature && this.infoWindow) {
        this.infoWindow.hide();
    }
};

/**
 * 返回地图视图大小
 * @api
 */
KMap.Map.prototype.getSize = function () {
    return this.map_.getSize();
};

/**
 * 设置地图视图大小
 * @api
 */
KMap.Map.prototype.setSize = function (size) {
    var target = this.map_.getTargetElement();
    var style = getComputedStyle(target);
    if (style) {
        target.style.width = size[0] + "px";
        target.style.height = size[1] + "px";
        this.map_.updateSize();
    }
};

/**
 * 重新计算地图视图大小
 * @api
 */
KMap.Map.prototype.updateSize = function () {
    var target = this.map_.getTargetElement();
    var style = getComputedStyle(target);
    if (style) {
        this.map_.updateSize();
    }
};

/**
 * 获取地图中心点
 * @api
 */
KMap.Map.prototype.getCenter = function () {
    return this.map_.getView().getCenter();
};

/**
 * 设置地图中心点
 * @api
 */
KMap.Map.prototype.setCenter = function (coordinate) {
    var view = this.map_.getView();
    var center = view.constrainCenter(coordinate);
    this.map_.getView().setCenter(center);
};

/**
 * 设置地图缩放级别
 * @api
 */
KMap.Map.prototype.setZoom = function (zoom) {
    var view = this.map_.getView();
    this.map_.getView().setZoom(zoom);
};

/**
 * 设置地图缩放级别
 * @return {number|undefined}
 * @api
 */
KMap.Map.prototype.getZoom = function () {
    var view = this.map_.getView();
    return this.map_.getView().getZoom();
};

/**
 * 设置地图像素密度
 * @param {number} resolution
 * @api
 */
KMap.Map.prototype.setResolution = function (resolution) {
    var view = this.map_.getView();
    return this.map_.getView().setResolution(resolution);
};

/**
 * 返回地图像素密度
 * @return {number|undefined}
 * @api
 */
KMap.Map.prototype.getResolution = function () {
    var view = this.map_.getView();
    return this.map_.getView().getResolution();
};

/**
 * @api
 * @param {ol.Coordinate|KMap.Point} center
 * @param {number} zoom
 * @param {function(boolean)} callback
 */
KMap.Map.prototype.centerAndZoom = function (center, zoom, callback) {
    var view = this.map_.getView();
    if (view.getAnimating()) {
        view.cancelAnimations();
    }
    /**@type {ol.Coordinate} */
    var coordinate;
    if (center instanceof KMap.Point) {
        coordinate = /**@type {ol.Coordinate} */(center.getCoordinates());
    } else {
        coordinate = /**@type {ol.Coordinate} */(center);
    }
    if (coordinate) {
        if (callback) {
            view.animate({
                center: coordinate,
                zoom: zoom,
                duration: 250
            }, callback);
        } else {
            view.animate({
                center: coordinate,
                zoom: zoom,
                duration: 250
            });
        }
    }
};

/**
 * @api
 * @param {ol.Coordinate} coordinate
 * @param {function(boolean)} callback
 */
KMap.Map.prototype.centerAt = function (coordinate, callback) {
    var view = this.map_.getView();
    if (view.getAnimating()) {
        view.cancelAnimations();
    }
    if (callback) {
        view.animate({
            center: coordinate,
            duration: 250
        }, callback);
    } else {
        view.animate({
            center: coordinate,
            duration: 250
        });
    }
};

/**
 * 移动地图中心到指定的位置
 * @api
 */
KMap.Map.prototype.panTo = function (coordinate) {
    if(isNaN(coordinate[0]) || isNaN(coordinate[1])) {
        return;
    }
    var view = this.map_.getView();
    if (view.getAnimating()) {
        view.cancelAnimations();
    }
    var center = view.constrainCenter(coordinate);
    view.animate({
        center: center,
        duration: 250,
        easing: ol.easing.easeOut
    });
};

/**
 * 按范围缩放
 * @api
 * @param {ol.Extent} extent
 * @param {olx.view.FitOptions=} opt_options
 */
KMap.Map.prototype.zoomByExtent = function (extent, opt_options) {
    var view = this.map_.getView();
    if (view.getAnimating()) {
        view.cancelAnimations();
    }
    if (!ol.extent.isEmpty(extent) && !isNaN(extent[0]) && !isNaN(extent[1]) && !isNaN(extent[2]) && !isNaN(extent[3])) {
        var options = { duration: 250 };
        if(opt_options) {
            options = ol.obj.assign(options, opt_options)
        }
        view.fit(extent, options);
    }
};

/**
 * 缩放地图
 * @api
 */
KMap.Map.prototype.zoomByDelta = function (delta, duration) {
    var view = this.map_.getView();
    if (!view) {
        return;
    }
    var currentResolution = view.getResolution();
    if (currentResolution) {
        var newResolution = view.constrainResolution(currentResolution, delta);
        if (duration > 0) {
            if (view.getAnimating()) {
                view.cancelAnimations();
            }
            view.animate({
                resolution: newResolution,
                duration: duration,
                easing: ol.easing.easeOut
            });
        } else {
            view.setResolution(newResolution);
        }
    }
};

/**
 * 地图放大一级
 * @api
 */
KMap.Map.prototype.zoomIn = function () {
    this.zoomByDelta(1, 250);
};

/**
 * 地图缩小一级
 * @api
 */
KMap.Map.prototype.zoomOut = function () {
    this.zoomByDelta(-1, 250);
};

/**
 * 返回地图内部对象
 * @return {ol.Map}
 * @api
 */
KMap.Map.prototype.getMap = function () {
    return this.map_;
};

/**
 * 当前地图的当前范围
 * @return {ol.Extent}
 * @api
 */
KMap.Map.prototype.getExtent = function () {
    var size = /**@type {Array.<number>} */ (this.map_.getSize());
    var lt = this.map_.getCoordinateFromPixel([0, 0]);
    var rb = this.map_.getCoordinateFromPixel(size);
    return [lt[0], rb[1], rb[0], lt[1]];
};

/**
 * 设置地图的当前的显示范围
 * @param {ol.Extent} extent
 * @api
 */
KMap.Map.prototype.setExtent = function (extent) {
    this.zoomByExtent(extent);
};

/**
 * 当前地图的当前范围
 * @api
 */
KMap.Map.prototype.getFullExtent = function () {
    var view = this.map_.getView();
    var extent = this.extent_ || view.getProjection().getExtent();
    return extent;
};

/**
 * 设置地图的范围
 * @api
 */
KMap.Map.prototype.setFullExtent = function (extent) {
    this.extent_ = extent;
};

/**
 * 设置地图的范围
 * @api
 */
KMap.Map.prototype.zoomToFullExtent = function () {
    var extent = this.getFullExtent();
    this.zoomByExtent(extent);
};

/**
 * 地图打印
 * @api
 */
KMap.Map.prototype.print = function () {

};

/**
 * 返回底图图层
 * @api
 */
KMap.Map.prototype.getBaseLayers = function () {
    return this.baseLayers_;
};

/**
 * 添加底图
 * @api
 */
KMap.Map.prototype.addBaseLayer = function (layer) {
    this.baseLayers_.push(layer);
};

/**
 * 移除底图
 * @api
 */
KMap.Map.prototype.removeBaseLayer = function (layer) {
    this.baseLayers_.remove(layer);
};

/**
 * 清空底图
 * @api
 */
KMap.Map.prototype.clearBaseLayer = function () {
    this.baseLayers_.clear();
};

/**
 * 返回动态图层
 * @api
 */
KMap.Map.prototype.getDynamicLayers = function () {
    return this.dynamicLayers_;
};

/**
 * 添加动态图层
 * @api
 */
KMap.Map.prototype.addDynamicLayer = function (layer) {
    this.dynamicLayers_.push(layer);
};

/**
 * 移除动态图层
 * @api
 */
KMap.Map.prototype.removeDynamicLayer = function (layer) {
    this.dynamicLayers_.remove(layer);
};

/**
 * 清空动态图层
 * @api
 */
KMap.Map.prototype.clearDynamicLayers = function () {
    this.dynamicLayers_.clear();
};

/**
 * 返回动态图层
 * @api
 */
KMap.Map.prototype.getGraphicsLayers = function () {
    return this.graphicsLayers_;
};

/**
 * 添加绘制图层
 * @api
 */
KMap.Map.prototype.addGraphicsLayer = function (layer) {
    this.graphicsLayers_.push(layer);
};

/**
 * 移除绘制图层
 * @api
 */
KMap.Map.prototype.removeGraphicsLayer = function (layer) {
    this.graphicsLayers_.remove(layer);
};

/**
 * 清空绘制图层
 * @api
 */
KMap.Map.prototype.clearGraphicsLayers = function () {
    this.graphicsLayers_.clear();
};

/**
 * @api
 */
KMap.Map.prototype.addOverlay = function (overlay) {
    this.map_.addOverlay(overlay);
};

/**
 * @api
 */
KMap.Map.prototype.removeOverlay = function (overlay) {
    this.map_.removeOverlay(overlay);
};

/**
 * 刷新地图
 * @api
 */
KMap.Map.prototype.refresh = function () {
    this.map_.render();
};

/**
 * 监听事件只触发一次
 * @api
 */
KMap.Map.prototype.once = function (type, listener, thizObj) {
    this.map_.once(type, listener, thizObj);
};

/**
 * 监听事件
 * @api
 */
KMap.Map.prototype.on = function (type, listener, thizObj) {
    this.map_.on(type, listener, thizObj);
};

/**
 * 取消监听事件
 * @api
 */
KMap.Map.prototype.un = function (type, listener, thizObj) {
    this.map_.un(type, listener, thizObj);
};

/**
 * 鼠标单击地图的位置
 * @api
 */
KMap.Map.prototype.getLocation = function (callback) {
    this.locationAction_.once('location', function (evt) {
        callback(evt.coordinate);
    });
};

/**
 * 设置当前地图的响应动作
 * @return {KMap.Action.MapAction}
 * @api
 */
KMap.Map.prototype.getAction = function () {
    return this.mapAction_;
};

/**
 * 设置当前地图的响应动作
 * @param {KMap.Action.MapAction} action
 * @api
 */
KMap.Map.prototype.setAction = function (action) {
    if (this.mapAction_) {
        this.mapAction_.setMap(null);
    }
    this.mapAction_ = action;
    if (this.mapAction_) {
        this.mapAction_.setMap(this);
    }
};

/**
 * 默认绘制图层
 * @api
 */
KMap.Map.prototype.getGraphics = function () {
    return this.graphics_;
};

/**
 * @param {string} layerId
 * @return {KMap.Layer}
 * @api
 */
KMap.Map.prototype.getLayer = function (layerId) {
    var map = this.getMap();
    var layerGroup = map.getLayerGroup();
    var layers = layerGroup.getLayersArray();
    var layer = ol.array.find(layers, function (value, index, arr) {
        if (value.get(KMap.Layer.Property.ID) === layerId) {
            return true;
        }
        return false;
    });
    if (layer) {
        return KMap.Layer.fromLayer(layer);
    }
    return null;
};

/**
 * @api
 * @param {KMap.Popup} infoWindow
 */
KMap.Map.prototype.setInfoWindow = function (infoWindow) {
    this.infoWindow = infoWindow;
};

/**
 * @api
 * @return {KMap.Popup}
 */
KMap.Map.prototype.getInfoWindow = function () {
    return this.infoWindow;
};

/**
 * @api
 * @param {ol.interaction.Interaction} interaction
 */
KMap.Map.prototype.addInteraction = function (interaction) {
    this.map_.addInteraction(interaction);
};

/**
 * @api
 * @param {ol.interaction.Interaction} interaction
 */
KMap.Map.prototype.removeInteraction = function (interaction) {
    this.map_.removeInteraction(interaction);
};