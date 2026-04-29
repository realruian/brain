---
title: "【最终】设计师V4 Agent技术方案"
source: "https://km.sankuai.com/collabpage/2756660593"
author:
  - "[[meituan]]"
  - "[[企业平台研发部]]"
published:
created: 2026-04-29
description: "学城智能协作文档，AI赋能读写搜，多维表格+权限管理，高效安全办公新体验。"
tags:
  - "clippings"
---

# 1. 背景与目标

## 1.1 项目简介

com.sankuai.horus.design.magent 是美境 AI 设计师 V4 的 Agent 服务，基于 **OpenClaw**（开源 AI Agent 框架）开发。OpenClaw 提供了完整的 Gateway、Agent 引擎、会话管理、工具调用等能力，本项目在此基础上进行配置定制和扩展，其中自研的 **me2b-sandbox 插件** 是关键模块之一，负责将 Agent 的命令执行安全隔离到 me2b 沙箱平台中。

## 1.2 旧架构的问题

此前的 meigen-openclaw 项目将 **整个 OpenClaw（Gateway + Agent + 执行环境）全部打包在 me2b 沙箱内**，由一个 FastAPI 代理服务管理沙箱生命周期并转发请求：
![[Pasted image 20260429134629.png]]

存在的问题：

| 问题   | 说明                              |
| ---- | ------------------------------- |
| 资源浪费 | 每个用户独占完整沙箱（2 CPU / 2GB），大部分时间空闲 |
| 启动慢  | 沙箱从暂停恢复 2-5 秒，新创建更慢             |
| 架构冗余 | FastAPI 只做 HTTP 转发，多了一层无意义的代理   |
| 升级困难 | OpenClaw 版本固化在沙箱模板中，升级需重新构建模板   |
## 1.3 新架构目标

将 OpenClaw 部署在公司标准服务容器上，**仅在需要执行命令时**临时调用沙箱：

- OpenClaw 运行在稳定的服务容器中，不依赖沙箱启停
    
- 沙箱仅在执行命令时使用，用完即释放
    
- Workspace 持久化在宿主机本地，沙箱销毁不影响数据
    
- OpenClaw 升级只需更新 npm 包
    
- 去掉 FastAPI 代理层

# 2\. 系统架构

参考openshell：OpenClaw 远程 Sandbox 工具执行技术文档（OpenShell ）

## 2.1 整体架构

![[Pasted image 20260429134818.png]]

## 2.2 新旧架构对比

# 3\. 核心模块

3.2 启动器 (main.py)

3.3 me2b-sandbox 插件

3.4 沙箱生命周期管理 (SandboxPool)

3.5 中继脚本 (me2b-exec.js)

4\. 关键流程

4.1 完整的命令执行流程

4.2 Mirror 同步机制

4.3 FsBridge 双写机制

5\. 部署方案

5.1 部署架构

5.2 构建说明

5.3 环境变量

5.4 OpenClaw 配置要点

5.5 可用沙箱模板

5.6 接入方式

6\. 风险与规划

6.1 已知风险

6.2 后续优化

7\. 参考文档

【最终】设计师V4 Agent技术方案

正文 1838 字（5.9 页）

浏览 44 次（4 人）

全部

目录

1\. 背景与目标

1.1 项目简介

1.2 旧架构的问题

1.3 新架构目标

2\. 系统架构

2.1 整体架构

2.2 新旧架构对比

3\. 核心模块

3.2 启动器 (main.py)

3.3 me2b-sandbox 插件

3.4 沙箱生命周期管理 (SandboxPool)

3.5 中继脚本 (me2b-exec.js)

4\. 关键流程

4.1 完整的命令执行流程

4.2 Mirror 同步机制

4.3 FsBridge 双写机制

5\. 部署方案

5.1 部署架构

5.2 构建说明

5.3 环境变量

5.4 OpenClaw 配置要点

5.5 可用沙箱模板

5.6 接入方式

6\. 风险与规划

6.1 已知风险

6.2 后续优化

7\. 参考文档

## 1\. 背景与目标

### 1.1 项目简介

com.sankuai.horus.design.magent是美境 AI 设计师 V4 的 Agent 服务，基于 **OpenClaw** （开源 AI Agent 框架）开发。OpenClaw 提供了完整的 Gateway、Agent 引擎、会话管理、工具调用等能力，本项目在此基础上进行配置定制和扩展，其中自研的 **me2b-sandbox 插件** 是关键模块之一，负责将 Agent 的命令执行安全隔离到 me2b 沙箱平台中。

### 1.2 旧架构的问题

[【临时方案】美境 AI 设计师V4 系统设计方案](https://km.sankuai.com/collabpage/2754889263) （评测和RL，可参考这个旧架构的文档）

此前的 meigen-openclaw 项目将 **整个 OpenClaw（Gateway + Agent + 执行环境）全部打包在 me2b 沙箱内** ，由一个 FastAPI 代理服务管理沙箱生命周期并转发请求：

由Mermaid（内测）提供 · **问题反馈**

<iframe src="https://km.sankuai.com/block/mermaid/231908567653?openMode=preview&amp;openEmbed=citadel&amp;openPlatform=pc&amp;openCanAddDiscussion=0&amp;openRefUrl=https%3A%2F%2Fkm.sankuai.com%2Fcollabpage%2F2756660593%23b-1c14e8f8421c48f19374c292e965b8a0&amp;lang=zh&amp;isFirstLoad=1" frameborder="0" allow="" title="1c14e8f8421c48f19374c292e965b8a0" allowfullscreen=""></iframe>

存在的问题：

| 问题 | 说明 |
| --- | --- |
| 资源浪费 | 每个用户独占完整沙箱（2 CPU / 2GB），大部分时间空闲 |
| 启动慢 | 沙箱从暂停恢复 2-5 秒，新创建更慢 |
| 架构冗余 | FastAPI 只做 HTTP 转发，多了一层无意义的代理 |
| 升级困难 | OpenClaw 版本固化在沙箱模板中，升级需重新构建模板 |

### 1.3 新架构目标

将 OpenClaw 部署在公司标准服务容器上， **仅在需要执行命令时** 临时调用沙箱：

- OpenClaw 运行在稳定的服务容器中，不依赖沙箱启停
- 沙箱仅在执行命令时使用，用完即释放
- Workspace 持久化在宿主机本地，沙箱销毁不影响数据
- OpenClaw 升级只需更新 npm 包
- 去掉 FastAPI 代理层

## 2\. 系统架构

参考openshell： [OpenClaw 远程 Sandbox 工具执行技术文档（OpenShell ）](https://km.sankuai.com/collabpage/2756681191)

### 2.1 整体架构

由Mermaid（内测）提供 · **问题反馈**

<iframe src="https://km.sankuai.com/block/mermaid/231912166453?openMode=preview&amp;openEmbed=citadel&amp;openPlatform=pc&amp;openCanAddDiscussion=0&amp;openRefUrl=https%3A%2F%2Fkm.sankuai.com%2Fcollabpage%2F2756660593%23b-4c0619a62fb34783a29e9d537f717506&amp;lang=zh&amp;isFirstLoad=1" frameborder="0" allow="" title="4c0619a62fb34783a29e9d537f717506" allowfullscreen=""></iframe>

### 2.2 新旧架构对比

由Mermaid（内测）提供 · **问题反馈**

<iframe src="https://km.sankuai.com/block/mermaid/231907873234?openMode=preview&amp;openEmbed=citadel&amp;openPlatform=pc&amp;openCanAddDiscussion=0&amp;openRefUrl=https%3A%2F%2Fkm.sankuai.com%2Fcollabpage%2F2756660593%23b-c74af67d97fe4cbc98326c7a70467805&amp;lang=zh&amp;isFirstLoad=1" frameborder="0" allow="" title="c74af67d97fe4cbc98326c7a70467805" allowfullscreen=""></iframe>

## 3\. 核心模块

### 3.2 启动器 (main.py)

Python 启动器负责服务启动前的准备工作：加载 `.env` 环境变量 → 从模板生成 `openclaw.json` → 复制插件到 OpenClaw 扩展目录 → 初始化 workspace → `os.execv` 替换进程为 `openclaw gateway` 。启动后 Python 进程被替换，运行时无额外进程开销。

### 3.3 me2b-sandbox 插件

这是项目的核心模块。它实现了 OpenClaw 的 `SandboxBackend` 接口，使 Agent 的所有命令执行（python/node/bash）和文件读写自动走 me2b 沙箱，对 Agent 完全透明。插件还注册了 `shutdown hook` ，在 Gateway 关闭时自动销毁所有沙箱。

**插件注册流程** ：

由Mermaid（内测）提供 · **问题反馈**

<iframe src="https://km.sankuai.com/block/mermaid/231910343460?openMode=preview&amp;openEmbed=citadel&amp;openPlatform=pc&amp;openCanAddDiscussion=0&amp;openRefUrl=https%3A%2F%2Fkm.sankuai.com%2Fcollabpage%2F2756660593%23b-bafa76a3c1a241ab90bd1da34cf4beb9&amp;lang=zh&amp;isFirstLoad=1" frameborder="0" allow="" title="bafa76a3c1a241ab90bd1da34cf4beb9" allowfullscreen=""></iframe>

**关键接口实现** ：

| 接口 | 作用 | 实现方式 |
| --- | --- | --- |
| `buildExecSpec` | 构建命令执行规格 | 返回中继脚本 argv，OpenClaw spawn 子进程 |
| `finalizeExec` | 命令执行后清理 | 触发 sandbox→local 同步，销毁沙箱 |
| `runShellCommand` | 直接运行 shell 命令 | 调用 `sandbox.commands.run()` |
| `createFsBridge` | 创建文件系统桥接 | 返回 mirror 模式 FsBridge |

### 3.4 沙箱生命周期管理 (SandboxPool)

沙箱不是每次命令都创建销毁，而是 **按 session 缓存复用** ：

- `getOrCreate(sessionKey)` — 同一 session（即同一轮对话）复用沙箱，首次调用时创建
- `destroy(sessionKey)` — 销毁指定 session 的沙箱
- `destroyAll()` — Gateway shutdown 时调用，清理所有沙箱
- **闲置自动清理** — 每 60s 检查一次，闲置超过 `idleKillMs` （默认 10 分钟）的沙箱自动销毁

这意味着一轮对话中 Agent 执行多条命令时，只需创建一次沙箱，后续命令直接复用，显著减少沙箱创建开销。

### 3.5 中继脚本 (me2b-exec.js)

这是架构中一个关键的设计决策。OpenClaw 的 `buildExecSpec` 接口要求返回一个 argv 数组，由框架通过 `child_process.spawn` 执行。而 me2b SDK 是通过 HTTP API 与沙箱通信的，不走 SSH。

解决方案是用一个 **中继脚本** 做桥接：

由Mermaid（内测）提供 · **问题反馈**

<iframe src="https://km.sankuai.com/block/mermaid/231909868500?openMode=preview&amp;openEmbed=citadel&amp;openPlatform=pc&amp;openCanAddDiscussion=0&amp;openRefUrl=https%3A%2F%2Fkm.sankuai.com%2Fcollabpage%2F2756660593%23b-4a57c78b625449a1b5f307cbc4ef0162&amp;lang=zh&amp;isFirstLoad=1" frameborder="0" allow="" title="4a57c78b625449a1b5f307cbc4ef0162" allowfullscreen=""></iframe>

环境变量 `ME2B_SANDBOX_ID` 、 `ME2B_API_KEY` 等由 `buildExecSpec` 注入到子进程环境中。

## 4\. 关键流程

### 4.1 完整的命令执行流程

由Mermaid（内测）提供 · **问题反馈**

<iframe src="https://km.sankuai.com/block/mermaid/231908126016?openMode=preview&amp;openEmbed=citadel&amp;openPlatform=pc&amp;openCanAddDiscussion=0&amp;openRefUrl=https%3A%2F%2Fkm.sankuai.com%2Fcollabpage%2F2756660593%23b-b121dcbe2b8a487bae7a7cc6d7262589&amp;lang=zh&amp;isFirstLoad=1" frameborder="0" allow="" title="b121dcbe2b8a487bae7a7cc6d7262589" allowfullscreen=""></iframe>

### 4.2 Mirror 同步机制

Mirror 模式的核心思想： **宿主机本地 workspace 是数据的 source of truth** ，沙箱只是临时的执行环境。

由Mermaid（内测）提供 · **问题反馈**

<iframe src="https://km.sankuai.com/block/mermaid/231909876330?openMode=preview&amp;openEmbed=citadel&amp;openPlatform=pc&amp;openCanAddDiscussion=0&amp;openRefUrl=https%3A%2F%2Fkm.sankuai.com%2Fcollabpage%2F2756660593%23b-d66f5197910f40b09f3492de5dfdf74f&amp;lang=zh&amp;isFirstLoad=1" frameborder="0" allow="" title="d66f5197910f40b09f3492de5dfdf74f" allowfullscreen=""></iframe>

**同步排除目录** ：`.git` 、 `hooks` 、 `git-hooks` 、 `node_modules` — 这些目录不会在宿主机和沙箱之间同步。

**同步后替换策略** ：先下载到 `/tmp/me2b-mirror-*` 临时目录，再用 `replaceDirectoryContents` 原子替换本地 workspace，保证中断安全。

### 4.3 FsBridge 双写机制

Mirror 模式的 FsBridge 实现了 "本地读、双写" 策略： **读操作** （readFile/stat）始终从本地 workspace 读取（source of truth）； **写操作** （writeFile/mkdirp/remove/rename）先写本地，再 best-effort 同步到沙箱——沙箱写失败不影响本地数据。所有路径操作都有逃逸检查，防止越出 workspace 目录。

## 5\. 部署方案

### 5.1 部署架构

基于公司 Plus 平台部署，使用 manifest.yaml 定义构建和部署流程。

由Mermaid（内测）提供 · **问题反馈**

<iframe src="https://km.sankuai.com/block/mermaid/231910196720?openMode=preview&amp;openEmbed=citadel&amp;openPlatform=pc&amp;openCanAddDiscussion=0&amp;openRefUrl=https%3A%2F%2Fkm.sankuai.com%2Fcollabpage%2F2756660593%23b-10011a3448004213a37a3bff57a37981&amp;lang=zh&amp;isFirstLoad=1" frameborder="0" allow="" title="10011a3448004213a37a3bff57a37981" allowfullscreen=""></iframe>

### 5.2 构建说明

由于 OpenClaw npm 包较大且内网 npm registry 缺少部分依赖，采用 **预打包 + S3 分发** 的方式：在开发机上 `npm install` 后将 node\_modules 打包上传到 S3，构建时直接下载解压，避免构建机执行 npm install。插件的 me2b SDK 依赖（ `@sandbox/code-interpreter` ）在构建时从内网 npm registry 安装。

### 5.3 环境变量

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `FRIDAY_API_KEY` | 是 | Friday LLM 服务 API Key |
| `ME2B_API_KEY` | 是 | me2b 沙箱平台 API Key |
| `ME2B_DOMAIN` | 线上 | 沙箱平台域名 ([sandbox.sankuai.com](http://sandbox.sankuai.com/)) |
| `ME2B_API_URL` | 线上 | 沙箱 API URL |

### 5.4 OpenClaw 配置要点

主要配置项：LLM Provider 使用 Friday 平台（aigc.sankuai.com），默认模型 kimi-k2.5；Gateway 监听 18789 端口（local 模式）；沙箱配置为 `sandbox.mode: all, backend: me2b-sandbox` ，所有命令执行均通过 me2b 沙箱；Agent 最大并发数 8，沙箱闲置 10 分钟后自动销毁。

### 5.5 可用沙箱模板

| 模板 | 说明 |
| --- | --- |
| `base` | Debian 13, Python 3.11, Node 20, 极简 |
| `code-interpreter-v1` | 丰富依赖, Python 3.12, Node 20 |
| `openclaw-beta` | Node 24, OpenClaw, Chromium |

当前使用 `base` 模板。后续可根据 Agent 需要的执行环境切换到更丰富的模板。

### 5.6 接入方式

Gateway 提供两种接入方式： **Control UI** — 浏览器访问 `http://<host>:18789` 进行交互式对话； **Chat Completions API** — 上游服务通过 `/v1/chat/completions` 接口调用（OpenAI 兼容格式），使用 Gateway 首次启动时自动生成的 auth token 鉴权。

## 6\. 风险与规划

### 6.1 已知风险

| 风险 | 影响 | 缓解措施 |
| --- | --- | --- |
| Mirror 同步耗时（大 workspace） | 性能 | 后续优化为增量同步，仅同步变更文件 |
| 同步中断导致数据不一致 | 数据完整性 | 使用临时目录+原子替换；失败时保留本地版本 |
| 沙箱创建延迟 | 用户体验 | 后续引入沙箱池预热 |
| 宿主机磁盘空间 | 运维 | 定期清理不活跃 workspace；磁盘监控 |

### 6.2 后续优化

**P0:**

需要用 remote 模式，构建hulk服务无状态，使用me2b的s3fs挂载技术。

P2:

1. **增量同步** — 对比文件 mtime/hash，仅同步变更文件
2. **沙箱池预热** — 提前创建空闲沙箱，减少首次执行延迟

## 7\. 参考文档

- [OpenClaw 远程 Sandbox 工具执行技术文档（OpenShell ）](https://km.sankuai.com/collabpage/2756681191)
- [美团沙箱平台Node SDK接入指南](https://km.sankuai.com/collabpage/2739772438)
- [Sandbox公共模板基础环境说明](https://km.sankuai.com/collabpage/2735463277)
- 插件设计文档： `docs/me2b-sandbox-plugin-design.md`
- 参考实现：OpenClaw 官方 openshell 扩展