## Why

当前学生CRUD功能仅支持基础的增删改查，无法满足实际业务中的高级查询需求，如按年龄范围查询、分页查询、按多个条件组合查询等。需要扩展学生模型的高级查询能力。

## What Changes

- 添加按年龄范围查询学生功能
- 添加分页查询学生功能
- 添加统计学生数量功能
- 添加按多个条件组合查询功能

## Capabilities

### New Capabilities
- `student-age-range-query`: 支持按年龄范围查询学生
- `student-pagination-query`: 支持分页查询学生
- `student-count`: 统计学生数量
- `student-multi-condition-query`: 支持多条件组合查询

### Modified Capabilities
- 无（现有基础CRUD功能不改变）

## Impact

- 新增文件:
  - `StudentMapper.java` 新增4个方法
  - `StudentMapper.xml` 新增4个SQL映射
  - `StudentTest.java` 新增对应的测试用例

- 影响范围: 仅影响 `com.tunyl.demo` 包下的学生管理模块
