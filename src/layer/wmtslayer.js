goog.provide('KMap.WMTSLayer');

goog.require('KMap');
goog.require('KMap.Layer');

/**
 * @api
 * @constructor
 * @extends {KMap.Layer}
 * @param {string} id id.
 * @param {MapX.WMTSOptions|ol.layer.Base} options options.
 */
KMap.WMTSLayer = function (id, options) {
    KMap.Layer.call(this, id, options);
};
ol.inherits(KMap.WMTSLayer, KMap.Layer);

/**
 * @param {Object} options 
 * @returns {ol.layer.Base}
 */
KMap.WMTSLayer.prototype.createLayer = function (options) {
    var wmts_layer = new ol.layer.Tile();
    var opt = /** @type {MapX.WMTSOptions} */ (ol.obj.assign({}, options));
    this.loadWMTS_(opt.url, null, function (text) {
        var parser = new ol.format.WMTSCapabilities();
        var result = parser.read(text);

        var wmts_options = ol.source.WMTS.optionsFromCapabilities(result, opt);
        wmts_options.layer = wmts_options.layer || '';
        wmts_options.matrixSet = wmts_options.matrixSet || 'EPSG:4326';

        var wmts_source = new ol.source.WMTS(wmts_options);
        wmts_layer.setSource(wmts_source);
    });
    return wmts_layer;
};

KMap.WMTSLayer.prototype.loadWMTS_ = function (url, args, callback) {
    jQuery.ajax({
        url: encodeURI(url),
        async: true,
        type: 'GET',
        cache: false,
        dataType: 'text',
        success: function (data) {
            callback(data);
        },
        error: function (data, status, reson) {
            alert('KMap.WMTSLayer.loadWMTS_ error: data=' + data + ',status=' + status + ',reson=' + reson);
        }
    });
};

/**
 * @api
 * @param {ol.layer.Base} layer 
 * @returns {KMap.Layer}
 */
KMap.WMTSLayer.fromLayer = function (layer) {
    var layerId = /**@type {string}*/ (layer.get(KMap.Layer.Property.ID));
    return new KMap.WMTSLayer(layerId, layer);
};

/**
 * 返回图层的类型
 * @return {KMap.Layer.Type}
 * @api
 */
KMap.WMTSLayer.prototype.getType = function () {
    return KMap.Layer.Type.WMTSLayer;
};