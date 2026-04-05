# Baidu Search MCP Server

A Model Context Protocol (MCP) server that provides search functionality through Baidu Search API, enabling AI agents to perform web searches and retrieve Chinese and English search results.

## Features

- **Comprehensive Search**: Access Baidu web search results with organic results, answer boxes, knowledge graphs, and more
- **Language Support**: Support for Simplified Chinese, Traditional Chinese, and mixed content
- **Pagination**: Built-in pagination support for handling large result sets
- **Multiple Response Formats**: Support for both human-readable Markdown and machine-readable JSON
- **Error Handling**: Robust error handling with actionable messages
- **Type Safety**: Full TypeScript implementation with runtime validation using Zod

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
export BaiduSearch_API_KEY=your_api_key_here
export PORT=3000  # Optional (default: 3000)
export TRANSPORT=stdio  # Optional (default: stdio, can be 'http' for remote access)
```

3. Build the server:
```bash
npm run build
```

4. Run the server:
```bash
npm start  # for production
npm run dev  # for development with watch mode
```

## Usage

### Transport Options

#### stdio (Default)
```bash
node dist/index.js
```

#### Streamable HTTP (Remote)
```bash
export TRANSPORT=http
npm start
```
Server will run on `http://localhost:3000/mcp`

### Environment Variables

- `BaiduSearch_API_KEY`: Your SearchApi.io API key (required)
- `PORT`: Port for HTTP server (default: 3000)
- `TRANSPORT`: Transport mode ('stdio' or 'http', default: 'stdio')

## Tools

### baidu_search_web

Perform web searches using Baidu Search API.

**Parameters:**
- `query` (required): Search query string
- `limit` (optional): Maximum results to return (1-100, default: 20)
- `offset` (optional): Number of results to skip for pagination (default: 0)
- `language` (optional): Language setting:
  - 'mixed' (default): Both Simplified and Traditional Chinese
  - 'simplified': Simplified Chinese only
  - 'traditional': Traditional Chinese only
- `response_format` (optional): Output format:
  - 'markdown' (default): Human-readable formatted text
  - 'json': Machine-readable structured data
- `time_filter` (optional): Filter results by time period using Unix timestamp format `start_time,end_time|stftype=1`

**Response:**
For JSON format, returns structured data with schema:
```json
{
  "total": number,
  "count": number,
  "offset": number,
  "results": [
    {
      "title": string,
      "link": string,
      "displayed_link": string,
      "snippet": string,
      "position": number,
      "thumbnail": string
    }
  ],
  "has_more": boolean,
  "next_offset": number,
  "answer_box": any,
  "knowledge_graph": any,
  "related_searches": [string],
  "top_searches": [string]
}
```

## Response Examples

### Markdown Format (default)
```markdown
# Search Results for 'AI 技术发展'

Found 50 results (showing 1-10)

## 人工智能技术发展现状分析 (example.com)
- **URL**: example.com/ai-analysis
- **Snippet**: 人工智能技术近年来发展迅速，包括机器学习、深度学习等多个领域都取得了显著进展...

## 机器学习技术新突破 (news.example.com)
- **URL**: news.example.com/ml-breakthrough
- **Snippet**: 最新研究显示机器学习在自然语言处理、计算机视觉等方面都有新的突破...
```

### JSON Format
```json
{
  "total": 156,
  "count": 20,
  "offset": 0,
  "results": [
    {
      "title": "人工智能技术发展现状分析",
      "link": "https://example.com/ai-analysis",
      "displayed_link": "example.com",
      "snippet": "人工智能技术近年来发展迅速...",
      "position": 1,
      "thumbnail": "https://example.com/thumbnail.jpg"
    }
  ],
  "has_more": true,
  "next_offset": 20,
  "answer_box": {
    "title": "人工智能技术发展现状分析",
    "type": "ai_content",
    "answer": "人工智能技术近年来发展迅速，包括机器学习、深度学习等多个领域都取得了显著进展..."
  },
  "related_searches": [
    "AI 技术趋势",
    "人工智能应用",
    "机器学习算法"
  ]
}
```

## API Reference

The server uses SearchApi.io's Baidu Search API. For detailed API information, see the [SearchApi.io Baidu documentation](https://www.searchapi.io/docs/baidu).

### API Endpoints
- Base URL: `https://www.searchapi.io/api/v1/search`
- Engine: `baidu`
- Authentication: API key in query parameter or Authorization header

### Rate Limits
- Free tier: 100 requests per month
- Paid plans: Starting from $29/month with 1000 requests

### Supported Features
- Organic search results
- AI-generated answer boxes
- Knowledge graphs
- Related searches
- Time filtering
- Pagination

## Development

### Project Structure
```
baidu-search-mcp-server/
├── package.json
├── tsconfig.json
├── README.md
├── src/
│   ├── index.ts          # Main server entry point
│   ├── types.ts          # TypeScript type definitions
│   ├── constants.ts      # Application constants
│   ├── schemas.ts        # Zod validation schemas
│   ├── services/
│   │   └── baidu-api.ts  # Baidu Search API client
│   └── tools/
│       └── search.ts     # Search tool implementation
└── dist/                 # Built JavaScript files
```

### Building and Testing
```bash
# Build the project
npm run build

# Verify compilation
dist/index.js

# Test with MCP Inspector
npx modelcontextprotocol/typescript-sdk/packages/inspector dist/index.js
```

## Legal and Compliance

- API usage is subject to [SearchApi.io terms of service](https://www.searchapi.io/terms)
- Results from Baidu are subject to Baidu's terms and conditions
- Ensure compliance with applicable laws in your jurisdiction when using search results
- Commercial use may require additional licensing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

Apache License 2.0

## Support

For issues and questions:
- GitHub Issues: Report bugs and request features
- SearchApi.io Support: Contact for API-related questions