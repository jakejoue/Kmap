goog.provide('KMap.Polyline');

goog.require('KMap');
goog.require('KMap.Transform');

goog.require('ol.geom.LineString');
goog.require('ol.geom.MultiLineString');

/**
 * @constructor
 * @extends {KMap.Geometry}
 * @param {Array.<Array.<ol.Coordinate>>|ol.geom.MultiLineString} coordinates
 * @api
 */
KMap.Polyline = function (coordinates) {
  var geometry;
  if (coordinates instanceof ol.geom.MultiLineString) {
    geometry = /**@type {ol.geom.MultiLineString} */ (coordinates);
  } else {
    geometry = new ol.geom.MultiLineString(coordinates);
  }
  KMap.Geometry.call(this, geometry);

  /**
   * @type {boolean}
   */
  this.calcDist_ = false;

  /**
   * @type {Array.<Array.<ol.Coordinate>>}
   */
  this.paths_ = geometry.getCoordinates();

  /**
   * 每段path的长度
   * @type {Array.<number>}
   */
  this.pathsDistance_ = [];

  /**
   * 总长度
   * @type {number}
   */
  this.distance_ = 0;

  /**
   * 用来计算经纬度距离
   * @type {KMap.Transform}
   */
  this.transform_ = new KMap.Transform();

  /**
   * 坐标类别（0为平面坐标，1为地理坐标）
   */
  this.coordType_ = 0;
};
ol.inherits(KMap.Polyline, KMap.Geometry);

/**
 * @api
 * @param {Array.<Array.<ol.Coordinate>>} paths
 */
KMap.Polyline.prototype.setCoordinates = function (paths) {
  var geom = /**@type {ol.geom.MultiLineString} */ (this.getGeometry());
  geom.setCoordinates(paths);
  this.paths_ = paths;
  this.initPathDist_();
};

/**
 * @api
 * @return {Array.<Array.<ol.Coordinate>>}
 * @override
 */
KMap.Polyline.prototype.getCoordinates = function () {
  return this.paths_;
};

/**
 * @param {Array.<KMap.Point>|Array.<ol.Coordinate>} path
 * @api
 */
KMap.Polyline.prototype.addPath = function (path) {
  if (path) {
    var lineString = [];
    for (var i = 0; i < path.length; i++) {
      if (path[i] instanceof KMap.Point) {
        var point = /**@type {KMap.Point} */ (path[i]);
        var coordinate = /**@type {ol.Coordinate} */ (point.getCoordinates());
        lineString.push(coordinate);
      } else {
        var coordinate = /**@type {ol.Coordinate} */ (path[i]);
        lineString.push(coordinate);
      }
    }
    this.paths_.push(lineString);
    this.uptatePathDist_(this.getPathCount() - 1, 'add');
    var geom = /**@type {ol.geom.MultiLineString} */ (this.getGeometry());
    geom.setCoordinates(this.paths_);
  } else {
    throw 'unexpected parms type';
  }
};

/**
 * @param {number} pathIndex
 * @api
 */
KMap.Polyline.prototype.removePath = function (pathIndex) {
  if (this.paths_[pathIndex]) {
    this.paths_.splice(pathIndex, 1);
    this.uptatePathDist_(pathIndex, 'remove');
    var geom = /**@type {ol.geom.MultiLineString} */ (this.getGeometry());
    geom.setCoordinates(this.paths_);
  }
};

/**
 * @param {number} pathIndex
 * @return {Array.<ol.Coordinate>}
 * @api
 */
KMap.Polyline.prototype.getPath = function (pathIndex) {
  var path = /**@type {Array.<ol.Coordinate>}*/ (this.paths_[pathIndex]);
  return path;
};

/**
 * @param {number} pathIndex
 * @param {number} pointIndex
 * @param {KMap.Point|ol.Coordinate} point
 * @api
 */
KMap.Polyline.prototype.insertPoint = function (pathIndex, pointIndex, point) {
  var path = /**@type {Array.<ol.Coordinate>}*/ (this.paths_[pathIndex]);
  if (path) {
    if (path.length >= pointIndex) {
      /**
       * @type {ol.Coordinate}
       */
      var coordinate;
      if (point instanceof KMap.Point) {
        coordinate = point.getCoordinates();
      } else {
        coordinate = point;
      }
      path.splice(pointIndex, 0, coordinate);
      this.uptatePathDist_(pathIndex, 'update');
      var geom = /**@type {ol.geom.MultiLineString} */ (this.getGeometry());
      geom.setCoordinates(this.paths_);
    }
  }
};

/**
 * @param {number} pathIndex
 * @param {number} pointIndex
 * @param {KMap.Point|ol.Coordinate} point
 * @api
 */
KMap.Polyline.prototype.setPoint = function (pathIndex, pointIndex, point) {
  var path = /**@type {Array.<ol.Coordinate>}*/ (this.paths_[pathIndex]);
  if (path) {
    if (path[pointIndex]) {
      /**
       * @type {ol.Coordinate}
       */
      var coordinate;
      if (point instanceof KMap.Point) {
        coordinate = point.getCoordinates();
      } else {
        coordinate = point;
      }
      path[pointIndex] = coordinate;
      this.uptatePathDist_(pathIndex, 'update');
      var geom = /**@type {ol.geom.MultiLineString} */ (this.getGeometry());
      geom.setCoordinates(this.paths_);
    }
  }
};

/**
 * @param {number} pathIndex
 * @param {number} pointIndex
 * @api
 */
KMap.Polyline.prototype.removePoint = function (pathIndex, pointIndex) {
  var path = /**@type {Array.<ol.Coordinate>}*/ (this.paths_[pathIndex]);
  if (path) {
    if (path.splice(pointIndex, 1).length > 0) {
      this.uptatePathDist_(pathIndex, 'update');
      var geom = /**@type {ol.geom.MultiLineString} */ (this.getGeometry());
      geom.setCoordinates(this.paths_);
    }
  }
};

/**
 * @return {number}
 * @api
 */
KMap.Polyline.prototype.getPathCount = function () {
  return this.paths_.length;
};

/**
 * 获取每段path的长度
 * @api
 */
KMap.Polyline.prototype.getDistances = function () {
  return this.pathsDistance_;
};

/**
 * 获取总长度
 * @api
 */
KMap.Polyline.prototype.getLineDistance = function () {
  return this.distance_;
};

/**
 * 获取投影类别
 * @api
 */
KMap.Polyline.prototype.getCoordType = function () {
  return this.coordType_;
};

/**
 * 设置投影类别
 * @api
 */
KMap.Polyline.prototype.setCoordType = function (type) {
  this.coordType_ = type == 0 ? 0 : 1;
  this.initPathDist_();
};

/**
 * @api
 * @param {boolean} type
 */
KMap.Polyline.prototype.calcAble = function (type) {
  this.calcDist_ = type === true ? true : false;
};

/**
 * 计算path的长度
 * @private
 * @param {Array.<ol.Coordinate>} path
 * @return {number}
 */
KMap.Polyline.prototype.getDistance_ = function (path) {
  var length = 0;
  if (path.length >= 2 && this.calcDist_) {
    var coord1, coord2;
    var index = 0;
    while (path[index + 1]) {
      coord1 = path[index];
      coord2 = path[index + 1];
      if (this.coordType_ == 0) {
        length += Math.sqrt(Math.pow(coord1[0] - coord2[0], 2) + Math.pow(coord1[1] - coord2[1], 2));
      } else {
        length += this.transform_.distance(coord1[1], coord1[0], coord2[1], coord2[0]);
      }
      index++;
    }
  }
  return length;
};

/**
 * 初始化线段长度
 * @private
 */
KMap.Polyline.prototype.initPathDist_ = function () {
  this.pathsDistance_ = [];
  this.distance_ = 0;
  this.paths_.forEach(function (path) {
    var dist = this.getDistance_(path);
    this.pathsDistance_.push(dist);
    this.distance_ += dist;
  }, this);
}

/**
 * @private
 * @param {number} pathIndex
 * @param {string} type
 */
KMap.Polyline.prototype.uptatePathDist_ = function (pathIndex, type) {
  switch (type) {
    case 'add':
      var distance = this.getDistance_(this.getPath(pathIndex));
      this.pathsDistance_.push(distance);
      this.distance_ += distance;
      break;
    case 'remove':
      var distance = this.pathsDistance_[pathIndex];
      this.pathsDistance_.splice(pathIndex, 1);
      this.distance_ -= distance;
      break;
    case 'update':
      var oldl = this.pathsDistance_[pathIndex];
      var newl = this.getDistance_(this.getPath(pathIndex));
      this.pathsDistance_[pathIndex] = newl;
      this.distance_ = this.distance_ - oldl + newl;
      break;
    default:
      break;
  }
};
