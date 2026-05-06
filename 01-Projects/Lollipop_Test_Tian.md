---
tags:
  - 项目
date: 2026-05-02
---
# Lollipop（Tian 前端分支）

Lollipop 主仓的前端实验分支，仅改 frontend，后端共享主仓。

代码仓库：`~/Dev/Lollipop_Test_Tian`

## 业务背景

- Lollipop Recruit 是 AI 面试平台，求职者通过邀请码注册 → 选岗位 → 填简历 → 由豆包 Realtime API 进行实时语音面试 → 自动生成结构化评估报告。
- 本仓是 Tian 的前端实验/迭代分支，**只改 `frontend/`**；`backend/` / `admin/` / `scripts/` / 部署脚本 / `.env*` 不能动。
- 前端依赖后端配合的功能（新接口 / 字段变更 / 登录改造），需要停下来通知用户由用户在主仓 `Lollipop` 实施。

## 关键决策

- 简历编辑页（`/resume/edit`）改造：
  - 5 张 section 卡片（Hero / 优势亮点 / 教育 / 工作 / 项目），display 模式 prose 排版 + 编辑模式 form
  - 工作经历 / 项目经历是 entry 级编辑（每条独立 取消/确认），其它三张 section 级
  - 顶栏「编辑/保存」按钮已移除，全部走卡片右上角「编辑」按钮 + 卡内底部「取消/确认」
  - 「+」按钮新增的条目落在数组顶部，且自动进入该条的编辑态
  - `editingSection` + `editingItemIndex` 双状态控制
- AI 优化面板（右侧 320px 固定卡）：
  - 4 个 chip（润色 / 量化 / 精简 / STAR）按字段类型动态隐藏（不在矩阵的直接不显示，不再置灰）
  - 输入框结构外层固定 `rounded-3xl`(24px) + 内层 `rounded-xl`(12px) 12px padding，满足同心圆公式
  - AIFieldWrapper 选中态去掉外层 ring，改成靠子选择器换内层 FloatTextarea 的 border 色，避免双层视觉
- 简历表单组件（FloatInput / FloatSelect / FloatTextarea）四边内边距统一 12px、圆角 `rounded-[12px]`，标签从 absolute 改成正常流 + `mt-1` 间距。
- 内容卡 + 左/右栏左右间距对称 40px（4 的倍数）：layout `ml-[280px]` + ResumeEditLayout `pl-5 pr-[380px]`。

## 已知坑点

- `backend/services/interview_runtime/` 多 Agent v2 决策内核、`backend/services/doubao_client.py` 二进制协议、`backend/api/websocket/interview.py` WS 主循环、`frontend/hooks/use{InterviewSession,AudioPlayer,AudioCapture,MediaRecorder}.ts` 实时音视频协同 —— 改前对齐项目所有者，时序敏感。
- 服务器部署后必须 `kill -9` 所有旧 `next-server` 进程再启动，否则加载旧 build。
- 岗位配置 `JOB_PROFILES` 修改后不会自动同步到已有 DB，需清空 jobs 表或重建数据库。
- `app/(app)/jobs/page.tsx` 当前 typecheck 报 `displayCount` / `setDisplayCount` 未定义（用户在改的代码）—— 不要被误判为本次改动引入的。

## 进展记录

- 2026-05-02：完成简历页（`/resume/edit`）大改：5 卡片化 + Hero 卡 + 个人优势独立 + 双态 prose 排版 + 【tag】高亮 + 卡片级独立编辑（工作 / 项目 entry 级）+ 表单组件 12px 统一 + 左右间距对称 40px。Harness 三步仪式同日完成。
- 2026-05-04：AI 简历面板交互重做（chip / 输入态合并）+ 多页视觉 sweep + 移除 MiSans 改系统字体栈 + 面试间 loading 屏重做（白底 4 步 stepper）。
