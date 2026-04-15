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

给 agent 划定边界，告诉它哪些事情绝对不能做。

**在 Claude Code 里怎么做：**

- **CLAUDE.md 规则**：在项目根目录创建 `CLAUDE.md`，写明禁止事项
- **权限模式**：不确定 agent 会做什么时用默认模式（每步都要你确认），信任它时切到 auto-accept 让它自己跑
- **Hooks**：对于必须 100% 遵守的规则，用 Hook 自动拦截（CLAUDE.md 的遵守率约 80%，Hook 是 100%）

**场景举例：**

项目里有已经执行过的数据库迁移文件，改了就会出事。在 `CLAUDE.md` 里加一条：
```
IMPORTANT: 不要修改 prisma/migrations/ 下的任何文件，这些是已执行的数据库迁移。
```

再比如，不想让 agent 碰生产环境配置：
```
IMPORTANT: 不要修改 .env.production，这是生产环境配置，改错会导致线上事故。
```

关键词 `IMPORTANT` 或 `YOU MUST` 可以提高 agent 的遵守率。

---

### 2. 告知（Inform）— 告诉它应该知道什么

给 agent 提供足够的上下文，让它理解项目是什么、应该怎么做。

**在 Claude Code 里怎么做：**

- **CLAUDE.md**：最主要的告知手段，写项目结构、常用命令、技术选型
- **分层管理**：全局规则放 `~/.claude/CLAUDE.md`（跨项目通用），项目规则放项目根目录的 `CLAUDE.md`，偶尔用到的专业知识放 Skills（按需加载，不占日常上下文）
- **仓库本身**：README、代码注释、类型注解都是 agent 的信息来源

**场景举例：**

在一个项目里开始用 Claude Code 之前，先检查项目里有没有 `CLAUDE.md`。如果没有，先写一份，再让 agent 干活：

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
- 优先解构导入：`import { foo } from 'bar'`

## 架构

- 状态管理：Zustand，store 文件在 src/stores/
- API 层：src/api/，所有请求走 fetchClient 封装
- 路由：Next.js App Router，页面在 app/ 下
```

这样 agent 一进来就知道项目长什么样、该用什么风格写代码。

**核心认知：agent 看不到的信息等于不存在。** 你脑子里知道的架构决策，如果没写进仓库里，agent 永远不会知道。

---

### 3. 验证（Verify）— 确认它做对了没

光告诉 agent "要做对"不够，你需要有手段检测它到底做对了没有。

**在 Claude Code 里怎么做：**

- **CLAUDE.md 里要求跑检查**：让 agent 每次改完代码自己验证
- **Hook 自动验证**：用 `PostToolUse` Hook 在每次编辑后自动跑格式化或类型检查——不靠 agent "记得"，而是系统强制执行
- **测试驱动**：让 agent 先写测试，再写实现，测试通过才算完成

**场景举例：**

在 `CLAUDE.md` 里加：

```
YOU MUST: 每次修改代码后运行 npx tsc --noEmit 确认类型没有报错。
```

这样 agent 改完一段代码后会自己跑类型检查。如果报错了，它会看到错误信息并尝试修复——这就形成了一个自动的反馈循环。

如果发现它有时候忘了跑检查，可以升级成 Hook，在 `settings.json` 里配置：每次 agent 编辑文件后，系统自动执行类型检查，不需要 agent "自觉"。

**核心认知：只约束不验证 = 没有约束。** 你告诉它"别犯错"没用，你得有手段检测到它犯了错。

---

### 4. 纠正（Correct）— 出错了怎么办

agent 一定会犯错。关键不是"如何避免一切错误"，而是"犯了错之后怎么让它不再犯"。

**在 Claude Code 里怎么做：**

- **对话纠正**：直接在对话里告诉它"这样不对，应该这样"
- **持久化到 CLAUDE.md**：纠正完，把这条经验写进 CLAUDE.md，让每次新对话都知道
- **升级为机制**：如果写进 CLAUDE.md 了它还是偶尔犯，就升级成 Hook 或测试

**场景举例：**

你让 agent 写一个 React 组件，它写成了 class 风格。你说："不要用 class，用函数式组件 + hooks。"它改了，这次对了。

但下次新对话，它可能又写成 class。所以你把这条写进 `CLAUDE.md`：

```
组件用函数式 + hooks，不用 class。
```

后来你发现它的代码格式总是不统一，CLAUDE.md 里写了规则但不是每次都遵守。于是你加一个 Hook：每次 agent 编辑文件，系统自动跑 Prettier 格式化——从"请求它做对"变成"系统保证做对"。

**核心认知：每踩一个坑，补一块砖。** 一次性纠正 → 写进 CLAUDE.md → 遵守率不够就升级成 Hook 或测试。Harness 就是这样一点一点长出来的。

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
