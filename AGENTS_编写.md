# 关天AGENTS.md

## 是什么

AGENTS.md 是一个约定俗成的文件名，通常出现在软件开发项目的根目录下。它的核心目的是为AI编程助手（如 GitHub Copilot、Cursor、通义灵码等）提供关于当前项目的背景信息、编码规范和特定要求。
简单来说，它是一个专门写给 AI 看的 README 文件。

## 为什么需要

普通的 README.md 是写给人类开发者看的，内容可能包含项目介绍、如何安装、如何贡献等。但 AI 在理解一个大型项目时，可能会遇到以下问题：

缺乏上下文：AI 不知道这个项目的特殊约定、代码风格偏好或设计哲学。

决策不明确：当有多种方式实现一个功能时，AI 可能选择不符合项目标准的方式。

遗忘历史：对于已经做过几次的修改，AI 可能会重复犯错，或者忘记遵循之前的指令。

AGENTS.md 就是为了解决这些问题，它就像一个项目手册，让 AI 在开始工作前先“阅读”并遵循

## 写什么

文件内容通常是 Markdown 格式，重点在于清晰、可执行的指令。常见内容包含：

#### 1项目概述和技术栈

项目是做什么的？（一两句话）

主要技术栈是什么？（如：React + TypeScript + Vite + Tailwind CSS）

包管理器是什么？（如：pnpm）

#### 2代码规范和风格

命名规范：组件用 PascalCase，普通函数用 camelCase，常量用 UPPER_CASE。

导入顺序：先导入第三方库，再导入绝对路径的模块，最后导入相对路径的模块。

CSS 方案：是用 Tailwind 的原子类，还是 CSS Modules，还是 Styled Components？

注释要求：是否需要为公共函数写 JSDoc 注释？

#### 3架构和设计原则

项目的目录结构是怎样的？哪个文件夹放组件，哪个放页面，哪个放工具函数？

状态管理是用什么？（如：Zustand、Redux Toolkit、React Context）

API 请求是怎么封装的？

有哪些全局的设计模式？（如：容器组件与展示组件分离）

#### 4特定要求和约束

性能考虑：使用 React.memo 的时机，避免不必要的重渲染。

可访问性：要求所有图片必须有 alt 属性，按钮有合理的 ARIA 标签。

国际化：所有用户可见文本必须通过国际化函数包裹。

浏览器兼容性：需要兼容哪些浏览器版本？

#### 5任务执行指南

当用户要求“添加一个新功能”时，AI 应该遵循的步骤（如：先创建分支，更新相关组件，添加测试，更新文档等）。

代码审查的标准。


## Java工程的AGENTS-参考

### 1核心思路：告诉AI三件事

技术栈与框架：比如用的是Spring Boot 3 + Java 17，还是别的。

架构与分层：代码是怎么组织的（比如常见的Controller-Service-DAO分层）。

强制规范：有哪些AI必须遵守的“铁律”，比如必须用构造器注入、必须加权限注解等。

### 2Java工程AGENTS.md 通用模板

你可以将以下内容复制到项目根目录的 AGENTS.md 文件中，并根据实际情况修改括号 [ ] 中的内容。

```markdown

# Java 项目 AI 助手操作手册

## 📖 1. 项目概览
- **项目描述**：[一句话说明项目是做什么的，例如：一个用户中心微服务，提供登录、注册、用户信息管理功能]
- **核心架构**：基于 **Spring Boot [版本号]** + **Java [版本号，如：17、21]** 的标准分层架构（Controller-Service-DAO）。
- **包管理工具**：[Maven 或 Gradle]
- **关键依赖**：[列出项目最核心的依赖，例如：MyBatis-Plus, Redis, Sa-Token, Spring Cloud Alibaba 等]

## ⚙️ 2. 构建与运行命令
- **清理编译**：
  ```bash
  [Maven: mvn clean compile  |  Gradle: gradle clean build -x test]
  ```

## 运行所有测试
  ```bash
  [Maven: mvn clean test  |  Gradle: gradle test]
  ```
## 运行单个测试类
  ```bash
  [Maven: mvn -Dtest=TestClassName test  |  Gradle: gradle test --tests TestClassName]
  ```
## 本地启动
  ```bash
    [Maven: mvn spring-boot:run  |  Gradle: gradle bootRun]
  ```

## 打包
   ```bash
    [Maven: mvn clean package  |  Gradle: gradle bootJar]
   ```



###  3代码架构与目录规范


请严格遵守以下分层架构，将代码放在正确的位置：

- controller/：只负责接收请求和返回响应。逻辑必须极简，只做参数校验和调用Service。

- service/：业务逻辑层。所有核心业务逻辑写在这里。Service接口和实现类分离。

- mapper/ (或 dao/)：数据库访问层。接口方法名与Mapper XML文件中的ID对应。

- model/ (或 domain/ / entity/): 实体类，通常与数据库表结构对应。

- dto/：数据传输对象，用于Controller和Service之间的数据传递。

- util/ 或 utils/：无状态的静态工具方法类。

### 4强制编码规范（AI必须遵守）

以下规则优先级最高，任何代码生成必须符合这些要求：

- 依赖注入：必须使用构造器注入。推荐使用Lombok的 @RequiredArgsConstructor 注解，禁止使用 @Autowired 注解字段。

- 权限控制：涉及权限的Controller方法，必须显式添加权限注解，例如 @SaCheckPermission("user:list")。

- 统一前缀：所有Controller的@RequestMapping路径，必须以 /[项目代码/模块名] 开头，例如 @RequestMapping("/coder/user")。

- Lombok使用：

  - 类上根据情况使用 @Data, @Getter, @Setter, @Builder。

  - 日志必须使用 @Slf4j 注解，严禁使用 System.out.println()。

- 处理数据库：禁止在Java代码中拼接SQL。动态SQL请使用MyBatis-Plus提供的Wrapper或在XML文件中编写。

- 异常处理：禁止在Controller中捕获异常，应抛出业务异常，由全局异常处理器 @RestControllerAdvice 统一处理。

### 5测试要求
- 单元测试框架：使用 [JUnit 5 + Mockito]。

- 测试类位置与命名：测试类应位于 src/test/java 下，与被测试类包名一致，类名以 Test 结尾（例如 UserServiceTest）。

- 新增/修改功能：必须编写或更新对应的单元测试和集成测试，确保核心逻辑正确。

- 测试覆盖率：[可选，例如：核心Service层的测试覆盖率不低于80%]。

### 6提交规范
Commit Message格式：遵循 Conventional Commits 规范。

```text
<type>[optional scope]: <description>
# 示例: feat(user): 新增用户注册接口
#       fix(order): 修复订单金额计算错误
```
提交前检查：必须确保本地构建（mvn clean test）成功，且代码风格无问题。

### 7其它注意事项

配置文件：不同环境的配置放在 application-{profile}.yml 中，禁止将敏感信息（如密码、密钥）硬编码在代码或配置文件中。

工具类：工具类必须是 final 类，且构造器私有，方法静态。