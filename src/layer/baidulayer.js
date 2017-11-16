goog.provide('KMap.BaiduLayer');

goog.require('KMap');
goog.require('KMap.Layer');
goog.require('KMap.Transform');
goog.require('ol.proj');

/**
 * @api
 * @constructor
 * @extends {KMap.Layer}
 * @param {string} id id.
 * @param {Object|ol.layer.Base} options options.
 */
KMap.BaiduLayer = function (id, options) {
    KMap.Layer.call(this, id, options);

    this.transform = new KMap.Transform();
};
ol.inherits(KMap.BaiduLayer, KMap.Layer);

/**
 * @param {Object} options 
 * @returns {ol.layer.Base}
 */
KMap.BaiduLayer.prototype.createLayer = function (options) {
    var projection = ol.proj.get("EPSG:3857");
    var resolutions = [];
    for (var i = 0; i <= 19; i++) {
        resolutions[i] = Math.pow(2, 18 - i);
    }
    var tilegrid = new ol.tilegrid.TileGrid({
        origin: [0, 0],
        resolutions: resolutions,
        minZoom: 3
    });
    var baidu_source = new ol.source.TileImage({
        projection: projection,
        tileGrid: tilegrid,
        url: options["url"]
    });

    var baidu_layer = new ol.layer.Tile({
        source: baidu_source
    });
    return baidu_layer;
};

/**
 * @api
 * @param {ol.layer.Base} layer 
 * @returns {KMap.Layer}
 */
KMap.BaiduLayer.fromLayer = function (layer) {
    var layerId = /**@type {string}*/ (layer.get(KMap.Layer.Property.ID));
    return new KMap.BaiduLayer(layerId, layer);
};

/**
 * 返回图层的类型
 * @return {KMap.Layer.Type}
 * @api
 */
KMap.BaiduLayer.prototype.getType = function () {
    return KMap.Layer.Type.BaiduLayer;
};