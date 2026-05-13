---
title: 002 通用Agent框架评测案例
source: https://km.sankuai.com/collabpage/2761724403
saved: 2026-05-13
owner: 陈暐翔(Arel Chan)
modified: 2026-05-11
tags: [Agent, 评测, Trajectory, Friday, Luban]
date: 2026-05-13
---

# 002 通用Agent框架评测案例

## 一、评测目标

### 1.1 传统评测的缺陷

传统 LLM 评测只看最终输出（input → output），但 Agent 的核心价值在于**多步决策过程**。以 Luban（CLI Agent 框架）处理一个编程任务为例：

```
用户: "用Python实现一个表达式求值器"
Agent 执行轨迹:
  Step 1  [LLM]  规划方案 → 决定用递归下降解析
  Step 2  [TOOL] write_file → 写入 expr_parser.py (280行)
  Step 3  [TOOL] run_command → python3 expr_parser.py test
  Step 4  [TOOL] edit_file → 修复一个 bug
  Step 5  [LLM]  汇总结果 → 输出架构说明 + 运行方式
最终输出: "13/13 全部通过 ✅ ..."
```

只看最终输出，你知道"通过了"，但无法回答：

- Step 1 的规划策略合不合理？

- Step 2 的 write_file 参数有没有幻觉？

- Step 3 测试真跑了还是编造的？

- Step 4 的 edit_file 改得对不对？

- 如果失败了，根因是模型推理问题还是工具环境问题？

### 1.2 Trajectory 评测解决方案

Friday 的 **标准组件轨迹评测** 方案将 Agent 执行轨迹结构化为 `Trace → Root Span → Atomic Steps`，然后对每一层进行独立评分：

```
                         ┌─────────────────────────────────────┐
                         │  整体评分 (Overall Score)             │
                         │  root_span.input vs root_span.output │
                         └────────────────┬────────────────────┘
                                          │
              ┌───────────────────────────┼───────────────────────────┐
              ▼                           ▼                           ▼
   ┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
   │  Atomic Step 1   │       │  Atomic Step 2   │       │  Atomic Step N   │
   │  ① 功能分类       │       │  ① 功能分类       │       │  ① 功能分类       │
   │  ② 按类型打分     │       │  ② 按类型打分     │       │  ② 按类型打分     │
   └──────────────────┘       └──────────────────┘       └──────────────────┘
```

每个 Atomic Step 先做**功能分类**（工具调用 / 意图分类 / 信息重整 / 其他），再根据类别适用**不同的评分标准**——这比"一把尺子量所有步骤"精准得多。

### 1.3 本次评测目标

| 维度 | 说明 |
|---|---|
| 评测对象 | Luban CLI Agent（底层模型 Claude Sonnet 4.6） |
| 评测场景 | 编程任务（算法实现、系统设计、概念解释） |
| 评测方法 | 整体评分 + 原子步骤分类打分 |
| 核心问题 | Luban 在多步工具调用场景下的执行质量如何？ |

## 二、评测配置

### 2.1 评测对象

Luban 是一个本地 CLI Agent 框架，因为评测时需要在Friday平台上做推理，所以封装了一个http接口并配置请求和响应json结构完成注册（应用工厂搭建的Agent无需额外注册）

![[km-2761724403-236211532276.png]]

### 2.2 评测集

100条代码场景的Task任务，在Friday上通过评测集进行管理

![[km-2761724403-236212531110.png]]

### 2.3 评测指标

直接使用 Friday 公共指标【标准组件轨迹评测】

![[km-2761724403-236210617915.png]]

指标详情介绍

#### 2.3.1 指标打分流程

指标内部执行 3 个阶段，**每个阶段都是一次独立的 LLM 调用**：

```
┌─────────────────────────────────────────────────────────────────┐
│  Stage 1: 整体评分 (score_root)                                  │
│  ─────────────────────────────────────────────────────────────  │
│  输入: root_span 的 {name, input, output}                       │
│  Prompt 模板: OVERALL_SCORE_TEMPLATE                            │
│  输出: {"score": 0.0/0.5/1.0, "reason": "..."}                 │
│                                                                 │
│  变量映射:                                                       │
│    {root_span_json}  ←  root_span 的 name/input/output 字段     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼  (若开启步骤评分)
┌─────────────────────────────────────────────────────────────────┐
│  Stage 2: 功能分类 (purpose_triage)  ×N 个 Atomic Step           │
│  ─────────────────────────────────────────────────────────────  │
│  输入: 每个 atomic_step 的完整 JSON                              │
│  Prompt 模板: PURPOSE_TRIAGE_TEMPLATE                           │
│  输出: {"purpose_type": "工具调用"/"意图分类"/"信息重整"/"其他.XX"} │
│                                                                 │
│  变量映射:                                                       │
│    {atomic_step_json}  ←  当前 atomic_step 的完整结构             │
│                           (含 target_span + aux_spans)           │
│                                                                 │
│  分类判断优先级:                                                  │
│    1. 是否在做选择/路由/True-False判断？→ 意图分类                 │
│    2. 是否调用了工具且参数是开放内容？  → 工具调用                  │
│    3. 是否在生成/总结/格式化长文本？    → 信息重整                  │
│    4. 都不符合？                       → 其他.XX                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Stage 3: 按类型打分 (score_atomic_step)  ×N 个 Atomic Step      │
│  ─────────────────────────────────────────────────────────────  │
│  输入: atomic_step JSON + 根据 purpose_type 动态注入的评分标准    │
│  Prompt 模板: ATOMIC_SCORE_TEMPLATE + get_score_guidance()       │
│  输出: {"score": 0.0/0.5/1.0, "reason": "..."}                 │
│                                                                 │
│  变量映射:                                                       │
│    {atomic_step_json}  ←  当前 atomic_step（已填入 purpose_type） │
│    {extra_guidance}    ←  get_score_guidance(purpose_category)   │
│                           根据分类结果动态选择评分标准             │
└─────────────────────────────────────────────────────────────────┘

```

#### 2.3.2 变量映射详解

这是 Trajectory 评测方案最核心的设计——**不同阶段使用不同的变量映射，且评分标准根据分类结果动态注入**：

| 阶段 | Prompt 模板 | 变量 | 映射来源 |
|---|---|---|---|
| 整体评分 | `OVERALL_SCORE_TEMPLATE` | `{root_span_json}` | `traj.root_span` 的 name/input/output |
| 功能分类 | `PURPOSE_TRIAGE_TEMPLATE` | `{atomic_step_json}` | 当前 `atomic_steps[i]` 的完整 JSON（含 target_span + aux_spans） |
| 步骤打分 | `ATOMIC_SCORE_TEMPLATE` | `{atomic_step_json}` | 同上（此时 `purpose_type` 已填入分类结果） |
| 步骤打分 | `ATOMIC_SCORE_TEMPLATE` | `{extra_guidance}` | `get_score_guidance(purpose_category)` 动态返回的评分细则 |

`**{extra_guidance} 的动态注入逻辑**`——这是最关键的变量映射：

```
def get_score_guidance(purpose_category):
    if purpose_category == "信息重整":
        return """
        步骤1: 指令遵循评估 (0/0.5/1)
        步骤2: 信息准确性评估 (0/1)  ← 检查幻觉、标识符是否抄错
        步骤3: 内容合理性评估 (0/1)  ← 检查推理逻辑
        步骤4: 加权聚合 → 0.4*IF + 0.4*ACC + 0.2*RE
        """
    if purpose_category == "工具调用":
        return """
        1.0: 工具选择正确 + 参数合法 + 无幻觉
        0.5: 工具对了但参数有误 / 死循环重复调用
        0.0: 幻觉调用不存在的工具 / 格式崩溃 / 参数凭空捏造
        """
    if purpose_category == "意图分类":
        return """
        步骤1: 意图范围理解
        步骤2: 意图识别（结合历史对话、用户反馈）
        步骤3: 评估（1.0=正确 / 0.5=信息不足 / 0.0=错误）
        """

```

**核心设计思想**：同一个 `ATOMIC_SCORE_TEMPLATE` 模板，通过 `{extra_guidance}` 变量注入不同的评分标准，实现"一套框架，多套评判逻辑"。打分模型看到的 prompt 会根据步骤类型完全不同：

- 对 write_file 工具调用：重点检查参数合法性和是否幻觉

- 对最终回复用户：重点检查指令遵循、信息准确性、推理合理性

- 对意图路由判断：重点检查分类是否命中正确意图

### 2.4 评测任务

![[km-2761724403-236206474870.png]]

| 参数 | 说明 |
|---|---|
| Trace_Span_tree | Friday的Tracing格式数据，指标代码拿到每一条case的Trace数据后会通过规则+LLM加工为Trajectory进行评测。Trace数据来源1.应用工厂搭建的Agent：直接选择Trace类型即可，平台会自动关联这个Agent推理所产生的Trace数据并用于评测2.自建Agent：如果自建Agent上报Trace时使用了评测接口返回的mtrace，同上直接选择Trace类型即可（推荐）；第二种方式是直接把符合规范的Trace结构塞到推理接口响应里，在打分时映射到响应结构中的相应字段 |
| App_id | 指标代码中涉及Trace加工为Trajectory，需要用到LLM，此处填写相应的计费App_id |
| Simple_Traj | 只取第一层子 Span（不递归嵌套 Agent），设为 True 只看第一层步骤，设为 False 展开所有嵌套层级 |
| Root_Only | **开启步骤级评分**，设为 True 则只出整体分，设为False会计算步骤得分 |

## 三、专业评测分析Agent做结果解读

评测结果页可查看打分数据明细及最终得分

![[km-2761724403-236215273950.png]]

下载文件后可通过专业的评测分析Agent Deeper进行评测结果分析[https://friday.sankuai.com/eval/deeper?sessionId=193](https://friday.sankuai.com/eval/deeper?sessionId=193)

**step1:上传文件并生成报告方案**

![[km-2761724403-236225011597.png]]

**step2:根据方案框架规划DAG节点并做计算，点击可查看每个节点详情进行溯源，同时支持节点维度的重做**

![[km-2761724403-236232757046.png]]

**step3:查看完整报告**

![[km-2761724403-236241801406.png]]