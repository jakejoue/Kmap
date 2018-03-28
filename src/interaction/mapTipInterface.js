goog.provide('KMap.Interaction.MapTip');
goog.provide('KMap.Interaction.MapTip.Event');

/**
 * 带tip框的坐标拾取器
 * @api
 * @constructor
 * @extends {ol.interaction.Interaction}
 */
KMap.Interaction.MapTip = function(options) {
    options = options || {};
    this.helpTooltipElement_ = document.createElement('div');
    this.helpTooltip_ = new KMap.Overlay({
        element: this.helpTooltipElement_,
        offset: options.offset || [10, 0],
        positioning: options.positioning || 'center-left'
    });
    this.setMessage(options.message || '');
    this.handler_ = null;

    ol.interaction.Interaction.call(this, {
        handleEvent: KMap.Interaction.MapTip.handleEvent
    });
};
ol.inherits(KMap.Interaction.MapTip, ol.interaction.Interaction);

/**
 * @this {KMap.Interaction.MapTip}
 */
KMap.Interaction.MapTip.handleEvent = function(mapBrowserEvent) {
    var stopEvent = false;
    if (this.getActive()) {
        if (mapBrowserEvent.type == ol.MapBrowserEventType.POINTERMOVE) {
            this.helpTooltip_.setPosition(mapBrowserEvent.coordinate);
        }
        if (mapBrowserEvent.type == ol.MapBrowserEventType.SINGLECLICK) {
            this.dispatchEvent(new KMap.Interaction.MapTip.Event('mapTip', mapBrowserEvent.coordinate));
            mapBrowserEvent.preventDefault();
            stopEvent = true;
        }
    }
    return !stopEvent;
};

/**
 * @private
 */
KMap.Interaction.MapTip.prototype.setActive = function(active) {
    ol.interaction.Interaction.prototype.setActive.call(this, !!active);
    this.getActive() ?
        this.helpTooltipElement_.classList.remove('hidden') :
        this.helpTooltipElement_.classList.add('hidden');
};

/**
 * @api
 */
KMap.Interaction.MapTip.prototype.setMessage = function(message) {
    this.helpTooltipElement_.innerHTML = '<div class="mapTip"><span></span><span>' + message + '</span></div>';
};

/**
 * @api
 */
KMap.Interaction.MapTip.prototype.getLocation = function(listener, message) {
    var self = this;
    self.setActive(true);
    if (message) {
        this.setMessage(message);
    }
    if (this.handler_) {
        this.un('mapTip', this.handler_, this);
    }
    this.handler_ = function(event) {
        if (typeof listener == 'function') {
            listener(event);
        }
        self.setActive(false);
    };
    return this.once('mapTip', this.handler_, this);
};

KMap.Interaction.MapTip.prototype.setMap = function(map) {
    if (!map) {
        map = this.getMap();
        map.removeOverlay(this.helpTooltip_);
    } else {
        this.setActive(false);
        map.addOverlay(this.helpTooltip_);
    }
    ol.interaction.Interaction.prototype.setMap.call(this, map);
};

/**
 * @api
 * @constructor
 * @extends {ol.events.Event}
 */
KMap.Interaction.MapTip.Event = function(type, coordinate) {
    ol.events.Event.call(this, type);
    /**
     * @api
     */
    this.coordinate = coordinate;
};
ol.inherits(KMap.Interaction.MapTip.Event, ol.events.Event);