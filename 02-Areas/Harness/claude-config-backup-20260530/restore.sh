#!/usr/bin/env bash
# 还原脚本：把 2026-05-30 讲课前备份的 Claude Code 个人配置原样覆盖回 ~/.claude/
# 用法：
#   bash ~/Brain/02-Areas/Harness/claude-config-backup-20260530/restore.sh
# 或在新开的 Claude Code 里说「装回去」让它替你跑。
set -euo pipefail

BACKUP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_DIR="$HOME/.claude"

echo "从 $BACKUP_DIR 还原到 $CLAUDE_DIR ..."

cp -f "$BACKUP_DIR/CLAUDE.md" "$CLAUDE_DIR/CLAUDE.md"

mkdir -p "$CLAUDE_DIR/hooks"
cp -f "$BACKUP_DIR/harness-session-start.sh" "$CLAUDE_DIR/hooks/harness-session-start.sh"
chmod +x "$CLAUDE_DIR/hooks/harness-session-start.sh"

cp -f "$BACKUP_DIR/settings.json" "$CLAUDE_DIR/settings.json"

echo "✅ 已还原 CLAUDE.md / hooks/harness-session-start.sh / settings.json"
echo "⚠️  请重启 Claude Code 让配置生效。"
