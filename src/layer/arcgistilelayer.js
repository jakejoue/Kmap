goog.provide('KMap.ArcGISTileLayer');

goog.require('KMap');
goog.require('KMap.Layer');
goog.require('ol.layer.Tile');
goog.require('ol.source.TileArcGISRest');

/**
 * ArcGIS REST 图层
 * @api
 * @constructor
 * @extends {KMap.Layer}
 * @param {string} id 图层ID
 * @param {MapX.ArcGISTileLayerOptions|ol.layer.Base} options options
 */
KMap.ArcGISTileLayer = function (id, options) {
    KMap.Layer.call(this, id, options);
};
ol.inherits(KMap.ArcGISTileLayer, KMap.Layer);

/**
 * @param {Object} options 
 * @returns {ol.layer.Base}
 */
KMap.ArcGISTileLayer.prototype.createLayer = function (options) {
    var tile_options = /** @type {MapX.ArcGISTileLayerOptions} */ (ol.obj.assign({}, options));
    var url = tile_options.url;
    var projection = options.projection;
    var tile_layer = new ol.layer.Tile();

    /** @type {function(MapX.ArcGISTileLayerInfo)} */
    function tileGridCallback(info) {
        var extent = [info.fullExtent.xmin, info.fullExtent.ymin, info.fullExtent.xmax, info.fullExtent.ymax];
        var viewExtent = [info.initialExtent.xmin, info.initialExtent.ymin, info.initialExtent.xmax, info.initialExtent.ymax];
        var center = [(viewExtent[0] + viewExtent[2]) / 2, (viewExtent[1] + viewExtent[3]) / 2];
        var tileSize = [info.tileInfo.rows, info.tileInfo.cols];
        var origin = [info.tileInfo.origin.x, info.tileInfo.origin.y];
        var resolutions = [];
        for (var i = 0; i < info.tileInfo.lods.length; i++) {
            resolutions[i] = info.tileInfo.lods[i].resolution;
        }

        var tilegrid = new ol.tilegrid.TileGrid({
            extent: extent,
            origin: origin,
            resolutions: resolutions,
            tileSize: tileSize
        });

        var tile_source = new ol.source.TileImage({
            projection: projection,
            tileGrid: tilegrid,
            url: url + '/tile/{z}/{y}/{x}'
        });
        tile_layer.setSource(tile_source);
    };
    this.loadTileGrid_(tile_options, tileGridCallback);
    return tile_layer;
};

/**
 * 
 * 
 * @param {MapX.ArcGISTileLayerOptions} options 
 * @param {function(MapX.ArcGISTileLayerInfo)} callback 
 */
KMap.ArcGISTileLayer.prototype.loadTileGrid_ = function (options, callback) {
    var proxy = options.proxy;
    var url = options.url;
    var dataType = options.dataType || "json";

    jQuery.ajax({
        url: encodeURI(proxy + url + '?f=json'),
        type: 'GET',
        cache: false,
        dataType: dataType,
        jsonp: 'callback',
        success: function (data) {
            callback(data);
        },
        error: function (data, status, reson) {
            alert('请求 ArcGIS Server 切片信息出错');
        }
    });
};

/**
 * @api
 * @param {ol.layer.Base} layer 
 * @returns {KMap.Layer}
 */
KMap.ArcGISTileLayer.fromLayer = function (layer) {
    var layerId = /**@type {string}*/ (layer.get(KMap.Layer.Property.ID));
    return new KMap.ArcGISTileLayer(layerId, layer);
};

/**
 * 返回图层的类型
 * @return {KMap.Layer.Type}
 * @api
 */
KMap.ArcGISTileLayer.prototype.getType = function () {
    return KMap.Layer.Type.ArcGISTileLayer;
};