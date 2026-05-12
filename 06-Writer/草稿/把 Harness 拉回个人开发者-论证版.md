---
tags:
  - 公众号
  - 草稿
  - harness
date: 2026-05-11
---

# 把 Harness 拉回个人开发者：一个反企业叙事的定义

> 当 Harness Engineering 成为 2026 年最热门的 AI 工程话题，业界讨论焦点集中在企业级 agent 编排时，我作为个人开发者发现了一个被忽视的事实——**现有的 harness 定义没有一个是为个人开发者写的**。本文剖析企业派四条核心原则在个人开发场景下的失效逻辑，给出一个我自己用了半年、经过 5 个活跃项目验证的定义，并附完整实现。

## 一、问题的提出

Harness Engineering 作为 AI 编码 agent 时代的核心工程概念，过去一年由多方提出并发展，已形成四条相对清晰的叙事脉络：

- **ThoughtWorks 的 Birgitta Böckeler** 在 Martin Fowler 网站发表的奠基文章中，首次系统化「**Agent = Model + Harness**」这一框架，将其确立为讨论 AI 编码工程的基础语汇；
- **OpenAI Codex 团队** 在 2026 年初的工程实践中，将 harness 扩展为支撑大规模 agent 编排的基础设施叙事（sandbox 隔离、state checkpoint、parallel agent 调度）；
- **Anthropic** 通过 Claude Code 的 CLAUDE.md / Hooks / Skills / MCP 体系，提供了 harness 的产品级实现路径；
- **中文社区** 中较具影响力的 `deusyu/harness-engineering` 项目，对上述叙事做了系统性整理与本地化转述。

当我将这些定义放在一起对照阅读时，发现一个共同的盲区——**所有现有定义的隐含主语都是企业组织或工程团队，没有一个是为个人开发者写的**。

这种错位在阅读 `deusyu/harness-engineering` 时尤为明显。其中一条核心原则——

> **"Agent Readability over Human Readability"** —— 优化机器可读，不优化人可读。

这条原则在大型企业 codebase 中或许成立（团队规模大、agent 产出占主导、人类读者只是审查者），但与我作为个人开发者的实践完全相反：

- 我的 Obsidian 笔记**首先是写给三个月后的自己看的**；
- CLAUDE.md 里的「经验教训」是我重读时能感同身受的中文复盘；
- 项目笔记里的「已知坑点」是为了防止未来的我再次踩坑。

Claude 顺便也能读到，但那是副作用，不是设计目标。

由此可以得出一个判断：**harness 这个概念在 2026 年已经被企业叙事占领，但它本不应只属于企业**。OpenAI 关注百万行代码与多 agent 编排；ThoughtWorks 关注工程团队如何对齐；deusyu 的整理则基本是 OpenAI 派的中文译述——这些定义的主语都不是「一个人对着 Claude 写代码、同时维护数个小项目、将所有思考沉淀进 Obsidian 的个人开发者」。

而后者，恰恰是当前使用 Claude Code / Cursor / Codex CLI 等工具的开发者群体中最大的一类。

**本文主张**：harness 这个概念应当回归个人开发者视角，并需要一个不同于企业叙事的定义。

本文试图回答两个问题：

1. **为什么现有 harness 定义不适合个人开发者**——逐条剖析企业派四条核心原则的失效场景；
2. **个人开发者需要什么样的 harness**——给出一个我自己用了半年的定义，附完整实现与 5 条展望。

---

## 二、四派定义的共同盲区：缺失个人开发者视角

将过去半年关于 harness 的讨论做横向对照，可以清楚分出四派：

| 派别 | 代表 | 关键词 | 想象的用户 |
|------|------|--------|----------|
| **方法论派** | Birgitta Böckeler / ThoughtWorks | Agent = Model + Harness 概念框架 | 工程团队（咨询客户） |
| **基础设施派** | OpenAI Codex | sandbox / state snapshot / parallel agents | 企业 + 大型 codebase |
| **平台工具派** | Anthropic Claude Code | CLAUDE.md / Hooks / Skills / MCP | 产品用户（开发者） |
| **综合整理派** | deusyu、社区博主、awesome 列表 | 多家合集、机器可读优化 | 不明 |

四派定义存在差异，根源在于它们想象的"使用者"完全不同：

- Birgitta 在咨询公司，**她想的是大型团队如何把 agent 工作流标准化**——这是她的客户；
- OpenAI Codex 团队**用 Codex agent 写了一百万行代码、零行人类手写**——他们的 harness 是为这种规模设计的；
- Anthropic 卖 Claude Code，**他们的 harness 即产品本身**——服务所有付费用户；
- deusyu 等综合整理派**没有特定主语**，糅合企业派和平台派，但**底层叙事仍是 OpenAI 那套**（"人类掌舵，智能体执行"）。

**所有这些定义中，没有一个的"主语"是一个人独自做项目的个人开发者。**

由此可以看出：将企业派定义直接套用于个人开发场景，必然处处错位——这不是开发者的问题，而是定义本身的适用边界问题。

---

## 三、企业派四条核心原则的失效场景

下面对企业派四条核心原则做逐条分析，论证其在个人开发场景下的失效逻辑。

### 3.1 "Humans steer, agents execute" —— 错的前提

OpenAI 这条 slogan 隐含一个前提：**agent 能在大量任务上无人值守地执行**。在百万行代码、十几个 agent 并行的场景下，这个前提成立——人确实只能"掌舵"，管不过来细节。

**但在个人开发场景下**，这个前提完全不成立：

- 我和 Claude 平等讨论方案（不是我下令）；
- 我审查**每个**改动（不是 fully autonomous loop）；
- 我决定**每个** commit 是否值得合入；
- Plan Mode 是主要工作模式，每次复杂改动先出方案再动手。

换句话说，我和 Claude 的协作模式**更接近 pair programming，而非 master-slave**。"Humans steer" 的 framing 在此前提下不成立——我不是在指挥它，而是在与它共同推进。

### 3.2 "Mechanical Enforcement" —— 个人项目中的过度装备

deusyu 强调 lint + test + 大量 mechanical guardrails。这在企业级 codebase 中是必要保障，但**在五万行以内的个人项目中是过度装备**——动作变形、进度变慢，并不能真正阻止你犯错。

**我的做法是最小集**：critical 路径用 Hook（100% 可靠），其余全部用 CLAUDE.md 软约束（~80% 可靠，遗漏可接受）。

> 纪律的密度，必须匹配项目的规模。

这是工程纪律与项目复杂度之间的根本权衡，不存在"对所有项目都适用的最优 mechanical enforcement 强度"。

### 3.3 "Agent Readability over Human Readability" —— 设计哲学上的根本错位

deusyu 原文："优化机器可读，不优化人可读。"

我的反对理由很明确：**我才是项目的长期 maintainer，Claude 是临时工**。

Claude 每次会话从零开始读上下文，它读不读得懂是 prompt engineering 的问题，可以通过工程手段 brute force 解决。**但我三个月后回来看到自己的笔记**——这次理解断裂，整个项目就废了。

> 人可读性是项目长期生存的护城河，不能让位于机器可读性。

这条原则在企业场景下也许成立（团队规模大，agent 产出占主导，人类只是审查者），但搬到个人开发者身上——它要求将"未来的自己"作为机器读者优化对象，**这是设计哲学上的根本错位**。

### 3.4 "Throughput-oriented" —— 设计目标层面的根本分歧

企业派强调高吞吐：merge 策略要快、PR 要并行、修正成本要低于等待成本。

个人开发者的工程目标恰恰相反——**降低吞吐**。一天合一个有质量的 PR，远好于一天合十个粗糙的。

具体到工程层面，这意味着：

- 我的 harness 不为吞吐量服务，而为**质量和长期可理解性**服务；
- 这是设计目标层面的根本分歧，无法通过"缩小企业派定义"来解决——必须重新定义。

---

## 四、我对 Harness 的定义

基于上述分析，我提出如下定义：

> **Harness 是把开发经验从"每次会话重新教 Claude"升级到"写一次永久生效"的所有机制总和。它必须由两层组成：给机器看的（CLAUDE.md / Hook / Skill），和给自己看的（项目笔记 / 教训沉淀）。**

定义中包含三个关键词，逐一展开。

### 4.1 关键词一：从"重教"到"写一次"

这是 harness 解决的**根本问题**。

没有 harness 的开发者是这样的：每次开 Claude Code 都要重新解释项目背景、技术栈、关键约束、不要动的文件、上次踩过什么坑……一周里相同的话要说十遍。

有了 harness 之后：那些话**写一次进 CLAUDE.md**，每次会话自动加载。

**为什么这个定义有工程价值？** 因为它精准命中了 harness 解决的根本问题——**节省的不是输入时间，是认知重启的成本**。开发者不必每次都将脑中的项目模型重新"配置"给 Claude，也不必重新组织语言。

换句话说，**Harness 是开发者的外部认知缓存**。

### 4.2 关键词二：必须两层

业界几乎所有讨论都聚焦在第一层——**给机器看的那一层**：CLAUDE.md、Hook、Skill、MCP……

我的定义中加入**第二层**——**给自己看的那一层**：Obsidian 项目笔记、经验教训沉淀、技术决策记录。

**为什么必须两层？**

- **第一层（机器层）让 Claude 这次会话能干活** —— 它需要约束、上下文、工具；
- **第二层（人层）让你三个月后还能维护这个项目** —— 你需要叙事、动机、坑的来由。

这两层**不可互相替代**：

- CLAUDE.md 中写不下"我为什么放弃 GraphQL 选 REST"的完整心路；
- Obsidian 笔记没办法让 Claude 自动跑 typecheck。

**但两层缺一不可**——少了机器层，Claude 每次都是金鱼；少了人层，三个月后开发者自己就是金鱼。

> 业界几乎所有 harness 讨论都缺第二层。这是个人开发者必须自己补上的认知基础设施。

OpenAI 的 sandbox 中没有"开发者本人的认知存档"这个位置；Anthropic 的 CLAUDE.md 只能存命令和规则，存不下开发者的设计哲学。**个人开发者必须自己补上这一层**——Obsidian、Notion、Logseq 这种第二大脑工具就是这一层最自然的载体。

### 4.3 关键词三：闭环长大

Harness 不是建一次完事的静态系统，而是**每天都在长大**的动态闭环：

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

我在 `~/.claude/CLAUDE.md` 的「经验教训」section 中有 **8 条规则**——**每一条都是这样长出来的**：某个具体项目的某次具体翻车，Claude 帮我修完，我让它"沉淀成规则"。

举一条具体的：

```
### CSS clip-path 会裁切 box-shadow

IMPORTANT: 给元素设 clip-path 后，元素的 box-shadow 会被一起裁掉……
要保留投影必须改用 borderRadius + overflow:hidden，或在外层包一个带 shadow 的 div。

实例：lollipop-frontend feat_jd 卡片用 clipPath inset 切掉 SVG 边距留白，
写了 box-shadow 显示不出来。改 borderRadius + overflow:hidden 后投影正常。
```

这条规则不是从某本"CSS 最佳实践"抄来的，是我在 Lollipop 项目中实际翻车后沉淀的。**带着具体实例的规则比抽象的最佳实践有用十倍**——因为我能感同身受，Claude 也能基于实例推广到新场景。

> Harness 的真正价值不在静态约束，而在动态闭环。

---

## 五、实战 Harness：当前运行的版本

下面是我当前实际运行的版本。**所有零件可数**：1 份全局 CLAUDE.md、5 份项目 CLAUDE.md、1 个 SessionStart Hook、3 个 Skill、1 套 Obsidian vault。

### 5.1 给机器看的一层（`~/.claude/` + 项目根目录）

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

**全局规则** —— `~/.claude/CLAUDE.md` 包含跨项目通用的个人习惯（如"所有回复使用中文"、"改完代码必须跑验证命令"），加上 8 条经验教训。每条规则都是真实翻车后沉淀的——不是想象的最佳实践，是带着具体项目实例的伤疤。

**项目规则** —— `<项目根目录>/CLAUDE.md`，每个项目一个，控制在 100 行以内：技术栈、本地命令、不要动的文件、工作流。让 Claude 一打开就知道"这个项目是什么、怎么跑、什么不能碰"。

**SessionStart Hook** —— `~/.claude/hooks/harness-session-start.sh` 是**整套 harness 最独特的部分**。每次 `cd` 到项目目录启动 Claude Code 时自动执行：

1. 注入 `git status --short` + `git log --oneline -10`；
2. 如果 `~/Brain/01-Projects/<目录 basename>.md` 存在 → **将整个项目笔记塞进 context**；
3. 没有项目笔记 → 提示"该跑 `/new-project` 了"。

**它把 Obsidian 第二大脑和 Claude Code 直接打通了**。每次会话启动 Claude 都自动具备项目完整历史背景，开发者不需要手动说"读一下笔记"。

**三个 Skill**：

| Skill | 触发时机 | 核心动作 |
|-------|---------|---------|
| `/new-project` | 开新项目 | 一次性完成 harness 三步仪式（建项目 CLAUDE.md / 建笔记 / 登记全局） |
| `/distill-lesson` | 犯错后 | 提炼成 CLAUDE.md 规则，按 YOU MUST / IMPORTANT 格式追加 |
| `/wrap-up` | 收工时 | 写日报到 `~/Brain/05-Daily/` + 更新项目笔记的「进展记录」 |

### 5.2 给自己看的一层（`~/Brain/` Obsidian vault）

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

这套 vault 的核心作用**不是给 Claude 看**——它是我自己的第二大脑。Claude 只是被 Hook 顺便拉进来读当前项目那篇。

### 5.3 两层之间的联动关系

两层各自的产物定位完全不同：

- **机器层产物**：「Claude 这次怎么帮我干活」——临时的、会话级的；
- **人层产物**：「我在长期搞什么 + 为什么」——持久的、项目级的。

**联动通过 Hook 和 Skill 实现**：

```
┌────────────────────┐  SessionStart Hook   ┌──────────────────┐
│  人层（~/Brain/）   │ ───────────────────▶ │  机器层（context）│
│  项目笔记 / 教训    │                       │ Claude 会话上下文 │
└────────────────────┘                       └──────────────────┘
          ▲                                            │
          │                                            │
          │              /wrap-up                      │
          │  ◀─────────────────────────────────────────│
          │                                            │
          │           /distill-lesson                  │
          │  ◀═════════════════════════════════════════│
          │       （跨层提炼：对话 → 规则）            │
```

具体联动机制：

- **SessionStart Hook** 把人层（项目笔记）注入机器层（context window）；
- **`/wrap-up` Skill** 把机器层（今天的 git log）沉淀进人层（日报）；
- **`/distill-lesson` Skill** 跨层提炼：对话上下文（机器层）→ 规则，写回 CLAUDE.md（机器层）与经验教训（双层可见）。

**两层各跑各的循环，但有明确的桥接**。这才是完整的 harness——单层是残缺的。

---

## 六、我守的三条原则

如果将这套 harness 的设计哲学浓缩为三条 tagline，则是：

### 6.1 人在控制环里

不是 "humans steer, agents execute"，而是 **"humans audit every step"**。

具体落地：

- 每个 Skill 都设计成"草稿 → 用户确认 → 落盘"；
- Plan Mode 是默认推荐工作模式；
- Auto-accept 仅用于 trivial 改动。

**Claude 是我的协作者，不是替我决策的 agent**。

### 6.2 人可读优先

笔记首先是写给三个月后的自己看的：

- 章节有叙事结构，而不是机器友好的扁平 list；
- 关键决策旁边注明"为什么这么选"；
- 经验教训附带具体项目实例。

Claude 顺便能读，那是副作用。

> 优化人可读，机器可读是 free lunch；反过来不成立。

### 6.3 闭环长大

Harness 不是一次性搭好的系统，而是**每犯一次错就长一点的有机体**。今天的 CLAUDE.md 比一周前长两条，比一个月前长八条。这些条目记录的不是抽象的最佳实践——是真的踩过的坑。

> Harness 是开发经验的复利账户：每次存进一条规则，未来无数次会话都能取出来用。

---

## 七、总结与展望

**回到本文的核心论点**：harness 这个概念在 2026 年已被企业叙事占领，但个人开发者需要一个完全不同的版本。

具体到工程层面，这意味着：

1. **拒绝企业派四条原则中的失效部分**——humans steer、mechanical enforcement、agent readability、throughput——它们的设计前提与个人开发场景根本不匹配；
2. **接受 harness 的双层结构**——机器层（CLAUDE.md / Hook / Skill）和人层（Obsidian 第二大脑），缺一不可；
3. **建立动态闭环机制**——错误 → 沉淀 → 规则 → 防御，让 harness 每天都在长大；
4. **遵守三条原则**——人在控制环里、人可读优先、闭环长大。

这一套定义不适合企业，不适合大型团队，也不适合追求高吞吐量的高强度协作场景。**但它适合当前最大的一类开发者群体**——一个人对着 Claude 写代码、维护数个不同阶段的小项目、将所有思考沉淀进 Obsidian 的个人工程师。

### 几个值得继续探索的方向

1. **typecheck / lint 的 Hook 集成**——把"改完代码必须验证"从 CLAUDE.md 软约束（80% 可靠）升级到 PostToolUse Hook（100% 可靠）；
2. **跨设备 harness 同步**——通过 `~/.claude/` 的独立 Git 仓库实现多设备配置一致；
3. **教训规则的层级区分**——区分"项目特有坑"与"跨项目教训"，分别落到项目 CLAUDE.md 与全局 CLAUDE.md；
4. **知识库的自动衰减**——参考 Karpathy 的 LLM Wiki Lint 思路，让长期未引用的规则自动归档；
5. **个人开发者社区的 harness 共享**——在保持个人化的前提下，建立可复用的 harness 模板库。

---

工具会随模型迭代而更新——Hook 会变、Skill 会变、CLAUDE.md 的写法会变。但**"这次的错值不值得变成规则"的判断**，是模型无法替代的开发者本人的认知能力。

> Harness 真正的护城河，不在工具，在判断。

这也正是个人开发者必须建立自己 harness 的根本原因——**你的 harness 是你的**，从你今天犯的错和你今晚记的笔记开始长。

---

## 附录：实际 Harness 文件清单

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

**关键约定一句话**：**Obsidian 项目笔记的文件名 = 项目目录 basename**，SessionStart Hook 依此约定自动匹配项目笔记。

---

**参考资料**

- [Birgitta Böckeler: Harness Engineering for Coding Agents](https://martinfowler.com/articles/harness-engineering.html) —— 概念奠基
- [OpenAI: Harness Engineering](https://openai.com/index/harness-engineering/) —— 企业派代表
- [Anthropic Claude Code 官方文档](https://docs.claude.com/claude-code) —— 平台工具派
- [deusyu/harness-engineering](https://github.com/deusyu/harness-engineering) —— 综合整理派
- Karpathy: LLM OS / Software 3.0 / Context Engineering 相关讨论 —— 跨范式视角
