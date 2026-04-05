/**
 * Baidu Search API client service
 * Handles API requests to SearchApi.io's Baidu Search endpoint
 */
import type { BaiduSearchResponse, BaiduLanguage } from '../types.js';
/**
 * Validate API key presence
 */
export declare function validateApiKey(): string;
/**
 * Perform Baidu web search
 */
export declare function baiduSearch(query: string, options: {
    limit?: number;
    offset?: number;
    language?: BaiduLanguage;
    timeFilter?: string;
}): Promise<BaiduSearchResponse>;
//# sourceMappingURL=baidu-api.d.ts.map