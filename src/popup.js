goog.provide('KMap.Popup');

goog.require('KMap');
goog.require('KMap.Overlay');

/**
 * @constructor
 * @extends {KMap.Overlay}
 * @param {olx.OverlayOptions} opt_options 
 * @api
 */
KMap.Popup = function (opt_options) {

    var options = opt_options || {};

    this.offset = options["offset"] || [0, 0];

    var containerId = options["container"] || "kmap-popup";
    var closerId = options["closer"] || "kmap-popup-closer";
    var titleId = options["title"] || "kmap-popup-title";
    var contentId = options["content"] || "kmap-popup-content";

    this.container = document.getElementById(containerId);
    this.closer = document.getElementById(closerId);
    this.title = document.getElementById(titleId);
    this.content = document.getElementById(contentId);

    var that = this;
    this.closer.addEventListener('click', function (evt) {
        that.hide();
        evt.preventDefault();
    }, false);

    KMap.Overlay.call(this, {
        element: this.container,
        stopEvent: true,
        autoPan: true,
        offset: this.offset,
        positioning: 'bottom-center',
        autoPanAnimation: {
            duration: 250
        }
    });

    /**
     * @type {KMap.Graphic}
     */
    this.selectedFeature_ = null;
};
ol.inherits(KMap.Popup, KMap.Overlay);

/**
 * Show the popup.
 * @param {ol.Coordinate} coord Where to anchor the popup.
 * @api
 */
KMap.Popup.prototype.show = function (coord) {
    if (this.selectedFeature_) {

        var title = /**@type {string} */(this.selectedFeature_.getTitle());
        var content = /**@type {string} */(this.selectedFeature_.getContent());

        this.title.innerHTML = title;
        this.content.innerHTML = content;

        this.dispatchEvent(new KMap.Popup.Event('show'));

        this.setPosition(coord);
    }
    return this;
};

/**
 * 隐藏信息窗.
 * @api
 */
KMap.Popup.prototype.hide = function () {
    this.setPosition(undefined);
    this.closer.blur();

    this.dispatchEvent(new KMap.Popup.Event('hide'));

    return this;
};

/**
 * @api
 * @param {number} w
 * @param {number} h
 */
KMap.Popup.prototype.setSize = function (w, h) {
    this.container.style.width = w + "px";
    this.container.style.height = h + "px";
};

/**
 * @api
 * @param {Array.<number>} offset
 */
KMap.Popup.prototype.setOffset = function (offset) {
    KMap.Overlay.prototype.setOffset.call(this, offset);
};

/**
 * @api
 * @param {KMap.Graphic} feature
 */
KMap.Popup.prototype.setSelectedFeature = function (feature) {
    var oldValue = this.selectedFeature_;
    this.selectedFeature_ = feature;
    this.dispatchEvent(new KMap.Popup.Event("selectionChange", oldValue));
};

/**
 * @api
 * @return {KMap.Graphic}
 */
KMap.Popup.prototype.getSelectedFeature = function () {
    return this.selectedFeature_;
};

/**
 * @api
 */
KMap.Popup.prototype.reposition = function () {

};

/**
 * @api
 */
KMap.Popup.prototype.restore = function () {
    this.container.style.width = "";
    this.container.style.height = "";

    this.setOffset(this.offset);
};

/**
 * @api
 */
KMap.Popup.prototype.on = function (type, listener, opt_this) {
    return KMap.Overlay.prototype.on.call(this, type, listener, opt_this);
};

/**
 * @api
 */
KMap.Popup.prototype.un = function (type, listener, opt_this) {
    KMap.Overlay.prototype.un.call(this, type, listener, opt_this);
};

/**
 * @api
 * @constructor
 * @extends {ol.events.Event}
 * @param {string} type
 * @param {KMap.Graphic=} oldValue
 */
KMap.Popup.Event = function (type, oldValue) {

    ol.events.Event.call(this, type);
    /**
     * @api
     * @type {KMap.Graphic|undefined|null}
     */
    this.oldValue = oldValue;
};
ol.inherits(KMap.Popup.Event, ol.events.Event);