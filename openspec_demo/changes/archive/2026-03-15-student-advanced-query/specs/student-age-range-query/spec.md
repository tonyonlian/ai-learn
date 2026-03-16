## ADDED Requirements

### Requirement: 按年龄范围查询学生
系统 SHALL 支持按年龄范围查询学生，返回符合条件的学生列表。

#### Scenario: 查询指定年龄范围的学生
- **WHEN** 调用 selectByAgeRange(minAge, maxAge) 方法
- **THEN** 返回年龄在 minAge 到 maxAge 之间（包括边界）的学生列表

#### Scenario: 查询最小年龄的学生
- **WHEN** 调用 selectByAgeRange(18, null) 方法
- **THEN** 返回年龄大于等于 18 岁的所有学生

#### Scenario: 查询最大年龄的学生
- **WHEN** 调用 selectByAgeRange(null, 25) 方法
- **THEN** 返回年龄小于等于 25 岁的所有学生

#### Scenario: 年龄范围无结果
- **WHEN** 调用 selectByAgeRange(100, 120) 方法
- **THEN** 返回空列表
