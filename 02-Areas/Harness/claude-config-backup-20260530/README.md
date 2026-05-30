# Claude Code 个人配置备份（讲课临时存档）

**创建时间**：2026-05-30
**用途**：明天讲课前，把个人 Claude Code 配置临时移走，让本机表现得和同学的全新安装一致；讲完再还原。

## 这里存了什么

| 文件 | 对应原始路径 |
|------|--------------|
| `CLAUDE.md` | `~/.claude/CLAUDE.md`（全局规则：中文回复、验证规则、经验教训等） |
| `harness-session-start.sh` | `~/.claude/hooks/harness-session-start.sh`（SessionStart 脚本，原本未接线） |
| `settings.json` | `~/.claude/settings.json`（完整 pristine 副本，含 vibe-island hooks / statusLine / claude-hud） |
| `restore.sh` | 一键还原脚本 |

## 讲课时本机做了哪些「中性化」改动

1. 移除了 `~/.claude/CLAUDE.md`
2. 移除了 `~/.claude/hooks/harness-session-start.sh`
3. 编辑了 `~/.claude/settings.json`：
   - 删除 `hooks`（整套 vibe-island 桥接）
   - 删除 `statusLine`（vibe-island 状态栏）
   - `enabledPlugins` 里 `claude-hud@claude-hud` 改为 `false`
   - 其余（env / permissions / theme / 其他插件 / skipAutoPermissionPrompt）保留不变

**未改动**：`settings.local.json`、`skills/`、`commands/`。

## 怎么还原（讲完课后）

任选其一：

- **在 Claude Code 里**：新开一个会话，说「装回去」即可。
- **直接在终端**：
  ```bash
  bash ~/Brain/02-Areas/Harness/claude-config-backup-20260530/restore.sh
  ```

还原后**重启一次 Claude Code** 让配置生效。
