# 图像编辑器PRD

# AI 设计编辑器 PRD（评审 & 技术开发版）

**文档版本**：v1.0

排期表

---

## 1. 产品概述（Overview）

AI 设计编辑器是一款面向设计师与运营人员的在线设计工具，支持 PSD 文件解析、基础图层编辑、AI 图层处理、设计自动化与批量生产。

产品核心目标是在不依赖本地专业设计软件（如 Photoshop）的前提下，让用户在线完成高频设计修改、AI 辅助编辑以及规模化图片生产，从而显著提升设计与运营效率。

本产品不是传统修图工具，而是以 **“设计生产效率”** 为核心导向的 AI 设计师的编辑平台。

---

## 2. 目标&用户（Goals）

### 2.1 核心目标

*   支持 PSD 文件的在线解析与编辑
    
*   提供覆盖高频设计场景的基础编辑能力
    
*   通过 AI 能力降低专业设计操作门槛
    
*   支持批量化、自动化设计生产
    

### 2.2 长期目标

*   构建可扩展的 AI 能力调度体系
    
*   支持多模型、多 API 的能力组合与路由
    
*   沉淀设计自动化工作流能力
    

### 2.3 核心用户

*   设计师群体
    
*   市场运营小二
    

### 2.4 用户特征

*   高频处理 PSD 或图片素材
    
*   经常需要改文案、换图、改尺寸、改图片局部内容。
    
*   不一定精通专业设计软件，但对结果质量有要求
    

---

## 3. 核心功能需求（Functional Requirements）

| 链路概览 |
| --- |
| ![切图 2.jpeg](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1X3lE5jj37bJBlJb/img/54132fc5-9235-48e3-9a0c-2ce93a7457a1.jpg)<br>#### 用户流程：<br>1.  用户上传 PSD 或图片文件<br>    <br>2.  系统解析文件结构<br>    <br>3.  用户进行基础编辑或 AI 分图层<br>    <br>4.  用户通过对话方式对单个图层进行 AI 修改<br>    <br>5.  选择目标尺寸进行自适应扩展<br>    <br>6.  用户导出最终文件<br>    <br>7.  （可选）批量套版：导入表格进行批量替换 |
| #### 文件类型：<br>*   PSD 文件<br>    <br>*   单张图片文件（PNG / JPG）<br>    <br>*   Json文件 |

### 3.1 PSD 文件延展尺寸

#### 功能描述

用户上传 PSD 文件，系统需对 PSD 进行完整解析，并在编辑器中还原其图层结构，支持编辑、下载、保存。

#### 需求说明

| 功能 | 页面Demo | 规则 |
| --- | --- | --- |
| **上传文件**<br>**（支持拖动、点击上传）** | ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1X3lE5jj37bJBlJb/img/08d1c018-b598-44b5-8e5b-ae98ff059038.png) | *   选择图片尺寸延展<br>    <br>    *   支持上传PSD<br>        <br>    *   单张图片文件（PNG / JPG）<br>        <br>*   选择动态尺寸延展<br>    <br>    *   支持json格式动画文件<br>        <br> $\color{#0089FF}{@陆明杰}$ （灰色部分已完成） |
| **解析文件** | ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1X3lE5jj37bJBlJb/img/b0d7ecca-a217-46da-aa36-733e89fe2653.png) | *   解析 PSD文件内的：图层、分组、文字层、图片层<br>    <br>*   保留原始图层层级关系<br>    <br>*   点击取消可终止解析<br>    <br> $\color{#0089FF}{@陆明杰}$ |
| **基础图像编辑能力** | ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1X3lE5jj37bJBlJb/img/559befdf-44ef-46a6-b331-48bfe34bd025.png) | $\color{#0089FF}{@范志成(赤芍)}$ <br>*   图片编辑&通用功能<br>    <br>    *   图层选中、移动、旋转、裁切<br>        <br>    *   图片缩放（等比 / 非等比）<br>        <br>    *   图层锁定<br>        <br>*   文字编辑：<br>    <br>    *   新增、修改文字图层<br>        <br>    *   修改文字颜色、字号、字体、字重、对齐<br>        <br>*   图层编辑<br>    <br>    *   图层显示 / 隐藏<br>        <br>    *   图层删除<br>        <br>*   基础功能<br>    <br>    *   撤销 / 重做<br>        <br>    *   线上预览<br>        <br>    *   安全区，展示错位（已修）<br>        <br>    *   画布缩放<br>        <br>原则：不追求完整 PS 功能，仅覆盖高频、刚需、可自动化操作 |
| **\*初始psd模版调整** | ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1X3lE5jj37bJBlJb/img/cec9fc75-3520-4e08-9b1c-31444c8cf32f.png) | *   对初始模版进行编辑后，新选择的尺寸将会自动应用，其余原有尺寸已编辑内容不变。<br>    <br>*   若要全局应用，需点击“刷新”<br>    <br> $\color{#0089FF}{@陆明杰}$ |
| **保存修改** | ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1X3lE5jj37bJBlJb/img/fc87afca-2319-49e6-86df-547ee59a444d.png)![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1X3lE5jj37bJBlJb/img/03200a02-4992-4737-ba65-6b9f565266ba.png) | *   点击保存修改，快捷键cmd+s。同文件多次保存，覆盖上一次保存。<br>    <br>*   可在个人中心可查看历史保存文件。<br>    <br>*   未保存时，退出挽回。<br>    <br> $\color{#0089FF}{@陆明杰}$ |
| **延展尺寸** | ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1X3lE5jj37bJBlJb/img/532f9a1f-57d3-49ec-8c07-b4ed7f4b3132.png)<br>---<br>![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1X3lE5jj37bJBlJb/img/85b1c414-18f0-495e-affe-5034414844e0.png)<br>---<br>![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1X3lE5jj37bJBlJb/img/3916a681-7ca8-4767-aa53-63e3654bcba4.png) | 用户可快速选择目标输出尺寸，系统自动进行画布扩展与内容自适应：<br>*   主体内容保持比例<br>    <br>*   背景区域智能延展<br>    <br>*   保证整体视觉完整性<br>    <br>---<br>支持自定义尺寸，输入后保存至我的尺寸内，支持删除尺寸（悬浮出现“X”，点击删除） $\color{#0089FF}{@李梦然}$ <br>---<br>⚠️尺寸根据psd源文件比例判断，可切换横竖版 $\color{#0089FF}{@陆明杰}$ <br>*   填写比例超出时报错<br>    <br>    *   横版文案“\*PSD为横版需保持宽 > 高，请调整尺寸。”<br>        <br>    *   横版文案“\*PSD为竖版版需保持宽 < 高，请调整尺寸。”<br>        <br>*   比例不支持时置灰，悬浮出气泡说明“当前文件不支持该比例” |
| **延展完毕** | ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1X3lE5jj37bJBlJb/img/6eb204fd-abf1-4c67-a7bf-0f55b465a066.png)<br>![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1X3lE5jj37bJBlJb/img/8e1fd172-56c7-491c-9549-ff1ab801a334.png) | *   右侧已延展尺寸支持单图下载、删除<br>    <br>*   兜底态 |
| **下载文件** | ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1X3lE5jj37bJBlJb/img/d58e9ae7-30db-47ce-8ceb-89c34b9928a2.png)<br>![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1X3lE5jj37bJBlJb/img/d3f5ea0c-6458-4465-8959-353028c52f69.png) | 支持格式<br>*   PSD（保留图层结构）<br>    <br>*   PNG / JPG<br>    <br>*   Json<br>    <br>导出方式<br>*   单张导出<br>    <br>*   批量导出<br>    <br>    兜底<br>    <br>*   展示导出进度，支持中断导出<br>    <br> $\color{#0089FF}{@陆明杰}$ |
| **发布模版** | ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1X3lE5jj37bJBlJb/img/582e39bb-9210-4920-a7ac-9062c46d89ac.png)<br>![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1X3lE5jj37bJBlJb/img/5d3fbe42-0517-450f-9a05-e354d63c32cc.png) | *   点击发布模版，弹窗填写标题，一键发布，支持psd与图片格式。<br>    <br>*   个人中心查看模版发布进度。<br>    <br> $\color{#0089FF}{@陆明杰}$ |

---

### 3.2 图片文件-AI分图层功能（图片 → 可编辑结构）

#### 功能描述

用户可对一张图片使用 AI 分图层能力，系统通过 AI 自动识别并拆分图片中的不同视觉元素，生成可编辑图层。

AI 分图层的目标是让图片重新具备可编辑性，而不是完美还原原始 PSD，满足基础功能即可。

#### 需求说明

| **图片-AI拆分图层** | ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1X3lE5jj37bJBlJb/img/7c23f0c9-4bb4-4d29-8cb4-7915c715aa6d.png) | 点击拆分图层，将图片变为可编辑结构，**需拆分出：**<br>*   主体层（商品 / 人物 / 核心元素）透明底<br>    <br>*   背景层<br>    <br>*   文字层（OCR 后生成可编辑文字）<br>    <br>*   装饰性元素层 |
| --- | --- | --- |
| **AI 编辑图层**<br>**对话式** | ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1X3lE5jj37bJBlJb/img/0c0bf7d4-afd6-4667-849e-0d4e1188af1e.png)<br>![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1X3lE5jj37bJBlJb/img/427cb27a-d27f-48bc-a130-e300c0c27a7c.png) | **描述**<br>用户选中任意单个图层，点击底部对话修改按钮或tab键，展开对话框，通过自然语言对话方式，对该图层进行 AI 修改。<br>（该能力为满足当下业务定制需求为主。）<br>**功能要求**<br>*   AI 修改仅作用于当前选中图层<br>    <br>*   系统需根据用户意图自动选择合适的 AI 能力或第三方 API<br>    <br>*   支持撤销 AI 操作 |
| **拓展** | 同上，上传、下载同上。 |  |
| **外部 AI 能力与模型调用** | ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1X3lE5jj37bJBlJb/img/b4ec73a3-0a24-4276-90c5-af4d999f62f5.png) | 注意⚠️，该能力需要可切换模型api<br>**功能定位**<br>编辑器本身不绑定单一 AI 模型，而是作为 AI 能力调度平台。<br>**需求说明**<br>*   支持接入多个第三方图像 AI API<br>    <br>*   AI 能力需模块化、可替换、可扩展<br>    <br>*   通过“用户意图 → 能力识别 → 模型路由”方式调用 |

---

### 3.3 批量替换-上传表格，批量套板（待排期）

#### 功能描述

用户可导入表格文件（CSV / Excel），通过字段与图层的绑定，实现批量生成设计结果。

#### 支持能力

*   批量替换文字图层内容
    
*   批量替换图片图层素材
    
*   一份设计生成多张结果图
    

---

## 4. 非功能性需求（Non-functional Requirements）

*   性能：中等复杂度 PSD 在可接受时间内解析
    
*   稳定性：AI 调用失败需支持回退
    
*   扩展性：AI 能力支持插件化接入
    
*   安全性：用户文件私有隔离处理
    

---

## 5. 前端排期

| **功能** | **排期** | **负责人** |
| --- | --- | --- |
| #### MVP版<br>*   PSD 上传与解析✅<br>    <br>*   延展功能：<br>    <br>    *   横/竖版尺寸切换<br>        <br>    *   自定义尺寸<br>        <br>    *   兜底状态<br>        <br>*   PSD 导出 | 已上线 | $\color{#0089FF}{@陆明杰}$  $\color{#0089FF}{@李梦然}$ |
| **底层能力**<br>*   图层编辑能力（sdk支持）<br>    <br>    *   文字编辑<br>        <br>    *   图片拖动<br>        <br>*   导出：预览图（整张图）<br>    <br>*   下载：批量图和单张图， josn格式 | 已上线 | $\color{#0089FF}{@范志成(赤芍)}$ |
| **PNG图片尺寸延展**<br>*   AI 拆分能力<br>    <br>*   AI 图层导入 | 待排期 | $\color{#0089FF}{@文禹翰(屿文)}$  $\color{#0089FF}{@陆明杰}$ |
| #### 二期迭代<br>*   表格批量替换 | \- | \- |

## 6.已上线待修复问题+新增功能

 $\color{#0089FF}{@李梦然}$ 补充

| **待修bug** | **截图** | **排期** | **负责人** |
| --- | --- | --- | --- |
| 导出尺寸不支持单数，例投放尺寸是1125，平台只能是1126 |  |  | $\color{#0089FF}{@范志成(赤芍)}$ |
| 图片拖动过大/过小时会失控 | ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1X3lE5jj37bJBlJb/img/f6137f6a-f44b-43d3-8e6b-cf9db9d12ba8.png) |  |
| 导出动画截图被裁切（左侧为原图，右侧为导出图） | ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1X3lE5jj37bJBlJb/img/8adeaa21-e871-426d-b5fb-2958d212e00c.png) |  |
| **新增功能** |  |  |  |
| 加图层锁定功能，图层在上方很难选中底下的。图层穿透（补充功能） | ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1X3lE5jj37bJBlJb/img/26a83898-e924-477b-b436-7e1aa8b1abed.png) |  | $\color{#0089FF}{@范志成(赤芍)}$ |
| 出血区功能的拓展+线上预览图（新增字段ruleImage：string形式） | ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1X3lE5jj37bJBlJb/img/8a7e8004-f5ee-45cd-93f5-da1929c0843b.png) |  |
| 裁剪删除复制更多里面的功能（对图层操作）并且支持撤销和恢复功能 | ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1X3lE5jj37bJBlJb/img/086faccb-1e71-41b2-9613-e64b562511ac.png) |  |

---

## 7. 产品边界说明

本产品不试图替代完整 Photoshop 功能，其核心价值在于：

**降低设计修改成本，提高设计批量生产效率，并通过 AI 实现自动化。**

**其他补充：**

支持模板组，通过上传多个PSD，在1个页面里面编辑多个画板，批量导出画板素材![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1X3lE5jj37bJBlJb/img/0842fcad-58f2-43da-818a-a3f42df5622f.png)

支持识别PSD的文字透视变形，并可编辑

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1X3lE5jj37bJBlJb/img/f5cb8820-e751-4655-b2c0-490a01c9a8c4.png)

支持简单的透视渐变

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1X3lE5jj37bJBlJb/img/d8bd83a0-9c8a-4f97-927d-faf21f27f425.png)

支持接入内部的AI工具（自由生图、lora生图等）

**温柔：2026年2月4日基于预发编辑器补充诉求**

**点击图片，可接入AI生图**

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1X3lE5jj37bJBlJb/img/d551024a-81e8-4858-87d9-f8e0b11bfcb1.png)

**支持模板组，通过上传多个PSD，在1个页面里面编辑多个画板，批量导出画板素材**![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1X3lE5jj37bJBlJb/img/375de0d0-9aea-4c13-a05e-65080621a4a8.png)

**支持识别PSD的文字透视变形，并可编辑**

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1X3lE5jj37bJBlJb/img/c71dd1f2-8b8f-4552-9068-080a31e39745.png)

**支持简单的透视渐变**

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1X3lE5jj37bJBlJb/img/46aadd92-252f-4af2-b8c4-b1d5cb39a011.png)

**能支持正常的PSD解析并还原好，目前很多字体不能正常解析、位置会发生偏移**

**以下为PSD、淘天AI、阿里妈妈编辑器的效果**

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1X3lE5jj37bJBlJb/img/4f3bdb57-3405-4038-837f-2b53d9f5c412.png)

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1X3lE5jj37bJBlJb/img/2e8e8b33-1634-451a-8624-d2c6791c05ec.png)

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1X3lE5jj37bJBlJb/img/ff031773-6aae-48b3-adf4-857d7994439f.png)

**隐藏的内容不要展示出来，默认隐藏（优先级较低）**

**？这个功能要考虑一下**

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1X3lE5jj37bJBlJb/img/c3dd9dde-72d8-42a4-9f88-df5a55e548dc.png)

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1X3lE5jj37bJBlJb/img/083d7811-1dc3-4f84-a978-c241bc3a9150.png)