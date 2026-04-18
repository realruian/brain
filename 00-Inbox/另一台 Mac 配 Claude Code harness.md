---
tags:
  - 待办
  - Claude-Code
  - harness
date: 2026-04-18
status: todo
due: 2026-04-20
---

# 另一台 Mac 配 Claude Code harness

**计划执行**：2026-04-20（周一上班后）
**目标**：让公司那台 Mac 具备和家里这台一样的 harness（SessionStart Hook + 3 Skill + 全局 CLAUDE.md），这样在那台开 banner-generator-skill 时能享受自动上下文注入。

---

## 0. 前置检查（先跑一遍，确认起点）

```bash
# ① Claude Code 是否已装
which claude

# ② Brain vault 是否同步过来（iCloud 应该已经搞定）
ls ~/Brain/01-Projects/banner-generator-skill.md

# ③ 代码仓库目录 basename 是否等于 "banner-generator-skill"
#    SessionStart Hook 靠这个匹配笔记文件名
ls <banner-generator 所在父目录>
```

**basename 对不上怎么办**：要么改目录名、要么改家里这台的笔记名，两台必须统一。

---

## 1. 同步 ~/.claude/ 配置（方案 A：git，推荐）

Brain vault 同步不了 `~/.claude/`，需要单独处理。

### 在家里这台一次性做

```bash
cd ~/.claude
git init
cat > .gitignore <<'EOF'
*
!CLAUDE.md
!hooks/
!skills/
!settings.json
!.gitignore
EOF
git add -A
git commit -m "initial claude harness config"

# 推到 private repo（例：GitHub realruian/claude-config）
git remote add origin git@github.com:realruian/claude-config.git
git push -u origin main
```

### 在公司那台

```bash
# 备份那边已有的 ~/.claude/（如果有，防止丢 vibe-island 配置）
mv ~/.claude ~/.claude.bak.$(date +%Y%m%d)

# clone
git clone git@github.com:realruian/claude-config.git ~/.claude

# 脚本可执行
chmod +x ~/.claude/hooks/harness-session-start.sh
```

**settings.json 注意**：如果公司那台 `~/.claude.bak.*/settings.json` 里有独占配置（比如工作用的 MCP / 代理），需要从备份合并到新 `settings.json` 里，不要直接覆盖。

### 后续维护

任一台改配置（加 skill、改 Hook、更新 CLAUDE.md）后：

```bash
cd ~/.claude && git add -A && git commit -m "xxx" && git push
```

另一台：`cd ~/.claude && git pull`。

---

## 2. 同步方案 B（scp，临时应急不想开 repo 时）

```bash
# 从家里这台推过去（改 <work-mac> 为公司 Mac 主机名/IP）
scp ~/.claude/CLAUDE.md <work-mac>:~/.claude/
scp -r ~/.claude/hooks <work-mac>:~/.claude/
scp -r ~/.claude/skills <work-mac>:~/.claude/
# settings.json 手动合并，不要直接覆盖
```

缺点：改一次手动同步一次，容易不一致。能接 git 就走方案 A。

---

## 3. 验证 Hook 生效

```bash
cd <banner-generator 路径>
claude
```

对 Claude 说「这个项目现在什么状态？」→ 如果它能同时说出：
- 最近几次 git log
- banner-generator-skill.md 里的业务描述（四种资源位…）

→ ✅ Hook 工作正常。

不生效的排查步骤见 [[02-Areas/Claude-Code/Claude Code Harness 自动化工具使用]] 第 6 节。

---

## 4. 完成后回到家里这台补的事

- [ ] 在 `~/Brain/CLAUDE.md` 当前项目的 banner-generator 那行补上代码路径：`代码仓库: <公司 Mac 绝对路径>`
- [ ] 在 [[01-Projects/banner-generator-skill]] 里补一句"代码仓库在公司 Mac"，免得将来自己找不着
- [ ] 试一次跨机器协作：公司那台改了代码 commit，家里这台读笔记时 Claude 能不能反映最新状态（如果 code 没 push 到共享 repo，就不能）

---

## 5. 可能卡住的点（预读）

- **GitHub SSH key 在公司 Mac 上没配好** → `git clone` 会卡，提前确认 `ssh -T git@github.com` 能过
- **公司 Mac 的 `~/.claude/` 里本来就有东西**（比如 vibe-island 之类的 bridge）→ 走 git clone 前务必备份，不然丢配置
- **iCloud Brain vault 同步没完成** → 到公司先等一会儿让 iCloud 拉完整，别在半同步状态开始改
- **macOS 权限弹窗** → 首次运行 Hook 脚本可能被 Gatekeeper 拦，`chmod +x` 后运行一次看有没有弹窗
