goog.provide('KMap.AMapLayer');

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
KMap.AMapLayer = function (id, options) {
    KMap.Layer.call(this, id, options);
};
ol.inherits(KMap.AMapLayer, KMap.Layer);

/**
 * @param {Object} options
 * @returns {ol.layer.Base}
 */
KMap.AMapLayer.prototype.createLayer = function (options) {
    var amap_source = new ol.source.XYZ({
        url: options["url"],
        crossOrigin: "anonymous",
        projection: ol.proj.get("EPSG:GCJ02MC") || "EPSG:3857"
    });

    var amap_layer = new ol.layer.Tile({
        source: amap_source
    });
    return amap_layer;
};

/**
 * @api
 * @param {ol.layer.Base} layer
 * @returns {KMap.Layer}
 */
KMap.AMapLayer.fromLayer = function (layer) {
    var layerId = /**@type {string}*/ (layer.get(KMap.Layer.Property.ID));
    return new KMap.AMapLayer(layerId, layer);
};

/**
 * 返回图层的类型
 * @return {KMap.Layer.Type}
 * @api
 */
KMap.AMapLayer.prototype.getType = function () {
    return KMap.Layer.Type.AMapLayer;
};
