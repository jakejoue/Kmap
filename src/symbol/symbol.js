goog.provide('KMap.Symbol');

goog.require('ol.style.Style');

/**
 * @api
 * @constructor
 * @param {Object|ol.style.Style} options
 */
KMap.Symbol = function (options) {
    var style = null;
    if (options instanceof ol.style.Style) {
        style = /** @type {ol.style.Style} */ (options);
    } else {
        style = new ol.style.Style();
        this.init(style, options);
    }
    /**
     * @protected
     * @type {ol.style.Style}
     */
    this.style_ = style;

    var obj = /**@type {Object}*/ (this.style_);
    obj["SYMBOL_TYPE"] = this.getType();
};

/**
 * @param {ol.style.Style} style
 * @param {Object} options
 */
KMap.Symbol.prototype.init = function (style, options) {
    throw 'not implemented';
};

/**
 * @param {ol.style.Style} style
 * @return {KMap.Symbol}
 * @api
 */
KMap.Symbol.fromStyle = function (style) {
    var obj = /**@type {Object}*/ (style);
    var type = /** @type {KMap.Symbol.Type} */ (obj["SYMBOL_TYPE"]);
    switch (type) {
        case KMap.Symbol.Type.PictureMarkerSymbol:
            return new KMap.PictureMarkerSymbol(style);
        case KMap.Symbol.Type.SimpleMarkerSymbol:
            return new KMap.SimpleMarkerSymbol(style);
        case KMap.Symbol.Type.SimpleLineSymbol:
            return new KMap.SimpleLineSymbol(style);
        case KMap.Symbol.Type.SimpleFillSymbol:
            return new KMap.SimpleFillSymbol(style);
        case KMap.Symbol.Type.SimpleTextSymbol:
            return new KMap.SimpleTextSymbol(style);
    }
    throw 'invalid style';
};

/**
 * @return {KMap.Symbol.Type}
 */
KMap.Symbol.prototype.getType = function () {
    throw 'invalid symbol type';
};

/**
 * @return {ol.style.Style}
 * @api
 */
KMap.Symbol.prototype.getStyle = function () {
    return this.style_;
};

/**
 * @enum {string}
 * @api
 */
KMap.Symbol.Type = {
    PictureMarkerSymbol: 'PictureMarkerSymbol',
    SimpleMarkerSymbol: 'SimpleMarkerSymbol',
    SimpleLineSymbol: 'SimpleLineSymbol',
    SimpleFillSymbol: 'SimpleFillSymbol',
    SimpleTextSymbol: 'SimpleTextSymbol'
};