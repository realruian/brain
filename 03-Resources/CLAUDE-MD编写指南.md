---
tags:
  - Claude-Code
  - harness
  - 参考
date: 2026-04-14
---

# CLAUDE.md 编写指南

## 核心原则

1. **每行都要值得存在** — 对每一行问自己"去掉它会导致 Claude 犯错吗？"不会就删
2. **控制在 200 行以内** — Claude Code 系统提示已占约 50 条指令额度，模型总共能可靠遵循约 150-200 条，留给你的空间有限
3. **只放普遍适用的内容** — 偶尔才用到的知识放到 Skills 里，按需加载
4. **像维护代码一样维护它** — 出问题时回来检查，定期精简，观察 Claude 行为是否改变
5. **不要自动生成后就不管** — `/init` 生成的内容往往臃肿，必须手动精简

## 应该写什么

- **常用命令**：dev / build / test / lint 怎么跑
- **编码风格**：ES modules vs CommonJS、函数式 vs 类、命名规范
- **关键架构决策**：状态管理方案、路由结构、数据层设计
- **不能动的文件**：配置文件、迁移文件、第三方资源
- **项目结构概览**：核心目录是什么、代码在哪里找
- **工作流规则**：改完代码要跑类型检查、单测优先于全量测试

## 不应该写什么

- Claude 自己能从代码推断出来的东西（比如"这是一个 React 项目"）
- 一次性的任务说明（直接在对话里说）
- 代码格式化规则（用 Prettier / ESLint + Hook 解决，比 CLAUDE.md 可靠）
- 所有可能用到的命令（只放最常用的）

## 示例结构

```markdown
# 项目名

简短一句话描述项目是什么。

## 常用命令

- 开发：`npm run dev`
- 构建：`npm run build`
- 测试单文件：`npm test -- path/to/file`
- 类型检查：`npx tsc --noEmit`

## 代码风格

- 使用 ES modules（import/export），不用 CommonJS（require）
- 优先解构导入：`import { foo } from 'bar'`
- 组件用函数式 + hooks，不用 class

## 架构

- 状态管理：Zustand，见 src/stores/
- API 层：src/api/，所有请求走 fetchClient 封装
- 路由：Next.js App Router，页面在 app/ 下

## 不要动的文件

- `prisma/migrations/` — 已执行的数据库迁移
- `.env.production` — 生产环境配置
- `public/fonts/` — 授权字体文件

## 工作流

- 改完代码先跑 `npx tsc --noEmit` 确认类型没问题
- 跑单个测试文件，不要跑全量测试套件
- commit 前确保 lint 通过
```

## 进阶技巧

### 用 @ 引用外部文件

不要把所有内容塞进一个文件，用引用让 Claude 按需读取：

```markdown
详见 @README.md 了解项目概览
API 规范见 @docs/api-conventions.md
Git 工作流见 @docs/git-workflow.md
```

### 用强调词提高遵守率

关键规则可以加 IMPORTANT 或 YOU MUST：

```markdown
IMPORTANT: 不要修改 prisma/migrations/ 下的任何文件
YOU MUST: 每次改完代码运行类型检查
```

### 多层级 CLAUDE.md

| 层级     | 路径                                                  | 放什么                         |
| ------ | --------------------------------------------------- | --------------------------- |
| 组织策略   | `/Library/Application Support/ClaudeCode/CLAUDE.md` | 全组织统一规则                     |
| 全局     | `~/.claude/CLAUDE.md`                               | 跨项目个人规则，尽量短                 |
| 项目（个人） | `项目根目录/CLAUDE.local.md`                             | 个人覆盖，加入 .gitignore          |
| 子目录    | 子目录下的 `CLAUDE.md`                                   | Claude 处理该目录文件时自动加载         |
| 模块化规则  | `.claude/rules/*.md`                                | 可用 `paths:` 限定作用范围，支持符号链接   |
| 项目（共享） | `项目根目录/CLAUDE.md`                                   | 编码规范、常用命令、架构、不能动的文件，提交到 Git |
| 笔记库    | `~/Brain/CLAUDE.md`                                 | Obsidian vault 的组织规则、当前项目路径 |

用 `@path/to/file` 语法引用外部文件，最多递归 5 层。HTML 注释 `<!-- -->` 会被自动剥离，可以用来写只给人看的备注。

### 用 Hook 替代 CLAUDE.md 规则

CLAUDE.md 是建议性的（约 80% 遵守率），Hook 是确定性的（100%）。必须每次执行的事情用 Hook：

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

### 用 Skills 做按需加载

只在特定场景需要的知识放到 `.claude/skills/` 目录：

```
.claude/skills/
├── deploy/SKILL.md      # 部署相关知识
├── database/SKILL.md    # 数据库迁移规范
└── testing/SKILL.md     # 测试编写规范
```

Claude 在相关任务中会自动加载对应 Skill，不会每次都塞进上下文。

## 参考资源

- [官方最佳实践](https://code.claude.com/docs/en/best-practices)
- [HumanLayer: Writing a good CLAUDE.md](https://www.humanlayer.dev/blog/writing-a-good-claude-md)
- [社区最佳实践合集](https://github.com/shanraisshan/claude-code-best-practice)
- [Claude Code 终极指南](https://github.com/FlorianBruniaux/claude-code-ultimate-guide)
- [UX Planet: CLAUDE.md 10 个必备章节](https://uxplanet.org/claude-md-best-practices-1ef4f861ce7c)
