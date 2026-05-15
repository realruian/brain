# 境外工程 Harness 建设指南

> 本文档面向境外 CSC 研发团队，说明如何为 ~/keetapp_projects/ 下的工程建立 AI 协作上下文（Harness），让 Claude Code 每次进入工程时都能快速定位、准确作业。

## 一、为什么要建 Harness

境外工程有几个特点，让 AI 协作的上下文成本特别高：

1. **工程数量多、模块分散**：30+ 个 repo，跨工单、联络、赔付、路由、分单、知识、工具箱、搜推、HCM、培训等十几个业务域
    
2. **多 appkey 工程普遍**：一个 repo 下挂 3-5 个 appkey（如 oversea-sep-dds 含 access/config/buffer/distribution/monitor），每个 appkey 有独立的上下游、MQ、DB
    
3. **跨工程依赖复杂**：多个工程共享同一张 DB 表（如 `cscrouting` 库被路由域和分单域共用），排查问题时容易漏掉上下游
    
4. **中间件配置分散**：Pigeon RPC、Mafka MQ、Zebra DB、Squirrel 缓存、Lion 配置——每次 AI 协作都要重新交代一遍
    

Harness 的目标：**一次建设，每次进入工程零交代**。

## 二、整体结构

每个工程建立六层结构，按需加载：

```
repo 根目录/
├── CLAUDE.md                        # 层1：工程地图（60行为宜，≤80行）
├── CONTRIBUTING.md                  # AI + 人类协作规范
├── .claude/
│   └── hooks-template.json          # 编译检查 Hook 模板
└── docs/
    ├── dependencies.md              # 层3：上下游依赖全景（多模块工程必建）
    ├── specs/
    │   └── TEMPLATE.md              # 层4：需求设计文档模板
    ├── knowledge/
    │   └── issues.md                # 层5：历史线上问题知识库
    ├── tests/
    │   └── cases.md                 # 层6：核心回归测试场景
    ├── <module>-mq.md               # MQ topic > 3 时拆出（带模块前缀）
    └── <module>-db.md               # DB 数据源 > 1 时拆出（带模块前缀）
```

多模块工程（多 appkey）还需要在各模块子目录下建模块级 CLAUDE.md：
```
<module>/
└── CLAUDE.md    # 层2：单模块职责、存储/MQ 指针、模块约束
```

## 三、CLAUDE.md 写法原则

**CLAUDE.md 是"地图"不是"说明书"**，给方向感和关键约束，不把每步都写死。

- 60 行为宜，≤80 行为上限
    
- 四要素：工程简介 / 技术栈 / 核心约束 / 禁止事项
    
- 有历史评审记录时，加"已知高频风险"章节
    
- 存储/MQ 超过阈值时，只留一行指针，详情外置到独立文件
    

**单模块工程示例（csc-oversea-workbench-bff）：**

```
# csc-oversea-workbench-bff

## 工程简介
境外工单坐席工作台 BFF 层，聚合工单、联络、赔付等域接口，
服务前端（workbench-fe）和移动端，下游依赖 20+ 个 Pigeon 服务。

## 技术栈
- Java 8 + MDP + Spring Boot
- RPC：Pigeon Client（纯消费方，无 Server）
- 存储：Squirrel（双 Redis 集群）
- 配置：Lion

## 核心约束
- 所有 Pigeon 调用必须设超时，默认 500ms，批量接口 1000ms
- CompletableFuture 并发调用必须用 MtContextCallable 传递 TraceId
- 接口响应不允许直接透传下游异常，统一包装为 BizException

## 禁止事项
- 禁止在 BFF 层写业务逻辑，只做聚合和转换
- 禁止日志打印 token / password / 手机号
```

**多模块工程根目录 CLAUDE.md 示例（oversea-sep-dds）：**

```
# oversea-sep-dds

## 工程简介
境外工单分单引擎，负责工单在坐席间的路由分配。
5 个模块：access（入口）/ config（配置）/ buffer（缓冲队列）/ distribution（分配核心）/ monitor（监控）

## 模块索引
| 模块 | appkey | 职责 |
|------|--------|------|
| access | sepdds.access | 接收工单分单请求，写入缓冲队列 |
| config | sepdds.config | 管理坐席技能组、班次等配置 |
| buffer | sepdds.buffer | 缓冲队列，削峰填谷 |
| distribution | sepdds.distribution | 核心分单逻辑，匹配坐席 |
| monitor | sepdds.monitor | 监控分单延迟、坐席负载 |

## 技术栈
- Java 8 + MDP + Pigeon RPC + Mafka MQ + Zebra DB + Squirrel

## 全局约束
- 分单核心链路（distribution）延迟 P99 ≤ 200ms，变更前必须压测
- 跨模块调用只能通过 Pigeon，禁止直接操作其他模块的 DB

## 存储 & MQ
→ MQ topic 详情见 `docs/sepdds-mq.md`（8 Producer，8 Consumer）
→ DB 详情见各模块 CLAUDE.md
```

---

## 四、docs/dependencies.md 写法

多模块工程必建，单模块工程视上下游复杂度决定是否建。

**核心章节：**

```
# <工程名> 依赖全景

## 上游调用方（谁调我）
| 调用方 appkey | 接口 | QPS（P99） | 说明 |
|--------------|------|-----------|------|

## 下游依赖（我调谁）
| 依赖 appkey | 接口 | 超时配置 | 说明 |
|------------|------|---------|------|

## 中间件
| 类型 | 集群/实例 | 用途 |
|------|---------|------|
| Zebra DB | xxx | |
| Squirrel | xxx | |
| Mafka | xxx | |
| Lion | xxx | |

## 跨工程共享 DB 表
| DB 库 | 表名 | 共享方 | 说明 |
|-------|------|-------|------|
```

> **为什么要单独列"跨工程共享 DB 表"**：境外工程中存在多个工程共用同一张表的情况（如路由域和分单域共用 cscrouting 库的部分表）。AI 在生成 SQL 变更或分析数据异常时，如果不知道有其他工程也在写这张表，很容易产生误判。这一章节是排查跨工程数据问题的第一入口。

## 五、MQ / DB 拆分规则

|条件|操作|
|---|---|
|单模块 MQ topic（Producer + Consumer）合计 > 3 个|拆出 `docs/<module>-mq.md`|
|单模块 DB 数据源 > 1 个（多个 jdbcRef，或含 ES/Squirrel 需详细说明）|拆出 `docs/<module>-db.md`|

CLAUDE.md 中只留一行指针：

```
→ MQ topic 详情见 `docs/haitun-mq.md`（10 Producer，10 Consumer）
```

**已拆分的工程清单（供参考）：**

|工程|拆分文件|
|---|---|
|oversea-sep-dds|docs/sepdds-mq.md|
|csc-oversea-haitun|docs/haitun-mq.md|
|aix-platform-oversea|docs/aix-platform-mq.md|
|oversea-csc-pacific-refund|docs/refund-mq.md|
|csc-oversea-pacific-staff|docs/staff-core-mq.md|

---

## 六、如何初始化一个新工程

### 方式一：用 harness-init skill（推荐）

在 Claude Code 中说：

```
帮我初始化 harness，工程路径：~/keetapp_projects/<repo名>
```

Claude 会自动扫描技术栈、读取已有 README、生成所有文件。

### 方式二：结合 wiki 数据初始化（上下游信息更准确）

境外工程的上下游信息在 wiki 中有维护（到 appkey 粒度的叶子节点），包含：

- 服务提供接口及 QPS
    
- 上游调用方汇总
    
- 下游依赖汇总
    
- ITU 依赖
    

初始化时建议先读 wiki appkey 页面-全appky扫描：[20260416](https://km.sankuai.com/collabpage/2757672426)，再结合代码扫描，生成的 dependencies.md 会更准确。

---

## 七、维护原则

Harness 是活的系统，不是一次性文档。

|时机|操作|
|---|---|
|上线新需求|在 `docs/specs/` 下新建设计文档|
|出现线上问题|根因分析后，追加到 `docs/knowledge/issues.md`|
|发现 CLAUDE.md 约束不准确|直接修改，加一条规则或删一条低频规则|
|新增 MQ topic / DB 数据源|更新对应的 `docs/<module>-mq.md` / `docs/<module>-db.md`|
|代码评审发现高频问题|评审结束后沉淀到 `docs/knowledge/issues.md` 的"已知高频风险"章节|

**精简原则**：CLAUDE.md 超过 80 行时，检查哪些约束是低频的、已被修复的，及时删除。越长遵循率越低。

## 八、常见问题

**Q：CLAUDE.md 和 README.md 有什么区别？**

README.md 面向人类，说明如何部署和运行工程。CLAUDE.md 面向 AI，说明工程的核心约束和禁止事项。两者共存，不替代。

**Q：多模块工程，根目录 CLAUDE.md 和模块 CLAUDE.md 分别写什么？**

根目录：工程简介、模块索引表、全局约束（跨模块都适用的规则）。 模块目录：该模块的职责、存储/MQ 指针、模块特有约束。 不要把所有规则都堆在根目录，Claude Code 会逐层合并加载。

**Q：docs/knowledge/issues.md 初始化时是空的，有什么意义？**

文件存在本身就是信号——AI 每次进入工程时会尝试读取，知道"这里有历史问题记录可以查"。有了第一条记录后，后续评审和排查的积累会越来越有价值。

**Q：hooks-template.json 是什么，需要配置吗？**

它是一个编译自动检查的 Hook 模板。配置后，每次 AI 修改 Java 文件，Claude Code 会自动跑 `mvn compile` 检查编译错误。不是必须的，但能有效减少 AI 改出编译错误的情况。合并到 `~/.claude/settings.json` 后生效。