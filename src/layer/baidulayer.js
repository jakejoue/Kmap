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
    if (!ol.proj.get('EPSG:BDMC')) {
        var transform = new KMap.Transform();

        var porj_3857 = ol.proj.get("EPSG:3857");
        var proj_bdmc = new ol.proj.Projection({
            code: "EPSG:BDMC",
            units: porj_3857.getUnits(),
            extent: porj_3857.getExtent(),
            axisOrientation: porj_3857.getAxisOrientation(),
            global: porj_3857.isGlobal(),
            metersPerUnit: porj_3857.getMetersPerUnit(),
            worldExtent: porj_3857.getWorldExtent(),
            getPointResolution: porj_3857.getPointResolutionFunc()
        });
        ol.proj.addCoordinateTransforms(porj_3857, proj_bdmc,
            function (coordinate) {
                coordinate = ol.proj.toLonLat(coordinate);
                var ll = transform.bdmc_encrypt(coordinate[1], coordinate[0] );
                return [ll.lon, ll.lat];
            },
            function (coordinate) {
                var ll = transform.bdmc_decrypt(coordinate[1], coordinate[0]);
                return ol.proj.transform([ll.lon, ll.lat], "EPSG:4326", "EPSG:3857");
            }
        );
        ol.proj.addCoordinateTransforms("EPSG:4326", proj_bdmc,
            function (coordinate) {
                var ll = transform.bdmc_encrypt(coordinate[1], coordinate[0]);
                return [ll.lon, ll.lat];
            },
            function (coordinate) {
                var ll = transform.bdmc_decrypt(coordinate[1], coordinate[0]);
                return [ll.lon, ll.lat];
            }
        );
        ol.proj.addProjection(proj_bdmc);
    }
    KMap.Layer.call(this, id, options);
};
ol.inherits(KMap.BaiduLayer, KMap.Layer);

/**
 * @param {Object} options
 * @returns {ol.layer.Base}
 */
KMap.BaiduLayer.prototype.createLayer = function (options) {
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
        projection: "EPSG:BDMC",
        tileGrid: tilegrid,
        url: options["url"],
        crossOrigin: 'anonymous'
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
