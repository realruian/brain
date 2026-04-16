# FBI数据需求整理

#### 成本相关

1.  muse成本、tpp成本等
    
    ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/2M9qP5jjwKw5JO01/img/136e09d4-e5a0-4acc-9b83-0c21fcef9745.png)
    
2.  对应节省的计件成本
    
    按照采纳数量x单张图成本算金额总量
    
    | 图片类型 | 频道版头 | 商品主图 | 开屏图 | 手淘资源位 | ip公仔 | 传播海报 | 动画拓展 | 抠图 | 写真照 | 自由模式 |
    | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
    | 单张图消耗人力时间 | 8h | 4h | 8h | 4h | 24h | 8h | 0.75h | 0.25h | 0.7h | 4h |
    | 人力价格 | 120元/h |  |  |  |  |  |  |  |  |  |
    | 单张图价格 | 960元 | 480元 | 960元 | 480元 | 2880元 | 960元 | 90元 | 40元 | 84元 | 480元 |
    
3.  计件平台图片需求张数
    

表：[https://dms.alibaba-inc.com/new#shared=081257e3-c810-477c-be2a-d40208143b38](https://dms.alibaba-inc.com/new#shared=081257e3-c810-477c-be2a-d40208143b38)

字段：demand\_entity  ||  require\_qty finish\_qty

#### 筛选

1.  **加一个按组织架构筛选：只支持按照关键词搜索，不接受直接查看，不精确到人**
    

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/2M9qP5jjwKw5JO01/img/27240b16-54fc-4b13-89ba-0622c2585707.png)![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/2M9qP5jjwKw5JO01/img/784f4bbb-0168-4b10-a8a1-aaed5ff71e18.png)

#### 批量模版生成总数

需拆分至按天统计，目前为按月统计。

\*核心是能准确的看到每天的产能情况。

#### AI图像生成总数、AI图像生成采纳数

1.  需将后续上线的图片类型补充进看板内
    
2.  AI图像采纳数按类型展开
    

    'freeMode\_download',

    'openScreen\_download',

    'productPoster\_download',

    'mainImageTemp\_download',

    'taobaoResLoc\_download',

    'productMainImage\_download',

    'photoshoot\_download',

    'ipDoll\_download'

#### 其他场域数据同步

目前只有调用总量，需回流生成采纳数，待补

#### 每日生图总数，与头部的总数保持一致。

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/2M9qP5jjwKw5JO01/img/209ba2b1-6447-43ad-a0c9-2df493c3b05a.png)

该维度。

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/2M9qP5jjwKw5JO01/img/563628e6-d472-467d-b12b-dbc4ce65ee9d.png)