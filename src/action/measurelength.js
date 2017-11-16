goog.provide('KMap.Action.MeasureLength');

goog.require('KMap');

goog.require('KMap.Action');
goog.require('KMap.Action.MapAction');

goog.require('ol.Sphere');
goog.require('ol.source.Vector');
goog.require('ol.Overlay');

/**
 * @constructor
 * @extends {KMap.Action.MapAction}
 * @param {MapX.MeasureOptions} options
 * @api
 */
KMap.Action.MeasureLength = function (options) {
    KMap.Action.MapAction.call(this, { actionName: options.actionName });

    /**
     * 用来计算经纬度坐标测量结果
     * @type {ol.Sphere}
     */
    this.wgs84Sphere_ = new ol.Sphere(6378137);

    /**
     * @type {ol.style.Style}
     */
    this.style_ = new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new ol.style.Stroke({
            color: '#ffcc33',
            width: 2
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#ffcc33'
            })
        })
    });

    /**
     * @type {ol.source.Vector}
     */
    this.source_ = new ol.source.Vector();
    /**
     * @type {ol.layer.Vector}
     */
    this.vector_ = new ol.layer.Vector({
        source: this.source_,
        style: this.style_
    });

    /**
     * 当前绘制的要素.
     * @type {ol.Feature}
     */
    this.sketch_ = null;


    /**
     * 提示信息元素.
     * @type {Element}
     */
    this.helpTooltipElement_ = null;


    /**
     * 显示提示信息.
     * @type {ol.Overlay}
     */
    this.helpTooltip_ = null;


    /**
     * 测量信息元素.
     * @type {Element}
     */
    this.measureTooltipElement_ = null;


    /**
     * 显示测量信息.
     * @type {ol.Overlay}
     */
    this.measureTooltip_ = null;


    /**
     * Message to show when the user is drawing a polygon.
     * @type {string}
     */
    this.continuePolygonMsg_ = '双击地图结束测量';

    /**
     * 实时显示测量的图形
     * @type {ol.interaction.Draw}
     */
    this.draw_ = null;

    /**
     * 是否是地理坐标
     * @type {boolean|undefined}
     */
    this.geodesic_ = options.geodesic;

    /**
     *  @type {ol.Coordinate|undefined}
     */
    this.tooltipCoord_ = undefined;

    /**
     * 几何图形改变的监听
     * @type {ol.EventsKey|null}
     */
    this.listener_ = null;

    /**
     * @type {Array.<ol.Overlay>}
     */
    this.overlays_ = [];
};
ol.inherits(KMap.Action.MeasureLength, KMap.Action.MapAction);

/**
 * 处理MouseMove事件.
 * @param {ol.MapBrowserEvent} evt The event.
 */
KMap.Action.MeasureLength.prototype.handlerPointerMove_ = function (evt) {
    if (evt.dragging) {
        return;
    }
    /** @type {string} */
    var helpMsg = '单击开始测量';

    if (this.sketch_) {
        var geom = (this.sketch_.getGeometry());
        helpMsg = this.continuePolygonMsg_;
    }

    this.helpTooltipElement_.innerHTML = helpMsg;
    this.helpTooltip_.setPosition(evt.coordinate);

    this.helpTooltipElement_.classList.remove('hidden');
};


/**
 * Format length output.
 * @param {ol.geom.LineString} line The line.
 * @return {string} The formatted length.
 */
KMap.Action.MeasureLength.prototype.formatLength = function (line) {
    var length;
    var map = this.map_.getMap();
    if (this.geodesic_) {
        var coordinates = line.getCoordinates();
        length = 0;
        var sourceProj = map.getView().getProjection();
        for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
            var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
            var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
            length += this.wgs84Sphere_.haversineDistance(c1, c2);
        }
    } else {
        length = Math.round(line.getLength() * 100) / 100;
    }
    var output;
    if (length > 100) {
        output = (Math.round(length / 1000 * 100) / 100) + ' 千米';
    } else {
        output = (Math.round(length * 100) / 100) + ' 米';
    }
    return output;
};

KMap.Action.MeasureLength.prototype.handleDrawStart_ = function (evt) {

    this.sketch_ = evt.feature;

    /** @type {ol.Coordinate|undefined} */
    this.tooltipCoord_ = evt.coordinate;

    this.listener_ = /** @type {ol.EventsKey}*/ (this.sketch_.getGeometry().on('change', this.handleGeometryChange_, this));
};

KMap.Action.MeasureLength.prototype.handleGeometryChange_ = function (evt) {
    var geom = /**@type {ol.geom.LineString} */ (evt.target);
    var output = this.formatLength(geom);
    this.tooltipCoord_ = geom.getLastCoordinate();

    this.measureTooltipElement_.innerHTML = output;
    this.measureTooltip_.setPosition(this.tooltipCoord_);
};

KMap.Action.MeasureLength.prototype.handleDrawEnd_ = function () {
    this.measureTooltipElement_.className = 'tooltip tooltip-static';
    this.measureTooltip_.setOffset([0, -7]);
    // unset sketch
    this.sketch_ = null;
    // unset tooltip so that a new one can be created
    this.measureTooltipElement_ = null;
    this.createMeasureTooltip();
    ol.Observable.unByKey(this.listener_);
    this.listener_ = null;
};

/**
 * Creates a new help tooltip
 */
KMap.Action.MeasureLength.prototype.createHelpTooltip = function () {
    if (this.helpTooltipElement_) {
        this.helpTooltipElement_.parentNode.removeChild(this.helpTooltipElement_);
    }
    this.helpTooltipElement_ = document.createElement('div');
    this.helpTooltipElement_.className = 'tooltip hidden';
    this.helpTooltip_ = new ol.Overlay({
        element: this.helpTooltipElement_,
        offset: [15, 0],
        positioning: 'center-left'
    });

    var map = this.getMap();
    map.addOverlay(this.helpTooltip_);

    this.overlays_.push(this.helpTooltip_);
};


/**
 * Creates a new measure tooltip
 */
KMap.Action.MeasureLength.prototype.createMeasureTooltip = function () {
    if (this.measureTooltipElement_) {
        this.measureTooltipElement_.parentNode.removeChild(this.measureTooltipElement_);
    }
    this.measureTooltipElement_ = document.createElement('div');
    this.measureTooltipElement_.className = 'tooltip tooltip-measure';
    this.measureTooltip_ = new ol.Overlay({
        element: this.measureTooltipElement_,
        offset: [0, -15],
        positioning: 'bottom-center'
    });

    var map = this.map_.getMap();
    map.addOverlay(this.measureTooltip_);

    this.overlays_.push(this.measureTooltip_);
};

/**
 * @override
 */
KMap.Action.MeasureLength.prototype.activate = function () {
    var type = 'LineString';
    this.draw_ = new ol.interaction.Draw({
        source: this.source_,
        type: /** @type {ol.geom.GeometryType} */ (type),
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 0.5)',
                lineDash: [10, 10],
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0, 0.7)'
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                })
            })
        })
    });

    this.draw_.on('drawstart', this.handleDrawStart_, this);
    this.draw_.on('drawend', this.handleDrawEnd_, this);

    var map = this.map_.getMap();
    map.addInteraction(this.draw_);

    map.addLayer(this.vector_);

    this.createMeasureTooltip();
    this.createHelpTooltip();

    map.on('pointermove', this.handlerPointerMove_, this);
};

/**
 * @override
 */
KMap.Action.MeasureLength.prototype.deactivate = function () {
    this.source_.clear();

    var map = this.map_.getMap();
    map.removeLayer(this.vector_);
    map.removeInteraction(this.draw_);

    var overlays = this.overlays_;
    this.overlays_ = [];

    var length = overlays.length;
    for (var i = 0; i < length; i++) {
        var overlay = overlays[i];
        map.removeOverlay(overlay);
        var element = overlay.getElement();
        if (element) {
            element.parentNode.removeChild(element);
        }
    }

    ol.Observable.unByKey(this.listener_);
    this.listener_ = null;

    map.un('pointermove', this.handlerPointerMove_, this);
};
