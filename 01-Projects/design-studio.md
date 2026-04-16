---
tags: [项目, 美团, AI设计, design-studio]
date: 2026-04-14
---

# Design Studio

美团内部 AI 驱动的设计素材自助生产平台。

代码仓库：`~/dev/meituan/design-studio`

---

## 项目目标

让设计师和运营同学无需 Photoshop，直接在浏览器中编辑、导出活动头图、Banner 等设计素材。覆盖会场头图、站内资源位等多种场景。

核心流程：
1. 管理员上传模板（HTML 或 PSD）→ 系统解析并存入数据库
2. 用户按场景浏览模板库（首页 ISR 60s）
3. 进入编辑器替换文案/图片、拖拽图层、调整样式
4. 一键截图导出 PNG，直接投放

---

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router) + React 19 |
| 语言 | TypeScript 5（strict 模式） |
| 样式 | Tailwind CSS 4（`@tailwindcss/postcss`），自定义 design tokens |
| 数据库 | Neon Postgres（`@neondatabase/serverless`，裸 SQL，无 ORM） |
| 媒体存储 | Vercel Blob（PSD、图层 PNG、缩略图、字体） |
| PSD 解析 | `ag-psd` + `@napi-rs/canvas` + `sharp` |
| 导出渲染 | `puppeteer-core` + `@sparticuz/chromium-min`（Serverless 无头浏览器） |
| 图标 | `lucide-react` |
| 部署 | Vercel |

---

## 核心架构

### 两种模板类型

- **HTML 模板**：加载静态 HTML 文件，通过 URL 参数 / `postMessage` 注入变量（文字、颜色、图片），Puppeteer 截图导出 PNG。适合简单文字/颜色替换场景
- **PSD 模板**：上传 PSD → `ag-psd` 解析图层结构 → `@napi-rs/canvas` + `sharp` 逐层提取为 PNG → 存入数据库 + Blob。前端 Canvas 渲染图层，支持拖拽、文字编辑、图片替换、图层锁定/显隐、吸附对齐，最终 Canvas 导出 PNG

### 数据流

```
模板管理（admin）
  → PSD 上传 → /api/admin/psd/upload → psd-parser.ts 解析
    → 图层 PNG → Vercel Blob（psd-layers/）
    → 图层元数据 → Neon Postgres（psd_layers 表）
    → 缩略图 → Vercel Blob（thumbnails/）
    → 模板记录 → Neon Postgres（templates 表）

用户编辑
  → /editor/[id] → SSR 取模板数据
    → HTML 类型 → EditorPageClient（iframe 预览 + 参数注入）
    → PSD 类型 → PsdEditor（Canvas 逐层渲染 + 拖拽编辑）

导出
  → HTML → /api/export（Puppeteer 截图）
  → PSD → /api/export/psd（服务端 Canvas 合成）
```

### 关键决策

- **Puppeteer 单例复用**：浏览器实例跨请求复用，避免冷启动。本地走系统 Chrome，生产走 `@sparticuz/chromium-min`
- **Blob 代理访问**：所有媒体资源通过 `/api/blob/media` 同源代理，不暴露签名 URL。白名单校验路径前缀（`thumbnails/`、`psd-layers/` 等）
- **撤销/重做**：纯状态快照，最多 50 步历史，不依赖外部库
- **字体预加载**：编辑器从 `KNOWN_FONTS` 映射表按需 `FontFace` 加载本地字体文件
- **数据库无 ORM**：直接用 Neon 的 `sql` tagged template，`templates-db.ts` 封装查询层
- **ISR 缓存**：首页 60s，编辑器页 300s

### 数据库表

- `templates` — 模板元数据（id、名称、分类、缩略图、尺寸、HTML 文件路径、可编辑字段、模板类型）
- `psd_layers` — PSD 图层数据（模板关联、图层类型、位置/尺寸、图片 URL、文字属性、锁定状态）

---

## 已知限制

- **PSD 图层数量**：超过 50 层时 `ag-psd` 解析可能 OOM，需要改成流式处理
- **字体依赖**：编辑器文字渲染依赖 `KNOWN_FONTS` 静态映射（`psd-editor.tsx:8-19`），新字体必须手动添加映射 + 上传字体文件
- **文字层字号**：PSD 变换矩阵中的缩放会影响实际字号，不能直接用 PSD 原始 fontSize
- **导出超时**：`/api/export` 配置 30s 超时 / 1024MB 内存（`vercel.json`），复杂模板可能不够
- **截图字体一致性**：Puppeteer 导出需要等 `document.fonts.ready`，否则可能用了 fallback 字体
- **Blob 路径白名单**：`blob-media.ts` 的 `BLOB_MEDIA_PREFIXES` 固定了允许的路径前缀，新增存储目录需同步更新
- **PSD 图层更新是逐字段 SQL**：`updatePsdLayer` 对每个字段发一条 UPDATE 语句，批量更新时 N 个字段 = N 次数据库请求
- **PSD 编辑器状态全在客户端**：编辑状态（`editState`）仅存内存，刷新页面丢失
- **无用户认证**：admin 接口无鉴权保护

---

## 进展记录

### 2026-04-17 — 首页细节精修

审查 + 指令模式（Cursor 执行）。今日改动尚未 commit。

**首页模块结构**（当前实际组件清单）：

| 模块 | 位置 | 说明 |
|---|---|---|
| TopBar | `components/layout/top-bar.tsx` | fixed，60px，透明背景+右上角头像 `public/avatar-default.png` + "业务"文字 |
| HeroHeader | `components/home/hero-header.tsx` | "设计需求 快人一步" + "人人都是设计师" |
| StickySceneTabBar | `components/home/home-shell.tsx:49` | 包装 SceneTabBar 的全宽吸顶条，白底 90% + 10px 模糊 + 淡灰分割线 |
| SceneTabBar | `components/home/scene-tab-bar.tsx` | 6 个场景 Tab，`pt-6 pb-0` 让下划线贴底部分割线 |
| CreationPanel | `components/home/creation-panel.tsx` | 上传图片入口用 `public/icons/upload-image.svg` |
| FeatureCards | `components/home/feature-cards.tsx` | AI 图像处理卡片组，1~5 列响应式 |
| TemplateGrid + TemplateCard | `components/home/template-grid.tsx` / `template-card.tsx` | 瀑布流，hover 显示底部 62px 黑色蒙版（`bg-black/40 backdrop-blur-[10px]`）+ 10px 模板名 + 194×28 橙色按钮 |
| HomeShell / HomeMain | `components/home/home-shell.tsx` / `home-main.tsx` | 客户端壳 + 主内容区组织 |

**背景层**（`app/page.tsx`）：基础渐变 + MP4 视频均用 `fixed inset-0` 覆盖视口（不是 `absolute`，后者会随父容器整页高度拉伸导致画面异常放大）。

**滚动交互**：StickySceneTabBar 用 scroll + requestAnimationFrame 同步 stuck 状态（避免 IntersectionObserver 异步延迟 + CSS transition 叠加产生的白底拖尾）。CSS 过渡非对称：stuck=true 走 150ms 平滑淡入，stuck=false 走 0ms 瞬时消失。

**已清理**：`components/home/scroll-context.tsx`（ScrollProvider / useScrolled 零消费者）已从代码库删除。

**踩坑教训**：
- Tailwind v4 默认 border-color 是 `currentColor`（v3 是 `gray-200`）。条件切换 border 时要让 `border-b` 常驻、只切颜色，避免切换瞬间 `currentColor` 闪一帧
- Figma 原稿数值是权威，不要用"视觉直觉"建议覆盖（比如 TopBar 是不是要加高）
- 全屏背景媒体用 `fixed` 不要 `absolute`

### 2026-04-14 以前
