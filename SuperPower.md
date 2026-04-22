## Superpowers 是什么

**Superpowers** 是由 **Jesse Vincent**（GitHub ID: **obra**）于 2025 年 10 月左右发起并开源的。

如果你混迹于开源硬件或极简工具圈，可能听过 Jesse 的名字——他是著名的分体式人体工学键盘 **Keyboardio** 的创始人，也是一位有着几十年经验的资深黑客。

简单来说，Superpowers 是一个为 AI 编程智能体（Agent）设计的高标准工程流水线：它不是一个简单的工具，而是一套约束（Guardrails）和技能库（Skills），强制 AI 像顶级资深软件架构师一样思考和工作，而不是拿到需求就直接“无脑”写代码。

---

## 出现背景：告别“碰运气”的编程

在 Superpowers 出现之前，大家使用 [Claude Code](https://zhida.zhihu.com/search?content_id=271382636&content_type=Article&match_order=1&q=Claude+Code&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3NzYwMDAyMjUsInEiOiJDbGF1ZGUgQ29kZSIsInpoaWRhX3NvdXJjZSI6ImVudGl0eSIsImNvbnRlbnRfaWQiOjI3MTM4MjYzNiwiY29udGVudF90eXBlIjoiQXJ0aWNsZSIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.443eezYl17utdWxjkEQNm9SnDbUptETXVg1GC_ElrV8&zhida_source=entity) 或 [Cursor](https://zhida.zhihu.com/search?content_id=271382636&content_type=Article&match_order=1&q=Cursor&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3NzYwMDAyMjUsInEiOiJDdXJzb3IiLCJ6aGlkYV9zZXJ2ZXIiLCJjb250ZW50X2lkIjoyNzEzODI2MzYsImNvbnRlbnRfdHlwZSI6IkFydGljbGUiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.1mkeOi4XO7WskmGDig6b0UoNq9HUr9nX3azffUEvfSk&zhida_source=entity) 等 AI 编程工具的方式大多是“**对话式编程**”。这种方式有个致命伤：**不可预测性**。

典型问题包括：

- AI 经常跳过设计阶段直接写代码。
- AI 写的测试要么没有，要么只是为了应付而写的占位符。
- 随着项目复杂度增加，AI 容易在上下文里迷路，产生大量的“代码垃圾”。

Jesse Vincent 在深度使用这些工具后发现：**不是 AI 不行，而是它缺乏一套严谨的工程 SOP（标准作业程序）。**

于是他把过去几十年人类程序员总结出的“硬核”开发心法，固化成了 AI 必须遵守的指令集。

---

## 核心目的

Superpowers 的核心目的不是为了“自动化写代码”，而是为了“通过强约束（Guardrails）将 AI 升级为专业的软件工程师”。

具体目标包括：

- **强制工程纪律**：AI 天生懒惰（趋向于生成最简单的文本）。Superpowers 强制它执行 TDD（测试驱动开发）；如果测试没跑通，AI 甚至被要求删除刚写的代码重新开始。
- **降低认知负担**：通过 `writing-plans` 将复杂的重构任务拆解成 2–5 分钟就能完成的“微任务”。这不仅降低了 AI 的幻觉概率，也让人类更容易 Review。
- **系统化排障**：拒绝“试错式 Debug”。它内置了一套基于科学方法的调试协议（Root Cause Tracing），要求 AI 必须先定位根因，再写防御性代码。
- **心理学操纵（有趣的黑科技）**：Jesse 在指令里引入了一些“社会工程学”技巧。例如，他会告诉 AI：“如果你不使用这个技能，就是一个不负责任的开发者。”这种通过身份暗示来提升 AI 输出稳定性的做法，在 Superpowers 里被玩到了极致。

---

## Superpowers 如何工作

- **技能发现与调用**：AI 在收到任何任务时，必须先检查是否有相关技能适用（即使只有 1% 可能）。使用 `Skill` 工具加载技能文件，然后严格遵循。
- **强制性**：技能不是建议，而是必须遵守的规则。违反规则（如先写代码再写测试）会被视为错误。

核心规则（来自 `using-superpowers` 技能）：

- 在任何响应前，先调用相关技能。
- 如果技能有 checklist，就逐项创建 todo。
- 多技能时优先级：过程技能（如 brainstorming） > 实现技能。

总结一句话：Superpowers 把 AI 变成了一个懂工程、守纪律、会拆解、能带队的技术负责人。对于追求技术严谨性的开发者来说，这套工具是把“玩具 AI”转化为“生产力工具”的范本。

---

## 典型开发流程

1. **Brainstorming**：AI 先理解需求，通过一问一答精炼设计，探索多种方案，分段呈现设计供你确认。最终保存到 `docs/plans/`。
2. **创建工作空间**：使用 git worktrees 创建隔离分支，避免污染主分支。
3. **Writing Plans**：把设计拆成极小的任务（每个 2–5 分钟），每个任务包含精确文件路径、完整代码、测试命令、预期输出。
4. **执行计划**：
    - 子代理驱动（subagent-driven-development）：主 AI 派发子代理逐任务实施 + 双阶段审查。
    - 或批量执行（executing-plans）：在独立会话中批量跑，定期检查点。
5. **TDD 强制**：每个实现都必须 Red → Green → Refactor，且必须看到测试先失败。
6. **代码审查**：任务间自动请求审查。
7. **完成分支**：测试全通过后，提供合并/PR/丢弃选项。

---

## 关键技能（详解与实例）

1. **using-superpowers（入门必读：如何使用技能系统）**：这是第一个技能，建立整个框架规则。
2. **brainstorming（需求精炼与设计）**：触发时机：任何创意工作前（新功能、修改行为）。
3. **test-driven-development（TDD，超级严格）**：触发时机：任何实现或 bugfix 前。
4. **writing-plans（写实施计划）**：触发时机：设计确认后。