## ADDED Requirements

### Requirement: 多条件组合查询学生
系统 SHALL 支持按多个条件组合查询学生，条件可以自由组合。

#### Scenario: 按名称和年龄查询
- **WHEN** 调用 selectByConditions(name="张", age=20) 方法
- **THEN** 返回名称包含"张"且年龄等于20的学生列表

#### Scenario: 仅按名称查询
- **WHEN** 调用 selectByConditions(name="李", age=null) 方法
- **THEN** 返回名称包含"李"的所有学生

#### Scenario: 仅按年龄查询
- **WHEN** 调用 selectByConditions(name=null, age=22) 方法
- **THEN** 返回年龄等于22的所有学生

#### Scenario: 无条件查询
- **WHEN** 调用 selectByConditions(name=null, age=null) 方法
- **THEN** 返回所有学生列表

#### Scenario: 条件都不匹配
- **WHEN** 调用 selectByConditions(name="不存在的名字", age=99) 方法
- **THEN** 返回空列表
