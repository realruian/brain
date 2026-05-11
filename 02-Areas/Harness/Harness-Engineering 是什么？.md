---
tags:
  - harness
  - AI工程
  - Claude-Code
  - 参考
date: 2026-04-15
---
> 本文只讲概念：什么是 harness、为什么需要、四个核心模块各自解决什么问题。
> 具体怎么搭、规则怎么写、Hook 怎么配，全部见 [[Harness 构建指南]]。

## 一句话定义

Harness Engineering 是设计约束系统、反馈循环和运行环境，让 AI agent 可靠工作的工程学科。

核心公式：**Agent = Model + Harness**

模型是引擎，Harness 是底盘、刹车、方向盘和仪表盘。模型升级像换更大排量的引擎，Harness 改进像装刹车、加护栏、画车道线——前者决定速度上限，后者决定能不能安全上路。

## 为什么模型不是瓶颈

LangChain 的 coding agent 不换模型，仅改进 harness，就从 Terminal Bench 的 52.8% 跳到 66.5%，从 Top 30 进入 Top 5。

同一个 Claude 模型，给它清晰的规则和项目上下文 vs 什么都不给，输出质量天差地别。提升 AI 编码质量，最快的方式不是等下一代模型，而是改进你给它的环境。

## 四个核心模块

Harness 解决的四类问题，缺一不可。

### 1. 约束（Constrain）— 限制它不能做什么

给 agent 划定边界，告诉它哪些事绝对不能碰（比如"不要改 prisma/migrations/"、"不要动 .env.production"）。

实现手段从轻到重三层：**CLAUDE.md 规则**是"请求"（约 80% 遵守率），**权限模式**控制每步操作要不要人工确认，**Hook** 是系统级拦截（100% 执行）。从请求升级到机制，是约束能力的核心跃迁。

### 2. 告知（Inform）— 告诉它应该知道什么

agent 不是全知的——项目技术栈、架构决策、团队偏好、不明显的坑，这些你脑子里的东西必须写出来它才能用。

主要告知手段：**CLAUDE.md** 每次对话都加载，放常用信息；**Skills** 按需加载，放只在特定任务才用的专项知识；**代码仓库本身**是最大的上下文来源。

**核心认知：agent 看不到的信息等于不存在。** 决策写进 commit 消息、代码注释或 CLAUDE.md，否则永远只存在你脑子里。

### 3. 验证（Verify）— 确认它做对了没

光告诉 agent "要做对"不够，你需要有手段检测它到底做对了没有。

三种验证手段：**CLAUDE.md 里要求它自查**（比如"改完代码跑一次 build"），形成自动反馈循环；**Hook 强制验证**（比如每次编辑后自动跑 prettier 或 tsc），不靠自觉靠系统；**测试**是终极反馈网，改坏已有功能立刻暴露。

**核心认知：只约束不验证 = 没有约束。** 你告诉它"别犯错"没用，你得有手段检测到它犯了错。

### 4. 纠正（Correct）— 出错了怎么办

agent 一定会犯错。关键不是避免一切错误，而是**让同样的错不再犯第二次**。

纠正分三圈，从临时到固化：

1. **对话里直接纠正** —— 解决当前这一次
2. **写进 CLAUDE.md** —— 解决下次新会话还会犯
3. **升级成 Hook 或测试** —— 解决规则不够硬、agent 偶尔不听

**核心认知：每踩一个坑，补一块砖。** Harness 不是一次设计好的，而是在日常使用中一圈一圈长出来的。用得越多，踩坑越多，harness 就越结实。

## 延伸阅读

- [[Harness 构建指南]] —— 每个模块具体怎么搭、规则怎么写、Hook 怎么配、CLAUDE.md 层级与加载规则
- [[项目 Harness 速查]] —— 开新项目的三步仪式

## 参考资源

- [Martin Fowler: Harness Engineering](https://martinfowler.com/articles/harness-engineering.html) — 最权威的概念框架
- [Red Hat: Structured Workflows](https://developers.redhat.com/articles/2026/04/07/harness-engineering-structured-workflows-ai-assisted-development) — 多仓库项目实操指南
- [HumanLayer: Skill Issue](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents) — Claude Code 专项，深入 Skills 和 Sub-agents
- [NxCode: Complete Guide](https://www.nxcode.io/resources/news/harness-engineering-complete-guide-ai-agent-codex-2026) — 全面介绍，含四大模块详解
- [awesome-harness-engineering](https://github.com/ai-boost/awesome-harness-engineering) — GitHub 资源合集