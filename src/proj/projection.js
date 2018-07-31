goog.provide('KMap.Projection');

goog.require('KMap');
goog.require('KMap.Transform')
goog.require('ol.proj');
goog.require('ol.proj.Projection');

/**
 * 定义坐标系并注册
 * @constructor
 * @param {olx.ProjectionOptions|string} options
 * @api
 */
KMap.Projection = function (options) {
    var projection;
    if (typeof (options) === 'string') {
        var code = /**@type {string} */ (options);
        projection = ol.proj.get(options);
    } else {
        var projOptions = /**@type {olx.ProjectionOptions} */ (options);
        projection = ol.proj.get(projOptions.code);
        if (!projection) {
            projection = new ol.proj.Projection(projOptions)
            ol.proj.addProjection(projection);
        }
    }

    /**
     * @type {ol.proj.Projection}
     */
    this.projection = projection;
};

/**
 * 定义一系列与当前坐标系相等的坐标系
 *
 * @param {Array.<string>} codes
 * @api
 */
KMap.Projection.prototype.addEquivalentProjections = function (codes) {
    var self = this;
    var projections = codes.map(function (code) {
        var projection = ol.proj.get(code);
        if (!projection) {
            projection = new ol.proj.Projection({
                code: code,
                units: self.projection.getUnits(),
                extent: self.projection.getExtent(),
                axisOrientation: self.projection.getAxisOrientation(),
                global: self.projection.isGlobal(),
                metersPerUnit: self.projection.getMetersPerUnit(),
                worldExtent: self.projection.getWorldExtent(),
                getPointResolution: self.projection.getPointResolutionFunc()
            });
            ol.proj.addProjection(projection);
        }
        return projection;
    });
    projections.push(this.projection);
    ol.proj.addEquivalentProjections(projections);
};

/**
 * 获取每个单位多少米
 * @api
 * @return {number|undefined}
 */
KMap.Projection.prototype.getMetersPerUnit = function () {
    return this.projection.getMetersPerUnit();
};

/**
 * Transforms a coordinate from source projection to destination projection.
 * This returns a new coordinate (and does not modify the original).
 *
 * See {@link ol.proj.transformExtent} for extent transformation.
 * See the transform method of {@link ol.geom.Geometry} and its subclasses for
 * geometry transforms.
 *
 * @param {ol.Coordinate} coordinate Coordinate.
 * @param {ol.ProjectionLike} source Source projection-like.
 * @param {ol.ProjectionLike} destination Destination projection-like.
 * @return {ol.Coordinate} Coordinate.
 * @api
 */
KMap.Projection.transform = function (coordinate, source, destination) {
    return ol.proj.transform(coordinate, source, destination);
};

/**
* @param {olx.ProjectionOptions|string} options
* @return {KMap.Projection} projection.
* @api
*/
KMap.Projection.get = function (options) {
    return new KMap.Projection(options);
};

/**
 * Registers coordinate transform functions to convert coordinates between the
 * source projection and the destination projection.
 * The forward and inverse functions convert coordinate pairs; this function
 * converts these into the functions used internally which also handle
 * extents and coordinate arrays.
 *
 * @param {ol.ProjectionLike} source Source projection.
 * @param {ol.ProjectionLike} destination Destination projection.
 * @param {function(ol.Coordinate): ol.Coordinate} forward The forward transform
 *     function (that is, from the source projection to the destination
 *     projection) that takes a {@link ol.Coordinate} as argument and returns
 *     the transformed {@link ol.Coordinate}.
 * @param {function(ol.Coordinate): ol.Coordinate} inverse The inverse transform
 *     function (that is, from the destination projection to the source
 *     projection) that takes a {@link ol.Coordinate} as argument and returns
 *     the transformed {@link ol.Coordinate}.
 * @api
 */
KMap.Projection.addCoordinateTransforms = function (source, destination, forward, inverse) {
    ol.proj.addCoordinateTransforms(source, destination, forward, inverse);
};

/**
 * @api
 * 初始化bdmc坐标和坐标间转换
 */
KMap.Projection.initBDMCProj = function () {
    var transform = new KMap.Transform();

    var porj_3857 = new KMap.Projection("EPSG:3857");
    porj_3857.addEquivalentProjections(["EPSG:BDMC"]);

    ol.proj.addCoordinateTransforms("EPSG:4326", "EPSG:BDMC",
        function (coordinate) {
            var ll = transform.gcj_encrypt(coordinate[1], coordinate[0]);
            ll = transform.bd_encrypt(ll["lat"], ll["lon"]);
            ll = transform.bdmc_encrypt(ll["lat"], ll["lon"]);
            return [ll["lon"], ll["lat"]];
        },
        function (coordinate) {
            var ll = transform.bdmc_decrypt(coordinate[1], coordinate[0]);
            ll = transform.bd_decrypt(ll["lat"], ll["lon"]);
            ll = transform.gcj_decrypt(ll["lat"], ll["lon"]);
            return [ll["lon"], ll["lat"]];
        }
    );
    ol.proj.addCoordinateTransforms("EPSG:3857", "EPSG:BDMC",
        function (coordinate) {
            coordinate = ol.proj.toLonLat(coordinate);
            return ol.proj.transform(coordinate, "EPSG:4326", "EPSG:BDMC");
        },
        function (coordinate) {
            coordinate = ol.proj.transform(coordinate, "EPSG:BDMC", "EPSG:4326");
            return ol.proj.transform(coordinate, "EPSG:4326", "EPSG:3857");
        }
    );
};
