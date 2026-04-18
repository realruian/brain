---
tags: [Claude-Code, harness, 速查]
date: 2026-04-18
---

# 新项目 Harness 速查

核心就四句话，剩下按需看 `~/Brain/02-Areas/Claude-Code/Harness 构建指南.md` 和 `~/Brain/02-Areas/Claude-Code/Obsidian 与 Claude-Code 协作.md`。

---

## 开新项目的第一小时（无论从零还是接入既有）

**一句话记住**：**先建 harness，再写代码**。跳过 harness 的那几分钟，以后会用几小时偿还。

### 三步仪式

**① 建项目 CLAUDE.md**（项目根目录，< 100 行）

```
读一下代码结构（或者我要做一个 XX 项目），给我生成 CLAUDE.md：
技术栈 / 本地启动命令 / 验证手段 / 不要动的文件 / Git 纪律（push 前 pull、不要 force 之类）
草稿就好，我审查精简
```

**② 建 Obsidian 项目笔记**（`~/Brain/01-Projects/xxx.md`）

```
在 ~/Brain/01-Projects 建笔记 xxx.md，包含：业务背景 / 关键决策 / 已知坑点 / 进展记录
空骨架即可
```

**③ 登记到 `~/Brain/CLAUDE.md` 的"当前项目"**

```
在 ~/Brain/CLAUDE.md 当前项目里加一行 xxx
```

---

## 日常开发

**每次开新会话就说一句**：

```
读 [项目 CLAUDE.md 路径] 和 [Obsidian 笔记路径]，然后看 git status + git log -5 告诉我从哪里继续
```

**写代码时**：

- 超过 3 步或涉及架构 → 先 **Plan Mode**（`Shift+Tab`）出方案
- 简单改动 → 直接 Auto-accept edits

**我犯错后你说这句**：

```
把刚才这个教训加到项目的 CLAUDE.md，防止以后再犯
```

（这句是最重要的 —— 错一次就变规则，下次不再犯）

---

## 收工（3 分钟）

```
看一下今天的 git log，在 ~/Brain/05-Daily 写个今日总结（文件名今天日期）
顺便更新 ~/Brain/01-Projects/xxx.md 的进展记录
```

---

## 如果只记一个要点

> **每次我犯同一个错两次，你就让我"加到 CLAUDE.md"。** CLAUDE.md 就是这样一圈圈长出来的。

其他的（Hooks / Skills / Plan agent / .claude/rules/）等你觉得"CLAUDE.md 不够了"再加 —— 90% 的项目这一步永远不会到。
