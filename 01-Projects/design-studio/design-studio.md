---
tags: [项目, 美团, AI设计, design-studio]
date: 2026-04-14
---
美团内部 AI 驱动的设计素材自助生产平台（**产品名：外卖营销 AI 业务自助化设计工具**，暂定名）。

- 代码仓库：`~/dev/meituan/design-studio`（`design-studio` 是本地代码目录名，不等于产品名）
- 当前 PRD：[[PRD/PRD-v1-外卖营销AI自助化设计工具]]（v1.0 评审中，作者田睿安）
- 文档目录：`PRD/` · `技术方案/` · `会议纪要/` · `设计稿/`

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

## 已知坑点（2026-04-22 沉淀）

- **PSD 字体名两套体系**：PSD 里存 PostScript 名（如 `FZLTDHJW--GB1-0`），前端下拉显示自定义 family 名（如 `MeiTuan`）。服务端 `app/api/export/psd/route.ts` 里的 `FAMILY_WEIGHT_TO_PS` map 负责对齐。改字体列表要两边同步，Skia `matchFamilyStyle` 按 family 字符串精确匹配，不认 PostScript name 字段。
- **长文本推画布的 5 轮迭代**：根因是 text 元素自身没有 `maxWidth + overflow:hidden`，祖先 `overflow:hidden` + `contain:strict` 在 `transform: scale` + 宽 `position:absolute` 子孙组合下失效。修法必须在元素自身裁剪，不是叠祖先 overflow。
- **React 警告「setState during render」**：`commitEdit` 里把 `onUpdate`（父 setState）嵌套在 `setEditingId` 的 updater 回调里会触发警告。用 ref 读 editingId，把 onUpdate 抽出来独立调。
- **PSD 解析一次性**：修改源 PSD 文件后必须重新上传，`data/local.db` 里的坐标/文字/字体名是解析时固化的。本地开发时 SQLite 文件位置 `data/local.db`（这个笔记顶部说的 Neon Postgres 是线上方案，本地已切到 SQLite via `better-sqlite3`）。
- **`isTextEdited` 短路条件要覆盖所有字体字段**：导出路由判断"文本有改动"时要包含 `textContent / fontSize / fontColor / fontFamily / fontWeight`，漏掉 fontFamily/fontWeight 会让只切字体的场景走 PSD 预渲染 PNG 分支，修复代码根本不执行。

## 调试口诀

反复修不好（同一 bug ≥ 2 次未解决）立即切诊断模式，不要盲猜：

- **字体问题**：`console.log(GlobalFonts.families)` + `GlobalFonts.has(name)`，看 Skia 实际注册表
- **布局问题**：目标元素和所有祖先各自的 `getBoundingClientRect` + `clientWidth/Height` + `scrollWidth/Height`，对比 layout box / client box / scroll box 的差异
- **状态问题**：render 入口 log 当前 state + props，看是不是根本没进到预期分支
- **事件问题**：关键 event handler 入口 log 参数

诊断日志用完要记得清。

---

## 进展记录

### 2026-04-22 — T4b 编辑器 MVP 全部收尾 + T7 字体 / T8h 画布两个硬骨头

T4b 所有子任务完成：

- **T8a** 图片替换上传（`components/editor/property-panel.tsx`）— 按比例自动调整 layer 高度，不变形
- **T8b** 双击文字原地编辑（`InlineTextEditor` in `canvas-stage.tsx`）— wrap="off" + whiteSpace:pre，Enter 插入换行，blur/Esc 退出
- **T8c1** 元素拖拽（二级选中后鼠标拖，坐标换算除以 scale）
- **T8c2/T8k/T8k.1** 完整吸附 —— 画布 4 边 + 中线，兄弟元素的 4 边 + 中线；**Figma-style 只对 perpendicular 轴重叠的目标吸附**（顶部 logo 和底部按钮 Y 范围不重叠就不吸附）
- **T8e** 属性面板按选中状态切换（未选 → 画布尺寸 / 选模块 → 选中模块 X/Y/W/H + 替换删除按钮 / 选元素 → 选中元素 + 文字/填充色/不透明度 / 或 + 图片）
- **T8f** textarea 长文本横向滚动条修复（JS 动态 scrollWidth → style.width）
- **T8g** 模块整体拖拽（一级选中后拖，批量平移子层）
- **T8l** 撤销/重做（editState 快照 + 500ms 防抖自动入栈，Cmd/Ctrl+Z + Shift+Z）
- 去掉画布浮层「替换/删除」按钮，改到右侧 property-panel「选中模块」section

两个硬骨头：

- **T7 字体导出丢失（4 轮修）**：根因链路是 Skia `matchFamilyStyle` 只按 family 字符串精确匹配，PSD 里 font 名是 PostScript 名（`FZLTDHJW--GB1-0`），前端下拉是自定义 family 名（`MeiTuan`）。中间还有 `isTextEdited` 短路条件漏掉 fontFamily/fontWeight，让修复代码根本没被执行。最终方案：服务端 fontkit 自动扫描所有 .ttf/.otf 的 PostScript 名 register，服务端维护 `FAMILY_WEIGHT_TO_PS` map 把前端 family 名解析成 PS 名。
- **T8h 画布被长文本推偏（5 轮修）**：试了 outer overflow:hidden / container overflow-auto→hidden / flex→absolute 居中 / flex ancestors min-w-0 min-h-0 / inner position:relative→absolute / contain:strict + overflow:clip，全部失败。最终根因：text 元素**自身**必须加 `maxWidth: cw - x` 和 `overflow: hidden`，`transform: scale()` 祖先 + 宽 `position:absolute` 子孙组合下祖先裁剪不生效。

下一步 T6 组件库（明日），计划见 `~/.claude/plans/delightful-booping-fountain.md` 的初稿（今天临睡前写给自己的 handoff，后来被 Harness 计划覆盖）。

关键决策：
- 只做 C 方案（后台上传 PSD 选 Group 打标），不做 B（另存为组件）
- tags 不分类
- 替换按比例 contain 缩放到目标模块 bbox
- 替换一次 undo 即回到原模块
- 替换按钮弹居中 modal
- 自动下拉下方模块 + 画布延伸（T6.6，可选后置）

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
