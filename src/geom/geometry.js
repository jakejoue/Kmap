goog.provide('KMap.Geometry');

goog.require('KMap');

goog.require('ol.geom.Geometry');
goog.require('ol.geom.Polygon');
goog.require('ol.geom.Circle');

goog.require('ol.format.WKT');
goog.require('ol.format.GeoJSON');
goog.require('ol.format.EsriJSON');

/**
 * @constructor
 * @param {ol.geom.Geometry|null} geometry
 * @api
 */
KMap.Geometry = function (geometry) {
    /**
     * @protected
     * @type {ol.geom.Geometry}
     */
    this.geometry_ = geometry;
};

/**
 * @return {ol.geom.Geometry} 
 * @api
 */
KMap.Geometry.prototype.getGeometry = function () {
    return this.geometry_;
};

/**
 * @param {ol.geom.Geometry} geometry
 * @api
 */
KMap.Geometry.prototype.setGeometry = function (geometry) {
    this.geometry_ = geometry;
};

/**
 * @return {ol.Extent} 
 * @api
 */
KMap.Geometry.prototype.getExtent = function () {
    return this.geometry_.getExtent();
};

/**
 * @return {string}
 * @api
 */
KMap.Geometry.prototype.getType = function () {
    if ((this.geometry_ instanceof ol.geom.Point) || (this.geometry_ instanceof ol.geom.MultiPoint)) {
        return "point";
    } else if ((this.geometry_ instanceof ol.geom.Polygon) || (this.geometry_ instanceof ol.geom.MultiPolygon)) {
        return "polygon";
    } else if ((this.geometry_ instanceof ol.geom.LineString) || (this.geometry_ instanceof ol.geom.MultiLineString)) {
        return "polyline";
    } else if ((this.geometry_ instanceof ol.geom.Circle)) {
        return "circel";
    }
    return "unknown";
};

/**
 * @param {ol.Extent} extent
 * @return {KMap.Geometry} 
 * @api
 */
KMap.Geometry.fromExtent = function (extent) {
    var geometry = ol.geom.Polygon.fromExtent(extent);
    return new KMap.Polygon(geometry);
};

/**
 * @param {string} json
 * @return {KMap.Geometry} 
 * @api
 */
KMap.Geometry.fromGeoJson = function (json) {
    var format = new ol.format.GeoJSON();
    var geometry = format.readGeometry(json);
    return KMap.Geometry.fromGeometry(geometry);
};

/**
 * @param {KMap.Geometry} geometry
 * @return {string} 
 * @api
 */
KMap.Geometry.toGeoJson = function (geometry) {
    var geom = geometry.getGeometry();
    var format = new ol.format.GeoJSON();
    return format.writeGeometry(geom);
};

/**
 * @param {string} json
 * @return {KMap.Geometry} 
 * @api
 */
KMap.Geometry.fromEsriJson = function (json) {
    var format = new ol.format.EsriJSON();
    var geometry = format.readGeometry(json);
    return KMap.Geometry.fromGeometry(geometry);
};

/**
 * @param {KMap.Geometry} geometry
 * @return {string} 
 * @api
 */
KMap.Geometry.toEsriJson = function (geometry) {
    var geom = geometry.getGeometry();
    var format = new ol.format.EsriJSON();
    return format.writeGeometry(geom);
};

/**
 * @param {string} wkt
 * @return {KMap.Geometry} 
 * @api
 */
KMap.Geometry.fromWKT = function (wkt) {
    var format = new ol.format.WKT();
    var geometry = format.readGeometry(wkt);

    return KMap.Geometry.fromGeometry(geometry);
};

/**
 * @param {KMap.Geometry} geometry
 * @return {string} 
 * @api
 */
KMap.Geometry.toWKT = function (geometry) {
    var geom = geometry.getGeometry();
    var format = new ol.format.WKT();
    return format.writeGeometry(geom);
};

/**
 * @param {ol.geom.Geometry} geometry
 * @return {KMap.Geometry} 
 * @api
 */
KMap.Geometry.fromGeometry = function (geometry) {
    if (geometry instanceof ol.geom.Point) {
        var point = /**@type {ol.geom.Point} */ (geometry);
        return new KMap.Point(point);
    } else if (geometry instanceof ol.geom.MultiPoint) {
        var multiPoint = /** @type {ol.geom.MultiPoint} */ (geometry);
        return new KMap.MultiPoint(multiPoint);
    } else if (geometry instanceof ol.geom.Polygon) {
        var polygon = /** @type {ol.geom.Polygon} */ (geometry);
        return new KMap.Polygon(polygon);
    } else if (geometry instanceof ol.geom.MultiPolygon) {
        var multiPolygon = /** @type {ol.geom.MultiPolygon} */ (geometry);
        return new KMap.MultiPolygon(multiPolygon);
    } else if (geometry instanceof ol.geom.LineString) {
        return new KMap.Polyline([geometry.getCoordinates()]);
    } else if (geometry instanceof ol.geom.MultiLineString) {
        var multiLineString = /** @type {ol.geom.MultiLineString} */ (geometry);
        return new KMap.Polyline(multiLineString);
    }
    return null;
};

/**
 * @return {ol.Coordinate|Array.<ol.Coordinate>|Array.<Array.<ol.Coordinate>>}
 * @api
 */
KMap.Geometry.prototype.getCoordinates = function () {
    if (this.geometry_ instanceof ol.geom.Point) {
        var geom = /**@type {ol.geom.Point} */(this.geometry_);
        return geom.getCoordinates();
    } else if (this.geometry_ instanceof ol.geom.MultiPoint) {
        var geom = /**@type {ol.geom.MultiPoint} */(this.geometry_);
        return geom.getCoordinates();
    } else if (this.geometry_ instanceof ol.geom.Polygon) {
        var geom = /**@type {ol.geom.Polygon} */(this.geometry_);
        return geom.getCoordinates();
    } else if (this.geometry_ instanceof ol.geom.MultiPolygon) {
        var geom = /**@type {ol.geom.MultiPolygon} */ (this.geometry_);
        return geom.getCoordinates();
    } else if (this.geometry_ instanceof ol.geom.LineString) {
        var geom = /**@type {ol.geom.LineString} */ (this.geometry_);
        return geom.getCoordinates();
    } else if (this.geometry_ instanceof ol.geom.MultiLineString) {
        var geom = /**@type {ol.geom.MultiLineString} */ (this.geometry_);
        return geom.getCoordinates();
    } else if (this.geometry_ instanceof ol.geom.Circle) {
        var geom = /**@type {ol.geom.Circle} */ (this.geometry_);
        return geom.getCenter();
    }
    return null;
};