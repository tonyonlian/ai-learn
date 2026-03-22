# OpenCode 平台使用教程

## 什么是 OpenCode？

OpenCode 是一个 AI 辅助编程平台，通过智能代理（Agents）帮助开发者完成代码编写、调试、重构等任务。

## 核心功能

### 1. 智能任务委托
- **Task Agent**: 将复杂任务委托给专用代理
- **Category 分类**: visual-engineering、ultrabrain、deep、artistry、quick 等
- **Skills 系统**: playwright、frontend-ui-ux、git-master 等专业技能

### 2. 代码操作工具

| 工具 | 功能 |
|------|------|
| `read` | 读取文件内容 |
| `write` | 写入/覆盖文件 |
| `edit` | 编辑文件内容 |
| `glob` | 按模式搜索文件 |
| `grep` | 搜索文件内容 |
| `ast_grep_search` | AST 模式搜索 |
| `ast_grep_replace` | AST 模式替换 |

### 3. 语言服务 (LSP)

| 工具 | 功能 |
|------|------|
| `lsp_goto_definition` | 跳转到定义 |
| `lsp_find_references` | 查找引用 |
| `lsp_rename` | 重命名符号 |
| `lsp_diagnostics` | 获取诊断信息 |
| `lsp_symbols` | 获取文件符号 |

### 4. Git 操作

使用 `git-master` skill 进行 Git 操作：
- 原子提交
- Rebase/Squash
- 历史搜索 (blame, bisect, log -S)

### 5. 浏览器自动化

使用 `playwright` 或 `dev-browser` skill：
- 网页自动化测试
- 信息抓取
- 表单填写
- 截图

## 工作流程

### 基础流程

```
1. 用户提出需求
   ↓
2. Agent 分析需求 (Intent Gate)
   ↓
3. 代码库评估 (如需要)
   ↓
4. 探索/研究 (Explore/Librarian)
   ↓
5. 执行/委托任务
   ↓
6. 验证结果
   ↓
7. 完成
```

### 任务委托模式

```typescript
task(
  category="visual-engineering",      // 选择分类
  load_skills=["frontend-ui-ux"],     // 加载技能
  description="创建登录页面",         // 任务描述
  prompt="请创建一个登录页面，包含..." // 详细提示
)
```

## 意图分类 (Intent Gate)

| 表面形式 | 真实意图 | 路由方式 |
|----------|----------|----------|
| "explain X", "how does Y work" | 研究/理解 | explore → synthesize → answer |
| "implement X", "add Y", "create Z" | 实现 | plan → delegate or execute |
| "look into X", "check Y", "investigate" | 调查 | explore → report findings |
| "what do you think about X?" | 评估 | evaluate → propose → wait |
| "I'm seeing error X" / "Y is broken" | 修复 | diagnose → fix minimally |
| "refactor", "improve", "clean up" | 改进 | assess → propose approach |

## 代理类型

### Explore Agent
- 内部代码搜索
- 上下文 grep
- 适合：查找代码模式、现有实现

### Librarian Agent
- 外部参考搜索
- 官方文档检索
- 适合：不熟悉的库/框架

### Oracle Agent
- 高智商顾问
- 架构决策咨询
- 仅供阅读 Consultation

### Metis Agent
- 预规划分析
- 识别隐藏意图
- 复杂任务分析

### Momus Agent
- 计划审查
- 质量保证
- 评估完整性

## 最佳实践

### 1. 任务委托

**必须包含的 6 个部分：**
```
1. TASK: 原子化、具体的目标
2. EXPECTED OUTCOME: 具体交付物和成功标准
3. REQUIRED TOOLS: 明确的工具白名单
4. MUST DO: 详尽要求，不留任何隐含内容
5. MUST NOT DO: 禁止行为，防止失控
6. CONTEXT: 文件路径、现有模式、约束
```

### 2. 会话管理

```typescript
// 继续已有会话 (推荐)
task(
  session_id="ses_abc123",  // 使用之前的 session_id
  prompt="继续修复类型错误..."
)

// 不要新建会话，否则丢失上下文
```

### 3. 避免事项

- ❌ 使用 `as any`、`@ts-ignore` 抑制类型错误
- ❌ 空 catch 块 `catch(e) {}`
- ❌ 删除失败测试来"通过"
- ❌ 随机调试 ( shotgun debugging )
- ❌ 在 Oracle 完成前交付答案
- ❌ 使用 `background_cancel(all=true)`

## 常用命令

### 文件操作
```bash
# 读取文件
read /path/to/file

# 搜索文件
glob **/*.ts
glob **/*.js

# 搜索内容
grep "function name" --include="*.ts"
```

### Git 操作
```bash
# 查看状态
git status

# 查看差异
git diff

# 查看提交历史
git log --oneline -10
```

### 代码诊断
```bash
# 获取错误/警告
lsp_diagnostics /path/to/file

# 查找定义
lsp_goto_definition filePath="/path/to/file" line=10 character=5

# 查找引用
lsp_find_references filePath="/path/to/file" line=10 character=5
```

## 技能 (Skills)

| 技能 | 用途 |
|------|------|
| `playwright` | 浏览器自动化、测试 |
| `frontend-ui-ux` | 前端 UI/UX 开发 |
| `git-master` | Git 操作 |
| `dev-browser` | 浏览器交互 |

使用技能：
```typescript
task(
  category="quick",
  load_skills=["git-master"],
  prompt="修复 git 提交问题..."
)
```

## 调试技巧

### 1. 定位问题
```typescript
// 使用 lsp_diagnostics 查看具体错误
lsp_diagnostics(filePath="/path/to/file")

// 使用 grep 搜索相关代码
grep pattern="error" path="/path/to/project"
```

### 2. 理解代码
```typescript
// 查找符号定义
lsp_goto_definition(filePath="...", line=10, character=5)

// 查找所有引用
lsp_find_references(filePath="...", line=10, character=5)
```

### 3. 重构安全
```typescript
// 重命名前提议检查
lsp_prepare_rename(filePath="...", line=10, character=5)

// 执行重命名
lsp_rename(filePath="...", line=10, character=5, newName="newName")
```

## 常见问题

### Q: 如何开始一个新任务？
A: 直接描述你的需求，Agent 会自动分析意图并选择合适的处理方式。

### Q: 任务失败了怎么办？
A: 
1. 检查错误信息
2. 使用 `lsp_diagnostics` 查看诊断
3. 如果是复杂问题，咨询 Oracle

### Q: 如何提高任务完成质量？
A:
1. 提供清晰、具体的任务描述
2. 包含必要的上下文和约束
3. 使用合适的 category 和 skills

### Q: 可以同时执行多个任务吗？
A: 可以，使用并行执行（后台任务）提高效率。

## 总结

OpenCode 的核心理念：
1. **清晰表达需求** - 明确告诉 Agent 你要什么
2. **正确选择工具** - 根据任务类型选择合适的工具
3. **验证结果** - 完成任务后验证是否正确
4. **持续改进** - 利用 Oracle/Momus 优化方案

掌握这些技巧，你就能高效地使用 OpenCode 进行 AI 辅助编程。
