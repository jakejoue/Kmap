goog.provide('KMap.FeatureLayer');

goog.require('KMap');
goog.require('KMap.GraphicsLayer');
goog.require('KMap.SimpleMarkerSymbol');
goog.require('KMap.SimpleFillSymbol');
goog.require('KMap.SimpleLineSymbol');
goog.require('ol.loadingstrategy');

/**
 * @api
 * @constructor
 * @extends {KMap.GraphicsLayer}
 * @param {string} id
 * @param {MapX.FeatureLayerOptions|ol.layer.Base} options
 */
KMap.FeatureLayer = function(id, options) {
    KMap.GraphicsLayer.call(this, id, options);
};
ol.inherits(KMap.FeatureLayer, KMap.GraphicsLayer);

/**
 * @param {Object} options 
 * @returns {ol.layer.Base}
 */
KMap.FeatureLayer.prototype.createLayer = function(options) {
    var featureOptions = /** @type {MapX.FeatureLayerOptions} */ (ol.obj.assign({}, options));
    var format = null;
    switch (featureOptions.format) {
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

    var self = this;

    var source = new ol.source.Vector({
        url: featureOptions.url,
        loader: featureOptions.loader,
        format: format,
        strategy: featureOptions.strategy || ol.loadingstrategy.bbox
    });
    /**
     * 添加要素和图层之间的关系
     */
    source.on("addfeature", function(e) {
        var graphic = new KMap.Graphic(e.feature);
        graphic.setLayer(self);
    });
    source.on("removefeature", function(e) {
        var graphic = new KMap.Graphic(e.feature);
        graphic.setLayer(null);
    });

    var vector_layer = new ol.layer.Vector({
        source: source,
        style: function(feature) {
            var style = null;
            var graphic = new KMap.Graphic(feature);
            var symbol = graphic.getSymbol();
            if (!symbol) {
                var renderer = self.getRenderer();
                if (renderer) {
                    symbol = renderer.getSymbol(graphic);
                }
            }
            if (symbol) {
                style = symbol.getStyle();
            }
            return style;
        }
    });
    return vector_layer;
};

/**
 * @api
 * @param {ol.layer.Base} layer 
 * @returns {KMap.Layer}
 */
KMap.FeatureLayer.fromLayer = function(layer) {
    var layerId = /**@type {string}*/ (layer.get(KMap.Layer.Property.ID));
    return new KMap.FeatureLayer(layerId, layer);
};

/**
 * 返回图层的类型
 * @return {KMap.Layer.Type}
 * @api
 */
KMap.FeatureLayer.prototype.getType = function() {
    return KMap.Layer.Type.FeatureLayer;
};

/**
 * @api
 */
KMap.FeatureLayer.prototype.add = KMap.FeatureLayer.NOTALLOW;
/**
 * @api
 */
KMap.FeatureLayer.prototype.remove = KMap.FeatureLayer.NOTALLOW;
/**
 * @api
 */
KMap.FeatureLayer.prototype.clear = KMap.FeatureLayer.NOTALLOW;
/**
 * @api
 */
KMap.FeatureLayer.prototype.addAll = KMap.FeatureLayer.NOTALLOW;

KMap.FeatureLayer.NOTALLOW = function() {
    throw 'Layer is not allowed to opearte';
}
