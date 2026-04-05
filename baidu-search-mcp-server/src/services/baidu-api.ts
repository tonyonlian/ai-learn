/**
 * Baidu Search API client service
 * Handles API requests to SearchApi.io's Baidu Search endpoint
 */

import axios, { AxiosError } from 'axios';
import type {
  BaiduSearchParams,
  BaiduSearchResponse,
  BaiduLanguage
} from '../types.js';
import {
  API_BASE_URL,
  REQUEST_TIMEOUT,
  LANGUAGE_MAP,
  ENV
} from '../constants.js';

/**
 * Handle API errors and return user-friendly messages
 */
function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      const status = axiosError.response.status;
      const data = axiosError.response.data as any;

      switch (status) {
        case 400:
          return `Error: Invalid request. ${data?.error?.message || 'Please check your parameters.'}`;
        case 401:
          return 'Error: Authentication failed. Please check your BaiduSearch_API_KEY environment variable.';
        case 403:
          return 'Error: Access forbidden. Your API key may not have access to Baidu search engine.';
        case 404:
          return 'Error: API endpoint not found. Please verify the API URL.';
        case 429:
          return 'Error: Rate limit exceeded. Please wait before making more requests. Check your SearchApi.io plan limits.';
        case 500:
        case 502:
        case 503:
          return `Error: Server error (${status}). SearchApi.io is experiencing issues. Please try again later.`;
        default:
          return `Error: API request failed with status ${status}. ${data?.error?.message || 'Unknown error.'}`;
      }
    } else if (axiosError.code === 'ECONNABORTED') {
      return 'Error: Request timed out. The API took too long to respond. Please try again.';
    } else if (axiosError.code === 'ENOTFOUND') {
      return 'Error: Cannot connect to SearchApi.io. Please check your internet connection.';
    }
  }

  return `Error: Unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`;
}

/**
 * Convert language setting to API parameter value
 */
function mapLanguageToApiParam(language: BaiduLanguage): 0 | 1 | 2 {
  return LANGUAGE_MAP[language];
}

/**
 * Make API request to Baidu Search endpoint
 */
async function makeApiRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' = 'GET',
  params?: Record<string, any>
): Promise<T> {
  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}${endpoint}`,
      params,
      timeout: REQUEST_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

/**
 * Validate API key presence
 */
export function validateApiKey(): string {
  const apiKey = process.env[ENV.API_KEY];
  if (!apiKey) {
    throw new Error(
      `ERROR: ${ENV.API_KEY} environment variable is required. ` +
      'Set it with: export BaiduSearch_API_KEY=your_api_key_here'
    );
  }
  return apiKey;
}

/**
 * Perform Baidu web search
 */
export async function baiduSearch(
  query: string,
  options: {
    limit?: number;
    offset?: number;
    language?: BaiduLanguage;
    timeFilter?: string;
  }
): Promise<BaiduSearchResponse> {
  const apiKey = validateApiKey();

  const params: BaiduSearchParams = {
    engine: 'baidu',
    q: query,
    api_key: apiKey
  };

  // Add optional parameters
  if (options.limit !== undefined) {
    params.num = options.limit;
  }

  if (options.offset !== undefined && options.offset > 0) {
    params.page = Math.floor(options.offset / 20) + 1; // Assuming 20 results per page
  }

  if (options.language && options.language !== 'mixed') {
    params.ct = mapLanguageToApiParam(options.language);
  }

  if (options.timeFilter) {
    params.gpc = options.timeFilter;
  }

  return makeApiRequest<BaiduSearchResponse>('', 'GET', params);
}
