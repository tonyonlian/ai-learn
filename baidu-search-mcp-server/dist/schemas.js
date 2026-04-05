/**
 * Zod validation schemas for Baidu Search MCP Server
 */
import { z } from 'zod';
/**
 * Search input schema for baidu_search_web tool
 */
export const BaiduSearchInputSchema = z.object({
    query: z.string()
        .min(1, 'Query cannot be empty')
        .max(500, 'Query must not exceed 500 characters')
        .describe('Search query string for Baidu web search. Can include operators and advanced filters like "site:", "intitle:", or "filetype:'),
    limit: z.number()
        .int('Limit must be an integer')
        .min(1, 'Limit must be at least 1')
        .max(50, 'Limit must not exceed 50')
        .default(20)
        .describe('Maximum number of search results to return (1-50, default: 20)'),
    offset: z.number()
        .int('Offset must be an integer')
        .min(0, 'Offset must be non-negative')
        .default(0)
        .describe('Number of results to skip for pagination (default: 0)'),
    language: z.nativeEnum({
        mixed: 'mixed',
        simplified: 'simplified',
        traditional: 'traditional'
    })
        .default('mixed')
        .describe('Language setting for search results: "mixed" (both Simplified and Traditional Chinese, default), "simplified" (Simplified Chinese only), or "traditional" (Traditional Chinese only)'),
    response_format: z.nativeEnum({
        markdown: 'markdown',
        json: 'json'
    })
        .default('markdown')
        .describe('Output format: "markdown" for human-readable formatted text (default), or "json" for machine-readable structured data'),
    time_filter: z.string()
        .optional()
        .describe('Optional time filter in format "start_time,end_time|stftype=1" using Unix timestamps. Example: "1683108267,1714730667|stftype=1" for one year period')
}).strict();
//# sourceMappingURL=schemas.js.map