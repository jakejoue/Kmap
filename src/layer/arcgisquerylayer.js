goog.provide('KMap.ArcGISQueryLayer')
goog.require('KMap');
goog.require('KMap.FeatureLayer');

/**
 * ArcGisQuery 图层
 * @api
 * @constructor
 * @extends {KMap.FeatureLayer}
 * @param {string} id
 * @param {MapX.FeatureLayerOptions|ol.layer.Base} options
 */
KMap.ArcGISQueryLayer = function(id, options) {
    KMap.FeatureLayer.call(this, id, options);
}

ol.inherits(KMap.ArcGISQueryLayer, KMap.FeatureLayer);

/**
 * @override
 * @param {Object=} options options
 * @returns {ol.layer.Base}
 */
KMap.ArcGISQueryLayer.prototype.createLayer = function(options) {
    var url = options.url;
    var param = options.param || 'f=pjson&where=1%3D1&outFields=*';

    var url_ = '';
    if (options['proxyUrl']) { url_ = options['proxyUrl'] + '?'; }
    if (url) {
        url_ += url + '?' + param;
    } else {
        throw 'ArcGISQueryLayer: url is requried';
    }

    return KMap.FeatureLayer.prototype.createLayer.call(this, {
        format: 'esrijson',
        url: url_,
        strategy: ol.loadingstrategy.all
    });
};
