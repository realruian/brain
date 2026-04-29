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
<!-- Multi Agent框架升级 -->
<tr>
  <td rowspan="3" style="border:1px solid #d9d9d9;padding:8px 12px;background:#fafafa;font-weight:600;vertical-align:top;width:110px;">Multi Agent框架升级</td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;width:130px;">Triage Agent建设</td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;">Triage Agent（分流助手）是流量调度与任务分发的核心组件，其作用类似于急诊室的分诊护士，负责快速识别请求类型、评估优先级、分配处理资源，确保系统高效运行。</td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;">只做新的 conversation 的第一次分发</td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;"><span style="display:inline-block;background:#1677ff;color:#fff;padding:1px 10px;border-radius:4px;font-size:12px;">done</span></td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;"></td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;"></td>
</tr>

<tr>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;">子Agent拆分及建设</td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;">
    <details open>
      <summary style="cursor:pointer;font-size:13px;color:#555;margin-bottom:6px;">▾ 子Agent描述</summary>
      <table style="border-collapse:collapse;width:100%;font-size:13px;">
        <thead>
          <tr>
            <th style="border:1px solid #ddd;padding:5px 8px;background:#f5f5f5;">Agent 名称</th>
            <th style="border:1px solid #ddd;padding:5px 8px;background:#f5f5f5;">标识符</th>
            <th style="border:1px solid #ddd;padding:5px 8px;background:#f5f5f5;">核心职责</th>
            <th style="border:1px solid #ddd;padding:5px 8px;background:#f5f5f5;">典型场景</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style="border:1px solid #ddd;padding:5px 8px;"><strong>海报设计师</strong></td><td style="border:1px solid #ddd;padding:5px 8px;"><code style="background:#f0f0f0;padding:1px 5px;border-radius:3px;">poster_agent</code></td><td style="border:1px solid #ddd;padding:5px 8px;">负责海报类的设计与生成。</td><td style="border:1px solid #ddd;padding:5px 8px;">"帮我设计一张春节促销海报"</td></tr>
          <tr><td style="border:1px solid #ddd;padding:5px 8px;"><strong>Logo 设计师</strong></td><td style="border:1px solid #ddd;padding:5px 8px;"><code style="background:#f0f0f0;padding:1px 5px;border-radius:3px;">logo_agent</code></td><td style="border:1px solid #ddd;padding:5px 8px;">负责 Logo 的创意、设计与优化。</td><td style="border:1px solid #ddd;padding:5px 8px;">"设计一个科技公司的 Logo"</td></tr>
          <tr><td style="border:1px solid #ddd;padding:5px 8px;"><strong>图标设计师</strong></td><td style="border:1px solid #ddd;padding:5px 8px;"><code style="background:#f0f0f0;padding:1px 5px;border-radius:3px;">icon_agent</code></td><td style="border:1px solid #ddd;padding:5px 8px;">负责 App 图标、UI 图标的设计。</td><td style="border:1px solid #ddd;padding:5px 8px;">"生成一套线框风格的图标"</td></tr>
          <tr><td style="border:1px solid #ddd;padding:5px 8px;"><strong>视频制作师</strong></td><td style="border:1px solid #ddd;padding:5px 8px;"><code style="background:#f0f0f0;padding:1px 5px;border-radius:3px;">video_agent</code></td><td style="border:1px solid #ddd;padding:5px 8px;">负责视频内容的生成与编辑。</td><td style="border:1px solid #ddd;padding:5px 8px;">"把这张图片生成一段舞蹈视频"</td></tr>
          <tr><td style="border:1px solid #ddd;padding:5px 8px;"><strong>通用助手</strong></td><td style="border:1px solid #ddd;padding:5px 8px;"><code style="background:#f0f0f0;padding:1px 5px;border-radius:3px;">general_agent</code></td><td style="border:1px solid #ddd;padding:5px 8px;">处理非设计类的通用对话或兜底回复。</td><td style="border:1px solid #ddd;padding:5px 8px;">闲聊、未命中特定意图的请求。</td></tr>
          <tr><td style="border:1px solid #ddd;padding:5px 8px;"><strong>电脑操作员</strong></td><td style="border:1px solid #ddd;padding:5px 8px;"><code style="background:#f0f0f0;padding:1px 5px;border-radius:3px;">computer_use_agent</code></td><td style="border:1px solid #ddd;padding:5px 8px;">GUI 自动化。基于 VLM（视觉语言模型）操作浏览器。</td><td style="border:1px solid #ddd;padding:5px 8px;">"打开百度搜索美团股价"</td></tr>
          <tr><td style="border:1px solid #ddd;padding:5px 8px;"><strong>FAQ 助手</strong></td><td style="border:1px solid #ddd;padding:5px 8px;"><code style="background:#f0f0f0;padding:1px 5px;border-radius:3px;">faq_agent</code></td><td style="border:1px solid #ddd;padding:5px 8px;">（备用）回答关于系统的常见问题。</td><td style="border:1px solid #ddd;padding:5px 8px;">"这个系统能做什么？"</td></tr>
        </tbody>
      </table>
    </details>
  </td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;"></td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;"><ol style="margin:4px 0;padding-left:18px;"><li>已经拆分 logo agent、icon agent、video agent、poster agent</li><li>MCP server 工具描述调整</li></ol></td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;"><ol style="margin:4px 0;padding-left:18px;"><li>需求分析和方案设计 agent 要下沉成工具</li><li>agent 内部目前只配置文生图、图生图、图像识别的能力，需要扩展抠图等基础能力</li><li>通用 agent 需要做对话的兜底</li><li>需要创建一个快速生图的 agent</li><li>目前看不需要 plan 的 agent，从入口区分 2.0 和 3.0</li><li>扩展其他的 agent</li></ol></td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;"><ol style="margin:4px 0;padding-left:18px;"><li>单一 agent 提供完整服务，直接对外定制</li><li>2.0 和 3.0 并行，可以随时 diff 同样的对话效果</li></ol></td>
</tr>

<tr>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;">Human in Loop完善</td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;">简单任务中支持子 agent 执行中的打断、追问等；复杂任务按 Agent Workflow 固定路径执行</td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;">简单任务单一 agent 完成；复杂任务逐一单 agent 多次 handoff 完成；交互全部由 agent 自己完成，没有 leader 角色</td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;"></td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;"></td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;"></td>
</tr>

<!-- Memory -->
<tr>
  <td rowspan="3" style="border:1px solid #d9d9d9;padding:8px 12px;background:#fafafa;font-weight:600;vertical-align:top;">Memory</td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;">用户画像</td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;">以固定 Mis/Uid 维度，对用户智能创作进行画像标签存储</td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;color:#888;">低优先级</td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;"></td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;"></td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;"></td>
</tr>

<tr>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;">长期记忆</td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;">支持用户记忆跨会话维度迁移</td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;color:#888;">低优先级</td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;"></td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;"></td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;"></td>
</tr>

<tr>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;">共享 context</td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;">一个 conversationId 同一时间只有一个上下文，多个 agent 之间共享，区别就是各自 agent 中的 system prompt 不一样</td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;">多 agent 的上下文共享</td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;">目前只实现了滑动窗口</td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;">需要摘要系统：<ul style="margin:4px 0;padding-left:18px;"><li>突出主对话目标</li><li>精简上下文节省 token</li><li>异步窗口总结</li><li>区分 final answer 事件，完成对话生命周期的拆分</li></ul></td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;"><ul style="margin:4px 0;padding-left:18px;"><li>豆包</li><li>元宝</li><li>提高任务理解效果 + 节省 token</li></ul></td>
</tr>

<!-- Tools模块建设 -->
<tr>
  <td rowspan="3" style="border:1px solid #d9d9d9;padding:8px 12px;background:#fafafa;font-weight:600;vertical-align:top;">Tools模块建设</td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;">美境工作流<br><small style="color:#888;">Tools Rigester建设</small></td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;">将 Tools 能力下沉至美境工作流，支持在工作流中进行调用排队、打点、监控、统计等</td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;"></td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;">整理空间 <span style="display:inline-block;background:#1677ff;color:#fff;padding:1px 10px;border-radius:4px;font-size:12px;">done</span></td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;"><ul style="margin:4px 0;padding-left:18px;"><li>工具的标准化输入输出</li><li>统一的打点、监控服务</li><li>tool 层面的统一可以让 agent 做工具调用时不依赖大模型识别结果，从而精确提取类似 URL、CODE 等变量</li></ul></td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;"></td>
</tr>

<tr>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;">评测体系建设<br><small style="color:#888;">Agent线上观测</small></td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;">结合 Friday 线上观测工具，支持通过 Trace 追踪、性能统计和自动化评测，实现"观测-分析-优化"全流程管理。解决 Agent 状态监控、性能分析和问题定位，提升 Agent 运维效率。</td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;">智创 Agent 管理后台交互 PRD</td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;"><ul style="margin:4px 0;padding-left:18px;"><li>2.0 的方案初步打通 Friday Trace</li><li>3.0 架构打通</li></ul></td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;"></td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;"></td>
</tr>

<tr>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;">评测体系建设<br><small style="color:#888;">Agent离线评测体系</small></td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;">结合 Friday 评测工具，建设完善的 Agent 离线评测体系，支持评测集管理、评测任务管理、评测报告分析的 Agent 评测功能。建立用户数据回流及分析机制，通过收集行为 → 构建奖励 → 更新策略 → 监控效果 → 再收集数据</td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;"></td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;">多模态支持不友好，自建评测脚本</td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;"></td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;"></td>
</tr>

<!-- 交互层更新 -->
<tr>
  <td rowspan="3" style="border:1px solid #d9d9d9;padding:8px 12px;background:#fafafa;font-weight:600;vertical-align:top;">交互层更新</td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;">交互卡片升级</td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;">在 V2.0 版本，新增更多类型用户交互、评价卡片消息</td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;">需要新增问题反馈的模块，按照选项提供</td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;">事件已定义</td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;">前端适配</td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;"></td>
</tr>

<tr>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;">画布升级</td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;">考虑无限画布？？？（考虑 ROI）</td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;color:#888;">低优先级</td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;"></td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;"></td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;"></td>
</tr>

<tr>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;">上线方式</td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;"></td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;">共存：在设计师页面灰度开放 2.0 和 3.0 的双入口，方便比对</td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;"></td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;"></td>
  <td style="border:1px solid #d9d9d9;padding:8px 12px;vertical-align:top;"></td>
</tr>

