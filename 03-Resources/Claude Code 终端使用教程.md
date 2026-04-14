## 基本操作

**启动：** 先 `cd` 到你的项目目录，然后输入 `claude`

```bash
cd ~/my-project
claude
```

Claude Code 会自动读取你整个项目的结构。

**发消息：** 直接打字，按 Enter 发送。就像聊天一样，但它能看到你的文件。

**退出：** 输入 `exit` 或按 `Ctrl+D`

**中断 Claude：** 按 `Esc`，Claude 会停下正在做的事

---

## 最常用的快捷键

|按键|作用|
|---|---|
|`Enter`|发送消息|
|`Esc`|中断 Claude|
|`Esc Esc`（连按两次）|撤销 Claude 最近的改动|
|`↑`|翻出上一条你发的消息|
|`Tab`|自动补全|
|`Shift+Tab`|切换权限模式（bypass/allowlist/off）|
|`/`|查看所有斜杠命令|
|`!` + 命令|运行终端命令并把结果给 Claude 看|

---

## 斜杠命令

在 Claude Code 里输入 `/` 就能看到所有命令。最常用的：

|命令|干嘛的|
|---|---|
|`/help`|查看帮助|
|`/model`|切换模型（opus / sonnet）|
|`/effort`|切换思考深度（low / medium / high）|
|`/status`|查看当前状态（模型、账号、MCP等）|
|`/cost`|查看本次会话花了多少|
|`/clear`|清空上下文，从头开始（换任务时用）|
|`/compact`|压缩上下文，保留重要信息释放空间|
|`/rewind`|撤回到之前某个时间点|
|`/hooks`|查看和配置 Hooks|
|`/mcp`|查看 MCP 服务连接状态|
|`/login` `/logout`|登录 / 登出|

---

## 日常使用场景

**1. 让 Claude 了解你的项目（每次新会话第一件事）**

```
这个项目是什么？帮我梳理一下整体架构
```

**2. 写功能**

```
在 src/components 里新建一个 AudioPlayer 组件，支持播放/暂停/进度条，用 TypeScript + Apple HIG 风格
```

**3. 修 Bug**

```
运行 npm run build 报了一个 TypeScript 错误，帮我修
```

**4. 引用特定文件（用 @）**

```
看一下 @src/main/ipc.ts 这个文件，帮我理解 IPC 通信的逻辑
```

**5. 跑命令并把结果给 Claude**

直接输入 `!npm test`，Claude 会看到命令输出并据此帮你解决问题。

**6. Plan Mode（先规划后执行）**

```
帮我规划一下怎么给这个语音笔记 app 加多语言支持，先不要改代码，只给我方案
```

看完方案满意了再说"按这个方案执行"。

---

## 权限系统

Claude 在执行文件修改或命令时，会根据你底部状态栏的权限设置来决定要不要问你：

- **bypass on**：全自动，不问你（你信任 Claude 时开着）
- **allowlist**：只自动批准白名单里的操作
- **off**：每次都问你批准（最安全，新手推荐）

用 `Shift+Tab` 切换。


---

## CLAUDE.md（你的项目"说明书"）

在项目根目录创建一个 `CLAUDE.md` 文件，Claude Code 每次启动都会自动读取：

```
帮我在项目根目录创建一个 CLAUDE.md，包含项目概述、技术栈、架构说明和注意事项
```

让 Claude 自己帮你写第一版就行。每次 Claude 犯了一个错，就加一行进去，防止下次再犯。

---

## 实用建议

- **换任务时用 `/clear`**：上下文里留着上一个任务的信息会干扰新任务，清掉重新开始
- **用 `/effort high` 处理复杂问题**：简单任务保持 medium，架构设计或疑难 bug 切 high
- **日常用 Sonnet，难题切 Opus**：`/model sonnet` 快而便宜，`/model opus` 慢但深
- **经常 `/cost` 看一眼**：了解你的用量，避免不知不觉用超了
- **善用 `Esc Esc` 撤销**：Claude 改错了，连按两次 Esc 回到改之前的状态