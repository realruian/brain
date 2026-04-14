---
tags: [项目, 个人, 语音笔记, Electron, AI]
date: 2026-04-14
---

# Vibe Voice

macOS 桌面应用 — 语音转文字 + AI 多轮对话。上传录音或应用内实时录制，自动转写为文字，基于内容与 AI 对话。

代码仓库：`~/dev/personal/vibe-voice`

---

## 项目概述

Vibe Voice 让用户把会议录音、采访、语音备忘录等音频一键转写为结构化文字，并在同一窗口内基于转写内容与 AI 多轮对话（总结要点、提取待办、翻译等）。

核心流程：
1. 上传音频（拖放 / 文件对话框）或应用内录音
2. 主进程调用 Whisper API 转写（自动压缩大文件 / 分片长音频）
3. 转写完成后 LLM 自动添加标点并分段
4. 用户在右侧对话面板基于转写内容与 AI 聊天

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Electron 41 + Vite 8 |
| 前端 | React 19 + TypeScript 6 |
| 样式 | Tailwind CSS 4 |
| 状态管理 | Zustand |
| 转写 | Whisper API（AIhubmix，`/audio/transcriptions`）|
| LLM 对话 | OpenRouter / AIhubmix（OpenAI 兼容，SSE 流式）|
| 音频处理 | ffmpeg（压缩 / 分片 / 格式转换 / 时长检测）|
| 持久化 | electron-store（设置 + 项目列表）|
| 打包 | electron-builder → `.dmg`（Apple Silicon）|
| 包管理 | pnpm |

---

## 目录结构

```
vibe-voice/
├── electron/
│   ├── main.ts          # 主进程：窗口管理、IPC handler、全局快捷键
│   ├── preload.ts       # contextBridge 暴露 window.electronAPI
│   ├── store.ts         # electron-store 本地持久化（设置 + 项目）
│   └── whisper.ts       # 转写核心：ffmpeg 压缩/分片 + Whisper API 上传
├── src/
│   ├── App.tsx                  # 根组件，视图路由（home / project）
│   ├── components/
│   │   ├── HomePage.tsx         # 首页：项目表格、搜索、上传入口
│   │   ├── Sidebar.tsx          # 侧边栏：项目列表 + 导航图标
│   │   ├── ProjectView.tsx      # 项目详情：转写面板 + 对话面板分栏
│   │   ├── TranscriptPanel.tsx  # 转写面板：显示 / 编辑 / 复制 / 导出
│   │   ├── ChatPanel.tsx        # AI 对话面板：流式 Markdown 渲染
│   │   ├── RecordingModal.tsx   # 录音弹窗：暂停 / 继续 / 结束
│   │   ├── SettingsModal.tsx    # 设置弹窗：API Key / 模型 / 录音目录
│   │   ├── SettingsPage.tsx     # Onboarding：首次启动引导页
│   │   ├── Icon.tsx             # SVG 图标封装组件
│   │   └── Toast.tsx            # 全局通知提示
│   ├── stores/
│   │   └── useAppStore.ts       # Zustand 全局状态
│   ├── lib/
│   │   ├── api.ts               # LLM 流式对话 + 转写后格式化
│   │   ├── models.ts            # 平台 & 模型定义（OpenRouter / AIhubmix）
│   │   └── utils.ts             # 工具函数
│   └── styles/
│       └── globals.css          # 全局样式 + Tailwind 入口
├── icon/                        # SVG 图标素材（Material Symbols）
├── CLAUDE.md
├── package.json
├── vite.config.ts
├── electron-builder.yml
└── tsconfig.json
```

---

## 核心模块说明

### 1. 转写引擎 `electron/whisper.ts`

- **时长 / 大小检测**：ffprobe 获取时长，`fs.statSync` 获取文件大小
- **自动压缩**：文件 >24MB 时按 `目标码率 = 上限字节 / 时长 / 125` 公式计算 kbps，用 ffmpeg 压缩为单声道 16kHz MP3
- **自动分片**：音频 >10 分钟时用 `ffmpeg -f segment` 切割，每片单独上传后文本拼接
- **上传**：手工构建 `multipart/form-data`（Node.js `https` 原生模块，不依赖 fetch），POST 到 `/audio/transcriptions`
- **阶段回调**：`preparing → compressing → transcribing → formatting`，通过 IPC 推送进度到渲染进程

### 2. IPC 通信层 `electron/main.ts` + `electron/preload.ts`

- `contextBridge.exposeInMainWorld` 向渲染进程暴露 `window.electronAPI`
- 约 15 个 IPC handler，覆盖：
  - 文件对话框（选音频、选目录、保存导出）
  - 音频转写（透传到 `whisper.ts`）
  - 设置 & 项目数据读写
  - 录音文件保存（ArrayBuffer → webm 写磁盘）
  - 存储统计 / 打开 Finder / 系统通知
- 全局快捷键（⌘N、⌘,）随窗口焦点动态注册，失焦时注销，防止与其他 app 冲突

### 3. 本地持久化 `electron/store.ts`

- `electron-store` 存储两类数据：
  - **settings**：platform、apiKeys（按平台 ID 存多个 key）、chatModel、transcribeModel、recordingDir
  - **projects**：项目列表（序列化时去掉 messages / isTranscribing 等运行时字段）
- 支持旧版单 `apiKey` 字段迁移到新版多平台 `apiKeys` map

### 4. 全局状态 `src/stores/useAppStore.ts`

- Zustand store 管理：视图导航（home / project）、项目列表、设置、Toast
- 项目写操作触发防抖（500ms）同步到 electron-store
- 转写进度双轨显示：
  - **模拟计时器**：按文件大小估算总时长，平滑推进 0-99%
  - **真实阶段**：IPC 事件推送 stage（`preparing / compressing / transcribing / formatting`）

### 5. LLM 对话 & 格式化 `src/lib/api.ts`

- **`streamChat`**：SSE 流式解析，兼容 OpenRouter 的 keep-alive 注释行（`: OPENROUTER PROCESSING`），转写内容通过 system message 注入对话上下文
- **`formatTranscript`**：转写完成后非流式调用 LLM，为原始转写文本添加标点、合理分段，失败时回退到原始文本

### 6. 模型系统 `src/lib/models.ts`

支持两个 API 平台，均兼容 OpenAI 接口格式：

| 平台 | 转写方式 | 对话模型数量 |
|------|---------|-------------|
| **AIhubmix** | Whisper API（推荐，更稳定）| ~20 款精选 |
| **OpenRouter** | Gemini 多模态 | 40+ 款 |

- 转写固定使用 AIhubmix Whisper，对话模型按用户选择的平台走
- `getGroupedModels` 按厂商（Anthropic / OpenAI / Google / DeepSeek / Qwen …）分组展示
- Whisper 模型列表独立维护，默认 `whisper-large-v3-turbo`

---

## 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| `⌘ N` | 新建项目（上传音频）|
| `⌘ ,` | 打开设置 |
| `⌘ W` | 关闭窗口 |
| `⌘ Q` | 退出应用 |

## 构建命令

```bash
pnpm dev       # 开发模式
pnpm build     # 生产构建
pnpm dist      # 打包为 .dmg（Apple Silicon）
```

---

## 进展记录
