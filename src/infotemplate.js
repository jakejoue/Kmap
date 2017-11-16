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
 * 
 * @param {string|null|undefined} template 
 * @param {KMap.Graphic} graphic 
 * @returns {string|null|undefined}
 */
KMap.InfoTemplate.prototype.bind = function (template, graphic) {
    var data = template;
    if (data) {
        var find = /\$\{([^\$\{\}]+)\}/m;
        var matchs = null;

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
    }
    return data;
};