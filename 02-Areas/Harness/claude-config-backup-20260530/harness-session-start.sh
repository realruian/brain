#!/usr/bin/env bash
# harness-session-start.sh
# Claude Code SessionStart hook —— 自动恢复项目上下文
# 注入：git 状态 + 最近提交 + Obsidian 项目笔记
#
# 约定：Obsidian 笔记名 = 当前目录 basename（例 design-studio → design-studio.md）

cwd="$(pwd)"
base="$(basename "$cwd")"
brain="$HOME/Brain"
note="$brain/01-Projects/${base}.md"

# 非 git 仓库 / 非项目目录直接跳过，不污染上下文
if ! git rev-parse --git-dir >/dev/null 2>&1; then
  exit 0
fi

echo "## 🔄 会话启动上下文（自动注入）"
echo ""
echo "**当前目录**: \`$cwd\`"
echo ""

# 1. Git 状态
echo "**Git 状态**:"
echo '```'
git status --short 2>/dev/null | head -20
status_count=$(git status --short 2>/dev/null | wc -l | tr -d ' ')
if [[ "$status_count" -gt 20 ]]; then
  echo "... (还有 $((status_count - 20)) 条变动未显示)"
fi
echo '```'
echo ""

# 2. 最近提交
echo "**最近 10 次提交**:"
echo '```'
git log --oneline -10 2>/dev/null || echo "(无提交记录)"
echo '```'
echo ""

# 3. Obsidian 项目笔记
if [[ -f "$note" ]]; then
  echo "**Obsidian 项目笔记** (\`01-Projects/${base}.md\`):"
  echo '```markdown'
  cat "$note"
  echo '```'
else
  # 检查是否在 Brain CLAUDE.md 登记过
  brain_cm="$brain/CLAUDE.md"
  short_cwd="${cwd/#$HOME/\~}"
  if [[ -f "$brain_cm" ]] && grep -qF "$short_cwd" "$brain_cm" 2>/dev/null; then
    echo "> ⚠️ 项目已在 \`~/Brain/CLAUDE.md\` 登记，但 \`01-Projects/${base}.md\` 不存在。建议新建项目笔记。"
  else
    echo "> ℹ️ 项目未在 \`~/Brain/CLAUDE.md\` 登记，也没有对应项目笔记。建议先完成 harness 三步仪式。"
  fi
fi
