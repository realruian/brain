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

模型是引擎，Harness 是底盘、刹车、方向盘和仪表盘。没有 Harness，再强大的引擎也无法安全载客。

## 为什么模型不是瓶颈

LangChain 的 coding agent 不换模型，仅改进 harness，就从 Terminal Bench 的 52.8% 跳到 66.5%，从 Top 30 进入 Top 5。

OpenAI 的 Codex 团队构建了超过 100 万行代码的生产应用，零行人类手写代码。工程师的工作就是设计 harness。

## 四个核心模块

### 1. 约束（Constrain）

限制 agent 能做什么。

- CLAUDE.md 中的规则（编码规范、不能动的文件）
- 权限模式（Default / Auto-accept / Plan / Auto）
- Hooks（拦截危险操作）
- 沙箱（隔离执行环境）

### 2. 告知（Inform）

告诉 agent 应该做什么。

- CLAUDE.md（项目上下文、架构、命令）
- Skills（按需加载的领域知识）
- 代码中的结构化文档（README、注释、类型注解）
- 仓库本身就是上下文——agent 看不到的东西等于不存在

### 3. 验证（Verify）

确认 agent 做对了没有。

- 测试套件（单元测试、集成测试）
- Linter 和类型检查
- CI/CD 流水线
- PostToolUse Hook 自动校验

### 4. 纠正（Correct）

在出错时修复。

- 对话中直接纠正
- 反馈循环（测试失败 → 自动重试）
- 定期清理任务（扫描代码偏差、开 PR 修复）
- 把犯过的错写进 CLAUDE.md 防止重犯

## 关键原则

### CLAUDE.md 是目录，不是百科全书

OpenAI 的做法：AGENTS.md 控制在约 100 行，只作为指向更深层文档的地图。详细知识放在结构化的 docs/ 目录里。

### 每次犯错都要工程化解决

发现 agent 犯了一个错误，就花时间设计一个方案让它永远不会再犯。可以是 CLAUDE.md 里加一条规则、加一个 Hook、或加一个测试。

### Harness 不是要消除人类输入

一个好的 harness 不应该以完全消除人类输入为目标，而是把人类的输入引导到最重要的地方。

### 先设计环境，再写代码

不要从写代码开始，从设计环境开始：让 AI 在规划前先看真实代码；给 AI 结构化约束；在规划和执行之间放一个人工审查节点。

### 仓库就是 agent 的全部世界

agent 无法访问 Slack 讨论、Google Docs 或人脑中的知识。如果信息不在仓库里、不可被 agent 发现，它就等于不存在。重要的决策和规范必须写进仓库。

## 演进路径

```
Vibe Coding（2025）→ Spec Coding（2025+）→ Harness Engineering（2026）
凭直觉写代码       用规格约束        用环境约束运行时行为
```

## 我目前的 Harness 状态

| 模块  | 已有                   | 可以加                         |
| --- | -------------------- | --------------------------- |
| 约束  | CLAUDE.md 规则、权限模式    | Hooks（自动 lint、拦截危险操作）       |
| 告知  | CLAUDE.md 项目上下文、全局配置 | Skills（按需加载专业知识）            |
| 验证  | 手动检查                 | 测试脚本、CI 集成、PostToolUse Hook |
| 纠正  | 对话中纠正                | 自动反馈循环、定期清理任务               |

## 参考资源

- [Martin Fowler: Harness Engineering](https://martinfowler.com/articles/harness-engineering.html) — 最权威的概念框架
- [OpenAI: Harness Engineering](https://openai.com/index/harness-engineering/) — OpenAI 用 Codex 构建百万行代码的实战经验
- [Red Hat: Structured Workflows](https://developers.redhat.com/articles/2026/04/07/harness-engineering-structured-workflows-ai-assisted-development) — 多仓库项目实操指南
- [HumanLayer: Skill Issue](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents) — Claude Code 专项，深入 Skills 和 Sub-agents
- [NxCode: Complete Guide](https://www.nxcode.io/resources/news/harness-engineering-complete-guide-ai-agent-codex-2026) — 全面介绍，含四大模块详解
- [awesome-harness-engineering](https://github.com/ai-boost/awesome-harness-engineering) — GitHub 资源合集
