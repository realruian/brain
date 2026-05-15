---
title: 境外工程基于 Harness 理论下的工程示例及运营案例
source: https://km.sankuai.com/collabpage/2761314694
saved: 2026-05-15
tags: [Clippings]
date: 2026-05-15
---

# 境外工程基于 Harness 理论下的工程示例及运营案例

目录

一、为什么需要 Harness：你要把AI 当成一个鲜活的人

二、Harness结构回顾

三、境外工程案例

四、境外基于Harness体系开发、排查、评审案例

五、Harness 自进化分两个层面：随排查及开发随pr提交（保鲜）+ cr-checklist/ks-raptor （提召）

附录：境外全量 AppKey 索引

> 这篇文章讲 Harness 到底在哪些真实场景里让 AI 少犯错、让排查少走弯路。
> 理论来自两篇建设指南，工程样板来自git-project_git_info.md，案例来自真实的开发、评审、告警。

---

#### 一、为什么需要 Harness：你要把AI 当成一个鲜活的人

你把一个工程交给一个新人，他能知道什么？他能读懂代码结构——类之间的调用关系、方法的实现逻辑。*这是代码本身能告诉他的*。

**他不知道的是：**这个服务的上游是谁、下游依赖哪些服务、用了哪些中间件、历史上踩过哪些坑、最近有没有重要的设计决策。*这些东西不在代码里，只存在于老人的脑子里*。

**Harness 维护的：****就是 AI 从代码中推断不出来的那部分****。**更精确地说，Harness 有两层价值：

- **补盲区**：AI 拿到代码之后仍然不知道的东西——跨工程依赖、中间件约定、历史 badcase、产品边界；

- **提效率**：帮 AI 快速找到它原本能找到但要费时间的东西——哪个模块最重要、从哪里开始看；

---

#### 二、Harness结构回顾

每个工程的 Harness 由六层组成，按需加载：

```plain text
repo 根目录/
├── CLAUDE.md                    # 层1：工程地图（60行为宜）
├── CONTRIBUTING.md              # AI + 人类协作规范
├── .claude/
│   └── hooks-template.json      # 编译检查 Hook 模板
└── docs/
    ├── dependencies.md          # 层3：上下游依赖全景
    ├── specs/TEMPLATE.md        # 层4：需求设计文档模板
    ├── knowledge/issues.md      # 层5：历史线上问题知识库
    └── tests/cases.md           # 层6：核心回归测试场景
```

这六层的本质是把"老员工的大脑"外化成文件。[CLAUDE.md](http://CLAUDE.md) 是工程地图，[dependencies.md](http://dependencies.md) 是人脉图，[issues.md](http://issues.md) 是历史教训。

**六层是基础样板，不是死板约束。***本质逻辑只有两条：补盲区 + 提效率*。六层结构是对大多数工程都适用的最小集，但每个工程可以按需往上叠：

- **问题排查路径**：如果你的服务有固定的排查 SOP（比如告警必查哪几个 Raptor 面板、logcenter 关键词是什么），可以直接写进 `docs/knowledge/runbook.md`，甚至把常用排查命令固化成工程专属 skill 放进 `.claude/skills/`

- **中间件配置速查**：Lion 开关列表、Squirrel key 模板、Mafka topic 清单，如果工程里中间件很重，单独拆出来比塞进 [CLAUDE.md](http://CLAUDE.md) 更好用

- **任何你发现 AI 反复要问的东西**，都值得加进来

**最重要的一点：新增任何文档，都必须在 CLAUDE.md 里维护好索引指针**（一行：`→ 排查 SOP 见 docs/knowledge/runbook.md`）。没有索引，AI 不知道这个文件存在，等于没写。

---

#### 三、境外工程案例

##### `**oversea-csc-pacific-case-flow**` / **后端复杂多模块服务**

**地址**

[git:ba-csc/oversea-csc-pacific-case-flow](https://git.sankuai.com/projects/ba-csc/repos/oversea-csc-pacific-case-flow)

**真实条目示例**

`**docs/knowledge/issues.md 真实条目示例**`（来自 ks-raptor 告警分析沉淀）：

```plain text
## 2026-05-08 - AssistAgentModel output_config 为 null 触发 IllegalArgumentException
现象：pageRuleWithModelOutputParam 接口调用时 convertEntity2VO 崩溃，错误率上升
根因：DB 中 assist_agent_model id=7 的 output_config 字段为 null，
      JacksonUtil.toList(null, ...) 触发 ObjectMapper._assertNotNull 断言
修复：convertEntity2VO 中加 StringUtils.isBlank 保护，使用 toListWithEmptyDefault
预防规则：所有从 DB 读取 JSON 字符串后反序列化的场景，toList/readValue 前必须判空
```

`**CLAUDE.md 里的索引指针长这样**`：

```plain text
## 核心约束
- 所有 DB JSON 字段反序列化前必须判空（见 issues.md 2026-05-08）
...
→ 历史线上问题见 docs/knowledge/issues.md
→ 上下游依赖全景见 docs/dependencies.md
```

**CLAUDE.md 的核心约束写得非常精准**，直接命中"AI 最容易犯的错"：

- 分片 DB（`pacific_case_shard_product`，按 `case_id` 路由）：同一 `case_id` 的跨表 JOIN 合法，但禁止用非分片键（`staff_id`/`status_id`/时间等）做跨表 JOIN 或全表扫描——这个信息从代码静态分析根本看不出来

- 境外服务禁止 `@Reference` 国内接口（`FinanceApprovalRemoteService` 等 `com.dianping.csc.*`）——AI 不知道境外/国内服务注册中心不互通，不写出来必然踩坑

- 禁止 `String.valueOf(obj)` 直接转换 Map 取值——null 会变成字面量 `"null"` 而不是空，这是 Java 里极隐蔽的坑

**dependencies.md 是接口粒度的全景**，带 QPS 数字：

```plain text
| OverseaToolRenderRemoteService:render | 12.10 | 工具渲染 |
| --- | --- | --- |
| OverseaCaseActionNewRemoteService:invokeCaseAction | 1.82 | 触发工单动作 |
```

AI 排查告警时，知道哪个接口是核心流量，知道上游是谁——这是 Raptor 数据和代码加在一起也推断不出来的。

**Harness 更新检查表**做了"触发条件 → 更新哪个文件"的映射：

| 触发路径 | 需要更新的文件 |
| --- | --- |
| Raptor 告警排查完 | `docs/knowledge/issues.md`（必须）；反复出现加入 `CLAUDE.md` 约束 |
| CR 发现高频坏味道 | `docs/knowledge/issues.md`；编码约束 → `CLAUDE.md` |
| 新产品需求上线 | `docs/specs/`（必须）；依赖变更 → `dependencies.md` |

##### `**csc-oversea-workbench-bff**` / **ks-BFF-承担整体入口流量**

**地址**

https://dev.sankuai.com/code/repo-detail/ba-csc/csc-oversea-workbench-bff/file/list

**真实条目示例**

`**docs/dependencies.md 真实片段**`

```markdown
## 本服务对外暴露接口（Pigeon，含 QPS）

| 接口（简写） | QPS |
| -------------------------------------------------- | ------- |
| ActionToolRemoteService:componentRenderV2 | 13.46 |
| WorkbenchRemoteService:getHistoryCase | 4.54 |
| WorkbenchRemoteService:getServicePageById | 4.36 |
| OverseaFaqRecommendRemoteService:searchV3 | 3.26 |

## 上游调用方
```

这里的两个细节值得注意：**数据来源日期**（知道信息可能过期）和 **IDC 分布**（排查 set 级别告警时直接知道哪个 set 是哪个机房）。

BFF 层的特点是上游单一（网关）、下游众多（20+ 个 Pigeon 服务）。

**dependencies.md 的亮点**：

- 标注了数据来源时间（2026-04-16）和 IDC 分布（法兰克福一/二区各 4 台）——有时效性意识，知道信息会过期

- 接口 QPS 精确到两位小数，直接能看出核心链路（`componentRenderV2` QPS 13.46 是主流量入口）

这个细节很重要：排查一个 BFF 告警时，知道哪个接口 QPS 最高，能直接缩短定位时间。

##### `**cs-fe-sep-i18n**` / **ks-工作台前端大型 Vue3 工程**

**地址**

https://dev.sankuai.com/code/repo-detail/cs-fe/cs-fe-sep-i18n/file/list

**真实条目示例**

`**CLAUDE.md 核心约束真实片段**`：

```markdown
## 核心约束
- 所有组件必须使用 <script setup> + Composition API，禁止 Options API
- HTTP 请求统一通过 useAxios / useAxiosInstance from @hook，禁止直接 import axios
- 国际化文案统一通过 useI18n().$t('key')，禁止硬编码中文字符串
- 会话上下文通过 useContext / useContactContext inject 获取，禁止跨组件直接读 Store

## 禁止事项
- 禁止 --no-verify 跳过 husky 钩子
- 禁止直接 import axios from 'axios'
- 禁止硬编码中文字符串（必须走 i18n）
```

`**docs/knowledge/issues.md cr-checklist 沉淀示例**`（来自框架迁移 PR 评审）：

```plain text
## 2026-04 - 迁移类 PR 评审策略：区分"迁移引入的新 bug"与"原版本就有的设计选择"
现象：Angular→Vue 迁移 PR，AI 把"原版本就有的 warning 语义"报成 P2，研发驳回
根因：没有区分两类问题的评审视角
修复：迁移 PR 先判断问题是"原版本就有"还是"迁移引入"，后者才是真正的 bug
预防规则：迁移类 PR 评审时，"原版本就有的设计选择"降级或不提，加备注"若原版本行为一致可忽略"
```

前端工程的 Harness 和后端略有不同——没有 [dependencies.md](http://dependencies.md)（前端服务依赖相对简单，没有硬凑），但 [CLAUDE.md](http://CLAUDE.md) 里写了别处找不到的信息：

- **工程规模数字**：1648 个文件，907 个 Vue 文件——AI 不需要去数，直接建立规模感

- **路径别名完整映射**：`@hook → src/hooks/index.ts`、`@store → src/store/index.ts`——AI 看到 `import xxx from '@hook'` 知道去哪里找

- **Pinia Store 职责表**：哪个 store 管登录态、哪个管会话——AI 不需要挨个读 store 文件去猜

**核心约束直接命中前端 LLM 最常犯的错**：

- `HTTP 请求统一通过 useAxios from @hook，禁止直接 import axios`——不写出来 AI 必然绕过封装

- `会话上下文通过 useContext inject 获取，禁止跨组件直接读 Store`——组件解耦的架构约定，代码里看不出来是"规定"

##### `**aix-platform-oversea**` / **HCM 领域服务**

**地址**

https://dev.sankuai.com/code/repo-detail/ba-csc/aix-platform-oversea/file/list

**真实条目示例**

HCM（人员全生命周期管理）领域服务，管理海外员工入职、转岗、离职、权限控制和审批流程。

**CLAUDE.md 亮点——严格四层架构约束**（这种分层约束代码里根本看不出来是"规定"）：

```plain text
starter → application → infrastructure → domain
```

- DB 访问必须经过 `infrastructure` 层的 `**MapperService`，禁止 application 层直接注入 Mapper

- 对象转换有三条专用路径：HTTP 层 `VO/Request/Response ↔ BO`、RPC 层 `DTO ↔ BO`、DB 层 `BO ↔ Entity`

- RPC 接口必须幂等，实现必须 try-catch，异常不透传

**知识库索引扩展**：这个工程在六层结构基础上额外加了 `.catpaw/knowledge/` 目录（`business.md` 业务术语、`technical.md` 技术架构），证明了"六层是最小集，可以继续往上叠"这一点。[CLAUDE.md](http://CLAUDE.md) 里维护了完整的知识库索引：

```plain text
→ .catpaw/knowledge/business.md — 业务概览、术语、跨模块流程
→ .catpaw/knowledge/technical.md — 技术架构、模块导航
→ docs/knowledge/issues.md — 历史线上问题
→ docs/specs/ — 需求设计文档
```

##### `**cs-fe-config-i18n**` / **ks-配置台**

**地址**

https://dev.sankuai.com/code/repo-detail/cs-fe/cs-fe-config-i18n/file/list

**真实条目示例**

ks前端配置平台（国际化版），40+ 功能模块，工程规模 1929 文件、12915 符号。

**CLAUDE.md 亮点——超大工程的导航策略**：

工程太大，[CLAUDE.md](http://CLAUDE.md) 开头直接定义了"阅读顺序"：

```plain text
docs/ 里与任务相关的文件 → 对应 src/pages/.../CLAUDE.md（如有）→ 本文件「核心模块/约束」→ 源码
```

这一条本身就是 Harness 提效率的体现——告诉 AI 从哪里开始，而不是让它自己在 1929 个文件里猜。

**核心约束命中配置台特有风险**：

- i18n 数据读写必须通过 `useOverseaData` hook，禁止直接操作 `configJson` / `extendConfig`——不写进来 AI 必然绕过封装

- 命令式弹窗通过 `$mvp.modalForm` 调用，需加 `@ts-expect-error`——类型声明不完整是已知缺陷，不写出来 AI 会反复"修这个 TS 错误"

**cr-checklist 沉淀的规则（2026-04，Angular→Vue 迁移 PR 评审）**：

```plain text
## 2026-04 - 迁移类 PR 区分"迁移引入的新 bug"与"原版本设计选择"
现象：Angular→Vue 迁移 PR，AI 把"原版本就有的 warning 语义"报成 P2，研发驳回
根因：没有区分两类问题的评审视角
预防规则：迁移类 PR 先判断问题是"原版本就有"还是"迁移引入"；
          "原版本就有的设计选择"加备注"若原版本行为一致可忽略"，不标 P1
```

##### `**oversea-csc-assistant-agent-service**`**坐席辅助**

**地址**

https://dev.sankuai.com/code/repo-detail/ba-csc/oversea-csc-assistant-agent-service/file/list

**真实条目示例**

规则引擎驱动的坐席辅助服务，通过 Mafka 事件触发规则，执行 ReactionExecutor，结果通过 Pike 推送给前端坐席工作台。

**CLAUDE.md 亮点——核心链路图**（MQ 驱动架构从代码里推断不出来执行顺序）：

```plain text
Mafka 事件（聊天消息/状态变更/工单 Binlog）
  → MQ Consumer → RuleTriggerService
  → SubRuleProcessNode（规则匹配）
  → ReactionExecutor（预填/预关闭/Friday 调用/文本推送等）
  → AssistSendMessageService → Pike 推送前端
```

**约束命中 MQ 驱动架构的特有风险**：

- ReactionExecutor 异常必须 catch，不允许向上抛，失败时仍返回 SUCCESS——不写出来 AI 修一个 bug 可能导致 MQ 重试死循环

- `actuatorConfig` 存储的是 `SubRuleVO.ActionConfigVO` 的 JSON，反序列化为 `ReactionConfigBO`，两者字段名必须一致——这个隐式约定跨两个类，代码里根本看不出来

- S3 上传禁止使用 CDN 域名（`s3-ap-hongkong.mykeeta.net`），只用 `.com`——一个字母之差，CDN 域名在境外写操作无权限

**ks-raptor 告警分析沉淀（2026-05-08，今日真实案例）**：

```plain text
## 2026-05-08 - AssistAgentModel output_config 为 null 触发 IllegalArgumentException
现象：pageRuleWithModelOutputParam 接口告警，convertEntity2VO 崩溃
根因：DB 中 assist_agent_model id=7 output_config=null，
      JacksonUtil.toList(null, ...) 触发 ObjectMapper._assertNotNull 断言
修复：convertEntity2VO 加 StringUtils.isBlank 保护，用 toListWithEmptyDefault
预防规则：所有从 DB 读取 JSON 字段后反序列化，toList/readValue 前必须判空
```

---

#### 四、境外基于Harness体系开发、排查、评审案例

##### 案例一：`cscagent.base` IllegalArgumentException 告警（2026-05-08）

**告警**：`[P1] com.keetapp.cscoversea.cscagent.base` 代码逻辑异常，`java.lang.IllegalArgumentException`，错误数 2，机器 fra01。

**排查过程****（整个过程 AI 自主完成，不需要人工介入）**：

1. 从 Raptor logview 拉到堆栈：

   ```plain text
   ModelBaseServiceImpl.convertEntity2VO:422
   → JacksonUtil.toList(entity.getOutputConfig(), ...)
   → ObjectMapper._assertNotNull  ← 崩溃点
   ```

2. **关键一跳**：工程的 [CLAUDE.md](http://CLAUDE.md) 里有 `appkey → 本地工程目录` 的映射（来自 `.appkey-registry`），直接定位到 `oversea-csc-assistant-agent-service`。没有这个映射，AI 需要在 30+ 个工程里猜。

3. 读本地代码，确认 `convertEntity2VO` 对 `null` 没有保护，`toList(null, ...)` 触发断言。

4. 查 DB 验证：`assist_agent_model` 表 id=7「开场话术推荐」的 `output_config` 和 `input_config` 字段均为 `null`——数据问题确认。

**根因**：DB 中存在 `output_config=null` 的模型记录，代码没有空值保护。

**Harness 的作用**：

- `.appkey-registry` 里的 appkey→工程映射，让排查从"猜工程"变成"直接定位"

- `oversea-csc-assistant-agent-service` 的 [CLAUDE.md](http://CLAUDE.md) 里有技术栈说明（Zebra 分库信息），让 DB 查询知道查哪个库

**后续沉淀**（应追加到 `docs/knowledge/issues.md`）：

```plain text
## 2026-05-08 - AssistAgentModel output_config 为 null 触发 IllegalArgumentException
现象：pageRuleWithModelOutputParam 接口调用时，convertEntity2VO 崩溃，错误率上升
根因：DB 中 assist_agent_model id=7 的 output_config/input_config 字段为 null，
      JacksonUtil.toList(null, ...) 触发 ObjectMapper._assertNotNull 断言
修复：convertEntity2VO 中加 StringUtils.isBlank 保护，或使用 toListWithEmptyDefault（项目已有用法）
预防规则：所有从 DB 读取 JSON 字符串后反序列化的场景，必须在 toList/readValue 前判空
```

##### `workbench.routerservice` AircraftNoAvailableInterfaceException 告警（2026-04-27）

**告警**：`[P1] com.keetapp.cscoversea.workbench.routerservice`，`AircraftNoAvailableInterfaceException`

**排查过程**：

1. Raptor logview 拿到堆栈：`interfaceId=null&inputParams={}`，Aircraft SDK 在 `acId=null` 时抛异常。

2. **关键一跳**：本地 `oversea-workbench-router` 工程的 [CLAUDE.md](http://CLAUDE.md) 里记录了工程定位——"纯透传层，自身无业务逻辑"。这一句话直接把排查方向从"找本服务 bug"转向"查上游传参"。

3. 读代码，发现 `commonListInvokeForAgentWithCommonParam`（第 138 行）有 null 校验，但 `commonInvoke`、`commonInvokeForAgent`、`commonListInvokeForAgent` 三个接口没有——防御不一致。

4. 定位上游：`com.keetapp.apigw.csp.workbench` 在特定场景下传入了 `acId=null`。

**Harness 的作用**：

- [CLAUDE.md](http://CLAUDE.md) 里"纯透传层"这四个字，让排查少绕了一圈。如果没有这个描述，AI 会在本服务里找业务逻辑 bug，找不到后才会往上游看——多走了一步。

##### 产品需求开发&评审

[代码评审 - sailor-attendance + sailorhcm-schedule - 2026-05-08](https://km.sankuai.com/collabpage/2760779315)

[代码评审 - cs-fe-config-i18n - 2026-04-28](https://km.sankuai.com/collabpage/2759567486)

[代码评审 - oversea-csc-assistant-agent-service - 2026-04-27](https://km.sankuai.com/collabpage/2759593532)

**CR 发现**：某 PR 在 `@Transactional` 方法内直接调用缓存清除，用 `try/catch` 吞掉缓存异常来"保护"事务不回滚。

**表面看没问题**：缓存失败不影响事务，功能是对的。

**根本问题**：缓存操作和 DB 操作耦合在同一方法里，靠 `try/catch` 解耦是坏味道。正确做法是职责分离——缓存清除放到 `afterCommit` 钩子，或由调用方负责，两者各管各的失败。

**Harness 沉淀到规则后的效果**：这条规则进入了 cr-checklist 的通用规则库（`knowledge/global/common.md`），之后所有 Java 工程的 PR 评审都会自动检查这个模式，不需要每次靠人想起来。

##### 技术迁移类 PR 的评审策略

PR  cs-fe/cs-fe-sep-i18n  refactor: cs-all-sdk sep-view-render-sdk移至lib [merged]

[代码评审 - cs-fe-config-i18n - 2026-05-07](https://km.sankuai.com/collabpage/2761121124)

[代码评审 - training-sdk-intl - 2026-05-07](https://km.sankuai.com/collabpage/2760842094)

[代码评审 - cs-fe-config-i18n - 2026-05-08](https://km.sankuai.com/collabpage/2761541977)

**背景**：`cs-fe-config-i18n` 做 Angular → Vue 框架迁移，PR 量大。

**错误的评审方式**：把"原版本就有的设计选择"当成新 bug 报 P2，被研发驳回：

- `全部成功用 Message.warning 语义错误` → 驳回，原版本就是 warning

- `fetchGroupInfo err 分支静默` → 驳回，原逻辑也没有错误提示

**正确的评审方式**：区分两类问题：

- **迁移引入的新 bug**（数据翻倍、行为与原版不一致）→ P1，必须修

- **原版本就有的设计选择**（语义不够准确、错误处理不完善）→ 降级或不提，备注"若原版本行为一致可忽略"

**Harness 沉淀**：这条判断规则进入了 cr-checklist 的迁移类 PR 专项规则，后续遇到迁移 PR 时 AI 会自动切换到正确的评审视角。

##### 案例三：`sailor-attendance` 假期计算 IllegalArgumentException（2026-05-11）

**现象**：`SailorVacationService calculateVacationHours` 抛出 `IllegalArgumentException: "2026-05-15T23:00; 03:00" is malformed at "; 03:00"`，触发降级简单计算，餐点扣除逻辑被跳过。

**根因**：废弃字段 `workTypeTimeMap` 在多段工作安排时为分号拼接格式（如 `"23:00; 03:00"`），Joda-Time 无法解析；vacation 模块未迁移到 `workTypeFullInfoMap`。

**修复**：新增 `buildDiningDurations` 方法，改用 `workTypeFullInfoMap`（`Map<Integer, List<WorkArrangeInfo>>`）；清理 `ArrangeActualStaffClass` 废弃字段（PR #52）。

**Harness 沉淀**（路径③/④）：追加到 `docs/knowledge/issues.md`；废弃字段替代规则固化。

**Harness 如何发挥作用**：`CLAUDE.md` 记录了 `workTypeFullInfoMap` 替代废弃字段的约束，AI 修复时直接定位正确替代方案；`issues.md` 沉淀后，同类废弃字段解析错误不会重复踩坑。

##### 案例四：`sailor-attendance` selectActualClassByBatchSearch 慢查询优化（2026-05-11）

**现象**：Pigeon 接口 `selectActualClassByBatchSearch` 在大量员工/长时间跨度场景下 RT 超标，存在慢查询。

**根因**：SQL 查询在批量场景下未充分利用索引。

**修复**：新增优化版批量查询接口，改造 SQL 查询逻辑（添加复合索引覆盖、拆分查询策略）（PR #52）。

**Harness 沉淀**（路径⑤ CR 评审）：追加到 `docs/knowledge/issues.md`；批量排班查询必须通过 explain 验证走复合索引的防范规则已固化。

**Harness 如何发挥作用**：`docs/knowledge/issues.md` 中记录了慢查询防范规则（`explain` 验证复合索引），AI 在后续新增同类查询时会自动提示验证；知识库积累后，同类性能问题不需要重新分析。

---

#### 五、Harness 自进化分两个层面：随排查及开发随pr提交（保鲜）+cr-checklist/ks-raptor （提召）

**研发侧遵循**[境外工程Harness 运营 SOP：让 AI 上下文保持鲜活](https://km.sankuai.com/collabpage/2758323328)**里的五条触发路径，在每次完成事项后判断是否需要更新 Harness：**

| 触发时机 | 动作 |
| --- | --- |
| 上线新需求 | `docs/specs/` 写设计文档；接口/依赖有变更 → 更新 `dependencies.md` |
| 排查 Raptor 告警 | 根因确认后追加到 `docs/knowledge/issues.md`；反复出现升为 `CLAUDE.md` 约束 |
| 坐席反馈 bug 修复 | 改了代码就写 `issues.md`；发现边界约束 → `CLAUDE.md` |
| CR 评审发现坏味道 | 工程特有问题 → `issues.md`；编码约束/设计决策 → `CLAUDE.md` |
| 每周质量报告 | 高频问题升级为约束；低频已修复的约束及时从 `CLAUDE.md` 删除（保持精简） |

**核心原则**：研发维护的是"AI 不知道的那部分"是否准确、是否实时。上周还是正确的约束，这周产品需求变了就要更新，否则 AI 会按过时的规则做事。Harness 不是一次性写完就锁门的文档，它应该随着每次 CR 评审、每次告警排查自动生长。

**cr-checklist + ks-raptor 回溯提升召回率，进化逻辑：每次漏报都是一次改进机会。**

cr-checklist：每次评审结束后，AI 不只是输出评论，还会检查 Harness 是否需要更新。研发接受了某条评审意见，就意味着这条规则值得固化；研发驳回了，AI 要理解为什么（是误判还是工程特有行为），下次调整判断

ks-raptor：每次告警排查完，输出根因分析报告，报告格式直接对应 `issues.md` 的追加格式。告警沉淀进 `issues.md` 后，下次同类告警 AI 直接命中，不需要重新走一遍排查链路。

每次 P1/P2 告警排查结束后，ks-raptor skill 的最后一步是输出根因分析报告，报告里的"修复建议"和"需进一步确认"直接对应 `issues.md` 的追加格式：

两者加在一起，形成一个**召回率持续提升的飞轮**：

1. 告警/PR 发生 → AI 排查/评审

2. 结果沉淀进 Harness

3. 下次 AI 读到 Harness，命中率更高

4. 漏掉的问题被研发补充（[issues.md](http://issues.md)）

这个飞轮的前提是 Harness 真的被读到，所以 `CLAUDE.md` 的索引指针不能缺。

- CR 评审 → 发现编码坏味道 → 沉淀到 `issues.md` + `CLAUDE.md` 约束

- 告警排查 → 定位根因 → 沉淀到 `issues.md` + 必要时升级为 `CLAUDE.md` 约束

- 每次都有新东西进来，AI 下次处理同类问题时直接命中

这就是 Harness 和普通 wiki 的本质区别：**wiki 是写给人看的，Harness 是让 AI 每次进工程自动读取的活体知识库。**

---

#### 附录：境外全量 AppKey 索引

> 数据来源：本地 `.appkey-registry/project_git_info.md`，最后更新：2026-04-20，共 106 个 appkey，73 个 repo

BFF

| appkey | 服务描述 | Git |
| --- | --- | --- |
| com.keetapp.cscoversea.workbench.bff | 工作台 BFF，聚合领域服务 | [csc-oversea-workbench-bff](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-workbench-bff) |
| com.keetapp.cscoversea.workbench.routerservice | 工作台流量转发肉机 | [oversea-workbench-router](https://git.sankuai.com/projects/ba-csc/repos/oversea-workbench-router) |

坐席辅助

| appkey | 服务描述 | Git |
| --- | --- | --- |
| com.keetapp.cscoversea.cscagent.base | 坐席辅助基础服务 | [oversea-csc-assistant-agent-service](https://git.sankuai.com/projects/ba-csc/repos/oversea-csc-assistant-agent-service) |
| com.keetapp.cscoversea.playground.service | 研发提效工具 | [csc-oversea-playground](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-playground) |

工具箱

| appkey | 服务描述 | Git |
| --- | --- | --- |
| com.keetapp.cscoversea.caseaction.service | 工单动作执行引擎 | [oversea-csc-pacific-case-flow](https://git.sankuai.com/projects/ba-csc/repos/oversea-csc-pacific-case-flow) |
| com.keetapp.cscoversea.caseflow.service | 工具箱通用接口 | [oversea-csc-pacific-case-flow](https://git.sankuai.com/projects/ba-csc/repos/oversea-csc-pacific-case-flow) |
| com.keetapp.cscoversea.toolbox.config | 工具箱配置台 | [oversea-csc-pacific-case-flow](https://git.sankuai.com/projects/ba-csc/repos/oversea-csc-pacific-case-flow) |

工单

| appkey | 服务描述 | Git |
| --- | --- | --- |
| com.keetapp.cscoversea.casebase.service | 工单存储/查询基础服务 | [csc-oversea-pacific-casebase-domain](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-pacific-casebase-domain) |
| com.keetapp.cscoversea.casebase.facade | 工单域门面服务 | [csc-oversea-pacific-casebase-domain](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-pacific-casebase-domain) |
| com.keetapp.cscoversea.casebase.datacenter | 工单数据查询 | [csc-oversea-pacific-casebase-domain](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-pacific-casebase-domain) |
| com.keetapp.cscoversea.casebase.extend | 工单扩展功能 | [csc-oversea-pacific-casebase-domain](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-pacific-casebase-domain) |
| com.keetapp.cscoversea.casebase.task | 工单导出服务 | [csc-oversea-pacific-casebase-domain](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-pacific-casebase-domain) |
| com.keetapp.cscoversea.casebase.flow | 流程/节点/按钮 | [oversea-csc-pacific-casebase-flow](https://git.sankuai.com/projects/ba-csc/repos/oversea-csc-pacific-casebase-flow) |
| com.keetapp.cscoversea.caseproxy.service | 工单对外接口 | [oversea-csc-pacific-proxy](https://git.sankuai.com/projects/ba-csc/repos/oversea-csc-pacific-proxy) |
| com.keetapp.cscoversea.casebase.async | 消息/定时触发 | [oversea-csc-pacific-casebase-async](https://git.sankuai.com/projects/ba-csc/repos/oversea-csc-pacific-casebase-async) |
| com.keetapp.cscoversea.case.configweb | 工单配置台 | [csc-oversea-case-config-web](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-case-config-web) |
| com.keetapp.cscoversea.casebase.allocate | 工单智能分单接入 | [oversea-csc-pacific-casebase-allocate](https://git.sankuai.com/projects/ba-csc/repos/oversea-csc-pacific-casebase-allocate) |
| com.keetapp.cscoversea.watchkeeper | 工单值班提效 | [oversea-csc-pacific-watchkeeper](https://git.sankuai.com/projects/ba-csc/repos/oversea-csc-pacific-watchkeeper) |

分单

| appkey | 服务描述 | Git |
| --- | --- | --- |
| com.keetapp.sepdds.buffer | 分单缓冲层 | [oversea-sep-dds](https://git.sankuai.com/projects/ba-csc/repos/oversea-sep-dds) |
| com.keetapp.sepdds.distribution | 工单智能分配核心 | [oversea-sep-dds](https://git.sankuai.com/projects/ba-csc/repos/oversea-sep-dds) |
| com.keetapp.sepdds.config | 分单配置中心 | [oversea-sep-dds](https://git.sankuai.com/projects/ba-csc/repos/oversea-sep-dds) |
| com.keetapp.sepdds.access | 分单接入层 | [oversea-sep-dds](https://git.sankuai.com/projects/ba-csc/repos/oversea-sep-dds) |
| com.keetapp.sepdds.monitor | 分单监控层 | [oversea-sep-dds](https://git.sankuai.com/projects/ba-csc/repos/oversea-sep-dds) |
| [com.keetapp.cscpacific.allocate.web](http://com.keetapp.cscpacific.allocate.web) | 分单工作台网关 | [oversea-sep-dds](https://git.sankuai.com/projects/ba-csc/repos/oversea-sep-dds) |

联络

| appkey | 服务描述 | Git |
| --- | --- | --- |
| com.keetapp.cscoversea.contact.message | 邮件/短信/消息触达 | [csc-oversea-pacific-contact-message](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-pacific-contact-message) |
| com.keetapp.cscoversea.contact.facade | 进线/电话相关 | [csc-oversea-pacific-contact](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-pacific-contact) |
| com.keetapp.cscoversea.contact.chatfacade | 会话/电话随路数据 | [csc-oversea-pacific-contact](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-pacific-contact) |
| [com.keetapp.cscoversea.contact.mq](http://com.keetapp.cscoversea.contact.mq) | 监听海豚/热线消息 | [csc-oversea-pacific-contact](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-pacific-contact) |
| com.keetapp.cscoversea.contact.cscmessage | 短信/邮件/push 通道 | [csc-oversea-message](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-message) |
| com.keetapp.cscoversea.contact.calloutfacade | 外呼平台 | [csc-oversea-pacific-callout](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-pacific-callout) |
| com.keetapp.cscoversea.contact.transfer | 转接服务 | [csc-oversea-pacific-contact-transfer](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-pacific-contact-transfer) |
| com.keetapp.cscoversea.uploadvoucher.facade | 凭证附件 | [csc-oversea-pacific-uploadvoucher](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-pacific-uploadvoucher) |

HCM

| appkey | 服务描述 | Git |
| --- | --- | --- |
| com.keetapp.aix.platform | CoreHCM 配置服务 | [aix-platform-oversea](https://git.sankuai.com/projects/ba-csc/repos/aix-platform-oversea) |
| com.keetapp.sailorhcm.staff.api | CoreHCM 人员查询 | [sailorhcm-staff](https://git.sankuai.com/projects/ba-csc/repos/sailorhcm-staff) |
| [com.keetapp.sailorhcm.schedule.web](http://com.keetapp.sailorhcm.schedule.web) | 排班配置 | [sailorhcm-schedule](https://git.sankuai.com/projects/ba-csc/repos/sailorhcm-schedule) |
| com.keetapp.sailorhcm.schedule.api | 排班接口 | [sailorhcm-schedule](https://git.sankuai.com/projects/ba-csc/repos/sailorhcm-schedule) |
| com.keetapp.sailorhcm.config.api | 资源接口 | [sailorhcm-config](https://git.sankuai.com/projects/ba-csc/repos/sailorhcm-config) |
| [com.keetapp.sailorhcm.config.web](http://com.keetapp.sailorhcm.config.web) | 资源配置 | [sailorhcm-config](https://git.sankuai.com/projects/ba-csc/repos/sailorhcm-config) |
| [com.keetapp.sailorhcm.attendance.web](http://com.keetapp.sailorhcm.attendance.web) | 考勤服务 | [sailor-attendance](https://git.sankuai.com/projects/ba-csc/repos/sailor-attendance) |

规则引擎

| appkey | 服务描述 | Git |
| --- | --- | --- |
| com.keetapp.cscoversea.solution.service | 统一规则中心 | [csc-oversea-solution](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-solution) |
| com.keetapp.cscoversea.solution.configservice | 规则中心配置台 | [csc-oversea-solution](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-solution) |

路由

| appkey | 服务描述 | Git |
| --- | --- | --- |
| com.keetapp.cscoversea.routingconfig | 路由策略配置台 | [csc-oversea-routing-config](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-routing-config) |
| com.keetapp.cscoversea.skillrouting | 技能组路由 | [csc-oversea-skill-routing](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-skill-routing) |
| com.keetapp.cscoversea.routinggateway | 路由网关 | [csc-oversea-routing-gateway](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-routing-gateway) |
| com.keetapp.cscoversea.routingtag | 路由特征 | [csc-oversea-routing-tag](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-routing-tag) |

星脉

| appkey | 服务描述 | Git |
| --- | --- | --- |
| com.keetapp.cscaircraft.service | 智能客服平台运行时 | [csc-oversea-aircraft](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-aircraft) |
| com.keetapp.cscaircraft.keemart.routerservice | keemart 业务肉机 | [csc-oversea-aircraft-router](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-aircraft-router) |
| com.keetapp.cscaircraft.keefood.routerservice | keefood 业务肉机 | [csc-oversea-aircraft-router](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-aircraft-router) |
| com.keetapp.cscoversea.aircrafttob.service | 星脉 TOB 适配层 | [csc-oversea-aircraft-tob-adapter-service](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-aircraft-tob-adapter-service) |
| com.keetapp.velar.service | 星脉信息管理运行时 | [csc-oversea-velar](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-velar) |
| [com.keetapp.velar.web](http://com.keetapp.velar.web) | 星脉信息管理配置台 | [csc-oversea-velar](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-velar) |
| com.keetapp.cscpacific.dtc.service | DTC 数据对象 RPC | [csc-oversea-dtc](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-dtc) |
| [com.keetapp.cscpacific.config.web](http://com.keetapp.cscpacific.config.web) | DTC 配置台 | [csc-oversea-dtc](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-dtc) |

海豚

| appkey | 服务描述 | Git |
| --- | --- | --- |
| com.keetapp.haitunoversea.kefu.service | 海豚客服侧 RPC | [csc-oversea-haitun](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-haitun) |
| com.keetapp.haitunoversea.service | 海豚用户侧 | [csc-oversea-haitun](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-haitun) |
| com.keetapp.haitunoversea.push.service | 海豚长链推送 | [csc-oversea-haitun](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-haitun) |
| com.keetapp.haitunoversea.event.service | 海豚事件注册/发布 | [csc-oversea-haitun](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-haitun) |
| com.keetapp.haitunoversea.case.service | 海豚工单对接 | [csc-oversea-haitun](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-haitun) |
| com.keetapp.haitunoversea.config.service | 海豚配置台 Pigeon | [csc-oversea-haitun](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-haitun) |
| com.keetapp.haitunoversea.allocate.service | 在线客服分配 | [csc-oversea-haitun](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-haitun) |
| [com.keetapp.haitunoversea.config.web](http://com.keetapp.haitunoversea.config.web) | 海豚配置后台 | [csc-oversea-haitun-config-web](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-haitun-config-web) |
| [com.keetapp.haitunoversea.kefu.web](http://com.keetapp.haitunoversea.kefu.web) | 海豚客服侧 Web | [csc-oversea-haitun-kefu-web](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-haitun-kefu-web) |
| com.keetapp.haitunoversea.report.data | 海豚报表数据计算 | [csc-oversea-haitun-report](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-haitun-report) |

搜推 / 知识库 / 组件 / 上下文

| appkey | 服务描述 | Git |
| --- | --- | --- |
| com.keetapp.cscoversea.efficiency.service | 搜推服务 | [csc-oversea-pacific-efficiency](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-pacific-efficiency) |
| com.keetapp.cscoversea.efficiency.configservice | 搜推配置台 | [csc-oversea-pacific-efficiency](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-pacific-efficiency) |
| com.keetapp.cscoversea.knowledge.service | 知识库 | [csc-oversea-pacific-knowledge](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-pacific-knowledge) |
| com.keetapp.cscoversea.knowledge.config | 知识库配置台 | [csc-oversea-pacific-knowledge](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-pacific-knowledge) |
| com.keetapp.cscoversea.component.service | 组件渲染/执行 | [csc-oversea-pacific-component](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-pacific-component) |
| com.keetapp.cscoversea.context.service | 工作台基础数据 | [csc-oversea-pacific-context](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-pacific-context) |
| com.keetapp.cscoversea.serviceinfo.service | 服务轨迹 | [csc-oversea-pacific-service-info](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-pacific-service-info) |
| com.keetapp.cscoversea.draft | 草稿服务 | [csc-oversea-pacific-draft](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-pacific-draft) |

人员 / 权限 / 技能组 / 因子

| appkey | 服务描述 | Git |
| --- | --- | --- |
| com.keetapp.cscoversea.staff.core | 人员核心服务 | [csc-oversea-pacific-staff](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-pacific-staff) |
| com.keetapp.cscoversea.staff.facade | 员工/部门/角色查询 | [csc-oversea-pacific-staff](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-pacific-staff) |
| com.keetapp.cscoversea.staff.config | 人员域配置台 | [csc-oversea-staff-config-web](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-staff-config-web) |
| com.keetapp.cscoversea.guardconfig.service | 权限系统 | [csc-oversea-pacific-guard](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-pacific-guard) |
| com.keetapp.cscoversea.skill.config | 技能组查询 | [csc-oversea-pacific-skill-config](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-pacific-skill-config) |
| [com.keetapp.cscoversea.skill.web](http://com.keetapp.cscoversea.skill.web) | 技能域配置台 | [csc-oversea-skill-web](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-skill-web) |
| com.keetapp.cscoversea.param.service | 因子运行时 | [csc-oversea-param](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-param) |
| com.keetapp.cscoversea.param.configservice | 因子配置台 | [csc-oversea-param](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-param) |

赔付 / 脱敏 / 调度 / 质检

| appkey | 服务描述 | Git |
| --- | --- | --- |
| com.keetapp.cscoversea.facade.refund | 赔付 facade | [oversea-csc-pacific-refund](https://git.sankuai.com/projects/ba-csc/repos/oversea-csc-pacific-refund) |
| com.keetapp.cscoversea.finance.service | 财务系统 | [oversea-csc-finance](https://git.sankuai.com/projects/ba-csc/repos/oversea-csc-finance) |
| com.keetapp.cscoversea.finance.config | 财务配置台 | [oversea-csc-finance](https://git.sankuai.com/projects/ba-csc/repos/oversea-csc-finance) |
| com.keetapp.cscoversea.security.service | 风控脱敏 | [csc-security](https://git.sankuai.com/projects/ba-csc/repos/csc-security) |
| [com.keetapp.cscoversea.security.web](http://com.keetapp.cscoversea.security.web) | 脱敏配置台 | [csc-security](https://git.sankuai.com/projects/ba-csc/repos/csc-security) |
| com.keetapp.cscoversea.bffsecurity.service | 出海脱敏 | [csc-oversea-security](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-security) |
| com.keetapp.csccratos.realtime | 生产力实时调度 | [csc-oversea-cratos](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-cratos) |
| com.keetapp.cscoversea.hare.workbench | 质检工作台 | [hare-keetapp-workbench](https://git.sankuai.com/projects/ba-csc/repos/hare-keetapp-workbench) |
| com.keetapp.cscoversea.hare.schedule | 质检定时调度 | [hare-keetapp-schedule](https://git.sankuai.com/projects/ba-csc/repos/hare-keetapp-schedule) |
| com.keetapp.cscoversea.hare.configweb | 质检配置台 | [hare-keetapp-configweb](https://git.sankuai.com/projects/ba-csc/repos/hare-keetapp-configweb) |

FAQ / 培训

| appkey | 服务描述 | Git |
| --- | --- | --- |
| com.keetapp.cscfaq.service | FAQ 运行时 | [csc-faq-sailor](https://git.sankuai.com/projects/ba-csc/repos/csc-faq-sailor) |
| com.keetapp.cscfaq.configservice | FAQ 配置时 | [csc-faq-sailor](https://git.sankuai.com/projects/ba-csc/repos/csc-faq-sailor) |
| com.keetapp.cscfaq.configweb | FAQ 配置 Web | [csc-faq-sailor](https://git.sankuai.com/projects/ba-csc/repos/csc-faq-sailor) |
| com.keetapp.beginning.asset | 培训 asset 管理 | [beginning-asset-oversea](https://git.sankuai.com/projects/ba-csc/repos/beginning-asset-oversea) |
| com.keetapp.beginning.learning | 培训 C 端 | [beginning-learning-oversea](https://git.sankuai.com/projects/ba-csc/repos/beginning-learning-oversea) |
| com.keetapp.beginning.admin | 培训管理系统 | [beginning-admin-oversea](https://git.sankuai.com/projects/ba-csc/repos/beginning-admin-oversea) |
| com.keetapp.beginning.policy | 培训调度中心 | [beginning-policy-oversea](https://git.sankuai.com/projects/ba-csc/repos/beginning-policy-oversea) |
| com.keetapp.beginning.call | 培训外呼 | [beginning-call-oversea](https://git.sankuai.com/projects/ba-csc/repos/beginning-call-oversea) |
| com.keetapp.cscoversea.septrain.service | 客服训练系统 | [csc-oversea-sep-train](https://git.sankuai.com/projects/ba-csc/repos/csc-oversea-sep-train) |

> SSH clone 路径：`ssh://git@git.sankuai.com/<group>/<repo>.git`，直接替换上表中的 group/repo 即可。

---

> 延伸阅读：
> [境外工程 Harness 建设指南](https://km.sankuai.com/collabpage/2757488473)
> [境外工程Harness 运营 SOP：让 AI 上下文保持鲜活](https://km.sankuai.com/collabpage/2758323328)
