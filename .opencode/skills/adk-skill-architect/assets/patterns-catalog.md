# ADK 模式代码片段库

## Pattern 1: Tool Wrapper
- 核心：加载外部文档作为真理来源。
- 关键语法：`Load 'references/xyz.md' before processing.`

## Pattern 2: Generator
- 核心：强制模板填充。
- 关键语法：`Strictly follow the structure in 'assets/template.md'.`

## Pattern 3: Reviewer
- 核心：严重程度分级。
- 关键语法：`Categorize issues as [Critical/Warning/Info].`

## Pattern 4: Inversion
- 核心：控制权反转，主动提问。
- 关键语法：`If info is missing, STOP and ask up to 3 questions.`

## Pattern 5: Pipeline
- 核心：阶段性执行与 Checkpoint。
- 关键语法：`Phase X -> Checkpoint -> Phase Y.`