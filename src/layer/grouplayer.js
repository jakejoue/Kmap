goog.provide('KMap.GroupLayer');

goog.require('KMap');
goog.require('KMap.Layer');
goog.require('ol.Collection');
goog.require('ol.CollectionEventType');

/**
 * @api
 * @constructor
 * @extends {KMap.Layer}
 * @param {string} id
 * @param {Object|ol.layer.Base} options
 */
KMap.GroupLayer = function (id, options) {
    KMap.Layer.call(this, id, options);
};
ol.inherits(KMap.GroupLayer, KMap.Layer);

/**
 * @param {Object} options 
 * @returns {ol.layer.Base}
 */
KMap.GroupLayer.prototype.createLayer = function (options) {
    var group_layer = new ol.layer.Group();
    return group_layer;
};

/**
 * @api
 * @param {ol.layer.Base} layer 
 * @returns {KMap.Layer}
 */
KMap.GroupLayer.fromLayer = function (layer) {
    var layerId = /**@type {string}*/ (layer.get(KMap.Layer.Property.ID));
    return new KMap.GroupLayer(layerId, layer);
};

/**
 * 返回图层的类型
 * @return {KMap.Layer.Type}
 * @api
 */
KMap.GroupLayer.prototype.getType = function () {
    return KMap.Layer.Type.GroupLayer;
};

/**
 * @api
 * @param {KMap.Layer} layer
 */
KMap.GroupLayer.prototype.push = function (layer) {
    var groupLayer = /**@type {ol.layer.Group} */ (this.getLayer());
    groupLayer.getLayers().push(layer.getLayer());
};

/**
 * @api
 * @param {KMap.Layer} layer
 */
KMap.GroupLayer.prototype.remove = function (layer) {
    var groupLayer = /**@type {ol.layer.Group} */ (this.getLayer());
    groupLayer.getLayers().remove(layer.getLayer());
};

/**
 * @api
 */
KMap.GroupLayer.prototype.clear = function () {
    var groupLayer = /**@type {ol.layer.Group} */ (this.getLayer());
    groupLayer.getLayers().clear();
};

/**
 * @api
 * @return {ol.Collection.<KMap.Layer>}
 */
KMap.GroupLayer.prototype.getLayers = function () {
    var groupLayer = /**@type {ol.layer.Group} */ (this.getLayer());
    var layers = groupLayer.getLayers();

    var newLayers = new ol.Collection();
    for (var i = 0; i < layers.getLength(); i++) {
        newLayers.push(KMap.Layer.fromLayer(layers.item(i)));
    }
    return newLayers;
};

/**
 * @api
 * @param {string} id
 * @return {KMap.Layer}
 */
KMap.GroupLayer.prototype.getSubLayer = function (id) {
    var groupLayer = /**@type {ol.layer.Group} */ (this.getLayer());
    var layers = groupLayer.getLayersArray();

    var layer = ol.array.find(layers, function (item) {
        var layerId = /**@type {string}*/ (item.get(KMap.Layer.Property.ID));
        if (layerId === id) {
            return true;
        }
        return false;
    });
    if (layer) {
        return KMap.Layer.fromLayer(layer);
    }
    return null;
};