# Codebanana—PDE Agent 调研测评


官网：:[link]{href="https://www.codebanana.com/en" nodeId="d98390eebace4855bc3b49c25d58dc88"}https://www.codebanana.com/en[/link]

X：:[link]{href="https://x.com/CodewithMobvoi" nodeId="a59842148f45422a838a8897437170f4"}https://x.com/CodewithMobvoi[/link]


测评说明

**测评人**：**Claude** **code GUI 按要求通过 Chrome MCP 进行操作+截图**采集与报告撰写。claude 与 codebanana 对话完成测评

**思路**：只回答一个问题——CodeBanana 里有没有 PDE 范式真正落地的部分。落到三件事：判断是否留痕、业务 ground 是否持续在场、判断与执行是否分层。

**方法**：约 90 分钟实测。先用真实需求（"福利中心品牌限量秒杀"）让 Agent 在无业务背景下拆解；再注入 `mlive-domain` 业务 ground，在同一 chat 强制重拆，观察:[quote]{quoteId="2760915175--03811b93-b9e3-40df-b834-9d885b655087"}推断质量变化[/quote]。

**局限**：单人短窗口；同 chat 重跑对话可能残留；**HEARTBEAT 与多人协作未验证****:[quote]{quoteId="2760915175--41b6c15d-c5aa-44d1-9191-c52430067cf7"}。[/quote]**


# CodeBanana PDE 测评报告（HTML 源码版）

> 把下面代码块整段复制到任意 .html 文件、双击打开 = 原报告。
> 测评报告原文件：`~/Desktop/CodeBanana-PDE测评报告-2026-05-08.html`
> 截图依赖：`codebanana-screenshots/` 目录（与 .html 平级）

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>CodeBanana 测评报告 · 一个 PDE 视角</title>
<style>
  :root {
    --ink: #1a1d23;
    --ink-2: #4a5160;
    --ink-3: #8a93a3;
    --bg: #fafbfc;
    --bg-2: #f1f3f6;
    --line: #e3e6eb;
    --accent: #2553d6;
    --accent-soft: #eaf0fb;
    --green: #1f7a4d;
    --green-soft: #e7f5ee;
    --orange: #b35f00;
    --orange-soft: #fdf1e1;
    --red: #c0362c;
    --red-soft: #fae9e7;
    --gray-soft: #eef0f3;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: var(--bg);
    color: var(--ink);
    font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 16px;
    line-height: 1.7;
    -webkit-font-smoothing: antialiased;
  }
  .container { max-width: 920px; margin: 0 auto; padding: 56px 32px 96px; }

  .cover {
    border-bottom: 1px solid var(--line);
    padding-bottom: 40px;
    margin-bottom: 48px;
  }
  .kicker {
    color: var(--accent);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 12px;
  }
  h1 {
    font-size: 38px;
    line-height: 1.25;
    margin: 0 0 16px;
    letter-spacing: -0.01em;
  }
  .subtitle {
    font-size: 18px;
    color: var(--ink-2);
    margin: 0 0 28px;
    line-height: 1.55;
  }
  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    color: var(--ink-3);
    font-size: 14px;
  }
  .meta b { color: var(--ink-2); font-weight: 600; }

  h2 {
    font-size: 26px;
    margin: 56px 0 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--line);
    letter-spacing: -0.005em;
  }
  h3 { font-size: 19px; margin: 32px 0 12px; }
  h4 { font-size: 16px; margin: 20px 0 8px; color: var(--ink-2); }

  p { margin: 0 0 16px; }

  .tldr {
    background: var(--accent-soft);
    border-left: 3px solid var(--accent);
    padding: 24px 28px;
    border-radius: 4px;
    margin-bottom: 16px;
  }
  .tldr h3 { margin-top: 0; color: var(--accent); }

  .verdict-row {
    display: flex; flex-wrap: wrap; gap: 12px; margin: 20px 0 8px;
  }
  .pill {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 14px; border-radius: 999px; font-size: 13px; font-weight: 500;
  }
  .pill-green { background: var(--green-soft); color: var(--green); }
  .pill-orange { background: var(--orange-soft); color: var(--orange); }
  .pill-red { background: var(--red-soft); color: var(--red); }
  .pill-gray { background: var(--gray-soft); color: var(--ink-2); }

  figure {
    margin: 24px 0;
    background: white;
    border: 1px solid var(--line);
    border-radius: 8px;
    overflow: hidden;
  }
  figure img {
    width: 100%;
    display: block;
  }
  figcaption {
    padding: 12px 18px;
    color: var(--ink-2);
    font-size: 14px;
    line-height: 1.5;
    background: var(--bg-2);
    border-top: 1px solid var(--line);
  }
  figcaption b { color: var(--ink); }

  .placeholder {
    background: repeating-linear-gradient(45deg, #f0f3f7, #f0f3f7 10px, #e7ebf1 10px, #e7ebf1 20px);
    color: var(--ink-3);
    text-align: center;
    padding: 80px 20px;
    font-size: 14px;
    border: 2px dashed var(--ink-3);
    margin: 24px 0;
    border-radius: 8px;
    line-height: 1.6;
  }
  .placeholder b { color: var(--ink-2); display: block; margin-bottom: 6px; font-size: 15px; }

  .callout {
    border: 1px solid var(--line);
    background: white;
    border-radius: 6px;
    padding: 16px 20px;
    margin: 20px 0;
  }
  .callout-good { border-left: 3px solid var(--green); }
  .callout-bad { border-left: 3px solid var(--red); }
  .callout-note { border-left: 3px solid var(--accent); }
  .callout h4 { margin-top: 0; }

  blockquote {
    margin: 16px 0;
    padding: 8px 18px;
    border-left: 3px solid var(--ink-3);
    color: var(--ink-2);
    background: var(--bg-2);
    font-style: normal;
  }
  blockquote p:last-child { margin-bottom: 0; }

  code {
    background: var(--gray-soft);
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 13px;
    font-family: "SF Mono", Menlo, Consolas, monospace;
  }
  pre {
    background: #1e2128;
    color: #e6e9ef;
    padding: 16px 20px;
    border-radius: 6px;
    overflow-x: auto;
    font-size: 13px;
    line-height: 1.6;
    font-family: "SF Mono", Menlo, Consolas, monospace;
  }
  pre code { background: transparent; padding: 0; color: inherit; font-size: 13px; }

  table {
    width: 100%; border-collapse: collapse; margin: 20px 0;
    font-size: 14px; background: white; border: 1px solid var(--line);
    border-radius: 6px; overflow: hidden;
  }
  th, td { text-align: left; padding: 12px 16px; border-bottom: 1px solid var(--line); vertical-align: top; }
  th { background: var(--bg-2); font-weight: 600; color: var(--ink-2); }
  tr:last-child td { border-bottom: none; }

  ul, ol { padding-left: 22px; margin: 8px 0 16px; }
  li { margin: 6px 0; }

  .compare {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin: 20px 0;
  }
  .compare > div {
    border: 1px solid var(--line);
    border-radius: 6px;
    padding: 16px 20px;
    background: white;
  }
  .compare h4 { margin-top: 0; font-size: 14px; color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.05em; }

  .module-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin: 20px 0 24px;
  }
  .module-card {
    background: white;
    border: 1px solid var(--line);
    border-radius: 6px;
    padding: 16px 18px;
  }
  .module-card .head {
    display: flex; align-items: center; gap: 10px; margin-bottom: 8px;
  }
  .module-card .badge {
    width: 28px; height: 28px; border-radius: 6px;
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 14px; background: var(--accent-soft); color: var(--accent);
  }
  .module-card h4 { margin: 0; font-size: 15px; color: var(--ink); }
  .module-card p { margin: 0; font-size: 14px; color: var(--ink-2); line-height: 1.55; }

  .score-card {
    border: 1px solid var(--line); border-radius: 6px;
    padding: 18px 22px; background: white; margin: 16px 0;
  }
  .score-head {
    display: flex; align-items: center; gap: 12px; margin-bottom: 10px;
  }
  .score-head h4 { margin: 0; font-size: 17px; color: var(--ink); }

  .footer {
    margin-top: 80px; padding-top: 24px; border-top: 1px solid var(--line);
    color: var(--ink-3); font-size: 13px; text-align: center;
  }

  .step-list { counter-reset: step; padding-left: 0; list-style: none; }
  .step-list > li {
    counter-increment: step; position: relative; padding-left: 44px; margin-bottom: 28px;
  }
  .step-list > li::before {
    content: counter(step); position: absolute; left: 0; top: 0;
    background: var(--accent); color: white;
    width: 28px; height: 28px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 600;
  }

  hr.soft { border: none; height: 1px; background: var(--line); margin: 32px 0; }

  .toc {
    background: white;
    border: 1px solid var(--line);
    border-radius: 6px;
    padding: 18px 24px;
    margin: 24px 0 40px;
    font-size: 14px;
  }
  .toc-title { font-weight: 600; color: var(--ink-2); margin-bottom: 8px; }
  .toc ol { padding-left: 22px; margin: 0; }
  .toc a { color: var(--ink-2); text-decoration: none; }
  .toc a:hover { color: var(--accent); }

  .verdict-block {
    background: white;
    border: 1px solid var(--line);
    border-radius: 8px;
    padding: 22px 26px;
    margin: 16px 0;
  }
  .verdict-block h4 { margin-top: 0; font-size: 15px; color: var(--accent); text-transform: uppercase; letter-spacing: 0.06em; }

  .layout-diagram {
    background: white;
    border: 1px solid var(--line);
    border-radius: 8px;
    padding: 20px;
    margin: 24px 0;
    font-size: 13px;
  }
  .layout-diagram .lay-row {
    display: flex; gap: 8px;
  }
  .lay-cell {
    border: 1px dashed var(--ink-3);
    padding: 14px 16px; border-radius: 4px;
    color: var(--ink-2);
  }
  .lay-cell b { color: var(--ink); display: block; margin-bottom: 4px; font-size: 13px; }
  .lay-left { width: 22%; min-height: 200px; background: #fbfcfd; }
  .lay-mid { flex: 1; min-height: 200px; background: #fbfcfd; }
  .lay-right { width: 30%; min-height: 200px; background: var(--accent-soft); border-color: var(--accent); }
</style>
</head>
<body>
<div class="container">

<!-- COVER -->
<header class="cover">
  <div class="kicker">产品测评报告 · 不打分 · 给所有 PDE</div>
  <h1>CodeBanana 能成为 PDE 的工作平台吗？</h1>
  <p class="subtitle">先讲清楚这是个什么产品、它的核心模块怎么组织的；再用一个真实的美团直播需求实跑 90 分钟，看它原生能力撑不撑得起 PDE 的判断—执行—判断节奏。</p>
  <div class="meta">
    <span><b>测评者</b>：子文（美团直播 PDE）</span>
    <span><b>测评日期</b>：2026-05-08</span>
    <span><b>测评方式</b>：以 PDE 角色实跑真实需求</span>
    <span><b>不依赖</b>：任何个人定制 skill / Forge 等外部范式工具</span>
  </div>
</header>

<!-- TOC -->
<div class="toc">
  <div class="toc-title">目录（总—分结构）</div>
  <ol>
    <li><a href="#overview">这是个什么产品（含截图布局）</a></li>
    <li><a href="#modules">核心模块速览（产品的 8 个组件）</a></li>
    <li><a href="#goal">测评目标 & 验收标准</a></li>
    <li><a href="#tldr">总判断（一段话）</a></li>
    <li><a href="#flow">实测全流程（按时间线 + 11 张过程截图）</a></li>
    <li><a href="#injection">业务资产注入实测（5 入口 + A 方案重跑对比 + 4 张证据截图）</a></li>
    <li><a href="#eval">PDE 视角八维度评估</a></li>
    <li><a href="#bright">四个值得讲的设计亮点</a></li>
    <li><a href="#dark">三个用过才知道的短板</a></li>
    <li><a href="#who">谁该用、谁该等、什么场景下用</a></li>
    <li><a href="#summary">一段话总结判断</a></li>
    <li><a href="#appendix">附录：实跑产出物 + 项目结构</a></li>
  </ol>
</div>

<!-- ============= 总：先讲产品 ============= -->
<h2 id="overview">1. 这是个什么产品</h2>

<p>用一句话定位：<b>CodeBanana 是面向团队的 AI 协作 SaaS 平台</b>。每个用户在里面建「项目」，每个项目背后是一个独立的云端容器（agent 能跑 shell 命令、读写文件），项目内有一个被赋予人格的 AI 助手；团队成员可以共享 agent 也可以私聊 agent，还能不带 agent 直接讨论。</p>

<h3>主界面长什么样（三栏布局）</h3>

<figure>
  <img src="https://km.sankuai.com/api/file/2760915175/235882900029" alt="CodeBanana 主界面整体（首次 onboarding 状态）">
  <figcaption>
    <b>截图 0 · CodeBanana 主界面布局</b>。整个产品的视觉骨架就是三栏（左 / 中 / 右）：左边是项目树和文件树，中间是文件预览/编辑区，右边是 Agent 对话区。这跟 VS Code 的「Explorer / Editor / Sidebar」很像，但右边不是工具面板而是<b>跟 AI 对话的主战场</b>。
  </figcaption>
</figure>

<div class="layout-diagram">
  <div class="lay-row">
    <div class="lay-cell lay-left">
      <b>左栏：组织 + 项目 + 文件</b>
      顶部 Org 切换器<br>
      All Projects 树<br>
      点开项目展开文件夹<br>
      Project ↔ Chat 切换
    </div>
    <div class="lay-cell lay-mid">
      <b>中栏：文件 / 产出物</b>
      Markdown 渲染预览<br>
      支持 .md / .json 多种格式<br>
      欢迎页 + Recent files<br>
      多 Tab 同时打开多个文件
    </div>
    <div class="lay-cell lay-right">
      <b>右栏：对话主战场</b>
      Team Agent 团队共享<br>
      Private Ask 个人独占<br>
      Discussion 纯人类讨论<br>
      底部模型选择 / 模式切换
    </div>
  </div>
</div>

<h3>它的另一面：企业级注册 / 组织管理</h3>

<figure>
  <img src="https://km.sankuai.com/api/file/2760915175/235881438047" alt="CodeBanana 企业级 Org onboarding 第 4 步：上传部门和成员">
  <figcaption>
    <b>截图 0b · CodeBanana 的企业级 onboarding</b>。新组织注册时是一个 5 步向导，第 4 步直接让你<b>上传部门结构 xlsx + 成员 xlsx</b>（含 Department Head、Direct Manager、Employee ID 等字段）。这件事说明 CodeBanana 的目标客户<b>不是个人开发者，而是企业团队</b>——它的产品形态是按「组织 → 部门 → 成员 → 项目 → Agent」分层组织的。
  </figcaption>
</figure>

<h3>跟其它"AI 助手"产品的关系定位</h3>
<table>
  <tr>
    <th>产品</th>
    <th>核心形态</th>
    <th>跟 CodeBanana 的差异</th>
  </tr>
  <tr>
    <td>ChatGPT GPTs</td>
    <td>Prompt + 知识文件</td>
    <td>没真实容器、没文件系统、没团队/个人分层</td>
  </tr>
  <tr>
    <td>Claude Projects</td>
    <td>项目级上下文</td>
    <td>没「人格化配置文件」、没团队分层、agent 不写文件</td>
  </tr>
  <tr>
    <td>Claude Code</td>
    <td>开发者本地 CLI/IDE</td>
    <td>个人单机工具，没多人协作场域</td>
  </tr>
  <tr>
    <td>飞书智能伙伴</td>
    <td>挂在 IM 里的 agent</td>
    <td>没专属容器、没结构化 persona、没沙盒文件操作</td>
  </tr>
</table>
<p>它的位置 ≈ <b>「企业团队空间 + 真容器 + 可编辑的 Agent 人格」</b>三件事的合体。</p>

<!-- ============= 总：核心模块 ============= -->
<h2 id="modules">2. 核心模块速览（一图看懂产品骨架）</h2>
<p>把整个产品打开看，由 <b>8 个核心模块</b>组成。下面这张「模块地图」+ 旁边的简短解释，帮你建立全局认知，后面测评章节再按这些模块逐个验证：</p>

<div class="module-grid">
  <div class="module-card">
    <div class="head"><span class="badge">①</span><h4>Project（项目 = Sandbox 容器）</h4></div>
    <p>每个项目背后是一个独立云端容器（路径形如 <code>/data/coda/{shortId}/ws/{project-uuid}</code>），有真实文件系统和 git，agent 能跑 shell 命令。<b>项目即工作空间</b>。</p>
  </div>
  <div class="module-card">
    <div class="head"><span class="badge">②</span><h4>Templates（25 个 Agent 模板）</h4></div>
    <p>新建项目时可选模板：Ad Analyst / Content Analyst / E-commerce Analyst / Legal Advisor 等 25 个，分 5 个分类（Research / Documents / Apps / Data / Workflow）。也可 Custom Template 从零开始。</p>
  </div>
  <div class="module-card">
    <div class="head"><span class="badge">③</span><h4>.codebanana/ Persona 配置</h4></div>
    <p>每个项目都有 <code>.codebanana/.agent/</code> 文件夹，用 9 个 Markdown 表达 agent 的「人格维度」：身份 / 灵魂 / 用户档案 / 工具 / 工作流 / 记忆 / 团队 / 心跳 / 首启脚本。</p>
  </div>
  <div class="module-card">
    <div class="head"><span class="badge">④</span><h4>Skills（progressive disclosure）</h4></div>
    <p><code>.codebanana/.skills/</code> 下分三层：global（通用）/ agent 专属（如 ticnote-support-cn）/ 个人。每个 skill 用 <code>SKILL.md</code> + <code>references/</code> 子目录组织，按需加载。</p>
  </div>
  <div class="module-card">
    <div class="head"><span class="badge">⑤</span><h4>Contexts（对话历史快照）</h4></div>
    <p><code>.codebanana/contexts/messages_{date}.txt</code> 用 JSON Lines 存对话历史，含 timestamp / type / session_id。<b>每天一个文件，可追溯、可导出</b>。</p>
  </div>
  <div class="module-card">
    <div class="head"><span class="badge">⑥</span><h4>三 Tab 协作模型</h4></div>
    <p>右侧聊天分 <b>Team Agent / Private Ask / Discussion</b>。Team 共享 + 写文件，Private 个人 + 只读，Discussion 纯人类无 agent。三种协作模式分得清。</p>
  </div>
  <div class="module-card">
    <div class="head"><span class="badge">⑦</span><h4>Tools（Agent 实际能干什么）</h4></div>
    <p>Agent 在沙盒里有 <code>read_file / write_file / list_dir / run_terminal_cmd</code> 等工具。所有工具调用在 chat 里以折叠日志形式展示，可点开查看。</p>
  </div>
  <div class="module-card">
    <div class="head"><span class="badge">⑧</span><h4>Org / Team / Members（组织层）</h4></div>
    <p>注册时 5 步向导建组织，含部门结构 + 成员 xlsx 导入。Org Admin Workspace 单独是一个项目，用来管 AI adoption 度量。</p>
  </div>
</div>

<p>记住这张地图，后面测评章节会按 ①②③⑥ 这几个模块的真实表现来评判。</p>

<!-- ============= 测评目标 ============= -->
<h2 id="goal">3. 测评目标 & 验收标准</h2>

<div class="callout callout-note">
  <h4>核心测评问题</h4>
  <p>「<b>一个普通 PDE 拿到 CodeBanana，不会写任何 skill / 不依赖 Forge 等外部范式工具</b>，能不能把它当成 PDE 工作的主力平台用？」</p>
</div>

<h3>八个测评维度（PDE 通用，不绑定特定方法论）</h3>
<table>
  <tr><th>维度</th><th>评估问题</th></tr>
  <tr><td>① 角色定制</td><td>9 个 .md 文件能不能表达「我是个什么样的 PDE」？</td></tr>
  <tr><td>② 业务知识承载</td><td>Skills + Contexts 能不能装下美团直播这种业务复杂度？</td></tr>
  <tr><td>③ 流程可定义</td><td>AGENTS.md 能不能让普通人写出"我做需求的流程"（不写代码）？</td></tr>
  <tr><td>④ 协作支持</td><td>三 Tab 能不能表达 PDE-COE-管理层协作？</td></tr>
  <tr><td>⑤ 持续工作记忆</td><td>跨 session 能保住「我是谁、在做什么」吗？</td></tr>
  <tr><td>⑥ 主动性</td><td>HEARTBEAT 主动 tick 是噱头还是真的？</td></tr>
  <tr><td>⑦ 学习成本</td><td>新 PDE 上手要花多久？9 个文件全要填吗？</td></tr>
  <tr><td>⑧ 数据/工具集成</td><td>美团内部资料（飞书、学城、Figma）能塞吗？</td></tr>
</table>

<h3>真实需求场景</h3>
<p>从美团直播 2026 OP 真实方向中选一个：<b>福利中心新增「品牌限量秒杀」专区，目标提升 L4+ 高价值用户复访复购</b>。所有业务上下文（百万级 DAU / 7日留存（中线水平） / 抽奖 7日复访（显著高于大盘） / 商品兴趣大于内容兴趣）都用真实数据。</p>

<h3>验收标准（说清楚怎么判断做对了）</h3>
<ul>
  <li>实际跑通至少 <b>1 个真实 chat session</b>，不是只看静态文件</li>
  <li>三个聊天 Tab（Team Agent / Private Ask / Discussion）<b>各发过消息</b></li>
  <li>八个评估维度<b>都给出具体观察 + 一句判断</b>，不是凑话</li>
  <li>给出<b>明确的「谁该用 / 谁该等」</b>结论，不和稀泥</li>
  <li>不出现 Forge / Anthropic Skills / Harness 等专有词，或出现时给出解释</li>
</ul>

<!-- ============= 分：开始测评 ============= -->
<h2 id="tldr">4. 总判断（一段话）</h2>
<div class="tldr">
  <h3>它能跑 PDE 工作流，但不会替你做 PDE。</h3>
  <p style="margin-bottom: 0;">
    CodeBanana 把「Agent 人格 / 业务上下文 / 工具调用 / 协作分层」这四件事用 <b>9 个 Markdown 文件 + 三个聊天 Tab</b> 表达清楚了。
    一个普通 PDE 不写一行代码，<b>90 分钟</b>就能把需求拆到「可以贴企业微信发给运营对齐」的程度。
    Agent 默认没有美团业务上下文 —— 但产品提供了 <b>5 种注入入口</b>（GitHub 导入 / Upload file / Upload folder / 子目录 Upload / chat 附件），<b>注入到 .skills/{domain}/SKILL.md 后由平台层 skill_manager 在 trigger 命中时自动加载</b>（实测见第 6 章）；不注入时 agent 会用通用电商常识推，注入后明显升级到"基于 ground 的对照分析"。
    PDE 真正的价值（判断、给方向、识别风险）它替不了你，它能做的是把你脑子里的判断<b>结构化、文档化、留痕</b>。
  </p>
</div>
<div class="verdict-row">
  <span class="pill pill-green">✓ 项目隔离 sandbox：每个项目一个真实容器</span>
  <span class="pill pill-green">✓ Persona = 9 个可编辑的 .md 文件</span>
  <span class="pill pill-green">✓ Team / Private / Discussion 三层协作分得清</span>
  <span class="pill pill-orange">⚠ 默认无业务知识，需主动注入</span>
  <span class="pill pill-orange">⚠ BOOTSTRAP 自毁机制实测没生效</span>
  <span class="pill pill-green">✓ 5 种注入入口 + skill_manager 自动加载（实测跑通）</span>
</div>

<!-- ============= 实测 ============= -->
<h2 id="flow">5. 实测全流程（按时间线）</h2>

<ol class="step-list">

<li>
<h3>第一步：建项目（看到 25 个模板）</h3>
<p>左上角 + 号 → Create Project → 弹出模板选择对话框。</p>

<figure>
  <img src="https://km.sankuai.com/api/file/2760915175/235883072191" alt="25 个项目模板">
  <figcaption>
    <b>截图 1 · 25 个内置 Agent 模板</b>（对应模块 ②）。覆盖 5 类（Research & Analysis / Documents / Websites & Apps / Data & Dashboards / Workflow & Operations）。
    PDE 视角看：这些模板都是「分析师/顾问」类的，<b>没有为「需求落地全链路」设计的模板</b>，所以本次测评选 Custom Template（从零开始）。
  </figcaption>
</figure>

<p>选 Custom Template → 输项目名「[测评] 美团直播-福利中心需求」→ 点 Create。后端做 6 步初始化：</p>
<pre><code>1. Creating Chat Session（建对话通道）
2. Loading Template Info（加载模板）
3. Connecting to Build Server（连后端 sandbox）
4. Initialize Workspace（建项目目录）
5. Setup Template（释放模板文件到容器）
6. Prepare Environment（git init + 装依赖）</code></pre>
<p><b>关键观察</b>：第 3 步明确叫 "Build Server" —— 后端确实是真实容器（对应模块 ①），不是逻辑隔离。第 6 步连 git init 都做了。这是后面 agent 能跑 <code>write_file</code>/<code>run_terminal_cmd</code> 的物理基础。</p>
</li>

<li>
<h3>第二步：BOOTSTRAP 初始化（Agent 自动配置自己）</h3>
<p>项目刚建好，右侧聊天框立刻有一条 <b>系统注入的伪用户消息</b>触发 agent 读取 <code>.codebanana/.agent/BOOTSTRAP.md</code>。然后 agent 主动跟我打招呼：</p>
<blockquote>
<p>嗨！👋欢迎来到这个项目空间「[测评] 美团直播-福利中心需求」！</p>
<p>第一步：认识我自己 🤔<br>
1. 怎么称呼你？<br>
2. 这个项目主要做什么？<br>
3. 你希望我重点帮你做哪些事？</p>
</blockquote>
<p>我用一段话回答 —— 我是 PDE 子文 / 推进福利中心需求 / 重点帮我拆需求 / 写 PRD / 维护业务上下文 / 在判断点给意见 / 工作方式是「人在入出口判断 AI 在阶段内执行」。</p>
<p><b>意外的事发生了</b>：BOOTSTRAP.md 里写的是「按 5 步走、对话式收集、不要跳」（IDENTITY → SOUL → USER → TOOLS → AGENTS）。但 agent 听完我一段话后<b>直接跳过了所有问答</b>，一次性写完三个文件、并发出「初始化完成 ✅ 配置摘要」。</p>

<figure>
  <img src="https://km.sankuai.com/api/file/2760915175/235882308018" alt="BOOTSTRAP 工具调用">
  <figcaption>
    <b>截图 2 · BOOTSTRAP 阶段的工具调用日志</b>（点开"10 expanded"查看完整链路）。能看到 agent 调了 <code>read_file</code>（读 BOOTSTRAP.md）+ 多次 <code>write_file</code>（写 IDENTITY/SOUL/USER）。
    <b>这套东西的「上手成本」比文档承诺的低</b>——你不用忍受 5 轮问答。代价是它<b>可能少问一些 PDE 关心的细节</b>（团队角色、汇报关系、节奏期望）。
  </figcaption>
</figure>
</li>

<li>
<h3>第三步：看 agent 写了什么（这是 CodeBanana 的「灵魂」）</h3>
<p>Agent 写的三个文件，质量出乎意料地高 —— 不是模板填空，是真的根据我那段话做了语义提取和重组。</p>
<p style="font-size: 13px; color: var(--ink-3); margin-top: -8px;">⚠️ 下面三张截图里 agent 写的是"紫文"——那是测评时我自己输错了（应为"子文"），文字层已统一为"子文"。</p>

<figure>
  <img src="https://km.sankuai.com/api/file/2760915175/235882078788" alt="IDENTITY.md">
  <figcaption>
    <b>截图 3 · IDENTITY.md（Agent 给自己取的名 + 定位）</b>。
    Name: 需求伙伴（PDE Copilot）/ Vibe: 务实、有结构感、像一个熟悉业务的产品同学；不废话、直接推进 / Emoji: 🎯。
    然后列了它认为自己擅长的 4 件事（拆解需求 / 竞品分析 / 起草打磨 PRD / 识别风险边界）。
    <b>注意「PDE Copilot」这个词是 agent 自己造的</b> —— 我没说这个词，它从我提到「PDE」+「希望帮我」推断出来。
  </figcaption>
</figure>

<figure>
  <img src="https://km.sankuai.com/api/file/2760915175/235883183330" alt="SOUL.md">
  <figcaption>
    <b>截图 4 · SOUL.md（Agent 的人格原则）</b>。五条核心原则：<b>真正有用而不是表演有用 / 有判断有立场 / 先想清楚再问 / 用结构驱动思考 / 尊重已有工作成果</b>。
    PDE 视角看：第一条和第二条直接对齐了「PDE 要的不是话痨而是判断伙伴」；第三条对应「信息不全先用已有信息推演」；这 5 条作为 Persona 默认值<b>已经超出大多数 GPT 包装产品的水准</b>。
  </figcaption>
</figure>

<div class="callout callout-bad">
  <h4>⚠ 一个明显的产品瑕疵</h4>
  <p>Agent 写了 IDENTITY.md / SOUL.md / USER.md，<b>但没改 AGENTS.md</b>（工作流文件）。AGENTS.md 还是默认模板，开头写着 <code>You are CodeBanana, an AI assistant</code> —— 跟 IDENTITY 里 "PDE Copilot" 的身份直接冲突。BOOTSTRAP.md 里把 AGENTS 标为 "(optional)"，agent 就跳过了。这个冲突没人能保证 LLM 在长对话里会偏向哪个。</p>
</div>

<figure>
  <img src="https://km.sankuai.com/api/file/2760915175/235883067023" alt="AGENTS.md 默认模板">
  <figcaption>
    <b>截图 5 · AGENTS.md 是默认模板</b>。开头一行写得明明白白 "You are CodeBanana, an AI assistant"，跟 IDENTITY 的"PDE Copilot"打架。Agent 选择不动它。
  </figcaption>
</figure>

<div class="callout callout-bad">
  <h4>⚠ 另一个声明式状态机失效的瑕疵</h4>
  <p>BOOTSTRAP.md 在产品文档里被设计成<b>「一次性引导文件，用完自毁」</b>—— agent 完成配置后应该 <code>rm</code> 掉它，作为「初始化完成」的状态信号。实测里 agent 确实调了 <code>run_terminal_cmd: rm .code...</code> 并报告 Done，但<b>文件还在文件树里、内容还能读</b>。声明式状态机的优雅设计在工程上没真正生效。</p>
</div>

<figure>
  <img src="https://km.sankuai.com/api/file/2760915175/235882591071" alt="BOOTSTRAP.md 没真删">
  <figcaption>
    <b>截图 6 · BOOTSTRAP.md 还活着</b>。Agent 报告 "rm Done"，但文件树里它还在、能点开看完整内容。这是个「声称做了但没真做」的产品 bug。
  </figcaption>
</figure>
</li>

<li>
<h3>第四步：扔真实需求给 agent</h3>
<p>我把需求扔过去：</p>
<blockquote>
<p>接到一个需求：在福利中心新增「品牌限量秒杀」专区，目标是提升 L4+ 高价值用户的复访复购。我现在还没看到详细的需求文档，先想跟你聊一下这个事。<b>你怎么看这个需求？我应该先搞清楚什么？你需要哪些业务上下文才能帮我拆需求？</b></p>
</blockquote>
<p>这是 PDE 一线工作的真实开局 —— 模糊、信息不全、需要先把问题搞清楚再动手。</p>

<p>Agent 第一轮反应做了三件事：</p>
<ol>
  <li><b>先给判断不先问</b>：「方向是合理的，但『秒杀』和『L4+ 复购』之间的逻辑链还需要验证」—— 直接挑出"秒杀(脉冲) vs 复购(持续)"的张力</li>
  <li><b>明确缺什么、一次性问全</b>：用一张 5 行的表格列出它要的信息（福利中心模块结构 / L4+ 用户定义 / 提出方 / 时间节点 / 参考案例），每条问"你知道多少？"</li>
  <li><b>不空说判断，给具体的"L4+ 用户特征"作为推断依据</b></li>
</ol>

<p>我用真实业务数据回应（百万级 DAU / 7日留存（中线水平） / 抽奖 7日复访（显著高于大盘） / 商品兴趣 > 内容兴趣 / 商品卡 CTR（高位） vs 直播卡 CTR（中位）），故意留 2 项空缺（时间节点、提出方）。</p>

<p>Agent 第二轮反应做了 PDE 应该做的<b>4 件事</b>：</p>
<ul>
  <li><b>消化业务数据</b>：从「商品兴趣 > 内容兴趣」推出「L4+ 是目的性消费」</li>
  <li><b>挑词的张力</b>：「秒杀」在 L4+ 心智里是低价抢购，跟「品牌限量」的高端调性冲突 —— 建议对外淡化为机制、强调"限量专属"</li>
  <li><b>借抽奖的复访驱动力</b>：抽奖之所以 7日复访（高位），是「不确定性 + 到点要来」的组合，建议在秒杀加预约提醒来复刻这个</li>
  <li><b>不等条件齐再动手</b>：给 3 件马上能做的（建澄清清单 / 搭 PRD 框架 / 竞品扫描），让 PDE 选</li>
</ul>

<figure>
  <img src="https://km.sankuai.com/api/file/2760915175/235882625502" alt="Team Agent 完整对话">
  <figcaption>
    <b>截图 7 · Team Agent 实际对话场面</b>。中间是 agent 写出来的需求澄清清单（产出物），右侧是聊天对话。<b>注意聊天里那个"10 responses Expand to view agent responses"折叠条</b>——长工具调用被 agent 自动收起，PDE 看到的是干净的对话流，需要时点开看细节。这是协作 IDE 类产品里很少见的体验设计。
  </figcaption>
</figure>
</li>

<li>
<h3>第五步：让 agent 落产出物</h3>
<p>我说「先走第一件事，起草『对运营的需求澄清清单』，明天要拿这个去对齐。要求：问题分类、优先级、每个问题带上为什么问，能直接贴企业微信」。</p>

<p>Agent 没问"写到哪个文件"，<b>自己决定建一个 docs/ 文件夹</b>、文件名按业务命名 <code>docs/运营需求澄清清单_品牌限量秒杀.md</code>。这是 PDE 范式里"AI 在阶段内执行"的具体表现 —— 它知道这种交付物应该落在哪、叫什么。</p>

<figure>
  <img src="https://km.sankuai.com/api/file/2760915175/235882791233" alt="澄清清单产出物">
  <figcaption>
    <b>截图 8 · 实际落到文件的澄清清单</b>（左下文件树多了 <code>docs/运营需求澄清清单_品...</code>）。共 16 个问题，分 5 大类（目标与度量 / 货品与供给 / 用户规则 / 时间与节奏 / 产品边界），分必须问 11 个 + 可以后补 5 个，每个问题<b>都带"为什么问"</b>。
    Q9 让我印象深刻：「是否需要预约/提醒机制？<br>抽奖的强复访来源于『不确定性 + 到点要来』，秒杀如果有预约提醒可以复刻这个驱动力。运营是否有意愿维护这个机制？」——它把我之前给的"抽奖（显著高位）"事实<b>转化成了具体功能假设</b>，而不是只罗列问题。
  </figcaption>
</figure>
</li>

<li>
<h3>第六步：测试三个聊天 Tab 的协作模型</h3>
<p>右侧每个项目有三个 Tab：<b>Team Agent / Private Ask / Discussion</b>。Hover 能看到 tooltip：</p>
<table>
  <tr><th>Tab</th><th>Tooltip</th><th>实际行为</th></tr>
  <tr>
    <td><b>Team Agent</b></td>
    <td>"Build and iterate with team agent"</td>
    <td>Coding 模式，能写文件、跑工具，<b>团队所有人共享上下文</b></td>
  </tr>
  <tr>
    <td><b>Private Ask</b></td>
    <td>"Ask or plan your work"</td>
    <td>Ask-only 模式，<b>只能问与回答</b>，不写文件，<b>个人独占上下文</b>，不影响团队历史</td>
  </tr>
  <tr>
    <td><b>Discussion</b></td>
    <td>"Discuss with your collaborators"</td>
    <td><b>纯人类讨论区</b>，没有 agent 参与</td>
  </tr>
</table>

<figure>
  <img src="https://km.sankuai.com/api/file/2760915175/235883151541" alt="Private Ask 独立 agent">
  <figcaption>
    <b>截图 9 · Private Ask 是独立 agent</b>。左下角注意 <code>Ask-only</code>（不是 Coding）。我发同样需求 "美团直播福利中心要新增「品牌限量秒杀」专区"，Private Ask 给了类似风格的判断（说明它读了同一套 IDENTITY/SOUL），<b>但完全不知道之前 Team Agent 那场对话</b> —— 上下文是隔离的。
    这就是 PDE 的"个人发散空间"：你想私下推演不污染团队历史、想在跟同事对齐前自己先想想，用 Private Ask；想要落产出物、跟团队协作，用 Team Agent。
  </figcaption>
</figure>

<figure>
  <img src="https://km.sankuai.com/api/file/2760915175/235883258676" alt="Discussion 是人类区">
  <figcaption>
    <b>截图 10 · Discussion 干脆没有 agent</b>。"Hey, here for open-discussion!" —— 团队成员之间纯文字讨论，输入框没有模型选择、没有工具开关。
    这是个挺重要的产品决定：<b>不强制所有交流都通过 agent</b>，给团队留人对人的空间。在 AI agent 产品越来越贪心地"接管所有沟通"的趋势下，这是个克制的选择。
  </figcaption>
</figure>

<figure>
  <img src="https://km.sankuai.com/api/file/2760915175/235883265701" alt="Team Agent chat 流的折叠设计">
  <figcaption>
    <b>截图 11 · Team Agent 完整 chat 流（含折叠）</b>。每次 agent 回复带工具调用时，都会折叠成 "10 responses Expand to view agent responses" / "1 responses..."。
    <b>PDE 视角看</b>：协作产品里 chat 滚动太多是普遍痛点，CodeBanana 用"工具调用折叠"+ "展开按钮"解决了 —— 团队成员看 chat 不会被干扰，需要 debug 时再展开。
  </figcaption>
</figure>
</li>

</ol>

<!-- EVAL -->
<h2 id="injection">6. 业务资产注入实测（专节）</h2>
<p>第 5 章那次实测里 agent 给的"L4+ 用户特征推断"用的是<b>通用电商常识</b>，不是美团直播的真实画像。这背后的根因是 agent 还没拿到业务 ground —— 它只能从 chat 历史里"嘴喂式"消化信息。本节专门验证：<b>CodeBanana 到底有没有让业务知识"长期持久化 + 自动加载"的能力？</b></p>

<h3>6.1 五种注入入口</h3>
<p>在产品 UI 里挨个走一遍，CodeBanana 提供 <b>5 个独立的资产注入入口</b>：</p>
<table>
  <tr><th>#</th><th>入口路径</th><th>颗粒度</th><th>典型场景</th></tr>
  <tr><td>A</td><td><code>+</code> → Import GitHub Repository</td><td>项目级整体</td><td>团队资产已在 git，整仓导入</td></tr>
  <tr><td>B</td><td>项目 <code>...</code> → Upload file</td><td>单文件</td><td>临时往项目根扔一份 PRD/截图</td></tr>
  <tr><td>C</td><td>项目 <code>...</code> → <b>Upload folder</b></td><td>整个文件夹</td><td>本地有结构化资产文件夹（最丝滑）</td></tr>
  <tr><td>D</td><td>子目录 <code>...</code> → Upload</td><td>到指定结构位置</td><td>明确放进 <code>.skills/{name}/</code></td></tr>
  <tr><td>E</td><td>chat <code>+</code> 附件</td><td>临时附件</td><td>当前 chat 上下文用一次</td></tr>
</table>

<h3>6.2 实测注入：让 agent 把业务知识写进 .skills/</h3>
<p>测试方法：在 chat 里发一条命令式 prompt，让 agent 把它从我这里学到的所有美团直播业务知识，整理成结构化的 <code>.codebanana/.skills/mlive-domain/SKILL.md</code>，并加 YAML frontmatter（含 name / description / triggers）。</p>

<figure>
  <img src="https://km.sankuai.com/api/file/2760915175/235882999550" alt="注入成功 — agent 调 write_file 写到 .skills/mlive-domain/SKILL.md">
  <figcaption>
    <b>截图 12 · 注入成功的全链路证据</b>。
    右侧 chat 显示 agent 调 <code>write_file 41ms .../a/.skills/ml...</code> 完成，紧接着自述：「保存到 <code>.codebanana/.skills/mlive-domain/SKILL.md</code>。这是 CB 的 Skill 标准目录，会被平台识别为一个本地 Skill」+「下次怎么加载：自动触发（trigger 关键词命中 → skill_manager 主动调用） / 手动触发（直接说『加载业务知识库』）」。
    左侧文件树同步更新：<code>.skills/</code> 下出现了 <code>mlive-domain/</code> 文件夹（与默认 <code>global/</code> 平级）。
  </figcaption>
</figure>

<h3>6.3 SKILL.md 的实际内容（agent 自己组织的）</h3>
<p>截图 12 中间区域已经显示了 agent 写出来的 SKILL.md 顶部：<code>name: mlive-domain</code> / <code>description: 美团直播业务知识库</code>，并自动从我提到的业务概念里抽出了 <b>18 个 trigger 关键词</b>（美团直播、直播、福利中心、L4+、铂金用户、高价值用户、抽奖、秒杀、品牌限量、惊喜购、福利购、领券购、资产、复访、复购、访购率、商品卡、直播卡）。</p>
<p>body 部分按 <b>业务全景 / 用户分层 / 关键数据发现 / 战略举措</b> 分了 4 个 section。<b>这个组织水平超出"机械落盘"</b> —— agent 主动判断了哪些维度该独立成段、trigger 该选哪些词。</p>

<h3>6.4 重跑场景 1：有 ground vs 无 ground 的判断质量对比</h3>
<p>这是测评最关键的一节 —— 装了 SKILL 不算成功，<b>装了之后实际推理质量是否升级</b>才是关键。</p>
<p style="font-size: 13px; color: var(--ink-3); margin-top: -8px;">⚠️ 下面三张截图里 agent 输出含具体业务数据（百分比、规模）—— 这些是 agent 直接引用 SKILL.md 内容的证据，<b>报告正文层已统一脱敏为相对描述</b>。读者看截图时只关注「agent 是否真的引用了具体业务事实做判断」这件事，不必关注具体数字。</p>
<p>测试方法：在已注入 mlive-domain 的同一个 chat 里，发一条 prompt 强制 agent <b>忽略之前讨论、当作第一次见这个需求</b>，重新拆解。Prompt 要求三件事：(1) 初步判断 + 至少 2 条逻辑张力；(2) 接下来要问运营的<b>最关键的 5 个问题（不是 16 个）</b>；(3) 跟没业务背景时相比，判断主要在哪些点上更扎实。</p>

<figure>
  <img src="https://km.sankuai.com/api/file/2760915175/235884150914" alt="重跑时 skill_manager 再次自动触发">
  <figcaption>
    <b>截图 13 · A 方案重跑时 skill_manager 再次自动触发</b>。
    Prompt 含「直播 / 福利中心 / L4+ / 秒杀 / 复购」多个 trigger 词，<b>平台层 skill_manager 1ms 再次 Loaded skill: ...</b>。Agent 第一句直接说「好，基于 mlive-domain skill 的业务上下文来做这个对比实验。」—— 主动确认 skill 已加载。
    紧接着开始拆「张力一：『秒杀』机制 vs L4+ 用户心智」，引用具体 ground 数据：「L4+ 访购率 30%，是大盘 2.5 倍。已经是高转化人群——他们不缺购买意愿。缺的是『有值得来的理由』。」<b>这是基于业务事实的推断，不是通用电商常识</b>。
  </figcaption>
</figure>

<figure>
  <img src="https://km.sankuai.com/api/file/2760915175/235884463424" alt="重拆后的两条逻辑张力 + 5 关键问题开头">
  <figcaption>
    <b>截图 14 · 重拆后的两条逻辑张力 + 5 关键问题</b>。
    <b>张力一</b>「秒杀机制 vs L4+ 用户心智」：「秒杀」在用户心智里等于低价抢购，但 L4+ 对稀缺感、专属感、品质背书更敏感；如果以「秒杀」为主打调性，反而吸引来的是 L1-L3 价格敏感用户，稀释 L4+ 专属体验。<b>结论：「秒杀」应是机制（限量+定时），对外强调「品牌专属限量」而非「低价抢购」。</b>
    <b>张力二</b>「复访目标 vs 秒杀短脉冲属性」：抽奖 7 日复访的核心是「不确定性 + 到点要来」养成习惯。秒杀如果做成随机上架、无预约提醒，没法养成习惯，复访数据大概率跑不赢抽奖——不是被抽奖分掉，而是<b>秒杀本身没建立复访习惯</b>。<b>结论：「预约 + 定时开抢 + 开抢提醒」不是 PRD 锦上添花，是复访目标能否达成的前提条件。</b>
    然后给的「最关键的 5 个问题」（核心 KPI / 供给来源 / 限购规则 / 复访机制设计 / 入口归属）—— 比原来 16 题列表<b>聚焦得多</b>，每条都直接关联 ground 里某条已验证事实，是真正"卡脖子"的判断点。
  </figcaption>
</figure>

<figure>
  <img src="https://km.sankuai.com/api/file/2760915175/235883910791" alt="agent 自己生成的'前后对比表'">
  <figcaption>
    <b>截图 15 · agent 自己生成的「前后对比表」</b>。
    我没指定要表格 —— agent 主动把"没有业务背景时" vs "有 mlive-domain 后" 列成表对比 4 个判断点（L4+ 用户定性 / 复访机制设计依据 / 入口路径风险 / 商品卡逻辑）。
    例如 <b>L4+ 用户定性</b> 这一行：没有 ground 时是「高价值用户可能注重品质」（猜测），加载 ground 后是「访购率 30% vs 大盘 12%，目的性消费已数据验证，不是假设」。<b>这就是"通用常识推断"和"基于 ground 推断"的差距</b> —— 后者每个判断点都能追溯到具体业务事实。
  </figcaption>
</figure>

<h3>6.5 注入实测的整体结论</h3>
<div class="callout callout-good">
  <h4>能装、能跑、自动加载、推断质量经实测明显改善（带对比证据）</h4>
  <ul>
    <li>✅ 产品有 <b>5 个独立注入入口</b>（不是只有"嘴喂"）</li>
    <li>✅ Anthropic Skills 协议在 CodeBanana 是 <b>实际生效的产品能力</b>：写到 <code>.skills/{name}/SKILL.md</code> 的文件会被 <b>skill_manager</b> 自动调度，不是装饰</li>
    <li>✅ Trigger 关键词命中由平台层做（截图 13/16 都看到 <code>skill_manager 1ms Loaded skill</code>），不依赖 agent 主动 <code>read_file</code> —— 这是真正的 <b>progressive disclosure</b>，符合 Anthropic Skills 设计原意</li>
    <li>✅ <b>A 方案重跑确认</b>：装了 ground 之后，agent 主动减少澄清问题数量（16 → 5 个最关键的）、给的判断每条都能追溯到具体业务事实（截图 14/15）—— 不是"听起来更专业"，是<b>判断结构本身改变了</b></li>
    <li>⚠ 一个真实限制：美团内部资料原生不在 git/本地文件里（在飞书/学城），<b>注入前需要导出为 markdown/html</b>，这是流程问题不是产品问题</li>
  </ul>
</div>

<h2 id="eval">7. PDE 视角八维度评估</h2>
<p>对应章节 3 列的 8 个评估问题，每个维度只给一句结论 + 具体观察。不打分。</p>

<div class="score-card">
  <div class="score-head"><h4>① 角色定制（PDE 角色能不能表达？）</h4>
  <span class="pill pill-green">够用</span></div>
  <p>9 个 .md 文件按"人格维度"切分（IDENTITY / SOUL / USER / TOOLS / AGENTS / TEAMS / MEMORY / HEARTBEAT / BOOTSTRAP）。Agent 自动从我一段简短自我介绍里提取出"PDE Copilot"角色定位、"务实有结构感"vibe、5 条工作原则。<b>对一个普通 PDE 来说够了</b>。但 AGENTS.md 没被改，需要的话得手工编辑。</p>
</div>

<div class="score-card">
  <div class="score-head"><h4>② 业务知识承载（美团直播这种复杂度装得下吗？）</h4>
  <span class="pill pill-orange">能装但要靠你嘴喂</span></div>
  <p>实测确认：CodeBanana 提供 <b>5 个独立的注入入口</b>（详见第 6 章后的"业务资产注入实测"专节）：（1）<code>+</code> → Import GitHub Repository；（2）项目 <code>...</code> → Upload file；（3）项目 <code>...</code> → Upload folder（整个文件夹）；（4）任意子文件夹 <code>...</code> → Upload；（5）chat 输入框 <code>+</code>（临时附件）。注入到 <code>.skills/{domain}/SKILL.md</code> 后，<b>平台层有 skill_manager 系统在 trigger 关键词命中时自动加载</b>，agent 给的判断会基于 ground 而非通用常识。<b>能装且能跑通</b>。</p>
</div>

<div class="score-card">
  <div class="score-head"><h4>③ 流程可定义（能不能让普通人写"我做需求的流程"？）</h4>
  <span class="pill pill-orange">理论可以但没引导</span></div>
  <p>AGENTS.md 是流程文件，<b>Agent 自己跳过了写它</b>，留给用户。普通 PDE 不会主动去写 .md 流程定义。如果产品<b>多走一步</b>——在 BOOTSTRAP 里强制问"你的工作流分几步、每步要什么产出"，普通人就有路径上手；现在它把这个责任默默扔给了用户。</p>
</div>

<div class="score-card">
  <div class="score-head"><h4>④ 协作支持（PDE-COE-管理层协作能不能装？）</h4>
  <span class="pill pill-green">三层协作模型清晰</span></div>
  <p>Team / Private / Discussion 三个 Tab 对应"团队执行 / 个人推演 / 人对人讨论"三种模式，是协作 IDE 类产品里少见的清晰分层。但单测里我没法验证<b>多人同时用 Team Agent 是什么体验</b>（会不会冲突？谁的输入对 agent 有更高权重？），需要团队真实使用才能验证。</p>
</div>

<div class="score-card">
  <div class="score-head"><h4>⑤ 持续工作记忆（跨 session 保得住"我是谁、在做什么"吗？）</h4>
  <span class="pill pill-green">基础有，深度待验</span></div>
  <p>USER.md 里写好了"子文 / PDE / 福利中心方向 / 接需求-澄清-方案-PRD 全链路"，这是<b>常驻人物档案</b>。MEMORY.md 是空的占位符（"Agent populates over time"），但产品没明示什么时候 agent 会写它。<b>contexts/messages_*.txt 自动留对话历史</b>（按日期分文件）—— 我看到自己一上午的对话被原样存成 JSON Lines，可追溯、可导出。</p>
</div>

<div class="score-card">
  <div class="score-head"><h4>⑥ 主动性（HEARTBEAT 是不是噱头？）</h4>
  <span class="pill pill-gray">理论上有，没看到真跑</span></div>
  <p>HEARTBEAT.md 设计为"周期任务清单"——文件留空 = 不跑；写入任务 = agent 定时执行。这个设计很精巧（声明式调度，跟 BOOTSTRAP 自毁是同一种哲学），但<b>测评 90 分钟内没看到 tick 在跑</b>，也没看到产品 UI 给提示让用户配置。当作"未来能力"看，现状是空的。</p>
</div>

<div class="score-card">
  <div class="score-head"><h4>⑦ 学习成本（新 PDE 上手要花多久？）</h4>
  <span class="pill pill-green">很低</span></div>
  <p>从 Create Project 到拿到第一份能贴运营群的产出物，<b>实际用时约 90 分钟</b>，期间没读任何文档、没碰命令行、没编辑文件。BOOTSTRAP 主动找你聊、agent 主动决定写哪些文件 —— 这点上比 Claude Code 类产品门槛低一个量级。9 个文件不需要全填，初期填 3 个就跑得动。</p>
</div>

<div class="score-card">
  <div class="score-head"><h4>⑧ 数据/工具集成（美团内部资料能不能塞？）</h4>
  <span class="pill pill-green">实测可用</span></div>
  <p>实测确认产品有 <b>5 个独立的资产注入入口</b>：(1) Import GitHub Repository（项目级整体导入仓库）；(2/3) 项目 <code>...</code> → Upload file/folder（直接选本地文件或文件夹）；(4) 任意子目录 <code>...</code> → Upload（落到指定结构位置）；(5) chat <code>+</code> 附件（临时上下文）。注入到 <code>.skills/{domain}/SKILL.md</code> 后，<b>平台层 skill_manager 在 trigger 命中时自动加载</b>，agent 会基于 ground 推断。本次测评实跑了"通过 chat 让 agent 自己用 .skills/ 协议持久化业务知识"这条路径，全链路打通。<b>对企业 PDE 的硬限制不在产品，在于美团内部资料原生不在 git 仓库里</b> —— 飞书/学城需要先导出为 markdown/html 文件，再用 Upload folder 入口装进去；这是人/流程问题，不是产品能力缺失。</p>
</div>

<!-- BRIGHT -->
<h2 id="bright">8. 四个值得讲的设计亮点</h2>

<div class="callout callout-good">
  <h4>① Persona-as-Files：把 Agent 人格切成 9 个可编辑的 Markdown</h4>
  <p>大多数 GPT 包装产品给你一个"系统提示词"输入框；CodeBanana 把这件事拆成 9 个文件按维度分管：<b>身份 (IDENTITY)、灵魂 (SOUL)、用户档案 (USER)、工具 (TOOLS)、工作流 (AGENTS)、记忆 (MEMORY)、团队 (TEAMS)、心跳 (HEARTBEAT)、首启脚本 (BOOTSTRAP)</b>。这种切分让"修改 agent 的某个面"成为低成本动作 —— 想换风格改 SOUL.md，想加新工作流改 AGENTS.md，<b>不会牵一发动全身</b>。</p>
</div>

<div class="callout callout-good">
  <h4>② 声明式状态机：用文件存在与否表达 agent 生命周期</h4>
  <p>BOOTSTRAP.md 文件存在 = 这个 agent 还没被个性化；agent 完成 onboarding 后 <code>rm</code> 自己（理论上） = 进入正常工作状态。HEARTBEAT.md 留空 = 不跑周期任务；写入任务 = 启动调度。<b>没有"配置面板"、没有 if/else 状态分支</b>，只有"文件在不在、内容是什么"。这种思路非常优雅。<br>
  <span class="pill pill-orange">⚠ 但 BOOTSTRAP 自毁实测没生效，理念好工程没跟上。</span></p>
</div>

<div class="callout callout-good">
  <h4>③ Team / Private / Discussion 三 Tab 分层协作</h4>
  <p>团队执行（共享 agent + 工具权限）/ 个人推演（独立 agent + 只读模式）/ 人对人讨论（纯文字、无 agent）—— 这个分层<b>对 PDE-COE-管理层这种多角色协作场景天然友好</b>。PDE 自己想清楚用 Private Ask，要落产出物用 Team Agent，跟管理层非 agent 话题用 Discussion。GPTs / Claude Projects 都没这种分层。</p>
</div>

<div class="callout callout-good">
  <h4>④ Agent 自带「先判断、后提问、给推荐」的工作风格</h4>
  <p>测评里 agent 两次响应都遵循同一节奏：<b>先给判断 → 挑出张力 → 列缺什么 → 给具体下一步选项</b>。它不是被动应答机，是有立场的对话伙伴。这背后是 SOUL.md 里"真正有用而不是表演有用"+"有判断有立场"两条原则的落地。<b>对 PDE 这种"做的就是判断"的角色来说，这种工作伙伴比"百问百答型 AI"有用太多</b>。</p>
</div>

<!-- DARK -->
<h2 id="dark">9. 三个用过才知道的短板</h2>

<div class="callout callout-bad">
  <h4>① 美团内部资料原生不在 git 仓库里，注入需先导出</h4>
  <p>CodeBanana 自己提供了 5 个注入入口（含 GitHub 仓库导入、本地文件/文件夹上传、子目录上传、chat 附件）—— 产品端是齐的。但美团 PDE 的资产<b>大量在飞书 / 学城 / 大象群里，原生不是 git/本地文件形态</b>。要装进 CodeBanana，得先把目标文档<b>导出为 markdown/html/pdf</b>，再用 Upload folder 入口装。一份 PRD 来回拷贝可控，<b>跨项目同步多份资产、保持版本一致</b>就有摩擦。这是企业内 SaaS 协作通病，不是 CodeBanana 独有缺陷。</p>
</div>

<div class="callout callout-bad">
  <h4>② Agent 的产出有"通用电商常识"幻觉风险</h4>
  <p>你不给业务上下文时，agent 不会停下来等，会用<b>通用电商/SaaS 常识</b>推断（"L4+ 用户看重稀缺感、专属感、品质背书"——这些是奢侈品/会员电商的画像，跟美团直播 L4+ 是<b>本地生活高消费用户</b>的画像有差异）。</p>
  <p>这件事的副作用是<b>它的输出"听起来对但不一定准"</b>。PDE 必须自己有判断力去校验，不能直接用。</p>
</div>

<div class="callout callout-bad">
  <h4>③ 配置自动化 vs 完整性的内在矛盾</h4>
  <p>BOOTSTRAP.md 设计为 5 步对话引导，但 agent 实际跳过了 4 步合并成 1 轮。结果：</p>
  <ul>
    <li><b>好</b>：上手成本极低，10 秒搞定初始化</li>
    <li><b>坏</b>：跳过的 AGENTS.md / TOOLS.md / TEAMS.md 都是默认模板，跟 IDENTITY 里的 "PDE Copilot" 设定冲突；agent 自己都没来得及核对</li>
  </ul>
  <p>这件事可以靠产品改 prompt 解决（让 agent 必须改 AGENTS.md），但目前是个未解决状态。</p>
</div>

<!-- WHO -->
<h2 id="who">10. 谁该用、谁该等、什么场景下用</h2>

<div class="compare">
  <div>
    <h4>✓ 现在就值得试</h4>
    <ul>
      <li><b>个人 PDE 需要一个"判断伙伴"</b>处理小到中型需求，不依赖团队历史资产</li>
      <li><b>跨职能协作需要中间产出物落地</b>（澄清清单、需求 frame、方案大纲），用它当"一次性脚手架"</li>
      <li><b>想体验"prompt-as-files"和"agent-as-subscription"的产品形态</b>，作为对照参考自己的设计</li>
      <li><b>团队还没有统一的 PDE 工作平台</b>，临时找一个 lightweight 试点</li>
    </ul>
  </div>
  <div>
    <h4>✗ 别急着上</h4>
    <ul>
      <li><b>需要把美团内部大量资产（学城/飞书/Figma）作为长期 ground</b>—— 没导入入口，每次 paste 不可持续</li>
      <li><b>团队多人 PDE 同时跑同一项目</b>—— 单测无法验证多人 Team Agent 的并发体验</li>
      <li><b>已经在用成熟范式工具（Forge / Claude Code）的人</b>——这个产品提供的能力是子集，迁移成本可能高于收益</li>
      <li><b>需要 HEARTBEAT 类主动定时任务</b>—— 设计在但实测没看到运行</li>
    </ul>
  </div>
</div>

<h3>典型适用场景</h3>
<ol>
  <li><b>需求拆解工作坊</b>：产品 / 设计 / 研发同时在 Team Agent 里把一个新需求 frame 清楚，agent 落产出物</li>
  <li><b>个人需求脑暴</b>：在 Private Ask 里把一个模糊想法推演 30 分钟，确认想清楚再去 Team Agent</li>
  <li><b>外包式 PRD 起草</b>：填完 USER.md / 给业务上下文后，让 agent 起草 PRD 框架，自己只做质量把关</li>
  <li><b>跨域咨询</b>：用 25 个内置模板里的某一个（如 E-commerce Analyst）建项目，扔一个具体场景，要分析判断</li>
</ol>

<h3>不适合的场景</h3>
<ol>
  <li><b>需要持续维护一个跨季度的项目知识库</b>：导入入口缺失是硬限制</li>
  <li><b>把它当 PRD 文档管理系统</b>：它写出来的 .md 在云端项目里，导出/同步到飞书/学城需要手动</li>
  <li><b>对真值/合规敏感的业务</b>：agent 默认有通用知识幻觉，没有源数据校验机制</li>
</ol>

<!-- TOTAL -->
<h2 id="summary">11. 一段话总结判断 + PDE 视角的核心借鉴</h2>
<div class="tldr">
  <p style="margin: 0 0 12px 0;">
  CodeBanana 是一个<b>把 "PDE 判断—AI 执行" 哲学落到了产品级实现的 AI 工作平台 MVP</b>。
  它最值得借鉴的不是 UI、不是 25 个内置模板，而是把"PDE 工作里最难的三件事"做成了具体的产品 capability：
  </p>
  <ul style="margin: 0 0 12px 0; padding-left: 22px;">
    <li><b>判断如何留痕</b> → 9 个可编辑的 .md 文件（SOUL/IDENTITY/AGENTS/...）—— PDE 给 agent 设原则、定边界、写工作流，全部以可 diff 的 markdown 持久化</li>
    <li><b>业务 ground 如何"持续在场"</b> → <code>.skills/{domain}/SKILL.md</code> + 平台层 <code>skill_manager</code> 自动加载（trigger 命中即注入），实测验证 PDE 不用每次手动 fetch context</li>
    <li><b>协作里判断和执行如何分清</b> → Team/Private/Discussion 三 tab，分别对应"团队执行 / 个人推演 / 人对人讨论"，把"什么时候用 AI / 什么时候直接对话"区分得清楚</li>
  </ul>
  <p style="margin: 0;">
  对一个想<b>体验未来 PDE 工作长什么样</b>的人，它值得花一个下午跑一个真需求；
  对一个<b>需要现在就替换工作主力工具</b>的人，"美团内部资料需先导出再上传"这条流程摩擦会让它暂时不能成为日常主力。
  但<b>它对 PDE 范式的产品级实现给出了一个可参考的样本</b>——这点不论用不用，都值得 PDE 看一眼。
  </p>
</div>

<!-- APPENDIX -->
<h2 id="appendix">附录 · 实跑产出的澄清清单（节选）</h2>
<p>这是 agent 在测评里实际生成的产出物，<b>未经任何编辑直接复制</b>：</p>
<pre><code>品牌限量秒杀专区 · 需求澄清清单

背景：福利中心拟新增「品牌限量秒杀」专区，面向 L4+ 用户，
目标提升复访复购。以下问题用于对齐需求细节，推进 PRD 输出。

一、目标与度量（必须问）
Q1：这个专区的核心 KPI 是什么？
    复访率、访购率、GMV、还是 L4+ 用户渗透率？
    不同 KPI 对应的产品设计逻辑差异很大，这个必须先对齐。
Q2：KPI 归属在哪里？
    是计入福利中心整体，还是这个专区单独考核？
    影响资源投入优先级和上线节奏判断。
Q3：有没有预期的目标值和时间周期？
    比如「上线后 30 天内 L4+ 用户 7 日复访率提升 X%」。
    有具体目标才能反推功能设计的必要深度。

二、货品与供给（必须问）
Q4：商品从哪里来？谁来选品？
    平台自采、商家报名、BD 品牌合作，三种模式运营成本和上架节奏差异很大。
    供给侧不稳定，专区就无法持续运营。
Q5：预计上架频率和每次数量？
    比如每天 3 个 SKU、每周两次。这个决定了用户养成「定期来看」习惯的可行性，
    也影响前端展示设计。
Q6：品牌和品类有限定方向吗？
    美妆、数码、食品还是全品类？
    品牌调性直接影响 L4+ 用户的感知，也影响和其他秒杀频道的差异化定位。

三、用户规则（必须问）
Q7：L4+ 用户是唯一可见人群，还是分级展示？
    是 L4+ 专属入口（L3 及以下看不到），还是全量可见但 L4+ 有额外权益？
    影响入口设计和权益感知。
Q8：每个用户每次活动的限购规则是什么？
    限购 1 件、还是按等级差异化限购？
    限购规则设计不当容易引发用户投诉。
Q9：是否需要预约/提醒机制？
    抽奖的强复访来源于「不确定性 + 到点要来」，
    秒杀如果有预约提醒，可以复刻这个驱动力。
    运营是否有意愿维护这个机制？

四、时间与节奏（必须问）
Q10：期望的上线时间节点是什么？
    影响 PRD 优先级排期和功能取舍，冷启动 MVP 和完整版的范围差距很大。
Q11：秒杀活动的时间窗口怎么定？
    固定时段（如每天 20:00）还是随机上架？
    固定时段有利于用户养成习惯，随机上架增加平台侧灵活性但用户预期难管理。

五、产品边界（可以后补）
Q12-Q16：Tab 归属 / 优惠券联动 / 对标竞品 / 后台配置 / 异常处理预案

两点说明：
1. Q4 供给来源 是今天最容易被忽视但最影响后续方案的问题，建议重点问。
2. Q9 预约提醒 如果运营有意愿做，PRD 里会多一个关键模块，需要尽早确认。
</code></pre>

<h3>附录 · 项目目录结构（最终状态）</h3>
<pre><code>[测评] 美团直播-福利中心需求/
├── .codebanana/                       ← Agent 配置区
│   ├── .agent/
│   │   ├── IDENTITY.md          ← Agent 自己写的（PDE Copilot 身份卡）
│   │   ├── SOUL.md              ← Agent 自己写的（5 条原则）
│   │   ├── USER.md              ← Agent 自己写的（子文档案）
│   │   ├── AGENTS.md            ← 默认模板（agent 没改，与 IDENTITY 冲突）
│   │   ├── TOOLS.md             ← 默认模板
│   │   ├── TEAMS.md             ← 空
│   │   ├── MEMORY.md            ← 占位符
│   │   ├── HEARTBEAT.md         ← 留空 = 不跑
│   │   └── BOOTSTRAP.md         ← 应自毁但还在
│   ├── .skills/                  ← 注入测试新增 mlive-domain/SKILL.md
│   │   ├── global/                  默认通用 skills
│   │   └── mlive-domain/            实测注入的业务 skill（trigger 自动加载）
│   │       └── SKILL.md
│   ├── contexts/
│   │   └── messages_2026-05-08.txt   ← 完整对话历史 JSONL
│   └── metadata.json             ← {user_id, project_id}
├── docs/
│   └── 运营需求澄清清单_品牌限量秒杀.md   ← Agent 自动落的产出物
├── user-guides/                  ← 系统给的 CodeBanana 使用文档
└── .gitignore
</code></pre>

<div class="footer">
  <p>测评者：子文（jiangziwen02）· 美团直播 PDE · 2026-05-08<br>
  本报告基于约 90 分钟的实测，单人视角，不构成长期使用判断。</p>
</div>

</div>
</body>
</html>
```
