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

---

## 下一步想做

- [ ] Writing 栏真正有内容（Obsidian Publish / Quartz / 或每篇一个外链）
- [ ] Col 3 排序机制考虑要不要改成按 ts 自动排（现在改数组位置容易忘）
- [ ] 移动端 logo 字母 tap 切主题的体验再验一下
- [ ] 收工时把踩坑沉淀回来到这份笔记
