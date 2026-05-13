# MTD 组件知识库 - 使用指南

本指南说明如何通过命令行方式获取 MTD 组件的知识库（推荐用于 SKILL 工作流）

## 快速检查清单

在获取知识库之前，请检查以下几点：
- 通过用户的描述或者项目的 `package.json` 文件，确定要查询的是 `mtd-react` 还是 `mtd-vue` 组件库
- 读取 `package.json` 中 `@ss/mtd-react3` / `@ss/mtd-vue2` / `@ss/mtd-vue3` 的版本号，作为 `--mtd-version` 参数（可选）
- 确认您需要获取单个组件还是多个组件的信息

---

# 命令行接口

## 基础用法

```bash
node scripts/mtd-rag.js query_components_direct --components=<组件名> --target=<框架> [--mtd-version=<版本号>] [--quiet]
```

## 快速参考

### 命令模板

```bash
# 单个组件（不指定版本，默认最新版）
node scripts/mtd-rag.js query_components_direct --components=<组件名> --target=<框架> [--quiet]

# 多个组件（指定版本）
node scripts/mtd-rag.js query_components_direct --components=<组件1>,<组件2>,<组件3> --target=<框架> --mtd-version=<版本号> [--quiet]
```

### 常用示例

```bash
# React 单个组件（不指定版本）
node scripts/mtd-rag.js query_components_direct --components=Button --target=mtd-react --quiet

# React 多个组件（指定版本）
node scripts/mtd-rag.js query_components_direct --components=Button,Form,Input,Select --target=mtd-react --mtd-version=0.12.9 --quiet

# Vue 组件
node scripts/mtd-rag.js query_components_direct --components=Button,Form --target=mtd-vue --quiet

# 查看详细日志（去掉 --quiet）
node scripts/mtd-rag.js query_components_direct --components=Button --target=mtd-react
```

## 场景一：获取单个组件知识库

### React 组件

```bash
node scripts/mtd-rag.js query_components_direct --components=Button --target=mtd-react --quiet
```

### Vue 组件

```bash
node scripts/mtd-rag.js query_components_direct --components=Button --target=mtd-vue --quiet
```

## 场景二：获取多个组件知识库

```bash
# React 多个组件（用逗号分隔，不要有空格）
node scripts/mtd-rag.js query_components_direct --components=Button,Form,Input,Select --target=mtd-react --quiet

# Vue 多个组件
node scripts/mtd-rag.js query_components_direct --components=Button,Form,Input --target=mtd-vue --quiet
```

## 命令行参数说明

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `--components` | 组件名，多个用逗号分隔，无空格 | 必填 |
| `--target` | 目标框架：`mtd-react` 或 `mtd-vue` | 必填 |
| `--mtd-version` | MTD 组件库版本号 | 可选，默认 `latest` |
| `-q, --quiet` | 静默模式，只输出结果 | 否 |

## 如何确定 mtd-version

有项目时，读取 `package.json` 的 `dependencies` 传入精确版本：
- `@ss/mtd-react3` 的版本 → React 项目的 `--mtd-version`
- `@ss/mtd-vue2` 或 `@ss/mtd-vue3` 的版本 → Vue 项目的 `--mtd-version`

无项目时，省略 `--mtd-version` 参数即可，工具会自动使用最新版。

## 常见问题 (FAQ)

### Q: 获取的知识库包含什么？

**A:** 通常包含：
- 组件用途和适用场景
- 完整的 API 文档
- 基础示例代码
- 使用注意事项

### Q: 组件名如何书写？

**A:** 组件名首字母必须大写，多个组件用逗号分隔且不要有空格：
- ✅ 正确：`--components=Button` 或 `--components=Button,Form,Input`
- ❌ 错误：`--components=button` 或 `--components=Button, Form`（有空格）

### Q: 什么时候使用 --quiet 参数？

**A:** 在 SKILL 工作流中建议使用 `--quiet` 参数，这样只输出知识库内容，不会有额外的日志信息干扰。

### Q: 如何确定使用哪个框架？

**A:** 检查项目的 `package.json` 文件：
- 包含 `@ss/mtd-react3` → 使用 `--target=mtd-react`
- 包含 `@ss/mtd-vue2` 或 `@ss/mtd-vue3` → 使用 `--target=mtd-vue`

### Q: 命令执行失败怎么办？

**A:**
1. 确认组件名拼写正确（首字母大写）
2. 确认网络连接正常（需要访问内部 API）
3. 查看错误信息，根据提示调整参数
4. 可以去掉 `--quiet` 参数查看详细日志

---

## 返回数据格式

返回格式化的知识库文档，包含组件列表和各组件的文档内容：
```
需要用到的组件列表： ['Button', 'Form']。相关UI组件文档： [
  'question:Button组件何时使用 answer:Button 按钮是触发操作的主要交互元素...',
  'question:Button组件属性列表 answer:...',
  ...
]
```

---

# 更多参考资料
- **脚本实现**：查看 `mtd-rag.js` 了解具体实现
- **完整示例**：查看 `../references/EXAMPLE.md` 了解实际使用场景
- **SKILL流程**：查看 `../SKILL.md` 了解完整的工作流程
