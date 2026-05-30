# 全局规则

CLAUDE.md 编写规范见 ~/Brain/02-Areas/Harness/CLAUDE.MD 编写指南.md（需要时按路径读取）

## 语言规则

IMPORTANT: 所有回复和代码注释使用中文。

## 验证规则

IMPORTANT: 每次修改代码后，必须运行对应项目的验证命令确认没有破坏：

- TypeScript 项目：`npx tsc --noEmit`
- 有测试的项目：运行受影响文件的单测，不要跑全量
- 有 lint 的项目：`npm run lint` 或等效命令
- 构建类项目：`npm run build` 确认产物正常

验证失败时立即修复并重新验证，不要跳过验证直接交付。

## 纠正规则

YOU MUST: 犯错后（类型错误、误删代码、用错 API、遗漏边界等），修复完必须：

1. 判断该错误是否可能再犯
2. 如果是，把防范规则写入对应层级的 CLAUDE.md：
   - 项目通用 → 项目根目录 `CLAUDE.md`
   - 个人习惯 → `~/.claude/CLAUDE.md`（本文件）
3. 规则写法：一行说清「不要做 X」或「必须做 Y」+ 原因

<!-- 以下为从错误中积累的规则 -->

## 经验教训

### 标志位双重职责要拆分

YOU MUST: 当一个标志（dataset 属性 / 类名 / 状态字段）同时承担"防重复"和"触发 UI 状态"两个职责时，必须拆成两个独立 flag。

- 防重复 flag 应该**早设**（进入函数立刻设，避免并发重入）
- UI 状态 flag 应该**晚设**（异步流程真正完成才设，避免 UI 提前切换）
- 合二为一 → 必然两难：早设 UI 闪、晚设并发重入

实例：personal-website 的 `data-shader-init` 同时管 shader 防重复和 CSS 占位让位，早设导致占位提前消失，露出 200-600ms race window 看到 flicker。修复用内部 `_shaderStarted` 做防重复，`data-shader-init` 留给 UI 状态。

### 诊断时序 race 不要只看 layout 维度

YOU MUST: 调试 "刷新闪一下" 这类视觉问题时，第一步必须并行收集多维度数据，不要在 layout 维度死磕：

- `performance.getEntriesByType('layout-shift')` 空数组 = box 几何没动，flicker 一定在像素 / 时序维度
- `performance.getEntriesByType('resource')` 看资源加载时刻
- `drawImage + getImageData` 验证 DOM 元素的像素 vs 屏幕渲染像素是否一致
- 截屏看实际渲染（屏幕看到的可能和 DOM/CSS 计算值完全不同）

"本地丝滑、线上 flicker" 几乎一定是网络 RTT 把 race window 从 ~0ms 拉到几百 ms，**不是远程服务器性能问题**。本地 loopback 把所有 race 都压平了，到了真实网络才暴露时序 bug。

### CSS 嵌套圆角必须遵守同心圆公式

YOU MUST: 当嵌套布局的外层和内层都有 border-radius 时，必须满足 **外圆角 = 内圆角 + padding**，否则两层圆角不同心、视觉"凹陷"或"歪斜"。

- 公式：外圆 = 内圆 + 二者之间的 padding（反推：内圆 = 外圆 - padding）
- 这是 iOS 的 concentric corners 规范，Figma "smart corner radius" 也基于此
- UI 上感觉两层卡片"对不齐"时，第一时间检查这个公式

实例：lollipop-frontend Feature Detail 3 紫色卡外圆 48 + padding 20 + 内白卡 14 → 不同心。把内圆 14 改 28（= 48-20），白卡和紫卡圆角完美同心。

### CSS clip-path 会裁切 box-shadow

IMPORTANT: 给元素设 `clip-path` 后，元素的 `box-shadow` 会被一起裁掉看不见——CSS 标准就这么规定。要保留投影必须改用 `borderRadius + overflow:hidden`，或在外层包一个带 shadow 的 div。

- clip-path 裁切元素的所有渲染区域（包括 box-shadow）
- borderRadius + overflow:hidden 的 shadow 不被裁（shadow 在元素几何边界外正常渲染）
- 第三方案：filter: drop-shadow() 不被 clip-path 裁，但视觉上略不同（drop-shadow 跟随 alpha 通道，box-shadow 跟随 box）

实例：lollipop-frontend feat_jd 卡片用 clipPath inset 切掉 SVG 边距留白，写了 box-shadow 显示不出来。改 borderRadius + overflow:hidden 后投影正常。

### CSS background-clip: text 的渐变范围 = 元素宽度，不是文字宽度

IMPORTANT: 做渐变文字（`background: linear-gradient` + `background-clip: text` + `WebkitTextFillColor: transparent`）时，渐变 stops 是基于**元素 background 宽度**算的，不是文字宽度。如果元素比文字宽（典型场景：`textAlign: center` 的全宽 `<h2>`），渐变会落在文字之外，文字只露出渐变中央一小段——常常表现为"渐变看不见"。

- 排查方法：先确认 background 是否生效（给元素临时加底色），再确认文字是否落在渐变范围内
- 修复方法 1：给元素加 `display: inline-block` 让 width = fit-content，background 贴合文字宽度
- 修复方法 2：调整 gradient stops 让关键过渡点落在文字所在百分比

实例：lollipop-frontend "Lollipop 团队"渐变 0-70% 黑、70-100% 灰，全宽 h2 textAlign center 让文字落在 background 40-60% 区域，全是黑色看不到渐变。加 display: inline-block + 父级 textAlign center 后 background 贴合文字宽度，渐变正确显示。

### Bash 工具 cwd 跨调用持久，不要无脑加 cd 前缀

YOU MUST: Bash 工具的 cwd 在多次工具调用之间**持久保留**（shell 进程消失但 harness 维护 cwd），所以连续两次 `cd <relative>` 同一目录第二次必然失败。默认用绝对路径，不要在每次调用都 `cd <子目录> &&`。

- 第一次 `cd frontend && cmd` 后，下一次工具调用的 cwd 已经在 frontend；再 `cd frontend` 会变成 `frontend/frontend` 报 "no such file or directory"
- 给 git / 多文件 / 跨子目录的命令一律用**绝对路径**（`cd /abs/path && ...` 或直接 `git -C /abs/path ...`）一步到位
- 同一个子目录里要跑多步验证，串在一次 Bash 调用内完成而不是多次调用
- 这正是 Bash 工具描述强调的："Try to maintain your current working directory throughout the session by using absolute paths and avoiding usage of cd"

实例：Lollipop_Test_Tian 仓 commit 流程中，跑完 `cd frontend && npm run typecheck` 后又写 `cd frontend && npm run lint` → 路径错；接着 `git add 'frontend/...'` 也以为还在根目录但 cwd 已经在 frontend，被解析成 `frontend/frontend/...` 彻底报 "could not open directory"。改用 `cd /Users/tianruian/Dev/Lollipop_Test_Tian && ...` 绝对路径一次成功。

### 浏览器"自动行为 API"的最终状态不可预测，不要基于它做位置预计算

IMPORTANT: 不要假设 `scrollIntoView` / 自动 focus / 自动 layout 等"浏览器代你做"的 API 一定会把元素送到你"以为的最终位置"。这些 API 的实际行为受元素可见性、scroll 容器、边界 clamp、浏览器实现差异等多重因素影响——经常不动、滚不到位、或滚到了别的位置——你基于"假设最终位置"算的几何（spotlight、tooltip、动画起点）会和实际渲染严重错位。

- 需要"把 target 滚到视口某 y"这种精确效果时，用可控底层 API：`window.scrollTo({ top: explicitY, behavior: 'smooth' })`，**给定明确的 scrollY 数值**
- 自己算 scrollDelta：`rect.top - idealFinalTop`
- 自己 clamp 到合法范围：`maxScrollY = scrollHeight - innerHeight`，`targetScrollY = clamp(scrollY + scrollDelta, 0, maxScrollY)`
- 用 clamp 后的 `actualScrollDelta = targetScrollY - scrollY` 反推 target 真实最终视口位置：`finalTargetTop = rect.top - actualScrollDelta`，再做后续位置计算
- `scrollIntoView` 这类 API 适合"最佳努力"语义（无障碍、focus 跟随），不适合作为"几何精确依据"

实例：lollipop-frontend OnboardingTour 切 step 时用 `el.scrollIntoView({block:'center'})` + 假设 target 最终居中 `(innerHeight - h)/2` 算 spotlight final 位置。结果：step1 的 chat container 完全可见，浏览器不滚 → spotlight 飘到屏幕中央 vs target 在原位 → 错位 200+px。改用 `window.scrollTo` 给定明确 targetScrollY + 反推真实 finalTargetTop（考虑 clamp）后彻底解决。

### 改项目设计规范前必须读完 DESIGN.md 修订日志

YOU MUST: 在项目里新增/修改设计规范（颜色、间距、组件状态、a11y 等）前，必须先读完该项目 DESIGN.md / styleguide 文件末尾的"修订日志"段。**项目可能已经主动驳回了某条业界共识**，盲目照搬调研工具（WebSearch / 调研 agent）返回的"业界主流"做法会引入项目已经否决的写法。

- 调研工具返回的是"业界普遍这样做"，不代表"本项目应该这样做"
- 项目修订日志里的 (a)(b)(c) ... 每条都包含"为什么这么改"+"为什么删了原规则"，这些理由是项目调性 / 用户具体反馈 / 实际代码现状的产物，**比业界共识对本项目更权威**
- 如果项目修订和业界共识冲突，**默认遵循项目修订**；要推翻必须给出超过原修订理由的新证据（实际投诉、用户反馈、新场景），不能只说"业界都这样"

实例：Lollipop_Test_Tian 统一关闭按钮规范时，调研返回"icon button 必须 focus-visible ring"业界共识 → 直接给 5 处按钮加 `focus-visible:ring-*` → 撞上项目 DESIGN.md (o) 修订"已删除 focus ring 规范，原因是 3px ring 在白底极简调性下视觉过重（用户反馈"有病"）+ 全站从未落地"。立即回退 5 处 ring，按 (o) 决议改用浏览器原生 outline 兜底。

### git commit 默认一锅端 staged 区；reset 之前先看 reflog 数清 N

YOU MUST: `git commit` 把**当前所有 staged 文件**一并提交，不只是你刚 `git add` 的那批。如果 staged 区里早就有别人 / 早先未 commit 的文件，你新 add + commit 会把它们一锅端进同一个 commit——message 描述和实际内容严重脱节。

预防：
- 关键 commit 前先跑 `git diff --cached --stat` 确认 staged 全貌
- 或用 `git commit -- <path>...` 显式限定本次提交的路径，git 只 commit staged 区里匹配这些路径的部分（比"先 add 再裸 commit"更精准）
- 多实例并发场景（多个 Claude 实例同跑、IDE auto-stage、pre-commit hook 自动 stage）下，"只有我在改"是错觉，看不见的 staged 文件可能存在

修复（已经误 commit 了）：
- `git reset --soft HEAD~N` 把 commit 退回 staged。**本地未 push 时不是 destructive 操作**（working tree 不动，index 内容保留，reflog 能找回原 commit SHA），可放心做
- N 必须用 `git reflog` 数，**不要用 `git log`**：log 只显示当前分支线性历史，reflog 显示 HEAD 每一步实际移动（包括别的实例插入的 commit）。本以为 `HEAD~2` = 我自己的两个 commit，结果中间夹了并行实例的一个 commit，差点漏 reset 一步
- reset 完用 `git restore --staged <path>...` 把不该 staged 的文件退回 unstaged，再分组精准 commit；对方原 commit 想保留时，记得用 `git log <sha> -1 --format=%B` 拿回 message 原文复用

实例：Lollipop_Test_Tian 给 sample 清理做 commit 时，用户预先 staged 了 8 个 interview 相关 WIP 文件 + 并行 Claude 实例又 commit 了一次"logo 本地化"（我看不到，HEAD 静悄悄推进了一格）。我 `git add 4 文件 && git commit` 把 staged 区里所有东西一锅端进了"sample 清理" commit（实际 12 files changed，message 只写 sample）。修复：`git reflog` 数出实际偏移 N=3 → `reset --soft HEAD~3` → `restore --staged` 8 个 WIP + 所有 logo 工作 → 分 2 个精准 commit（我的 sample 清理 5 文件 / 重 commit 并行实例的 logo 工作，原 message 完整保留）。

### `git commit` 默认裸跑，永远不加 `--no-verify`

YOU MUST: 构造 `git commit` 命令时**默认不加 `--no-verify`**，无论项目当前有没有 pre-commit hook、无论你觉得加上"更稳"还是"反正没影响"。本文件顶部"Git Safety Protocol"已经明令禁止跳 hook，习惯性加上就是直接违规。

- 即使 `ls .husky/` 看到空目录、`.git/hooks/` 只有 sample，也**不构成加 `--no-verify` 的理由**——hook 是动态的（同事下次提交可能就接上了 husky），你看到的是当前快照
- 习惯一旦养成，迁移到有真 hook 的项目时会一锅端绕过 lint / 类型检查 / 测试，把脏代码合进去
- 如果 hook 真的失败，按"Git Safety Protocol"流程走：**fix issue → re-stage → 创建新 commit**，绝不用 `--no-verify` 绕过
- 唯一例外：用户在当前会话里**明确**说"加 --no-verify"或"跳过 hook"

实例：Lollipop_Test_Tian 做"只合后端"的 merge commit 时，我擅自加 `--no-verify` 想"避免任何 hook 干扰"。事后查项目根本没 husky / 真实 hook，flag 形同虚设——但全局规则被违反，且若养成习惯下次有 hook 的项目就会出事。修复：以后所有 `git commit` 命令裸 commit。

### 中文文案里有 ASCII 双引号 → 整个 string literal 一律用 backtick

YOU MUST: 写 JS/TS 中含中文文案的字符串时，**只要文案里有任何 ASCII 双引号 `"`，整个 string literal 必须用 backtick `` ` ` `` 包**，绝不能用 ASCII `"..."`。中文场景的引号 90% 是 ASCII `"` 而不是 CJK 的 `""`，肉眼几乎区分不出，但 parser 会把第一个内嵌 `"` 当成字符串结束符——后面所有字符变成野生 token，TS 报一堆 `',' expected` / `':' expected` 像走错路。

- 优先级：backtick > 单引号 `'...'` > 双引号 `"..."`——中文 string 默认 backtick，零代价
- JSX **attribute prop**：`prop="..."` 里的 `...` 含 ASCII " → 改 `prop={`...`}`（注意是 `{}` 包 backtick template literal）
- JSX **文本节点**（标签之间的字面文本）不受影响——ASCII `"` 在 JSX text 里被当字面字符，可以裸写
- 数组 / 对象的字段值：`feedback: "..."` 含 ASCII " → 改 `feedback: \`...\``
- 反向：CJK 全角 `""` 在 ASCII `"` string 里是正常 Unicode 字符，**不会**触发 bug——所以另一条出路是把文案里的 `"` 全替换成 `""`。但这要求你先识别"这是中文文案"且改原始数据，比改包裹符更脆弱
- 写完含中文的 string 立刻自检一遍引号——比写完跑 tsc 看错再回查省事

实例：design-md-demo 14 页 demo 里同一个错犯了至少 4 次：resume/edit 的 `placeholder="直接对话：例如"帮我把..."`、resume/audit-demo 的 4 条 issue feedback、report 的 4 条 round feedback + 1 个 hint prop、Landing 的 2 个 FeatureCard body prop。每次都是 ASCII `"` 中文场景里出现内嵌 ASCII `"`，tsc 报 `error TS1005: ',' expected` 一脸懵。修复方法一律相同：把外层 string 从 `"..."` 改 `` `...` `` 或 `{`...`}`。沉淀这条规则后：写中文文案默认用 backtick，省一道返工。
