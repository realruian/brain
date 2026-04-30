### 一、为什么需要协作流程

**核心目标**：让两个人各自工作互不干扰，又能确保产品始终可发布、改动可追溯、出问题可回滚。

业界 2026 年共识：项目复杂度上来后（前后端 + 数据库 + 第三方 API + CI 部署），没有 PR 流程是定时炸弹。Google、Meta、字节这种几千人团队也在用同样的核心流程，差别只在自动化程度。

---

### 二、采用的流程：GitHub Flow + 一条 staging 分支

业界标准选项有三个，给你们选 GitHub Flow 的理由：

|流程|适用|是否推荐你们用|
|---|---|---|
|**Git Flow**|大团队、版本化软件（如桌面应用）、多版本并存|❌ 太重，2 人用是过度工程|
|**GitHub Flow**|持续部署的 Web 应用、小到中型团队|✅ 推荐|
|**Trunk-Based Development**|高频部署、强自动化测试团队|⏸ 等团队成熟再考虑|

#### 你们的分支模型

```
main         生产线上, 永远稳定可发布, 部署到生产环境
test         集成验证分支, 多个改动合在一起跑一段时间
feat/xxx     新功能开发
fix/xxx      bug 修复
style/xxx    样式 / UI 调整
hotfix/xxx   紧急修复 (跳过 test 直接合 main)
chore/xxx    构建配置 / 依赖升级 / 文档等杂项
```

**关键约定**：

- `main` 上的每个 commit 都应该是可发布状态
- `test` 是部署到 staging 环境的（不是 main）
- `main` 出现的 commit 一定经过 PR 审核
- 功能分支是短命的（生命周期 1-3 天），合并后立即删除

---

### 三、完整工作流（每次改动都走这套）

```
1. 同步最新主干
   git checkout main && git pull

2. 开新分支 (一条分支一个目的)
   git checkout -b feat/landing-cta-redesign

3. 本地开发
   改代码 → 多次 commit → push origin feat/landing-cta-redesign

4. 在 GitHub 网页上提 PR
   源: feat/landing-cta-redesign  →  目标: test (或 main)
   按 PR 模板填写

5. CI 自动运行
   typecheck / lint / build / 测试
   失败必须修, 不能合

6. Code Review (另一人审)
   在 PR 页面逐行看 diff
   评论提建议
   作者修 → push → PR 自动更新

7. 合并 (Reviewer 点 Merge 按钮)
   选合并方式 (推荐 Squash and merge)
   远程分支自动删除

8. 清理本地
   git checkout main && git pull
   git branch -d feat/landing-cta-redesign
```

---

### 四、八条核心规则

|#|规则|违反后果|
|---|---|---|
|1|`main` / `test` 禁止直接 push, 只能通过 PR|主干被污染, 没法回溯|
|2|一条分支一个目的, 不混合多个改动|PR 难审, 出问题难定位|
|3|PR 控制在 **400 行以内**, 大改动拆成多个 PR|超过 400 行 review 质量陡降|
|4|别人的分支不能直接 rebase / force-push|协作者本地状态错乱, 容易丢 commit|
|5|自己的 PR 分支可以 rebase, push 用 `--force-with-lease` 不要 `--force`|误覆盖别人的工作|
|6|Reviewer 至少 1 人审过, 不能自审自合|形同虚设, 等于没审|
|7|CI 失败的 PR 不能合并|把已知 bug 合进主干|
|8|合并后立即删除 feature 分支|分支堆积, 谁也搞不清哪条还有用|

---

### 五、Commit Message 规范：Conventional Commits

业界事实标准（NPM 生态 94.5% 在用），格式：

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

#### Type 清单

|Type|用途|例子|
|---|---|---|
|`feat`|新功能|`feat(landing): 新增团队成员卡片`|
|`fix`|bug 修复|`fix(auth): 修登录后 token 没清`|
|`style`|样式 / 格式（不改行为）|`style(landing): 调整 CTA 按钮间距`|
|`refactor`|重构（不改行为也不改样式）|`refactor(api): 拆分 admin 路由文件`|
|`perf`|性能优化|`perf(report): 减少首屏渲染时间`|
|`docs`|文档|`docs: 更新 CLAUDE.md 字重规则`|
|`test`|测试|`test(interview): 补 WS 断线重连测试`|
|`chore`|构建 / 工具 / 依赖等|`chore: 升级 next 到 16.0.3`|
|`ci`|CI 配置|`ci: 加 typecheck workflow`|

#### 写作要点

- 描述用**祈使句**："add" 不要 "added"，"修" 不要 "修了"
- 标题 ≤ 50 字符（截断阈值），详细解释放 body
- body 写 **why**（为什么这么改），不写 what（what 看 diff 就行）
- 重大破坏性改动用 `feat!:` 或在 footer 加 `BREAKING CHANGE:`

#### 例子

```
✅ 好

feat(landing): 改用单列 CTA 设计

原有左右两栏 CTA 在移动端被压缩, 转化率监测下降 12%。
改成单列居中 CTA, 桌面端居中显示, 移动端自然全宽。

Closes #87
```

```
❌ 差

修了点东西
update page.tsx
WIP
```

---

### 六、PR 标题与描述规范

#### 标题（与 commit 同规范）

```
feat(landing): 改用单列 CTA 设计
```

#### 描述模板

放在仓库 `.github/pull_request_template.md`，每次开 PR 自动加载：

markdown

```markdown
## 这个 PR 改了什么
<!-- 2-3 句话, 不要复制 commit message -->

## 为什么这么改
<!-- 业务动机 / 技术动机 / 关联的 issue 或讨论 -->

## 怎么测试
<!-- Reviewer 拉下来后怎么验证, 步骤要可复现 -->

## 截图（UI 改动必填）
<!-- 改前 / 改后对比图 -->

## 检查清单
- [ ] 已本地 npm run build 通过
- [ ] 已本地 typecheck 通过 (npx tsc --noEmit)
- [ ] 已本地 lint 通过
- [ ] 已自测主要用户路径
- [ ] 已加 / 更新相关测试 (如适用)
- [ ] 已更新文档 (如适用)
```

---

### 七、Code Review 实践

#### Reviewer 的态度

- **审代码不审人**："这个函数有点难懂" 而不是 "你写得有点乱"
- **多问问题，少下断言**："这里 user 为 null 时会怎么样？" 而不是 "这里有 bug"
- **区分必改和建议**：用前缀标明严重程度

#### 评论前缀约定

|前缀|含义|例子|
|---|---|---|
|`[BLOCKING]`|必须改, 否则不能合|`[BLOCKING] 这里会有内存泄漏`|
|`[NIT]`|小毛病, 改不改都行|`[NIT] 变量名可以更清晰点`|
|`[QUESTION]`|想搞懂, 不一定要改|`[QUESTION] 为什么用 useEffect 而不是 useMemo?`|
|`[SUGGESTION]`|建议但不强求|`[SUGGESTION] 可以抽成一个 hook`|

#### Author 的回应

- 同意就改，不同意就解释，**不要默默关掉评论**
- 改完在评论下回 "done" 或 "fixed in xxxxx"
- 用 GitHub 的 "Resolve conversation" 标记已处理

---

### 八、GitHub 端配置（必做）

你们 GitHub Settings 里要配的硬性约束。配完之后 git 会拒绝违规操作，不依赖人的自觉。

#### 8.1 Branch Protection Rules

路径：`Settings → Branches → Add rule`

**给 `main` 和 `test` 各配一份**：

```
Branch name pattern: main  (然后再加一条 test)

✅ Require a pull request before merging
   ✅ Required approvals: 1
       ⚠️ 你们 2 人, 写 1 不要写 2
   ✅ Dismiss stale pull request approvals when new commits are pushed
   ⬜ Require review from Code Owners (现在不用, 项目大了再加)
   ✅ Require approval of the most recent reviewable push

✅ Require status checks to pass before merging
   ✅ Require branches to be up to date before merging
   要求通过的 checks (从你们已有 CI 选):
     - build (frontend)
     - typecheck
     - lint
     - ruff (backend)

✅ Require conversation resolution before merging

✅ Require linear history
   (强制 squash 或 rebase 合并, 历史更干净)

⬜ Require signed commits (你们暂时不需要)

⬜ Require deployments to succeed (没配自动部署就不开)

✅ Do not allow bypassing the above settings
   (管理员也要遵守)

Push 限制:
   ✅ 默认就禁用 force push (不要勾 Allow force pushes)
   ✅ 不要勾 Allow deletions
```

#### 8.2 默认合并方式

路径：`Settings → General → Pull Requests`

```
✅ Allow squash merging  ← 推荐默认用这个
⬜ Allow merge commits
⬜ Allow rebase merging

✅ Always suggest updating pull request branches
✅ Automatically delete head branches  (合并后自动删分支)
```

**为什么默认选 squash merge**：

- 主干历史一条直线，每个 commit 对应一个 PR，干净
- 你在 feature 分支上的 "WIP"、"修 typo" 等零碎 commit 会被压扁
- Conventional Commits 的 type 用 PR 标题就行

---

### 九、特殊场景处理

#### 9.1 紧急修复线上 bug

```
1. git checkout main && git pull
2. git checkout -b hotfix/login-broken
3. 修, commit, push
4. 开 PR: hotfix/login-broken → main (跳过 test)
5. 标 [URGENT], 对方 review
6. 合并 → 立即部署
7. 然后再合一份到 test, 让 test 同步
```

#### 9.2 对方正在改我也想改的文件

**先沟通，后动手**：

- 在 Slack/微信 / GitHub Issue 里问一句"你大概什么时候合？"
- 如果他快好了，等他合完再开始（一两小时内的事）
- 如果他还要好几天，开自己的 PR，提前预告"可能会有冲突，到时候我处理"
- **永远是后开 PR 的人解决冲突**，不是先开的人帮你 rebase

#### 9.3 对方需要你的某个改动但你 PR 还没合

```
你的 PR 还在 review 中, 对方等不及
方案: 让对方 cherry-pick 你那个 commit 到自己的分支
git cherry-pick <你的 commit hash>
```

#### 9.4 PR 拖太久变臃肿

PR 开了一周还没合，已经离 main 太远：

```
git checkout feat/xxx
git fetch origin
git rebase origin/main
解决冲突
git push --force-with-lease  ← 注意是 lease 不是 force
```

---

### 十、我们当前的差距与改进路线

#### 现状对照（截至 2026-04-30）

|标准规则|我们的状态|
|---|---|
|1. 禁止直接 push 主干|❌ test / main 都直接 push|
|2. 一条分支一个目的|❌ test 是混合工作区|
|3. PR 拆小 (≤400 行)|❌ 没用 PR|
|4. 别人分支不动|❌ 历史上有 force-push 别人分支的情况|
|5. force-push 用 lease|❌ 直接 force|
|6. Code Review|❌ 没有审查环节|
|7. CI gate|⚠️ CI 配了但不阻塞合并|
|8. 合并后删分支|❌ 历史分支堆积|
|9. Conventional Commits|✅ commit 风格已基本符合|
|10. PR 模板|❌ 没有|
|11. Branch Protection|❌ 没配|

#### 三阶段改进路线

##### 阶段 1：建立共识（本周）

**只靠两人约定，不动配置**：

- 规则 4：别人的分支不直接动
- 规则 1：合并到 test / main 走 PR
- 规则 2：一条分支一个目的

成本：聊一次，几分钟。  
解决：80% 的协作混乱。

##### 阶段 2：技术约束（一周内）

**在 GitHub Settings 里把规则变成硬约束**：

- 配 main 和 test 的 Branch Protection Rules（见第 8 节）
- 加 `.github/pull_request_template.md`
- 在 GitHub Settings 里默认开启 Squash merge + 自动删分支

成本：一次配置，30 分钟。  
解决：人忘记了系统也会拒绝违规。

##### 阶段 3：流程精进（一个月内）

**进一步规范化**：

- commit 规范工具化：commitlint + husky 强制校验
- PR 标题规范：semantic PR 检查
- 加 `.github/CODEOWNERS` 指定每个目录的默认 reviewer
- CI 增加 visual regression test（前端 UI 改动自动截图对比）

阶段 3 不急，等阶段 1 和 2 跑顺了再上。

---

### 十一、参考资料（交叉验证来源）

- [Conventional Commits v1.0.0](https://www.conventionalcommits.org/)
- [GitHub Flow 官方文档](https://docs.github.com/en/get-started/quickstart/github-flow)
- [About protected branches - GitHub Docs](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)
- DEV Community: Git Workflow Best Practices for 2026
- Wikipedia: Conventional Commits Specification（含 2025 学术研究数据）
- Hadosec: 10 Rules of GitHub Branch Protection（2 人团队 reviewer 数量建议）

---

### 附录 A：常用命令速查

bash

```bash
# 开始一个新功能
git checkout main && git pull
git checkout -b feat/xxx
# 改代码...
git add .
git commit -m "feat(scope): 描述"
git push -u origin feat/xxx
# 然后去 GitHub 开 PR

# PR 期间想同步最新 main
git fetch origin
git rebase origin/main
# 解决冲突
git push --force-with-lease

# 合并后清理
git checkout main && git pull
git branch -d feat/xxx

# 查看 PR 大小（提交前自检）
git diff main...HEAD --stat

# 紧急撤销最后一次 commit（保留改动）
git reset --soft HEAD~1
```

---

### 附录 B：常见错误与急救

**误删本地分支**：`git reflog` 找回 commit，再 `git branch xxx <hash>`

**误 push 到错的分支**：联系对方，对方拉之前用 `git revert` 反向提交

**rebase 中迷路**：`git rebase --abort` 直接回退到开始前

**合并冲突解决不了**：

bash

```bash
git merge --abort  # 或 git rebase --abort
# 重新想清楚再来
```

---

> **改进信念**：流程是为人服务的，不是反过来。这套指南随团队变化迭代，每季度回顾一次，删掉用不上的，加上发现的新坑。