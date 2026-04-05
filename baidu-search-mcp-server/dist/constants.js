/**
 * Application constants for Baidu Search MCP Server
 */
/**
 * Base URL for SearchApi.io API
 */
export const API_BASE_URL = 'https://www.searchapi.io/api/v1/search';
/**
 * Character limit for response truncation
 */
export const CHARACTER_LIMIT = 25000;
/**
 * Default page size for search results
 */
export const DEFAULT_LIMIT = 20;
/**
 * Maximum number of results per page allowed by API
 */
export const MAX_LIMIT = 50;
/**
 * Maximum query length
 */
export const MAX_QUERY_LENGTH = 500;
/**
 * Request timeout in milliseconds
 */
export const REQUEST_TIMEOUT = 30000;
/**
 * Environment variable names
 */
export const ENV = {
    API_KEY: 'BaiduSearch_API_KEY',
    PORT: 'PORT',
    TRANSPORT: 'TRANSPORT'
};
/**
 * Default values
 */
export const DEFAULTS = {
    PORT: 3000,
    TRANSPORT: 'stdio'
};
/**
 * Language parameter mapping to API values
 */
export const LANGUAGE_MAP = {
    mixed: 0,
    simplified: 1,
    traditional: 2
};
/**
 * Server information
 */
export const SERVER_INFO = {
    name: 'baidu-search-mcp-server',
    version: '1.0.0'
};
//# sourceMappingURL=constants.js.map