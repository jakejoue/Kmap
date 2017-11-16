goog.provide('KMap.Contrail');

goog.require('KMap.Polyline')
goog.require('KMap.Transform');

goog.require('ol.Feature');

/**
 * @constructor
 * @param {string} id
 * @param {MapX.ContrailOptions} options
 * @api
 */
KMap.Contrail = function (id, options) {
  this.id_ = id;

  this.line_ = /**@type {KMap.Polyline}*/ (options['line']);

  /**
   * 当前操作的path
   * @type {Array.<ol.Coordinate>}
   */
  this.path_ = null;

  /**
   * 当前操作的path序号
   * @type {number}
   */
  this.pathIndex_ = 0;

  /**
   * 当前轨迹点
   * @type {ol.Coordinate}
   */
  this.position_ = null;

  /**
   * 轨迹点相邻的下一个点序号
   */
  this.index_ = 1;

  /**
   * 是否为反向
   */
  this.backword_ = false;

  /**
   * 播放状态
   * (0 停止，1 播放，2 暂停)
   */
  this.state_ = 0;

  /**
   * 当前前进的方向
   * @type {number}
   */
  this.direction_ = 0;

  /**
   * 前进速度 m/s
   * @type {number}
   */
  this.speed_ = options['speed'] || 1;

  /**
   * 坐标类型 0: 米 1: 度
   */
  this.coordType_ = this.line_.getCoordType();

  /**
   * 用来计算经纬度距离
   * @type {KMap.Transform}
   */
  this.transform_ = new KMap.Transform();

  /**
   * 当前已经行走过的路径长度
   */
  this.passDistance_ = 0;
};

/**
 * @returns {boolean}
 * @api
 */
KMap.Contrail.prototype.isFinished = function () {
  if (!this.backword_) {
    if ((this.pathIndex_ + 1) == this.line_.getPathCount()) {
      if (this.position_ === this.path_[this.path_.length - 1])
        return true;
    }
  } else {
    if (this.pathIndex_ == 0) {
      if (this.position_ === this.path_[0])
        return true;
    }
  }
  return false;
};

/**
 * @returns {number}
 * @api
 */
KMap.Contrail.prototype.getState = function () {
  return this.state_;
};

/**
 * @returns {ol.Coordinate}
 * @api
 */
KMap.Contrail.prototype.getPosition = function () {
  return this.position_;
};

/**
 * @returns {number}
 * @api
 */
KMap.Contrail.prototype.getDirection = function () {
  return this.direction_;
};

/**
 * @api
 * @return {number}
 */
KMap.Contrail.prototype.getIndex = function () {
  return this.index_;
};

/**
 * @api
 * @returns {number}
 */
KMap.Contrail.prototype.getPathIndex = function () {
  return this.pathIndex_;
};

/**
 * 获取走过的路径
 * @api
 * @returns {Array.<Array.<ol.Coordinate>>}
 */
KMap.Contrail.prototype.getActivePath = function () {
  var paths = this.line_.getCoordinates().slice(0, this.pathIndex_);
  var path = this.path_.slice(0, this.index_);
  path.push(this.position_);
  paths.push(path);
  return paths;
};

/**
 * @api
 * @return {boolean}
 */
KMap.Contrail.prototype.getBackword = function (type) {
  return this.backword_;
};

/**
 * @api
 * @param {boolean} type
 */
KMap.Contrail.prototype.setBackword = function (type) {
  this.backword_ = (type === true) ? true : false;
};

/**
 * @api
 * @param {number} speed
 */
KMap.Contrail.prototype.setSpeed = function (speed) {
  this.speed_ = speed;
};

/**
 * @api
 */
KMap.Contrail.prototype.start = function () {
  this.state_ = 1;
  if (this.path_ === null) {
    this.path_ = this.line_.getPath(0);
    this.position_ = this.path_[0];
  }
};

/**
 * @api
 */
KMap.Contrail.prototype.pause = function () {
  if (this.state_ == 1) {
    this.state_ = 2;
  }
};

/**
 * @api
 */
KMap.Contrail.prototype.resume = function () {
  if (this.state_ == 2) {
    this.state_ = 1;
  }
};

/**
 * @api
 */
KMap.Contrail.prototype.stop = function () {
  if (this.state_ != 0) {
    this.state_ = 0;
  }
};

/**
 * @api
 */
KMap.Contrail.prototype.update = function () {
  if (this.state_ == 1) {
    if (!this.backword_) {
      var increase = this.speed_;
      this.calcTrackIncursive(increase);
    } else {
      var increase = this.speed_;
      this.calcTrackIncursiveBack(increase);
    }
  }
};

/**
 * 计算下个轨迹点
 */
KMap.Contrail.prototype.calcTrackIncursive = function (increase) {
  if (this.path_[this.index_]) {
    var nextPos = this.path_[this.index_];
    this.direction_ = this.calcDirection(this.position_, nextPos);

    var dist = this.getDistance(this.position_, nextPos);
    if (dist > increase) {
      var scale = increase / dist;
      this.position_ = this.getNextPosition(this.position_, nextPos, scale);
      this.passDistance_ += increase;
    } else {
      increase -= dist;
      this.index_++;
      this.position_ = nextPos;
      this.passDistance_ += dist;
      this.calcTrackIncursive(increase);
    }
  } else {
    if (this.line_.getPath(this.pathIndex_ + 1)) {
      this.pathIndex_++;
      this.path_ = this.line_.getPath(this.pathIndex_);
      this.position_ = this.path_[0];
      this.index_ = 1;
      this.calcTrackIncursive(increase);
    } else {
      this.index_ = this.path_.length - 1;
      this.position_ = this.path_[this.index_];
      this.passDistance_ = this.line_.getLineDistance();
    }
  }
};

/**
 * 计算上个轨迹点
 */
KMap.Contrail.prototype.calcTrackIncursiveBack = function (increase) {
  var lastIndex = this.index_ - 1;
  if (this.path_[lastIndex]) {
    var lastPos = this.path_[lastIndex];
    this.direction_ = this.calcDirection(lastPos, this.position_);

    var dist = this.getDistance(this.position_, lastPos);
    if (dist > increase) {
      var scale = increase / dist;
      this.position_ = this.getNextPosition(this.position_, lastPos, scale);
      this.passDistance_ -= increase;
    } else {
      increase -= dist;
      this.index_--;
      this.position_ = lastPos;
      this.passDistance_ -= dist;
      this.calcTrackIncursiveBack(increase);
    }
  } else {
    if (this.line_.getPath(this.pathIndex_ - 1)) {
      this.pathIndex_--;
      this.path_ = this.line_.getPath(this.pathIndex_);
      this.position_ = this.path_[this.path_.length - 1];
      this.index_ = this.path_.length - 1;
      this.calcTrackIncursiveBack(increase);
    } else {
      this.position_ = this.path_[0];
      this.index_ = 1;
      this.passDistance_ = 0;
    }
  }
};

/**
 * 计算两个点之间的距离
 */
KMap.Contrail.prototype.getDistance = function (coord1, coord2) {
  if (this.coordType_ == 0) {
    return Math.sqrt(Math.pow(coord1[0] - coord2[0], 2) + Math.pow(coord1[1] - coord2[1], 2));
  }
  return this.transform_.distance(coord1[1], coord1[0], coord2[1], coord2[0]);
};

/**
 * @param {ol.Coordinate} coord1
 * @param {ol.Coordinate} coord2
 * @param {number} scale
 * @returns {ol.Coordinate}
 */
KMap.Contrail.prototype.getNextPosition = function (coord1, coord2, scale) {
  var x = coord1[0] + (coord2[0] - coord1[0]) * scale;
  var y = coord1[1] + (coord2[1] - coord1[1]) * scale;
  return [x, y];
};

/**
 * 计算当前前进的方向
 * 
 * @param {ol.Coordinate} coord1  
 * @param {ol.Coordinate} coord2 
 * @returns {number} 弧度
 */
KMap.Contrail.prototype.calcDirection = function (coord1, coord2) {
  return Math.atan2(coord2[1] - coord1[1], coord2[0] - coord1[0]);
};

/**
 * 设置百分比（向下取整）
 * @api
 * @param {number} percent
 */
KMap.Contrail.prototype.setPercent = function (percent) {
  if (percent >= 0 && percent < 100) {
    percent = Math.floor(percent);
    if (percent == 100) percent = 99.9;

    var increase = this.line_.getLineDistance() * percent / 100;
    var pathsDist = this.line_.getDistances();
    for (var i in pathsDist) {
      if (increase >= pathsDist[i]) {
        increase -= pathsDist[i];
      } else {
        this.pathIndex_ = parseInt(i, 0);
        break;
      }
    }
    this.path_ = this.line_.getPath(this.pathIndex_);
    this.index_ = 1;
    this.position_ = this.path_[0];
    this.calcTrackIncursive(increase);
    this.passDistance_ = this.line_.getLineDistance() * percent / 100;
  }
};

/**
 * 获取当前的百分百（四舍五入）
 * @api
 */
KMap.Contrail.prototype.getPercent = function () {
  var onePer = this.line_.getLineDistance() / 100;
  var percent = Math.round(this.passDistance_ / onePer);
  return percent;
};
