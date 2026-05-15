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
