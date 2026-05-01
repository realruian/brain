# Ghostty - Claude Code 最佳实践版
# 目标：清晰、稳定、低干扰，适合长时间终端工作

# 字体
font-family = "JetBrainsMono Nerd Font"
font-size = 18
adjust-cell-height = 2
font-thicken = true

# 主题：固定使用暗色主题
# 可按需替换为你喜欢的主题名
theme = Catppuccin Mocha
window-theme = dark

# 窗口：清晰优先，避免透明和模糊影响可读性
window-padding-x = 10
window-padding-y = 8
window-save-state = always

# 光标与鼠标
cursor-style = bar
cursor-style-blink = true
mouse-hide-while-typing = true
copy-on-select = clipboard

# 安全与 shell 集成
clipboard-paste-protection = true
clipboard-paste-bracketed-safe = true
shell-integration = detect

# 滚动历史：足够长，方便查看 Claude Code 长输出
scrollback-limit = 25000000

# 快捷键：保留高频能力，减少冲突
keybind = cmd+t=new_tab
keybind = cmd+w=close_surface
keybind = cmd+shift+left=previous_tab
keybind = cmd+shift+right=next_tab
keybind = cmd+d=new_split:right
keybind = cmd+shift+d=new_split:down
keybind = cmd+shift+j=goto_split:left
keybind = cmd+shift+k=goto_split:right
keybind = cmd+shift+h=goto_split:top
keybind = cmd+shift+l=goto_split:bottom
keybind = cmd+shift+r=equalize_splits
keybind = cmd+shift+f=toggle_split_zoom
keybind = cmd+plus=increase_font_size:1
keybind = cmd+minus=decrease_font_size:1
keybind = cmd+zero=reset_font_size
keybind = cmd+shift+comma=reload_config

# 下拉终端
keybind = global:cmd+backquote=toggle_quick_terminal
quick-terminal-position = top
quick-terminal-size = 50%
quick-terminal-autohide = true
quick-terminal-animation-duration = 0.15

# 说明：
# 1. 未启用透明/模糊，优先保证文字清晰度。
# 2. 已启用 Quick Terminal 全局热键，可用 cmd+` 唤醒。