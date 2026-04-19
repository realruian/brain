## 项目目标

为外卖运营提供标准化的营销资源位图片生成工具。运营提供文案和主题，工具自动输出符合设计规范的 PNG 图片，替代手动设计流程。

支持四种资源位：
- **运营卡片**（702×150px）— 首页入口位
- **固定位 Banner**（702×110px）— 双行标题 + 按钮
- **会场头图**（750×810px）— 落地页顶部，按品类自动选背景
- **洛阳牡丹头图**（750×810px）— 特定活动专属模板，支持 1-3 张商品图

## 技术栈

| 层    | 技术                                     |
| ---- | -------------------------------------- |
| 模板   | HTML/CSS，通过 URL query params 参数化       |
| 截图   | Playwright (Chromium headless)         |
| 后处理  | Pillow — Display P3 → sRGB 色彩修正、PNG 压缩 |
| 字体   | 美团体（标题）、方正兰亭黑（正文）、方正盛世开山体（洛阳专用）        |
| 运行环境 | Python 3，依赖 `playwright` + `Pillow`    |

## 核心架构

```
用户文案 + 参数
    ↓
generate.py（参数解析 → 主题/品类映射 → product↔category 自动联动）
    ↓
拼接 URL query params → file:// 打开 HTML 模板
    ↓
Playwright Chromium 截图 (#banner 元素)
    ↓
Pillow 色彩修正（macOS P3→sRGB）+ PNG 压缩（≤150KB）
    ↓
输出到 ~/Desktop/AI自动化设计素材/，文件名带时间戳
```

关键设计决策：
- **模板即视图**：所有布局、字体、配色由 HTML/CSS 固定，Python 只负责传参和截图，不做渲染逻辑
- **品类↔商品联动**：同时出 card/banner + header 时，product 和 category 会自动双向匹配（如 lobster↔lobster、chinese↔dumpling），减少运营传参负担
- **色彩修正**：macOS 广色域显示器下 Chromium 用 Display P3 渲染但 PNG 不嵌 ICC profile，脚本截图后强制转 sRGB 保证颜色一致性

## 已知限制

- **不支持自定义布局**：所有资源位的尺寸、字体大小、元素位置由模板硬编码，无法通过参数调整
- **文案字数有硬限制**：卡片主标题 6-10 字、头图副标题严格 8-9 字，超出需人工或 AI 裁剪
- **品类背景有限**：头图只有 8 张背景图，不完全覆盖所有餐饮品类（如甜品、茶饮无专属背景）
- **商品素材图有限**：内置仅 burger/lobster/milktea/chinese/vegetable 五种，其他需用户自行提供 --bg-image
- **PNG 压缩有上限**：量化到 256 色后仍超 150KB 时只打印警告，不做进一步处理
- **Chromium 依赖**：首次使用需下载 Chromium（~200MB），离线环境不可用
- **色彩修正依赖系统 ICC**：macOS 的 P3→sRGB 转换依赖 `/System/Library/ColorSync/Profiles/Display P3.icc`，该文件缺失时静默跳过
