goog.provide('KMap.Basemap');
goog.provide('KMap.BasemapGallery');

goog.require('KMap.Map');
goog.require('ol.Overlay');

/**
 * @constructor
 * @param {Object} options
 * @api
 */
KMap.Basemap = function (options) {
    /**
     * @type {KMap.Layer}
     * @api
     */
    this.layers = options["layers"] || [];
    /**
     * @type {string}
     * @api
     */
    this.title = options["title"];
    /**
     * @type {string}
     * @api
     */
    this.thumbnailUrl = options["thumbnailUrl"];
};

/**
 * @constructor
 * @param {Object} options
 * @param {string} target
 * @api
 */
KMap.BasemapGallery = function (options, target) {
    /**
     * @type {KMap.Map}
     */
    this.map = options["map"];
    /**
     * @type {Array.<KMap.Basemap>}
     */
    this.basemaps = options["basemaps"] || [];
    /**
     * @type {string}
     */
    this.target = target;
    /**
     * @type {number}
     */
    this.selectedIndex = 0;
    /**
     * @type {KMap.Basemap}
     */
    this.selectedBasemap = this.basemaps[this.selectedIndex];
};

KMap.BasemapGallery.prototype.selectBasemap = function (index) {
    this.selectedIndex = index;

    this.selectNode(index);
    this.switchToBasemap(index);
    this.onSelectionChange();
};

KMap.BasemapGallery.prototype.switchToBasemap = function (index) {
    this.selectedBasemap = this.basemaps[index];
    if (this.selectedBasemap) {
        this.map.clearBaseLayer();
        var layers = this.selectedBasemap.layers;
        for (var i = 0; i < layers.length; i++) {
            this.map.addBaseLayer(layers[i]);
        }
    }
};

KMap.BasemapGallery.prototype.selectNode = function (index) {
    for (var i = 0; i < this.basemaps.length; i++) {
        var node = document.getElementById("galleryNode_basemap_" + i);
        if (i === index) {
            node.classList.add("esriBasemapGallerySelectedNode");
        } else {
            node.classList.remove("esriBasemapGallerySelectedNode");
        }
    }
};

/**
 * @api
 */
KMap.BasemapGallery.prototype.startup = function () {
    var flowContainer = document.createElement('div');
    for (var i = 0; i < this.basemaps.length; i++) {
        var basemap = this.basemaps[i];

        var galleryNode = document.createElement('div');
        galleryNode.className = "esriBasemapGalleryNode";
        galleryNode.id = "galleryNode_basemap_" + i;
        flowContainer.appendChild(galleryNode);

        var galleryLink = document.createElement('a');
        galleryLink.href = "javascript:void(0);";
        galleryLink.addEventListener('click', function (index, evt) {
            this.selectBasemap(index);
            evt.preventDefault();
        }.bind(this, i), false);
        galleryNode.appendChild(galleryLink);

        var galleryThumbnail = document.createElement('img');
        galleryThumbnail.className = "esriBasemapGalleryThumbnail";
        galleryThumbnail.title = basemap.title;
        galleryThumbnail.alt = basemap.title;
        galleryThumbnail.src = basemap.thumbnailUrl;
        galleryLink.appendChild(galleryThumbnail);

        var galleryLabel = document.createElement('div');
        galleryLabel.className = "esriBasemapGalleryLabelContainer";
        galleryNode.appendChild(galleryLabel);

        var galleryTile = document.createElement('span');
        galleryTile.title = basemap.title;
        galleryTile.innerText = basemap.title;
        galleryLabel.appendChild(galleryTile);
    }
    var gallery = document.getElementById(this.target);
    gallery.appendChild(flowContainer);

    this.selectBasemap(this.selectedIndex);
};

/**
 * @return {KMap.Basemap}
 * @api
 */
KMap.BasemapGallery.prototype.getSelected = function () {
    return this.selectedBasemap;
};

/**
 * @param {string} msg
 * @api
 */
KMap.BasemapGallery.prototype.onError = function (msg) {
};

/**
 * @api
 */
KMap.BasemapGallery.prototype.onSelectionChange = function () {
};
