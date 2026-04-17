---
tags:
  - Claude-Code
  - harness
  - AI工程
  - 参考
date: 2026-04-16
---
给 Claude Code 搭建约束系统的实操手册。不是教你手写规则文件，而是教你**指挥 Claude 构建 harness，然后审查和迭代它**。

## 一、Agent = Model + Harness

同一个模型，给它清晰的规则和项目上下文 vs 什么都不给，输出质量天差地别。提升 AI 编码质量，最快的方式不是等下一代模型，而是改进你给它的环境。

你的 harness 工具箱：

| 工具             | 控制方向      | 类型  | 可靠性  | 加载时机               |
| -------------- | --------- | --- | ---- | ------------------ |
| CLAUDE.md      | 前馈（行动前引导） | 推理型 | ~80% | 每次对话               |
| .claude/rules/ | 前馈        | 推理型 | ~80% | 每次 / 按路径匹配         |
| Hook           | 前馈 + 反馈   | 计算型 | 100% | 事件触发               |
| Skill          | 前馈        | 推理型 | ~80% | 按需 / 手动调用          |
| 测试             | 反馈（行动后检验） | 计算型 | 100% | 运行时                |
| Auto Memory    | 前馈        | 推理型 | ~80% | 每次（前 200 行 / 25KB） |

**前馈**预防问题，**反馈**发现问题。**计算型**确定性执行，**推理型**语义判断但非确定性。两个维度交叉使用，缺一不可。

## 二、从零搭建

### 用 /init 生成基础 harness

```bash
cd ~/path/to/project
claude
# 进入后执行：
/init
```

`/init` 会分析代码库，生成包含构建命令、测试指令和项目规范的 CLAUDE.md 草稿。

交互式模式（会问你要生成哪些制品、提问补盲区、预览后再写入）：

```bash
CLAUDE_CODE_NEW_INIT=1 claude
/init
```

**重要：/init 生成的是草稿，不是成品。** 自动生成的内容往往臃肿，必须审查精简——对每一行问"去掉它 Claude 会犯错吗？"不会就删。

### 层级与加载

CLAUDE.md 不是一个文件，而是一套分层体系。更具体的层级优先于更宽泛的：

| 作用域 | 路径 | 放什么 | 共享范围 |
|--------|------|--------|---------|
| 组织策略 | macOS: `/Library/Application Support/ClaudeCode/CLAUDE.md` | 全公司编码标准、安全策略、合规要求 | 所有用户（不可被排除） |
| 项目共享 | `./CLAUDE.md` 或 `./.claude/CLAUDE.md` | 构建命令、编码规范、架构决策、工作流 | 团队（提交到 Git） |
| 用户全局 | `~/.claude/CLAUDE.md` | 跨项目的个人习惯（尽量短） | 仅自己（所有项目） |
| 项目个人 | `./CLAUDE.local.md` | 个人沙盒 URL、偏好测试数据 | 仅自己（加 .gitignore） |

**加载规则：**

- Claude 从当前工作目录**向上遍历**目录树，每层检查 `CLAUDE.md` 和 `CLAUDE.local.md`
- 所有发现的文件**拼接**到上下文中，不是覆盖
- 同一层级内，`CLAUDE.local.md` 追加在 `CLAUDE.md` 之后（冲突时个人规则后读，更可能被采纳）
- 子目录的 CLAUDE.md **不在启动时加载**，而是 Claude 读取该子目录文件时才懒加载
- `/compact` 后，根目录 CLAUDE.md 会自动重新注入；子目录文件需等下次懒加载

## 三、转向循环——日常迭代

Harness 不是一次设计好的系统，而是在日常使用中一圈一圈长出来的。每踩一个坑，补一块砖。

### 第一圈：对话里纠正

Claude 犯错，你在对话里说"不要用 class 写法，用函数式"。它改了，这次对了。但下次新对话，它不记得。

**适合：** 一次性纠正、探索阶段还没定型的偏好。

### 第二圈：写进 CLAUDE.md

同一个错犯第二次——让 Claude 自己把规则补进去：

> "把'组件用函数式写法，不用 class'这条加进 CLAUDE.md"

入库信号：

- Claude 犯了同一个错两次
- 代码审查发现 Claude 应该知道的规范
- 你在对话里重复说了上次说过的话
- 新同事加入项目也需要同样的上下文

**适合：** 所有项目成员都应遵守、且每次对话都需要的规则。

### 第三圈：升级成 Hook 或测试

CLAUDE.md 里写了它还是不听？升级——从"建议"变成"机制"：

**Hook（100% 执行）：**

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

**测试（自动反馈循环）：**

在 CLAUDE.md 里加一条：

```
YOU MUST: 每次修改代码后运行 npm run build 确认没有报错。
```

Claude 改完代码会自己跑构建。报错了它看到错误信息就会尝试修复——反馈循环自动形成。

**适合：** 必须每次执行、不能靠 agent 自觉的事情。

### 你只做三件事

1. **审查**——每条规则问"去掉它 Claude 会犯错吗？"
2. **决策**——该留在 CLAUDE.md、升级成 Hook/测试、还是拆到 Skill
3. **控制篇幅**——单文件 < 200 行，超了就拆

## 四、写作规范（审查时的标尺）

你不一定要手写这些规则，但当 Claude 生成或更新 CLAUDE.md 时，你需要按这些标准审查。

### 具体性

```
✅ "使用 2 空格缩进"
❌ "格式化代码"

✅ "API handlers 放在 src/api/handlers/"
❌ "保持文件组织整洁"

✅ "运行 npm test 再提交"
❌ "测试你的改动"
```

### 强调词

关键规则加 `IMPORTANT` 或 `YOU MUST` 提高遵守率：

```
IMPORTANT: 不要修改 prisma/migrations/ 下的任何文件
YOU MUST: 每次改完代码运行类型检查
```

### 一致性

定期让 Claude 自查：

> "检查所有 CLAUDE.md 和 rules/ 文件，有没有过时或互相矛盾的规则"

如果两条规则冲突，Claude 会随机选一条——等于没有规则。

### 该写 vs 不该写

| ✅ 写 | ❌ 不写 |
|-------|--------|
| Claude 猜不到的构建命令 | Claude 读代码就能推断的事 |
| 与默认不同的编码风格 | 语言标准惯例（Claude 已经知道） |
| 项目特有的架构决策 | 详细 API 文档（链接过去就行） |
| 测试偏好和运行方式 | 频繁变动的信息 |
| 开发环境特殊配置 | 逐文件描述代码库 |
| 不明显的坑和怪癖 | "写干净的代码"之类的废话 |

### 示例模板

```markdown
# MyApp

电商后台管理系统，Next.js + TypeScript。

## 常用命令

- 开发：`npm run dev`
- 构建：`npm run build`
- 测试单文件：`npm test -- path/to/file`
- 类型检查：`npx tsc --noEmit`

## 代码风格

- 使用 ES modules（import/export），不用 CommonJS
- 组件用函数式 + hooks，不用 class

## 架构

- 状态管理：Zustand，store 文件在 src/stores/
- API 层：src/api/，所有请求走 fetchClient 封装

## 不要动的文件

- `prisma/migrations/` — 已执行的数据库迁移
- `.env.production` — 生产环境配置

## 工作流

- 改完代码先跑 `npx tsc --noEmit`
- 跑单个测试文件，不要跑全量套件
- commit 前确保 lint 通过
```

## 五、组织与拆分

### @ 导入语法

CLAUDE.md 里用 `@path/to/file` 引用外部文件，启动时展开加载：

```markdown
详见 @README.md 了解项目概览
API 规范见 @docs/api-conventions.md
个人偏好见 @~/.claude/my-project-instructions.md
```

- 支持相对路径（相对于包含文件，不是工作目录）和绝对路径
- 最多递归 5 层
- HTML 注释 `<!-- -->` 自动剥离——给人看的备注不浪费 token

### .claude/rules/ 模块化规则

当 CLAUDE.md 超过 200 行，按主题拆到 `.claude/rules/` 目录：

```
.claude/rules/
├── code-style.md      # 编码风格
├── testing.md         # 测试规范
├── security.md        # 安全要求
└── frontend/
    └── components.md  # 前端组件规范
```

**路径限定规则**——只在匹配文件时加载，节省上下文：

```markdown
---
paths:
  - "src/api/**/*.ts"
---

# API 开发规范

- 所有 API 端点必须包含输入校验
- 使用标准错误响应格式
- 包含 OpenAPI 文档注释
```

常用 glob 模式：

| 模式 | 匹配 |
|------|------|
| `**/*.ts` | 所有目录下的 TypeScript 文件 |
| `src/**/*` | src/ 下所有文件 |
| `src/components/*.tsx` | 指定目录下的 React 组件 |
| `**/*.{ts,tsx}` | 花括号展开匹配多扩展名 |

**用户级规则**（对所有项目生效）：

```
~/.claude/rules/
├── preferences.md    # 个人编码偏好
└── workflows.md      # 个人工作流
```

用户级规则先于项目规则加载，项目规则优先级更高。

**符号链接跨项目共享：**

```bash
ln -s ~/shared-claude-rules .claude/rules/shared
ln -s ~/company-standards/security.md .claude/rules/security.md
```

### AGENTS.md 兼容

项目里已有给其他 agent 用的 AGENTS.md？一行搞定：

```markdown
@AGENTS.md

## Claude Code 专属

处理 src/billing/ 下的改动时使用 Plan Mode。
```

### Monorepo 排除

大仓库里其他团队的 CLAUDE.md 干扰你？在 `.claude/settings.local.json` 里排除：

```json
{
  "claudeMdExcludes": [
    "**/monorepo/CLAUDE.md",
    "/home/user/monorepo/other-team/.claude/rules/**"
  ]
}
```

组织策略级 CLAUDE.md 不可被排除。

## 六、Auto Memory

除了你写的 CLAUDE.md，Claude 还会**自己写笔记**。

| | CLAUDE.md | Auto Memory |
|---|---|---|
| 谁写 | 你 | Claude |
| 内容 | 指令和规则 | 学习记录和模式 |
| 存储 | 项目目录 | `~/.claude/projects/<project>/memory/` |
| 加载 | 完整加载 | 前 200 行 / 25KB |
| 用途 | 编码标准、工作流、架构 | 构建命令、调试经验、风格偏好 |

Claude 会在工作中自动积累经验：构建命令、调试洞察、架构笔记、代码风格偏好。不是每次对话都写，它自己判断什么值得记住。

- 用 `/memory` 查看所有已加载的指令文件和 auto memory
- Auto memory 是纯 Markdown，你随时可以编辑或删除
- 想让 Claude 记住什么，直接说："记住，API 测试需要本地 Redis"
- 想写进 CLAUDE.md 而不是 memory，明确说："把这条加进 CLAUDE.md"

## 七、排错

### Claude 不听 CLAUDE.md 的规则

1. 跑 `/memory`，确认文件确实被加载了
2. 检查多个文件之间有没有矛盾的指令
3. 把规则写得更具体——"用 2 空格缩进"比"格式化代码"有效得多
4. 文件太长了？规则可能被淹没——精简或拆分
5. 还是不行？升级成 Hook

### CLAUDE.md 太长

- 拆到 `.claude/rules/` 目录
- 用 `@` 导入外部文件
- 删掉 Claude 从代码就能推断的内容

### /compact 后指令丢失

- 根目录 CLAUDE.md 会自动重新注入——不会丢
- 子目录 CLAUDE.md 需要等下次 Claude 读取该目录文件时才懒加载
- 对话中说的指令会被压缩——重要的就写进 CLAUDE.md

## 八、参考资源

**官方文档：**

- [How Claude remembers your project](https://code.claude.com/docs/en/memory) — CLAUDE.md 和 Auto Memory 完整说明
- [Best Practices for Claude Code](https://code.claude.com/docs/en/best-practices) — 官方最佳实践
- [Extend Claude with skills](https://code.claude.com/docs/en/skills) — Skills 配置
- [Automate workflows with hooks](https://code.claude.com/docs/en/hooks-guide) — Hooks 指南
- [Explore the .claude directory](https://code.claude.com/docs/en/claude-directory) — .claude 目录结构

**Harness Engineering：**

- [Martin Fowler: Harness Engineering](https://martinfowler.com/articles/harness-engineering.html) — 概念框架原文
- [OpenAI: Harness Engineering](https://openai.com/index/harness-engineering/) — OpenAI 团队实践
- [Stripe: Minions](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents) — Stripe 的 agent 工作流

**社区：**

- [awesome-harness-engineering](https://github.com/ai-boost/awesome-harness-engineering) — GitHub 资源合集
- [HumanLayer: Writing a good CLAUDE.md](https://www.humanlayer.dev/blog/writing-a-good-claude-md)
- [社区最佳实践合集](https://github.com/shanraisshan/claude-code-best-practice)
