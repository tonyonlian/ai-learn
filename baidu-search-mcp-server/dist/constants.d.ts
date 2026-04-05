/**
 * Application constants for Baidu Search MCP Server
 */
/**
 * Base URL for SearchApi.io API
 */
export declare const API_BASE_URL = "https://www.searchapi.io/api/v1/search";
/**
 * Character limit for response truncation
 */
export declare const CHARACTER_LIMIT = 25000;
/**
 * Default page size for search results
 */
export declare const DEFAULT_LIMIT = 20;
/**
 * Maximum number of results per page allowed by API
 */
export declare const MAX_LIMIT = 50;
/**
 * Maximum query length
 */
export declare const MAX_QUERY_LENGTH = 500;
/**
 * Request timeout in milliseconds
 */
export declare const REQUEST_TIMEOUT = 30000;
/**
 * Environment variable names
 */
export declare const ENV: {
    readonly API_KEY: "BaiduSearch_API_KEY";
    readonly PORT: "PORT";
    readonly TRANSPORT: "TRANSPORT";
};
/**
 * Default values
 */
export declare const DEFAULTS: {
    readonly PORT: 3000;
    readonly TRANSPORT: "stdio";
};
/**
 * Language parameter mapping to API values
 */
export declare const LANGUAGE_MAP: {
    readonly mixed: 0;
    readonly simplified: 1;
    readonly traditional: 2;
};
/**
 * Server information
 */
export declare const SERVER_INFO: {
    readonly name: "baidu-search-mcp-server";
    readonly version: "1.0.0";
};
//# sourceMappingURL=constants.d.ts.map