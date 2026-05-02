---
tags: [项目, 美团, 海报生成, Pillow, Gemini, OpenClaw]
date: 2026-04-15
---
# Gundam-head-FN

美食头图海报生成器 — 输入标题和场景（或业务 JSON），自动合成 750×450 营销头图 PNG。支持 AI 换菜品。已作为 OpenClaw Skill 交付业务方。

代码仓库：`~/dev/meituan/Gundam-head-FN`

---

## 项目概述

美团外卖营销头图自动化生成工具。覆盖早餐/午餐/下午茶/晚餐四个时段场景，每个场景有独立的底图、装饰条、字体和排版规则。可接入 Gemini AI 根据配图提示词自动识别菜品并替换底图中的食物。

核心流程：
1. 确定场景（从 JSON 的 `策略.时段` 或手动 `--scene` 指定）
2. AI 菜品识别 + 底图编辑（Gemini，可选）
3. 图层合成：base.png → 标题文字渲染 → 副标题 → top-bar.png
4. 输出 750×450 PNG

---

## 技术栈

| 类别      | 技术                                   |
| ------- | ------------------------------------ |
| 语言      | Python 3.9+                          |
| 图像处理    | Pillow（4× 超采样抗锯齿）                    |
| AI 换菜品  | Gemini 3.1 Flash Image Preview（图片编辑） |
| AI 菜品识别 | Gemini 2.5 Flash（文本提取）               |
| 环境变量    | python-dotenv                        |
| 交付形式    | OpenClaw Skill（SKILL.md）             |

纯 Python CLI，无构建工具、无框架。

---

## 目录结构

```
Gundam-head-FN/
├── assets/
│   ├── fonts/                    # 5 个字体（方正锐宋/准圆/兰亭粗黑、汉仪风竹、美团体）
│   └── scenes/                   # 4 个场景
│       ├── lunch/                # base.png + top-bar.png + style.json
│       ├── breakfast/
│       ├── afternoon/
│       └── dinner/
├── scripts/
│   ├── compose.py                # 核心：图层合成 + 标题渲染 + Gemini 换菜品
│   └── from_json.py              # 业务 JSON 驱动：字段解析 → 菜品提取 → 调用 compose.py
├── SKILL.md                      # OpenClaw Skill 文档（AI 助手行为指南）
├── CLAUDE.md                     # 项目说明 + 编码规范
├── requirements.txt
└── .env                          # GEMINI_API_KEY
```

---

## 核心模块说明

### 1. compose.py — 图层合成 + 标题渲染

- **三种模式**：Normal（纯合成）、Edit（Gemini 编辑底图菜品）、Regen（从单品图重新摆盘）
- **标题渲染**：4× 超采样 + shear 仿射变换，支持分色渲染（dinner 场景）、字间距、居中对齐、自动换行
- **字数校验**：读取 style.json 的 `max_chars_per_line` / `max_lines`，超限打印警告
- **Gemini 调用**：`EDIT_PROMPT` 控制菜品替换规则（透视一致、禁止多余食物、主次构图）

### 2. from_json.py — 业务 JSON 入口

- **字段映射**：`策略.时段` → scene，`页面结构.分区[头图区].头图文案` → title，`内容.配图提示词` → Gemini 菜品识别
- **EXTRACT_PROMPT**：从中文配图描述提取 2-3 个主菜品英文名（防复合拆分、按重要性排序）
- **_build_instruction**：按场景构造摆盘指令（dinner 铺满 vs 其他右下角留白、三角构图、少量菜品放大）
- **--title 覆盖**：AI 助手缩写标题后可通过此参数传入

### 3. style.json — 场景配置

每个场景的排版规则，驱动 compose.py 的渲染行为：

| 场景 | 每行字数 | 最大行数 | 副标题 | 背景色 |
|------|---------|---------|--------|--------|
| lunch | 5 | 多行 | 无 | #FFCD87 |
| breakfast | 6 | 1 | 无 | #FFA502 |
| afternoon | 6 | 1 | 有 | #9DC162 |
| dinner | 6 | 1 | 无 | #00256C |

---

## Gemini Prompt 架构

```
配图提示词（中文）
  → EXTRACT_PROMPT（Gemini 文本模型）→ 英文菜品名（2-3 个）
    → _build_instruction（按场景构造摆盘指令）
      → EDIT_PROMPT + instruction（Gemini 图片模型）→ 替换后的底图
        → compose()（图层合成 + 标题渲染）→ 成品 PNG
```

---

## 常用命令

```bash
# 基本合成
python3 scripts/compose.py --title "今天想吃点\n不一样的" --scene lunch

# 业务 JSON 驱动
python3 scripts/from_json.py input.json

# JSON + 标题覆盖
python3 scripts/from_json.py input.json --title "缩写后的标题"

# 只出底图不渲染文字
python3 scripts/from_json.py input.json --no-title
```

---

## 进展记录

### 2026-04-15

**做了什么：**

- EDIT_PROMPT 优化：强化透视一致性（共享消失点、25-45° 斜视角禁俯拍）、禁止多余装饰、强调菜品精致大份、主次构图
- EXTRACT_PROMPT 修复：防止复合菜品拆分（"草莓蛋糕"不再拆成"草莓"+"蛋糕"）、增加 2-3 个主菜品软上限
- _build_instruction 重写：精确计数、三角构图（3 道菜）、少量菜品放大提示、按场景区分摆盘位置
- compose.py 新增 --no-title 参数、render_title 字数校验（只警告不截断）
- from_json.py 新增 --title 覆盖参数，AI 助手可传入缩写后的标题
- SKILL.md 执行步骤重写：业务 JSON 优先判断 + 标题字数检查缩写流程
- SKILL.md / CLAUDE.md 全面同步：补 from_json.py、移除弃用的 foreground.png、修正字段路径
- 提交 assets/（字体 + 场景素材），打包交付业务方（含 .env）

**遇到的问题：**

- 下午茶场景 Gemini 生成菜品数量不稳定（2-6 个），根因是 EXTRACT_PROMPT 拆分复合菜品名 + 无数量约束
- 少量菜品时画面空旷，因为 placement 规则让菜品挤在右下角且禁止填满
- SKILL.md 执行步骤没有 from_json.py 入口，导致 OpenClaw 只改文字不换菜品
- style.json 的 max_chars_per_line / max_lines 从未被代码执行，标题字数无实际限制
- 代码截断标题会导致语言不通顺，改为警告 + AI 助手智能缩写方案

**明天要继续：**

- 验证业务方实际使用 OpenClaw + JSON 的完整流程（标题缩写、菜品替换、字数校验是否都生效）
- 观察 EXTRACT_PROMPT 软上限在更多 case 上的稳定性，必要时调整规则
- 考虑是否需要给 from_json.py 增加 --subtitle 覆盖参数（目前 afternoon 副标题是硬编码的）
