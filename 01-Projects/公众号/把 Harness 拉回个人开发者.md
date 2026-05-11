---
tags:
  - 公众号
  - 草稿
  - harness
date: 2026-05-11
---
## 一、背景

最近我把 "harness engineering" 几个有名出处翻了一遍：ThoughtWorks 的 Birgitta Böckeler 发在 Martin Fowler 网站上的奠基文章、OpenAI Codex 团队 2026 年初的提案、Anthropic 文档里关于 CLAUDE.md / Hooks / Skills 的零散描述，还有社区里那篇刷屏的 `deusyu/harness-engineering` 中文整理。

读到 deusyu 那篇里的一条原则时，我停了下来——

> **"Agent Readability over Human Readability"** —— 优化机器可读，不优化人可读。

我突然意识到：这不是我那套 harness。

我的 Obsidian 笔记**首先是给三个月后的自己看的**。CLAUDE.md 里的「经验教训」是我重读时能感同身受的中文复盘。项目笔记里的「已知坑点」是为了让未来的我别再踩一次。Claude 顺便也能读到，但那是副作用。

我意识到：harness 这个词在 2026 年已经被**企业叙事**占领了。OpenAI 想着百万行代码、多 agent 编排、checkpoint 恢复；ThoughtWorks 想着工程团队怎么对齐；deusyu 那套基本是 OpenAI 派的中文翻译。

但我不是企业。我是**一个人**对着 Claude 写代码、同时维护四五个小项目、把所有思考沉淀进 Obsidian 的开发者。

这篇文章想做一件事：**把 harness 这个词从企业叙事里拉回来**，并给个人开发者一个真正适合的定义。

---

## 二、业界已有四派 Harness，主语都不是"我"

把过去半年关于 harness 的内容摊开看，能清楚分出四派：

| 派别 | 代表 | 关键词 | 想象的用户 |
|------|------|--------|----------|
| **方法论派** | Birgitta Böckeler / ThoughtWorks | Agent = Model + Harness 概念框架 | 工程团队（咨询客户） |
| **基础设施派** | OpenAI Codex | sandbox / state snapshot / parallel agents | 企业 + 大型 codebase |
| **平台工具派** | Anthropic Claude Code | CLAUDE.md / Hooks / Skills / MCP | 产品用户（开发者） |
| **综合整理派** | deusyu、社区博主、awesome 列表 | 多家合集、机器可读优化 | 不明 |

四派定义不一样，是因为他们脑子里"使用这套 harness 的人"不一样：

- Birgitta 在咨询，**她想的是大型团队怎么把 agent 工作流标准化**——这是她的客户
- OpenAI Codex 团队**用 Codex agent 写了一百万行代码、零行人类手写**——他们的 harness 是为这种规模设计的
- Anthropic 卖 Claude Code，**他们的 harness 就是产品本身**——服务所有付费用户
- deusyu 等综合整理派**没有特定主语**，把企业派和平台派糅在一起，但**底层叙事还是 OpenAI 那套**（"人类掌舵，智能体执行"）

**所有这些定义里，没有一个的"主语"是一个人独自做项目的个人开发者。**

这就是问题所在。当你拿这些定义去套自己的开发场景，会发现处处不对劲——不是因为你做得不够好，是因为这些定义压根不是为你写的。

---

## 三、企业派的几条原则，对个人开发者不只是不适用，是反向

这一节直白：deusyu 整理的那几条核心原则，我作为个人开发者**逐条反对**。

### 1. "Humans steer, agents execute" —— 错的前提

OpenAI 这条 slogan 假设了一件事：**agent 真的能无人值守跑大量任务**。在百万行代码、十几个 agent 并行的场景下，人确实只能"掌舵"——管不过来细节。

但你一个人做项目时：

- 你和 Claude 平等讨论方案
- 你审查**每个**改动
- 你定**每个** commit 是否值得合
- Plan Mode 是你的主要工作模式，不是 fully autonomous loop

我和 Claude 的关系**更像 pair programming**，不是我下令它执行。"Humans steer"这个 framing 直接错了——我在和它一起写，不是站在岸上指挥它。

### 2. "Mechanical Enforcement" —— 个人项目里是过度装备

deusyu 强调 lint + test + 大量 mechanical guardrails。这在企业级 codebase 里救命，但你做一个五万行以内的个人项目，全套 mechanical enforcement 等于**带着五十公斤防具去健身**——动作变形，进度变慢，并没有真正阻止你犯错。

我在自己项目里用**最小集**：critical 的用 Hook（100% 可靠），其他全用 CLAUDE.md 软约束（~80% 可靠，遗漏可接受）。**纪律的密度要匹配项目的规模**。

### 3. "Agent Readability over Human Readability" —— 这条直接错

deusyu 原文："优化机器可读，不优化人可读。"

我的反对很简单：**我才是项目的长期 maintainer，Claude 是临时工**。

Claude 每次会话从零开始读上下文，它读不读得懂是 prompt engineering 的问题，能 brute force 解决。**但我三个月后回来看到自己的笔记**——这次理解断了，整个项目就废了。

**人可读性是项目长期生存的护城河，不能让位于机器可读性**。这条原则在企业场景下也许成立（团队规模大，agent 产出占主导），但搬到个人开发者身上——它要求你把"未来的自己"当成机器优化，这是反人性的。

### 4. "Throughput-oriented" —— 个人开发者追的是"想清楚"

企业派强调高吞吐：merge 策略要快、PR 要并行、修正成本要低于等待成本。个人开发者反而要**降低吞吐**——一天合一个有质量的 PR，远好于一天合十个粗糙的。

我的 harness 不为吞吐量服务，它为**质量和长期可理解性**服务。这是设计目标层面的根本分歧。

---

## 四、我的定义

讲完反对什么，讲我的定义。

> **Harness 是把开发经验从"每次会话重新教 Claude"升级到"写一次永久生效"的所有机制总和。它必须由两层组成：给机器看的（CLAUDE.md / Hook / Skill），和给自己看的（项目笔记 / 教训沉淀）。**

这个定义里有三个关键词：

### 关键词 1：从"重教"到"写一次"

这是 harness 解决的**根本问题**。

没有 harness 的开发者是这样的：每次开 Claude Code 都要重新解释项目背景、技术栈、关键约束、不要动的文件、上次踩过什么坑……一周里相同的话要说十遍。

用了 harness 之后：那些话**写一次进 CLAUDE.md**，每次会话自动加载。

**节省的不是几行话的输入时间，是认知重启的成本**——你不用每次都把脑子里的项目模型重新"配置"给 Claude，更不用每次都重新组织语言。Harness 是开发者的**外部认知缓存**。

### 关键词 2：必须两层

业界几乎所有讨论都聚焦在第一层——**给机器看的那一层**：CLAUDE.md、Hook、Skill、MCP……

我的定义里要加入**第二层**——**给自己看的那一层**：Obsidian 项目笔记、经验教训沉淀、技术决策记录。

**为什么必须两层？**

- **第一层（机器层）让 Claude 这次会话能干活** —— 它需要约束、上下文、工具
- **第二层（人层）让你三个月后还能维护这个项目** —— 你需要叙事、动机、坑的来由

这两层**不可互相替代**：

- CLAUDE.md 里写不下"我为什么放弃 GraphQL 选 REST"的完整心路
- Obsidian 笔记没办法让 Claude 自动跑 typecheck

**但两层缺一不可**——少了机器层，Claude 每次都是金鱼；少了人层，三个月后你自己就是金鱼。

业界几乎所有 harness 讨论都缺第二层。OpenAI 的 sandbox 里没有"开发者本人的认知存档"这个位置；Anthropic 的 CLAUDE.md 只能存命令和规则，存不下你的设计哲学。**个人开发者必须自己补上这一层**——而 Obsidian、Notion、Logseq 这种第二大脑工具就是这一层最自然的载体。

### 关键词 3：闭环长大

Harness 不是建一次完事的静态系统，是**每天都在长大**的动态闭环：

```
你犯一个错
   ↓
Claude 帮你修
   ↓
你说："把这个加到 CLAUDE.md，下次别再犯"
   ↓
规则进 CLAUDE.md / 经验教训
   ↓
下次新会话 Claude 自动遵守
   ↓
你又犯下一个错……
```

我在 `~/.claude/CLAUDE.md` 的「经验教训」section 里有八条规则，**每一条都是这样长出来的**——某个具体项目的某次具体翻车，Claude 帮我修完，我让它"沉淀成规则"。

举一条：

```
### CSS clip-path 会裁切 box-shadow

IMPORTANT: 给元素设 clip-path 后，元素的 box-shadow 会被一起裁掉……
要保留投影必须改用 borderRadius + overflow:hidden，或在外层包一个带 shadow 的 div。

实例：lollipop-frontend feat_jd 卡片用 clipPath inset 切掉 SVG 边距留白，
写了 box-shadow 显示不出来。改 borderRadius + overflow:hidden 后投影正常。
```

这条规则不是从某本"CSS 最佳实践"抄来的，是我在 Lollipop 项目里实际翻车后沉淀的。**带着具体实例的规则**比抽象的最佳实践有用十倍——因为我能感同身受，Claude 也能基于实例推广到新场景。

**Harness 的真正价值不在静态约束，而在动态闭环**。

---

## 五、我的实战 Harness 长这样

不空谈，直接展示我现在跑的版本：

### 给机器看的一层（`~/.claude/` + 项目根目录）

**全局规则** —— `~/.claude/CLAUDE.md`

跨项目通用的个人习惯。比如：

```
IMPORTANT: 所有回复和代码注释使用中文。

YOU MUST: 每次修改代码后，必须运行对应项目的验证命令...

## 经验教训
### 标志位双重职责要拆分
### 诊断时序 race 不要只看 layout 维度
### CSS 嵌套圆角必须遵守同心圆公式
### CSS clip-path 会裁切 box-shadow
...（8 条）
```

每一条经验教训都是真实翻车后沉淀的——不是想象的最佳实践，是带着具体项目实例的伤疤。

**项目规则** —— `<项目根目录>/CLAUDE.md`

每个项目一个，控制在 100 行以内：技术栈、本地命令、不要动的文件、工作流。让 Claude 一打开就知道"这个项目是什么、怎么跑、什么不能碰"。

**SessionStart Hook** —— `~/.claude/hooks/harness-session-start.sh`

每次 `cd` 到项目目录启动 Claude Code 时**自动执行**：

1. 注入 `git status --short` + `git log --oneline -10`
2. 如果 `~/Brain/01-Projects/<目录 basename>.md` 存在 → **把整个项目笔记塞进 context**
3. 没有项目笔记？提示我"该跑 `/new-project` 了"

**这是我整套 harness 最独特的部分** —— 它把 Obsidian 第二大脑和 Claude Code **直接打通了**。每次会话启动 Claude 都自动具备项目的完整历史背景，不需要我手动说"读一下笔记"。

**三个 Skill**：

| Skill | 触发 | 干什么 |
|-------|------|-------|
| `/new-project` | 开新项目 | 一次性完成 harness 三步仪式（建项目 CLAUDE.md / 建笔记 / 登记全局） |
| `/distill-lesson` | 犯错后 | 提炼成 CLAUDE.md 规则，按 YOU MUST / IMPORTANT 格式追加 |
| `/wrap-up` | 收工时 | 写日报到 `05-Daily/` + 更新项目笔记的「进展记录」 |

### 给自己看的一层（`~/Brain/` Obsidian vault）

按 PARA 结构组织：

```
~/Brain/
├── 01-Projects/        # 活跃项目的笔记（每个项目一个 md）
├── 02-Areas/           # 长期学习领域（Claude-Code、Harness、PKM）
├── 03-Resources/       # 参考资料 + 账号凭据
├── 04-Archive/         # 已归档
├── 05-Daily/           # 每日日报（/wrap-up 写到这里）
└── CLAUDE.md           # vault 层规则 + 当前项目列表
```

每个项目笔记包含四块：**业务背景 / 关键决策 / 已知坑点 / 进展记录**。

这套 vault 的核心作用**不是给 Claude 看**——它是我自己的第二大脑，Claude 只是被 Hook 顺便拉进来读一下当前项目那篇。

### 两层之间怎么联动

- **机器层产物**："Claude 这次怎么帮我干活"
- **人层产物**："我在长期搞什么 + 为什么"
- **联动点**：
  - SessionStart Hook 把人层（项目笔记）注入机器层（context window）
  - `/wrap-up` Skill 把机器层（今天的 git log）沉淀进人层（日报）
  - `/distill-lesson` 跨层：把对话上下文（机器层）抽象成规则，写回 CLAUDE.md（机器层）和经验教训（人层都能看）

**两层各跑各的循环，但有明确的桥接**。这才叫完整的 harness——单层是残缺的。

---

## 六、设计哲学三条

如果要给我这套 harness 写三条 tagline，应该是：

### 1. 人在控制环里

不是 "humans steer, agents execute"，是 **"humans audit every step"**。

- 每个 Skill 都设计成"草稿 → 用户确认 → 落盘"
- Plan Mode 是默认推荐工作模式
- Auto-accept 只用在 trivial 改动

**Claude 是我的协作者，不是替我决策的 agent。**

### 2. 人可读优先

笔记首先是写给三个月后的自己看的：

- 章节有叙事结构而不是机器友好的扁平 list
- 关键决策旁边写"为什么这么选"
- 经验教训附带具体项目实例

Claude 顺便能读，那是副作用。**优化人可读，机器可读是 free lunch；反过来不成立**。

### 3. 闭环长大

Harness 不是一次性搭好的系统，是**每犯一次错就长一点的有机体**。今天的 CLAUDE.md 比一周前长两条，比一个月前长八条。这些条目记录的不是抽象的最佳实践，是我**真的踩过的坑**。

**Harness 是开发经验的复利账户**：每次存进一条规则，未来无数次会话都能取出来用。

---

## 七、收尾

Harness 这个词在 2026 年已经没有标准定义了——这其实是好事。

各家按自己的场景写自己的版本，证明这个概念**真的有用**。OpenAI 写企业版，ThoughtWorks 写方法论版，Anthropic 写产品版。但他们都没写**个人开发者的版本**。

我这一版不适合企业，不适合大型团队，可能也不适合追求高吞吐量的高强度协作团队。

但它适合像我这样的人：

- 一个人对着 Claude 写代码
- 同时维护几个不同阶段的小项目
- 笔记记进 Obsidian，希望三个月后还看得懂
- 错了能学，学了能用，用过能传给下一个项目

如果你也是这样的开发者——**你的 harness 是你的，从你今天犯的错和你今晚记的笔记开始长**。

不用等大公司给你标准答案。

---

## 附录：我的实际 Harness 文件清单

```
~/.claude/
├── CLAUDE.md                          # 个人全局规则 + 经验教训
├── hooks/
│   └── harness-session-start.sh       # SessionStart Hook
└── skills/
    ├── new-project/SKILL.md
    ├── distill-lesson/SKILL.md
    └── wrap-up/SKILL.md

~/Brain/                                # Obsidian vault
├── CLAUDE.md                          # vault 规则 + 当前项目列表
├── 01-Projects/<项目>.md              # 项目笔记（四块结构）
├── 02-Areas/Harness/                  # 这套方法论的学习笔记
└── 05-Daily/YYYY-MM-DD.md             # 日报

<每个项目>/
└── CLAUDE.md                          # 项目专属规则（< 100 行）
```

如果你想抄这套，关键约定**一句话**：**Obsidian 项目笔记的文件名 = 项目目录 basename**，SessionStart Hook 靠这个约定自动匹配项目笔记。

---

**参考资料**

- [Birgitta Böckeler: Harness Engineering for Coding Agents](https://martinfowler.com/articles/harness-engineering.html) —— 概念奠基
- [OpenAI: Harness Engineering](https://openai.com/index/harness-engineering/) —— 企业派代表
- [deusyu/harness-engineering](https://github.com/deusyu/harness-engineering) —— 综合整理派
- Anthropic Claude Code 官方文档（CLAUDE.md / Hooks / Skills）
