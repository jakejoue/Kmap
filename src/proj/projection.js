goog.provide('KMap.Projection');

goog.require('KMap');
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