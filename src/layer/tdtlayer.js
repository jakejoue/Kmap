goog.provide('KMap.TdtLayer');

goog.require('KMap');
goog.require('KMap.Layer');
goog.require('ol.proj');

/**
 * @api
 * @constructor
 * @extends {KMap.Layer}
 * @param {string} id id.
 * @param {Object|ol.layer.Base} options options.
 */
KMap.TdtLayer = function(id, options) {
    KMap.Layer.call(this, id, options);

};
ol.inherits(KMap.TdtLayer, KMap.Layer);

/**
 * @param {Object} options 
 * @returns {ol.layer.Base}
 */
KMap.TdtLayer.prototype.createLayer = function(options) {
    var projection = ol.proj.get("EPSG:4326");
    var projectionExtent = projection.getExtent();
    var size = ol.extent.getWidth(projectionExtent) / 256;

    var resolutions = [];
    var matrixIds = [];
    for (var z = 0; z < 21; ++z) {
        resolutions[z] = size / Math.pow(2, z);
        matrixIds[z] = z;
    }
    var tileGrid = new ol.tilegrid.WMTS({
        origin: ol.extent.getTopLeft(projectionExtent),
        resolutions: resolutions,
        matrixIds: matrixIds
    });
    var opts = {
        tileGrid: tileGrid,
        projection: projection,
        style: options.style || 'default',
        matrixSet: options.matrixSet,
        url: options.url,
        format: options.format || 'tiles',
        layer: options.layer
    };
    return new ol.layer.Tile({
        source: new ol.source.WMTS( /** @type {!olx.source.WMTSOptions} */ (opts))
    });
};

/**
 * @api
 * @param {ol.layer.Base} layer 
 * @returns {KMap.Layer}
 */
KMap.TdtLayer.fromLayer = function(layer) {
    var layerId = /**@type {string}*/ (layer.get(KMap.Layer.Property.ID));
    return new KMap.TdtLayer(layerId, layer);
};

/**
 * 返回图层的类型
 * @return {KMap.Layer.Type}
 * @api
 */
KMap.TdtLayer.prototype.getType = function() {
    return KMap.Layer.Type.TdtLayer;
};