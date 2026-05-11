---
tags:
  - 公众号
  - 草稿
  - harness
date: 2026-05-11
---

# 把 Harness 拉回个人开发者：一个反企业叙事的定义

## 上次开新项目，我花了 4 分钟

输入 `/new-project`，Claude 问我四件事——项目名、一句话描述、技术栈、目录路径——回答完，三件事自动发生：

- 项目根目录生成一份 CLAUDE.md（不超过 100 行的项目说明书）
- `~/Brain/01-Projects/<项目名>.md` 建好（Obsidian 项目笔记空骨架）
- `~/Brain/CLAUDE.md` 的"当前项目"章节自动加一行

4 分钟。然后我开始写代码。

半年前我开新项目要花 40 分钟。一半时间在跟 Claude 解释项目背景——"这个项目是干嘛的、技术栈是啥、不要动哪些文件"——另一半在翻别的项目复制 CLAUDE.md 然后改改。

中间的 36 分钟是怎么省下来的？

**这半年我搭了一套自己的 harness。**

这篇文章想讲两件事：

第一，**harness 这个词在 2026 年已经被企业叙事占领了**——OpenAI、ThoughtWorks、社区刷屏的 `deusyu/harness-engineering`，所有讨论的主语都不是"一个人"。

第二，作为个人开发者，你需要一个不一样的 harness 定义。我这篇文章给一个我自己用了半年的版本。

---

## 我读了四派 harness，没一派把我当人

过去半年关于 harness engineering 的讨论，能清楚分出四派：

| 派别 | 代表 | 想象的用户 |
|------|------|----------|
| 方法论派 | Birgitta Böckeler / ThoughtWorks | 工程团队（咨询客户） |
| 基础设施派 | OpenAI Codex | 企业 + 大型 codebase |
| 平台工具派 | Anthropic Claude Code | 产品用户 |
| 综合整理派 | deusyu / awesome-list | 不明 |

我一篇一篇读下来，越读越觉得不对——

**这些人想象的开发者，都不是我。**

Birgitta 在咨询公司，她想的是大型团队怎么把 agent 工作流标准化；OpenAI Codex 团队拿 agent 写了一百万行代码、零行人类手写——他们说的"harness"是为这种规模设计的；deusyu 那篇中文整理刷屏，但底层叙事基本就是 OpenAI 派的翻译。

我读到 deusyu 那篇里的一条原则时，直接卧槽——

> **"Agent Readability over Human Readability"** —— 优化机器可读，不优化人可读。

这条不是不同意，是**直接错了**。

我才是项目的长期 maintainer。Claude 是临时工——它每次会话从零开始，读不读得懂是 prompt engineering 的问题，能 brute force 解。

但我三个月后回来看自己的笔记，**这次理解断了，整个项目就废了**。

让我把"未来的自己"当成机器优化？这不反人性吗。

那一刻我意识到：harness 这个词被偷走了。我得自己定义。

---

## deusyu 那篇我从头反对到尾

deusyu 整理的几条核心原则，对企业级团队也许管用，对我这种**一个人对着 Claude 写代码同时维护四五个小项目**的开发者——逐条反对。

### "Humans steer, agents execute" —— 前提就错

OpenAI 说："人类掌舵，智能体执行。"

这话假设了一件事：**agent 真的能无人值守跑大量任务**。在百万行代码、十几个 agent 并行的场景下，人确实只能"掌舵"——管不过来细节。

但我一个人做项目时？

- 我和 Claude 平等讨论方案（不是我下令）
- 我审查每一个改动（不是 fully autonomous loop）
- 我定每一个 commit 是否值得合
- Plan Mode 是我的主要工作模式（每次复杂改动先出方案再动手）

我和 Claude 的关系**更像 pair programming**——我在和它一起写，不是站岸上指挥。

"Humans steer" 这个 framing 直接错了。

### "Mechanical Enforcement" —— 个人项目里是过度装备

deusyu 强调 lint + test + 大量 mechanical guardrails。

这在企业级 codebase 里救命。在个人项目里？

**等于带着 50 公斤防具去健身。**

动作变形，进度变慢，最关键——并没有真正阻止你犯错。

我在自己项目里只用最小集：critical 的用 Hook（100% 可靠），其他全用 CLAUDE.md 软约束（~80% 可靠，遗漏可接受）。

纪律的密度，要匹配项目的规模。

### "Agent Readability over Human Readability" —— 这条上面已经反对过

但还要展开说一遍。

我 `~/.claude/CLAUDE.md` 里有 8 条经验教训——"标志位双重职责要拆分"、"诊断时序 race 不要只看 layout 维度"、"CSS 嵌套圆角必须遵守同心圆公式"、"CSS clip-path 会裁切 box-shadow"……

每一条都是中文。每一条都带"实例"——具体哪个项目、什么场景、怎么修的。

这些不是写给 Claude 看的——Claude 真正需要的是"YOU MUST"那一句规则，后面"实例"段它都能跳过。

**带"实例"那段是写给我自己的。**

我重读时能感同身受——卧槽我当时在 lollipop-frontend 上为这个 flicker 调了一周——所以下次新项目我会自动想到这个坑。

Agent Readability 优化掉的，是我作为人类未来的可理解性。

**这是项目长期生存的护城河。不能优化掉。**

### "Throughput-oriented" —— 个人开发者追的是"想清楚"

企业派强调高吞吐：merge 策略要快、PR 要并行、修正成本要低于等待成本。

个人开发者反而要**降低吞吐**。

一天合一个有质量的 PR，远好于一天合十个粗糙的。

我的 harness 不为吞吐量服务。它为**质量和长期可理解性**服务。这是设计目标层面的根本分歧。

---

## 那我自己来定一个

讲完反对什么。我的定义：

> **Harness 是把开发经验从"每次会话重新教 Claude"升级到"写一次永久生效"的所有机制总和。它必须由两层组成——给机器看的（CLAUDE.md / Hook / Skill），和给自己看的（项目笔记 / 教训沉淀）。**

定义里三个关键词，挨个讲。

### 关键词 1：从"重教"到"写一次"

没有 harness 的开发者是这样的——

每次开 Claude Code 都要重新解释项目背景。技术栈是啥？哪些文件不要动？上次踩过什么坑？验证命令是什么？

一周里同样的话要说十遍。

用了 harness 之后——这些话**写一次进 CLAUDE.md**，每次会话自动加载。

**节省的不是几行话的输入时间，是认知重启的成本。**

你不用每次都把脑子里的项目模型重新"配置"给 Claude，更不用每次都重新组织语言。

Harness 是开发者的**外部认知缓存**。

### 关键词 2：必须两层

业界几乎所有讨论都聚焦在第一层——**给机器看的那一层**：CLAUDE.md、Hook、Skill、MCP……

我的定义里要加入**第二层**——**给自己看的那一层**：Obsidian 项目笔记、经验教训沉淀、技术决策记录。

为什么必须两层？

- 第一层（机器层）让 Claude 这次会话能干活
- 第二层（人层）让你三个月后还能维护这个项目

这两层**不可互相替代**：CLAUDE.md 写不下"我为什么放弃 GraphQL 选 REST"的完整心路；Obsidian 笔记没办法让 Claude 自动跑 typecheck。

**但缺一不可。**

少了机器层，Claude 每次都是金鱼。少了人层——三个月后你自己就是金鱼。

业界几乎所有 harness 讨论都缺第二层。OpenAI 的 sandbox 里没有"开发者本人的认知存档"这个位置；Anthropic 的 CLAUDE.md 只能存命令和规则，存不下你的设计哲学。

**个人开发者必须自己补上这一层。**

Obsidian、Notion、Logseq 这种第二大脑工具就是这一层最自然的载体。

我用的是 Obsidian。（其实就是把 Obsidian 当 LLM 的硬盘用——这个类比是 Karpathy 的 LLM OS 给我的启发。）

### 关键词 3：闭环长大

Harness 不是建一次完事的静态系统，是**每天都在长大**的动态闭环：

> 你犯一个错 → Claude 帮你修 → 你说"把这个加到 CLAUDE.md，下次别再犯" → 规则进 CLAUDE.md → 下次新会话 Claude 自动遵守 → 你又犯下一个错……

我那 8 条经验教训，**每一条都是这样长出来的**。

举一条具体的：

```
### CSS clip-path 会裁切 box-shadow

IMPORTANT: 给元素设 clip-path 后，元素的 box-shadow 会被一起裁掉……
要保留投影必须改用 borderRadius + overflow:hidden。

实例：lollipop-frontend feat_jd 卡片用 clipPath inset 切掉 SVG 边距留白，
写了 box-shadow 显示不出来。改 borderRadius + overflow:hidden 后投影正常。
```

不是从某本"CSS 最佳实践"抄来的。是我在 Lollipop 项目里实际翻车后沉淀的——当时我以为是 z-index 问题，查了半小时（艹），后来才发现是 clip-path 把 shadow 一起切了。

**带着具体翻车实例的规则，比抽象的最佳实践有用十倍。**

因为我能感同身受，Claude 也能基于实例推广到新场景——下次它在别的项目看到我又写 `clipPath + boxShadow`，它会立刻提示"等等，这个组合……"

Harness 的真正价值不在静态约束。在动态闭环。

---

## 我的 harness 实际就长这样

不空谈。我现在跑的版本，目录树拍给你看。

### 给机器看的一层

```
~/.claude/
├── CLAUDE.md                          # 全局规则 + 8 条经验教训
├── hooks/
│   └── harness-session-start.sh       # SessionStart Hook
└── skills/
    ├── new-project/SKILL.md
    ├── distill-lesson/SKILL.md
    └── wrap-up/SKILL.md

<每个项目>/
└── CLAUDE.md                          # 项目专属规则（< 100 行）
```

`~/.claude/CLAUDE.md`——个人全局规则。跨项目通用的东西，比如"所有回复用中文"、"改完代码必须跑验证命令"，加上那 8 条经验教训。每条都是真实翻车后沉淀的。不是想象的最佳实践，是带着项目实例的伤疤。

`<项目>/CLAUDE.md`——每个项目一个，控制在 100 行以内。技术栈、本地命令、不要动的文件、工作流。让 Claude 一打开就知道"这个项目是什么、怎么跑、什么不能碰"。

`~/.claude/hooks/harness-session-start.sh`——**这是我整套 harness 最独特的部分**。

每次 `cd` 到项目目录启动 Claude Code 时**自动执行**：

1. 把 `git status --short` + `git log --oneline -10` 注入 context
2. 如果 `~/Brain/01-Projects/<目录 basename>.md` 存在 → **把整个 Obsidian 项目笔记塞进 context**
3. 没有项目笔记？提示我"该跑 /new-project 了"

**第 2 步是核心**——它把 Obsidian 第二大脑和 Claude Code **直接打通了**。每次会话启动 Claude 都自动具备项目的完整历史背景，**我不需要手动说"读一下笔记"**。

业界几乎没人这么做。我搭这个 Hook 的当晚，"卧槽，原来 harness 还可以这样长"是我最直接的感受。

`~/.claude/skills/` 下三个 Skill：

- `/new-project` —— 开新项目时一次性完成 harness 三步仪式
- `/distill-lesson` —— 犯错后把教训提炼成 CLAUDE.md 规则
- `/wrap-up` —— 收工时写日报到 `~/Brain/05-Daily/` + 更新项目笔记进展

### 给自己看的一层

```
~/Brain/                                # 我的 Obsidian vault
├── 01-Projects/        # 活跃项目的笔记
├── 02-Areas/           # 长期学习领域
├── 03-Resources/       # 参考资料 + 账号凭据
├── 04-Archive/         # 已归档
├── 05-Daily/           # 每日日报
└── CLAUDE.md           # vault 规则 + 当前项目列表
```

按 PARA 结构组织。每个项目笔记包含四块：业务背景 / 关键决策 / 已知坑点 / 进展记录。

这套 vault 的核心作用**不是给 Claude 看**——它是我自己的第二大脑。Claude 只是被 Hook 顺便拉进来读一下当前项目那篇。

### 两层之间怎么联动

机器层产物：「Claude 这次怎么帮我干活」
人层产物：「我在长期搞什么 + 为什么」

联动点是 Hook 和 Skill：

- SessionStart Hook 把人层（项目笔记）注入机器层（context window）
- `/wrap-up` 把机器层（今天的 git log）沉淀进人层（日报）
- `/distill-lesson` 把对话上下文（机器层）抽象成规则，写回机器层（CLAUDE.md）和人层（经验教训）

两层各跑各的循环。但有明确的桥接。

**这才叫完整的 harness。单层是残缺的。**

---

## 我就守这三条

要给我这套 harness 写三条 tagline——

### 一、人在控制环里

不是 "humans steer, agents execute"，是 **"humans audit every step"**。

每个 Skill 都设计成"草稿 → 用户确认 → 落盘"。Plan Mode 是默认推荐工作模式。Auto-accept 只用在 trivial 改动。

Claude 是我的协作者，**不是替我决策的 agent**。

### 二、人可读优先

笔记首先是写给三个月后的自己看的。

章节有叙事结构——不是机器友好的扁平 list。关键决策旁边写"为什么这么选"。经验教训附带具体项目实例。

Claude 顺便能读那是副作用。

**优化人可读，机器可读是 free lunch；反过来不成立。**

### 三、闭环长大

Harness 不是一次性搭好的系统。

是**每犯一次错就长一点的有机体**。

今天的 CLAUDE.md 比一周前长两条。比一个月前长八条。

这些条目记录的不是抽象的最佳实践——是我真的踩过的坑。

Harness 是开发经验的**复利账户**。每次存进一条规则，未来无数次会话都能取出来用。

---

## 说回开头

Harness 这个词在 2026 年已经没有标准定义了。

我觉得这其实是好事。

各家按自己的场景写自己的版本，证明这个概念**真的有用**。OpenAI 写企业版，ThoughtWorks 写方法论版，Anthropic 写产品版。

但他们都没写**个人开发者的版本**。

我这一版不适合企业，不适合大型团队，可能也不适合追求高吞吐量的高强度协作团队。

它适合像我这样的人——

- 一个人对着 Claude 写代码
- 同时维护几个不同阶段的小项目
- 笔记记进 Obsidian，希望三个月后还看得懂
- 错了能学，学了能用，用过能传给下一个项目

如果你也是这样的开发者——

**你的 harness 是你的。从你今天犯的错和你今晚记的笔记开始长。**

不用等大公司给你标准答案。

---

最后说一句不算结论的——

写这篇文章的时候我突然意识到一件事：**业界讲 harness 几乎都把它当工程问题**，但对个人开发者来说，它本质上是个**认知问题**——

你愿不愿意把今天踩的坑认真记下来。

这事 Claude 替不了你。

它能帮你写规则、整理笔记、提炼模式。但**"这次的错值不值得变成规则"这个判断**，是你的。

Harness 真正的护城河，不在工具。

在判断。
