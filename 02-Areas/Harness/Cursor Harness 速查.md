---
tags: [Cursor, harness, 速查]
date: 2026-04-21
---
# Cursor Harness 速查

姊妹篇：[[项目 Harness 速查]]（Claude Code 版）、[[Harness-Engineering 是什么？]]、[[Harness 构建指南]]。

核心理念（**Agent = Model + Harness**）通用，只是工具换成 Cursor。**最大差异**：Cursor 没有原生 Hook，硬约束得下沉到 git / CI 层。

---

## 核心映射（一眼对照）

| Claude Code | Cursor | 可靠性 |
|---|---|---|
| `CLAUDE.md` | `.cursor/rules/*.mdc`（`alwaysApply: true`） | ~80% |
| `.claude/rules/ + paths:` | `.cursor/rules/*.mdc + globs:` | ~80% |
| `~/.claude/CLAUDE.md` | Cursor Settings → Rules for AI | ~80% |
| Hook（PostToolUse） | ❌ 无 → 用 **husky + lint-staged** / formatOnSave / CI | 100%（但时机后移） |
| Skills | `.cursor/rules/*.mdc` + `description`（Agent 按需 fetch） | ~80% |
| Auto Memory | **Cursor Memories**（Settings → Features → Memories） | ~80% |
| SessionStart Hook 注入 Obsidian 笔记 | ❌ 无 → 手动 `@` 或写进 rule | — |
| Sub-agents / Plan Mode | ❌ 无原生 → Agent mode 提示词让它先出方案 | — |

---

## 项目前（开工的第一小时）

**一句话**：**先建 `.cursor/rules/`，再装 husky，最后建 Obsidian 笔记**。Cursor 少了 Hook，所以 git 层的兜底不能省。

### ① 建 `.cursor/rules/project.mdc`（相当于 CLAUDE.md）

```bash
mkdir -p .cursor/rules
```

`project.mdc` 模板：

```markdown
---
description: 项目总则，每次对话都加载
alwaysApply: true
---

# {项目名}
{一句话技术栈 + 业务描述}

## 常用命令
- 开发：npm run dev
- 构建：npm run build
- 类型检查：npx tsc --noEmit
- 单测：npm test -- path/to/file

## 代码风格
- 组件函数式 + hooks，不用 class
- ES modules，不用 CommonJS

## 不要动的文件
- prisma/migrations/
- .env.production

## 工作流
IMPORTANT: 改完代码先跑 `npx tsc --noEmit`
YOU MUST: 跑单测不要跑全量套件
YOU MUST: 不确定就先出方案再动手
```

让 Cursor 替你生成草稿：

```
读一下代码结构，在 .cursor/rules/project.mdc 生成 alwaysApply 总则：
技术栈 / 本地启动命令 / 验证手段 / 不要动的文件 / Git 纪律
草稿就好，我审查精简
```

**审查标尺**：对每一行问"去掉它 Cursor 会犯错吗？"不会就删。控制在 < 150 行。

### ② 建 path-scoped rules（可选）

只在匹配文件时加载，省上下文。例：

`.cursor/rules/api.mdc`：

```markdown
---
description: API 开发规范
globs: "src/api/**/*.ts"
---
- 所有端点必须输入校验
- 统一错误响应格式
- 包含 OpenAPI 注释
```

### ③ 装 husky + lint-staged（替代 Hook —— 最关键）

这一步是 **Cursor harness 的硬约束核心**，Claude Code 用户可以偷懒，Cursor 用户不能。

```bash
npm i -D husky lint-staged
npx husky init
```

`.husky/pre-commit`：

```bash
npx lint-staged
npx tsc --noEmit
```

`package.json`：

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

从此 Cursor 写完代码提交时**100% 执行**校验，不靠 agent 自觉。

### ④ 建 Obsidian 项目笔记

和 Claude Code 一样：`~/Brain/01-Projects/xxx.md`。文件名**不要求**等于项目 basename（Cursor 没有 SessionStart Hook 读这个），但保持一致便于日后混用 Claude Code。

独自 / 协作区分见 [[项目 Harness 速查]]。

### ⑤ 登记到 `~/Brain/CLAUDE.md` 的"当前项目"

Cursor 不读这里，但**你跨工具切换时**（用 Claude Code 开别的项目）会用到。不冲突，继续登记。

---

## 项目中（日常开发）

**每次开新会话**：

```
@project.mdc @~/Brain/01-Projects/xxx.md 读一下
然后 @Git 看 status 和最近 5 个 commit，告诉我从哪里继续
```

（因为没 SessionStart Hook，Obsidian 笔记必须手动 `@`）

### 三种模式的选择

| 场景 | 用什么 |
|---|---|
| 简单改动（改 CSS、重命名变量） | Inline Edit（`Cmd+K`） |
| 多文件改动 / 涉及架构 | **Agent mode**，先让它出方案 |
| 探索 / 问问题 | Ask mode |

**Agent mode 模拟 Plan Mode**：

```
不要直接动手。先给我方案：改哪些文件、每个文件改什么、风险点。
我 approve 再执行。
```

### 用好 Cursor 的 `@` 上下文

| `@` 类型 | 用途 |
|---|---|
| `@Codebase` | 整个代码库语义搜索（相当于 Claude Code 的自动探索） |
| `@Files` | 指定文件 |
| `@Folders` | 指定目录 |
| `@Git` | 最近 commit / diff |
| `@Docs` | 第三方库文档（需预先添加） |
| `@Web` | 联网搜索 |
| `@{rule名}` | 手动调用某个 rule（相当于 Skill） |

### 纠正循环（只剩两圈）

**第一圈：对话里纠正**
一次性问题，直接说。

**第二圈：写进 `.cursor/rules/`**
同一个错犯两次 —— 让 Cursor 自己补：

```
把"组件用函数式写法"这条加进 .cursor/rules/project.mdc
```

或拆一个新的 scoped rule：

```
新建 .cursor/rules/react.mdc，globs: "**/*.tsx"
内容：组件必须函数式，禁止 class
```

**~~第三圈：升级成 Hook~~** → 改为：

- **升级到 pre-commit hook**（husky 加一条）
- **升级到测试**（写个单测防回归）
- **升级到 CI check**（GitHub Actions 挂了就拒绝 merge）

**关键认知**：Cursor 场景下硬约束从"编辑时"后移到"提交时 / CI 时"。所以 `.cursor/rules/` 里的 `YOU MUST ...` 自查规则比 Claude Code 更重要，因为没有底层 hook 兜底。

### 用 Cursor Memories 学习偏好

Settings → Features → Memories 开启后，Cursor 会自动记住你纠正过的偏好。但：

- 想让它记住某事：「记住，API 测试需要本地 Redis」
- 想写进项目 rules 而不是个人 memory：「把这条加进 .cursor/rules/project.mdc」

Memory 是**个人的、跨项目的**；rules 是**项目的、共享的**。别搞混。

---

## 项目后（收工 3 分钟）

```
@Git 看今天所有的 commit
在 ~/Brain/05-Daily 写今日总结（文件名今天日期）
顺便更新 ~/Brain/01-Projects/xxx.md 的进展记录
```

然后本地提交前 **husky pre-commit hook 会自动把关**（lint + 类型检查）。这一刻 Cursor harness 的硬约束真正生效。

push 之前看一眼：

- `git status` 干净
- CI 绿（如果配了 GitHub Actions）
- `.cursor/rules/` 有没有今天新增的规则要 commit

---

## 如果只记一个要点

> **Cursor 的 harness = `.cursor/rules/*.mdc`（软约束）+ husky pre-commit hook（硬约束）**。
>
> 前者对标 `CLAUDE.md`，后者对标 Hook。少了 Hook 就用 git 层补上，少了 SessionStart 就手动 `@` Obsidian 笔记。其他理念（纠正循环、四大模块）完全通用。

---

## 延伸阅读

- [[项目 Harness 速查]] — Claude Code 版本
- [[Harness-Engineering 是什么？]] — 四大模块概念
- [[Harness 构建指南]] — 写作规范、审查标尺（Cursor 同样适用）
- [[Obsidian 与 Claude-Code 协作]] — Obsidian 笔记的组织方式（Cursor 沿用）

## 参考资源

- [Cursor Rules 官方文档](https://docs.cursor.com/context/rules)
- [Cursor Memories](https://docs.cursor.com/context/memories)
- [husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged)
