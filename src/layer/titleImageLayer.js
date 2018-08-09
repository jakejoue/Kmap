goog.provide('KMap.TileImageLayer');

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
KMap.TileImageLayer = function (id, options) {
    KMap.Layer.call(this, id, options);
};
ol.inherits(KMap.TileImageLayer, KMap.Layer);

/**
 * @param {Object} options
 * @returns {ol.layer.Base}
 */
KMap.TileImageLayer.prototype.createLayer = function (options) {
    var resolutions = options["resolutions"];
    var tileGrid;
    if (!resolutions) {
        tileGrid = ol.tilegrid.createForProjection(options["projection"]);
    } else {
        tileGrid = new ol.tilegrid.TileGrid({
            origin: options["origin"],
            resolutions: options["resolutions"],
            tileSize: options["tileSize"] || [256, 256]
        });
    }

    var tile_source = new ol.source.XYZ({
        url: options["url"],
        crossOrigin: "anonymous",
        projection: options["projection"],
        tileGrid: tileGrid
    });

    var amap_layer = new ol.layer.Tile({
        source: tile_source
    });
    return amap_layer;
};

/**
 * @api
 * @param {ol.layer.Base} layer
 * @returns {KMap.Layer}
 */
KMap.TileImageLayer.fromLayer = function (layer) {
    var layerId = /**@type {string}*/ (layer.get(KMap.Layer.Property.ID));
    return new KMap.TileImageLayer(layerId, layer);
};

/**
 * 返回图层的类型
 * @return {KMap.Layer.Type}
 * @api
 */
KMap.TileImageLayer.prototype.getType = function () {
    return KMap.Layer.Type.TileImageLayer;
};
