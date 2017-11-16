goog.provide('KMap.Interaction.Location');
goog.provide('KMap.Interaction.Location.Event');

goog.require('KMap');

/**
 * 地图坐标择取
 * @api
 * @constructor
 * @extends {ol.interaction.Interaction}
 */
KMap.Interaction.Location = function () {
    ol.interaction.Interaction.call(this, {
        handleEvent: KMap.Interaction.Location.handleEvent
    });
};
ol.inherits(KMap.Interaction.Location, ol.interaction.Interaction);

/**
 * @this {KMap.Interaction.Location}
 */
KMap.Interaction.Location.handleEvent = function (mapBrowserEvent) {
    var stopEvent = false;
    var browserEvent = mapBrowserEvent.originalEvent;
    if (mapBrowserEvent.type == ol.MapBrowserEventType.SINGLECLICK) {
        //var map = mapBrowserEvent.map;
        this.dispatchEvent(new KMap.Interaction.Location.Event(
            'location', mapBrowserEvent.coordinate));
        mapBrowserEvent.preventDefault();
        stopEvent = true;
    }
    return !stopEvent;
};

/**
 * @api
 * @constructor
 * @extends {ol.events.Event}
 */
KMap.Interaction.Location.Event = function (type, coordinate) {

    ol.events.Event.call(this, type);
    /**
     * @api
     */
    this.coordinate = coordinate;
};
ol.inherits(KMap.Interaction.Location.Event, ol.events.Event);

