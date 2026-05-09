---
tags:
  - 项目
date: 2026-05-09
---

# Snapzy (vibepin fork)

macOS 菜单栏截图/录屏/标注 app，[duongductrong/Snapzy](https://github.com/duongductrong/Snapzy) 的本地 fork。

代码仓库：`~/Dev/vibepin`
GitHub：`realruian/vibepin`（origin），`duongductrong/Snapzy`（upstream）

## 业务背景

- Snapzy 是 SwiftUI + ScreenCaptureKit 写的 macOS menu-bar 截图工具，定位类似 CleanShot X 但开源
- 功能覆盖：截图（全屏/区域/滚动/OCR/抠图）、录屏（视频/GIF + 系统音 + 麦）、标注编辑器、视频编辑器、Quick Access 浮层、捕获历史、Bring-Your-Own S3/R2 云上传
- 支持 10 语言（含中英），最低 macOS 13
- fork 用途：暂未明确（可能"看代码玩玩"或后续 rebrand 成自己产品 VibePin）

## 关键决策

- （待补充）是否 rebrand 成 VibePin / 是否改 bundle id / 是否走自己的 appcast 链路

## 已知坑点

- `Snapzy/` 是 Xcode 同步根组，**XCTest 必须放 `SnapzyTests/`**，否则被归到 app target
- 区域截图、滚动截图、recording 三套子系统耦合 `PostCaptureActionHandler`，改动后需要回归 Quick Access / 剪贴板 / 自动 Annotate 三条路径
- 云上传凭证只在 Keychain，跨 Mac 迁移走自带的加密 export/import，**不要**写入文件
- macOS 13 + Sandbox + ScreenCaptureKit 真机权限相关测试默认不跑，需要环境变量手动开

## 进展记录

- 2026-05-09：fork 接入 harness，完成项目说明书 + 笔记 + 全局登记
