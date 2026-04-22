# MTD 组件库安装指南

本文档说明如何在不同项目中快速安装和配置 MTD 组件库。

---

## 框架识别与对应包名

| 框架 | 包名 | 命令行标识 |
|--------|------|------------|
| React | `@ss/mtd-react3` | `mtd-react` |
| Vue 2 | `@ss/mtd-vue2` | `mtd-vue` |
| Vue 3 | `@ss/mtd-vue3` | `mtd-vue` |

---

## 安装方法

### 1. 使用 npm 安装

```bash
# React 组件库
npm install @ss/mtd-react3

# Vue 2 组件库
npm install @ss/mtd-vue2

# Vue 3 组件库
npm install @ss/mtd-vue3
```

### 2. 使用 yarn 安装

```bash
# React 组件库
yarn add @ss/mtd-react3

# Vue 2 组件库
yarn add @ss/mtd-vue2

# Vue 3 组件库
yarn add @ss/mtd-vue3
```

### 3. 使用 pnpm 安装

```bash
# React 组件库
pnpm add @ss/mtd-react3

# Vue 2 组件库
pnpm add @ss/mtd-vue2

# Vue 3 组件库
pnpm add @ss/mtd-vue3
```

---

## 验证安装

安装完成后，检查 `package.json` 文件确认依赖已添加：

```json
{
  "dependencies": {
    "@ss/mtd-react3": "^x.x.x"
  }
}
```

---

## React 项目配置

### 1. 引入样式

在入口文件（如 `src/index.js` 或 `src/main.js`）中引入样式：

```javascript
// 默认主题（蓝色）
import '@ss/mtd-react3/lib/style/index.css';

// 黄色主题
import '@ss/mtd-react3/lib/style/theme-yellow.css';

// 或按需引入
import '@ss/mtd-react3/lib/button/style/css';
```

### 2. 引入组件

```javascript
import { Button, Form, Input } from '@ss/mtd-react3';
```

### 3. 使用组件

```jsx
import React from 'react';
import { Button, Form, Input } from '@ss/mtd-react3';

const MyComponent = () => {
  return (
    <div>
      <Button type="primary">点击我</Button>
      <Form>
        <Form.Item name="username">
          <Input placeholder="请输入用户名" />
        </Form.Item>
      </Form>
    </div>
  );
};
```

---

## Vue 2 项目配置

### 1. 引入样式

在入口文件（如 `src/main.js`）中引入样式：

```javascript
// 默认主题（蓝色）
import '@ss/mtd-vue2/lib/theme-chalk/index.css';

// 黄色主题
import '@ss/mtd-vue2/lib/theme-yellow/index.css';
```

### 2. 注册组件

```javascript
import Vue from 'vue';
import Mtd from '@ss/mtd-vue2';

// 如果 Vue 版本在 2.7 以下，需要引入 VueCompositionApi
// 注意：需要在文件顶部引入，不能在 if 语句中使用 import
import VueCompositionApi from '@vue/composition-api';

// 使用前检查版本
if (Vue.version < '2.7') {
  Vue.use(VueCompositionApi);
}

Vue.use(Mtd);
```

### 3. 使用组件

```vue
<template>
  <div>
    <mtd-button type="primary">点击我</mtd-button>
    <mtd-form>
      <mtd-form-item prop="username">
        <mtd-input placeholder="请输入用户名" />
      </mtd-form-item>
    </mtd-form>
  </div>
</template>
```

---

## Vue 3 项目配置

### 1. 引入样式

在入口文件（如 `src/main.js`）中引入样式：

```javascript
// 默认主题（蓝色）
import '@ss/mtd-vue3/lib/theme-chalk/index.css';

// 黄色主题
import '@ss/mtd-vue3/lib/theme-yellow/index.css';
```

### 2. 注册组件

```javascript
import { createApp } from 'vue';
import Mtd from '@ss/mtd-vue3';

const app = createApp(App);
app.use(Mtd);
```

### 3. 使用组件

```vue
<template>
  <div>
    <mtd-button type="primary">点击我</mtd-button>
    <mtd-form>
      <mtd-form-item prop="username">
        <mtd-input placeholder="请输入用户名" />
      </mtd-form-item>
    </mtd-form>
  </div>
</template>
```

---

## 按需引入（可选）

为了减小打包体积，可以使用按需引入：

### React 按需引入

```javascript
// 默认主题
import Button from '@ss/mtd-react3/lib/button/style/css';
import Form from '@ss/mtd-react3/lib/form/style/css';
import Input from '@ss/mtd-react3/lib/input/style/css';

// 黄色主题
import Button from '@ss/mtd-react3/lib/button/style/theme-yellow.css';
import Form from '@ss/mtd-react3/lib/form/style/theme-yellow.css';
import Input from '@ss/mtd-react3/lib/input/style/theme-yellow.css';
```

### Vue 按需引入

```javascript
// 默认主题
import Button from '@ss/mtd-vue3/lib/theme-chalk/button.css';
import Form from '@ss/mtd-vue3/lib/theme-chalk/form.css';
import Input from '@ss/mtd-vue3/lib/theme-chalk/input.css';

// 黄色主题
import Button from '@ss/mtd-vue3/lib/theme-yellow/button.css';
import Form from '@ss/mtd-vue3/lib/theme-yellow/form.css';
import Input from '@ss/mtd-vue3/lib/theme-yellow/input.css';
```

---

## 常见问题

### Q: 安装后找不到组件？

A: 确认以下几点：
1. 检查 `package.json` 中依赖是否正确
2. 确认引入路径是否正确
3. 确认是否引入了样式文件
4. 重启开发服务器

### Q: 样式不生效？

A: 确认是否正确引入了样式文件：
- React（默认主题）: `import '@ss/mtd-react3/lib/style/index.css'`
- React（黄色主题）: `import '@ss/mtd-react3/lib/style/theme-yellow.css'`
- Vue 2（默认主题）: `import '@ss/mtd-vue2/lib/theme-chalk/index.css'`
- Vue 2（黄色主题）: `import '@ss/mtd-vue2/lib/theme-yellow/index.css'`
- Vue 3（默认主题）: `import '@ss/mtd-vue3/lib/theme-chalk/index.css'`
- Vue 3（黄色主题）: `import '@ss/mtd-vue3/lib/theme-yellow/index.css'`

### Q: 如何确认项目使用哪个框架？

A: 检查 `package.json` 中的依赖：
- 包含 `react` → 使用 React 组件库
- 包含 `vue` 且版本为 2.x → 使用 Vue 2 组件库
- 包含 `vue` 且版本为 3.x → 使用 Vue 3 组件库

### Q: Vue 2 项目使用组合式 API 时报错？

A: 如果使用 Vue 2 且版本在 2.7 以下，需要额外引入 `@vue/composition-api`：

```javascript
import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';

Vue.use(VueCompositionApi);
```

Vue 2.7 及以上版本已经内置了组合式 API，无需额外引入。

---

## 更多资源

- **组件列表**：查看 `component_name.md` 了解所有可用组件
- **使用注意事项**：查看 `precautions.md` 了解特殊组件的使用规则
