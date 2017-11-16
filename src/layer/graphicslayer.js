goog.provide('KMap.GraphicsLayer');

goog.require('KMap');
goog.require('KMap.Layer');
goog.require('KMap.Renderer');

/**
 * @api
 * @constructor
 * @extends {KMap.Layer}
 * @param {string} id
 * @param {Object|ol.layer.Base} options
 */
KMap.GraphicsLayer = function (id, options) {
    KMap.Layer.call(this, id, options);
};
ol.inherits(KMap.GraphicsLayer, KMap.Layer);

/**
 * @param {Object} options 
 * @returns {ol.layer.Base}
 */
KMap.GraphicsLayer.prototype.createLayer = function (options) {
    var self = this;
    var source = new ol.source.Vector();
    /**
     * 添加要素和图层之间的关系
     */
    source.on("addfeature", function (e) {
        var graphic = new KMap.Graphic(e.feature);
        graphic.setLayer(self);
    });
    source.on("removefeature", function (e) {
        var graphic = new KMap.Graphic(e.feature);
        graphic.setLayer(null);
    });

    var vector_layer = new ol.layer.Vector({
        source: source,
        style: function (feature) {
            var style = null;
            var graphic = new KMap.Graphic(feature);
            if (graphic.getVisible()) {
                var symbol = graphic.getSymbol();
                if (!symbol) {
                    var renderer = self.getRenderer();
                    if (renderer) {
                        symbol = renderer.getSymbol(graphic);
                    }
                }
                if (symbol) {
                    style = symbol.getStyle();
                }
            }
            return style;
        }
    });
    return vector_layer;
};

/**
 * @api
 * @param {ol.layer.Base} layer 
 * @returns {KMap.Layer}
 */
KMap.GraphicsLayer.fromLayer = function (layer) {
    var layerId = /**@type {string}*/ (layer.get(KMap.Layer.Property.ID));
    return new KMap.GraphicsLayer(layerId, layer);
};

/**
 * 返回图层的类型
 * @return {KMap.Layer.Type}
 * @api
 */
KMap.GraphicsLayer.prototype.getType = function () {
    return KMap.Layer.Type.GraphicsLayer;
};

/**
 * @api
 * @return {ol.source.Vector}
 */
KMap.GraphicsLayer.prototype.getSource = function () {
    var layer = /**@type {ol.layer.Vector}*/ (this.getLayer());
    return /**@type {ol.source.Vector}*/ (layer.getSource());
};

/**
 * @api
 * @return {ol.Extent}
 */
KMap.GraphicsLayer.prototype.getExtent = function () {
    var layer = /**@type {ol.layer.Vector}*/ (this.getLayer());
    return layer.getExtent() || layer.getSource().getExtent();
};

/**
 * @api
 * @param {KMap.Graphic} graphic
 */
KMap.GraphicsLayer.prototype.add = function (graphic) {
    var source = this.getSource();
    source.addFeature(graphic.getFeature());
};

/**
 * @api
 */
KMap.GraphicsLayer.prototype.remove = function (graphic) {
    var source = this.getSource();
    source.removeFeature(graphic.getFeature());
};

/**
 * @api
 */
KMap.GraphicsLayer.prototype.clear = function () {
    var source = this.getSource();
    source.clear();
};

/**
 * 添加多个图形到图层
 * @api
 * @param {Array.<KMap.Graphic>} graphicArray
 */
KMap.GraphicsLayer.prototype.addAll = function (graphicArray) {
    var features = [];
    for (var i = 0; i < graphicArray.length; i++) {
        features.push(graphicArray[i].getFeature());
    }
    var source = this.getSource();
    source.addFeatures(features);
};

/**
 * 添加多个图形到图层
 * @api
 * @param {string} id
 * @return {KMap.Graphic}
 */
KMap.GraphicsLayer.prototype.get = function (id) {
    var source = this.getSource();
    var feature = source.getFeatureById(id);
    if (feature) {
        return new KMap.Graphic(feature);
    }
    return null;
};

/**
 * 返回图形的总数
 * @api
 * @return {number} 图形的总数
 */
KMap.GraphicsLayer.prototype.getLength = function () {
    var source = this.getSource();
    var features = source.getFeatures();
    return features.length;
};

/**
 * 遍历图层所有图形
 * @api
 * @param {function(this: T, KMap.Graphic): S} callback 
 * @param {T=} opt_this The object to use as `this` in the callback
 * @return {S|undefined} The return value from the last call to the callback. 
 * @template T,S 
 */
KMap.GraphicsLayer.prototype.forEach = function (callback, opt_this) {
    return this.getSource().forEachFeature(
        function (feature) {
            return callback.call(opt_this, new KMap.Graphic(feature))
        });
};

/**
 * @api
 * @param {KMap.Renderer} renderer
 */
KMap.GraphicsLayer.prototype.setRenderer = function (renderer) {
    var layer = this.getLayer();
    layer.set(KMap.GraphicsLayer.Property.RENDERER, renderer);
};

/**
 * @api
 * @return {KMap.Renderer}
 */
KMap.GraphicsLayer.prototype.getRenderer = function () {
    var layer = this.getLayer();
    return /** @type {KMap.Renderer}*/ (layer.get(KMap.GraphicsLayer.Property.RENDERER));
};

/**
 * @param {KMap.InfoTemplate} infoTemplate
 * @api
 */
KMap.GraphicsLayer.prototype.setInfoTemplate = function (infoTemplate) {
    var layer = this.getLayer();
    layer.set(KMap.GraphicsLayer.Property.INFOTEMPLATE, infoTemplate);
};

/**
 * @return {KMap.InfoTemplate}
 * @api
 */
KMap.GraphicsLayer.prototype.getInfoTemplate = function () {
    var layer = this.getLayer();
    return /** @type {KMap.InfoTemplate}*/ (layer.get(KMap.GraphicsLayer.Property.INFOTEMPLATE));
};

/**
 * @enum {string}
 * @api
 */
KMap.GraphicsLayer.Property = {
    RENDERER: 'GRAPHICSLAYER_RENDERER',
    INFOTEMPLATE: 'GRAPHICSLAYER_INFOTEMPLATE'
};