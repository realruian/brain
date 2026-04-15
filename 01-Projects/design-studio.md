---
tags: [项目, 美团, AI设计, design-studio]
date: 2026-04-14
---

# Design Studio

美团内部 AI 驱动的设计素材自助生产平台。

代码仓库：`~/dev/meituan/design-studio`

---

## 业务背景

让设计师和运营同学无需 Photoshop，直接在浏览器中编辑、导出活动头图、Banner 等设计素材。覆盖会场头图、站内资源位等多种场景。

核心流程：
1. 管理员上传 PSD 模板 → 系统自动解析图层结构存入数据库
2. 用户按场景浏览模板
3. 进入编辑器替换文案/图片、拖拽图层
4. 一键截图导出 PNG，直接投放

---

## 关键决策

- **PSD 解析用 ag-psd + @napi-rs/canvas + Sharp**：ag-psd 读二进制 PSD 结构，@napi-rs/canvas 处理像素数据（比 node-canvas 性能好），Sharp 转 PNG。三者配合覆盖文字层和图片层
- **两种模板类型**：`html`（加载静态 HTML，URL 参数注入变量，适合简单文字/颜色替换）和 `psd`（解析图层后 Canvas 逐层渲染，适合复杂编辑）
- **截图导出用 Puppeteer**：本地开发用系统 Chrome，Vercel 生产用 @sparticuz/chromium-min 无头浏览器包。浏览器实例跨请求复用（单例），避免冷启动
- **媒体存储用 Vercel Blob**：所有资源（PSD、图层 PNG、缩略图、字体）存 Blob，浏览器通过同源 `/api/blob/media` 代理拉取，不暴露签名 URL
- **撤销/重做用状态快照**：最多 50 步历史，纯状态 diff，不依赖外部库

---

## 已知问题 / 坑点

- PSD 解析器在图层超过 50 层时可能 OOM，需要改成流式处理
- 字体预加载：编辑器必须先解析图层用到的字体名，按需 `FontFace` 加载本地 TTF/OTF，否则文字渲染出错
- 文字层字号需要考虑变换矩阵缩放，不能直接用 PSD 里的原始值
- Vercel Blob 路径有白名单校验（`isAllowedBlobPathname`），只允许 `thumbnails/`、`psd-layers/` 等已知前缀
- 截图导出需要等字体加载完成后再截取，否则文字可能用了 fallback 字体

---

## 进展记录
