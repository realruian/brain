## 一、静态注入 (Static Injection)

**默认状态：开启。**

每次会话开始时，`MEMORY.md` 的内容会以 `<user_memory>` 标签封装，作为 system prompt 的一部分注入到 LLM 的上下文中，确保 Agent 从对话开始就了解用户。

### 1.1 文件路径

```
# 个人工作区
/efs/data/tenants/{agent}/users/{mis}/MEMORY.md

# 群组共享工作区
/efs/data/tenants/{agent}/groups/{groupId}/MEMORY.md
```

**安全策略**：`MEMORY.md` **仅在个人单聊主会话中注入**，不在群聊等共享上下文中加载，避免个人信息泄露给其他群成员。

### 1.2 MEMORY.md 的维护方式

`MEMORY.md` 没有专用写入接口，模型通过普通文件工具直接自主维护：

|操作|工具|
|---|---|
|新增条目|`edit`（文件末尾追加）|
|更新条目|`edit`（精确替换）|
|删除条目|`edit`（删除对应行）|
|检查容量|`bash`（`wc -m MEMORY.md`）|

**主动保存（按优先级）**：用户对模型的纠正 > 用户偏好与习惯 > 环境信息与技术约定 > 稳定的工具技巧

**跳过**：任务进度、临时调试内容——这些用 `session_search` 按需检索。

### 1.3 容量管理

字符上限 **2200**（约 8–15 条）。超过 80%（约 1760 字符）时，模型应主动整合：读取所有条目 → 将相关条目合并为高密度条目以腾出空间 → 再写入新内容。

**好的条目示例（紧凑、信息密度高）：**

```
用户使用 macOS，Shell: zsh，Java 项目用 Maven，4 空格缩进，UTF-8 编码。
禁止在循环中访问 DB；禁止写单元测试；接口返回统一用 Result<T> 封装。
```

**差的条目示例：**

```
用户有一个 Java 项目。                                      ← 太模糊
2026 年 1 月，用户让我看了他的项目，位于某目录，我发现它使用了…   ← 太冗长
```

---

## 二、自动预取 (Automatic Prefetch)

**默认状态：暂不支持。**

自动预取指每次 LLM 调用前，系统自动根据当前消息内容进行语义检索，并将相关记忆片段注入到上下文中（RAG 模式）。

当前 1024 Agent **尚未实现**此能力。后续计划通过接入外部记忆插件（如 **OpenViking**、**Mem0** 等）来支持，无需修改 Agent 核心推理链路即可按需开启。

---

## 三、主动检索 (Active Retrieval)

**默认状态：开启（目前 agent 粒度白名单控制）。**

Agent 可通过调用内置的 `session_search` 工具，对所有历史会话消息进行 **BM25 全文检索**，找到相关历史对话并生成摘要返回。检索触发完全由 Agent 的推理逻辑决定，不对每条消息自动执行。

### 3.1 数据写入：消息双写 + 异步索引

每轮对话结束后自动触发，**不阻塞主路径**：

```
用户发消息 → Agent 推理 → 本轮结束
                              │
              ┌───────────────┴──────────────────────┐
              │ 同步写 MySQL                          │ 异步写 EFS
              │ ai_message_log / ai_tool_call_log     │ sessions/{convId}.jsonl
              └───────────────┬──────────────────────┘
                              │ 异步（不阻塞）
                              ▼
                  SessionMessageIndexService
                    agent 白名单校验
                              │
                              ▼
                  Milvus session_messages
                 （BM25 稀疏向量 + 中文分词器）
```

**MySQL**：`ai_message_log` / `ai_tool_call_log`，作为 session_search 阶段三加载完整对话的来源。

**EFS session 文件**：`.jsonl` 格式，每行一个 JSON 消息条目，保存完整的对话上下文（含工具调用），文件大小超过阈值后自动 rotate（旧文件加时间戳后缀保留）。EFS 文件不参与检索，主要用于上下文恢复和 session 历史回放。

只索引 `user` / `assistant` 消息，每条消息携带以下元数据用于后续精准过滤：

|字段|说明|
|---|---|
|`conversation_id`|会话 ID，用于按会话聚合|
|`mis`|用户 MIS，私聊场景隔离|
|`dx_group_id`|群组 ID，群聊场景隔离|
|`paas`|Agent 标识，跨 agent 隔离|
|`role`|消息角色（`user` / `assistant`）|
|`created_at`|消息时间，支持时间范围过滤|

### 3.2 Milvus 集合设计

集合名：`session_messages`

```
┌──────────────────────────────────────────────────────────────┐
│ 字段           类型              说明                          │
├──────────────────────────────────────────────────────────────┤
│ id             VarChar(128)     主键，消息唯一 ID（upsert 幂等）│
│ text           VarChar(65535)   消息正文，BM25 检索目标        │
│                                 启用 Chinese Analyzer 分词     │
│ sparse_vector  SparseFloatVector BM25 函数自动生成，无需手动写入│
│ conversation_id VarChar(128)    会话 ID                        │
│ mis            VarChar(64)      用户 MIS                       │
│ paas           VarChar(128)     Agent 标识                     │
│ role           VarChar(32)      user / assistant               │
│ created_at     VarChar(32)      消息时间                       │
│ dx_group_id    VarChar(64)      群组 ID                        │
└──────────────────────────────────────────────────────────────┘

索引：
  sparse_vector  →  SPARSE_INVERTED_INDEX（BM25 检索）
  conversation_id / mis / paas / role / dx_group_id  →  TRIE（过滤加速）
```

BM25 函数配置：`text_bm25_emb`，输入 `text` → 输出 `sparse_vector`，中文分词器（`type: chinese`）在写入和检索时同步分词，无需独立 embedding 服务。

### 3.3 检索五阶段管道

模型调用 `session_search("关键词")` 时执行：

**① Milvus BM25 全文检索**  
关键词 → `textSearch(topK = limit × 10)` → 命中消息列表  
过滤条件：`mis`（私聊）或 `dx_group_id`（群聊）+ `paas` + 可选 `role_filter`

**② 按会话分组 & 去重，取 Top N**  
命中消息按 `conversation_id` 聚合，取每个会话最高 BM25 分，降序保留 Top N（默认 3）

**③ 加载完整会话 + 智能窗口截断**  
批量查 MySQL 还原完整对话文本，格式化为：

```
[USER]: ...
[ASSISTANT]: [Called: bash, read_file] ...
[TOOL:bash]: ...（超 500 字截断）
```

超过 10 万字符时，以命中关键词为中心取前 25% / 后 75% 窗口（三级关键词匹配策略）

**④ 并行 LLM 摘要**  
`CompletableFuture` 并发调用 LongCat-Flash-Chat，整体超时 60s；重试 3 次（指数退避），失败降级为 raw preview（前 500 字）。  
摘要要点：用户意图 / 行动结果 / 关键决策 / 技术细节 / 遗留问题

**⑤ 组装结果返回主模型**

```
{
  "mode": "search",
  "query": "...",
  "sessions": [
    { "conversation_id": "...", "summary": "...", "status": "ok" }
  ]
}
```

### 3.4 检索范围

- **私聊**：按 `mis` 过滤，只检索当前用户的个人历史
    
- **群聊**：按 `dx_group_id` 过滤，检索整个群组的共享历史
    

---

## 四、三种机制对比小结


|          | 静态注入              | 自动预取                     | 主动检索              |
| -------- | ----------------- | ------------------------ | ----------------- |
| **当前状态** | ✅ 已实现，默认开启        | ❌ 暂不支持                   | ✅ 已实现，白名单控制       |
| **触发方式** | 每次会话自动注入          | 每次 LLM 调用前自动触发           | 模型主动调用工具          |
| **存储介质** | EFS 文件（MEMORY.md） | 外部向量数据库                  | Milvus（BM25 稀疏向量） |
| **容量限制** | 2200 字符           | 取决于插件配置                  | 无限制               |
| **适用场景** | 常驻关键事实、用户偏好       | 每轮自动补充相关上下文              | 历史对话回溯查询          |
| **后续计划** | —                 | 接入 OpenViking / Mem0 等插件 | —                 |