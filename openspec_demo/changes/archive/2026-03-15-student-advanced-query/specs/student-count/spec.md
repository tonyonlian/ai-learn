## ADDED Requirements

### Requirement: 统计学生数量
系统 SHALL 支持统计学生总数。

#### Scenario: 统计所有学生数量
- **WHEN** 调用 countAll() 方法
- **THEN** 返回学生总数（整数）

#### Scenario: 空表统计
- **WHEN** 数据库表为空时调用 countAll() 方法
- **THEN** 返回 0

#### Scenario: 统计单条记录
- **WHEN** 数据库只有1条记录时调用 countAll() 方法
- **THEN** 返回 1
