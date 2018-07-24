goog.provide('KMap.ClusterLayer');

goog.require('KMap');
goog.require('KMap.Layer');
goog.require('KMap.Graphic');
goog.require('KMap.GraphicsLayer');

/**
 * @api
 * @constructor
 * @extends {KMap.GraphicsLayer}
 * @param {string} id id.
 * @param {Object|ol.layer.Base} options options.
 */
KMap.ClusterLayer = function(id, options) {
    this.features = new ol.Collection();
    /**
     * @type {ol.source.Cluster}
     */
    this.source = null;

    KMap.GraphicsLayer.call(this, id, options);
};
ol.inherits(KMap.ClusterLayer, KMap.GraphicsLayer);

/**
 * @param {Object} options 
 * @returns {ol.layer.Base}
 */
KMap.ClusterLayer.prototype.createLayer = function(options) {
    options = options || {};
    
    var self = this;

    var source = new ol.source.Vector({
        features: this.features
    });
    /**
     * 添加要素和图层之间的关系
     */
    source.on("addfeature", function(e) {
        var graphic = new KMap.Graphic(e.feature);
        graphic.setLayer(self);
    });
    source.on("removefeature", function(e) {
        var graphic = new KMap.Graphic(e.feature);
        graphic.setLayer(null);
    });
    this.source = new ol.source.Cluster({
        distance: options.distance || 0,
        source: source
    });

    var clusterLayer = new ol.layer.Vector({
        source: this.source,
        style: function(feature) {
            var style = null;

            var graphics = /**@type {Array.<ol.Feature>}*/ (feature.get("features")).map(function(feature) {
                return new KMap.Graphic(feature);
            });
            var graphic = new KMap.Graphic(feature);
            graphic.setAttribute("graphics", graphics);

            var renderer = self.getRenderer();
            if (renderer) {
                var symbol = renderer.getSymbol(graphic);
                style = symbol.getStyle();
            }
            return style;
        }
    });
    return clusterLayer;
};


/**
 * 返回图层的类型
 * @return {KMap.Layer.Type}
 * @api
 */
KMap.ClusterLayer.prototype.getType = function() {
    return KMap.Layer.Type.ClusterLayer;
};


/**
 * @api
 * @param {KMap.Graphic} graphic
 */
KMap.ClusterLayer.prototype.add = function(graphic) {
    this.features.push(graphic.getFeature());
};

/**
 * @api
 */
KMap.ClusterLayer.prototype.remove = function(graphic) {
    this.features.remove(graphic.getFeature());
};

/**
 * @api
 */
KMap.ClusterLayer.prototype.clear = function() {
    this.features.clear();
};

/**
 * 添加多个图形到图层
 * @api
 * @param {Array.<KMap.Graphic>} graphicArray
 */
KMap.ClusterLayer.prototype.addAll = function(graphicArray) {
    for (var i = 0; i < graphicArray.length; i++) {
        this.features.push(graphicArray[i].getFeature());
    }
};

/**
 * 添加多个图形到图层
 * @api
 * @param {string} id
 * @return {KMap.Graphic}
 */
KMap.ClusterLayer.prototype.get = function(id) {
    return null;
};

/**
 * 返回图形的总数
 * @api
 * @return {number} 图形的总数
 */
KMap.ClusterLayer.prototype.getLength = function() {
    return this.features.getLength();
};

/**
 * 遍历图层所有图形
 * @api
 * @param {function(this: T, KMap.Graphic): S} callback 
 * @param {T=} opt_this The object to use as `this` in the callback
 * @return {S|undefined} The return value from the last call to the callback. 
 * @template T,S 
 */
KMap.ClusterLayer.prototype.forEach = function(callback, opt_this) {
    return this.features.forEach(function(feature) {
        return callback.call(opt_this, new KMap.Graphic(feature))
    });
};

/**
 * @api
 */
KMap.ClusterLayer.prototype.getDistance = function() {
    return this.source.getDistance();
}

/**
 * @api
 * @param {number} distance 
 */
KMap.ClusterLayer.prototype.setDistance = function(distance) {
    return this.source.setDistance(distance);
}

/**
 * @api
 * @param {ol.layer.Base} layer 
 * @returns {KMap.Layer}
 */
KMap.ClusterLayer.fromLayer = function(layer) {
    var layerId = /**@type {string}*/ (layer.get(KMap.Layer.Property.ID));
    return new KMap.ClusterLayer(layerId, layer);
};