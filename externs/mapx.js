/**
 * @type {Object}
 */
var MapX;

/**
 * Object literal with config options for the map.
 * @typedef {{
 * projection: (string|undefined),
 * geodesic:(boolean|undefined),
 * center: Array.<number>,  
 * extent: (Array.<number>|undefined),
 * resolutions: (Array.<number>|undefined),
 * minResolution: (number|undefined),
 * maxResolution: (number|undefined),
 * resolution: (number|undefined),
 * minZoom: (number|undefined),
 * maxZoom: (number|undefined),
 * zoom: (number|undefined)
 * }}
 * @api
 */
MapX.MapOptions;

/**
 * @type {string|undefined}
 * @api
 */
MapX.MapOptions.prototype.projection;
/**
 * @type {boolean|undefined}
 * @api
 */
MapX.MapOptions.prototype.geodesic;
/**
 * @type {Array.<number>}
 * @api
 */
MapX.MapOptions.prototype.center;
/**
 * @type {Array.<number>|undefined}
 * @api
 */
MapX.MapOptions.prototype.extent;
/**
 * @type {Array.<number>|undefined}
 * @api
 */
MapX.MapOptions.prototype.resolutions;
/**
 * @type {number|undefined}
 * @api
 */
MapX.MapOptions.prototype.minResolution;
/**
 * @type {number|undefined}
 * @api
 */
MapX.MapOptions.prototype.maxResolution;
/**
 * @type {number|undefined}
 * @api
 */
MapX.MapOptions.prototype.resolution;
/**
 * @type {number|undefined}
 * @api
 */
MapX.MapOptions.prototype.minZoom;
/**
 * @type {number|undefined}
 * @api
 */
MapX.MapOptions.prototype.maxZoom;
/**
 * @type {number|undefined}
 * @api
 */
MapX.MapOptions.prototype.zoom;

/**
 * @typedef {{
 * format: string,
 * layers: string,
 * srs: string,
 * version: (string|undefined),
 * url: string,
 * projection: string,
 * resolutions: (Array.<number>|undefined)
 * }}
 */
MapX.WMSLayerOptions;

/**
 * @type {string}
 * @api
 */
MapX.WMSLayerOptions.prototype.format;
/**
 * @type {string}
 * @api
 */
MapX.WMSLayerOptions.prototype.layers;
/**
 * @type {string}
 * @api
 */
MapX.WMSLayerOptions.prototype.srs;
/**
 * @type {string|undefined}
 * @api
 */
MapX.WMSLayerOptions.prototype.version;
/**
 * @type {string}
 * @api
 */
MapX.WMSLayerOptions.prototype.url;
/**
 * @type {string}
 * @api
 */
MapX.WMSLayerOptions.prototype.projection;
/**
 * @type {Array.<number>|undefined}
 * @api
 */
MapX.WMSLayerOptions.prototype.resolutions

/**
 * Object literal with config options for the map.
 * @typedef {{
 * type: string,
 * source: string,
 * format: (string|undefined),
 * layer: string,
 * matrixSet: string,
 * requestEncoding: (string|undefined),
 * url: string
 * }}
 * @api
 */
MapX.WMTSOptions;
/**
 * @type {string}
 * @api
 */
MapX.WMTSOptions.prototype.type;
/**
 * @type {string}
 * @api
 */
MapX.WMTSOptions.prototype.source;
/**
 * @type {string|undefined}
 * @api
 */
MapX.WMTSOptions.prototype.format;
/**
 * @type {string}
 * @api
 */
MapX.WMTSOptions.prototype.layer;
/**
 * @type {string}
 * @api
 */
MapX.WMTSOptions.prototype.matrixSet;
/**
 * @type {string|undefined}
 * @api
 */
MapX.WMTSOptions.prototype.requestEncoding;
/**
 * @type {string}
 * @api
 */
MapX.WMTSOptions.prototype.url;

/**
 * @typedef {{
 * anchor: (Array.<number>|undefined),
 * opacity:	(number|undefined),
 * rotation: (number|undefined),
 * offset: (Array.<number>|undefined),
 * size: (Array.<number>|undefined),
 * color: (string|Array.<number>|undefined),
 * scale: (number | undefined),
 * src: (string | undefined),
 * radius: (number | undefined),
 * stroke: (string|Array.<number>|undefined),
 * width: (number | undefined),
 * fill: (string|Array.<number>|undefined),
 * }}
 * @api
 */
MapX.MarkerSymbolOptions;

/** 固定位置，默认为[0.5,0.5]，既中心点
 * @type {Array.<number>|undefined}
 * @api
 */
MapX.MarkerSymbolOptions.prototype.anchor;
/** 透明度0-1.0
 * @type {number|undefined}
 * @api
 */
MapX.MarkerSymbolOptions.prototype.opacity;
/** 旋转 弧度
 * @type {number|undefined}
 * @api
 */
MapX.MarkerSymbolOptions.prototype.rotation;
/** 位置偏移像素
 * @type {Array.<number>|undefined}
 * @api
 */
MapX.MarkerSymbolOptions.prototype.offset;
/** 宽、高
 * @type {Array.<number>|undefined}
 * @api
 */
MapX.MarkerSymbolOptions.prototype.size;
/** 颜色
 * @type {string|Array.<number>|undefined}
 * @api
 */
MapX.MarkerSymbolOptions.prototype.color;
/** 缩放大小
 * @type {number|undefined}
 * @api
 */
MapX.MarkerSymbolOptions.prototype.scale;
/** 图片的url, src为空时可以用圆点图形
 * @type {string|undefined}
 * @api
 */
MapX.MarkerSymbolOptions.prototype.src;
/** 圆点图形的半径
 * @type {number|undefined}
 * @api
 */
MapX.MarkerSymbolOptions.prototype.radius;
/** 圆点边线颜色
 * @type {string|Array.<number>|undefined}
 * @api
 */
MapX.MarkerSymbolOptions.prototype.stroke;
/** 圆点边线宽度
 * @type {number|undefined}
 * @api
 */
MapX.MarkerSymbolOptions.prototype.width;
/** 圆点填充颜色
 * @type {string|Array.<number>|undefined}
 * @api
 */
MapX.MarkerSymbolOptions.prototype.fill;
/**
 * @typedef {{
 * color: (string|Array.<number>|undefined),
 * width: (number|undefined),
 * lineCap: (string|undefined),
 * lineJoin: (string|undefined),
 * lineDash: (Array.<number>|undefined),
 * lineDashOffset: (number|undefined),
 * miterLimit: (number|undefined)
 * }}
 */
MapX.LineSymbolOptions;
/**
 * @type {string|Array.<number>|undefined}
 * @api
 */
MapX.LineSymbolOptions.prototype.color;
/**
 * @type {number|undefined}
 * @api
 */
MapX.LineSymbolOptions.prototype.width;
/**
 * @type {string|undefined}
 * @api
 */
MapX.LineSymbolOptions.prototype.lineCap;
/**
 * @type {string|undefined}
 * @api
 */
MapX.LineSymbolOptions.prototype.lineJoin;
/**
 * @type {Array.<number>|undefined}
 * @api
 */
MapX.LineSymbolOptions.prototype.lineDash;
/**
 * @type {number|undefined}
 * @api
 */
MapX.LineSymbolOptions.prototype.lineDashOffset;
/**
 * @type {number|undefined}
 * @api
 */
MapX.LineSymbolOptions.prototype.miterLimit;

/**
 * @typedef {{
 * fill: (string|Array.<number>|undefined),
 * stroke: (KMap.SimpleLineSymbol|undefined)
 * }}
 */
MapX.FillSymbolOptions;
/** 填充颜色
 * @type {string|Array.<number>|undefined}
 * @api
 */
MapX.FillSymbolOptions.prototype.fill;
/**
 * @type {KMap.SimpleLineSymbol|undefined}
 * @api
 */
MapX.FillSymbolOptions.prototype.stroke;

/**
 * @typedef {{
 * xmin: number,
 * ymin: number,
 * xmax: number,
 * ymax: number
 * }}
 */
MapX.ArcGISExtent;
/**
 * @type {number}
 * @api
 */
MapX.ArcGISExtent.prototype.xmin;
/**
 * @type {number}
 * @api
 */
MapX.ArcGISExtent.prototype.ymin;
/**
 * @type {number}
 * @api
 */
MapX.ArcGISExtent.prototype.xmax;
/**
 * @type {number}
 * @api
 */
MapX.ArcGISExtent.prototype.ymax;

/**
 * @typedef {{
 * x: number,
 * y: number
 * }}
 */
MapX.ArcGISPoint;
/**
 * @type {number}
 * @api
 */
MapX.ArcGISPoint.prototype.x;
/**
 * @type {number}
 * @api
 */
MapX.ArcGISPoint.prototype.y;

/**
 * @typedef {{
 * level: number,
 * resolution: number,
 * scale: number
 * }}
 */
MapX.ArcGISTileLOD;
/**
 * @type {number}
 * @api
 */
MapX.ArcGISTileLOD.prototype.level;
/**
 * @type {number}
 * @api
 */
MapX.ArcGISTileLOD.prototype.resolution;
/**
 * @type {number}
 * @api
 */
MapX.ArcGISTileLOD.prototype.scale;

/**
 * @typedef {{
 * rows: number,
 * cols: number,
 * origin: MapX.ArcGISPoint,
 * dpi: number,
 * format: string,
 * lods: Array.<MapX.ArcGISTileLOD>
 * }}
 */
MapX.ArcGISTileInfo;
/**
 * @type {number}
 * @api
 */
MapX.ArcGISTileInfo.prototype.rows;
/**
 * @type {number}
 * @api
 */
MapX.ArcGISTileInfo.prototype.cols;
/**
 * @type {MapX.ArcGISPoint}
 * @api
 */
MapX.ArcGISTileInfo.prototype.origin;
/**
 * @type {number}
 * @api
 */
MapX.ArcGISTileInfo.prototype.dpi;
/**
 * @type {string}
 * @api
 */
MapX.ArcGISTileInfo.prototype.format;
/**
 * @type {Array.<MapX.ArcGISTileLOD>}
 * @api
 */
MapX.ArcGISTileInfo.prototype.lods;

/**
 * @typedef {{
 * initialExtent: MapX.ArcGISExtent,
 * fullExtent: MapX.ArcGISExtent,
 * tileInfo: MapX.ArcGISTileInfo,
 * units: string
 * }}
 */
MapX.ArcGISTileLayerInfo;
/**
 * @type {MapX.ArcGISExtent}
 * @api
 */
MapX.ArcGISTileLayerInfo.prototype.initialExtent;
/**
 * @type {MapX.ArcGISExtent}
 * @api
 */
MapX.ArcGISTileLayerInfo.prototype.fullExtent;
/**
 * @type {MapX.ArcGISTileInfo}
 * @api
 */
MapX.ArcGISTileLayerInfo.prototype.tileInfo;
/**
 * @type {string}
 * @api
 */
MapX.ArcGISTileLayerInfo.prototype.units;

/**
 * @typedef {{
 * proxy: (string|undefined),
 * url:  string,
 * dataType: (string|undefined),
 * projection: string
 * }}
 * @api
 */
MapX.ArcGISTileLayerOptions;

/**
 * @type {string|undefined}
 * @api
 */
MapX.ArcGISTileLayerOptions.prototype.proxy;
/**
 * @type {string}
 * @api
 */
MapX.ArcGISTileLayerOptions.prototype.url;
/**
 * @type {string|undefined}
 * @api
 */
MapX.ArcGISTileLayerOptions.prototype.dataType;
/**
 * @type {string}
 * @api
 */
MapX.ArcGISTileLayerOptions.prototype.projection;
/**
 * @type {string}
 * @api
 */
MapX.ArcGISTileLayerOptions.prototype.crossOragin;
/**
 * @typedef {{
 * url: (ol.FeatureUrlFunction|string),
 * format: string,
 * loader: (ol.FeatureLoader|undefined),
 * style: KMap.Symbol
 * }}
 * @api
 */
MapX.FeatureLayerOptions;
/**
 * @type {ol.FeatureUrlFunction|string}
 * @api
 */
MapX.FeatureLayerOptions.prototype.url;
/**
 * @type {string}
 * @api
 */
MapX.FeatureLayerOptions.prototype.format;
/**
 * @type {KMap.Symbol}
 * @api
 */
MapX.FeatureLayerOptions.prototype.style;
/**
 * @type {ol.FeatureLoader|undefined}
 * @api
 */
MapX.FeatureLayerOptions.prototype.loader;

/**
 * @typedef {{
 * line: ol.geom.LineString,
 * position: ol.Coordinate,
 * speed: (number|undefined),
 * coordType: (number|undefined)
 * }}
 */
MapX.ContrailOptions;
/**
 * @type {ol.geom.LineString}
 * @api
 */
MapX.ContrailOptions.prototype.line;
/**
 * @type {ol.Coordinate}
 * @api
 */
MapX.ContrailOptions.prototype.position;
/**
 * @type {number|undefined}
 * @api
 */
MapX.ContrailOptions.prototype.speed;
/**
 * @type {number|undefined}
 * @api
 */
MapX.ContrailOptions.prototype.coordType;

/**
 * @typedef {{
 * actionName: (string),
 * }}
 */
MapX.MapActionOptions;
/**
 * @type {string}
 * @api
 */
MapX.MapActionOptions.prototype.actionName;

/**
 * @typedef {{
 * actionName: (string),
 * geodesic:(boolean|undefined)
 * }}
 */
MapX.MeasureOptions;
/**
 * @type {string}
 * @api
 */
MapX.MeasureOptions.prototype.actionName;
/**
 * @type {boolean|undefined}
 * @api
 */
MapX.MeasureOptions.prototype.geodesic;


/**
 * @typedef {function(): void}
 * @api
 */
MapX.SelectByBoxBeforeSelect;

/**
 * @typedef {function(ol.Extent): void}
 * @api
 */
MapX.SelectByBoxSelectFunction;

/**
 * @typedef {{
 * actionName: (string),
 * beforeSelect: (MapX.SelectByBoxBeforeSelect|undefined),
 * selectFunction: (MapX.SelectByBoxSelectFunction|undefined)
 * }}
 */
MapX.SelectByBoxOptions;
/**
 * @type {string}
 * @api
 */
MapX.SelectByBoxOptions.prototype.actionName;
/**
 * @type {MapX.SelectByBoxBeforeSelect|undefined}
 * @api
 */
MapX.SelectByBoxOptions.prototype.beforeSelect;
/**
 * @type {MapX.SelectByBoxSelectFunction|undefined}
 * @api
 */
MapX.SelectByBoxOptions.prototype.selectFunction;

/**
 * @typedef {function(ol.Coordinate)}
 * @api
 */
MapX.LocationFunction;

/**
 * @typedef {{
 * actionName:string,
 * locationFunction:MapX.LocationFunction
 * }}
 */
MapX.MapLocationOptions;
/**
 * @type {string}
 * @api
 */
MapX.MapLocationOptions.prototype.actionName;
/**
 * @type {MapX.LocationFunction}
 * @api
 */
MapX.MapLocationOptions.prototype.locationFunction;