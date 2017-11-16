goog.provide('KMap.Graphics');

goog.require('KMap');
goog.require('KMap.Graphic');
goog.require('ol.format.GeoJSON');
goog.require('ol.format.EsriJSON');
goog.require('ol.format.GML');
goog.require('ol.format.GML2');
goog.require('ol.array');

/**
 * 
 * 
 * @param {string} json 
 * @return {Array.<KMap.Graphic>}
 * @api
 */
KMap.Graphics.fromGeoJSON = function (json) {
    var format = new ol.format.GeoJSON();
    var features = format.readFeatures(json);
    var graphics = [];
    features.forEach(function (feature) {
        var graphic = new KMap.Graphic(feature);
        graphics.push(graphic);
    });
    return graphics;
};

/**
 * 
 * 
 * @param {string} json 
 * @return {Array.<KMap.Graphic>}
 * @api
 */
KMap.Graphics.fromEsriJSON = function (json) {
    var format = new ol.format.EsriJSON();
    var features = format.readFeatures(json);
    var graphics = [];
    features.forEach(function (feature) {
        var graphic = new KMap.Graphic(feature);
        graphics.push(graphic);
    });
    return graphics;
};

/**
 * 
 * 
 * @param {string} gml 
 * @return {Array.<KMap.Graphic>}
 * @api
 */
KMap.Graphics.fromGML = function (gml) {
    var format = new ol.format.GML();
    var features = format.readFeatures(gml);
    var graphics = [];
    features.forEach(function (feature) {
        var graphic = new KMap.Graphic(feature);
        graphics.push(graphic);
    });
    return graphics;
};

/**
 * 
 * 
 * @param {string} gml2 
 * @return {Array.<KMap.Graphic>}
 * @api
 */
KMap.Graphics.fromGML2 = function (gml2) {
    var format = new ol.format.GML2();
    var features = format.readFeatures(gml2);
    var graphics = [];
    features.forEach(function (feature) {
        var graphic = new KMap.Graphic(feature);
        graphics.push(graphic);
    });
    return graphics;
};