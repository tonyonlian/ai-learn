## ADDED Requirements

### Requirement: 分页查询学生
系统 SHALL 支持分页查询学生，返回指定页的学生列表。

#### Scenario: 查询第一页
- **WHEN** 调用 selectPage(0, 5) 方法（offset=0, limit=5）
- **THEN** 返回前5条学生记录

#### Scenario: 查询第二页
- **WHEN** 调用 selectPage(5, 5) 方法（offset=5, limit=5）
- **THEN** 返回第6-10条学生记录

#### Scenario: 查询超出范围
- **WHEN** 调用 selectPage(100, 10) 方法（数据不足100条）
- **THEN** 返回空列表

#### Scenario: 查询全部数据（无分页）
- **WHEN** 调用 selectAll() 方法
- **THEN** 返回所有学生记录
