# TPP接入文档

### 巨浪海报图

```json
{
    "appId": 53302,
    "bizCode": "julang_poster",
    "config": {
        "requestTimeoutMs": 20000
    },
    "request": {
        "item_id": ["123456789","987654321"],
        "product_title": ["商品名称示例","商品名称示例"],// 填了item_id，product_title和image_url都不用填了
        "image_url": ["https://example.com/product-white-bg.jpg"],
        "style_reference_url":"https://example.com/product-white-bg.jpg",
        "prompt": "简约风格，突出产品特点", 
        "logo_url": "https://example.com/logo.png",
        "logo_position":["left","top_center","right"] // 左中右三选一
        "logo_width_percent":0.15。// logo宽度占画面宽度百分比
        "logo_margin":40   // logo距离画面边缘距离
        "width": 1080,
        "height": 1440,
        "disclaimer": "本产品最终解释权归商家所有",
        "disclaimer_position":["left","bottom"],
        "max_file_size_kb":512 
    }
}
```

### 抠图

```json
{
  "appId": 53302,
  "bizCode": "smart_matting",
  "config": {
    "requestTimeoutMs": 20000
  },
  "request": {
    "image_url": "用户输入图片，其他参数保持默认https://example.com/product.jpg",
    "tolerance": 15,
    "edge_width": 2,
    "padding": 10,
    "purify_strength": 30,
    "upload_result": true,
    "return_cropped": true
  }
}

```