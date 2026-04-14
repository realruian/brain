---
tags:
  - Claude-Code
  - 工作流
  - 参考
date: 2026-04-14
---

# Obsidian × Claude Code 协作指南

## 一、开发前：搭建 Harness

Harness 是你给 Claude Code 准备的"工作环境"——包括 CLAUDE.md、Skills、Hooks 和 Obsidian 里的项目笔记。花 5 分钟搭好，后面每次对话能省 20 分钟的上下文铺垫。

### 1.1 项目接入（已有仓库 / 新建项目）

```bash
cd ~/path/to/project    # 已有项目直接 cd；新建项目先 mkdir + git init
claude
```

生成项目级 CLAUDE.md：

```
读一下这个项目的代码结构、技术栈、开发规范，生成 CLAUDE.md
```

也可以用 `/init` 自动生成。生成后必须手动检查精简——`/init` 产出的内容往往臃肿，对每一行问自己"去掉它 Claude 会犯错吗？"不会就删。

### 1.2 在 Obsidian 里建立项目笔记

```
读一下代码结构，帮我在 ~/Brain/01-Projects 里创建项目笔记
```

项目笔记用来记录 Claude 读不到的东西：目标、背景、技术决策的理由、已知坑点。代码本身能传达的信息不用重复写。

### 1.3 配置 Harness 三层结构

| 层级 | 路径 | 放什么 |
|------|------|--------|
| 全局 | `~/.claude/CLAUDE.md` | 跨项目规则，尽量短 |
| 项目 | `项目根目录/CLAUDE.md` | 编码规范、常用命令、架构、不能动的文件 |
| 笔记库 | `~/Brain/CLAUDE.md` | Obsidian vault 的组织规则、当前项目路径 |

把项目路径记录到 `~/Brain/CLAUDE.md` 的"当前项目"里，方便在笔记库上下文中引用。

### 1.4 按需加载：Skills 和 Hooks

CLAUDE.md 只放普遍适用的内容。偶尔才用到的知识放到 `.claude/skills/` 目录，Claude 会在相关任务中自动加载：

```
.claude/skills/
├── deploy/SKILL.md      # 部署相关
├── database/SKILL.md    # 数据库迁移规范
└── testing/SKILL.md     # 测试编写规范
```

必须每次执行的事用 Hook（100% 执行率），而非 CLAUDE.md 规则（约 80%）：

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{ "command": "npx prettier --write $FILE" }]
    }]
  }
}
```

---

## 二、开发中：Plan → Execute → Verify

核心原则：**研究和实现分离**。先用 Plan mode 让 Claude 出方案，确认后再切回来执行。

### 2.1 开工前（2 分钟）

启动 Claude Code，恢复上下文：

```
看一下 git status 和最近的 TODO，告诉我今天该干什么
```

### 2.2 规划阶段

非简单任务（3 步以上或涉及架构决策），先进 Plan mode：

按 `Shift+Tab` 切换到 Plan mode，或者直接说：

```
先不要改代码，帮我规划一下怎么实现 XX 功能
```

看完方案满意了再说"按这个方案执行"。如果中途方向不对，**停下来重新规划**，不要让 Claude 在错误路径上越走越远。

### 2.3 执行阶段

切回 Default 或 Auto-accept edits 模式执行。关键习惯：

- **给 Claude 验证手段**：告诉它改完跑什么测试、怎么确认结果正确
- **勤提交**：把每个 Claude 会话当作可丢弃的，随时能回滚
- **用 `/compact` 刷新记忆**：长对话中途压缩一次上下文，避免 Claude 遗忘早期指令

### 2.4 随手记录

遇到值得记的东西，在 Obsidian 里写几个关键词：

- **踩坑**："PSD 解析器在图层超过 50 层时 OOM，改成流式处理解决了"
- **技术决策**："选了方案 B，因为方案 A 在并发场景下有竞态问题"
- **学到新东西**："Next.js 16 的 Server Actions 可以直接返回流式响应"

放到 `01-Projects` 对应项目下，或者先扔 `00-Inbox`。

---

## 三、开发后：沉淀和维护

### 3.1 收工总结

让 Claude Code 生成今日总结，写进 Obsidian：

```
看一下今天的 git log，帮我在 ~/Brain/05-Daily 里写个今日总结，文件名用今天的日期
```

### 3.2 更新 Harness

每次 Claude 犯了一个错，把防范规则加进 CLAUDE.md。每次发现 CLAUDE.md 里有一条从没起过作用的规则，就删掉它。像维护代码一样维护 Harness。

### 3.3 同步项目笔记

定期让 Claude 更新 Obsidian 里的项目笔记：

```
看一下最近一周的 git log，更新 ~/Brain/01-Projects 里的项目笔记
```

### 3.4 归档 Inbox

```
看一下 00-Inbox 里的笔记，帮我分类移到合适的文件夹
```

---

## 常用指令速查

| 场景 | 指令 |
|------|------|
| 恢复进度 | 看一下 git status 和最近的 TODO，告诉我今天该干什么 |
| 生成项目笔记 | 读一下代码结构，帮我在 ~/Brain/01-Projects 里创建项目笔记 |
| 更新项目笔记 | 看一下最近一周的 git log，更新 ~/Brain/01-Projects 里的项目笔记 |
| 记录技术决策 | 帮我在 ~/Brain/01-Projects 里记录一个技术决策：为什么选 XX 方案 |
| 今日总结 | 看一下今天的 git log，帮我在 ~/Brain/05-Daily 里写个今日总结 |
| 压缩上下文 | 输入 `/compact` |
| 切换模型 | 输入 `/model` 选择 Sonnet 或 Opus |

## 权限模式速查

按 `Shift + Tab` 循环切换：

| 模式 | 用途 | 启用方式 |
|------|------|----------|
| Default | 每步都要确认，最安全 | Shift+Tab 循环切换 |
| Auto-accept edits | 改文件自动通过，跑命令要确认 | Shift+Tab 循环切换 |
| Plan mode | 只读不动，先分析再决策 | Shift+Tab 循环切换 |
| Auto mode | Claude 自主决定，后台安全检查 | 需要 Team 计划，才会出现在 Shift+Tab 循环中 |
| dontAsk | 完全跳过确认，等同于全自动 | CLI 参数 `--dangerously-skip-permissions` 或配置文件 |
| bypassPermissions | 绕过权限检查 | 配置文件 `settings.json` 中设置 |

日常推荐：简单任务用 Auto-accept edits，复杂任务先 Plan mode 出方案再切回 Default 执行。
