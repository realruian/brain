---
tags:
  - Claude-Code
  - harness
  - 速查
date: 2026-04-16
---

# Claude Code Harness 自动化工具使用

围绕 Claude Code 搭的三层自动化：**Hook（系统触发，100% 可靠）+ Skill（场景触发，按需调用）+ CLAUDE.md（常驻规则）**。本文只覆盖当前已配置的工具。

## 现状

| 工具 | 类型 | 位置 | 状态 |
|------|------|------|------|
| SessionStart Hook | Hook | `~/.claude/hooks/harness-session-start.sh` | ✅ 已建 |
| `/new-project` | Skill | `~/.claude/skills/new-project/SKILL.md` | ✅ 已建 |
| `/distill-lesson` | Skill | — | ⏳ 规划中 |
| `/wrap-up` | Skill | — | ⏳ 规划中 |

---

## 1. SessionStart Hook

### 做什么

每次启动 `claude` 会话时，**自动注入**：

1. `git status --short`（当前未提交变动）
2. `git log --oneline -10`（最近 10 次提交）
3. Obsidian 项目笔记全文（若存在 `~/Brain/01-Projects/<目录 basename>.md`）
4. 分级提示（未登记 / 未建笔记时提醒补 harness）

### 触发方式

**零操作**。每次 `cd` 到项目目录启动 Claude Code 时系统自动执行。

### 验证它在工作

```bash
cd ~/Dev/Personal-website && claude
# 对 Claude 说："继续" 或 "告诉我从哪儿接着做"
# 如果它能直接说出最近的 commit 和未完成任务，说明 Hook 生效
```

### 前提条件

Obsidian 项目笔记名必须**等于项目目录 basename**：

| 项目目录 | 对应笔记 |
|---------|---------|
| `~/dev/meituan/design-studio` | `~/Brain/01-Projects/design-studio.md` |
| `~/Dev/Personal-website` | `~/Brain/01-Projects/personal-website.md` |

不按这个约定命名，Hook 匹配不到笔记。

### 非 git 目录行为

静默跳过，不污染上下文。

---

## 2. `/new-project` Skill

### 做什么

一次性完成新项目 harness 三步仪式：

1. 生成 `<项目>/CLAUDE.md`（< 100 行草稿）
2. 建 `~/Brain/01-Projects/<basename>.md`（Obsidian 项目笔记）
3. 追加到 `~/Brain/CLAUDE.md` 的"当前项目"章节

### 触发方式

**方式 A：显式调用**

```
/new-project
```

Claude 会反问你收集信息。

**方式 B：自然语言（推荐）**

```
帮我开新项目 XX，{技术栈/用途}，代码在 ~/path/to/project
```

Claude 会识别意图自动调用 skill。几种触发句型：

- "帮我开一个新项目……"
- "接入 ~/path/to/project，搭 harness"
- "我要做个新东西……帮我初始化"
- "新项目叫 XX……"

### Skill 会问的信息

一次性问完这 4 项：

1. **项目状态**：`code-exists` / `ready-to-start` / `research` / `idea`
2. **项目显示名**（例 "Vibe Voice"）
3. **一句话描述**
4. **项目目录绝对路径**

### 安全保障

- 冲突不覆盖：`CLAUDE.md` / 笔记已存在会跳过并提示
- 不执行实际开发（只搭 harness，不写功能）
- 不 `git init` / `git clone`

---

## 3. 工具配合关系

```
新项目首次接入
    │
    ├─ /new-project Skill  ← 一次性搭 harness
    │       │
    │       ├─→ 项目 CLAUDE.md
    │       ├─→ Obsidian 项目笔记
    │       └─→ 全局 CLAUDE.md 登记
    │
日常开发每次启动
    │
    └─ SessionStart Hook   ← 自动注入上下文
            │
            ├─→ git 状态 + 最近提交
            └─→ Obsidian 项目笔记全文
```

**Skill 解决"一次性工作流"，Hook 解决"每次都做"。** 两者一头一尾闭环。中间的开发过程仍然靠 CLAUDE.md + 日常对话。

---

## 4. 常见问题

### Hook 没输出上下文？

1. 确认脚本有执行权限：`ls -l ~/.claude/hooks/harness-session-start.sh`（应显示 `-rwxr-xr-x`）
2. 确认 `~/.claude/settings.json` 里 `SessionStart` 数组包含该脚本
3. 确认当前目录是 git 仓库（非 git 目录会静默跳过）
4. 手动运行测试：`cd <项目> && ~/.claude/hooks/harness-session-start.sh`

### Skill 没被触发？

Skill 是**概率匹配**（~80% 可靠），不保证每次触发。显式用 `/new-project` 最稳。

### Obsidian 笔记匹配不上？

检查笔记文件名是否**完全等于**项目目录 basename。macOS 大小写不敏感，但跨平台还是建议统一小写。

### 想临时禁用 Hook？

编辑 `~/.claude/settings.json`，删掉 `SessionStart` 数组里那行包含 `harness-session-start.sh` 的条目即可。Hook 脚本本身保留，随时可以加回来。

---

## 5. 规划中的下一步

等这两个工具用一周有体感后再加：

- **`/distill-lesson`**：犯错后把教训提炼成 CLAUDE.md 规则（对应 harness 四模块的"纠正"）
- **`/wrap-up`**：收工时生成日报 + 更新项目笔记进展

不急着建 —— 真正用过才知道需要什么细节。
