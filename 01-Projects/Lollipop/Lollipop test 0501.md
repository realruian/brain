  1. 左侧 简历侧栏 (ResumeSidebar)
  2. 中间 AI 对话区 (AnimatedAIChat)，内部 4 个子块：
    - Hero 标题（"告诉 Lollipop 你想面试的岗位" + 副标题）
    - Chat 输入框（textarea + 附件 tag 区 + 工具栏 [上传 JD / 发送]）
    - 4 个建议 pills（字节豆包终面、Kimi 压力面、HR 终面、上传 JD 直接开始）
    - Typing toast（发送中才出现的悬浮提示）

  代码里有但被开关折叠（SHOW_JOBS_GRID = true 才渲染）

  - 浏览全部岗位 header（搜索框 + 上传JD 入口）
  - Tabs（岗位广场 / 我的 JD）+ 主筛选行
  - 高级筛选折叠区
  - 岗位类型 chips
  - 岗位卡片网格 + 分页
  - PersonalPanel（我的 JD 视图）
  - 上传 JD 模态、JD 详情模态