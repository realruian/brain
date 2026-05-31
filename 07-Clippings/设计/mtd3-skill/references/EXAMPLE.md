# MTD 知识库 SKILL - 使用示例

## 示例 1：生成登录表单页面（React）

### Step 1: 意图识别 && 意图解析

**用户需求**：创建一个登录表单页面，包含用户名输入、密码输入和提交按钮。

**1. 识别组件**：
- 需要用到的组件：`Form`, `Input`, `Button`

**2. 识别框架**：
- 检查项目的 `package.json` 文件：
  ```json
  {
    "dependencies": {
      "@ss/mtd-react3": "^x.x.x"
    }
  }
  ```
- 判断结果：使用 **React 组件库**（`mtd-react`）

### Step 2: 获取组件知识库

基于Step 1的识别结果，执行命令获取知识库：
- 组件：`Form,Input,Button`
- 框架：`mtd-react`（默认，可省略 `--target` 参数）

```bash
node scripts/mtd-rag.js query_components_direct --components=Form,Input,Button --target=mtd-react --quiet
```

输出：
```
[1] question:Form组件何时使用 answer:Form 组件是一个功能完整的表单容器...

[2] question:Input组件基础示例 answer:import { Input } from '@ss/mtd-react3'...

[3] question:Button组件基础示例 answer:import { Button } from '@ss/mtd-react3'...
```

### Step 3: 检查注意事项

查看 `references/precautions.md`：
- Form第一层节点仅支持Form.Item组件
- FormItem中只允许包含一个使用toFormItem的组件

### Step 4: 生成代码

基于知识库生成登录表单：

```jsx
import React from 'react';
import { Form, Input, Button } from '@ss/mtd-react3';

const LoginForm = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    console.log('提交表单:', values);
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
    >
      <Form.Item
        label="用户名"
        name="username"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input placeholder="请输入用户名" />
      </Form.Item>

      <Form.Item
        label="密码"
        name="password"
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input type="password" placeholder="请输入密码" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          登录
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
```

---

## 示例 2：还原数据表格页面（Vue）

### Step 1: 意图识别 && 意图解析

**用户需求**：用户提供了一个表格截图，需要还原为代码。

**1. 识别组件**：
- 需要用到的组件：`Table`, `Button`, `Pagination`, `Input`（用于搜索）

**2. 识别框架**：
- 检查项目的 `package.json` 文件：
  ```json
  {
    "dependencies": {
      "@ss/mtd-vue2": "^x.x.x",
      "vue": "^2.x.x"
    }
  }
  ```
- 判断结果：使用 **Vue 组件库**（`mtd-vue`）

### Step 2: 获取组件知识库

基于Step 1的识别结果，执行命令获取知识库：
- 组件：`Table,Button,Pagination,Input`
- 框架：`mtd-vue`（必须指定 `--target mtd-vue`）

```bash
node scripts/mtd-rag.js query_components_direct --components=Table,Button,Pagination,Input --target=mtd-vue --quiet
```

### Step 3: 检查注意事项

查看 `references/precautions.md`：
- Vue组件库中某些组件的特殊用法

### Step 4: 生成代码

```vue
<template>
  <div>
    <div style="margin-bottom: 16px;">
      <mtd-input
        v-model="searchText"
        placeholder="搜索..."
        style="width: 300px;"
      />
      <mtd-button
        type="primary"
        @click="handleSearch"
        style="margin-left: 8px;"
      >
        搜索
      </mtd-button>
    </div>

    <mtd-table
      :data="tableData"
      :columns="columns"
      :loading="loading"
    >
    </mtd-table>

    <mtd-pagination
      v-model="currentPage"
      :total="total"
      :page-size="pageSize"
      @change="handlePageChange"
      style="margin-top: 16px;"
    />
  </div>
</template>

<script>
export default {
  name: 'DataTable',
  data() {
    return {
      searchText: '',
      tableData: [],
      columns: [
        { prop: 'name', label: '姓名' },
        { prop: 'age', label: '年龄' },
        { prop: 'address', label: '地址' },
      ],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
    };
  },
  methods: {
    handleSearch() {
      console.log('搜索:', this.searchText);
      // 执行搜索逻辑
    },
    handlePageChange(page) {
      console.log('切换页码:', page);
      // 加载新页面数据
    },
  },
};
</script>
```

---

## 示例 3：修改现有页面（React）

### 场景：为现有登录表单添加验证码功能

**用户需求**：现有的登录表单需要增加验证码输入和刷新验证码的功能。

### Step 1: 分析现有代码 && 识别修改需求

**现有代码**：
```jsx
import React from 'react';
import { Form, Input, Button } from '@ss/mtd-react3';

const LoginForm = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    console.log('提交表单:', values);
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
    >
      <Form.Item
        label="用户名"
        name="username"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input placeholder="请输入用户名" />
      </Form.Item>

      <Form.Item
        label="密码"
        name="password"
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input type="password" placeholder="请输入密码" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          登录
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
```

**1. 识别修改需求**：
- 添加验证码输入框
- 添加刷新验证码按钮
- 在密码输入框和登录按钮之间插入验证码相关组件

**2. 识别涉及组件**：
- 需要使用的组件：`Input`（用于验证码输入）、`Button`（用于刷新验证码）

**3. 识别框架**：
- 检查代码中的导入语句：
  ```jsx
  import { Form, Input, Button } from '@ss/mtd-react3';
  ```
- 判断结果：使用 **React 组件库**（`mtd-react`）

### Step 2: 获取组件知识库

基于Step 1的识别结果：
- 组件：`Input,Button`
- 框架：`mtd-react`（默认）

```bash
node scripts/mtd-rag.js query_components_direct --components=Input,Button --target=mtd-react --quiet
```

### Step 3: 检查注意事项

查看 `references/precautions.md`：
- 确认Input和Button组件没有特殊注意事项

### Step 4: 应用修改

修改后的代码：
```jsx
import React, { useState } from 'react';
import { Form, Input, Button } from '@ss/mtd-react3';

const LoginForm = () => {
  const [form] = Form.useForm();
  const [captchaUrl, setCaptchaUrl] = useState('/api/captcha');

  const handleSubmit = (values) => {
    console.log('提交表单:', values);
  };

  const refreshCaptcha = () => {
    // 刷新验证码
    setCaptchaUrl(`/api/captcha?t=${Date.now()}`);
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
    >
      <Form.Item
        label="用户名"
        name="username"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input placeholder="请输入用户名" />
      </Form.Item>

      <Form.Item
        label="密码"
        name="password"
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input type="password" placeholder="请输入密码" />
      </Form.Item>

      <Form.Item
        label="验证码"
        name="captcha"
        rules={[{ required: true, message: '请输入验证码' }]}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <Input placeholder="请输入验证码" style={{ flex: 1 }} />
          <img
            src={captchaUrl}
            alt="验证码"
            style={{ height: '32px', cursor: 'pointer' }}
            onClick={refreshCaptcha}
          />
          <Button onClick={refreshCaptcha}>
            刷新
          </Button>
        </div>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          登录
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
```

### Step 5: 验证修改结果

- 确认验证码输入框已添加
- 确认刷新验证码功能已实现
- 确认代码风格与原有代码保持一致
- 检查是否有组件报错

---

## 示例 4：修复组件报错（重试机制详解）

### 场景：Form.Item 使用 InputNumber 组件报错

**错误信息**：
```
Warning: Form.Item can only accept one child that uses toFormItem
```

**问题代码**：
```jsx
import React from 'react';
import { Form, InputNumber, Button } from '@ss/mtd-react3';

const NumberForm = () => {
  return (
    <Form>
      <Form.Item name="age" label="年龄">
        <InputNumber
          value={value}
          onChange={setValue}
          min={0}
          max={100}
        />
      </Form.Item>
      <Button type="primary">提交</Button>
    </Form>
  );
};
```

---

### 第 1 次尝试：识别问题组件并获取知识库

**Step 1: 识别问题组件 && 识别框架**

**1. 识别问题组件**：
- 涉及的组件：`Form`, `InputNumber`

**2. 识别框架**：
- 检查代码中的导入语句：
  ```jsx
  import { Form, InputNumber } from '@ss/mtd-react3';
  ```
- 判断结果：使用 **React 组件库**（`mtd-react`）

**Step 2: 获取组件知识库**

```bash
node scripts/mtd-rag.js query_components_direct --components=Form,InputNumber --target=mtd-react --quiet
```

**Step 3: 分析错误原因**

根据知识库和错误信息分析：
- 错误提示：Form.Item 只能接受一个使用 toFormItem 的子组件
- 当前代码：InputNumber 使用了 value 和 onChange，这是受控组件的写法
- 问题：InputNumber 应该使用 toFormItem 方式，而不是受控组件方式

**Step 4: 尝试修复（第 1 次）**

```jsx
import React from 'react';
import { Form, InputNumber, Button } from '@ss/mtd-react3';

const NumberForm = () => {
  return (
    <Form>
      <Form.Item name="age" label="年龄">
        <InputNumber min={0} max={100} />
      </Form.Item>
      <Button type="primary">提交</Button>
    </Form>
  );
};
```

**验证结果**：仍然有警告，提示 InputNumber 应该使用 toFormItem

---

### 第 2 次尝试：重新获取知识库并深入分析

**Step 2: 重新获取组件知识库（去掉 --limit 限制）**

```bash
node scripts/mtd-rag.js query_components_direct --components=InputNumber --target=mtd-react --quiet
```

**Step 3: 深度分析**

重新仔细阅读 InputNumber 的知识库，发现：
- InputNumber 必须使用 `toFormItem` 方法
- toFormItem 与 onChange 和 value 是互斥的
- 正确用法：`<InputNumber {...InputNumber.toFormItem({ ... })} />`

**Step 4: 尝试修复（第 2 次）**

```jsx
import React from 'react';
import { Form, InputNumber, Button } from '@ss/mtd-react3';

const NumberForm = () => {
  return (
    <Form>
      <Form.Item name="age" label="年龄">
        <InputNumber
          {...InputNumber.toFormItem({
            min: 0,
            max: 100,
          })}
        />
      </Form.Item>
      <Button type="primary">提交</Button>
    </Form>
  );
};
```

**验证结果**：警告消失，组件正常工作

---

### 第 3 次尝试（如果第 2 次仍然失败）

假设第 2 次尝试后仍然有问题，比如：
```
Error: InputNumber.toFormItem is not a function
```

**Step 1: 重新识别问题**

- 可能是组件版本问题，或者知识库过时
- 需要获取更详细的 API 文档

**Step 2: 获取更详细的知识库**

```bash
node scripts/mtd-rag.js query_components_direct --components=InputNumber --target=mtd-react --quiet
```

**Step 3: 查看注意事项**

查看 `references/precautions.md`：
- FormItem中只允许包含一个使用toFormItem的组件
- toFormItem与onChange和value是互斥的，必须使用toFormItem而非其他方式

**Step 4: 最终修复**

```jsx
import React from 'react';
import { Form, InputNumber, Button } from '@ss/mtd-react3';

const NumberForm = () => {
  return (
    <Form>
      <Form.Item name="age" label="年龄" rules={[
        { type: 'number', min: 0, max: 100, message: '请输入0-100之间的数字' }
      ]}>
        <InputNumber
          {...InputNumber.toFormItem({
            min: 0,
            max: 100,
          })}
        />
      </Form.Item>
      <Button type="primary">提交</Button>
    </Form>
  );
};
```

**验证结果**：组件正常工作，验证规则也生效

---

### 重试机制总结

本示例展示了完整的重试流程：

1. **第 1 次尝试**：
   - 识别问题组件
   - 获取基础知识库
   - 初步分析并修复
   - 验证结果

2. **第 2 次尝试**（如果第 1 次失败）：
   - 重新获取知识库（去掉限制）
   - 深度分析问题原因
   - 根据更详细的知识库修复
   - 再次验证

3. **第 3 次尝试**（如果第 2 次仍然失败）：
   - 查看注意事项文档
   - 结合所有信息进行最终修复
   - 最终验证

**关键点**：
- 每次重试都要重新获取知识库，获取更详细的信息
- 仔细对比知识库和现有代码，找出差异
- 遵循组件的正确用法，特别是特殊组件的注意事项
- 最多重试 3 次，避免陷入无限循环

---



## 重要提示

### Step 1 必须包含的两个关键识别

每个示例的Step 1都必须完成两项识别：

1. **识别组件**：确定需要用到哪些MTD组件
2. **识别框架**：确定使用的是 `mtd-react` 还是 `mtd-vue`

**框架识别方法**：
- 查看 `package.json` 中的依赖
- 查看代码中的导入语句
- 询问用户项目使用的框架

**为什么重要**：React和Vue组件库存在差异，混用会导致错误。

---

## 注意事项
1. **组件名大小写**：组件名首字母必须大写（如 `Button`，不是 `button`）
2. **多个组件格式**：用逗号分隔，**不要有空格**（如 `"Button,Form,Input"`）
3. **引号使用**：多个组件时建议用引号包裹（如 `"Button,Form"`）
4. **静默模式**：在 SKILL 中建议使用 `--quiet` 参数，只输出知识库内容
5. **框架识别**：**必须在Step 1中识别框架**，确保 `--target` 参数与项目实际使用的框架一致
6. **不要混用**：React组件库和Vue组件库的组件存在差异，绝对不要混用
