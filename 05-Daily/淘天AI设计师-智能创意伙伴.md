# 淘天AI设计师-智能创意伙伴

**先回答一个问题：**

\-淘天设计的AI是怎么考虑的？

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/755c08c1-7dc2-429b-a32a-c79eb0a3fa8d.png)

01·设计困境

*   **听到的：**大家在拼杀底层图像模型的效果与质量，持续有生成效果的能力提升。（如：即梦、谷歌、OpenAI等等）
    
*   **实际的：**AI直出设计较少，辅助设计为主。（最后需要有想象力的人来描述画面，当前还是设计师居多来使用。）
    
*   **思路：****站在应用层，最小成本的构建一款淘天设计可用的工具。**
    

02·三个场景问题

*   01.设计师的下游
    
    *   **场景：1、运营需求---2、设计师需求---3、🌟计件需求**（01-设计源文件----02-设计延展----🌟03-设计外包&AI工具。）
        
    *   **1期能力：**解决设计基础问题，不借助外部设计师，提效设计成本。
        

![组 1@0.5x (1).png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/a32c29d4-24a4-467d-b0e3-199b061c1e50.png)

静态尺寸拓展：[https://ai-designer.alibaba-inc.com/#/ai-tabs?type=batch-extension&from=home](https://ai-designer.alibaba-inc.com/#/ai-tabs?type=batch-extension&from=home)

| **原始模板**<br>**1080 x 1920** | **知乎**<br>**1440 x 3120** | **快手**<br>**720 x 1440** | **哔哩哔哩**<br>**1080 x 1920** | **有道词典**<br>**1080 x 1780** | **墨迹天气**<br>**640 x 960** |
| --- | --- | --- | --- | --- | --- |
| ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/60e7a4b2-878f-40e2-8558-b43eeebba373.png) | ![FALL618 (最新) (1)_1440×3120.gif](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/01fb710f-5d48-4810-97a3-68d580e518ef.gif) | ![FALL618 (最新) (2)_720×1440.gif](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/44f1ad8d-f1e2-4fd6-89eb-81e11b63d6b9.gif) | ![FALL618 (最新) (3)_1080×1920.gif](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/c9efa62c-7982-491f-93bf-2e7999eb759b.gif) | ![FALL618 (最新) (4)_1080×1780.gif](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/f7745f70-55d9-406b-b061-34b44898b41f.gif) | ![FALL618 (最新) (5)_640×960.gif](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/faa6c086-e297-4848-9536-fbed1a16cabe.gif) |
| ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/b3fbcfa3-c31b-4590-8dbf-f89e5956cfc3.png) | ![闪购 (最新) (1)_1440×3120.gif](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/787e5359-0345-46a5-a592-f2657c371a0a.gif) | ![闪购 (最新) (2)_720×1440.gif](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/d216fdd0-2906-4b73-834f-34e0dac9eeda.gif) | ![闪购 (最新) (3)_1080×1920.gif](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/f8ccbf48-01ac-4a1f-a2ca-dd4656425a87.gif) | ![闪购 (最新) (4)_1080×1780.gif](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/a8a9b39a-3f35-4cb2-9221-3c365f6517f1.gif) | ![闪购 (最新) (5)_640×960.gif](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/62f8bf80-fde6-4dde-bf15-fd55225af2ca.gif) |
| ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/6a9a33e7-6081-493e-9c27-df7fbfc5bbe4.png) | ![618金刚券开屏-（最新） (1)_1440×3120.gif](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/60586834-75e2-4197-9d2b-378ec5302b6e.gif) | ![618金刚券开屏-（最新） (2)_720×1440.gif](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/be428cd5-c74a-408b-94cd-2960989ab755.gif) | ![618金刚券开屏-（最新） (3)_1080×1920.gif](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/2fcaba79-5c9a-4dcd-8afe-4b9ca9a3d5c1.gif) | ![618金刚券开屏-（最新） (4)_1080×1780.gif](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/09f4ee9a-9a69-414f-9ee3-b523e96579b5.gif) | ![618金刚券开屏-（最新） (5)_640×960.gif](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/9bf7290a-49e2-4813-8aef-c80359f5c6b7.gif) |
| ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/c179e960-36c2-4321-adf4-4e59dcaf5a48.png) | ![大字报 (最新) (1)_1440×3120.gif](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/2005e8bf-f826-4de9-bc2a-a0c0cf390c94.gif) | ![大字报 (最新) (2)_720×1440.gif](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/cabef919-d268-4683-8e69-f1d635cf5eaa.gif) | ![大字报 (最新) (3)_1080×1920.gif](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/4e23915f-ee09-4dc3-9b83-0009dbedb6d2.gif) | ![大字报 (最新) (4)_1080×1780.gif](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/4219b500-7e49-4209-b178-6dffb4408410.gif) | ![大字报 (最新) (5)_640×960.gif](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/06f9a950-ad54-4607-9eaf-409967addfff.gif) |

动态尺寸拓展：[https://ai-designer.alibaba-inc.com/#/ai-tabs?type=animation-screen&from=home](https://ai-designer.alibaba-inc.com/#/ai-tabs?type=animation-screen&from=home)

*   **1、解析能力：psd格式导入解析，通过psd的延展图片。**
    
*   **2、批量能力：自定义各种尺寸，涵盖线下尺寸。静态&动态尺寸一键拓展。**
    
*   02、设计师的需求
    
    *   **场景：1、运营需求---2、🌟设计师需求**\---3、计件需求（01-设计源文件----02-设计延展----🌟03-设计外包&AI工具。）
        
    *   **2期能力：**9个常用板块能力，贴合设计需求。
        
    *   能力情况
        

| 会场版头 | ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/1816846d-8274-4f1b-a46b-21f8c1a399c0.png?x-oss-process=image/crop,x_0,y_0,w_1125,h_2005/ignore-error,1) | ![image@1.5x.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/5315493a-259d-4a35-84e6-c78b63b3c6f2.png) | ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/ef4dddeb-0dbe-4cd2-ba91-60b06d813db5.png?x-oss-process=image/crop,x_0,y_0,w_1500,h_2612/ignore-error,1) | ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/e07deec6-6c32-4b82-8aac-b013eecd10ae.png) |
| --- | --- | --- | --- | --- |
| 开屏图 | ![image_1.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/b5cf5e8a-fb09-4e05-b263-73ec7eae50ae.png) | ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/b0bbde2c-c37d-4f10-b481-09d769da9d7a.png) | ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/a22f1086-7ba6-405b-8144-86eb5c15a77d.png) | ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/1e9b888a-2dd0-46d0-82b3-76ec69f64eee.png) |
| 外投海报 | ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/9f1ecfb7-6ac5-4867-a00b-87a3eb01dd11.png) | ![image-2.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/a8e4f733-e228-4bb9-bed1-cf67b724788a.png) | ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/91c2f671-73d9-44ed-a131-632825915d94.png) | ![image@1.5x.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/5995e71d-e063-4057-b11d-f78954e5f7da.png) |
| 商品主图 | ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/7ff06448-477c-413b-b3d0-c86d26b0c124.png) | ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/a2c7c8ff-c93f-4878-9dab-f04f416f7beb.png) | ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/68b925d8-98a7-41f6-9809-97fa0df0edbb.png) | ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/93f72714-2f44-4bcf-b773-3e470fc8cbdf.png) |
| IP公仔 | ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/84764608-44ba-4eba-9d8a-585ca25b1b92.png) | ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/62c0ee65-ab90-45d5-804e-a536d7f891a7.png) | ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/7130c862-61f4-40a0-86c1-70264cff4b86.png) | ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/f4b51fc9-7ba4-4f69-9063-bda3a5495c37.png) |
| 业务定制 | ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/039d4181-3a73-4459-9909-5e60f2d86b2b.png) | ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/630d8a9d-4cb6-4a42-8add-3bb0d7461331.png) | ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/39126fc7-cd9e-4792-b711-b6bf6c30ed19.png) | ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/71e59cbf-eaa1-4412-9826-1e1133660af6.png) |

*   03、设计师的上游需求。
    
    *   **场景：1、运营需求---**2、设计师需求---3、计件需求（01-设计源文件----02-设计延展----🌟03-设计外包&AI工具。）
        
    *   **3期能力：**从创意生图走向规模化交付能力，运营视角的解决方案。
        
    *   A、百亿补贴后台  
        ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/3e89dedb-afd0-4128-9a93-bd8b86ec7ee8.png)  
        
    *   B、巨浪后台。  
        ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/a79538cd-57b0-4b70-9729-ae50360efaa4.png)  
        
    *   C、方舟后台 
        
    *   ![切图 1 (5).png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/5c8d0792-17d4-486d-978e-1843df6084bc.png)  
        ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/2a3e5364-5c95-404c-9103-e4f97366dc4d.png)
        

运营的需求能力：生长在运营工作后台产品，可自动化出图。特点：AI能力定制，可数据接入自动化运行。

*   04、其他人群。
    
    *   自由需求，自由模式～  
        基于智能对话的操作流程，优化使用人的体验。给予不确定性需求的人使用。  
        **挑战：对于指令的理解程度与指令的扩展性。agent的幻觉与架构如何调整。**  
        ![AI生成-扩写21.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/4e99a5ac-17a8-41f8-8061-0b8b9c30006c.png)  
        

03·AI构建思路：

*   以实际可用为判断点。基于业务指标来构建产品功能。
    
    *   **A、不做**：**AI底层大模型的研发，谁的好用接谁的。（主流的生图模型都在）**
        
    *   **B、做：应用层的功能设计，如何垂直化匹配设计需求，选用合适模型，自研空缺能力，最大效率的融合到商业场景。**
        
    *   \*通过测评判定各类AI工具的特性接入。
        
*   **b、设计师常用场景定制：**
    

**1、语言理解**

---

**基于中文理解调用Qwen 3**

**运营输入**

图片大小：1024×1024

主标题：“超级新品，超级发布”

副标题：TMALL SUPER LAUCH

画面描述：我需要一张人物走秀的大片海报。

**AI理解扩写（调整）**

**风格**：毛绒质感风格，打造柔软且具亲和力的视觉效果。

**元素**：88VIP主题标识，盒马IP形象元素（毛绒质感的玩具或手办感细节作为视觉重点 **布局**：中间聚焦盒马IP元素，突出88VIP标识，整体采用垂直3:4比例布局，视觉中心明确且层次分明 **配色**：主色调温暖柔和，结合品牌色

**文字**：“超级新品，超级发布”

**图像生成提示**：

**图片大小**：1024×1024

**2、图像生成**

---

**基于需求特点接入多套模型**

![天猫双11联合LOGO-手淘闪屏效果图1.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/1647d76d-a909-49c3-bd17-d3041cefb0e3.png)

**（侧重图像生成需求）**

1、火山引擎（即梦）

2、Open AI GPT

3、qwen image

**（侧重文案排版需求）**

1、Qwen & lora

2、稿定AI

**9大需求类型**

**运用1：图像生成**

a、开屏

b、商品海报

c、频道&会场版头

d、手淘资源位

e、图像处理

**运用2：文案排版**

f、商品主图

g、大促战报

i、商品包装

h、动画视频

**3、图像调整**

---

**基于AI图像的精准控制调整**

![天猫双11联合LOGO-手淘闪屏效果图3.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/4b1944ab-fafd-4bd8-8f06-23d98c672c74.png)

**（画面调整能力）**

1、局部重绘（千牛）

2、高清修复（千牛）

3、扩图（百炼）

4、智能参考图 (自研)

5、抠图功能（千牛）

6、模特图替换（自研）

**（文字调整能力）**

1、智能文字编辑器（自研）

2、文字AI调整模型（自研）

3、SeedEdit替换（自研）

**（排版调整能力）**

1、智能文字编辑器（自研）

2、LORA（前置模型要求 flux）

**4、图片拓展**

---

**基于批量类设计需求定制**

![天猫双11联合LOGO-手淘闪屏效果图3.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/1f5a6e10-8292-4ab8-ad96-c60a8246de81.png)

**（单图下载）**

jpg格式

**（多图下载）**

1、静态图片延展

2、视频动画延展

（自研）

*   **组装类：采买最优的大算力AI模型，进行出图控制，组合出贴切的AI设计产品。自研类：**精准控制画面的能力-当前AI工具缺失的部分。
    
    *   关键环节：各个AI模块底层都已具备（理解意图--设计图片--纠正设计--完成终稿）
        

**组装（调试设计参数）**

**自研**

语言理解

**·**

**qwen 3**

**qwen vl**

图片生成

**·**

**Qwen image**

**谷歌 nanobanana**

**字节 即梦**

**ChatGPT**

图片调整

**·**

**图片风格-控制**

**图片构图-控制**

**图像文字-控制**

图片拓展

**·**

**一键多静态图**

**一键多动态图**

*   **c、其他人群AI功能：**
    

*   **方向：**从**基础图像能力（计件类设计）到全类型图像能力（全类型设计）**。
    

![1-3@1xnew.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/Mp7ld7bapdYG8OBQ/img/c30c1083-719a-4b5f-8638-cb373a9a064f.png)

非确定性需求的理解能力。