#!/usr/bin/env node
/**
 * Baidu Search MCP Server
 *
 * MCP server for Baidu Search API integration using SearchApi.io
 * Provides web search functionality with support for organic results,
 * answer boxes, knowledge graphs, and various content types.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express from 'express';
import { baiduSearchTool } from './tools/search.js';
import { BaiduSearchInputSchema } from './schemas.js';
import { validateApiKey } from './services/baidu-api.js';
import { ENV, DEFAULTS, SERVER_INFO } from './constants.js';
/**
 * Create and configure MCP server instance
 */
const server = new McpServer({
    name: SERVER_INFO.name,
    version: SERVER_INFO.version
});
/**
 * Register the Baidu web search tool
 */
server.registerTool('baidu_search_web', {
    title: 'Baidu Web Search',
    description: `Perform web searches using Baidu Search API to find relevant information on the internet.

This tool searches Baidu's web index and returns comprehensive results including organic search results, AI-generated answer boxes, knowledge graphs, related searches, and other content types. It does NOT create or modify content, only searches existing web pages.

Args:
  - query (string, required): Search query string for Baidu web search. Can include operators and advanced filters like "site:", "intitle:", or "filetype:". Max 500 characters.
  - limit (number, optional): Maximum number of search results to return. Must be between 1-50. Default: 20.
  - offset (number, optional): Number of results to skip for pagination. Must be non-negative. Default: 0.
  - language (string, optional): Language setting for search results. Options: "mixed" (both Simplified and Traditional Chinese, default), "simplified" (Simplified Chinese only), or "traditional" (Traditional Chinese only).
  - response_format (string, optional): Output format. Options: "markdown" for human-readable formatted text (default), or "json" for machine-readable structured data.
  - time_filter (string, optional): Time filter in format "start_time,end_time|stftype=1" using Unix timestamps. Example: "1683108267,1714730667|stftype=1" for one year period.

Returns:
  For JSON format, returns structured data with schema:
  {
    "total": number,                    // Total number of organic results found
    "count": number,                    // Number of results in this response
    "offset": number,                   // Current pagination offset
    "results": [                        // Array of organic search results
      {
        "title": string,                // Page title
        "link": string,                // Full URL
        "displayed_link": string,      // Display URL (domain)
        "snippet": string,              // Page description
        "position": number,            // Result position
        "thumbnail": string            // Thumbnail URL (optional)
      }
    ],
    "has_more": boolean,                // Whether more results are available
    "next_offset": number,            // Offset for next page (if has_more is true)
    "answer_box": any,                 // AI-generated answer if available
    "knowledge_graph": any,             // Knowledge graph entry if available
    "related_searches": [string],      // Array of related search queries
    "top_searches": [string],         // Array of trending searches
    "top_stories": [object],           // Array of top news stories
    "blogs": [object],                 // Array of blog posts
    "inline_shopping": [object],       // Array of shopping results
    "inline_images": object,           // Image search results
    "inline_videos": [object]           // Video search results
  }

Examples:
  - Use when: "Search for AI development trends" -> params with query="AI development trends"
  - Use when: "Find recent news about technology" -> params with query="科技新闻", language="simplified"
  - Use when: "Find information about ChatGPT in Chinese" -> params with query="ChatGPT"
  - Use when: "Get second page of results" -> params with query="人工智能", offset=20
  - Use when: "Get results in JSON format" -> params with query="machine learning", response_format="json"

Error Handling:
  - Returns "Error: No results found for query: '<query>'" if search returns empty
  - Returns "Error: Authentication failed" if API key is invalid or missing
  - Returns "Error: Rate limit exceeded" if too many requests are made
  - Returns "Error: Request timed out" if API takes too long to respond

Note: Requires BaiduSearch_API_KEY environment variable to be set with a SearchApi.io API key.`,
    inputSchema: BaiduSearchInputSchema,
    annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
    }
}, async (params) => {
    return baiduSearchTool(params);
});
/**
 * Run server with stdio transport (for local integrations)
 */
async function runStdio() {
    // Validate API key on startup
    try {
        validateApiKey();
    }
    catch (error) {
        console.error(error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('MCP server running via stdio');
}
/**
 * Run server with HTTP transport (for remote access)
 */
async function runHTTP() {
    // Validate API key on startup
    try {
        validateApiKey();
    }
    catch (error) {
        console.error(error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
    const app = express();
    app.use(express.json());
    app.post('/mcp', async (req, res) => {
        // Create new transport for each request (stateless, prevents request ID collisions)
        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
            enableJsonResponse: true
        });
        res.on('close', () => transport.close());
        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
    });
    const port = parseInt(process.env[ENV.PORT] || String(DEFAULTS.PORT), 10);
    const host = '127.0.0.1';
    app.listen(port, host, () => {
        console.error(`MCP server running on http://${host}:${port}/mcp`);
    });
}
/**
 * Main entry point - choose transport based on environment
 */
async function main() {
    const transport = process.env[ENV.TRANSPORT] || DEFAULTS.TRANSPORT;
    try {
        if (transport === 'http') {
            await runHTTP();
        }
        else {
            await runStdio();
        }
    }
    catch (error) {
        console.error('Server error:', error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
}
// Start the server
main().catch((error) => {
    console.error('Fatal error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
});
//# sourceMappingURL=index.js.map