---
tags:
  - 项目
date: 2026-05-09
---

# Vibepin

macOS 菜单栏截图 + Pin to Screen（Snipaste 风格贴图）+ 录屏 app。

代码仓库：`~/Dev/vibepin-app`
GitHub：[realruian/vibepin-app](https://github.com/realruian/vibepin-app)（private） · upstream: [lzhgus/Capso](https://github.com/lzhgus/Capso)

## 业务背景

- 起点是想做一个"Snipaste + 录屏"的 macOS app（Snipaste Mac 版闭源 + 没录屏；CleanShot X 收费）
- 最初路线是 fork [duongductrong/Snapzy](https://github.com/duongductrong/Snapzy) 改造（见 `~/Dev/vibepin` 仓库），但 Snapzy 没有 Pin to Screen，要从零写
- 调研发现 [lzhgus/Capso](https://github.com/lzhgus/Capso)（815★、Swift 6+、模块化 SPM）已经实现 Pin + 录屏 + OCR + Cloud Share，几乎完全匹配需求
- 决策：放弃 Snapzy 路线，fork Capso v0.7.1 直接 rebrand 成 Vibepin，后续在此基础上做差异化

## 关键决策

- **2026-05-09**：完整 rebrand（L3 级），所有 Capso 字符串清零（包括 Bundle ID、Logger subsystem、Keychain service、临时文件路径、菜单栏/Settings/向导文案）
- **License**：上游是 BSL 1.1（3 年后转 Apache 2.0），个人/开源/内部用 OK，**不能卖钱**到 2029 年
- **签名**：ad-hoc 本地，无 Apple Developer 账户。要分发给别人需要先解决签名（自购 Developer ID 或 ad-hoc 配 quarantine 移除指引）
- **Sparkle 自动更新**：已禁用，断开和上游 Capso release channel 的连接。要做自动更新需自建 appcast.xml + ed25519 签名
- **Snapzy fork 仓库（`~/Dev/vibepin`）archive**：使命已完成（验证 macOS 截图开发可行性），保留作 reference

## 已知坑点

- **xcodegen 必需**：改了 `project.yml` 必须重新 `xcodegen generate`，否则 Xcode 看到的还是旧配置
- **framework 重签**：cp 装到 /Applications 后必须 `codesign --force --sign -` 重签 Sparkle.framework + 主 app，否则 dyld 报"Team ID 不一致"拒绝加载
- **shallow clone 不能直接 push**：当时 fork Capso 用了 `--depth 1`，需要 `rm -rf .git && git init` 重置 history 才能 push 到自己 repo
- **macOS Finder 显示名 ≠ Info.plist CFBundleDisplayName**：Finder 在 `/Applications/` 优先用 .app 文件夹的真实文件名。要 Finder 也显示新名字，必须重命名 .app 文件夹
- **6 处 GitHub URL 已改指 realruian/vibepin-app**：Settings 里的 Report Bug / Feature Request / Source Code 三个按钮都指自己仓库，注意 issue templates 还没建（点会 404）
- **`scripts/`、`Casks/`、`appcast.xml`、`README*.md` 都是 Capso 原仓库自带**，未清理（不影响 build）

## 进展记录

- 2026-05-09：完成完整 rebrand 三步走
  - L1（5min）：换 .app 文件夹名 + AppIcon
  - L2（30min）：fork Capso 源码全局替换 + 重编
  - L3（最终）：包括 Bundle ID / Keychain / Logger / 临时路径 / GitHub URL 全套替换
  - 推到 GitHub private repo，加 upstream remote 用于将来同步
  - harness 三步仪式
