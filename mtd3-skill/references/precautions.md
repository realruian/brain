# React组件库（@ss/mtd-react3）部分组件注意事项
- Grid组件其实是Row组件和Col组件的组件叫法。Grid组件的引入方式为 `import { Row, Col } from '@ss/mtd-react3'`并不是引入Grid对象，这一点必须注意！
- Textarea 组件不是独立组件，而是 Input 组件的子组件，需要通过 `Input.TextArea` 或解构 `const { TextArea } = Input` 的方式使用；正确引入：`import { Input } from '@ss/mtd-react3'; const { TextArea } = Input;`；不能直接 `import { TextArea } from '@ss/mtd-react3'`，这样会导致组件未定义错误；组件名称为 `TextArea`（驼峰命名），而非 `Textarea` 或 `textarea`。
- message、notification这两个组件比较特殊，它们的引入和使用都是小写：`import { message, notification } from '@ss/mtd-react3'`，这一点必须注意！
- RangePicker(日期范围选择)组件的引入方式为：`import { RangePicker } from '@ss/mtd-react3'`。
- Form第一层节点仅支持表单项Form.Item组件，如果第一层节点使用了其他组件，那么需要给Form组件设置useContext属性。
- FormItem中只允许包含一个使用toFormItem的组件，toFormItem与onChange是互斥的，不能同时存在。
- Tabs组件的子组件 TabPan在设置标题的时候使用的是label属性！如：`<TabPane label="基础型" key="1" />`。 

# Vue组件库（@ss/mtd-vue2、@ss/mtd-vue3）部分组件注意事项
- message、notification、confirm这三个组件比较特殊，它们的使用方式为：this.$mtd.message({ message: '消息',..... })、this.$mtd.notify({ message: '消息',......})、this.$mtd.confirm({message: '消息', ......})。