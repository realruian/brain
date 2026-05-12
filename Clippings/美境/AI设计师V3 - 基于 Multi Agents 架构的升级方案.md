### 1、背景及目标

AI设计师从7月底正式上线以来，已经稳定运行4个多月。期间AI设计师跟随Seedream3.0、Nana Banana系列模型以及自研海报等各类模型能力迭代而迭代，同时也在交互上丰富了画布编辑器、用户卡片交互等。目前单周用户产生会话数4000左右，生图数量7000张，支持了下沉市场Agent、大象助理Agent、LongCat App生图等不同场景的智能创作。不过目前Agent也存在以下一些缺陷及不足：

- **Agent速度慢**：包含意图识别、plan、stepcheck、summary等流程性开销，加上Tools执行本身，单次会话完整执行时间平均110s。
    
- **交互困难**：追问是用check的方式发起，触发频率低，调整困难，难以完成需要用户交互的任务。
    
- **多轮上下文感知不准**：上下文不完整（leader agent和执行agent分开管理）。
    
- **可扩展性弱**：（1）不同设计场景之间互相影响（2）能力拓展时整体改动较大。
    
- **线上观测、评测体系不完善**，导致Agent运维及线上数据回流迭代不及时，无法建设高效的“线上数据回流-数据分析-Agent优化”的闭环
    

随着大模型能力的有效提升以及Agent框架的发展，结合AI设计师V2版本的技术方案，需要迭代AI设计师V3版本，该版本重点解决问题包括：

- **精简架构**：增加Triage Agent，简单任务使 Handoff + ReAct架构，执行流程由LLM自行输出状态位Status='Completed，省略Stepcheck + Summary等流程性操作，LLM调用次数减少50%以上；复杂任务还是执行当前类OpenManus/Magentic-One架构，Plan后固定Workflow，由多Agent协助完成。
    
- **执行流程灵活化**：改造之前Flowteam的Plan + Execution设定导致执行流程固定，无法随时插入用户交互，目前可以随时发起用户交互，实现Human in the Loop，后续可支持用户随时打断
    
- **精简上下文**：不再使用OpenManus的模板INPUT，不仅能大量减少上下文长度，而且用户关键信息不易湮没在模板中，有助于意图理解和多轮对话，单次执行流程Context 从10k缩减到5k
    
- **Agent按场景划分**：之前Multi-Agent中的每一个Agent只负责执行步骤中的一步，任何任务都需要多个Agent协作，复杂度高。目前将Agent按照场景专家划分，有利于解耦扩展新场景，对于复杂场景也可以通过handoff的方式来接棒执行
    

除已有架构升级功能外，该版本需要额外解决的问题包括：

- 自动化/常态化线上评测任务执行、查看及打分
    
- Agent线上观测/监控
    
- Tools下沉至美境工作流，进行统一限流、打点、业务隔离等
    
- Agent记忆系统加强，用户画像及Memory存储
    
- 建立用户数据回流及分析机制，通过收集行为 → 构建奖励 → 更新策略 → 监控效果 → 再收集数据，核心是：让 Agent 从用户反馈中学习，而不是只靠预设规则。
    

**【名词解释】**

会话**（Conversation）** ：ConversationID为唯一标识，指用户通过MultiAgents框架发生的一次完整会话，可能对应多轮生图任务；

任务（**Session**）：一次完整任务，一个会话中可能存在多次任务，需要使用时间/大模型意图判断等方式来分割

任务轮次（**Turn**）：ChatID为唯一标识，用户单论意图执行，即为一轮会话轮次

Tools调用（**Tool Call**）：会话任务执行Tools即为一次Tools调用

Human-in-the-Loop **(HITL)**：是一种设计范式，当Agent需要时发起追问，用户以主动参与者的身份介入Agent的自主决策或执行流程，

### 2、V2版本回顾

Agent V2版本，本质上是一个类AutoGen框架 plan + execute模式。Multi-Agent流程中的每一个节点都有独立的事件返回，对于长耗时的单元，如Agent执行、LLM请求都有开始和结束事件，且结束事件内会带有该单元的产出数据。

详细架构移步👉 /Users/tianruian/Brain/Clippings/AI设计师V2-基于Multi Agents架构的技术方案.md

以Openmanus的技术架构图为例
![[Pasted image 20260429135902.png]]

![[Pasted image 20260429135910.png]]
### 3、V3.0版本整体架构图

TEAM 改动
![[Pasted image 20260429135926.png]]

主体架构改动&进展

1. TEAM构成由2.0的流程切分的智能AGENT进化成3.0垂类独立完成任务的AGENT
    
2. 2.0原本流程中的需求分析和方案设计下沉成工具，由垂类AGENT自由调用
    
3. 澄清、打断、交互都由子类AGENT控制，leader不再负责
    
4. stepCheck步骤暂时取消，由垂类agent自主完成，后续考虑用规则代码或者小模型处理
    
5. Triage模块选择最快的模型，完成首轮handoff
    
6. 2.0的TEAM组织和规划方式保留，MEMBERS全部更新，上游通信的消息协议兼容老版本
    
7. 细化工具调用逻辑，完成不经过大模型的工具引擎并发、重试、URL占位等工作
    
8. 安全拦截由现有保时洁策略拦截升级为“Guardrail Agent”拦截，全新的防护机制将统一对用户输入和输出进行检查和验证，提升系统安全封控等级，满足美境对内和对外的产品形态对安全风控的要求。
    
9. 3.0版本的通用agent去掉，仅保留专业垂类agent，加入一个快速出图agent
    
10. Friday的Trace打点，需要细节区分agent + tool对，代替原本的仅工具部分，便于切片评估[Friday Trace评估方案](https://km.sankuai.com/collabpage/2740662479)，预期所有agent以美境工作流为载体孵化，自带[工作流需求 - 概览](https://km.sankuai.com/collabpage/2740752957)标准的转存、格式化、排队、Trace打点、版本管理、链路排查等功能

### 4、V3.0版本整体链路图

![[Pasted image 20260429140054.png]]

### 5、Feature拆分及排期

![[Pasted image 20260429140139.png]]

### 6、当前进展
![[Pasted image 20260429141907.png]]

