![[Pasted image 20260420153711.png]]
![[Pasted image 20260420153620.png]]根目录/
├── .claude/                          # CC 配置目录
│   └──  CLAUDE.md                   	 	# 项目级 Claude 指令(引用 AGENTS.md)
│
├── AGENTS.md                         # 📌 文档索引总入口(自动生成)
│
└── .mdp/                             # 规则仓库主目录
    ├── knowledge/                      # 📘 业务知识文档目录（如需）
    │   └── (自定义业务知识文档.md)
    │
    ├── rules/                        # 编码规范文档目录
    │   ├── company/                  # 公司级规则
    │   │   ├── java/                 # Java 编码规范
    │   │   │   ├── code-style.md            # 代码风格与命名规范
    │   │   │   ├── exception-handling.md    # 异常处理规范
    │   │   │   └── logging.md               # 日志记录规范
    │   │   │
    │   │   ├── design/                  # 设计规范
    │   │   │   ├── page-guidelines.md          # 页面规范
    │   │   │   ├── module-guidelines.md        # 模块规范   
    │   │   │   ├── component-guidelines.md     # 组件使用规范
    │   │   │   └── atomic-guidelines.md        # 原子规范
    │   │   │
    │   │   └── template/                # 文档模板
    │   │       ├── prd-template.md             # 结构化 PRD 模板
    │   │       ├── acceptance-criteria.md      # 需求验收标准
    │   │       ├── tech-design-template.md     # 技术方案模板
    │   │       ├── release-checklist.md        # 发布检查清单
    │   │       └── retrospective-template.md   # 复盘模板
    │   │
    │   ├── team/                     # 团队级规则
    │   │   └── (自定义团队规则)
    │   │
    │   └── project/                  # 项目级规则
    │       └── (自定义项目规则)
    │
    └── skills/                        # 可使用的技能
         ├── tool-setup                # 工具配置
         ├── project-setup             # 项目配置
         ├── troubleshooting           # 故障排查与处理
         ├── local-debug               # 本地调试流程
         ├── qa-handoff                # 提测流程
         ├── testing                   # 测试流程
         └── release                   # 项目发布流程
         └── ui-design                 # ui设计流程
         	 └── SKILL.md                # 主skill描述，包含意图理解、生成规则、组件调用配置、美学约束等
           └── component.md            # 分子级组件使用指南
           └── ……
         ![[Pasted image 20260420153707.png]]