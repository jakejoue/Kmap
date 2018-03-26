# Kmap
基于openLayer的二次开发

```
ol.View中的projection确认了整体的坐标系，坐标原点和坐标范围等，以及投影后的地图整体形状（正方形，长方形），坐标系对不上的时候，最边缘的切片会被拉升，坐标点会对不上（如：长方形上下拉升成正方形，坐标会偏差很大）
```

```
ol.source.Source中的projection确认了数据源的坐标系，tile的切割方式，切片图片的大小等，最终用于生成切片的请求url
```

```
地图移动是按照像素，进行周围切片的计算（一般每个切片大小是256*256），按照每个suorce的projection更新切片
```

```
view的projection和suorce的projection没有必然关联，view控制地图整体的形状，切片的请求是每个source自己的方法
```