#### 一、为什么需要 Harness：你要把AI 当成一个鲜活的人

你把一个工程交给一个新人，他能知道什么？他能读懂代码结构——类之间的调用关系、方法的实现逻辑。_这是代码本身能告诉他的_。

**他不知道的是：**这个服务的上游是谁、下游依赖哪些服务、用了哪些中间件、历史上踩过哪些坑、最近有没有重要的设计决策。_这些东西不在代码里，只存在于老人的脑子里_。

**Harness 维护的：****就是 AI 从代码中推断不出来的那部分****。**更精确地说，Harness 有两层价值：

- **补盲区**：AI 拿到代码之后仍然不知道的东西——跨工程依赖、中间件约定、历史 badcase、产品边界；
    
- **提效率**：帮 AI 快速找到它原本能找到但要费时间的东西——哪个模块最重要、从哪里开始看；
    

---

#### 二、Harness结构回顾

每个工程的 Harness 由六层组成，按需加载：

```
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

**六层是基础样板，不是死板约束。**_本质逻辑只有两条：补盲区 + 提效率_。六层结构是对大多数工程都适用的最小集，但每个工程可以按需往上叠：

- **问题排查路径**：如果你的服务有固定的排查 SOP（比如告警必查哪几个 Raptor 面板、logcenter 关键词是什么），可以直接写进 `docs/knowledge/runbook.md`，甚至把常用排查命令固化成工程专属 skill 放进 `.claude/skills/`
    
- **中间件配置速查**：Lion 开关列表、Squirrel key 模板、Mafka topic 清单，如果工程里中间件很重，单独拆出来比塞进 [CLAUDE.md](http://CLAUDE.md) 更好用
    
- **任何你发现 AI 反复要问的东西**，都值得加进来
    

**最重要的一点：新增任何文档，都必须在 CLAUDE.md 里维护好索引指针**（一行：`→ 排查 SOP 见 docs/knowledge/runbook.md`）。没有索引，AI 不知道这个文件存在，等于没写。

---
#### 三、境外工程案例

