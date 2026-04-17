# 淘天AI设计师能力

时间：**短期每周度四，更新至稳定版本**。双11期间，投入使用。

**#01**

**能力计划**

\-业务覆盖能力

**运营能力**

\-

a/批量拓展**\*（下周一，9月29日）**

b/商品主图**\*（10月14日）**

c/战报图**\*（10月14日）**

d/资源位**\*（10月21日）**

e/动效能力**\*（10月21日）**

\-对话微调能力

**体验优化****\*（10月14日）**

\-

a/局部修改

b/尺寸拓展

c/高清生成

\-

AI循环对话时的准确性**（10月14日）**

**\-**

AI上传时的准确识别能力**（10月14日）**

\-速度&质量提升

**性能优化****\*（10月21日）**

\-

a/生图速度（目前60S，4张）

b/图片精准控制（logo+文案控制）**\*（10月14日）**

c/大模型升级（纯电设计模型）**\*（待定）**

:::
**运营能力-****业务覆盖能力**

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/J9LnW6j2BPr1rlvD/img/56c2701b-e539-4453-bfa8-7fe56ea83ed4.png)

**体验优化部分-****对话微调能力**

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/J9LnW6j2BPr1rlvD/img/e9017f6b-a6e1-4dba-9158-e5ac122b28b0.png)

**性能优化-****速度&质量提升**

·生图速度：60s--30s。

·控制精准版式位置。

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/J9LnW6j2BPr1rlvD/img/0b9e3d06-ca61-4230-bd1c-02bf1db824d9.png)
:::

**#02**

**升级内容**

After

**局部AI**

\-

体验侧：

**设计编辑器**为核心的能力。（主要动手）

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/J9LnW6j2BPr1rlvD/img/8fd27464-29b0-4169-bfb8-e16682f02caf.png?x-oss-process=image/crop,x_0,y_0,w_2294,h_1247/ignore-error,1)

**能力侧：简单的计件设计为主，批量拓展为主。**

覆盖率：AI覆盖率情况。

8月50%、7月49%、6月53%、5月53%...去年双11-18%。

1、静态拓展

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/J9LnW6j2BPr1rlvD/img/2ab317e0-2bdd-44f6-a068-226f217300a7.png)

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/J9LnW6j2BPr1rlvD/img/78110335-c26a-4813-a8c7-c1f6452c9ba9.png)

Before

**全AI**

\-

体验侧：

**对话控制**为核心的能力。（主要动嘴）

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/J9LnW6j2BPr1rlvD/img/3e6d48f7-84d5-4eda-a78b-2f0790c70518.png)

**能力侧：简单的计件设计&复杂的场景设计能力。**

覆盖率：AI覆盖率目标情况。

10月提升至75%。

1、复杂设计类--AI对话生成

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/J9LnW6j2BPr1rlvD/img/cb841fbc-6e22-44e6-8866-3b3664469c44.png)

2、动画拓展

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/J9LnW6j2BPr1rlvD/img/d92e9ce5-55d1-472f-a656-3b2635150518.png?x-oss-process=image/crop,x_0,y_0,w_2038,h_859/ignore-error,1)

**#03**

**成本问题**

\*基于内部测评与外部用户反馈，持续接入最优的图像模型。

:::
**a、人力成本。**

**4个正岗+3个外包（lora训练 & 业务应用引导 & 后端开发 ）+1位后端+1位前端。**

**b、模型成本。**

_**外部图像模型：**__**火山引擎-即梦，GPT-40**_**；**_**语义模型：Gemini，GPT**_

_**内部图像模型：**__**Qwen- image 为主。80%用量。**_

_**AI图像成本预估**_： **年度总金额测算：40w预估（40个并发）**。**人数：100人+在线使用情况。**

参考过往的使用预估：

**1、AI设计师：调用次数：7488480 。总金额：32.9万（宽泛预估）**

计件用量测算--（6月）2756 x 每个AI任务刷图数10次 X 4张图 x 12个月 = 调用AI次数1322880次/年   

运营&驻场用量测算--7月（驻场7045张+运营5800张）x 日常刷图量10次 X 4张图 x 12个月 =日常调用AI次数6165600次/年  

**2、AI会场：调用次数：25w 。保守估计：4.75w**。调用次数：124.5w。总金额：23.6w（并发待定）

_**AI图像显卡成本：**__AI会场 7张，AI设计师7张。爱橙科技公共算力。_
:::

**#04**

**AI技术框架**

**1、语言理解**

---

**基于中文的稳定理解选取语言模型“Gemini”**

**（运营简单输入）**

**图片大小：**1024×1024

**主标题：“超级新品，超级发布”**

**副标题：TMALL SUPER LAUCH**

**画面描述：**我需要一张人物走秀的大片海报。

**（AI理解扩写）**

**风格**：毛绒质感风格，打造柔软且具亲和力的视觉效果。

**元素**：88VIP主题标识，盒马IP形象元素（毛绒质感的玩具或手办感细节作为视觉重点 **布局**：中间聚焦盒马IP元素，突出88VIP标识，整体采用垂直3:4比例布局，视觉中心明确且层次分明 **配色**：主色调温暖柔和，结合品牌色

**文字**：“超级新品，超级发布”

**图像生成提示**：

**图片大小**：1024×1024

**2、图像生成**

---

**基于需求特点配置3套模型**

![天猫双11联合LOGO-手淘闪屏效果图1.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/J9LnW6j2BPr1rlvD/img/0363ef30-4bf2-4b14-bb51-5f67493486cd.png)

**（侧重图像生成需求）**

1、火山引擎（即梦）

2、Open AI GPT

3、qwen image

**（侧重文案排版需求）**

1、qwen & lora

2、火山引擎（即梦4.0）

**9大需求类型**

**运用1：图像生成**

a、开屏

b、商品海报

c、频道版头

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

![天猫双11联合LOGO-手淘闪屏效果图3.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/J9LnW6j2BPr1rlvD/img/b9dd2973-29da-4a94-97d3-302dd8e2a53c.png)

**（画面调整能力）**

1、局部重绘（千牛）

2、高清修复（千牛）

3、扩图（千牛）

4、智能参考图 (即梦自带)

5、抠图功能（千牛）

6、模特图替换（千牛-服饰行业）

**（文字调整能力）**

1、智能文字编辑器（待定）

2、文字AI调整模型（待定）

3、SeedEdit替换（自研部署）

**（排版调整能力）**

1、智能文字编辑器

2、LORA（前置模型要求 flux）

**\*融合为一套编辑器能力。**

**4、完稿延展**

---

**基于批量形设计需求定制**

![天猫双11联合LOGO-手淘闪屏效果图3.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/J9LnW6j2BPr1rlvD/img/e3e44065-8522-4b1a-93a6-d0fbb52b469e.png)

**（单图下载）**

jpg格式

**（多图下载）**

1、静态图片延展

2、视频动画延展

:::
![MacBook Pro 14_ - 4@1x.jpeg](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/J9LnW6j2BPr1rlvD/img/47fcd7ee-bf85-40de-b84b-f406a0be0c8c.jpg)
:::

**#05**

**推广计划**

**对话，我找不到设计师啦**

**01、趣味一点的方案。**

:::
已和oc团队沟通。确认内部可用资源，在投前一周准备好推广物料即可。

a、厕所广告。

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/J9LnW6j2BPr1rlvD/img/41d2fe9f-7f17-49f6-a46f-5a5029ea4bf6.png)

b、会议室投屏

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/J9LnW6j2BPr1rlvD/img/e121670d-c998-4072-8da7-e0d2c9496338.png)

c、电梯间海报机

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/J9LnW6j2BPr1rlvD/img/e55c1ac4-1baf-42ca-800a-b7b9f9923239.png)
:::