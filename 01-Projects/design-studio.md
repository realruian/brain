---
tags: [项目, 美团, AI设计, design-studio]
date: 2026-04-14
---

# Design Studio

美团内部 AI 驱动的设计素材自助生产平台。

代码仓库：`~/dev/meituan/design-studio`

---

## 项目概述

Design Studio 让设计师和运营同学无需 Photoshop，直接在浏览器中编辑、导出活动头图、Banner 等设计素材。

核心流程：
1. 管理员上传 PSD 模板 → 系统自动解析图层结构存入数据库
2. 用户在首页按场景（会场头图、站内资源位等）浏览模板
3. 进入编辑器后可替换文案/图片、拖拽图层
4. 一键截图导出为 PNG，直接投放

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 16.2（App Router）+ React 19 |
| 语言 | TypeScript |
| 样式 | Tailwind CSS v4 |
| 数据库 | Neon Serverless PostgreSQL |
| 文件存储 | Vercel Blob |
| PSD 解析 | ag-psd + @napi-rs/canvas + Sharp |
| 截图导出 | Puppeteer Core + @sparticuz/chromium-min |
| 部署 | Vercel |

---

## 目录结构

```
design-studio/
├── app/                     # Next.js App Router
│   ├── page.tsx             # 首页（模板浏览）
│   ├── editor/[id]/         # 模板编辑器页面
│   ├── admin/               # 管理后台
│   └── api/
│       ├── admin/           # 模板/图层管理接口
│       ├── blob/            # Vercel Blob 同源代理
│       ├── export/          # Puppeteer 截图导出
│       └── fonts/           # 字体服务
├── components/
│   ├── home/                # 首页：模板网格、场景筛选面板
│   ├── editor/              # 编辑器：Canvas 渲染、属性面板
│   ├── admin/               # PSD 上传与图层管理
│   ├── layout/              # 侧边栏导航
│   └── ui/                  # 通用组件（Accordion 等）
├── lib/
│   ├── psd-parser.ts        # PSD 解析核心
│   ├── db.ts                # Neon 数据库连接
│   ├── db-init.ts           # 建表初始化
│   ├── templates-db.ts      # 模板 CRUD
│   ├── templates.ts         # 静态模板定义（兜底）
│   ├── template-html.ts     # HTML 模板注入逻辑
│   ├── blob-media.ts        # Blob 路径白名单校验
│   └── design-tokens.ts     # 设计 Token（颜色/间距/字体）
├── types/
│   └── template.ts          # Template / PsdLayer 类型
└── public/
    ├── fonts/               # 美团 / 方正 / MiSans 字体
    ├── templates/           # HTML 模板文件
    └── images/              # 示例图片资源
```

---

## 核心模块说明

### 1. PSD 解析器 `lib/psd-parser.ts`

- 使用 `ag-psd` 读取二进制 PSD，遍历顶层图层
- 文字层：提取字体名、字号（含变换矩阵缩放）、颜色、对齐、行高、旋转角度
- 图片层：用 `@napi-rs/canvas` + `sharp` 将像素数据转为 PNG Buffer
- 输出结构化 `ParsedLayer[]` + 合成图 Buffer，供后续存入数据库

### 2. 模板系统 `lib/templates-db.ts` + `types/template.ts`

支持两种模板类型（`templateType`）：

| 类型 | 渲染方式 | 适用场景 |
|------|----------|----------|
| `html` | 加载静态 HTML 文件，通过 URL 参数注入变量 | 简单文字/颜色替换 |
| `psd` | 解析 PSD 图层后在 Canvas 上逐层渲染 | 复杂图层编辑 |

可编辑字段 `editableFields` 分三类：`texts`（文案）、`colors`（颜色）、`images`（图片）。

### 3. PSD 编辑器 `components/editor/psd-editor.tsx`

- 按 `zIndex` 顺序渲染图层，支持文字层内联编辑（`contentEditable`）
- 拖拽图层：mousemove 计算偏移，带吸附辅助线（snap lines）
- 图片层：上传新图 → 传 Vercel Blob → 替换 `imageUrl`
- 撤销/重做：最多 50 步历史快照（纯状态 diff，不依赖外部库）
- 字体预加载：解析图层用到的字体名 → 按需 `FontFace` 加载本地 TTF/OTF

### 4. 截图导出 `app/api/export/route.ts`

- **本地开发**：直接使用系统安装的 Chrome（`channel: "chrome"`）
- **Vercel 生产**：按需下载 `@sparticuz/chromium-min` 无头浏览器包
- 流程：打开页面 → 注入参数（`postMessage mtds:update`）→ 等待字体加载 → 截取指定 CSS Selector 元素 → 返回 PNG
- 浏览器实例跨请求复用（`browserPromise` 单例），避免冷启动开销

### 5. 媒体存储 `lib/blob-media.ts`

- 所有设计资源（PSD 原文件、图层 PNG、缩略图、字体）存储于 Vercel Blob
- `isAllowedBlobPathname` 白名单校验，只允许 `thumbnails/`、`psd-layers/` 等已知前缀
- 浏览器通过同源 `/api/blob/media` 代理拉取，避免直接暴露 Blob 签名 URL

### 6. 设计 Token `lib/design-tokens.ts`

- 主色：浅青色系（Cyan-500 `#06b6d4`）
- 背景：三色渐变 `#fdf2f8 → #f0f9ff → #faf5ff`
- 字体：MiSans / 美团字体 / 方正兰亭 / 造字工房元黑体
- 提供 `tailwindExtend` 对象，可直接粘贴进 `tailwind.config.ts`

---

## 进展记录
