goog.provide('KMap.Graphic');

goog.require('KMap.Geometry');
goog.require('KMap.Symbol');
goog.require('ol.Feature');

/**
 * Graphic对象，是对ol.Feature的包装
 * @constructor
 * @param {ol.Feature|undefined|null} feature
 * @api
 */
KMap.Graphic = function (feature) {
    if (!feature || !(feature instanceof ol.Feature)) {
        feature = new ol.Feature({});
        feature.set(KMap.Graphic.Property.ATTRIBUTES, {});
        feature.set(KMap.Graphic.Property.VISIBLE, true);
    }
    /**
     * @type {ol.Feature}
     */
    this.feature_ = feature;

    var attrs = this.getAttributes();
    if (!attrs) {
        // 复制属性
        feature.set(KMap.Graphic.Property.ATTRIBUTES, {});
        feature.set(KMap.Graphic.Property.VISIBLE, true);

        var keys = feature.getKeys();
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (KMap.Graphic.Properties.indexOf(key) < 0) {
                var value = feature.get(key);
                if (!(value instanceof ol.geom.Geometry)) {
                    this.setAttribute(key, value);
                }
            }
        }
    }
};

/**
 * @api
 * @return {number|string|undefined}
 */
KMap.Graphic.prototype.getId = function () {
    return this.feature_.getId();
};

/**
 * @api
 * @param {number|string|undefined} id
 */
KMap.Graphic.prototype.setId = function (id) {
    return this.feature_.setId(id);
};

/**
 * @api 
 * @return {KMap.Geometry}
 */
KMap.Graphic.prototype.getGeometry = function () {
    var geometry = /** @type {ol.geom.Geometry} */ (this.feature_.getGeometry());
    return KMap.Geometry.fromGeometry(geometry);
};

/**
 * @param {KMap.Geometry} geometry
 * @api
 */
KMap.Graphic.prototype.setGeometry = function (geometry) {
    if (geometry) {
        this.feature_.setGeometry(geometry.getGeometry());
    } else {
        this.feature_.setGeometry(undefined);
    }
};

/**
 * @api 
 * @return {string}
 */
KMap.Graphic.prototype.getGeometryName = function () {
    return this.feature_.getGeometryName();
};

/**
 * @param {string} geometryName
 * @api
 */
KMap.Graphic.prototype.setGeometryName = function (geometryName) {
    this.feature_.setGeometryName(geometryName);
};

/**
 * @api
 * @return {KMap.Symbol|null}
 */
KMap.Graphic.prototype.getSymbol = function () {
    //var style = /** @type {ol.style.Style} */ (this.feature_.getStyle());
    /*if (style) {
        return KMap.Symbol.fromStyle(style);
    }
    return null;*/
    return /** @type {KMap.Symbol} */ (this.feature_.get(KMap.Graphic.Property.SYMBOL));
};

/**
 * @api
 * @param {KMap.Symbol} symbol
 */
KMap.Graphic.prototype.setSymbol = function (symbol) {
    /*if(symbol) {
        var self = this;
        var styleFunction = function(feature, resolution) {
            if(self.getVisible()) {
                return symbol.getStyle();
            }
            return null;
        };
        this.feature_.setStyle(styleFunction);
    } else {
        this.feature_.setStyle(null);
    }*/
    this.feature_.set(KMap.Graphic.Property.SYMBOL, symbol);
};

/**
 * @api
 */
KMap.Graphic.prototype.getAttributes = function () {
    return this.feature_.get(KMap.Graphic.Property.ATTRIBUTES);
};

/**
 * @api
 */
KMap.Graphic.prototype.setAttributes = function (attrs) {
    this.feature_.set(KMap.Graphic.Property.ATTRIBUTES, attrs || {});
};

/**
 * @api
 * @param {string} name
 * @return {Object}
 */
KMap.Graphic.prototype.getAttribute = function (name) {
    var attrs = this.getAttributes();
    return attrs[name];
};

/**
 * @api
 * @param {string} name
 * @param {*} value
 */
KMap.Graphic.prototype.setAttribute = function (name, value) {
    var attrs = this.getAttributes();
    attrs[name] = value;
};

/**
 * @api
 * @return {ol.Feature}
 */
KMap.Graphic.prototype.getFeature = function () {
    return this.feature_;
};

/**
 * @api
 * @param {ol.Feature} feature
 */
KMap.Graphic.prototype.setFeature = function (feature) {
    this.feature_ = feature;
};

/**
 * @api
 * @return {boolean}
 */
KMap.Graphic.prototype.getVisible = function () {
    return /** @type {boolean} */ (this.feature_.get(KMap.Graphic.Property.VISIBLE));
};

/**
 * @api
 * @param {boolean} visible
 */
KMap.Graphic.prototype.setVisible = function (visible) {
    this.feature_.set(KMap.Graphic.Property.VISIBLE, visible);
};

/**
 * @param {KMap.InfoTemplate} infoTemplate
 * @api
 */
KMap.Graphic.prototype.setInfoTemplate = function (infoTemplate) {
    this.feature_.set(KMap.Graphic.Property.INFOTEMPLATE, infoTemplate);
};

/**
 * @return {KMap.InfoTemplate}
 * @api
 */
KMap.Graphic.prototype.getInfoTemplate = function () {
    var template = /**@type {KMap.InfoTemplate} */ (this.feature_.get(KMap.Graphic.Property.INFOTEMPLATE));
    if (!template) {
        var layer = this.getLayer();
        if (layer) {
            template = layer.getInfoTemplate();
        }
    }
    return template;
};

/**
 * @api
 * @return {KMap.GraphicsLayer}
 */
KMap.Graphic.prototype.getLayer = function () {
    return /**@type {KMap.GraphicsLayer} */ (this.feature_.get(KMap.Graphic.Property.LAYER));
};

/**
 * @param {KMap.GraphicsLayer} layer
 * @api
 */
KMap.Graphic.prototype.setLayer = function (layer) {
    this.feature_.set(KMap.Graphic.Property.LAYER, layer);
};

/**
 * @return {string|null|undefined}
 * @api
 */
KMap.Graphic.prototype.getContent = function () {
    var template = this.getInfoTemplate();
    if (template) {
        return template.bind(template.getContent(), this);
    }
    return "";
};

/**
 * @return {string|null|undefined}
 * @api
 */
KMap.Graphic.prototype.getTitle = function () {
    var template = this.getInfoTemplate();
    if (template) {
        return template.bind(template.getTitle(), this);
    }
    return "";
};

/**
 * @enum {string}
 * @api
 */
KMap.Graphic.Property = {
    LAYER: 'GRAPHIC_LAYER',
    VISIBLE: 'GRAPHIC_VISIBLE',
    ATTRIBUTES: 'GRAPHIC_ATTRIBUTES',
    INFOTEMPLATE: 'GRAPHIC_INFOTEMPLATE',
    SYMBOL: 'GRAPHIC_SYMBOL'
};

KMap.Graphic.Properties = [
    KMap.Graphic.Property.LAYER,
    KMap.Graphic.Property.VISIBLE,
    KMap.Graphic.Property.ATTRIBUTES,
    KMap.Graphic.Property.INFOTEMPLATE,
    KMap.Graphic.Property.SYMBOL
];

/**
 * 读取graphics
 * @api
 * @param {string} type 
 * @param {Document | Node | Object | string} source 
 * @return {Array.<KMap.Graphic>}
 */
KMap.Graphic.readGraphics = function (source, type) {
    var format;
    switch (type) {
        case 'esrijson':
            format = new ol.format.EsriJSON();
            break;
        case 'geojson':
            format = new ol.format.GeoJSON();
            break;
        case 'kml':
            format = new ol.format.KML();
            break;
        case 'wkt':
            format = new ol.format.WKT();
            break;
        default:
            format = new ol.format.GML();
            break;
    }
    var features = format.readFeatures(source);
    return features.map(function (feature) {
        return new KMap.Graphic(feature);
    });
}