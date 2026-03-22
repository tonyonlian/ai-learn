---
name: git_summary_commit
description: 自动扫描 Git 暂存区（Staged）的代码变更，利用 LLM 提取核心逻辑，生成不超过 50 字的中文提交信息并执行 commit。
license: MIT
---


## 1. 技能概述 (Overview)
**ID**: `git_summary_commit`
**功能描述**: 自动扫描 Git 暂存区（Staged）的代码变更，利用 LLM 提取核心逻辑，生成不超过 50 字的中文提交信息并执行 commit。
**使用场景**: 当用户完成代码修改并执行 `git add` 后，辅助用户完成高质量的提交记录。




## 2. 接口定义 (Interface Spec)
| 参数名 | 类型 | 必填 | 默认值 | 描述 (Checklist: 语义化命名) |
| :--- | :--- | :--- | :--- | :--- |
| `repo_path` | string | 是 | `./` | 本地 Git 仓库的绝对或相对路径。 |
| `max_chars` | integer | 否 | `50` | **硬约束**：提交信息严禁超过此字数。 |
| `auto_add` | boolean | 否 | `false` | 若暂存区为空，是否自动执行 `git add .`。 |

---

## 3. 鲁棒性执行策略 (Robustness Strategy)
*对照“好技能清单”设计的防御性逻辑：*

### A. 环境预检 (Pre-flight Check)
- **仓库校验**: 必须确认路径下存在 `.git` 目录。若不存在，返回错误 `E001: Invalid Repository`。
- **冲突拦截**: 若检测到 `Merge Conflict` 状态，禁止提交并返回 `E003: Conflict Detected`，引导用户手动解决。

### B. 输入优化 (Input Optimization)
- **防 Token 爆炸**: 若 `git diff` 结果超过 **4000 字符**，自动降级为 `git diff --stat`（仅提取文件名列表）+ `关键变更行抽样`。
- **目的**: 确保 AI 不会因为上下文过载而产生幻觉或调用失败。

### C. 输出防御 (Output Defense)
- **双重字数约束**:
    1. **Prompt 级**: 明确要求 LLM 生成 50 字以内结果。
    2. **代码级**: 在执行 `git commit` 前，脚本强制执行 `msg = msg[:50]` 截断。

---

## 4. 提交类型定义 (Commit Types)

| 类型 | 英文 | 中文说明 | 使用场景 |
|------|------|----------|----------|
| `feat` | Feature | 新功能 | 添加新的功能模块 |
| `fix` | Bug Fix | 修复缺陷 | 修复 bug 或问题 |
| `docs` | Documentation | 文档变更 | 仅文档修改 |
| `style` | Style | 格式调整 | 代码格式、样式（不影响功能）|
| `refactor` | Refactor | 重构优化 | 代码重构（不修功能不修bug）|
| `perf` | Performance | 性能优化 | 提升性能 |
| `test` | Test | 测试相关 | 添加/修改测试 |
| `chore` | Chore | 构建/工具 | 构建脚本、工具配置 |
| `ci` | CI | 持续集成 | CI 配置变更 |
| `build` | Build | 构建相关 | 依赖、构建系统 |
| `revert` | Revert | 回退 | 回退到上一个版本 |

## 5. 提交格式规范 (Commit Format)

### 格式一：标准格式 (推荐)
```
<type>: <subject>
```
示例：
- `feat: 添加用户登录功能`
- `fix: 修复列表分页bug`
- `docs: 更新 API 文档`

### 格式二：带模块作用域
```
<type>(<scope>): <subject>
```
示例：
- `feat(auth): 添加 OAuth 登录`
- `fix(api): 修复用户查询接口`
- `chore(deps): 升级依赖版本`

### 格式三：带多行正文
```
<type>: <subject>

<body>
```
首行不超过 50 字，正文可详细说明。

## 6. 提交决策树 (Commit Decision Tree)

```
变更分析
    │
    ├── 新功能？
    │   └── yes → feat / feat(scope)
    │
    ├── 修复bug？
    │   └── yes → fix / fix(scope)
    │
    ├── 仅文档/注释？
    │   └── yes → docs / style
    │
    ├── 重构代码结构？
    │   └── yes → refactor
    │
    ├── 性能优化？
    │   └── yes → perf
    │
    ├── 测试相关？
    │   └── yes → test
    │
    └── 其他（配置/构建/依赖）？
        └── yes → chore / ci / build
```

## 7. 智能识别规则 (Smart Detection)

### 文件后缀 → 类型推断
| 文件类型 | 默认类型 | 可覆盖 |
|----------|----------|--------|
| `*.md` | `docs` | ✅ |
| `*.test.ts`, `*.spec.js` | `test` | ✅ |
| `package.json`, `*.lock` | `chore` | ✅ |
| `Dockerfile`, `docker-compose.yml` | `ci` | ✅ |
| `*.css`, `*.scss` | `style` | ✅ |

### 变更模式 → 类型推断
| 变更模式 | 推断类型 |
|----------|----------|
| `+` 行数 >> `-` 行数 | `feat` (新增为主) |
| `-` 行数 >> `+` 行数 | `refactor` (删除为主) |
| 仅移动代码 | `refactor` |
| 修复 `// TODO`, `// FIXME` | `fix` |

## 8. 推荐 Prompt (LLM Instruction)
*此部分用于引导 AI 思考，确保输出质量：*

> **Role**: 资深架构师 & Git 规范专家
> **Context**: 分析提供的 `git diff` 差异，结合文件后缀和变更模式进行智能推断。
> **Task**: 确定变更类型，生成规范提交信息。
> **Constraint**:
> 1. 必须使用**简体中文**。
> 2. 严禁超过 **50** 字（第一行）。
> 3. 优先使用标准格式 `<type>: <subject>`。
> 4. 根据变更特征选择合适的 type。
> 5. **禁止**输出任何解释性文字或引号，只输出最终的 commit message。

---

## 5. 错误处理规范 (Error Handling)
| 错误码 | 错误提示语 (AI 友好) | 建议 AI 采取的下一步行动 |
| :--- | :--- | :--- |
| `E001` | 指定路径不是有效的 Git 仓库。 | 询问用户正确的项目路径。 |
| `E002` | 暂存区为空，没有可提交的内容。 | 建议用户执行 `git add` 或询问是否由 AI 自动 add。 |
| `E003` | 存在合并冲突，无法提交。 | 告知用户冲突文件列表，请求手动干预。 |

---

## 6. 使用示例 (Examples)
- **输入**: "把刚才改的 README 提交了。"
- **AI 调用**: `git_summary_commit(repo_path="./", auto_add=true)`
- **预期结果**: `[文档] 完善 SKILL.md 鲁棒性策略说明` (22字)

---

## 7. 维护者声明
- **开发者**: Agent Skills Dev Team
- **安全等级**: 高 (涉及文件写入，建议开启 User-in-the-loop 确认)