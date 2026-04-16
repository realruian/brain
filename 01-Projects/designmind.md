---
tags: [项目, AI设计, designmind, 内部工具]
date: 2026-04-16
---

# DesignMind

公司内部 AI 设计图像生产平台，参考淘天 AI 设计师系统，基于 MT 项目（已有 UI 骨架）扩展而来。

代码仓库：`~/Desktop/Dev/designmind`
参考文档：`designmind/doc/`（22 份：PRD、后端接口、前端规范、UI 截图）

---

## 项目目标

长期：对话输入 → AI 生图（SSE 流式），支持文生图、图生图、多轮修改；模版一键延展多尺寸；AI 扩图/抠图工具。

**MVP（无真实 AI 调用）：**
- 首页：模板浏览 + 场景过滤 + 创作面板（UI 占位）
- HTML 编辑器：iframe 预览 + 文案/配色/图片编辑 + puppeteer 截图导出
- PSD 编辑器：图层列表 + 拖拽移动 + 文字编辑 + 图片替换 + sharp 合成导出
- 后台：模板 CRUD + PSD 上传/解析/图层管理

---

## 技术栈

| 类别     | 技术                                           | 版本            |
| ------ | -------------------------------------------- | ------------- |
| 框架     | Next.js（App Router）                          | 16.2.2        |
| UI     | React + TypeScript                           | 19 / 5        |
| 样式     | Tailwind CSS 4 + 自定义设计令牌                     | 4             |
| 数据库    | PostgreSQL（`postgres` 包，无 ORM）               | postgres ^3.4 |
| 存储     | S3 兼容（`@aws-sdk/client-s3`）                  | ^3            |
| PSD 解析 | `ag-psd` + `@napi-rs/canvas`                 | ^30           |
| 图像处理   | `sharp`                                      | ^0.34         |
| 截图导出   | `puppeteer-core` + `@sparticuz/chromium-min` | ^24           |
| 图标     | `lucide-react`                               | ^1.7          |

**开发环境存储**：Supabase（免费 PostgreSQL + S3 Storage）
**生产部署目标**：公司内网服务器 + Docker PostgreSQL + MinIO

---

## 核心架构

### 两种模板类型

| 类型 | 编辑方式 | 导出方式 |
|------|---------|---------|
| `html` | iframe 内联编辑 + postMessage 注入参数 | puppeteer 截图 → PNG |
| `psd` | Canvas 图层编辑器（拖拽/文字/图片替换）| sharp 逐层合成 → PNG |

### 数据库 Schema（无 ORM，裸 SQL）

**templates**：id、name、category、thumbnail、width/height、html_file、editable_fields（JSONB）、template_type、psd_file、canvas_width/height、sort_order

**psd_layers**：id、template_id（FK）、name、layer_type、z_index、x/y/width/height、visible、opacity、rotation、image_url、text_content、font_\*（family/size/color/weight/style/align/line_height）、locked、sort_order

### 文件存储（S3 兼容）

所有媒体文件通过代理访问，前端永远不拿到真实 S3 URL：

```
上传 → /api/admin/upload → S3
读取 → /api/blob/media?pathname=xxx → S3 (getObjectStream)
字体 → /api/fonts/[...path] → S3 (getObjectStream)
```

允许的 path 前缀：`thumbnails/`、`templates/`、`uploads/`、`fonts/`、`psd-originals/`、`psd-layers/`

### 页面缓存

- 首页 `/`：ISR `revalidate = 60s`
- 编辑器 `/editor/[id]`：ISR `revalidate = 300s`

### 关键文件索引

```
lib/
  db.ts            — postgres 单例（global 防热重载泄露）
  s3.ts            — S3Client + uploadFile / getObjectBuffer / getObjectStream
  templates-db.ts  — 数据访问层（getAllTemplates/getTemplateById/getPsdLayers/updatePsdLayer）
  psd-parser.ts    — ag-psd 解析，返回图层列表 + 合成图 Buffer
  design-tokens.ts — 颜色/圆角/阴影/间距/字体 设计令牌

components/
  home/creation-panel.tsx   — 创作面板（6 场景标签、文案输入、参考图上传）
  editor/psd-editor.tsx     — PSD 图层编辑器（拖拽/snap/撤销重做）
  editor/editor-page-client.tsx — HTML 编辑器（iframe + EditPanel）
```

---

## 环境变量

```env
DATABASE_URL=postgresql://...
S3_ENDPOINT=https://...
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_BUCKET=designmind
S3_REGION=ap-southeast-1
```

---

## 已知限制

1. **无 AI 接入**：MVP 阶段创作面板仅为 UI 占位，无实际生图能力
2. **导出依赖 puppeteer**：HTML 导出在 Serverless 环境需 chromium-min，冷启动慢、内存大（vercel.json 配置 1024MB/30s），内部部署需保留此配置
3. **全量代理存储**：所有媒体文件走 `/api/blob/media` 代理，大文件（PSD、高清图）会占用服务器带宽；大规模使用需改为 presigned URL
4. **无鉴权**：当前无任何认证/权限控制，内网部署前需加
5. **PSD 解析限制**：ag-psd 依赖 Node.js canvas，不支持 Edge Runtime；最大文件 20MB；复杂图层效果（混合模式、矢量蒙版）可能丢失
6. **数据库无迁移工具**：Schema 通过 `/api/admin/init-db` 接口手动执行，生产环境变更需谨慎
7. **ISR 缓存**：首页数据最长延迟 60s 生效，编辑器最长 300s，模板更新后不会立即反映

---

## 进展记录

- **2026-04-15**：项目初始化，从 MT 仓库复制代码，确立技术方案
- **2026-04-16**：完成基础设施迁移（neon → postgres，Vercel Blob → S3 兼容），类型检查通过
