# 淘天AI设计师开发文档

### 主站

页面访问地址：

*   线上：[https://ai-designer.alibaba-inc.com/](https://ai-designer.alibaba-inc.com/)
    
*   预发：[https://pre-ai-designer.alibaba-inc.com/](https://pre-ai-designer.alibaba-inc.com/)
    

仓库代码：[https://code.alibaba-inc.com/tt-ai-designer/ai-designer-platform](https://code.alibaba-inc.com/tt-ai-designer/ai-designer-platform)

发布平台地址：[https://space.o2.alibaba-inc.com/app/423615/basic](https://space.o2.alibaba-inc.com/app/423615/basic)

分支：看 master 或 daily/0.0.17

node版本：v14.19.3 

本地代理：（在预发页面代理即可）

```json
{
  "proxy": [
    [
      "(.*)/tt-ai-designer/ai-designer-platform/(.*)/(.*)/(.*).css",
      "http://127.0.0.1:3000/css/$4.css"
    ],
    [
      "(.*)/tt-ai-designer/ai-designer-platform/(.*)/(.*)/(.*).js",
      "http://127.0.0.1:3000/js/$4.js"
    ],
    [
      "https://pre-ai-designer.alibaba-inc.com/js/(.*).js",
      "http://127.0.0.1:3000/js/$1.js"
    ],
    [
      "https://pre-ai-designer.alibaba-inc.com/css/(.*).css",
      "http://127.0.0.1:3000/css/$1.css"
    ],
    [
      "http://127.0.0.1:3000/js/framework.js",
      "http://127.0.0.1:3000/framework.js"
    ],
    [
      "https://alifd.alicdn.com/npm/@alife/theme-blue/1.7.1/next.min.css",
      "https://alifd.alicdn.com/npm/@alife/theme-130943/0.1.1/next.min.css"
    ],
    [
      "https://ai-designer.alibaba-inc.com/js/(.*).js",
      "http://127.0.0.1:3000/js/$1.js"
    ],
    [
      "https://ai-designer.alibaba-inc.com/css/(.*).css",
      "http://127.0.0.1:3000/css/$1.css"
    ],
  ],
}
```

### 后台

页面访问地址：

*   线上：[https://ai-designer.alibaba-inc.com/management](https://ai-designer.alibaba-inc.com/management)
    
*   预发：[https://pre-ai-designer.alibaba-inc.com/management](https://pre-ai-designer.alibaba-inc.com/management)
    

仓库代码：[https://code.alibaba-inc.com/tt-ai-designer/ai-designer-manage](https://code.alibaba-inc.com/tt-ai-designer/ai-designer-manage)

发布平台地址：[https://space.o2.alibaba-inc.com/app/430455/basic](https://space.o2.alibaba-inc.com/app/430455/basic)

分支：master

本地代理：

```json
{
  "proxy": [
    [
      "(.*)/tt-ai-designer/ai-designer-manage/(.*)/(.*)/(.*).css",
      "http://127.0.0.1:3001/css/$4.css"
    ],
    [
      "(.*)/tt-ai-designer/ai-designer-manage/(.*)/(.*)/(.*).js",
      "http://127.0.0.1:3001/js/$4.js"
    ],
    [
      "https://pre-ai-designer.alibaba-inc.com/js/(.*).js",
      "http://127.0.0.1:3001/js/$1.js"
    ],
    [
      "https://pre-ai-designer.alibaba-inc.com/css/(.*).css",
      "http://127.0.0.1:3001/css/$1.css"
    ],
    [
      "http://127.0.0.1:3001/js/framework.js",
      "http://127.0.0.1:3001/framework.js"
    ],
    [
      "https://alifd.alicdn.com/npm/@alife/theme-blue/1.7.1/next.min.css",
      "https://alifd.alicdn.com/npm/@alife/theme-130943/0.1.1/next.min.css"
    ],
    [
      "https://ai-designer.alibaba-inc.com/js/(.*).js",
      "http://127.0.0.1:3001/js/$1.js"
    ],
    [
      "https://ai-designer.alibaba-inc.com/css/(.*).css",
      "http://127.0.0.1:3001/css/$1.css"
    ],
  ],
}
```

### 新版主站

仓库代码：[https://code.alibaba-inc.com/tt-ai-designer/ai-designer-portal](https://code.alibaba-inc.com/tt-ai-designer/ai-designer-portal)

发布平台地址：[https://space.o2.alibaba-inc.com/app/513563/basic](https://space.o2.alibaba-inc.com/app/513563/basic)

分支：daily/0.0.1

~~node版本：v14.19.3~~

本地代理：需要在日常环境联调，访问[https://ai-designer.taobao.net/#/home](https://ai-designer.taobao.net/#/home)

```json
{
  "proxy": [
    [
      "https?://dev\.g\.alicdn\.com/tt-ai-designer/ai-designer-portal/[^/]+/js/(.*)\.js",
      "http://127.0.0.1:3002/js/$1.js"
    ],
    [
      "https?://dev\.g\.alicdn\.com/tt-ai-designer/ai-designer-portal/[^/]+/css/(.*)\.css",
      "http://127.0.0.1:3002/css/$1.css"
    ],
    [
      "https?://ai-designer\.taobao\.net/js/(.*)\.js",
      "http://127.0.0.1:3002/js/$1.js"
    ],
    [
      "https?://ai-designer\.taobao\.net/css/(.*)\.css",
      "http://127.0.0.1:3002/css/$1.css"
    ]
  ]
}
```

接口文档：

#### 静态资源上传地址

[https://content.alibaba-inc.com/work/internal-media-management/pic/upload?iframe=3](https://content.alibaba-inc.com/work/internal-media-management/pic/upload?iframe=3)