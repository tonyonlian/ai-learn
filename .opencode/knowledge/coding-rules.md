# 业务并发处理规范
- **核心原则**：所有涉及金额更新的操作必须使用“乐观锁”。
- **实施细节**：SQL 语句必须包含 `WHERE version = {current_version}`。
- **报错处理**：若更新行数为 0，需抛出 `ConcurrentUpdateException`。
- **参考案例**：见 `OrderService.java` 的 `updateAmount` 方法。