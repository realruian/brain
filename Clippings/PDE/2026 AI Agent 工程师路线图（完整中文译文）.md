# 2026 AI Agent 工程师路线图（完整中文译文）


来源

**原文标题**：The 2026 AI Agent Engineering Roadmap
**原文链接**：:[link]{href="https://github.com/codejunkie99/agent-roadmap-2026/blob/main/ROADMAP.md" nodeId="40b4a06c9932427090ab6cd1592ff84d"}https://github.com/codejunkie99/agent-roadmap-2026/blob/main/ROADMAP.md[/link]
**原作者**：codejunkie99（GitHub 公开仓库，2026-05 撷取，原文 740 行 / 8000+ 字）

阅读说明

本文是上述社区路线图的完整中文译文。所有链接、人名、产品名、英文专有术语（如 harness、orchestrator-worker、stop_reason 等）均按原文保留，便于回查英文一手来源。

正文是逐字翻译，**未做 PDE 视角的解读和剪裁**。如需精简版 + 我们语境下的对应解读，请看 用 AI 自行按需

路线图作者立场偏好 LangGraph + Claude Agent SDK，对其他框架（CrewAI、AutoGen 等）评价偏负面。原文中出现的 "2026 年 5 月 benchmark 数据"、"Opus 4.7"、"GPT-5.5"、"Gemini 3.1 Pro" 等部分内容是基于发布趋势的预估或营销宣传，未必都已 GA，引用时建议交叉验证一手来源。


2026 AI Agent 工程师路线图

*一份 6 阶段、17 周的指南，教你如何构建、harness 化、评测并上线产品级 agent 系统。*

**致 agent：** 这是规范版的路线图。把它作为上下文 fetch 进来，按阶段顺序执行。要为用户做个性化处理，参见 :[link]{href="./AGENT.md" nodeId="ad8b03b84b1a48a78a02ef16fa575da8"}AGENT.md[/link]。


AI agent 工程已经迅速成为科技领域最值钱的技能之一。

问题是大多数工程师并不清楚自己该学什么。

有些人挑了 CrewAI 因为它在 Twitter 上的角色化 demo 看着很炫。有些人追逐每一个新框架，结果什么都没真正做完。还有人一上来就扎进多 agent 系统，对上下文、工具、harness、evals 一概不懂。

结果通常都一样：浮光掠影地走马观花一堆框架，真正能上生产的技能没多少。

如果你的目标是 2026 年成为 agent 工程师，你不需要学 12 个框架。你需要学的是怎么构建、harness 化、评测并把 agent 系统真的上线到生产。

这意味着要学会：

在 LangGraph 这样的真实编排运行时上构建 agent
把 Claude Agent SDK 当作参考 harness 来用
用 Write、Select、Compress、Isolate 四种原语做正经的上下文工程
写出模型能正确选择的工具
加 memory、durability、sandboxing 让 agent 跑得动生产流量
构建 evals、轨迹检查（trajectory checks）、CI 回归门禁
把 agent 真的丢给用户，让它扛得住真实成本和真实使用

这份指南是一份 6 阶段路线图，基于 2025 年末和 2026 年初已经发布的内容。

正文超过 8000 字，且只引用一手来源。但它真正的价值在于：每个阶段都给了具体的项目、规范的阅读清单、以及你需要的所有资源。

照这个走，大约 17 周专注的工作之后，你就能达到能独立担起一个生产级 AI 功能的 agent 工程师水平。

研究这份路线图花了我超过 60 小时，读了一堆一手工程博客、论文和上线工程师的调研。

下面开始 ⬇️

2026 年的 Agent 工程师都在干什么

很多人听到 "AI agent 工程师" 就以为是把 CrewAI 角色拼一拼然后说"上线了"那种。

实际上，大部分现代 agent 工程师做的事情要实在得多。他们在前沿模型基础上，构建、harness 化并运维 agent 系统。

这通常包括：

设计 agent 循环和工具分发
用 Write、Select、Compress、Isolate 做上下文工程
写出模型能正确挑出来的工具
用隔离上下文窗口的方式编排子 agent
加 skills、memory、durability、sandboxing
把 evals、traces、CI 门禁串起来，让"变好"成为可量化的事

同样的模型，不同的 harness，结果天差地别。

Anthropic 自己的实测：Opus 4.5 在 Claude Code 里 CORE 评分 78%，在 Smolagents 里只有 42%。同一个模型。就这样。

这道差距就是 harness 工程，也是这份路线图的主题。

每个 agent 构建者必须懂的四种上下文原语：Write（暂存区、记忆文件）、Select（在使用点检索）、Compress（在上下文窗口 85–95% 时做总结）、Isolate（带独立上下文窗口的子 agent）。

Anthropic 的多 agent 研究系统就是用这套模式，在广度优先研究任务上比单 agent Opus 4 强 90.2%，代价是 ~15× 的 token 消耗。

实际上 2026 年值得深入学习的栈只有两个：LangGraph 1.0 + Deep Agents，以及 Claude Agent SDK。其他要么在淡出，要么被吸收，要么是这两者在生产环境下的劣化版。

在路线图全程跟进的免费资源

下面这些是真正在持续输出信号的免费博客、课程、频道、newsletter。

在 Phase 0 就先订阅起来，路线图后面的每一步就能持续接收到新博文、案例研究和一手更新。这些都没付费墙，而且大多数更新比任何教科书都快。

**值得订阅的工程博客**

:[link]{href="https://anthropic.com/engineering" nodeId="a14b23eeec114dc29f6a362de5479482"}Anthropic 工程博客(免费、官方)[/link] —— 如果你只读一个博客,就读这个。上下文工程、harness 设计、多 agent 研究、高级工具使用、evals。全是一手来源,本路线图里反复引用。
:[link]{href="https://blog.langchain.com/" nodeId="e34dcbae2ffb4938be428a83d1456ba5"}LangChain 博客(免费)[/link] —— harness、middleware 和 Deep Agents 这套方法论在公共领域成型的地方。Lance Martin、Vivek Trivedy、Harrison Chase 写的全部要读。
:[link]{href="https://cookbook.openai.com/" nodeId="0824f30ababd48d083d671ce51f8c063"}OpenAI Cookbook(免费、GitHub)[/link] —— 每个 API 特性都有可运行的 notebook。工具使用、结构化输出、evals、agents。跟着敲。
:[link]{href="https://hamel.dev/" nodeId="fb6b7044fbec41dba5ecb7ba11265f0e"}Hamel Husain 的博客(免费)[/link] —— 《Your AI Product Needs Evals》是大家都引的那篇评测文章。整个站点其他内容也是一个量级。要做 evals,这份至少读两遍。
:[link]{href="https://eugeneyan.com/" nodeId="3c95752b04dd41318a3c7aba124719d3"}Eugene Yan 的博客(免费)[/link] —— 《Patterns for Building LLM-based Systems & Products》是大家都引的实操总结。观点鲜明,而且经过真实上线检验。
:[link]{href="https://lilianweng.github.io/" nodeId="8ac7e18bbeaa44ea82773baa558cdefe"}Lilian Weng 的博客(免费)[/link] —— agents、prompt 工程、幻觉、对齐方面的长篇深度文章。本领域写得最清晰的综述。
:[link]{href="https://simonwillison.net/" nodeId="67a6407ce93e4cd999633ab8b7f44044"}Simon Willison 的博客(免费)[/link] —— 一个真在写代码的高级工程师每天的笔记。用来对噱头降火、第一时间发现奇怪的 edge case。
:[link]{href="https://huyenchip.com/" nodeId="a98dec11744e42c2945bf4aae91eb8f9"}Chip Huyen 的博客(免费)[/link] —— 从第一性原理讲 ML 系统。她那篇《Building LLM applications for production》是 Phase 5 之前的必读。
:[link]{href="https://philschmid.de/" nodeId="d5cdca00a6914156930756e7dacc293e"}Phil Schmid 的博客(免费)[/link] —— HuggingFace、Gemini、微调、部署的端到端实操指南。永远带代码。
:[link]{href="https://cameronrwolfe.substack.com/" nodeId="4c86ef3a42e1468fbde07cf09661a01e"}Cameron Wolfe 的 Deep (Learning) Focus(免费)[/link] —— 长篇论文拆解。一篇文章顶你追完一个研究方向。

**值得做完的免费课程**

:[link]{href="https://deeplearning.ai/short-courses" nodeId="6c7fe075b2ba42e8ae7199eb6846643e"}DeepLearning.AI Short Courses(免费)[/link] —— 1-2 小时的短课,几乎全免费。其中 LangGraph 课(和 LangChain 合作)和 Andrew Ng 的《Agentic AI》课(Reflection、Tool Use、Planning、Multi-Agent design patterns)是 Phase 0 该完成的两门。
:[link]{href="https://academy.langchain.com/courses/intro-to-langgraph" nodeId="e07ec85089a54fcc8f1e64ff1b7742a7"}LangChain Academy: Introduction to LangGraph(免费)[/link] —— 官方免费课。状态、记忆、人在回路、多 agent。Phase 2 做。
:[link]{href="https://github.com/anthropics/prompt-eng-interactive-tutorial" nodeId="9d1c908a55d3403faf5f57f2ad8111a6"}Anthropic Interactive Prompt Engineering Tutorial(免费、GitHub)[/link] —— 9 章 Jupyter notebook,对接 Claude API。练 prompt 肌肉记忆最快的方式。
:[link]{href="https://huggingface.co/learn/agents-course" nodeId="ac0d5d121ae942dd96f5d0fcc23ea4b6"}HuggingFace Agents Course(免费)[/link] —— agents、smolagents、MCP、评测的端到端覆盖。免费证书。
:[link]{href="https://huggingface.co/learn/llm-course" nodeId="03af4452f9dd4a34be66b4be66c002b1"}HuggingFace LLM Course(免费)[/link] —— 基础:tokenization、transformers、微调。即便你只在 API 上做开发,这些底层背景也用得到。
:[link]{href="https://freeacademy.ai/" nodeId="9d4a75dd5f7449f1bd26ab983e6558b3"}MCP Fundamentals on FreeAcademy(免费)[/link] —— 写 MCP server,连 Claude,写自定义工具。MCP 入门最快路径。

**YouTube 频道和讲座**

:[link]{href="https://youtube.com/@AndrejKarpathy" nodeId="a0df0196f51e4637bbebc94c3e9819a3"}Andrej Karpathy(免费)[/link] —— Neural Networks: Zero to Hero 用纯 Python 从零造 GPT。他 2026 年在 Sequoia AI Ascent 的"Vibe Coding to Agentic Engineering"演讲是讲清楚 harness 工程为什么重要的最佳一手材料。
:[link]{href="https://youtube.com/@aiDotEngineer" nodeId="06cc9500db98451ab7e3c2d58b7c49fa"}AI Engineer(免费)[/link] —— 所有 AI Engineer Summit 和 World's Fair 的演讲。搜 Hamel Husain、swyx、Anthropic 工程师、Erik Schluntz。
:[link]{href="https://youtube.com/@LangChain" nodeId="26b65cb90c85454198e71326b0d66ecd"}LangChain(免费)[/link] —— 每周 LangGraph、Deep Agents、middleware、各种集成的教程。新功能往往最先以视频形式出现在这。
:[link]{href="https://youtube.com/@anthropic-ai" nodeId="bc0693a73d154193bf5312e679f91299"}Anthropic(免费)[/link] —— Anthropic 工程师的演讲。多 agent 研究的全过程讲解、Claude Code 内部机制、Skills。
:[link]{href="https://youtube.com/@YannicKilcher" nodeId="1c171cd8405e4fa2a5fd166ec8190e7a"}Yannic Kilcher(免费)[/link] —— 论文拆解。省下你自己看每一篇 arXiv 预印本的时间。
:[link]{href="https://youtube.com/@lexfridman" nodeId="5fa7ecca10be4889acfdb18a9ff983d5"}Lex Fridman 的 YouTube 播客(免费)[/link] —— 与 AI 领域研究和构建者的长访谈。Karpathy、Schulman、Sutskever、Amodei。

**值得订阅的 newsletter**

:[link]{href="https://latent.space/" nodeId="22b486c4743740f98724c86f5909a921"}Latent Space by swyx and Alessio(免费)[/link] —— AI 工程师的技术 newsletter。AINews 每日汇总、播客、年度《AI Engineering Reading List》。如果只订一个,就订这个。
:[link]{href="https://deeplearning.ai/the-batch" nodeId="d6f25da547744ee98a3b3d298413ee8f"}The Batch by Andrew Ng(免费)[/link] —— 每周宽光谱报道。便于你察觉某件事开始破圈。
:[link]{href="https://importai.substack.com/" nodeId="06b358ad373949dfbd9e8fc0772b4860"}Import AI by Jack Clark(Anthropic 联合创始人)(免费)[/link] —— 政策 + 研究综述。最接近这个领域战略级背景简报的东西。
:[link]{href="https://bensbites.com/" nodeId="23cef81a50314c93a0c89227a529de92"}Ben's Bites(免费)[/link] —— 每天 5 分钟 AI 新闻。只要扫读。用来抓你可能错过的发布。
:[link]{href="https://tldr.tech/ai" nodeId="adc31321b30a4c2daa66cbb57d013bbc"}TLDR AI(免费)[/link] —— 每日摘要,低噪音。配上面的深度 newsletter 一起用。
:[link]{href="https://aiengineerpack.com/" nodeId="1ec3b433788a428b9b7d56acb7eaa212"}AI Engineer Pack by swyx(免费)[/link] —— AI 工程师的免费 credit、工具、资源策展页。持续更新。

**值得研究的开源仓库**

:[link]{href="https://github.com/anthropics/anthropic-cookbook" nodeId="4c692942cbe64a5a9f5f9b7ce1a103bf"}Anthropic Cookbook(免费、GitHub)[/link] —— 每种 workflow 模式的参考实现。Phase 0 必备。每完成一个阶段后再回来看一遍。
:[link]{href="https://github.com/openai/openai-cookbook" nodeId="ec1585de917b4b1591496a0918f12fbd"}OpenAI Cookbook(免费、GitHub)[/link] —— OpenAI 这边对应的同类资源。工具使用、结构化输出、evals、agents。
:[link]{href="https://github.com/langchain-ai/deepagents" nodeId="8b18493d62774fe4a347ec7650952b67"}deepagents by LangChain(免费、GitHub)[/link] —— LangGraph 之上的开源 harness 参考实现。Phase 3 自己写 harness 时读它的 middleware 文件。
:[link]{href="https://github.com/langchain-ai/langgraph/tree/main/examples" nodeId="273e0fdb7bda463d86af9a4fa18acbc2"}LangGraph examples(免费、GitHub)[/link] —— 可运行的 LangGraph 模式。Supervisor、分层团队、规划、客户支持 agent。
:[link]{href="https://github.com/UKGovernmentBEIS/inspect_evals" nodeId="316141a32e9e498d8ad88b42e65bfca2"}inspect_evals(免费、GitHub)[/link] —— 200+ 标准 evals 打包成 Python 包。GAIA、SWE-bench、Cybench、BFCL。
:[link]{href="https://github.com/EthicalML/awesome-agentic-engineering-resources" nodeId="fb359be2e77c48a299b16d6a490adcd0"}awesome-agentic-engineering-resources(免费、GitHub)[/link] —— 社区维护的 agent 工程资源索引。本路线图没覆盖的可以从这里找。

**通勤听的播客**

:[link]{href="https://latent.space/" nodeId="05e0fbb592034af2ab8b4d4ec54e63b3"}Latent Space(免费)[/link] —— 与本领域上线者的长访谈。Anthropic、OpenAI、LangChain、Modal、E2B 都上过。
:[link]{href="https://dwarkeshpatel.com/" nodeId="7a83d0607d5e47448eccdd0ed8019810"}Dwarkesh Podcast(免费)[/link] —— AI 战略、能力、政策的长访谈。长篇,一手来源。
:[link]{href="https://twimlai.com/" nodeId="80c0ca1192624c38b6d75f949d666827"}The TWIML AI Podcast by Sam Charrington(免费)[/link] —— 每周与研究者和工程师的技术访谈。
:[link]{href="https://changelog.com/practicalai" nodeId="da4a850a23bc4bec8391120a46e84d3a"}Practical AI(免费)[/link] —— 工程导向。少噱头多上线。
:[link]{href="https://mattturck.com/themadpodcast" nodeId="63f3d62a1ecb4a498a821f9305ef8056"}The MAD Podcast by Matt Turck(免费)[/link] —— 创始人 + 投资人视角看数据和 AI 生态。用来跟踪谁在上线、谁在融资。

**值得加入的社区**

:[link]{href="https://discord.gg/langchain" nodeId="223114b5c8724f89b776502385e8e61b"}LangChain Discord(免费)[/link] —— LangGraph 和 Deep Agents 核心团队都在。#help 频道很活跃。
:[link]{href="https://hf.co/join/discord" nodeId="14218df15e4d4c189150e9cfe4d09597"}HuggingFace Discord(免费)[/link] —— 最大的开源权重和 ML 社区。
:[link]{href="https://reddit.com/r/LocalLLaMA" nodeId="770650ed0e85421a89b68aea09fdd824"}r/LocalLLaMA(免费)[/link] —— 开源权重模型的新闻、benchmark、工具。常常比官方渠道还快。
:[link]{href="https://ai.engineer/" nodeId="227c689468574dbdbd0ece995fc23873"}AI Engineer World's Fair(免费、需注册)[/link] —— 该领域的职业网络。招聘信息、招聘频道、工作组。
:[link]{href="https://anthropic.com/discord" nodeId="e8b60c46f38e4362995723a7f35005fa"}Anthropic Discord(免费)[/link] —— Claude 开发者社区。Skills 分享、hooks 模式、MCP server。

*重点关注什么:* 在 Phase 0 选一个博客、一份 newsletter、一个播客、一个社区。不要试图一次性跟进 40+ 资源。等已有的开始不再带给你惊喜,再加新的。这个清单的意义是给你广度好做选择,不是让你逐项打勾。


Phase 0：基础（1-2 周）

**本阶段目标：** 建立正确的心智模型。除了一次性脚本之外，一行 agent 代码都不要写。

大多数初学者跳过这个阶段，直奔框架教程，结果代码出问题时根本无法分析。别跳。

学什么

**1. Augmented LLM 与 workflow vs agent 的区别**

碰框架之前,你要先理解 Anthropic 总结的 5 种 workflow 模式(prompt 链、路由、并行化、orchestrator-worker、evaluator-optimizer),以及为什么 workflow ≠ agent。

workflow 的控制流是你写死的;agent 在循环里自己决定控制流。这一区分能帮你避免把本该是链的东西写成 agent。

**资源:**

:[link]{href="https://anthropic.com/research/building-effective-agents" nodeId="668b98dcf6f04e1bb3b4768931edb665"}Building Effective Agents by Anthropic(Erik Schluntz 和 Barry Zhang)(2024 年 12 月)(免费、官方)[/link] —— 5 种 workflow 模式 + augmented-LLM 概念。本领域所有人都引用。先读这篇。
:[link]{href="https://github.com/anthropics/anthropic-cookbook" nodeId="53eba4dee03648d7a5726d6f029b16db"}Anthropic Cookbook(patterns/agents 目录)(免费、GitHub)[/link] —— 每种 workflow 模式都有可运行的 notebook 实现。跟着敲,不要只读。
:[link]{href="https://simonwillison.net/2024/Dec/20/building-effective-agents/" nodeId="d0dde03528cd4d64beb71fd622c98911"}Simon Willison 对 Building Effective Agents 的批注(免费)[/link] —— 一位高级工程师对同一篇论文的清醒视角。

*重点关注:* workflow 与 agent 的区别、augmented-LLM 心智模型、orchestrator-worker 模式、为什么并行化通常优于串行推理、Anthropic 明确警告的失败模式。


**2. 把上下文工程当成一门学科**

prompt engineering 在 2026 年作为独立技能已经死了。它的接班人是上下文工程:在 agent 循环的每一步,决定模型面前是哪些 token。

**资源:**

:[link]{href="https://anthropic.com/engineering/effective-context-engineering-for-ai-agents" nodeId="5a4e3c8427dd476eb236e8ce0d8922fd"}Effective context engineering for AI agents by Anthropic(2025 年 9 月 29 日)(免费、官方)[/link] —— 这一篇读两遍。把它的框架背下来。
:[link]{href="https://blog.langchain.com/context-engineering-for-agents/" nodeId="f0758911ca81428f80e6a39745ed0aeb"}Context Engineering for Agents by Lance Martin(LangChain)(免费)[/link] —— Write、Select、Compress、Isolate 框架。一个就够的心智模型。
:[link]{href="https://anthropic.com/engineering/multi-agent-research-system" nodeId="5eba37f0c4ef43dc88a4fbc82325753c"}How we built our multi-agent research system by Anthropic(2025 年 6 月)(免费、官方)[/link] —— orchestrator-worker 参考架构、广度优先研究 90.2% 提升、15× token 警告。
:[link]{href="https://simonwillison.net/2025/Jun/14/multi-agent-research-system/" nodeId="d3bd29156c584e9a93b3776c38c2c925"}Simon Willison 对多 agent 研究博文的批注(免费)[/link] —— 对架构和成本权衡的清醒视角。

*重点关注:* Write、Select、Compress、Isolate 在代码层各对应什么;为什么子 agent 是隔离原语而不是并行原语;什么时候用 compaction、什么时候用 offloading、什么时候用 summarization。


**3. Harness 即操作系统**

把"harness"是什么讲清楚的一篇好文章。

**资源:**

:[link]{href="https://claudecode-lab.com/en/blog/claude-code-harness-engineering/" nodeId="be2aa971376e42ecbe380d3f423e6930"}The Complete Guide to Harness Engineering(ClaudeCodeLab)(免费)[/link] —— harness 三阶进化,带可运行代码。
:[link]{href="https://ml6.eu/en/blog/inside-the-claude-agents-sdk" nodeId="fe7bbdda9eb34f3ea3a9a8dad671b7a0"}Inside the Claude Agents SDK(ML6)(免费)[/link] —— CPU/RAM/OS/App 类比 + 78% vs 42% Opus 4.5 数据,本路线图的起点。
:[link]{href="https://anthropic.com/engineering/building-agents-with-the-claude-agent-sdk" nodeId="978e558f6b9145c9b5b224b8ce9c9ee9"}Building agents with the Claude Agent SDK(Anthropic)(免费、官方)[/link] —— SDK 为什么存在、为什么从 Claude Code SDK 改名而来。
:[link]{href="https://anthropic.com/engineering/effective-harnesses-for-long-running-agents" nodeId="2bf41025de6545afb9aba626a1ae6703"}Effective harnesses for long-running agents by Anthropic(2025 年 11 月 26 日)(免费、官方)[/link] —— Anthropic 自己的 harness 入门。和 Vivek Trivedy 的博文交叉验证同一组想法。
:[link]{href="https://anthropic.com/engineering/harness-design-long-running-apps" nodeId="33eaaabdbcf84a90b15bef228129f704"}Harness design for long-running application development by Anthropic(2026 年 3 月 24 日)(免费、官方)[/link] —— 续篇。session 拉到几小时几天后会变什么。Phase 3 也是必读。
:[link]{href="https://blog.langchain.com/how-to-think-about-agent-frameworks/" nodeId="cdae7c6f146c4bfc8c8f6443aa191d04"}How to think about agent frameworks by Harrison Chase(LangChain)(免费)[/link] —— 编排框架 vs 抽象层的区分。选任何东西之前必读。

*重点关注:* 循环、工具分发、上下文整理、持久化、hooks、子 agent 编排、可观测性。以及任何 harness 里它们各是怎么落地的。


**4. 2026 年现状**

**资源:**

:[link]{href="https://langchain.com/state-of-agent-engineering" nodeId="b89ae8964a3b48cfb78fe24a1598ea9e"}State of Agent Engineering(LangChain)(免费)[/link] —— 1340 份回收,2025 年 11-12 月。把这些数字记到脑子里:57% 的团队已上生产,89% 有可观测性,52% 有 evals,质量(32%)是首要瓶颈。
:[link]{href="https://blog.langchain.com/how-to-build-an-agent/" nodeId="3850d2446a6b4c5eae93bb06775aa498"}How to Build an Agent(LangChain)(免费)[/link] —— "智能实习生"框架,用来圈定 agent 该负责和不该负责什么。
:[link]{href="https://blog.langchain.com/continual-learning-for-ai-agents/" nodeId="298016e4ee3348b0b6d62ed153ac1f27"}Continual learning for AI agents by Harrison Chase(LangChain)(免费)[/link] —— agent 真正学习的三层:weights、prompts、memory。在伸手去 fine-tune 之前先建立这个框架。

*重点关注:* 团队在生产环境的痛点(quality、cost、reliability)、中位数技术栈长什么样、边际投入小时该花在哪。

**实践项目:** 自己手写一份 2 页的个人文档,用自己的话定义:workflow vs agent、augmented LLM、4 种上下文工程原语、orchestrator-worker 模式、harness/model/framework 的区别、你预期会在自己代码里出现的前 3 种 failure mode。

这份文档就是真正的交付物。如果不查资料就写不出来,说明你读得还不够仔细。


Phase 0 里程碑

完成本阶段后你应该能够：

不用任何框架行话解释 agent 是什么、与 workflow 有什么区别
说出 4 种上下文工程原语并各给一个代码层例子
说清楚为什么 2026 年 harness 比 model 贡献更大
描述 orchestrator-worker 模式以及 15× token 成本权衡
在架构层面而不是凭感觉选框架


Phase 1：搭出你的第一个简单 agent（2-3 周）

**本阶段目标：** 写两遍工具型 agent。一遍用 Anthropic 原生 SDK，一遍用 Claude Agent SDK harness。亲身感受一下"自己卷循环"和"站在真正的 harness 上"的区别。

这是理解 harness 给了你什么的最便宜路径。

学什么

**1. 从零写 agent 循环**

循环不是魔法。你拿 messages 和 tools 调模型,解析出 tool_use 块,执行工具,append tool_result,循环到 stop_reason == end_turn。

自己用 ~100 行写过一次,之后任何框架都变得能读。

**资源:**

:[link]{href="https://docs.anthropic.com/en/docs/build-with-claude/tool-use" nodeId="d78f6256064146489b5d5a09f9de392e"}Tutorial: Build a tool-using agent(Anthropic 官方文档)(免费、官方)[/link] —— tool_use、tool_result、并行工具调用、响应循环的参考实现。
:[link]{href="https://anthropic.com/engineering/writing-tools-for-agents" nodeId="243e989d84df43078ef77ccd86de11c8"}Writing tools for agents(Anthropic)(免费、官方)[/link] —— 设计任何工具之前先读这个。你写的工具描述和参数说明就是给 LLM 看的用户手册。
:[link]{href="https://anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills" nodeId="2473d9f342d547a9819caf2e6f689d7d"}Equipping agents for the real world with Agent Skills(Anthropic)(免费、官方)[/link] —— 写规范的人解释 progressive-disclosure 模式。

*重点关注:* request/response 循环何时终止、stop_reason 各值含义、并行工具调用怎么编码、工具抛错时怎么恢复、怎么把工具描述写得让模型选对。

**练习:** 用 ~100 行 `anthropic.messages.create` + tool spec 写一个"从零"的 agent。三个工具:`web_search`(用 Tavily 或 Firecrawl)、`read_file`、`write_file`。不用框架。跑一个研究任务,把每一步 trace 都读一遍。

**2. Claude Agent SDK 作为标准 harness**

Claude Agent SDK 就是驱动 Claude Code 的那个 harness。你要把它当参考来研究、当第一天就用的工具来用。

**资源:**

:[link]{href="https://platform.claude.com/docs/en/agent-sdk" nodeId="cdcf7453823d488fab8c0fe6ccfe9c34"}Claude Agent SDK 文档(免费、官方)[/link] —— Python 和 TypeScript SDK、hooks、子 agent、skills、Task 工具。
:[link]{href="https://code.claude.com/docs/en/agent-sdk/skills" nodeId="d9f6173679f144d4a5aaf178a96ed489"}Claude Agent SDK, Skills 参考(免费、官方)[/link] —— SKILL.md 文件怎么用、metadata frontmatter、progressive loading。
:[link]{href="https://github.com/MuhammadUsmanGM/claude-code-best-practices" nodeId="e30c9ee9ba174019a60bf3de2c7ab89a"}claude-code-best-practices by Muhammad Usman GM(免费、GitHub)[/link] —— 略读,不要照搬。看真实用户在干什么。
:[link]{href="https://github.com/shanraisshan/claude-code-best-practice" nodeId="9f3114ccf711446a9fe745386a076d03"}claude-code-best-practice by Shan Raisshan(免费、GitHub)[/link] —— 视角不同的同类合集。
:[link]{href="https://blog.langchain.com/evaluating-skills/" nodeId="dcab05c3b70b46ddab407e6f3efb4fba"}Evaluating Skills(LangChain)(免费)[/link] —— LangChain 怎么衡量一个 Skill 是不是真的有用。等本阶段写完第一个 Skill 想知道它有没帮你的时候读这个。

*重点关注:* CLAUDE.md 这种系统提示模式、Skills 怎么 progressive 加载、PreToolUse 和 PostToolUse hook、用 Task 工具派生子 agent、SDK 怎么处理权限弹窗。

**练习:** 用 `claude-agent-sdk` 重写上一节的同一个 agent。加一个 `CLAUDE.md` 写项目约定。加一个 Skill(带 `SKILL.md` 的目录)定义 "research-summary" 输出格式。加一个 PostToolUse hook,自动格式化 agent 写出的任何文件。用 Task 工具为某个子任务派生一个子 agent。

3. 上线点小东西

教程不算数。你需要一个定时跑、并且你会读它输出的真实程序。

**实践项目：** 一个每日简报 agent：读你本地的 Markdown 笔记和几个 RSS feed，产出一份带 citation 的总结简报，写到磁盘。用 `launchd` 或 `systemd` 定时。跑一周。看着它出问题。修。

Phase 1 里程碑

完成本阶段后你应该能够：

不用框架在 100 行内写出一个工具型 agent 循环
解释 stop_reason 各值含义、并行工具调用是怎么工作的
用 Claude Agent SDK 重新搭同一个 agent，带一个 Skill、一个 hook、一个子 agent
用 200 字说清楚：harness 替你免费做了什么、你在 from-scratch 版本里自己写了什么


Phase 2：用正经架构搭一个真实 agent（3-4 周）

**本阶段目标：** 在 LangGraph 1.0 + LangChain `create_agent` + Deep Agents 上搭一个多步、有持久化、有状态的 agent。

这就是你在生产环境多半会跑的栈。它的概念模型（节点+边的状态机、middleware、checkpointer）在哪儿都通用。

**为什么是这个栈，不是 Pydantic AI、OpenAI Agents SDK、CrewAI：**

在 Alice Labs 和 Channel.tel 的 "什么真上线了" 排行里，LangGraph 是唯一同时具备 durable execution、checkpointing、人在回路、通过 LangSmith 实现的一流可观测性、middleware 的框架。
`create_agent`（LangChain 1.0，2025 年 10 月）现在是基于 LangGraph 运行时的默认 agent 工厂。`create_react_agent` 已弃用。
Deep Agents（LangChain，2025 年 8 月发布；2026 年 4 月 v0.5 alpha）是其上的电池齐全的 harness。Planning、虚拟文件系统、子 agent、summarization、skills。是 Claude Code 那套 harness 在开源世界最接近的对应物，但是 model-agnostic。

学什么

**1. LangGraph 运行时**

由节点和边组成的状态图,加一个让你能 resume、rewind、fork 的 checkpointer。

**资源:**

:[link]{href="https://langchain-ai.github.io/langgraph/" nodeId="07ebbe959ad64d6e9cd26e6a11346162"}LangGraph 文档(免费、官方)[/link] —— 运行时参考。从 concepts 页开始,再看 quickstart。
:[link]{href="https://blog.langchain.com/doubling-down-on-deepagents/" nodeId="53cfc869993f4ba4bb16923cfb448ee5"}Doubling down on Deep Agents(LangChain)(免费)[/link] —— 把 harness、framework、runtime 三个概念分清楚。
:[link]{href="https://blog.langchain.com/context-management-for-deepagents/" nodeId="02700e98b6ed4a32a519df6d3c9a72ce"}Context Management for Deep Agents(LangChain)(免费)[/link] —— 工具响应 20K-token offload 模式 + 85% 上下文窗口压缩触发条件。
:[link]{href="https://blog.langchain.com/on-agent-frameworks-and-agent-observability/" nodeId="8f63ff26599041789f56f3cfc80f8794"}On Agent Frameworks and Agent Observability(LangChain)(免费)[/link] —— LangSmith 为什么是 OTEL 友好的,且不需要 LangChain 也能跑。即便你后来选了别的平台也有用。
:[link]{href="https://blog.langchain.com/deep-agents-v0-5/" nodeId="c4cf7896ed7c462a84a892064b832d44"}Deep Agents v0.5(LangChain)(免费)[/link] —— 2026 年 4 月发布说明。异步(非阻塞)子 agent、扩展的多模态文件系统支持、async TODO。在你给项目里 deepagents 钉版本之前读这个。

*重点关注:* state schema、节点、边、conditional edges、PostgresSaver checkpointer、time-travel 调试、人在回路 interrupt、middleware 怎么组合。

**2. Middleware 作为定制层**

Middleware 是不 fork 就能定制打包 agent 的方式。

**资源:**

:[link]{href="https://blog.langchain.com/how-middleware-lets-you-customize-your-agent-harness/" nodeId="b726f24485014486afd33b6b229afb3e"}How Middleware Lets You Customize Your Agent Harness(LangChain)(2026 年 3 月 26 日)(免费)[/link] —— before_agent、wrap_model_call、before_tools、after_tools 钩子。必读。
:[link]{href="https://blog.langchain.com/introducing-ambient-agents/" nodeId="387332213dfb42a1889c8474e3e4a884"}Introducing ambient agents(LangChain)(免费)[/link] —— 后台 agent 的 UX 模式:notify、question、review。

*重点关注:* 各 hook 在 agent 生命周期里何时触发、SummarizationMiddleware 和 FilesystemMiddleware 怎么组合、怎么用 30 行写自定义 middleware、什么时候 middleware 是对的而不是新写一个 node。

**3. 工具、MCP、code-execution 模式**

天真的 "把所有 MCP 工具加载进上下文" 模式是错的。正确做法是 MCP + code execution。

**资源:**

:[link]{href="https://anthropic.com/engineering/code-execution-with-mcp" nodeId="456d548b0f574c159b3fa5cb99633ebe"}Code execution with MCP(Anthropic)(2025 年 11 月)(免费、官方)[/link] —— 150K → 2K token 缩减。接任何 MCP server 之前读。
:[link]{href="https://anthropic.com/engineering/advanced-tool-use" nodeId="b58a2e40fd6b4fb0aa1382e30f0d2061"}Introducing advanced tool use(Anthropic)(免费、官方)[/link] —— `defer_loading: true` 把工具 token 削减 85%,把 Opus 4.5 在 MCP eval 上从 79.5% 抬到 88.1%。
:[link]{href="https://anthropic.com/engineering/managed-agents" nodeId="1c74a10b16374d3eb0f057b386667347"}Scaling Managed Agents(Anthropic)(免费、官方)[/link] —— session、harness、sandbox 的分离。即使你不用 Managed Agents 也读一下。
:[link]{href="https://composio.dev/" nodeId="6ed29d8b418e4b1683a9cdf505a946c1"}Composio 文档(免费版)[/link] —— 200+ SaaS 集成,自带 MCP gateway,凭据由它代管,永远不进模型上下文。
:[link]{href="https://arcade.dev/" nodeId="19409370a10d4c07ab62a37ca23b8fe0"}Arcade 文档(免费版)[/link] —— 当你需要按用户精细授权(而非服务级 auth)时用。

*重点关注:* `defer_loading`、把代码执行作为工具表面、为什么把 JSON 在模型里来回转换很贵、Composio 或 Arcade 怎么代管 SaaS 授权而不让凭据流入模型上下文。

**4. 不是向量数据库的几种 memory 选项**

**资源:**

:[link]{href="https://letta.com/" nodeId="aa2006c019594eb88c43378d1eef2af8"}Letta MemFS 在 LoCoMo 上的 benchmark(免费)[/link] —— 2026 年 4 月结果:基于文件系统的 memory,配 GPT-4o-mini 在 LoCoMo 上达到 74%,超过定制化 memory 工具。
:[link]{href="https://mem0.ai/" nodeId="dedbed325e12460ab9ae41ab9f8693e1"}Mem0 文档(免费)[/link] —— 用户级知识 memory。跨 session 的用户事实选这个。

*重点关注:* memory 三层(线程级用 PostgresSaver,用户级用 Mem0/Zep,自管型用 Letta)、为什么文件系统是默认对的选择、在你测出真有 recall 问题之前不要伸手去抓向量数据库。

**实践项目:** 搭一个 "研究分析师" deep agent。**实践项目：** 搭一个 "研究分析师" deep agent。

输入：一个研究问题。
主 agent 做 plan，把 TODO 写到虚拟文件系统，并行派 3 个搜索子 agent，每个有独立上下文。
子 agent 调 Tavily 或 Firecrawl，把结果写到文件，只把短摘要返回主 agent。永远不要把原始搜索结果传回主 agent 的上下文。
一个引用子 agent 验证 claim 是否对得上检索源。
一个写作 agent 产出最终带行内引用的 Markdown 报告。
所有状态通过 PostgresSaver 持久化。途中 kill 进程，能从断点恢复。
人在回路 interrupt：超过 1 美元 token 之前必须问用户确认。
用一个 `make demo` target 把整个 pipeline 端到端跑通。
README 里要讲清：用了哪些 middleware、为什么；哪些子 agent 是隔离上下文；你的上下文压缩策略是什么；进程被 kill 时你的 durability 故事是什么。
在 README 里附一份完整 LangSmith trace URL。

Phase 2 里程碑

完成本阶段后你应该能够：

搭一个多步 LangGraph agent，带 PostgresSaver 持久化和人在回路 interrupt
把 Deep Agents middleware（planning、filesystem、子 agent、summarization）作为打包 harness 来用
派生隔离上下文子 agent 并把压缩后的摘要返回主 agent
讲清你的上下文压缩策略和进程被 kill 时的 durability 故事
产出一份展示完整多步轨迹的 LangSmith trace URL


Phase 3：自己实现 harness 层（3-4 周）

**本阶段目标：** 不再用打包好的 harness，自己写一个轻的。在自己造过一次之前，你不会在生产环境做对 harness 取舍。

这是整份路线图里杠杆最大的阶段。

学什么

1. "harness" 由什么组成

把 Deep Agents 的 middleware 列表、Claude Agent SDK 的架构、Vivek Trivedy 的 harness-engineering 文章合起来看，harness 是下面这些的并集：

**loop control。** 驱动 model→tools→model 的 while 循环。
**tool dispatch。** 注册表、schema 校验、并行调用、错误恢复、retry。
**context management。** 系统提示拼装、消息历史在窗口 85-95% 时压缩、工具响应 ~20K token 时 offload、prompt caching。
**persistence。** 每个 node 后做 checkpoint，能 resume、rewind、fork。
**sub-agent 编排。** 派生隔离上下文的子 agent，把压缩摘要路由回来。
**skills 和 progressive disclosure。** 只在相关时加载能力。
**hooks。** PreToolUse、PostToolUse、PreCompact、Stop、SessionStart（Claude Code 这一组是规范）。
**可观测性。** 每个模型调用、工具调用、子 agent 调用都有 OTEL span，带 token 数和延迟。
**sandbox。** 代码执行和 MCP 工具调用都在容器里跑，模型永远拿不到容器凭据。
**auth 和 secrets brokering。** 凭据永不进模型上下文（Anthropic Managed Agents 模式）。

**资源:**

:[link]{href="https://blog.langchain.com/the-anatomy-of-an-agent-harness/" nodeId="4531f9039f6e4976b0a7e2a9d43e271d"}The Anatomy of an Agent Harness(LangChain)(免费)[/link] —— 公开文献里把 harness 拆得最干净的一篇。整个阶段的参考文本。一行 harness 代码都没动之前先读这个。
:[link]{href="https://blog.langchain.com/improving-deep-agents-with-harness-engineering/" nodeId="1bf4d0d3dfdd4a309998db28af35ea80"}Improving Deep Agents with harness engineering by Vivek Trivedy(LangChain)(2026 年 2 月 17 日)(免费)[/link] —— 模型固定为 GPT-5.2-codex 不变,只改 harness,Terminal-Bench 2.0 排名从 30 升到 5。配方在文章里。
:[link]{href="https://blog.langchain.com/better-harness-a-recipe-for-harness-hill-climbing-with-evals/" nodeId="de270862b8fe4b6686ef2f997cbc2281"}Better Harness: A Recipe for Harness Hill-Climbing with Evals by Vivek Trivedy(LangChain)(2026 年 4 月 29 日)(免费)[/link] —— 直接续作。把 self-verification 和 tracing 用作自动改 harness 的配方。和 2 月 17 日那篇连着读。
:[link]{href="https://ml6.eu/en/blog/inside-the-claude-agents-sdk" nodeId="495952f71f76423db880c16c9a0860c8"}Inside the Claude Agents SDK(ML6)(免费)[/link] —— CPU/RAM/OS/App 类比,以及 78% vs 42% 的 harness 对比数据。
:[link]{href="https://github.com/affaan-m/everything-claude-code" nodeId="23c45a6514b64ae6b330392672b882d6"}everything-claude-code(Cerebral Valley × Anthropic 黑客松冠军)(免费、GitHub)[/link] —— 用来体会 "什么时候该停止加功能"。
:[link]{href="https://github.com/langchain-ai/deepagents" nodeId="df6081f08a9049519d0ad3ddb92ea633"}deepagents 源码(免费、GitHub)[/link] —— 写自己 harness 的同时把它放在边上当参考。middleware 文件就是 harness 模式的核心。

*重点关注:* 哪些 harness 组件值得自己写,哪些直接 import;功能上线的优先级(loop 和 tool dispatch 在子 agent 之前,子 agent 在 durability 之前,durability 在可观测性之前)。

**2. Durable execution 作为附加层**

**资源:**

:[link]{href="https://inngest.com/docs" nodeId="c40dd9af12e84b6d9ef8bc4a70952d18"}Inngest 文档(免费)[/link] —— Durable steps 和 checkpointing 在 2025 年 12 月 GA。Python harness 上 durability 最简单的路径。
:[link]{href="https://docs.temporal.io/" nodeId="e2c0e63138994eea9bce9dfe56dc90c9"}Temporal Python SDK(免费)[/link] —— OpenAI Agents SDK 与 Temporal 集成于 2026 年 3 月发布。把每个工具调用当成一个 durable step。

*重点关注:* 每步 idempotency key、retry 策略、进程被 kill 时未完成工具调用怎么处理、harness 的 checkpoint 边界应该在哪(每个 node 一次,不是每个 token 一次)。

**实践项目:** 用 ~1500 行 Python 写一个 mini-harness。

一个包住 `anthropic.messages.create` 或 LiteLLM（为了模型无关）的循环。
用 Python 装饰器 `@tool` 实现的工具注册表，附 JSON-schema 自动生成。
一个 :[link]{href="http://CLAUDE.md" nodeId="b44e87bf002042d0b0c4a96945e74e8a"}CLAUDE.md[/link] 风格的系统提示加载器，读取 `./harness/rules/*.md`，支持 path-glob 匹配。
一个 :[link]{href="http://SKILL.md" nodeId="6e3b361965ea45dc98c2e2ed37b0e0c0"}SKILL.md[/link] progressive-disclosure 加载器（每个 skill 在上下文里的 metadata 控制在 50 token 内）。
一个子 agent 派生原语，带隔离上下文，把摘要字符串返回给父级。
文件系统 offload：超过 20K token 的工具结果写到 `./workspace/<id>.txt`，上下文里只留路径加 10 行预览。
上下文窗口 85% 自动压缩：把比最近 10 轮更老的消息总结掉。
可插拔 hook 系统（`pre_tool`、`post_tool`、`stop`）。
通过 `opentelemetry-sdk` 输出 OTEL trace 到 LangSmith 或 Phoenix（两边都讲 OTEL）。
持久化 resume：每步把消息历史和状态持久化到 SQLite，按 run ID 重新加载。
可选附加：用 Inngest 或 Temporal 把整个东西包起来，让每个工具调用都成为 durable step。

Phase 3 里程碑

完成本阶段后你应该能够：

列出现代 harness 的 10 个组件，并解释每个什么时候开始划算
写出 1500 行 Python harness：循环、工具分发、上下文压缩、子 agent、hooks、OTEL traces 都齐
用 Inngest 或 Temporal 接入 durable execution，进程被 kill 也能恢复
写一份 1000 字的事后复盘，对比你的 mini-harness 和 Claude Agent SDK + Deep Agents：哪些做对、哪些砍了、哪些下次会换做法
这份复盘才是真正的交付物。代码只是证据


Phase 4：搭 eval + 回归 harness（3-4 周）

**本阶段目标：** 让你的 agent 可量化。没有这一步，每一次"改进"都只是凭感觉。

这是大多数工程师卡住的地方。他们能搭出很棒的 agent，但说不出下一次改动到底让它变好还是变差。

学什么

1. 选定一个可观测性平台

不要同时跑两个。五个真选项：

**LangSmith。** 在 LangGraph/LangChain 里干活就选这个。原生 tracing。2026 年 3 月新增 Sandboxes、Polly 调试助手、Skills、Fleet（agent 身份/共享）。
**Braintrust。** 想要 framework-agnostic 的 CI 质量门禁选这个。2026 年 2 月 8000 万美元 B 轮。$249/月不限用户数 vs LangSmith 的 $39/座席。
**Arize Phoenix（开源）+ Arize AX（托管）。** 想要 OTEL 原生、漂移检测、从开源到托管的清晰迁移路径就选这个。
**W&B Weave。** 已经在用 Weights & Biases 做 ML 就选这个。现在有完整 agent trace 视图、MCP 自动 logging，A2A tracing 即将到来。
**Inspect（UK AISI）。** 要 benchmark 级严格度选这个。GAIA、SWE-bench、Cybench、BFCL 都打包成 `inspect_evals`。Anthropic、DeepMind、Grok 内部都在用。


**资源:**

:[link]{href="https://docs.smith.langchain.com/" nodeId="d580904d752a4b7b95f0a3929a705f1d"}LangSmith 文档(免费版、官方)[/link] —— 生产 tracing、在线 evals、experiments、新的 Polly 调试助手。
:[link]{href="https://hamel.dev/notes/llm/evals/inspect.html" nodeId="eac78b8e8da04187bac21debef0144ec"}Inspect AI annotated notes by Hamel Husain(免费)[/link] —— Hamel 的笔记是我依赖的实操指南。装 Inspect 之前读这个。
:[link]{href="https://inspect.aisi.org.uk/" nodeId="291915fd6ce34de2a21d511779a0b56a"}Inspect 文档(免费、官方)[/link] —— 框架参考。
:[link]{href="https://github.com/UKGovernmentBEIS/inspect_evals" nodeId="7f0920d594c84e6ebc773cc76ad70316"}inspect_evals(免费、GitHub)[/link] —— 200+ 标准 evals 打包成 Python 包。GAIA、SWE-bench、Cybench、BFCL。
:[link]{href="https://braintrust.dev/" nodeId="e36edd33c276497ea1033dd10bb9f6d4"}Braintrust 文档(免费版)[/link] —— framework-agnostic experiments、CI 门禁、golden datasets。
:[link]{href="https://blog.langchain.com/agent-evaluation-readiness-checklist/" nodeId="a78ee22be0ed4f1a9bb0c06845236f2f"}Agent Evaluation Readiness Checklist(LangChain)(免费)[/link] —— 17 分钟实操清单:error analysis、数据集构建、grader 设计、离线 vs 在线 eval、生产就绪度。打印出来贴在显示器上整个阶段都看得到。
:[link]{href="https://anthropic.com/engineering/infrastructure-noise" nodeId="65cef2dea859413389acffb3ee489b13"}Quantifying infrastructure noise in agentic coding evals(Anthropic)(2026 年 2 月 5 日)(免费、官方)[/link] —— 不稳定的 sandbox 和网络抖动单独就能让 eval 分数浮动好几个百分点。在你信任任何 agent benchmark 数字(你的或别人的)之前,先读这个。

*重点关注:* trace 抽样策略、在线 vs 离线 eval、metric 和 guardrail 的区别、为什么 CI 门禁是把 eval 从仪表盘墙纸变成开发工具的关键模式。

2. 你必须实现的四种 eval

按 Anthropic 的《Demystifying evals for AI agents》：

**Single-turn evals：** 给定输入，输出对不对？最便宜，能用确定性 grader 就用，常跑。
**Trajectory evals：** agent 是否用对参数调用了正确的工具序列？要测 single-step、full-turn、multi-turn 三种变体。
**LLM-as-judge：** 开放式输出（研究报告、code review）用。每周用人工评分样本做 calibration。Anthropic 的研究 agent 评分用 0.0-1.0 跨度，覆盖 factual accuracy、citation quality、completeness、source quality、tool efficiency。
**End-state evals：** 有状态 agent（写 DB、改文件）用。把环境最终状态对比 ground truth。这就是 τ-bench 的做法。

**资源:**

:[link]{href="https://anthropic.com/engineering/demystifying-evals-for-ai-agents" nodeId="70010f4a970d4f5aa2e27d1d0a2cce8b"}Demystifying evals for AI agents(Anthropic)(免费、官方)[/link] —— Anthropic 关于这个话题最好的入门。
:[link]{href="https://blog.langchain.com/evaluating-deep-agents-our-learnings/" nodeId="638b8c9672114a41a2c2a2a7091a0376"}Evaluating Deep Agents: Our Learnings(LangChain)(免费)[/link] —— single-step、full-turn、multi-turn 轨迹 eval 模式。实操指南。
:[link]{href="https://blog.langchain.com/how-we-build-evals-for-deep-agents/" nodeId="ea42c20e11004962abb46ebe59431c8a"}How we build evals for Deep Agents(LangChain)(免费)[/link] —— 配套文章。他们怎么获取数据、设计指标、运行有边界的 eval。和上面那篇配着读。
:[link]{href="https://anthropic.com/engineering/eval-awareness-browsecomp" nodeId="b467c41ce02545f185aa7a8c5797ad0a"}Eval awareness in Claude Opus 4.6's BrowseComp performance(Anthropic)(2026 年 3 月 6 日)(免费、官方)[/link] —— 模型能察觉自己在被评测,并改变行为。设计 eval 套件之前读这个,不然偏置直接被你烤进去。
:[link]{href="https://anthropic.com/engineering/AI-resistant-technical-evaluations" nodeId="b0fd69cf98204151857593b418e85788"}Designing AI-resistant technical evaluations(Anthropic)(2026 年 1 月 21 日)(免费、官方)[/link] —— 配套关切:怎么设计不会被被评测的模型本身钻空子的 eval。自己造 benchmark 必读。
:[link]{href="https://github.com/sierra-research/tau2-bench" nodeId="244a5414e9da43069dc5a5dc6d447248"}τ²-bench 仓库(免费、GitHub)[/link] —— 多轮客服 eval,带政策合规检查。
:[link]{href="https://arxiv.org/abs/2507.02825" nodeId="743c32976e87486a9847871c6f8dcd3a"}Establishing Best Practices for Building Rigorous Agentic Benchmarks(arXiv)(免费)[/link] —— 设计任何原创 benchmark 之前读。SWE-bench、KernelBench、WebArena 都高估了 5-33%。

*重点关注:* 哪里能用确定性 grader、怎么校准 LLM judge 与人工评分、什么时候 pass^k 比 pass@1 更重要、怎么发现并丢弃被污染的 benchmark。

**实践项目：** 围绕你 Phase 2 的研究 agent 搭一个回归 harness。

构建一个 30-50 道题的 golden dataset，人工标注，分三档难度（Level 1/2/3，GAIA 风格）。
能用确定性 grader 的就用（事实查询用 exact-match），开放式题用 5 维 rubric 的 LLM-as-judge。
搭一个轨迹 eval：agent 是否做了 plan、是否派了 ≥2 个子 agent、是否引用了来源、是否在预算内完成？
接到 GitHub Actions 上：每个 PR 跑全套。如果 golden 集 pass rate 下降 ≥3 分，或任何 pass^4 指标下降，阻断 merge。
加生产抽样：每晚把 1% 的 live trace 自动用 LLM-as-judge 评分。漂移就告警。
通过 Inspect 把 agent 在至少一个公开 benchmark 上重跑：GAIA Level 1 或 τ²-bench retail。把你的数字对比公开榜单。
上线一个 `make eval` target，输出三件交付物：CI pass/fail 摘要、LangSmith experiment URL、带一个标准 benchmark 分数的 Inspect log 文件。

Phase 4 里程碑

完成本阶段后你应该能够：

选定一个可观测性平台，并能从架构层面给出选择理由
实现全部四种 eval：single-turn、trajectory、LLM-as-judge、end-state
维护一份从生产失败而不是合成数据生长出来的 golden dataset
eval 分数回退时在 CI 里阻断 PR
产出一个 `make eval` target，输出 CI pass/fail 摘要、LangSmith experiment URL、带一个标准 benchmark 分数的 Inspect log 文件
把你在自己 agent 里发现的失败模式都写成文档。这份文档才是真正的产品


Phase 5：生产加固（持续）

**本阶段目标：** 把你搭出来的一切，让它扛得住真实用户、真实成本、真实故障。

这是持续过程，不是一个能完成的阶段。

学什么

1. 成本纪律

大量使用 prompt caching。Anthropic 的 caching 在重复前缀上能省到 90%。把 :[link]{href="http://CLAUDE.md" nodeId="0f5bb2dcbabb458e9eac3289da8adc92"}CLAUDE.md[/link]、系统提示、工具定义都缓存。
按难度路由：简单轮次走 Haiku 4.5 或 Sonnet 4.6，规划和困难推理走 Opus 4.7。
"advisor tool" beta（Anthropic 2026 年 3 月）让你在生成中途把执行端和更高 IQ 的 advisor 配对。
留意 Opus 4.7 tokenizer：标价同 4.6，但同样文本计费 token ~1.0-1.35×。迁移后重新测每任务成本。
非实时工作负载用 Batch API，5 折。
多 agent（Anthropic 风格的研究）：预期 ~15× 单 agent chat 的 token 消耗。只在答案的价值能盖过这条线时才上多 agent。

**资源：**

:[link]{href="https://blog.langchain.com/open-models-have-crossed-a-threshold/" nodeId="3493114c0cf14a398ee8f675559856fd"}Open Models have crossed a threshold(LangChain)(免费)[/link] —— GLM-5 和 MiniMax M2.7 现在在核心 agent 任务(文件操作、工具使用、指令跟随)上跟闭源前沿模型打平。锁定模型选型和路由策略之前先读这个。

*重点关注:* prompt caching 边界、模型路由规则、batch vs 实时决策、你监控的硬性每任务成本预算。

2. 延迟

并行工具调用。Anthropic 研究系统的提示词原话："you MUST use parallel tool calls when creating multiple sub-agents." 你自己的 agent 也一样。
用 LangGraph 的 `stream_mode="updates"` 把局部输出流到 UI。
子 agent fan-out 是延迟最大的杠杆：60 步串行 agent → 10 步主 + 5 个并行的 10 步子 agent。

*重点关注：* 哪里并行是安全的、哪里 streaming 改 UX、fan-out 怎么和成本相互作用。

3. 安全和 sandboxing

所有代码执行都进 sandbox：Modal、E2B、Daytona、或 LangSmith Sandboxes（2026 年 3 月 private preview）。永远不要在主进程里 `exec()` 模型输出。
凭据在模型上下文外被 broker（Anthropic Managed Agents 模式；SaaS 授权由 Composio 处理）。
hooks 做 guardrail：PreToolUse hook 阻断破坏性 Bash、正则屏蔽密钥、校验文件写路径。
不可逆操作上人在回路 interrupt（LangGraph 的 `interrupt()` + HumanInTheLoopMiddleware，Claude Agent SDK 的权限弹窗）。

**资源:**

:[link]{href="https://modal.com/docs" nodeId="9a8324814d874132916e541d94f0a39c"}Modal 文档(免费版)[/link] —— Python 代码执行的默认 sandbox。
:[link]{href="https://e2b.dev/" nodeId="f65d753ea3314627828186ba245850ef"}E2B 文档(免费版)[/link] —— 为 AI agent 设计的代码执行 sandbox。
:[link]{href="https://anthropic.com/engineering/claude-code-sandboxing" nodeId="6f2d9cd6143847839da1c27f90ece7cd"}Beyond permission prompts: making Claude Code more secure and autonomous(Anthropic)(2025 年 10 月 20 日)(免费、官方)[/link] —— 基础 sandboxing 文章。Claude Code 怎么对安全动作不再问权限、对不安全动作做隔离。你的 harness 该抄的模式。
:[link]{href="https://anthropic.com/engineering/claude-code-auto-mode" nodeId="16d390abae874ec88c4ba79e611128d8"}Claude Code auto mode: a safer way to skip permissions(Anthropic)(2026 年 3 月 25 日)(免费、官方)[/link] —— 续作。让 agent 无人值守跑会发生什么变化。在生产里翻 "跳过确认" 开关之前两篇都读。

4. 监控和漂移

低规模时 100% trace 抽样；高规模时降到 1-10%，对错误做分层抽样。
对以下告警：每请求 token 成本、工具调用失败率、LLM-as-judge 平均分（每晚）、p95 延迟、eval 回退。
每次模型升级后重做 eval 基线。
Anthropic 自家工程博客的提醒："harness 编码了关于 Claude 自己做不到什么的假设；模型变强这些假设就会过期"（Sonnet 4.5 → Opus 4.5 的 "context anxiety" 案例）。

*重点关注：* 什么发告警 vs 什么只 log、怎么发现 prompt cache 失效、怎么发现 harness 在模型已经不需要它的能力时还在硬撑。

5. 韧性

任何跑 60 秒以上的 agent，durable execution（Inngest、Temporal、或 LangGraph PostgresSaver）都不可少。
每个 node 后做 checkpoint。Rewind 和 fork 都要可行。Pydantic Deep Agents 和 LangGraph 都支持。Claude Agent SDK 的 session log 等价。

**资源:**

:[link]{href="https://blog.langchain.com/production-agents-self-heal/" nodeId="200ab5a48d734e60af4d42a75f619f92"}How My Agents Self-Heal in Production(LangChain)(免费)[/link] —— 一个实际可工作的 pipeline:每次部署后探测回退、定位原因、自动开 PR 修,到 review 之前都不用人。把这个模式抄走。

*重点关注:* 哪些故障可自动恢复、哪些必须人介入、怎么在生产流量逼你之前先测好你的 resume 路径。

Phase 5 里程碑

这个阶段不会结束。但你应该有：

prompt caching 接到系统提示、:[link]{href="http://CLAUDE.md" nodeId="59a4d8ba6fa443228182170ae24561f7"}CLAUDE.md[/link]、工具定义上
一层模型路由，配硬性每任务成本预算和告警
一个所有代码执行都进的 sandbox，加一个把密钥挡在上下文之外的凭据 broker
hooks 阻断破坏性动作，强制不可逆动作走人审
trace 抽样、漂移告警、每次模型升级的重新基线流程
一层 durable execution，进程被 kill 是非事件


推荐

*你今天就能采取行动的明确建议。*

只学一个框架：LangGraph 1.0 + Deep Agents

它最通用、运行时故事今天最成熟（PostgresSaver、time-travel 调试、durable execution、通过 LangSmith 实现的 OTEL 友好可观测性），它 model-agnostic，且它的抽象（state graph + middleware）是可迁移的心智模型。

完。

只学一个参考 harness：Claude Agent SDK + Claude Code

它就是参考实现。:[link]{href="http://CLAUDE.md" nodeId="a4a2325812654a7c980124c750164289"}CLAUDE.md[/link]、Skills、子 agent、hooks、plan mode、文件系统即记忆模式。2026 年其他 harness 都在向这些原语收敛。

每天用 Claude Code、读它的文档、研究开源 harness 合集。

只读一篇关于上下文的：

Anthropic 的 "Effective context engineering for AI agents"（2025 年 9 月）。

如果只读两篇：再加 LangChain 的 "Context Engineering for Agents" 学 Write/Select/Compress/Isolate 框架。

只学一个可观测性工具：

留在 LangGraph 选 LangSmith。要 framework-agnostic CI 门禁选 Braintrust。要 benchmark 级严格度选 Inspect（迟早你应该选这个）。

2026 年别学：

AutoGen v0.4（已并入 Microsoft Agent Framework，社区分支是 AG2。两个都不是好默认）。
OpenAI Swarm（已被官方取代，OpenAI 自己的 README 都明说 "not production-ready"）。
Assistants API（2026 年中下线）。
在测出真有 recall 问题之前，自己造向量库或 memory。
"无代码" agent 平台，除非你要做的就是一次性的小东西。

只在有特定理由时才用：

**CrewAI。** idea 到原型最快，生产环境脆。黑客松和 demo 用。
**OpenAI Agents SDK。** 锁定 OpenAI 的话可以。2026 年 4 月加了 sandboxing 和 harness，但你仍被锁在 OpenAI 模型。
**Pydantic AI / Pydantic Deep Agents。** 严格类型 FastAPI 团队选这个。
**Mastra。** 只在团队是 TypeScript 不能用 Python 的时候选。v1.0 在 2026 年 1 月，YC W25，22k+ stars，Gatsby 团队做的。
**Smolagents。** code-agent 模式最好的教学工具（1000 行可 hack 的代码）。生产弱。
**DSPy 3.0 + GEPA。** 你已经有 metric 想程序化优化提示词和 agent 拓扑时用。GEPA 比 RL 强 6%，rollout 少 35×（ICLR 2026 oral）。
**Letta / MemGPT。** 跨 session 需要 OS 风格 agent 自管 memory 时。否则文件系统 + Mem0 更简单。

收藏的 benchmark（2026 年 5 月数据）：

**SWE-bench Verified：** Claude Opus 4.7 ≈ 87.6%，GPT-5.5 ≈ 88.7%，Gemini 3.1 Pro ≈ 78.8%。
**Terminal-Bench 2.0：** GPT-5.5 82.7%，Opus 4.7 ~70%，Gemini 3.1 Pro ~68%。
**τ-bench：** Claude Mythos Preview 89.2% 领先。
**BrowseComp：** GPT-5.5 90.1%，Gemini 3.1 Pro 85.9%，Opus 4.7 79.3%（比 4.6 的 83.7% 退步。把 web 研究路由到 GPT-5.5）。
**GAIA / Princeton HAL：** Sonnet 4.5 以 74.6% 领先。

给一名技术不弱但刚做 agent 的工程师的时间盒里程碑：

**Week 2：** Phase 0 完成。能用大白话解释 harness。
**Week 5：** Phase 1 完成。Claude Agent SDK agent 已上线，带一个 Skill、一个 hook、一个子 agent。
**Week 9：** Phase 2 完成。LangGraph deep-agent 研究分析师在跑，带 PostgresSaver 持久化和 LangSmith trace。
**Week 13：** Phase 3 完成。1500 行 mini-harness 写完且文档化，能力对得上裁剪版的 Claude Agent SDK。
**Week 17：** Phase 4 完成。golden dataset、CI 门禁、用 Inspect 跑一次公开 benchmark。
**永远：** Phase 5。

如果你是 10-15 小时/周的兼职做这事，乘以 2.5×。

会改计划的几个 benchmark：3 周内 Phase 1 跑不通，说明你的工具设计错了（重读 "Writing tools for agents"）。Phase 2 超过 5 周，说明你也在试图自己写 harness。退到 Deep Agents，别再拧着。


警示

*没看到会绊倒你的事。*

Benchmark 是移动靶，且部分被博弈

SWE-bench Verified 分数两年从 1.96% 跳到 80%+。τ-bench 加 pass^k 一致性指标正是因为单跑准确率不再有信息量了。

把任何 "X 模型得 Y%" 的说法都当成 与 harness、scaffold、retry 预算、系统提示 联合产出。不是模型一个。

arxiv 2507.02825 那篇文章记录了 17 个流行 benchmark 普遍高估 5-33%。

多 agent 在大多数场景被过度吹

Anthropic 报告的 90.2% 提升是广度优先研究专属。对编码和耦合紧的任务，多 agent 经常比单 agent 还差，且烧 15× 的 token。

默认用单 agent + 子 agent 做有边界的探索。只有任务自然拆得开才上完整多 agent。

要记住的反例：Anthropic 的 "Building a C compiler with a team of parallel Claudes"（2026 年 2 月 5 日，:[link]{href="https://anthropic.com/engineering/building-c-compiler%EF%BC%89%E5%B1%95%E7%A4%BA%E4%BA%86%E4%B8%80%E4%B8%AA%E5%B9%B6%E8%A1%8C%E5%AD%90" nodeId="d81e5fffa4084dcd971c7c90f874ce1a"}https://anthropic.com/engineering/building-c-compiler）展示了一个并行子[/link] agent 真的奏效的编码任务。代码场景里多 agent 不是死了，只是要找对拆解方式。

2026 年来源里的猜测标记

几个 "AI 2027" 预测（OpenBrain $45B 营收等）明确是虚构的，但被当统计数据引。忽略。

发布周的接收文章是 anecdotal。把它们当成开发者情绪信号，而不是 benchmark。

框架格局还会再变

LangChain 自己 18 个月里把表述换了两次（chains → graphs → harnesses-on-graphs）。

Pydantic AI、Mastra、Deep Agents 任何一个都可能在 12 个月后大很多。

押抽象（loop、tools、context、子 agent、durability、traces）而不是任何一个具体库。它们能跨过去。

MCP 的生产毛刺真实存在

LB 后面的 streamable HTTP、多租户 auth、限流、审计 log，全在 2026 MCP roadmap 上——也就是说没解决。

为 2026 年下半年要落地的下一代 transport SEP 留余地，别和当前 session 模型深耦合。

模型在小版本之间行为会变

Opus 4.7 更严格的指令跟随和新 tokenizer 意味着你 Opus 4.6 时代的提示词行为可能不一样，且对相同文本最多多花 35% token。

每次模型升级都重放流量。

你的 eval 套件会腐烂

今天的 golden dataset 几个月内就会随模型变强而饱和。

每季度按 10-20% 从生产失败长出来，不是合成数据。

LLM-as-judge 的人工 calibration 永远要在跑。

路线图里有些来源带商业立场

只要可能，靠一手来源（Anthropic 工程博客、LangChain 博客、OpenAI 公告、arXiv）。

排行榜风格的 "2026 best of" 文章（Alice Labs、Channel.tel、GuruSup、Morph、Vstorm）作为三角验证有用，但每家都有商业动机。

它们彼此一致、且和一手工程来源一致的地方，把共识当可靠。


结论

按完这份路线图，你能期待什么？

我跟你直说，不裹糖。

这份路线图不会让你 17 周内变成 principal AI engineer。但它能让你成为一个能搭并上线扛得住生产流量的 agent 系统的人。这恰好就是公司现在愿意付钱的事。

愿意为能上线生产 agent 的工程师付的钱不会减。LangChain State of Agent Engineering 报告里 57% 的团队已有生产 agent，89% 的人接了可观测性。质量是首要瓶颈（32%），意味着整个领域被卡在能搭 evals 和 harness 的工程师上，不是会调 LLM API 的工程师上。

Anthropic 自家数据点出真正的机会：同模型，不同 harness，CORE 78% vs 42%。这道差距就是你的工作。

harness 工程的转向是软件招聘里目前最大的错配定价。公司还在挂 "prompt engineer" 职位。它们真正需要的是能把前沿模型变成可量化、能持久运行的生产系统的工程师。

下面是我希望你从这一切里带走的东西：

每个阶段挑一个项目去做。不是读，是构建、打破、修复、部署，然后把 LangSmith trace 和 benchmark 分数贴到 README。会被招的工程师是能秀 trace 的，不是会背框架对比表的。
把学到的开始往外讲。把你的 mini-harness 复盘写出来。把 golden dataset 发现发出来。带上产生你那个 benchmark 数字的 harness 配置一起发。教是最快的学，并且同时建立你的 reputation。最好的机会来自可见的工程师，不是投了 500 份简历的工程师。
不要等到觉得自己准备好了。你永远不会准备好。"我在看 LangChain 博客" 和 "我在跑带 PostgresSaver 持久化的 deep agent" 之间的 gap，是大多数工程师永远卡住的地方。
一旦有可工作的 agent 就开始投简历、开始公开造、开始上线。哪怕很小。市场不奖励完美，奖励的是能让模型做点真东西并且证明它没退步的人。

如果你认真投入，17 周足够改变一切。我相信读这份的每一个人都做得到。

继续构建，继续衡量你构建出来的东西。

希望对你有用，家人们 ❤️


译者备注

**本地英文原文存档**：`/tmp/agent-roadmap-2026.md`（740 行，59KB，2026-05-07 抓取）
翻译保留所有原始链接、人名、产品名、英文专有术语，便于回查英文一手来源。
原文中部分内容（如"Opus 4.7"、"GPT-5.5"、"2026 年 5 月 benchmark 数据"）属于作者基于发布趋势的预估或营销宣传，未必都已 GA，引用时建议交叉验证一手来源。
精简版 + PDE 视角解读：见同目录 `ROADMAP-2026-精简版-PDE视角.md`。
