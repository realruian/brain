---
tags: [项目, 个人, 语音笔记, Electron, AI]
date: 2026-04-14
---
# Vibe Voice

macOS 桌面应用 — 语音转文字 + AI 多轮对话。上传录音或应用内实时录制，自动转写为文字，基于内容与 AI 对话。

代码仓库：`~/dev/personal/vibe-voice`

> 技术栈、目录结构、编码规范、构建命令等见项目仓库的 CLAUDE.md

---

## 业务背景

个人项目，解决的问题：会议录音、采访、语音备忘录需要手动整理。目标是一键转写 + 在同一窗口内基于内容与 AI 对话（总结要点、提取待办、翻译等）。

---

## 关键决策

- **转写用 AIhubmix Whisper 而非本地 whisper.cpp**：最初计划用本地模型，但 Apple Silicon 上的 whisper.cpp 编译问题太多，改用云端 API 更稳定。OpenRouter 的 Whisper 端点不稳定，AIhubmix 更可靠
- **双平台支持（AIhubmix + OpenRouter）**：AIhubmix 转写更稳定但模型少，OpenRouter 模型多但转写走 Gemini 多模态。两者都兼容 OpenAI 接口格式，维护成本低
- **electron-store 而非 SQLite**：数据量小（设置 + 项目列表），不需要关系型数据库。序列化时去掉运行时字段（messages / isTranscribing）
- **模拟进度条 + 真实阶段双轨显示**：Whisper API 不返回进度，用文件大小估算总时长做模拟进度，同时 IPC 推送真实阶段（preparing → compressing → transcribing → formatting）

---

## 已知问题 / 坑点

- 音频 >24MB 必须先用 ffmpeg 压缩，否则 Whisper API 拒绝。压缩码率按 `目标字节 / 时长 / 125` 计算
- 音频 >10 分钟要用 ffmpeg 分片，每片单独上传后拼接文本，否则转写质量下降
- 上传用 Node.js 原生 `https` 手工构建 multipart/form-data，不能用 fetch（Electron 主进程限制）
- 全局快捷键（⌘N、⌘,）必须随窗口焦点动态注册/注销，否则会和其他 app 冲突
- OpenRouter SSE 流会插入 `: OPENROUTER PROCESSING` 注释行，解析时要跳过

---

## 进展记录
