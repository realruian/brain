---
tags: [项目, 个人, 个人站, 静态站, Vercel]
date: 2026-04-18
---
0418：
读 ~/Dev/Personal-website/CLAUDE.md 和 ~/Brain/01-Projects/personal-website.md， 看 plan 的活跃任务和最近 git log，告诉我从哪里继续

# Personal Website · tianruian.com

个人站 + 发布面板，部署在 `tianruian.com`。

代码仓库：`~/Dev/Personal-website`（GitHub: `realruian/personal-os` · private）

> 技术栈、架构硬约束、常用命令、Git 纪律见项目仓库的 CLAUDE.md

---

## 业务背景

想要一个随手能发想法 / 贴图的极简个人主页，Mac + 手机通用。拒绝传统博客的沉重（分类、标签、模板），拒绝 Twitter / 小红书的算法噪音和审查。最终形态：自托管静态站 + 自建轻量发布面板，零后端，域名自有。

---

## 关键决策

- **技术栈：纯 HTML + CSS + JS，无构建工具** — 能跑就能部署，任何时候打开都能改代码。dany.works 原站单文件内联 CSS/JS，这里拆得稍清楚（`js/` 目录 + 独立 `styles.css`）但不引 Vite / React
- **CMS 方案：GitHub Contents API + Vercel 自动部署** — admin.html 直接调 GitHub API 读写 `content/data.json` 和上传图片。发完一个 commit → Vercel ~90s 自动部署。零后端、零数据库、commit 历史=版本历史
- **认证：fine-grained PAT，本地 localStorage** — token 限定 `personal-os` repo + Contents 读写。泄露影响面=写一个 repo，不是整个 GitHub 账号
- **视觉 1:1 参考 dany.works** — Fragment Mono 字体、三列 1fr 1fr 2fr grid、CSS Houdini `@property` 注册的四个颜色 token、五种模式（day/night/leaves/midnight/rain）+ chaos 彩蛋（Matter.js 物理坍塌）、HalftoneDots shader 图片滤镜
- **氛围素材：直接用 dany.works 的 mp4/mp3** — private repo 保护，公开发布前需换成自有或免费素材
- **Col 2 / Col 3 排序语义不同** — Col 2 thoughts 按 ts 降序 + featured 置顶；Col 3 images **按数组位置**渲染（这是个容易误解的坑）

---

## 已知问题 / 坑点

- **Col 3 排序误解**：改 ts 以为能让图片置顶，实际按 `data.json.images[]` 数组位置渲染。要调整必须改数组位置
- **Vercel 项目原本是 Next.js**：force push 新代码后 build 失败（没有 `pages/` 或 `app/`）。必须去 Settings → Framework Preset 改成 Other
- **远端 repo 搞错**：`tianruian.com` 实际接 `personal-os`，曾误推到 `ai-personal-site` 浪费半小时。推之前 `git remote -v` 对照 Vercel Settings → Git
- **Shader 首屏延迟**：HalftoneDots shader 走 esm.sh CDN，首次加载几百 KB + WebGL 编译，会看到原图清晰态再"粘"上点阵。已加 `<link rel="modulepreload">` + CSS 点阵占位双重优化，仍然保留和 dany 原站一致的~500ms 延迟
- **Admin 发布产生远端 commit**：本地再 push 前必须 `git pull --rebase`，否则会 rejected
- **iPhone Safari autoplay**：音频不能 autoplay，视频必须 muted + playsinline；首次用户交互后再 play 音频（bootstrapLeavesAudio）
- **浏览器 keychain 缓存 GitHub 旧凭证**：push 时报 401 没弹输密码窗，用 `git credential-osxkeychain erase` 清掉再推
- **fine-grained PAT 的 Repository access 必须和 `admin.js` REPO_NAME 同步**：token 权限给对了但 repo 范围错，发布会 403 "Resource not accessible by personal access token"。改范围后同一串 token 立即生效，不用重新生成
- **"featured 置顶" 不要留在默认内容上**：Claude Design 那条因为最早标了 featured，一直钉在最顶，新发的条目都被压在下面，看起来"顺序很乱"。featured 是临时置顶用，默认按 ts 倒序即可
- **~~Col 3 图片刷新时 flicker~~（2026-04-19 已解决）**：真凶不是 box 几何，是 `data-shader-init` 标志被太早设了 —— shader-init=1 在 React mount + WebGL 编译之前就触发，CSS `:not()::after` 占位提前让位，露出 img 原图到 shader 接管之间的视觉切换。修复：标志移到 `root.render` + double RAF 之后才设，防重复 init 用内部 `_shaderStarted` flag 解耦。本地一直丝滑是因为本地 RTT ~0ms，race window 太短人眼看不到；线上 ~500ms window 才显形。**不是 Vercel 性能不足，是物理网络延迟**
- **盲改教训**：没有精确数据时不要连续改同一个文件 6 次。每次改之前应该先用 ResizeObserver / Performance 等工具拿到"问题发生那一帧"的真实状态。没数据的修改 = 在概率分布里随机抽样，6 次抽不中就是 6 次浪费
- **诊断时序 race 不能只看 layout**：之前 6 次失败全在 layout 维度（aspect-ratio / contain / padding-bottom）打转。`performance.getEntriesByType('layout-shift')` 一直是空数组本来就该警觉 —— box 没动 ≠ 没 flicker，可能是像素层面的视觉切换。排查工具应该并行：`getEntriesByType('resource')` 看资源时序、`drawImage + getImageData` 验证 img 像素 vs 屏幕像素、截屏看实际渲染

---

## 进展记录

### 2026-04-17 / 18 · 从零到上线 + 发布面板

**Phase 1-2**：站点搭建 + 部署
- 参考 dany.works 1:1 复刻 HTML/CSS/JS（DESIGN.md 9 章节规范先行）
- 接入域名 `tianruian.com`（Vercel 连 GitHub `realruian/personal-os`）
- 内容源 `content/data.json`（thoughts + images 两组）

**Phase 2**：admin 发布面板
- `admin.html` + `js/admin.js` + `styles-admin.css`
- GitHub Contents API 直接 PUT 图片到 `assets/thoughts/` + 追加条目到 `data.json`
- token 存 localStorage，Mac / 手机通用

**Phase 3**：打磨
- 3.1 删除 / 编辑已发条目（manage 面板）
- 3.2 photo 模式独立发图 / 画廊
- 3.3 iOS 键盘遮挡修复（VisualViewport API + sticky actions）
- 3.4 自动翻译（Anthropic API + `anthropic-dangerous-direct-browser-access`）
- 3.5–3.7 小打磨：howto 去边框、shader 占位、默认夏夜模式

**Phase 4**（晚上收工前）：视觉与性能微调
- 点击图片全屏 lightbox（Esc / 点背景关闭）
- Col 3 图片统一 3:2 长方形 + object-fit cover（正方形占屏过多问题）
- shader hover 淡出 220ms → 700ms（更舒缓）
- Col 3 图片上下间距 24px，和左侧分割线 padding 等宽
- 滚轮路由简化：鼠标不在任一列时只滚 col2（不再接替 col3）
- intro 多行层级：名字 14px 主色 + 现职/过往 12px 淡化
- Col 3 排序修正：误以为按 ts，实际按数组位置
- 去掉 Claude Design 的 featured，让一切按时间倒序
- 去掉空的 Writing / Lab section（没内容时不占位）
- forest.mp3 压缩 1.9MB → 1.5MB
- Harness 补救：建项目 CLAUDE.md / Obsidian 笔记 / 登记 Brain/CLAUDE.md / plan 瘦身 560+ → 60 行

**Phase 5**（深夜翻车）：防御加固 + flicker 修复未果
- admin.js 加 escapeHtml 防 XSS；app.js renderCol2 / renderImages 外套 try/catch 防单条崩整列
- 压缩 forest.mp3 64kbps（首屏流量优化）；去掉空的 Writing / Lab section
- 追加"刷新时图片变扁 flicker"修复尝试 **6 次全败**（全在 layout 维度打转：aspect-ratio / contain / padding-bottom / opacity 等）
- Console `getBoundingClientRect()` 诊断证明稳定态 `.img-wrap` ratio=1.500 一直正确，变形只在刷新一帧内
- 最终 `git checkout ea96ee9 -- styles.css index.html js/app.js` 回滚所有失败尝试
- 最大教训：**无精确数据就不要连续改 6 次**。每次改前应先用 ResizeObserver / Performance 拿到"问题那一帧"的真实状态

### 2026-04-19 · flicker 真凶定位 + 一行修复

- 用 Chrome MCP 在线上跑全套诊断：`performance.getEntriesByType('layout-shift')` 返回空数组、ResizeObserver 在 src 重置时零回调 —— 证实 **box 几何完全稳定，flicker 不是 layout 问题**
- 用 `drawImage + getImageData` 采样 img 像素：彩色（RGB diff 16.8）；截屏看屏幕：黑白 halftone —— 证实 shader 在 img 之上覆盖渲染
- 读 `js/shaders.js` 找到真凶：`wrap.dataset.shaderInit = '1'` 在 line 24 就设了，但 React mount + WebGL 编译要到 line 37 之后才完成。CSS `:not([data-shader-init="1"])::after` 占位**提前 200-600ms 让位**，露出原图 → halftone 的视觉切换窗口
- 修复：标志位移到 `root.render` + double RAF 之后；防重复 init 改用内部 `_shaderStarted` flag 解耦（commit `1b861ab`）
- 推线上验证：丝滑，flicker 完全消失，达到 dany.works 同等水准
- **关键教训**：本地 RTT ~0ms 时 race window <10ms 看不见，线上 ~500ms 看得很清楚。"本地没事 → 线上有事"几乎一定是物理网络延迟，不是 Vercel 性能问题
- **诊断方法学补充**：layout-shift entries 空数组就该立刻切到像素 / 时序维度，不要在 layout 维度死磕

---

## 下一步想做

- [ ] Writing 栏真正有内容（Obsidian Publish / Quartz / 或每篇一个外链）
- [ ] Col 3 排序机制考虑要不要改成按 ts 自动排（现在改数组位置容易忘）
- [ ] 移动端 logo 字母 tap 切主题的体验再验一下
- [ ] 收工时把踩坑沉淀回来到这份笔记
