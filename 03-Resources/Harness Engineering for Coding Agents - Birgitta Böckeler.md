---
tags:
  - harness
  - AI工程
  - 参考
date: 2026-04-15
source: https://martinfowler.com/articles/harness-engineering.html
author: Birgitta Böckeler
published: 2026-04-02
---

# 编码代理用户的 Harness Engineering

*要让编码代理在更少监督下工作，我们需要建立对其结果的信心。作为软件工程师，我们对 AI 生成的代码天然存在信任壁垒——LLM 是非确定性的，不了解我们的上下文，也并不真正理解代码，它们思考的单位是 token。本文探索了一个心智模型，将 context engineering 和 harness engineering 中的新兴概念整合起来，以建立这种信任。*

> 作者：[Birgitta Böckeler](https://birgitta.info) · 2026 年 4 月 2 日 · Martin Fowler 博客
>
> Birgitta 是 Thoughtworks 的杰出工程师和 AI 辅助交付专家，拥有超过 20 年的软件开发、架构和技术领导经验。

---

本文是对[早期备忘录](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering-memo.html)的更新，该备忘录记录了我对 harness engineering 的初步印象。

"Harness"这个术语已经成为一种简称，指代 AI agent 中除模型以外的一切——[Agent = Model + Harness](https://blog.langchain.com/the-anatomy-of-an-agent-harness/)。这是一个非常宽泛的定义，因此值得针对不同类别的 agent 加以收窄。我想在这里自由地在**使用编码代理**这一限定上下文中定义它的含义。在编码代理中，harness 的一部分已经内置了（例如通过 system prompt、代码检索机制，甚至[复杂的编排系统](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)）。但编码代理也为我们（它的用户）提供了许多特性，让我们可以为自己的用例和系统构建外层 harness。

> **旁注：隐喻的局限**
>
> 有人指出，在 harness 外面再套 harness 说不通："你试过把安全带套在狗的里面吗？"所以这多少有些牵强，但如果它能帮助我们理解这个词的用法，我可以接受这个瑕疵。

一个构建良好的外层 harness 有两个目标：提高 agent 一次就做对的概率，并提供反馈循环，在问题到达人类眼前之前尽可能多地自我纠正。最终它应该减少审查的苦差事、提升系统质量，同时还能减少浪费的 token。

## 前馈与反馈（Feedforward and Feedback）

为了驾驭编码代理，我们既要预判不想要的输出并尝试预防，也要部署传感器让 agent 能够自我纠正：

- **Guides（前馈控制）**——预判 agent 的行为，在它行动**之前**加以引导。Guides 提高 agent 首次就产出好结果的概率。
- **Sensors（反馈控制）**——在 agent 行动**之后**进行观察，帮助它自我纠正。当信号针对 LLM 消费做了优化时特别强大，例如自定义 linter 消息中包含纠正指令——一种正向的 prompt injection。

单独使用其中任何一种都不够：只有反馈，agent 会不断重复同样的错误；只有前馈，agent 编码了规则但永远不知道它们是否真正生效。

## 计算型 vs 推理型（Computational vs Inferential）

Guides 和 sensors 有两种执行类型：

- **计算型（Computational）**——确定性的，快速的，由 CPU 执行。测试、linter、类型检查器、结构分析。毫秒到秒级完成，结果可靠。
- **推理型（Inferential）**——语义分析、AI 代码审查、"LLM-as-judge"。通常由 GPU 或 NPU 执行。更慢更贵，结果更具非确定性。

计算型 guides 通过确定性工具提高好结果的概率。计算型 sensors 足够廉价和快速，可以在 agent 每次改动时伴随运行。推理型控制当然更昂贵且非确定性，但允许我们提供丰富的指导，并增加额外的语义判断。尽管具有非确定性，推理型 sensors 在使用强模型（或者更准确地说，适合当前任务的模型）时尤其能增强我们的信任。

**示例：**

| 方向 | 计算型/推理型 | 示例实现 |
|------|-------------|----------|
| 编码规范 | 前馈 · 推理型 | AGENTS.md、Skills |
| 新项目引导说明 | 前馈 · 两者皆有 | 包含说明和引导脚本的 Skill |
| 代码修改 | 前馈 · 计算型 | 接入 OpenRewrite recipes 的工具 |
| 结构性测试 | 反馈 · 计算型 | pre-commit hook 运行 ArchUnit 测试检查模块边界违规 |
| 审查说明 | 反馈 · 推理型 | Skills |

> **旁注：Harness Engineering 与 Context Engineering 的关系**
>
> [Context engineering](https://martinfowler.com/articles/exploring-gen-ai/context-engineering-coding-agents.html) 为我们提供了将 guides 和 sensors 提供给 agent 的手段。为编码代理设计用户 harness 是 context engineering 的一种特定形式。

## 转向循环（The Steering Loop）

人在其中的工作是通过迭代 harness 来**转向**（steer）agent。每当一个问题反复出现，前馈和反馈控制就应当改进，使该问题未来不太可能发生，甚至完全避免。

在转向循环中，我们当然也可以用 AI 来改进 harness。编码代理现在使得构建更多自定义控制和自定义静态分析变得廉价得多。Agent 可以帮忙编写结构性测试、从观察到的模式生成规则草稿、搭建自定义 linter 的脚手架，或者从代码库考古中创建操作指南。

## 时机：质量左移（Keep Quality Left）

实践[持续集成](https://martinfowler.com/articles/continuousIntegration.html)的团队一直面临这样的挑战：根据成本、速度和关键性，将测试、检查和人工审查分布在开发时间线上。当你追求[持续交付](https://martinfowler.com/bliki/ContinuousDelivery.html)时，理想状态是每次提交都处于可部署状态。你希望将检查尽可能左移到生产路径的早期，因为越早发现问题，修复成本越低。反馈 sensors——包括新的推理型 sensors——需要相应地分布在整个生命周期中。

**变更生命周期中的前馈与反馈：**

- 什么检查足够快，应该在集成之前甚至创建 commit 之前就运行？（如 linter、快速测试套件、基础代码审查 agent）
- 什么检查更昂贵，因此只应在集成后的流水线中运行（在重复快速检查之外）？（如变异测试、更全面的代码审查）

**持续漂移与健康传感器：**

- 什么类型的漂移是逐渐累积的，应该由在变更生命周期之外持续运行的 sensors 监控？（如死代码检测、测试覆盖率质量分析、依赖扫描）
- 什么运行时反馈可以让 agent 监控？（如让它们关注恶化的 SLO 并建议改进方案，或 AI judge 持续采样响应质量并标记日志异常）

## 调节类别（Regulation Categories）

Agent harness 像一个[控制论](https://en.wikipedia.org/wiki/Cybernetics)调节器，结合前馈和反馈将代码库调节到期望状态。区分期望状态的多个维度是有用的，按 harness 应该调节什么来分类。区分这些类别有助于讨论，因为可 harness 性和复杂度在不同类别间有所不同，限定词也让一个原本非常泛化的术语有了更精确的语言。

以下是我目前认为有用的三个类别：

### 可维护性 Harness（Maintainability Harness）

本文给出的几乎所有示例都是关于调节内部代码质量和可维护性的。这是目前最容易的 harness 类型，因为我们有大量现成工具可用。

为了反思这些可维护性 harness 方法在多大程度上增加了我对 agent 的信任，我将[之前编目的常见编码代理失败模式](https://martinfowler.com/articles/exploring-gen-ai/13-role-of-developer-skills.html)与其进行了对照。

计算型 sensors 可靠地捕获结构性问题：重复代码、圈复杂度、缺失的测试覆盖率、架构漂移、风格违规。这些工具廉价、成熟且确定性。

LLM 可以部分解决需要语义判断的问题——语义重复的代码、冗余测试、暴力修复、过度设计的方案——但代价昂贵且结果是概率性的。不能在每次 commit 时都运行。

两者都无法可靠捕获一些影响更大的问题：误诊、过度工程和不必要的功能、误解的指令。它们有时能抓到，但不够可靠，无法减少监督。如果人类一开始就没有清楚地说明想要什么，那么正确性就不在任何 sensor 的职责范围内。

### 架构适应性 Harness（Architecture Fitness Harness）

这组 guides 和 sensors 定义和检查应用的架构特征。本质上就是[适应度函数（Fitness Functions）](https://www.thoughtworks.com/en-de/radar/techniques/architectural-fitness-function)。

示例：

- 通过 Skills 前馈性能要求，通过性能测试反馈给 agent 它是改善了还是恶化了性能。
- 通过 Skills 描述更好的可观测性编码规范（如日志标准），并通过调试说明让 agent 反思它可用日志的质量。

### 行为 Harness（Behaviour Harness）

这是房间里的大象——我们如何引导和感知应用在功能上是否按照我们的需要运行？目前，我看到大多数给编码代理高自主权的人是这样做的：

- **前馈：** 功能规格说明（详细程度不等，从简短提示到多文件描述）
- **反馈：** 检查 AI 生成的测试套件是否通过、是否有较高覆盖率，有些人甚至用变异测试监控其质量。然后结合人工测试。

这种方法对 AI 生成的测试赋予了过多信任，目前还不够好。我的一些同事在使用 [approved fixtures](https://lexler.github.io/augmented-coding-patterns/patterns/approved-fixtures/) 模式时看到了不错的效果，但它在某些领域比其他领域更容易应用。他们在合适的地方选择性使用，它不是测试质量问题的通用答案。

总的来说，我们在构建良好的功能行为 harness 方面还有很多工作要做，以增强信心到足以减少监督和人工测试的程度。

## 可 Harness 性（Harnessability）

并非每个代码库都同等地适合被 harness。用强类型语言编写的代码库天然拥有类型检查作为 sensor；清晰可定义的模块边界为架构约束规则提供了抓手；像 Spring 这样的框架抽象掉了 agent 甚至不需要担心的细节，因此隐式地提高了 agent 的成功率。没有这些属性，这些控制就无从构建。

> **旁注：环境可供性（Ambient Affordances）**
>
> 我的同事 Ned Letcher 用"ambient affordances"来描述使 agent 环境更具可 harness 性的属性："环境本身的结构性属性，使其对在其中运作的 agent 而言可读、可导航、可操作。"

这在新建项目和遗留系统中有不同的表现。新建项目的团队可以从第一天起就内建可 harness 性——技术决策和架构选型决定了代码库的可治理程度。遗留系统的团队，尤其是那些累积了大量技术债的应用，面临更困难的问题：harness 在最需要它的地方最难构建。

## Harness 模板（Harness Templates）

大多数企业都有几种常见的服务拓扑，覆盖了 80% 的需求——通过 API 暴露数据的业务服务、事件处理服务、数据仪表盘。在许多成熟的工程组织中，这些拓扑已经被编纂为服务模板。未来这些可能演进为 harness 模板：一组 guides 和 sensors 的集合，将编码代理约束在某个拓扑的结构、规范和技术栈上。团队可能开始部分基于已有哪些可用的 harness 来选择技术栈和架构。

> **旁注：Ashby 定律（Ashby's Law）**
>
> [Ashby 必要多样性定律](https://en.wikipedia.org/wiki/Variety_(cybernetics)#Law_of_requisite_variety)是支持这些预定义拓扑的另一个有趣论点。该定律指出，调节器必须具备与被调节系统至少同等的多样性，且只能调节它所能建模的部分。基于 LLM 的编码代理几乎什么都能生成，但承诺一种拓扑就收窄了那个空间，使全面的 harness 更加可行。定义拓扑是一种多样性缩减手段。

当然我们会面临与服务模板类似的挑战。一旦团队实例化它们，就开始与上游改进脱节。Harness 模板将面临同样的版本控制和贡献问题，也许更糟，因为非确定性的 guides 和 sensors 更难测试。

## 人的角色（The Role of the Human）

作为人类开发者，我们将自己的技能和经验作为隐性的 harness 带入每个代码库。我们内化了惯例和好的实践，我们切身感受过复杂度带来的认知痛苦，我们知道自己的名字在 commit 上。我们还带来了组织层面的对齐——对团队目标的认知、哪些技术债是出于商业原因被容忍的、以及在这个特定上下文中什么算"好"。我们以小步和人类的节奏前进，这创造了让经验被激活和应用的思考空间。

编码代理不具备以上任何一项：没有社会问责，不会对 300 行的函数感到审美上的厌恶，没有"我们这里不这么干"的直觉，也没有组织记忆。它不知道哪个惯例是承重的、哪个只是习惯，也不知道技术上正确的方案是否符合团队的目标。

Harness 是将人类开发者经验中隐性的东西外化、显性化的尝试，但它能做到的程度有限。构建一个由 guides、sensors 和自我纠正循环组成的连贯系统是昂贵的，因此我们必须带着清晰的目标来排优先级：**好的 harness 不应以完全消除人的投入为目标，而是将人的投入导向最重要的地方。**

## 一个起点——和开放问题

我在这里展开的心智模型描述了实践中已经在发生的技术，并帮助构建关于我们仍需解决什么的讨论框架。它的目标是将对话提升到功能层面之上——从 Skills 和 MCP 服务器上升到我们如何战略性地设计一个控制系统，让我们对 agent 的产出真正有信心。

以下是当前话语中一些与 harness 相关的案例：

- [OpenAI 的一个团队记录了他们的 harness](https://openai.com/index/harness-engineering/)：通过自定义 linter 和结构性测试强制执行分层架构，并定期进行"垃圾回收"来扫描漂移并让 agent 建议修复。他们的结论是："我们目前最困难的挑战集中在设计环境、反馈循环和控制系统上。"
- [Stripe 关于他们 minions 的文章](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents)描述了诸如 pre-push hooks 根据启发式运行相关 linter、强调"将反馈左移"的重要性，以及他们的"blueprints"展示了如何将反馈 sensors 集成到 agent 工作流中。
- 变异测试和结构性测试是过去未被充分利用的计算型反馈 sensors 的例子，现在正在复兴。
- 开发者中越来越多地讨论将 LSP 和代码智能集成到编码代理中，这是计算型前馈 guides 的例子。
- 我听到 Thoughtworks 团队解决架构漂移的故事，他们同时使用计算型和推理型 sensors，例如用 agent 和自定义 linter 的组合提高 API 质量，或用"清洁工大军"提高代码质量。

仍有大量需要解决的问题，不仅仅是已经提到的行为 harness。随着 harness 增长，我们如何保持其连贯性，让 guides 和 sensors 同步、不相互矛盾？当指令和反馈信号指向不同方向时，我们能在多大程度上信任 agent 做出合理的权衡？如果 sensors 从不触发，这是高质量的标志还是检测机制不足？我们需要一种类似于代码覆盖率和变异测试之于测试的方式来评估 harness 的覆盖度和质量。前馈和反馈控制目前分散在各个交付步骤中，在帮助配置、同步和将它们作为一个系统来推理的工具方面有真正的潜力。构建这个外层 harness 正在成为一项持续的工程实践，而非一次性的配置。

---

## 致谢

特别感谢 Doppler 团队在我们上次技术雷达会议上的精彩讨论，尤其是 Kief Morris 提出的控制论视角。感谢 Ned Letcher、Chris Ford 和 Ben O'Mahoney 关于 harness 到底是什么的对话，感谢 Matteo Vaccari 关于行为 harness 的洞见。以及所有花时间阅读草稿并提供大量宝贵反馈的人：Christoph Burgmer、Jörn Dinkla、Michael Feathers、Karrtik Iyer、Swapnil Phulse、Paul Sobocinski、Zhenjia Zhou。

GenAI（Claude 和 Claude Code）被用于研究、从既有笔记中提取相关想法以及打磨语言。

---

*修订历史：*
- *2026 年 4 月 2 日：发表完整文章，引入 guides、sensors、计算型/推理型要素和 harness 模板*
- *2026 年 2 月 17 日：发表关于 Harness Engineering 的[初始备忘录](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering-memo.html)*
