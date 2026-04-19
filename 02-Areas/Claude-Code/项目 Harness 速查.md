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

> ⚠️ 文件名必须**等于项目目录 basename**（SessionStart Hook 靠这个匹配）。

**独自项目**：

```
在 ~/Brain/01-Projects 建笔记 xxx.md，包含：业务背景 / 关键决策 / 已知坑点 / 进展记录
空骨架即可
```

**协作项目**（你 clone 别人的 repo、或加入到朋友的项目）：

```
在 ~/Brain/01-Projects 建笔记 xxx.md（协作项目），包含：
- 项目是什么 + 我负责哪块
- 代码仓库路径 + GitHub 地址 + 我的角色（collaborator / fork 贡献者）
- 协作者是谁
- 我关心的关键决策（不是全项目决策）
- 我踩过的坑（不是团队共识坑）
- 我的进展记录（我的 PR / review 流水）
空骨架即可
```

**为什么协作也要写（笔记 ≠ repo 文档）**：

- Hook 只认 `~/Brain/01-Projects/<basename>.md` 这个路径，没这个文件 harness 就失效一半
- repo README 是**团队视角**，笔记是**你的视角**——你负责什么、你的理解、你和朋友的分歧
- 私人内容（坑、教训、对某个决策的保留意见）不能放 repo，只能放笔记

**独自 vs 协作，四块内容的重心差异**：

| 章节 | 独自 | 协作 |
|------|------|------|
| 业务背景 | 完整写 | 一句话 + 指向 repo README |
| 关键决策 | 所有重要决策 | 只记你参与/关心的 |
| 已知坑点 | 都记 | **只记你自己踩过的**（团队共识坑应该进 repo docs） |
| 进展记录 | 全项目进展 | **你自己的贡献流水** |

**不写笔记的唯一例外**：只是偶尔 review 别人的 PR、不改代码、也不用 Claude Code 开发。这种连 clone 都不用。

**③ 登记到 `~/Brain/CLAUDE.md` 的"当前项目"**

格式：

```
- {项目显示名} — {一句话描述}（代码仓库: {本地路径}[ · GitHub: {owner/repo} {private/public}]）
```

**独自项目示例**：

```
- Vibe Voice — macOS Electron 语音笔记 app（代码仓库: ~/dev/personal/vibe-voice）
```

**协作项目示例**（加上 GitHub 和角色）：

```
- XX 产品 — {一句话描述}（代码仓库: ~/dev/xx · GitHub: 朋友账号/xx private · 协作者 collaborator）
```

让 Claude 做：

```
在 ~/Brain/CLAUDE.md 当前项目章节追加一行：
- {项目显示名} — {描述}（代码仓库: {路径}）
```

**作用**：让后续任意会话里的 Claude 都知道"你现在有哪些活跃项目"，不用每次解释。

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
