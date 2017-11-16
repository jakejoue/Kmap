goog.provide('KMap.ArcGISRestLayer');

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
 * @param {Object|ol.layer.Base} options options
 */
KMap.ArcGISRestLayer = function (id, options) {
    KMap.Layer.call(this, id, options);
};
ol.inherits(KMap.ArcGISRestLayer, KMap.Layer);

/**
 * @param {Object} options 
 * @returns {ol.layer.Base}
 */
KMap.ArcGISRestLayer.prototype.createLayer = function (options) {
    var extent = options["extent"];
    var tile = options["tile"];
    if (tile) {
        var tile_options = /**@type {olx.source.TileArcGISRestOptions} */ ({
            "projection": options["projection"],
            "url": options["url"],
            "params": {
                "layers": options["layers"] || ""
            }
        });
        var tile_layer = new ol.layer.Tile({
            extent: extent,
            source: new ol.source.TileArcGISRest(tile_options)
        });
        return tile_layer;
    } else {
        var image_options = /**@type {olx.source.ImageArcGISRestOptions} */ ({
            "projection": options["projection"],
            "url": options["url"],
            "params": {
                "layers": options["layers"] || ""
            }
        });
        var image_layer = new ol.layer.Image({
            extent: extent,
            source: new ol.source.ImageArcGISRest(image_options)
        });
        return image_layer;
    }
};

/**
 * @api
 * @param {ol.layer.Base} layer 
 * @returns {KMap.Layer}
 */
KMap.ArcGISRestLayer.fromLayer = function (layer) {
    var layerId = /**@type {string}*/ (layer.get(KMap.Layer.Property.ID));
    return new KMap.ArcGISRestLayer(layerId, layer);
};

/**
 * 返回图层的类型
 * @return {KMap.Layer.Type}
 * @api
 */
KMap.ArcGISRestLayer.prototype.getType = function () {
    return KMap.Layer.Type.ArcGISRestLayer;
};

/**
 * 动态修改参数
 * @param {Object} params
 * @api
 */
KMap.ArcGISRestLayer.prototype.updateParams = function (params) {
    var layer = this.getLayer();
    if (layer instanceof ol.layer.Tile) {
        var tile_layer = /**@type {ol.layer.Tile} */ (layer);
        var source = /**@type {ol.source.TileArcGISRest} */ (tile_layer.getSource());
        source.updateParams(params);
    } else if (layer instanceof ol.layer.Image) {
        var image_layer = /**@type {ol.layer.Image} */ (layer);
        var source = /**@type {ol.source.ImageArcGISRest} */(image_layer.getSource());
        source.updateParams(params);
    }
};

/**
 * @return {Object}
 */
KMap.ArcGISRestLayer.prototype.getParams = function () {
    var source = this.getSource();
    return source.getParams();
};

/**
 * @return {string|undefined}
 */
KMap.ArcGISRestLayer.prototype.getUrl = function () {
    var source = this.getSource();
    return source.getUrl();
};

/**
 * @return {ol.source.TileArcGISRest|ol.source.ImageArcGISRest}
 */
KMap.ArcGISRestLayer.prototype.getSource = function () {
    var layer = this.getLayer();
    if (layer instanceof ol.layer.Tile) {
        var tile_layer = /**@type {ol.layer.Tile} */ (layer);
        var source = /**@type {ol.source.TileArcGISRest} */ (tile_layer.getSource());
        return source;
    } else {
        var image_layer = /**@type {ol.layer.Image} */ (layer);
        var source = /**@type {ol.source.ImageArcGISRest} */(image_layer.getSource());
        return source;
    }
};

/**
 * @const
 * @type {ol.Size}
 * @private
 */
KMap.ArcGISRestLayer.GETFEATUREINFO_IMAGE_SIZE_ = [101, 101];

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
KMap.ArcGISRestLayer.prototype.getIdentifyUrl = function (coordinate, resolution, projection, params) {

    var url = this.getUrl();
    if (url === undefined) {
        return undefined;
    }

    var size = KMap.ArcGISRestLayer.GETFEATUREINFO_IMAGE_SIZE_.slice();
    var extent = ol.extent.getForViewAndSize(
        coordinate, resolution, 0,
        size);

    // ArcGIS Server only wants the numeric portion of the projection ID.
    var srid = ol.proj.get(this.getSource().getProjection() || projection).getCode().split(':').pop();

    size.push(90);
    var baseParams = {
        'F': 'json',
        'MAPEXTENT': extent.join(','),
        'IMAGEDISPLAY': size.join(','),
        'TOLERANCE': 10,
        'GEOMETRY': coordinate.join(','),
        'GEOMETRYTYPE': 'esriGeometryPoint',
        'SR': srid,
        'RETURNGEOMETRY': true,

    };
    ol.obj.assign(baseParams, params);

    var modifiedUrl = url
        .replace(/MapServer\/?$/, 'MapServer/identify');
    if (modifiedUrl == url) {
        ol.asserts.assert(false, 50); // `options.featureTypes` should be an Array
    }
    return ol.uri.appendParams(modifiedUrl, baseParams);
}