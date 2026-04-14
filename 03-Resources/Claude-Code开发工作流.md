---
tags:
  - Claude-Code
  - 工作流
  - 参考
date: 2026-04-14
---

# Claude Code 开发工作流

## 每日三个时刻

### 1. 开工前（2 分钟）

在项目目录启动 Claude Code，让它帮你回忆进度：

```
看一下 git status 和最近的 TODO，告诉我今天该干什么
```

### 2. 干活中（随手记）

遇到值得记的东西，在 Obsidian 里写几个关键词：

- **踩坑**："PSD 解析器在图层超过 50 层时 OOM，改成流式处理解决了"
- **技术决策**："选了方案 B，因为方案 A 在并发场景下有竞态问题"
- **学到新东西**："Next.js 16 的 Server Actions 可以直接返回流式响应"

放到 `01-Projects` 对应项目下，或者先扔 `00-Inbox`。

### 3. 收工前（1 分钟）

让 Claude Code 自动生成今日总结：

```
看一下今天的 git log，帮我在 ~/Brain/05-Daily 里写个今日总结，文件名用今天的日期
```

## 新项目起手式

进入项目目录，启动 Claude Code：

```bash
cd ~/path/to/project
claude
```

然后说：

```
读一下这个项目的代码结构、技术栈、开发规范，生成 CLAUDE.md
```

它会自动参照全局配置中引用的编写指南来写。生成后检查一遍，按需精简。

## 常用 Claude Code 指令

| 场景 | 指令 |
|------|------|
| 生成项目文档 | 读一下代码结构，帮我在 ~/Brain/01-Projects 里创建项目笔记 |
| 更新项目笔记 | 看一下最近一周的 git log，更新 ~/Brain/01-Projects 里的项目笔记 |
| 记录技术决策 | 帮我在 ~/Brain/01-Projects 里记录一个技术决策：为什么选 XX 方案 |
| 分析代码再动手 | 按两下 Shift+Tab 进 Plan mode，让它先出方案 |
| 压缩上下文 | 输入 /compact，长对话中途用一下刷新记忆 |
| 切换模型 | 输入 /model 选择 Sonnet 或 Opus |

## 权限模式速查

按 `Shift + Tab` 循环切换：

| 模式 | 用途 |
|------|------|
| Default | 每步都要确认，最安全 |
| Auto-accept edits | 改文件自动通过，跑命令要确认 |
| Plan mode | 只读不动，先分析再决策 |
| Auto mode | Claude 自主决定，后台安全检查（Team 计划） |

日常推荐：简单任务用 Auto-accept edits，复杂任务先 Plan mode 出方案再切回 Default 执行。

## CLAUDE.md 三层结构

| 层级 | 路径 | 作用 |
|------|------|------|
| 全局 | `~/.claude/CLAUDE.md` | 所有项目通用的规则 |
| 项目 | `项目根目录/CLAUDE.md` | 该项目特有的规范 |
| 笔记库 | `~/Brain/CLAUDE.md` | Obsidian vault 的组织规则 |

全局的尽量短（放跨项目规则），项目的写详细（编码规范、命令、架构）。
