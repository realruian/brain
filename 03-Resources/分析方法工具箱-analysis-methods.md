# 分析方法工具箱

整理自 2026-04-21 讨论。不是所有方法都写进 CLAUDE.md——只有 top-down 作工作风格进了（因为高频影响切入角度）。其他方法更像工具箱，按场景选用。

## 按"分析面"分族

| 族 | 解决什么 | 何时用 |
|---|---|---|
| 方向 | 从哪层起步（forward） | 定框架 |
| 倒推 | 从结果/目标反推（backward） | 诊断 / 规划 |
| 根因 | 追到底层 | debug / retro / 突破 |
| 分解 | 怎么拆问题 | 确保覆盖无重 |
| 对比 | 多选一怎么选 | 决策 |
| 假设驱动 | 如何验证 | 实验 |
| 逆向 | 从相反角度 | 打破盲点 |

## 方向族

### Top-down
从结构/约束/目标往细节下沉。设计、策略、多维分析最适合。
已进 CLAUDE.md 规则："For complex analysis, go top-down..."

### Bottom-up（pattern emergence）
从数据/实例里浮现模式。调试、retro、归纳、创意发散。
今天 panel retro 就用这个——如果一上来按"失败/成功/建议"套，会漏了"同 topic 重试簇"这种浮现信号。

**Top-down 和 bottom-up 互补**，不是对立。很多问题要来回切：先 top-down 定框架 → 遇到结构不匹配 → 降到 bottom-up 看数据 → 再 top-down 合成。

## 倒推族（从结果/目标反向推）

和"逆向族（换角度）"不同：倒推族是**从已知的结果或目标，反向推出原因或路径**。

### Abduction（溯因推理）
观察到结果 → 推测最可能的原因 → 验证。产出是"最佳解释假说"，不保真。

**和归纳的区别**：归纳从 N 个案例推 universal，abduction 从 1 个结果推 explanation。

**典型动作**：
1. **列多个可能因**（不锁定第一个想到的）
2. **按先验 likelihood + 符合证据程度排序**
3. **设计"区分性测试"验证**（能区分候选原因的实验/查证）

**例**：
- Phase 3B 实验 Pearson=1.000 → 可能因：prompt 刻划缺陷 / 乐观饱和 / 样本小 → 用 GPT 同 prompt 对照排除"prompt 缺陷"
- Panel retro 10 条 null outcome → 可能因：retry 簇 / subagent loop / 用户忘标 → 检查 topic 相似度和时间分布定位到 retry 簇
- Debug LLM 空响应 → 可能因：gateway 问题 / prompt 过长 / model deprecated → 查日志 + 换 model 验证

### Backward chaining（反向链 / Working backwards）
目标 → 倒推前置条件 → 层层回到当前状态。产出是"从当前到目标的行动链"。

**和 top-down 的区别**：top-down 并行分解（G = A + B + C，A/B/C 独立互补），backward chaining 串行倒推（G ← W ← V ← U，每步是前一步的直接前置）。

**典型动作**：
1. **写下目标的可验证状态**（"V5 ship" 太虚；"GPT+Sonnet+原子 rubric 在 prod 跑通且 false-pass=0" 可验证）
2. **问"达到它的前一步必须是什么"**
3. **递归问直到现有状态**——最后一步就是下周要做的事

**例**：
- Sprint 规划：V3 ship → 需要 pilot pass → 需要 prompt 定稿 → 需要 evaluation spec
- Amazon "working backwards"：先写 press release / 用户体验 → 推回所需 feature → 推回所需 infra
- 业务目标倒推：全年 KPI → 季度 milestone → 本月关键动作 → 本周行动

## 根因族

### 5 Whys
连问 5 层为什么，追到机制层而非 symptom 层。

例链：
- 为什么 LLM reviewer 打高分？→ 乐观 baseline
- → 为什么 bias？→ RLHF helpfulness
- → 为什么 prompt 层修不了？→ RLHF 是训练层 artifact
- → 必须架构层解（atomic rubric decomposition）

### Mechanism vs Symptom 区分
看到问题先问："这是 symptom 还是 mechanism？" 修 symptom 是 band-aid。
例：我曾建议"同 topic 簇合并 outcome"——用户按住"这是 symptom band-aid，真 root cause 在 MCP 层去重"。

### First-principles（第一性原理）
剥离到公理层，重建推理。和 5 Whys 不同——5 Whys 追因果链，first-principles **质疑当前框架本身**。机制上是"一次 bottom-up（推到公理）+ 一次 top-down（从公理重建）"。

**何时触发**：增量改进撞墙，或觉得"这事的前提假设可能就错了"。

**典型动作**：
1. 列出当前方案的所有"约束"
2. 每条问"这是物理/逻辑定律，还是历史惯例？"
3. 把历史惯例的约束划掉，基于真正的公理重建

**例**：ScriptReview v2 Phase 3B → V5 方向转换
- Phase 3B 用 prompt-layer 干预（top-down on "prompt frame"）撞天花板
- 退回公理层："乐观饱和是 **RLHF 训练层 artifact**，不是 prompt bug"
- 重建："那 single-call 架构本身就错了，必须换成 atomic rubric decomposition（per-dim 独立 call + Python 聚合）"
- 这不是把原框架往下拆，是**整个换掉框架**

**和 top-down 的关系**：first-principles 是 top-down 在"框架被撞坏"时的 rescue——先 bottom-up 到公理，再 top-down 从公理重建。

## 分解族

### MECE（Mutually Exclusive, Collectively Exhaustive）
相互独立 + 完全穷尽。拆问题时保证不重不漏。
例：memory 清理分成 feedback/project/reference/user——每条恰好归一类（ME），所有 memory 都能归类（CE）。不然会重复删或漏删。

### Issue Tree
把问题拆成"命题 → 子命题 → 证据"。适合 spec 设计、架构拆解。
例：ScriptReview v2 的 7 维度设计本质就是 issue tree——总问题（promise delivery 如何评估）→ 7 个独立维度 → 每维度的锚点和 evidence。

## 对比族

### Decision matrix
候选 × 评分维度。多选一且有多个评分标准时避免拍脑袋。
例：memory 清理优先级 = "影响面 × 频次 ÷ 成本"。

### Trade-off analysis
明确写出 A 版 vs B 版各自牺牲什么。避免"A 更好"的假对比。
例：今天 CLAUDE.md 英文 vs 中文讨论——token 省/一致性差/维护成本。

## 假设驱动族

### Scientific method
先写假设 → 实验 → 要么证伪要么修正。所有 EXP-NNN 都是这个。

### Decision matrix + pre-decision
实验开始前**先写下**"如果 signal X 出 Y，我会得什么结论"。避免事后 rationalize。
例：INSIGHTS 里"3-signal orthogonal decision matrix" (Phase 3A)——3 条正交 signal 各 pin 不同层，5 行映射 decision matrix 预先写好。

### Null / 反证
找反例而非找支持证据。
例：Phase 3B "让老实的形式接口比糊弄便宜"——设计 [ESCAPED_ADVERSARIAL_SEARCH] marker 让"诚实承认没找到 fatal"比"编 3 个 fatal"成本更低。

## 逆向族

### Pre-mortem
假设项目 3 个月后失败，复盘为什么。决策前预演，成本极低常能拦下坏决策。

### Red team / Devil's advocate
强制论证反方。Panel review 里让 panel 扮 "ruthless red teamer" 就是这个。

### Inverse problem
不想要什么而不是想要什么。有时比"我想要 X"容易回答。
例：讨论 panel 适配 Gemini 时，问"什么情况下 Gemini 不适合当 reviewer" 比"怎么让 Gemini 更好做 reviewer"更快有结论。

## 实际最常用的 6 个

按"工作里出现频次 + 边际价值"：

1. **Top-down**（设计/策略）— 已成规则
2. **Bottom-up 模式归纳**（调试/retro/数据解读）— 补位 top-down
3. **MECE 分解**（拆问题/选项时）— 避免遗漏
4. **Decision matrix**（多选一且多标准）— 避免拍脑袋
5. **5 Whys / mechanism vs symptom**（看到问题别急着修症状）
6. **Abduction**（debug / 实验解读 / retro）— 列多个可能因再区分性验证，比单线 5 Whys 更健壮

## 什么时候选什么

| 场景 | 推荐 |
|---|---|
| 架构/策略设计 | Top-down + MECE |
| 调试跨层 bug | 5 Whys + mechanism vs symptom + bottom-up 数据 |
| 实验解读 | Bottom-up + pre-decision decision matrix |
| A/B 版本选型 | Decision matrix + trade-off + pre-mortem |
| Retro / 复盘 | Bottom-up 归纳 + 根因 5 Whys |
| Panel review 构造 | Decision matrix（列候选 + 明示 trade-off） |
| 创意发散 | Bottom-up + inverse problem |
| 增量改进撞墙 | **First-principles**（质疑框架）+ 重建 |
| 继承他人设计要突破 | **First-principles** |
| Debug / 诊断 | **Abduction**（列多个可能因）+ 5 Whys 补机制 |
| 业务目标规划 / 长周期 roadmap | **Backward chaining**（倒推前置）+ MECE（每层子目标无重不漏） |

## 附：与哲学推理方法的关系

常有疑问：**top-down/bottom-up ≈ 演绎/归纳？** 同向但不完全等价，两组词属于不同范畴：

- **演绎/归纳** = 逻辑推理的结构（讲**保真性**）
- **Top-down/bottom-up** = 分析方向的策略（讲**工作方法**）

### 对照

| 维度 | 演绎法 | Top-down | 归纳法 | Bottom-up |
|---|---|---|---|---|
| 方向 | general → specific | abstract → concrete | specific → general | data → pattern |
| 起点 | **公理/定理** | 目标/结构 | 观察数据 | 数据/实例 |
| 终点 | 保真结论 | 可执行细节 | 普遍规律（假说） | 浮现 pattern |
| 保真性 | **逻辑保真** | 启发式 | 概率性 | 启发式 |

### 关键差异

- **演绎 ≠ 严格的 top-down**：演绎要求起点是公理/定理（逻辑真），top-down 只要起点是目标/结构（不要求真）
- **归纳 ≠ 严格的 bottom-up**：归纳追求 generalization（跨案例普适规律），bottom-up 只要 pattern emergence（局部浮现，不一定普适）

### First-principles 是两者组合

- **上行**：现象 → 公理（归纳 / bottom-up，问"这是物理定律还是历史惯例"）
- **下行**：公理 → 新方案（演绎 / top-down，严格推导或策略决定）

比单纯 top-down 多一步"推到底"，也因此能换框架。

### 关系图

```
推理方向
  ├─ Forward（从前提推结论）
  │    ├─ 严格：演绎法
  │    ├─ 启发：Top-down（分解）
  │    └─ 概括：归纳法 / Bottom-up
  │
  └─ Backward（从结果/目标倒推）
       ├─ 找因：Abduction
       └─ 找路径：Backward chaining
```

日常工作主要用启发层（top-down / bottom-up / abduction / backward chaining），讨论科学方法时上升到严格层（演绎 / 归纳）。
