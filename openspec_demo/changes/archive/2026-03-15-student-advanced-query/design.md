## Context

当前学生管理模块已实现基础的增删改查功能（Create、Read、Update、Delete），但在实际业务场景中，需要更灵活的查询能力：
- 按年龄范围筛选学生
- 分页展示学生列表
- 统计学生总数
- 多条件组合查询

本项目使用 MyBatis 3.5.2 + HSQLDB 内存数据库，采用 XML 映射方式。

## Goals / Non-Goals

**Goals:**
- 实现按年龄范围查询学生（minAge, maxAge）
- 实现分页查询学生（offset, limit）
- 实现统计学生总数
- 实现多条件组合查询（name + age 组合）

**Non-Goals:**
- 不改变现有基础CRUD功能
- 不添加新的数据库表
- 不引入新的外部依赖

## Decisions

1. **使用 RowBounds 实现分页**: MyBatis 原生支持 RowBounds 分页，无需额外插件
2. **使用 Map 传递多条件参数**: 多条件查询时，通过 Map 传递可选参数
3. **保持 XML 映射方式**: 继续使用 StudentMapper.xml 进行 SQL 映射

### 替代方案考虑
- 分页: 也可使用 LIMIT/OFFSET 直接在 SQL 中实现，但 RowBounds 更灵活
- 多条件: 可以使用 @SelectProvider 注解，但 XML 方式更直观

## Risks / Trade-offs

- [低风险] 分页查询依赖 RowBounds，适用于小数据量场景，大数据量建议使用 SQL 级别的 LIMIT
- [低风险] 多条件查询中，null 值参数需要使用 `<where>` 标签的动态 SQL 处理

## Open Questions

- 是否需要添加排序功能（ORDER BY）？
- 是否需要添加学生年级（grade）字段？
