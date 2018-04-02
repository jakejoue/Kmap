goog.provide('KMap.InfoTemplate');

goog.require('KMap');

/**
 * 
 * @constructor
 * @param {string|undefined|null} opt_tile 
 * @param {string|undefined|null} opt_content 
 * @api
 */
KMap.InfoTemplate = function (opt_tile, opt_content) {
    /**
     * @type {string|undefined|null}
     * @api
     */
    this.tile = opt_tile;
    /**
     * @type {string|undefined|null}
     * @api
     */
    this.content = opt_content;
    this.offset = [0, 0];
};

/**
 * InfoTemplate Sets the content template.
 * 
 * @param {string} content 
 * @api
 */
KMap.InfoTemplate.prototype.setContent = function (content) {
    this.content = content;
};

/**
 * InfoTemplate Sets the content template.
 * 
 * @return {string|null|undefined} content 
 * @api
 */
KMap.InfoTemplate.prototype.getContent = function () {
    return this.content;
};

/**
 * InfoTemplate Sets the title template. 
 * 
 * @param {string} title 
 * @api
 */
KMap.InfoTemplate.prototype.setTitle = function (title) {
    this.tile = title;
};

/**
 * InfoTemplate Sets the title template. 
 * 
 * @return {string|null|undefined} title 
 * @api
 */
KMap.InfoTemplate.prototype.getTitle = function () {
    return this.tile;
};

/**
 * @api
 * @param {Array.<number>} offset
 */
KMap.InfoTemplate.prototype.setOffset = function (offset) {
    this.offset = offset;
};

/**
 * @api
 * @return {Array.<number>}
 */
KMap.InfoTemplate.prototype.getOffset = function () {
    return this.offset;
};

/**
 * 
 * @param {string|null|undefined} template 
 * @param {KMap.Graphic} graphic 
 * @returns {string|null|undefined}
 */
KMap.InfoTemplate.prototype.bind = function (template, graphic) {
    var data = template;
    if (data) {
        var feature = graphic.getFeature();
        var attrs = graphic.getAttributes();
        if (attrs) {
            for (var key in attrs) {
                var attr = attrs[key];
                var regex = new RegExp("\\$\\{" + key + "\\}", "gi");
                data = data.replace(regex, attr);
            }
        } else {
            var keys = feature.getKeys();
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var attr = /**@type {string}*/ (feature.get(key));
                var regex = new RegExp("\\$\\{" + key + "\\}", "gi");
                data = data.replace(regex, attr);
            }
        }
        var find = /\$\{([^\$\{\}]+)\}/mg;
        if (find.test(data)) {
            console.log("缺少字段: " + data.match(find));
        }
        data = data.replace(find, "");
        data = data.replace(/NaN|undefined|null/gi, '');
    }
    return data;
};
