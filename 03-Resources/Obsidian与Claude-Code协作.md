---
tags:
  - Claude-Code
  - 工作流
  - 参考
date: 2026-04-15
---

# Obsidian × Claude Code 协作指南

## 一、搭建 Harness（首次接入）

Harness 是你围绕 Claude Code 搭建的工作环境——CLAUDE.md、Skills、Hooks、Subagents 加上 Obsidian 里的项目笔记。搭好之后每次对话不需要重新铺垫上下文。

### 1.1 生成项目级 CLAUDE.md

```bash
cd ~/path/to/project    # 新项目先 mkdir + git init
claude
```

用交互式初始化（会主动问你要设置哪些内容）：

```
CLAUDE_CODE_NEW_INIT=1 claude
```

或者手动让 Claude 生成：

```
读一下这个项目的代码结构、技术栈、开发规范，生成 CLAUDE.md
```

生成后**必须手动精简**。对每一行问自己："去掉它 Claude 会犯错吗？"不会就删。目标控制在 200 行以内。

### 1.2 CLAUDE.md 层级结构

| 层级     | 路径                                                  | 放什么                         |
| ------ | --------------------------------------------------- | --------------------------- |
| 组织策略   | `/Library/Application Support/ClaudeCode/CLAUDE.md` | 全组织统一规则                     |
| 全局     | `~/.claude/CLAUDE.md`                               | 跨项目个人规则，尽量短                 |
| 项目（共享） | `项目根目录/CLAUDE.md`                                   | 编码规范、常用命令、架构、不能动的文件，提交到 Git |
| 项目（个人） | `项目根目录/CLAUDE.local.md`                             | 个人覆盖，加入 .gitignore          |
| 子目录    | 子目录下的 `CLAUDE.md`                                   | Claude 处理该目录文件时自动加载         |
| 模块化规则  | `.claude/rules/*.md`                                | 可用 `paths:` 限定作用范围，支持符号链接   |
| 笔记库    | `~/Brain/CLAUDE.md`                                 | Obsidian vault 的组织规则、当前项目路径 |

用 `@path/to/file` 语法引用外部文件，最多递归 5 层。HTML 注释 `<!-- -->` 会被自动剥离，可以用来写只给人看的备注。

### 1.3 在 Obsidian 里建立项目笔记

```
读一下代码结构，帮我在 ~/Brain/01-Projects 里创建项目笔记，包含项目目标、技术栈、核心架构和已知限制
```

然后把项目路径记录到 `~/Brain/CLAUDE.md` 的"当前项目"里：

```
在 ~/Brain/CLAUDE.md 的"当前项目"里加上这个项目的路径
```

### 1.4 配置 Skills（按需加载的知识）

CLAUDE.md 只放普遍适用的内容。特定场景的知识放 `.claude/skills/`，Claude 在相关任务中自动加载，不会每次都塞进上下文：

```
.claude/skills/
├── deploy/SKILL.md      # 部署相关
├── database/SKILL.md    # 数据库迁移规范
└── testing/SKILL.md     # 测试编写规范
```

让 Claude 帮你创建：

```
帮我在 .claude/skills/testing/ 里创建 SKILL.md，把我们项目的测试规范写进去：用 Vitest、优先单元测试、mock 外部依赖不 mock 数据库
```

Skills 遵循 [Agent Skills 开放标准](https://agentskills.io)，可跨 Claude Code、Cursor、Gemini CLI 等工具使用。用 `/plugin` 可以浏览社区插件市场，插件会打包 Skills、Hooks 和 MCP 服务。

### 1.5 配置 Hooks（确定性执行）

CLAUDE.md 规则是建议性的（约 80% 遵守率），Hooks 是确定性的（100%）。必须每次执行的事用 Hook。

四种 Hook 类型：

| 类型 | 说明 |
|------|------|
| `command` | 运行 shell 命令 |
| `http` | POST 到指定 URL |
| `prompt` | 单轮 LLM 评估（默认用 Haiku） |
| `agent` | 多轮子代理，可使用工具 |

常用示例——改完文件自动格式化：

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{ "type": "command", "command": "npx prettier --write $FILE" }]
    }]
  }
}
```

macOS 桌面通知（Claude 等你操作时弹出提醒）：

```json
{
  "hooks": {
    "Notification": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "osascript -e 'display notification \"Claude Code needs your attention\" with title \"Claude Code\"'"
      }]
    }]
  }
}
```

Hook 的 `if` 字段（v2.1.85+）可以按工具参数过滤，比如 `"if": "Bash(git *)"` 只匹配 git 命令。

用 `/hooks` 查看当前配置的所有 Hooks。

### 1.6 自定义 Subagents

在 `.claude/agents/` 目录下定义专用子代理，可指定模型、工具集和隔离方式：

```
帮我在 .claude/agents/ 里创建一个 reviewer 子代理，用 Opus 模型，只允许读取文件和搜索，专门做 code review
```

用 `/agents` 查看可用的子代理。加 `isolation: worktree` 让子代理在独立的 git worktree 中工作，互不干扰。

---

## 二、开发前：研究与规划

核心原则：**研究和实现分离**。先弄清楚要做什么、怎么做，再动手写代码。

### 2.1 恢复上下文

每次新会话第一步，让 Claude 帮你回忆进度：

```
看一下 git status、最近的 git log 和 TODO，告诉我今天该干什么
```

如果 Obsidian 里有相关笔记，用 `@` 引用：

```
看一下 @~/Brain/01-Projects/my-project.md 里记录的待办事项，结合 git status 告诉我从哪里继续
```

### 2.2 进入 Plan Mode

非简单任务（3 步以上或涉及架构决策），先进 Plan mode 让 Claude 只读不改：

按 `Shift+Tab` 切换到 Plan mode，然后说：

```
帮我规划一下怎么实现用户认证功能，需要改哪些文件、分几步做、有什么风险
```

Claude 出方案后：

- 按 `Ctrl+G` 在你的文本编辑器里直接修改方案
- 满意后说"按这个方案执行"，Claude 会提供几种执行模式供选择
- 方向不对就**立刻停下来重新规划**——在错误路径上越走越远比重新规划代价高得多

**什么时候跳过规划**：如果你能用一句话描述要改的 diff，直接动手。

### 2.3 准备参考材料

给 Claude 看参考实现比让它凭空设计效果好得多：

```
参考 @src/auth/login.ts 的实现模式，帮我给注册流程写一个类似的
```

```
看一下这个截图里的 UI 设计，帮我实现（拖拽或粘贴图片）
```

---

## 三、开发中：执行与验证

### 3.1 切换到执行模式

按 `Shift+Tab` 切回 Default 或 Auto-accept edits。

**给 Claude 验证手段**——这是提升产出质量最有效的一件事：

```
改完后跑 npm test 确认没有破坏现有测试，再跑 npx tsc --noEmit 确认类型正确
```

UI 相关的改动可以用 Claude in Chrome 扩展让它自己截图验证。

### 3.2 上下文管理

长对话中 Claude 的表现会随上下文膨胀而下降。关键操作：

| 操作 | 时机 | 怎么做 |
|------|------|--------|
| 压缩上下文 | 上下文用到 60% 左右 | `/compact 保留 API 变更相关的内容` |
| 查看上下文占用 | 不确定还剩多少空间 | `/context` |
| 清空重开 | 切换到不相关的任务 | `/clear` |
| 侧边提问 | 有个小问题但不想污染主对话 | `/btw 这个函数的参数类型是什么` |
| 回退到检查点 | Claude 走偏了 | `Esc+Esc` 或 `/rewind`，选择"从这里总结" |
| 委托子代理 | 需要大量探索但不想撑满上下文 | "用子代理去调查一下 XX 的实现方式，给我总结" |

**常见反模式**：在一个会话里混合不相关的任务（厨房水槽会话）、反复纠正同一个错误超过 2 次（上下文被污染了，`/clear` 重来）、CLAUDE.md 太长导致规则被忽略。

### 3.3 勤提交

把每个 Claude 会话当作可丢弃的。每完成一个有意义的步骤就提交：

```
帮我提交当前的改动，commit message 写清楚做了什么
```

用 `claude --worktree feature-name` 或 `claude -w` 在独立 worktree 中工作，主分支不受影响。如果项目有 `.env` 等 gitignore 文件需要带过去，在项目根目录创建 `.worktreeinclude` 文件列出它们。

### 3.4 随手记录

遇到值得记的东西，在 Obsidian 里写几个关键词。五分钟的记录能省下一次对话 20 分钟的上下文铺垫。

- **踩坑**："PSD 解析器在图层超过 50 层时 OOM，改成流式处理解决了"
- **技术决策**："选了方案 B，因为方案 A 在并发场景下有竞态问题"
- **学到新东西**："Next.js 16 的 Server Actions 可以直接返回流式响应"

放到 `01-Projects` 对应项目下，或者先扔 `00-Inbox`。

也可以直接让 Claude 帮你记：

```
把刚才这个踩坑经验帮我写到 ~/Brain/01-Projects/my-project.md 的"已知问题"里
```

---

## 四、开发后：沉淀与迭代

### 4.1 收工总结

```
看一下今天的 git log，帮我在 ~/Brain/05-Daily 里写个今日总结，文件名用今天的日期，包含做了什么、遇到什么问题、明天要继续什么
```

### 4.2 更新 Harness

Claude 犯的每一个错都应该变成一条规则。被纠正之后：

```
把刚才这个教训加到项目的 CLAUDE.md 里，写清楚规则和原因，防止以后再犯
```

同样重要的是定期清理——从没起过作用的规则会挤占有效规则的注意力：

```
读一下项目的 CLAUDE.md，有哪些规则是从代码本身就能推断出来的？帮我精简掉
```

### 4.3 同步项目笔记

```
看一下最近一周的 git log，更新 ~/Brain/01-Projects/my-project.md 里的架构说明和进度
```

### 4.4 归档 Inbox

```
看一下 ~/Brain/00-Inbox 里的笔记，帮我分类移到合适的文件夹
```

---

## 权限模式速查

按 `Shift+Tab` 循环切换前三种，其余通过 CLI 参数或配置启用：

| 模式 | 自动放行的操作 | 适用场景 | 启用方式 |
|------|-------------|---------|---------|
| Default | 仅读取 | 入门、敏感操作 | Shift+Tab 循环 |
| Auto-accept edits | 读取 + 文件编辑 | 日常迭代 | Shift+Tab 循环 |
| Plan mode | 仅读取（禁止编辑） | 研究探索 | Shift+Tab 循环 |
| Auto mode | 全部操作，后台安全分类器审查 | 长任务、减少确认疲劳 | 需 Team/Enterprise 计划 |
| dontAsk | 仅预批准的工具 | CI/CD、脚本 | CLI `--permission-mode dontAsk` |
| bypassPermissions | 除受保护路径外全部 | 隔离容器/VM | 配置文件设置 |

受保护路径（任何模式下都需要确认）：`.git`、`.claude`（skills/agents/worktrees 除外）、`.bashrc`、`.zshrc` 等。

日常推荐：简单任务用 Auto-accept edits，复杂任务先 Plan mode 出方案再切回 Default 执行。

## 常用操作速查

| 操作 | 按键 / 命令 |
|------|------------|
| 中断 Claude | `Esc` |
| 回退到检查点 | `Esc+Esc` 或 `/rewind` |
| 在编辑器里改方案 | `Ctrl+G` |
| 切换权限模式 | `Shift+Tab` |
| 压缩上下文 | `/compact <保留什么>` |
| 清空上下文 | `/clear` |
| 侧边提问 | `/btw` |
| 查看上下文占用 | `/context` |
| 查看 Hooks | `/hooks` |
| 查看子代理 | `/agents` |
| 浏览插件市场 | `/plugin` |
| 切换模型 | `/model` |
| 切换思考深度 | `/effort`（或提示中写"ultrathink"） |
| 诊断问题 | `/doctor`（按 f 自动修复） |
