---
tags:
  - Claude-Code
  - harness
  - 速查
date: 2026-04-16
---
围绕 Claude Code 搭的三层自动化：**Hook（系统触发，100% 可靠）+ Skill（场景触发，按需调用）+ CLAUDE.md（常驻规则）**。本文只覆盖当前已配置的工具。

## 现状

| 工具 | 类型 | 位置 | 状态 |
|------|------|------|------|
| SessionStart Hook | Hook | `~/.claude/hooks/harness-session-start.sh` | ✅ 已建 |
| `/new-project` | Skill | `~/.claude/skills/new-project/SKILL.md` | ✅ 已建 |
| `/distill-lesson` | Skill | `~/.claude/skills/distill-lesson/SKILL.md` | ✅ 已建 |
| `/wrap-up` | Skill | `~/.claude/skills/wrap-up/SKILL.md` | ✅ 已建 |

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

## 3. `/distill-lesson` Skill

### 做什么

把刚犯的错提炼成 CLAUDE.md 规则，防止同类错误再犯。

### 触发方式

**显式**：`/distill-lesson`

**自然语言**：

- "把这个加到 CLAUDE.md"
- "沉淀一下这个教训"
- "这个错要防止再犯"
- "提炼成规则"

### Skill 的动作

1. 从对话上下文识别错误根因
2. 提炼成**可复用规则**（不是事件记录）
3. 判断层级（项目 vs 全局 `~/.claude/CLAUDE.md`）
4. 按「经验教训」格式（标题 + YOU MUST/IMPORTANT + 要点 + 实例）草拟条目
5. 给你看草稿，你确认后追加

### 什么时候该用它

- 刚被 Claude 犯同一个错纠正过第二次 →**必用**
- code review 发现 Claude 应该知道但没遵守的规范
- 调试到关键洞察（比如"flicker 真凶是像素层面不是 layout"）

---

## 4. `/wrap-up` Skill

### 做什么

日终收工自动化：写日报 + 更新项目笔记进展记录。

### 触发方式

**显式**：`/wrap-up`

**自然语言**：

- "收工"
- "今天总结一下"
- "写日报"
- "小结"

### Skill 的动作

1. 读今天的 git log + 未提交变动
2. 提炼：**今日做了什么 / 踩过的坑 / 教训 / 下次接续**
3. 写日报到 `~/Brain/05-Daily/YYYY-MM-DD.md`
   - 不存在 → 新建
   - 已存在 → 追加新时段（"下午续场" / "深夜续场"）
4. 在项目笔记的「进展记录」章节追加一行
5. 如果教训里有值得单独沉淀的，提示你可以跑 `/distill-lesson`

### 多项目一天

一次只处理当前 cwd 对应的项目。如果一天在多个项目间切换，在各自目录下分别跑 `/wrap-up`。

---

## 5. 工具配合关系

```
新项目首次接入
    │
    └─ /new-project Skill  ─→ 项目 CLAUDE.md + Obsidian 笔记 + 全局登记
                                    │
                                    ↓
日常开发每次启动 ←──────── harness 自动生效
    │
    └─ SessionStart Hook   ─→ 注入 git 状态 + 项目笔记
                                    │
                                    ↓
                              （自由对话开发）
                                    │
            ┌───────────────────────┼───────────────────────┐
            │                       │                       │
     犯错后：/distill-lesson   收工时：/wrap-up        持续纠正 → CLAUDE.md
            │                       │                       │
            ↓                       ↓                       ↓
    规则进 CLAUDE.md        日报 + 项目笔记进展          harness 长大
```

**四个工具各自职责**：

| 工具 | 职责 | 触发时机 |
|------|------|---------|
| SessionStart Hook | 每次开会话注入上下文 | 系统自动 |
| `/new-project` | 新项目搭 harness 骨架 | 项目启动 |
| `/distill-lesson` | 错误固化成规则 | 犯错之后 |
| `/wrap-up` | 当日沉淀 | 一天结束 |

**形成完整闭环**：启动 → 注入上下文 → 开发 → 错误固化 + 日终沉淀 → 下次启动 harness 更强。

---

## 6. 常见问题

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

## 7. 接下来用一周观察

四个工具齐活，接下来是**用真实开发反馈迭代**。观察这几件事：

- **Hook 注入的内容是不是正好**？项目笔记太大会挤压上下文，太小又不够用。需要的话给脚本加"只取前 N 行"的裁剪逻辑。
- **三个 Skill 触发率**：Claude 是否能正确识别触发词？如果经常需要显式 `/skill-name`，就扩充 description 里的关键词。
- **`/distill-lesson` 提炼质量**：规则是否真的可复用？一周后回看 `~/.claude/CLAUDE.md` 的「经验教训」，有没有太具体或太抽象的条目。
- **`/wrap-up` 是否有人用**：如果收工懒得打命令，就加一个 Stop Hook 在退出时提醒"今天还没写日报"。

记录使用中的不顺手，直接追加到本文的「改进记录」里。

## 8. 改进记录

<!-- 日期：具体问题 → 采取的改动 -->
- 2026-04-16：初版四工具齐活
