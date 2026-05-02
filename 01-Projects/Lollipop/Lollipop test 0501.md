  大部分（2 块）

  1. Hero AI 对话框（AnimatedAIChat）

  位于页面顶部 pt-[120px]，居中。内部分 3 个小部分：

  - a. 标题区：彩虹渐变大标题「告诉 Lollipop 你想面试的岗位」+ 副标题「告诉 Lollipop 目标岗位 + 面试官 +
   难度，AI 立刻定制你的面试」
  - b. 输入框卡片：textarea + 附件 chip 区 + 底部 toolbar（左「上传自定义 JD」按钮 / 右「发送」按钮）
  - c. 建议 pills 行：4 个预设话术（字节豆包终面 / Kimi 训练师 / HR 终面 / 上传 JD 直接开始），点击注入
  textarea

  2. 岗位广场（<section> w/ mt-24）

  分 4 个小部分：

  - a. 区块标题「岗位广场」（18px DemiBold）
  - b. 筛选栏（一行）：
    - 左侧：专长 tab 组（不限 / TOB / TOC / 多模态 / Agent / 商业化 / RAG / 视频，AI
  训练师切换则换一组）
    - 右侧：两个下拉（岗位 = AI 产品经理 / AI 训练师；求职方向 = 正岗 / 实习）
  - c. 卡片网格（4 列）：BossJobCard 列表，初次 24 张
  - d. 滚动哨兵 + 状态文案：sentinel 触发分页加载；loadingMore 时显示「加载中...」，!hasMore 时显示「共
  N 个岗位」

  浮层（按需弹出，非常驻）

  - JD 详情模态：点击 BossJobCard 时打开，含公司信息行、tags、3 列基础信息卡（经验/学历/规模）、JD
  详情正文、底部「关闭 / 开始面试」按钮

  页面外的常驻 UI（左侧 sidebar、背景视频、右上 AI 栏）由 (app)/layout.tsx 提供，不属于 jobs 页本身。