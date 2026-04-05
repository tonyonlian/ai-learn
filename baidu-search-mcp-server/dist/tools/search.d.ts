/**
 * Baidu Search MCP tool implementation
 */
import type { BaiduSearchInput } from '../schemas.js';
/**
 * Export search tool for MCP server registration
 */
export declare function baiduSearchTool(params: BaiduSearchInput): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
//# sourceMappingURL=search.d.ts.map