# AI Learn - Agent Skills & MCP 学习项目

> 这是一个专注于 **Agent Skills**（智能体技能）和 **MCP**（Model Context Protocol）开发的学习与实践仓库。

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org/)

---

## 📁 项目结构

```
ai-learn/
├── weather-mcp-server/      # 🌤️ MCP 服务器：全球天气预报 (Open-Meteo API)
├── baidu-search-mcp-server/ # 🔍 MCP 服务器：百度搜索 API 集成
├── example/                 # 📚 Agent Skill 示例代码
│   └── SKILL.md            # git_summary_commit 技能示例
├── openspec_demo/          # 📋 OpenSpec 规范示例
├── pic/                    # 🖼️ 教程与演示图片
├── .opencode/              # ⚙️ OpenCode 配置与自定义技能
│   └── skills/             # 自定义 Agent Skills
├── SKILL应该如何写.md       # 📝 如何编写高质量 Agent Skill
├── SKILL设计模式.md         # 🎯 Google 五种 SKILL 设计模式
├── AGENTS_编写.md          # 📖 AGENTS.md 编写指南
├── OpenCode的使用.md        # 🔧 OpenCode 使用教程
├── OpenSpec的使用.md        # 📑 OpenSpec 规范指南
└── generate_ppt.py         # 🐍 PPT 自动生成脚本
```

---

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/your-username/ai-learn.git
cd ai-learn
```

### 2. 安装依赖

每个子项目需要独立安装依赖：

```bash
# 安装 weather-mcp-server 依赖
cd weather-mcp-server
npm install

# 安装 baidu-search-mcp-server 依赖
cd ../baidu-search-mcp-server
npm install
```

### 3. 运行 MCP 服务器

```bash
# 运行 weather MCP 服务器
cd weather-mcp-server
npm run build
npm start

# 运行百度搜索 MCP 服务器 (需要 API Key)
cd ../baidu-search-mcp-server
npm run build
export BaiduSearch_API_KEY=your_api_key
npm start
```

---

## 📦 子项目说明

### 1. weather-mcp-server

**功能**：提供全球城市天气预报查询服务

**技术栈**：
- TypeScript + Node.js
- MCP SDK
- Open-Meteo API（免费，无需 API Key）
- Zod（运行时验证）

**可用工具**：
- `weather_get_forecast` - 查询指定城市天气预报

**使用示例**：
```json
{
  "place": "上海",
  "forecast_days": 7,
  "response_format": "markdown"
}
```

---

### 2. baidu-search-mcp-server

**功能**：提供百度搜索 API 集成，支持中文搜索

**技术栈**：
- TypeScript + Node.js
- MCP SDK
- SearchApi.io（百度搜索 API）
- Express.js
- Zod

**可用工具**：
- `baidu_search_web` - 执行百度网页搜索

**环境变量**：
| 变量名 | 必填 | 说明 |
|--------|------|------|
| `BaiduSearch_API_KEY` | 是 | SearchApi.io API Key |
| `PORT` | 否 | 服务器端口（默认 3000）|
| `TRANSPORT` | 否 | 传输模式：`stdio` 或 `http` |

---

### 3. example - Agent Skill 示例

包含高质量 Agent Skill 的编写示例，遵循 Google 五种设计模式：

- **工具包装模式** (Tool Wrapper)
- **生成器模式** (Generator)
- **评审员模式** (Reviewer)
- **反转模式** (Inversion)
- **流水线模式** (Pipeline)

---

## 📚 学习文档

| 文件 | 说明 |
|------|------|
| `SKILL应该如何写.md` | Agent Skill 编写最佳实践 |
| `SKILL设计模式.md` | Google 五种 SKILL 设计模式详解 |
| `AGENTS_编写.md` | 如何为 AI 编程助手编写项目手册 |
| `OpenCode的使用.md` | OpenCode 工具使用教程 |
| `OpenSpec的使用.md` | OpenSpec 规范与实践指南 |

---

## 🛠️ 技术栈

- **语言**: TypeScript, Python
- **运行时**: Node.js >= 18
- **MCP**: @modelcontextprotocol/sdk
- **验证**: Zod
- **HTTP 客户端**: Axios
- **后端框架**: Express.js
- **API 数据源**: Open-Meteo, SearchApi.io (百度)

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

---

## 📄 许可证

MIT License

---

## 🔗 相关链接

- [Model Context Protocol 官方文档](https://modelcontextprotocol.io/)
- [Open-Meteo API](https://open-meteo.com/)
- [SearchApi.io](https://www.searchapi.io/)
- [Google Agent Skills 设计模式](https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini-api-best-practices)
