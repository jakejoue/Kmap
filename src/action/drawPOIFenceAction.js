// /**
//  * 绘画动作类
//  * 
//  * @constructor
//  * @param {MapX.DrawActionOptions} options
//  * @extends {KMap.Action.MapAction}
//  * @api
//  */
// KMap.Action.DrawPOIFenceAction = function (options) {
//   options = options || {};

//   var id = options['actionName'];

//   this.state_ = null;
//   this.graphic_ = null;
//   this.infoTemplate_ = options['infoTemplate'];
//   this.showToolBar_ = options['showToolBar'] !== undefined ?
//     options['showToolBar'] : true;
//   this.drawType_ = options['drawType'];

//   this.singleClickEvent = options['singleClickEvent'] || KMap.Action.DrawPOIFenceAction.Handle.INFO;
//   this.doubleClickEvent = options['doubleClickEvent'] || KMap.Action.DrawPOIFenceAction.Handle.EDIT;

//   this.layer_ = new KMap.GraphicsLayer(id, {});
//   var symbol = options['layerSymbol'];
//   if (symbol) {
//     var render = new KMap.SimpleRenderer(symbol);
//     this.layer_.setRenderer(render);
//   }

//   //draw
//   this.drawTools_ = {
//     'point': new KMap.Interaction.Draw({
//       type: 'Point',
//       layer: this.layer_,
//       symbol: options['pointSymbol']
//     }),
//     'line': new KMap.Interaction.Draw({
//       type: 'LineString',
//       layer: this.layer_,
//       symbol: options['lineSymbol']
//     }),
//     'polygon': new KMap.Interaction.Draw({
//       type: 'Polygon',
//       layer: this.layer_,
//       symbol: options['polygonSymbol']
//     })
//   };
//   this.select_ = new KMap.Interaction.Select({
//     layers: [this.layer_],
//     condition: 'always'
//   });
//   this.edit_ = new KMap.Interaction.Modify({
//     select: this.select_
//   });

//   //draw
//   var drawend = options['drawEnd'];
//   if ($.isFunction(drawend)) {
//     this.drawEnd(drawend);
//   }

//   //edit
//   var editend = options['editEnd'];
//   if ($.isFunction(editend)) {
//     this.editEnd(editend);
//   }

//   //delete
//   this.deleteend_ = options['deleteEnd'];

//   //toolbar
//   var that = this;
//   this.tooBar = $("<ul id='" + id + "' class='drawAction'>" +
//     "<li style='display:block' dtype='reset'   class='drawAction_reset'   title='停止工具'><div>停止</div></li>" +
//     "<li style='display:none'  dtype='point'   class='drawAction_point'   title='绘制点'  ><div>绘制点</div></li>" +
//     "<li style='display:none'  dtype='line'    class='drawAction_line'    title='绘制线'  ><div>绘制线</div></li>" +
//     "<li style='display:none'  dtype='polygon' class='drawAction_polygon' title='绘制面'  ><div>绘制面</div></li>" +
//     "</ul>").css(options['css'] || {});
//   this.tooBar.children().click(function (e) {
//     var type = $(this).attr("dtype");
//     that.open(type);
//   });
//   this.tooBar.children("li[dtype='" + this.drawType_ + "']").show();

//   KMap.Action.MapAction.call(this, options);
// };
// KMap.extends(KMap.Action.DrawPOIFenceAction, KMap.Action.MapAction);

// /**
//  * 开启工具
//  * 
//  * @api
//  */
// KMap.Action.DrawPOIFenceAction.prototype.open = function (type) {
//   this.close();
//   if (type != 'reset') {
//     this.drawTools_[type].setActive(true);
//     this.state_ = type;
//     this.tooBar.children().removeClass('select');
//     this.tooBar.children("li[dtype='" + type + "']").addClass('select');
//   }
// }

// /**
//  * 关闭工具
//  * 
//  * @api
//  */
// KMap.Action.DrawPOIFenceAction.prototype.close = function () {
//   this.state_ = 'reset';
//   this.each_(function (e) {
//     e.setActive(false);
//   });
//   this.select_.setActive(false);
//   this.edit_.setActive(false);

//   this.tooBar.children().removeClass('select');
//   this.tooBar.children("li[dtype='reset']").addClass('select');
// }

// /**
//  * 绘制完成事件
//  * 
//  * @api
//  */
// KMap.Action.DrawPOIFenceAction.prototype.drawEnd = function (e, e2) {
//   if (e && e2) {
//     var tool = this.drawTools_[e];
//     if (tool) {
//       tool.on("drawend", e2);
//     }
//   } else if ($.isFunction(e)) {
//     this.drawTools_['point'].on("drawend", e);
//     this.drawTools_['line'].on("drawend", e);
//     this.drawTools_['polygon'].on("drawend", e);
//   }
// }

// /**
//  * 编辑完成事件
//  * 
//  * @api
//  */
// KMap.Action.DrawPOIFenceAction.prototype.editEnd = function (e) {
//   this.edit_.on('modifyend', e);
// }

// /**
//  * 删除完成事件
//  * 
//  * @api
//  */
// KMap.Action.DrawPOIFenceAction.prototype.deleteEnd = function (e) {
//   this.deleteend_ = e;
// }

// /**
//  * 设置弹出框
//  * @api
//  */
// KMap.Action.DrawPOIFenceAction.prototype.setInfoTemplate = function (e) {
//   this.infoTemplate_ = e;
// }

// /**
//  * @api
//  * 清空图层
//  */
// KMap.Action.DrawPOIFenceAction.prototype.clearDraw = function (e) {
//   this.layer_.clear();
// }

// /**
//  * @api
//  * 添加多个元素
//  * @param {Array.<KMap.Graphic>} graphics
//  */
// KMap.Action.DrawPOIFenceAction.prototype.addGraphics = function (graphics) {
//   this.layer_.addAll(graphics);
// }

// /**
//  * @api
//  * 获取所有元素
//  */
// KMap.Action.DrawPOIFenceAction.prototype.getGraphics = function () {
//   var graphics = [];
//   this.layer_.forEach(function (graphic) {
//     graphics.push(graphic);
//   });
//   return graphics;
// }

// /**
//  * @api
//  * 删除元素
//  */
// KMap.Action.DrawPOIFenceAction.prototype.remove = function (graphic) {
//   this.layer_.remove(graphic);
//   this.select_.clearSelect();
//   if ($.isFunction(this.deleteend_)) {
//     this.deleteend_.call(this);
//   }
// }

// /**
//  * 遍历drawTools
//  * @private
//  * @api
//  */
// KMap.Action.DrawPOIFenceAction.prototype.each_ = function (func) {
//   var tools = this.drawTools_;
//   for (var key in tools) {
//     func(tools[key]);
//   }
// }

// KMap.Action.DrawPOIFenceAction.prototype.handleEvent_ = function (evt) {
//   var that = this;
//   if (that.state_ == 'reset') {
//     that.close();

//     var pixel = evt.pixel;
//     var type = evt.type;

//     that.getMap().forEachFeatureAtPixel(pixel, function (graphic, layer) {
//       if (graphic.getVisible()) {
//         //单击事件处理(默认打开对话框)
//         if (type == 'singleclick') {
//           if (that.singleClickEvent) {
//             that.singleClickEvent(graphic, evt, that);
//           }
//         }
//         //双击事件处理（默认打开编辑）
//         if (type == 'dblclick') {
//           if (that.doubleClickEvent) {
//             that.doubleClickEvent(graphic, evt, that);
//           }
//         }
//       }
//     }, {
//       layerFilter: function (layer) {
//         return (layer === that.layer_.getLayer());
//       }
//     });
//   }
// }

// /**
//  * 地图添加action时相应动作
//  * 
//  * @api
//  */
// KMap.Action.DrawPOIFenceAction.prototype.activate = function () {
//   var map = this.getMap();
//   map.addGraphicsLayer(this.layer_);
//   this.each_(function (e) {
//     map.addInteraction(e);
//   });
//   map.addInteraction(this.select_);
//   map.addInteraction(this.edit_);
//   this.open(this.drawType_);
//   if (this.showToolBar_) {
//     $("#mapDiv").append(this.tooBar);
//   }
//   map.on(['singleclick', 'dblclick'], this.handleEvent_, this);
// };

// /**
//  * 销毁Action
//  * 
//  * @api
//  */
// KMap.Action.DrawPOIFenceAction.prototype.deactivate = function () {
//   var map = this.getMap();
//   map.removeGraphicsLayer(this.layer_);
//   this.each_(function (e) {
//     map.removeInteraction(e);
//   });
//   map.removeInteraction(this.select_);
//   map.removeInteraction(this.edit_);
//   this.tooBar.remove();
//   map.un(['singleclick', 'dblclick'], this.handleEvent_, this);
// };

// KMap.Action.DrawPOIFenceAction.Handle = {
//   INFO: function (graphic, evt, that) {
//     var map = that.getMap();
//     var coordinate = evt.coordinate;
//     if (map.infoWindow && that.infoTemplate_) {
//       map.infoWindow.hide();
//       graphic.setInfoTemplate(that.infoTemplate_);
//       map.infoWindow.setSelectedFeature(graphic);
//       if (graphic.getGeometry().getType() == 'polygon') {
//         coordinate = graphic.getGeometry().getGeometry().getInteriorPoint().getCoordinates();
//       }
//       map.infoWindow.show(coordinate);
//       graphic.setInfoTemplate(undefined);
//     }
//   },
//   EDIT: function (graphic, evt, that) {
//     if (that.graphic_) {
//       if (that.graphic_.getFeature() === graphic.getFeature()) {
//         that.select_.clearSelect();
//         that.graphic_ = null;
//         return;
//       }
//     }
//     that.select_.handleEvent(evt);
//     that.edit_.setActive(true);
//     that.graphic_ = graphic;
//   },
//   DELETE: function (graphic, evt, that) {
//     that.remove(graphic);
//   }
// }

// // var graphic = new KMap.Graphic();
// // var line = new KMap.Polyline([
// //     [[114.168945, 22.636695],[114.158945, 22.636695],[114.158945, 22.626695]],
// //     [[114.158945, 22.626695],[114.168945, 22.626695]],
// //     [[114.168945, 22.626695],[114.168945, 22.616695],[114.158945, 22.616695]]
// // ]);
// // graphic.setGeometry(line);
// // action.addGraphics([graphic]);
// // var path = line.getPath(2);
// // line.removePath(2);
// // line.addPath(path);
// // line.insertPoint(0,1,[114.1644945, 22.646695]);
// // line.setPoint(0,1,[114.1644945, 22.626695])
// // line.removePoint(0,1);
