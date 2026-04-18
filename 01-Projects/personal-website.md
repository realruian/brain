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
- **~~Col 3 图片刷新时 flicker~~（2026-04-18 已解决）**：真凶不是 box 几何，是 `data-shader-init` 标志被太早设了 —— shader-init=1 在 React mount + WebGL 编译之前就触发，CSS `:not()::after` 占位提前让位，露出 img 原图到 shader 接管之间的视觉切换。修复：标志移到 `root.render` + double RAF 之后才设，防重复 init 用内部 `_shaderStarted` flag 解耦。本地一直丝滑是因为本地 RTT ~0ms，race window 太短人眼看不到；线上 ~500ms window 才显形。**不是 Vercel 性能不足，是物理网络延迟**
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

### 2026-04-18（凌晨续场）· flicker 真凶定位 + 一行修复

- 用 Chrome MCP 在线上跑全套诊断：`performance.getEntriesByType('layout-shift')` 返回空数组、ResizeObserver 在 src 重置时零回调 —— 证实 **box 几何完全稳定，flicker 不是 layout 问题**
- 用 `drawImage + getImageData` 采样 img 像素：彩色（RGB diff 16.8）；截屏看屏幕：黑白 halftone —— 证实 shader 在 img 之上覆盖渲染
- 读 `js/shaders.js` 找到真凶：`wrap.dataset.shaderInit = '1'` 在 line 24 就设了，但 React mount + WebGL 编译要到 line 37 之后才完成。CSS `:not([data-shader-init="1"])::after` 占位**提前 200-600ms 让位**，露出原图 → halftone 的视觉切换窗口
- 修复：标志位移到 `root.render` + double RAF 之后；防重复 init 改用内部 `_shaderStarted` flag 解耦（commit `1b861ab`）
- 推线上验证：丝滑，flicker 完全消失，达到 dany.works 同等水准
- **关键教训**：本地 RTT ~0ms 时 race window <10ms 看不见，线上 ~500ms 看得很清楚。"本地没事 → 线上有事"几乎一定是物理网络延迟，不是 Vercel 性能问题
- **诊断方法学补充**：layout-shift entries 空数组就该立刻切到像素 / 时序维度，不要在 layout 维度死磕

### 2026-04-18（凌晨）· Writing section 上线（前后端一把梭）

- 4 月 18 删过的 Writing / Lab 空 section 复活成 Writing，链 Col 1 公众号文章列表（不接 Obsidian Publish / Quartz，直接外链最轻）
- **数据结构**：`data.json.writing[] = { type: 'writing', ts, title_zh, title_en?, url }`，和 thoughts 一致的双语 fallback
- **前台**：`renderWriting` 按 ts 倒序 + slice(0,5)，最多展示 5 篇；改 ts 即可调顺序（和 Col 3 数组位置不同）
- **Admin**：第三个 tab `writing · 文章`，字段是标题中英 + URL；写时无图片上传 / 无 featured / 无翻译；manage 面板支持 writing 的 edit/delete
- 前台改完截屏立刻验证视觉对，admin 改完用 chrome 临时绕过 auth 截屏看 tab 切换 + 字段对（commit `4e9894a`）
- 顺手删了 i18n.js 里 `renderLinks('lab-links', dict.lab)` 死代码（lab 字段早删了）
- **方法学**：分两批做 + 每批末尾 `node -c` & `python3 -c json` & 浏览器查询验证，没出过错；ScheduleWakeup 自动回头检查上线效果

### 2026-04-18（下半天）· logo I cycle 修 + 双端文案 + 安全加固 + 首屏优化 + 图片压缩

密度很大一天，6 个 commit 一串连推：

**Logo 移动端 tap 体验收尾**
- 修 `_summerCycle` / `_nightCycle` 初始化问题：默认态 `leaves` 在身上但 cycle=0，首次 tap I 走错分支看起来没反应。改成从 `body.classList` 实时推断当前态，删掉两个状态变量 —— 键鼠盘混用也不会错位（commit `a028c57`）

**howto 文案桌面 / 移动分两份**
- `i18n.js` 加 `howto_mobile` 中英双份，`applyI18n` 按 `matchMedia('(max-width: 768px)')` 选；窗口 resize 跨阈值自动重刷。桌面显示 D/N/S/M/R/C 键盘说明，移动端换成 T/I/A/N tap logo 说明（commit `40cad55`）

**代码层安全加固（P0 + P1）**
- 火山引擎买的域名本身没问题（字节系正规），真风险在账户 + 代码层
- P0 新增 `vercel.json`：HSTS(2y,includeSubDomains,**不 preload 保可逆**) / X-Content-Type-Options / X-Frame-Options:DENY / Referrer-Policy / Permissions-Policy / admin.html X-Robots-Tag。curl -I 六项全上线（commit `21cdf56`）
- P1 锁 esm.sh CDN：`index.html:20-22` + `js/shaders.js:5-7` 共 6 处 `@18` → `@18.3.1`。防未来 esm.sh 自动滚到被投毒的新版本（commit `b4774ee`）
- 放弃 SRI 和自托管：esm.sh `vary: User-Agent` 导致不同浏览器拿不同 transform 产物，SRI hash 必 mismatch 让 shader 挂；自托管要递归镜像 re-export 链，复杂易坏
- 放弃 admin pre-gate：F12 可绕，价值低，发布体验反而变差

**首屏 shader 占位改 SVG hex pattern**
- 原 `radial-gradient` square 网格和 shader 的 hex 网格视觉差异大。改 SVG inline data URL，tile 6×10.39 + r=0.6 + 点色 `#2B2B2B` 硬编码匹配 shader `colorFront`
- 迭代三次找到合适密度：10×17.32(r=1.2) 太稀 → 6×10.39(r=1.2) 太大 → 6×10.39(r=0.6) 刚好（commits `82a840c` / `9f22307` / `f28fa4f`）
- 本地看不出差别（shader 秒起，占位窗口太短）**验收窗口在线上**（~500ms）。和之前 flicker 教训一脉相承：本地 RTT ~0ms 看不到，线上才显形

**图片压缩双轨**
- **新图自动压缩**：`admin.js` 加 `compressImage(file)`，Canvas resize 到 2000px + `toBlob('image/webp', 0.85)`，不支持 WebP 回退 JPEG，GIF 原样保留。手机 3-5MB 原图 → 300-500KB（commit `002d0d1`）
- **历史图片批量清理**：选方案 A 最保守 —— sips resize 2000px + quality 80 重编码 JPEG，**保留 .jpg 扩展名不动 `data.json`**（零 url 迁移风险）。8 张 jpg 8.4MB → 3.6MB（-57%），大图单张降 71-75%。备份 tag `backup-before-img-compress` 留本地（commit `04d5c8a`）
- 方案 B（cwebp 转 WebP + 改 data.json）放弃：扩展名和 json 字段同步的出错面大，用户明确"千万不能导致网页出问题"的红线决定优先保守

**生产站红线法则（沉淀到项目 CLAUDE.md）**
- `tianruian.com` 线上站，改动优先级 **安全 > 可用性 > 完美度**
- 不做"理论更好但风险高"的改动（SRI / 自托管 / admin gate / HSTS preload / cwebp 改 json）
- 选最小有效改动（CDN 版本锁、历史图片压缩保留扩展名、SVG hex 不动时序）
- 持久化决策（HSTS preload、force push、DNS 切换）先想回滚路径，想不清就不做

---

## 下一步想做

- [x] ~~Writing 栏真正有内容~~（2026-04-18 凌晨完成，admin 可加新文章）
- [x] ~~移动端 logo 字母 tap 切主题的体验再验一下~~（2026-04-18 下半天修了 I cycle 错位 bug + 加了移动端 howto 文案）
- [x] ~~收工时把踩坑沉淀回来到这份笔记~~（2026-04-18 下半天完成，harness 本条 + 项目 CLAUDE.md 更新了安全 & CDN 章节、图片压缩章节、生产站红线教训）
- [ ] Col 3 排序机制考虑要不要改成按 ts 自动排（现在改数组位置容易忘）
- [ ] 观察新 SVG hex 占位线上效果是否还有切换感；不够彻底考虑做 shader ready 时交叉淡入（但要碰 shader-init 时序，风险高）
- [ ] 观察 admin 自动压缩在真机实际发图时是否稳定（iOS Safari Canvas toBlob WebP 兼容性、HEIC decode 兼容）
- [ ] 几天后观察稳定后删本地备份 tag：`git tag -d backup-before-img-compress`
