## 1. Mapper 接口扩展

- [x] 1.1 在 StudentMapper.java 中添加 selectByAgeRange(Integer minAge, Integer maxAge) 方法
- [x] 1.2 在 StudentMapper.java 中添加 selectPage(int offset, int limit) 方法
- [x] 1.3 在 StudentMapper.java 中添加 countAll() 方法
- [x] 1.4 在 StudentMapper.java 中添加 selectByConditions(Map<String, Object> params) 方法

## 2. XML 映射配置

- [x] 2.1 在 StudentMapper.xml 中添加按年龄范围查询的 SQL 映射
- [x] 2.2 在 StudentMapper.xml 中添加分页查询的 SQL 映射
- [x] 2.3 在 StudentMapper.xml 中添加统计数量的 SQL 映射
- [x] 2.4 在 StudentMapper.xml 中添加多条件组合查询的 SQL 映射

## 3. 测试用例

- [x] 3.1 在 StudentTest.java 中添加 testSelectByAgeRange 测试方法
- [x] 3.2 在 StudentTest.java 中添加 testSelectPage 测试方法
- [x] 3.3 在 StudentTest.java 中添加 testCountAll 测试方法
- [x] 3.4 在 StudentTest.java 中添加 testSelectByConditions 测试方法

## 4. 验证

- [x] 4.1 运行所有测试用例确保功能正常
- [x] 4.2 验证编译无错误
