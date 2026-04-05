# Baidu Search MCP Server - OpenCode 配置指南

## 配置文件

已创建以下配置文件用于在 OpenCode 中注册 MCP 服务器：

### 1. opencode.mcp.json（根目录）
```json
{
  "mcpServers": {
    "baidu-search": {
      "command": "node",
      "args": [
        "C:/Users/54034/IdeaProjects/ai-learn/baidu-search-mcp-server/dist/index.js"
      ],
      "env": {
        "BaiduSearch_API_KEY": "${BaiduSearch_API_KEY}"
      }
    }
  }
}
```

### 2. .opencode/mcp.json（项目内）
```json
{
  "mcpServers": {
    "baidu-search": {
      "command": "node",
      "args": [
        "${workspace}/baidu-search-mcp-server/dist/index.js"
      ],
      "env": {
        "BaiduSearch_API_KEY": "${BAIDU_SEARCH_API_KEY}",
        "TRANSPORT": "stdio"
      },
      "description": "Baidu Search MCP Server"
    }
  }
}
```

## 配置方法

### 方法 1: 使用环境变量

1. 设置 API Key 环境变量：
```bash
# Windows PowerShell
$env:BaiduSearch_API_KEY="your_api_key_here"

# Windows CMD
set BaiduSearch_API_KEY=your_api_key_here

# Linux/Mac
export BaiduSearch_API_KEY="your_api_key_here"
```

2. 运行 MCP 服务器：
```bash
cd baidu-search-mcp-server
npm start
```

### 方法 2: 修改配置文件

直接编辑 `config.opencode.json` 文件，填入您的 API Key：
```json
{
  "mcpServers": {
    "baidu-search": {
      "command": "node",
      "args": [
        "C:\\Users\\54034\\IdeaProjects\\ai-learn\\baidu-search-mcp-server\\dist\\index.js"
      ],
      "env": {
        "BaiduSearch_API_KEY": "填入您的API密钥"
      }
    }
  }
}
```

## 获取 API Key

1. 访问 [SearchApi.io](https://www.searchapi.io)
2. 注册账户
3. 获取 API Key
4. 免费套餐：100 次请求/月

## 验证配置

运行以下命令测试服务器：
```bash
cd baidu-search-mcp-server
npm run build
node dist/index.js
```

如果看到 `MCP server running via stdio` 表示服务器启动成功。

## 可用工具

配置成功后，OpenCode 将可以使用以下工具：

- `baidu_search_web`: 百度网页搜索
  - 参数：`query` (必需), `limit`, `offset`, `language`, `response_format`, `time_filter`
  - 示例：`baidu_search_web({ query: "人工智能", limit: 10 })`
