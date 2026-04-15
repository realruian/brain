---
tags:
  - harness
  - AI工程
  - Claude-Code
  - 参考
date: 2026-04-15
---

# Harness Engineering

## 一句话定义

Harness Engineering 是设计约束系统、反馈循环和运行环境，让 AI agent 可靠工作的工程学科。

核心公式：**Agent = Model + Harness**

模型是引擎，Harness 是底盘、刹车、方向盘和仪表盘。模型升级像换更大排量的引擎，Harness 改进像装刹车、加护栏、画车道线——前者决定速度上限，后者决定能不能安全上路。

## 为什么模型不是瓶颈

LangChain 的 coding agent 不换模型，仅改进 harness，就从 Terminal Bench 的 52.8% 跳到 66.5%，从 Top 30 进入 Top 5。

同一个 Claude 模型，给它清晰的规则和项目上下文 vs 什么都不给，输出质量天差地别。提升 AI 编码质量，最快的方式不是等下一代模型，而是改进你给它的环境。

## 四个核心模块

### 1. 约束（Constrain）— 限制它不能做什么

给 agent 划定边界，告诉它哪些事情绝对不能做。在 Claude Code 里有三种手段，从轻到重：

**① CLAUDE.md 规则**——在 `CLAUDE.md` 里写明禁止事项。比如项目里有些文件改了会出事，就明确告诉它不要碰：

```
IMPORTANT: 不要修改 prisma/migrations/ 下的任何文件，这些是已执行的数据库迁移。
IMPORTANT: 不要修改 .env.production，这是线上环境配置。
```

关键词 `IMPORTANT` 或 `YOU MUST` 可以提高遵守率，但不是 100%——agent 有时候还是会忘。

**② 权限模式**——Claude Code 有一个设置，控制 agent 每一步操作要不要经过你确认。不放心的时候用默认模式（它每次改文件、跑命令都会先问你），信任它的时候切到 auto-accept（让它自己跑，不用你一步步批准）。

**③ Hook 自动拦截**——Hook 是你提前写好的一段脚本，Claude Code 在特定时机会自动执行它。比如你可以设一个 Hook：agent 每次要删除文件之前，系统自动检查它要删的是不是重要文件，是的话直接阻止。跟 CLAUDE.md 的区别是：**CLAUDE.md 是"请求"agent 不要做，Hook 是"系统不让"它做**——前者约 80% 遵守率，后者 100%。

---

### 2. 告知（Inform）— 告诉它应该知道什么

给 agent 提供足够的上下文，让它理解项目是什么、应该怎么做。

**① CLAUDE.md**——最主要的告知手段。你要在一个项目里开始用 Claude Code，第一件事不是让 agent 写代码，而是先准备一份 `CLAUDE.md`。可以自己写，也可以用 `/init` 让 Claude Code 生成草稿再修改。一份基本的 `CLAUDE.md` 长这样：

```markdown
# MyApp

电商后台管理系统，Next.js + TypeScript。

## 常用命令

- 开发：`npm run dev`
- 构建：`npm run build`
- 类型检查：`npx tsc --noEmit`
- 测试单文件：`npm test -- path/to/file`

## 代码风格

- 使用 ES modules（import/export），不用 CommonJS（require）
- 组件用函数式 + hooks，不用 class

## 架构

- 状态管理：Zustand，store 文件在 src/stores/
- API 层：src/api/，所有请求走 fetchClient 封装
```

这样 agent 一进来就知道项目长什么样、该用什么风格写代码。

**② Skills（按需加载的知识）**——CLAUDE.md 里的内容每次对话都会加载，适合放常用信息。但有些知识只在特定场景才用到（比如部署流程、数据库操作规范），每次都加载就是浪费。Skills 是放在 `.claude/skills/` 目录下的独立文件，agent 在遇到相关任务时才会自动读取。把 CLAUDE.md 想象成新同事入职第一天要看的手册，Skills 是他遇到具体问题时翻的参考文档。

**③ 代码仓库本身**——agent 会读你项目里的代码、README、注释。代码组织得越清晰，agent 就越容易理解项目。反过来说，**agent 看不到的信息等于不存在**——你脑子里知道的决策，如果没写进项目里，agent 永远不会知道。

---

### 3. 验证（Verify）— 确认它做对了没

光告诉 agent "要做对"不够，你需要有手段检测它到底做对了没有。

**① CLAUDE.md 里要求它自查**——在 `CLAUDE.md` 里加一条：

```
YOU MUST: 每次修改代码后运行 npm run build 确认没有报错。
```

这样 agent 改完一段代码后会自己跑一次构建检查。如果报错了，它会看到错误信息并尝试修复——这就形成了一个自动的反馈循环。但跟约束一样，这还是"请求"，agent 偶尔会忘。

**② Hook 自动验证**——如果发现它有时候忘了跑检查，可以升级成 Hook。比如设一个 Hook：agent 每次编辑完文件，系统自动跑一次代码格式化或类型检查，不需要 agent "记得"，系统替它做了。这是验证模块最核心的手段——**不靠 agent 自觉，靠系统保证**。

**③ 测试**——让 agent 先写测试，再写实现。测试通过才算功能完成。如果 agent 改坏了已有功能，测试会立刻报错，agent 看到报错就会去修。测试就像一张安全网，兜住 agent 可能犯的错。

**核心认知：只约束不验证 = 没有约束。** 你告诉它"别犯错"没用，你得有手段检测到它犯了错。

---

### 4. 纠正（Correct）— 出错了怎么办

agent 一定会犯错。关键不是"如何避免一切错误"，而是"犯了错之后怎么让它不再犯"。纠正的重点在于**升级链路**——同样的错不应该犯第二次：

**① 对话里直接纠正**——你让 agent 生成一段代码，发现它用了你不想要的写法。你说："不要用 class 写法，用函数式写法。"它改了，这次对了。但这只解决了当前这一次对话。

**② 写进 CLAUDE.md 防重犯**——下次开一个新对话，agent 不记得上次你纠正过它。所以你把这条写进 `CLAUDE.md`：

```
组件用函数式写法，不用 class 写法。
```

这样每次新对话它都会读到这条规则。大部分时候管用，但偶尔还是会忘。

**③ 升级成 Hook 或测试**——比如你发现 agent 的代码格式总是不统一，CLAUDE.md 里写了规则但不是每次都遵守。于是你加一个 Hook：每次 agent 编辑文件，系统自动跑代码格式化工具——从"请求它做对"变成"系统保证做对"。或者加一个测试，agent 一写错，测试就报错，它就知道要改。

**核心认知：每踩一个坑，补一块砖。** 对话纠正 → 写进 CLAUDE.md → 升级成 Hook 或测试。Harness 就是这样一点一点长出来的。

## 如何开始

不需要一步到位。三步就能建立起基本的 harness：

1. **给项目写一个 CLAUDE.md**——先把项目结构、常用命令和编码规范写进去，让 agent 知道它在哪、该怎么做
2. **下次 agent 犯错，别只在对话里纠正**——想一下"我能加什么规则让它不再犯？"然后写进 CLAUDE.md
3. **发现 CLAUDE.md 写了它还是不听？**——考虑升级成 Hook，把"建议"变成"机制"

Harness 不是一次设计好的系统，而是在日常使用中一点一点积累出来的。用得越多，踩坑越多，harness 就越结实。

## 参考资源

- [Martin Fowler: Harness Engineering](https://martinfowler.com/articles/harness-engineering.html) — 最权威的概念框架
- [Red Hat: Structured Workflows](https://developers.redhat.com/articles/2026/04/07/harness-engineering-structured-workflows-ai-assisted-development) — 多仓库项目实操指南
- [HumanLayer: Skill Issue](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents) — Claude Code 专项，深入 Skills 和 Sub-agents
- [NxCode: Complete Guide](https://www.nxcode.io/resources/news/harness-engineering-complete-guide-ai-agent-codex-2026) — 全面介绍，含四大模块详解
- [awesome-harness-engineering](https://github.com/ai-boost/awesome-harness-engineering) — GitHub 资源合集
