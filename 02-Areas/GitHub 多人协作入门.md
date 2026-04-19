---
tags:
  - git
  - github
  - 协作
  - 入门
date: 2026-04-19
---

# GitHub 多人协作入门

面向"第一次和别人在同一个 repo 上协作"的场景。重点讲清楚**概念之间的关系**和**典型工作流**，而不是穷举所有命令。

---

## 1. 核心概念

### 1.1 Repo（Repository，仓库）

一个装代码的文件夹，但它不只是文件夹——它记录了这个文件夹从第一天到今天的每一次修改，包括谁改的、什么时候改的、改了哪几行、为什么改（commit message）。

```
你的项目
  ├── src/             ← 当前的代码文件
  ├── package.json
  └── .git/            ← 隐藏目录：完整的历史账本
```

`.git/` 里存着**所有历史快照**（每次 commit 都是一个完整的代码版本）、分支指针、远程仓库配置。删了 `.git/`，这个目录就退化成普通的代码文件夹，git 不再认识它。

**两种存在形式**：

- **本地 repo**：你电脑上的目录（比如 `~/Dev/Personal-website`）
- **远程 repo**：GitHub 上的同名副本（比如 `github.com/realruian/personal-os`）

两者**不是自动同步的**，靠 `git push`（本地 → 远程）和 `git pull`（远程 → 本地）明确操作来传。本地 commit 了但没 push，GitHub 上看不到——这是新人最常见的困惑来源。

一个本地 repo 可以关联多个远程（叫 remote），默认名字是 `origin`。fork 场景下会出现第二个 remote 叫 `upstream`，指向原作者的 repo。

### 1.2 Branch（分支）

分支是**同一个 repo 内的平行工作线**。`main`（或 `master`）是默认分支，代表"正式版本"，其他分支是进行中的改动。

```
main 主干：     A ──── B ──── C ──── D ──────────── M
                                \                    /
feature 分支：                   └─ X ── Y ── Z ────┘
                                 在这里改，不影响 main
                                                     ↑
                                                 合并回 main
```

**为什么要分支**：两人直接往 `main` 推代码，必然互相覆盖，线上随时挂。分支是协作的前提——各自在自己的分支改，改好了再合并。

**分支命名习惯**：

- `feature/xxx` — 新功能
- `fix/xxx` — bug 修复
- `refactor/xxx` — 重构
- `docs/xxx` — 文档

### 1.3 Fork（复刻）

在 GitHub 服务端**把别人的仓库整个复制到你自己的账号下**，产生一个独立 repo。

```
github.com/author/app  ──fork──▶  github.com/you/app
    （原版）                         （你的副本，独立存在）
```

几个容易忽略的细节：

- Fork 是 **GitHub 这个网站的功能**，不是 git 本身的概念。git 命令里没有 `git fork`，git 只看到两个地址不同的 repo，不知道谁是谁的 fork
- Fork 之后，原 repo 和你的 fork **不会自动同步**。原作者更新了，你的 fork 停留在 fork 那一刻的状态，要手动拉更新
- Fork 本质是**权限的解决方案**：你对别人的 repo 没有写权限 push 不上去，但 fork 出来的副本在你账号下，你有完全控制权

**什么时候用**：

- 给开源项目贡献代码（你不可能有 `facebook/react` 的写权限）
- 对方没把你加 collaborator，但你还是想改

**什么时候不用**：

- 对方把你加成 collaborator 了 → 直接 clone 原 repo，不需要 fork
- 小团队 / 两人协作场景，基本用不到 fork

### 1.4 PR（Pull Request，拉取请求）

一个正式的提议：**"我改好了 A 分支的代码，请求你把它合并到 B 分支"**。

PR 的本质是 **GitHub 网页上的一个页面**，不是 git 命令。git 自己有 `git merge` 做分支合并，但它是"本地直接合，无讨论、无记录"。PR 是 GitHub 在 merge 之外加的一层协作流程——把"改代码"和"审代码、讨论、决策是否合并"分开。

**一个 PR 页面包含四块**：

1. **分支信息**：从哪个分支合到哪个分支（比如 `feature/login` → `main`）
2. **Commits 列表**：这个 PR 包含你的哪几次提交
3. **Files changed**：逐行 diff，绿色是新增、红色是删除
4. **Conversation**：review 评论、行内评论、CI 自动测试结果、最后的 Merge 按钮

**PR 能做到而 `git merge` 做不到的**：

- 合并前有**审核窗口**，强制过一遍另一双眼
- 讨论过程**永久留痕**，未来回查"为什么当初这么改"能翻出上下文
- 可以接 CI（自动跑测试、lint），不过就 merge 不了
- 可以设置规则（比如 `main` 必须经过 PR 才能改，禁止直接 push）

**Merge 的三种策略**（点 Merge 按钮时可选）：

| 策略 | 效果 | 适用场景 |
|------|------|---------|
| Merge commit | 保留 PR 所有 commits + 一个合并节点 | 想保留完整开发轨迹 |
| Squash and merge | 把 PR 所有 commits 压成一个，合到 main | 一个 PR = 一个功能，历史干净 |
| Rebase and merge | 把 commits 一个个嫁接到 main，无合并节点 | 追求线性历史 |

**新人默认选 Squash**，最省心。

---

## 2. 两种协作模式

### 模式 A：同 repo + collaborator（小团队推荐）

**前提**：repo 所有者把你加成 collaborator（Settings → Collaborators）。

```
你和朋友都 clone 同一个 repo
各自开分支 → 改代码 → push 到同一个 repo
→ 发 PR（source: feature/xxx, target: main）→ review → merge
```

**适用**：

- 两人做同一个产品
- 公司内部团队
- 熟人合作

### 模式 B：Fork + PR（开源 / 无写权限）

```
你 fork 原 repo 到自己账号 → clone 你的 fork 到本地
→ 开分支 → 改代码 → push 到你的 fork
→ 跨 repo 发 PR（从你的 fork 的 feature 分支，
                 到原 repo 的 main 分支）
→ 原作者 review → merge 到原 repo
```

**适用**：

- 给开源项目贡献
- 对方没给你 collaborator 权限
- 陌生人协作

---

## 3. 典型工作流（模式 A，最常见）

### 3.1 一次性设置

```bash
# 让朋友把你加成 collaborator（GitHub 网页操作）
# Settings → Collaborators → 输入你的 GitHub 用户名 → Add

# 你收到邀请邮件，点接受

# clone 到本地
git clone git@github.com:朋友的用户名/repo名.git
cd repo名

# 确认关联正确
git remote -v
# 应该看到：
#   origin  git@github.com:朋友的用户名/repo名.git (fetch)
#   origin  git@github.com:朋友的用户名/repo名.git (push)
```

### 3.2 日常开发循环

```bash
# 1. 开始干活前，先切回 main 拉最新
git checkout main
git pull

# 2. 开一个新分支
git checkout -b feature/登录页样式

# 3. 改代码，随时提交
git add .
git commit -m "统一登录按钮颜色为品牌色"

# ... 继续改 ... 继续 commit ...

# 4. 推到远程
git push -u origin feature/登录页样式
# -u 只第一次 push 时需要，建立本地和远程分支的关联
# 之后这个分支直接 git push 就行
```

### 3.3 发 PR

推完后 GitHub 页面顶部会冒出 "Compare & pull request" 按钮：

1. 点击它
2. 填写标题（比如"登录页样式调整"）
3. 填写描述（改了什么、为什么改、怎么测试）
4. 右侧 Reviewers 选朋友
5. 点 Create pull request

### 3.4 Review 循环

- 朋友看完，在行内留评论
- 你本地改代码 → `git add` → `git commit` → `git push`
- **PR 页面自动刷新**，新 commit 追加进来，无需重开 PR
- 直到朋友点 Approve → 合并

### 3.5 合并与收尾

```bash
# 朋友在 GitHub 网页点 "Squash and merge" → Confirm
# 网页会提示 "Delete branch" → 点掉

# 你本地清理
git checkout main
git pull                         # 拉取合并后的 main
git branch -d feature/登录页样式  # 删除本地分支
```

---

## 4. 冲突（conflict）怎么处理

冲突发生在**两个分支改了同一个文件的同一行**时。最常见的触发场景：你在你的分支改了 A 文件第 23 行，朋友在他的分支也改了 A 文件第 23 行，先合并的那个顺利，第二个合并时 git 不知道该保留谁的。

### 冲突的典型触发

```bash
git pull
# 或
git merge main
```

输出会有 `CONFLICT (content): Merge conflict in xxx.js`。

### 解决步骤

1. 打开冲突文件，找 `<<<<<<<` / `=======` / `>>>>>>>` 标记：

   ```
   <<<<<<< HEAD
   你的改动
   =======
   对方的改动
   >>>>>>> main
   ```

2. 手动决定保留什么——可能是保留一方、可能是两方合并、可能是写一个新版本。**把 `<<<<<<<`、`=======`、`>>>>>>>` 这三行也删掉**
3. 保存文件
4. 告诉 git 冲突解决完了：

   ```bash
   git add 冲突文件
   git commit           # 无需写 message，git 会自动用默认的
   # 或如果是 rebase 过程中：
   git rebase --continue
   ```

### 降低冲突概率

- 分支开得短命（一两天就合并，别拖一周）
- 改动前先 `git pull` 拉最新
- 一个分支只做一件事（冲突范围小）
- 两人提前沟通各自负责哪些文件

---

## 5. 常见坑（先知道）

| 坑 | 后果 | 正确做法 |
|----|------|---------|
| 直接往 `main` 推代码 | 跳过 review，破坏主干 | 永远开分支 + PR |
| 开始改前不 `git pull` | push 时必然冲突 | 切分支前先拉 main |
| 一个分支塞多个功能 | review 困难、回滚困难 | 一分支一事 |
| commit message 写 "update"、"fix" | 将来看不懂历史 | 写清楚"改了什么、为什么" |
| `git push --force` | 覆盖对方的工作 | 协作时绝对不用，实在要用前先沟通 |
| 忘了 push 就换电脑 | 新电脑看不到本地 commit | 每天结束前 push 一次 |
| `.env`、密钥文件被提交 | 敏感信息泄露 | 用 `.gitignore` 过滤 |

---

## 6. 身份配置（第一次用 git 的前置）

### 6.1 配置 user.name 和 user.email

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱@example.com"
```

这个邮箱最好和 GitHub 账号的邮箱一致，否则 GitHub 上显示的提交头像会是空白。

### 6.2 配置 SSH key（推荐，免密 push/pull）

```bash
# 生成 key（一路回车接受默认）
ssh-keygen -t ed25519 -C "你的邮箱"

# 复制公钥
pbcopy < ~/.ssh/id_ed25519.pub   # macOS

# 粘贴到 GitHub → Settings → SSH and GPG keys → New SSH key

# 验证
ssh -T git@github.com
# 首次连接问 yes/no，输 yes
# 看到 "Hi username! You've successfully authenticated..." 即成功
```

SSH 配好后，clone 用 `git@github.com:xxx/yyy.git` 格式（不是 `https://`），不再需要每次输密码。

---

## 7. 快速命令速查

```bash
# 查看状态
git status                  # 当前有什么未提交的改动
git log --oneline -10       # 最近 10 次提交
git branch                  # 本地分支列表
git branch -r               # 远程分支列表
git remote -v               # 关联的远程仓库

# 分支操作
git checkout -b 分支名      # 新建并切换到分支
git checkout 分支名         # 切换到已存在的分支
git branch -d 分支名        # 删除已合并的分支
git branch -D 分支名        # 强制删除未合并的分支

# 同步
git pull                    # 拉取当前分支的最新
git push                    # 推送当前分支
git push -u origin 分支名   # 首次推送新分支（建立关联）
git fetch                   # 只拉取远程状态，不合并

# 提交
git add 文件                # 把某个文件加入暂存区
git add .                   # 加入所有改动
git commit -m "描述"        # 提交暂存区的改动
git commit --amend          # 修改最近一次提交（仅限没 push 时）

# 撤销
git restore 文件            # 丢弃文件未提交的改动
git reset HEAD 文件         # 从暂存区移除，但保留改动
git reset --hard HEAD       # ⚠️ 丢弃所有未提交改动，不可恢复
```

---

## 8. 进阶方向（挑需要的学）

- **`.gitignore` 写法**：哪些文件不该提交（`node_modules/`、`.env`、编译产物）
- **Rebase vs Merge**：整理历史的两种思路
- **Git hooks**：本地 commit / push 前自动跑检查（pre-commit、pre-push）
- **Protected branches**：在 GitHub 上给 `main` 加保护（禁止直接 push、必须 PR）
- **GitHub Actions**：CI 自动化，PR 提交后自动跑测试
- **Stash**：临时保存未提交改动去干别的事（`git stash` / `git stash pop`）
- **Cherry-pick**：把某个分支的某个 commit 精准摘到当前分支
- **Reflog**：找回意外丢失的 commit（`git reflog` 是救命稻草）

---

## 9. 快速判断清单

遇到具体问题时先问自己：

- **要改代码了** → 现在在哪个分支？是 main 吗？→ 是的话先开新分支
- **push 被拒** → 远程有新 commit？→ 先 pull，处理完冲突再 push
- **想撤销一次 commit** → 已经 push 了没？→ 没 push 用 `git reset`，已 push 用 `git revert`
- **改了文件但不想要了** → `git restore 文件`（丢弃）或 `git stash`（先存着）
- **找不到某个文件哪次被改了** → `git log -p 文件路径` 看这个文件的完整变更史
- **误删一个分支** → `git reflog` 找回对应 commit hash，重新建分支
