---
tags:
  - design-studio
  - 模块快照
  - 参考
date: 2026-04-16
---
## 首页模块表

| #   | 模块名（组件）                      | 界面中长什么样                                            | 源文件                                | 说明                                      |
| --- | ---------------------------- | -------------------------------------------------- | ---------------------------------- | --------------------------------------- |
| 1   | **TopBar**（顶部导航栏）            | 固定在页面最顶端，右上角头像 + "业务"文字                            | components/layout/top-bar.tsx      | 始终透明背景 + 深色文字，不随滚动变化；`fixed` 定位，高 60px  |
| 2   | **HeroHeader**（主标题区）         | "设计需求 快人一步" + "人人都是设计师"居中双行大标题                     | components/home/hero-header.tsx    | 彩虹渐变主标题，居中                              |
| 3   | **SceneTabBar**（场景 Tab 栏）    | 一排 Tab：自由模式 / 会场头图 / 会场组件 / 站内资源位 / 站外资源位 / C 端外素材 | components/home/scene-tab-bar.tsx  | 纯 Tab UI 组件                             |
| 3a  | **StickySceneTabBar**（吸顶外壳）  | 包住 Tab 栏的全宽吸顶条，下滑到顶后白底+淡灰分割线                       | components/home/home-shell.tsx:49  | SceneTabBar 的吸顶容器，负责 sticky 定位、白底淡入、分割线 |
| 4   | **CreationPanel**（创作面板）      | 白色卡片：左侧上传图片方块 + 右侧输入框 + 底部"自由模式/智能比例"按钮 + 右下圆形发送按钮 | components/home/creation-panel.tsx | 用户提需求的主入口                               |
| 5   | **FeatureCards**（AI 图像处理卡片组） | "AI图像处理"小标题下一排 5 个小卡片（AI延展 / AI抠图 / AI扩图 ...）      | components/home/feature-cards.tsx  | 响应式网格，1~5 列                             |
| 6   | **TemplateGrid**（模板瀑布流）      | "全部模板"小标题下的瀑布流卡片（`columns-N` 多列布局）                 | components/home/template-grid.tsx  | 外层容器，负责标题+多列布局                          |
| 6a  | **TemplateCard**（单张模板卡）      | 瀑布流里每张图，hover 时出现"在线编辑"橙色按钮                        | components/home/template-card.tsx  | TemplateGrid 的子项                        |

## 容器与上下文（不是视觉模块，但你可能会提到）

|名字|作用|源文件|
|---|---|---|
|**HomeShell**|整个首页的客户端壳子，管理场景切换状态（`activeScene`），组织 HeroHeader / StickySceneTabBar / HomeMain 三段|components/home/home-shell.tsx|
|**HomeMain**|HomeShell 里"主内容区"的子组织器，顺序渲染 CreationPanel → FeatureCards → TemplateGrid|components/home/home-main.tsx|
|**ScrollProvider**|全局滚动状态 Context（当前已经没人消费了，可考虑删）|components/home/scroll-context.tsx|
|**hero-section**（背景层）|页面最外层的渐变/视频背景，app/page.tsx 里|app/page.tsx|

## 视觉层次（从上到下）

```
┌─ TopBar（fixed，始终在最上）│├─ HeroHeader              ← "设计需求 快人一步"├─ [64px 呼吸空间]├─ StickySceneTabBar       ← 场景 Tab（会吸顶）│   └─ SceneTabBar├─ CreationPanel           ← 创作面板（白卡片）├─ FeatureCards            ← AI 图像处理└─ TemplateGrid            ← 全部模板（瀑布流）    └─ TemplateCard × N
```

我发现一个问题：现在往上滑，整个TopBar的那个栏没问题，但是往下滑，TopBar会顺着我下滑一会儿。