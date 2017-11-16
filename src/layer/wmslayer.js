goog.provide('KMap.WMSLayer');

goog.require('KMap');
goog.require('KMap.Layer');
goog.require('ol.layer.Image');
goog.require('ol.source.ImageWMS');

/**
 * @api
 * @constructor
 * @extends {KMap.Layer}
 * @param {string} id
 * @param {MapX.WMSLayerOptions|ol.layer.Base} options
 */
KMap.WMSLayer = function (id, options) {
    KMap.Layer.call(this, id, options);
};
ol.inherits(KMap.WMSLayer, KMap.Layer);

/**
 * @param {Object} options 
 * @returns {ol.layer.Base}
 */
KMap.WMSLayer.prototype.createLayer = function (options) {
    var wms_config = /** @type {MapX.WMSLayerOptions} */ (ol.obj.assign({}, options));

    var wms_params = {};
    wms_params["format"] = wms_config.format;
    wms_params["LAYERS"] = wms_config.layers;
    wms_params["srs"] = wms_config.srs;
    wms_params["VERSION"] = wms_config.version || '1.1.1';

    var wms_options = {
        crossOrigin: 'anonymous',
        url: wms_config.url,
        projection: wms_config.projection,
        resolutions: wms_config.resolutions,
        params: wms_params
    };

    var wms_layer = new ol.layer.Image();
    var wms_source = new ol.source.ImageWMS(wms_options);
    wms_layer.setSource(wms_source);
    return wms_layer;
};

/**
 * @api
 * @param {ol.layer.Base} layer 
 * @returns {KMap.Layer}
 */
KMap.WMSLayer.fromLayer = function (layer) {
    var layerId = /**@type {string}*/ (layer.get(KMap.Layer.Property.ID));
    return new KMap.WMSLayer(layerId, layer);
};

/**
 * 返回图层的类型
 * @return {KMap.Layer.Type}
 * @api
 */
KMap.WMSLayer.prototype.getType = function () {
    return KMap.Layer.Type.WMSLayer;
};

/**
 * 动态修改参数
 * @param {Object} params
 * @api
 */
KMap.WMSLayer.prototype.updateParams = function (params) {
    var layer = /** @type {ol.layer.Image} */ (this.getLayer());
    var source = /** @type {ol.source.ImageWMS} */ (layer.getSource());
    source.updateParams(params);
};

/**
 * 动态修改参数
 * @return {Object}
 * @api
 */
KMap.WMSLayer.prototype.getParams = function () {
    var layer = /** @type {ol.layer.Image} */ (this.getLayer());
    var source = /** @type {ol.source.ImageWMS} */ (layer.getSource());
    return source.getParams();
};

/**
 * Return the GetFeatureInfo URL for the passed coordinate, resolution, and
 * projection. Return `undefined` if the GetFeatureInfo URL cannot be
 * constructed.
 * @param {ol.Coordinate} coordinate Coordinate.
 * @param {number} resolution Resolution.
 * @param {ol.ProjectionLike} projection Projection.
 * @param {!Object} params GetFeatureInfo params. `INFO_FORMAT` at least should
 *     be provided. If `QUERY_LAYERS` is not provided then the layers specified
 *     in the `LAYERS` parameter will be used. `VERSION` should not be
 *     specified here.
 * @return {string|undefined} GetFeatureInfo URL.
 * @api
 */
KMap.WMSLayer.prototype.getFeatureInfoUrl = function (coordinate, resolution, projection, params) {
    var layer = /** @type {ol.layer.Image} */ (this.getLayer());
    var source = /** @type {ol.source.ImageWMS} */ (layer.getSource());
    return source.getGetFeatureInfoUrl(coordinate, resolution, projection, params);
};