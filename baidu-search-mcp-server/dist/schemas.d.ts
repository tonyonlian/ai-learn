/**
 * Zod validation schemas for Baidu Search MCP Server
 */
import { z } from 'zod';
/**
 * Response format options
 */
export type ResponseFormat = 'markdown' | 'json';
/**
 * Search input schema for baidu_search_web tool
 */
export declare const BaiduSearchInputSchema: z.ZodObject<{
    query: z.ZodString;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
    language: z.ZodDefault<z.ZodNativeEnum<{
        mixed: "mixed";
        simplified: "simplified";
        traditional: "traditional";
    }>>;
    response_format: z.ZodDefault<z.ZodNativeEnum<{
        markdown: "markdown";
        json: "json";
    }>>;
    time_filter: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    query: string;
    limit: number;
    offset: number;
    language: "mixed" | "simplified" | "traditional";
    response_format: "markdown" | "json";
    time_filter?: string | undefined;
}, {
    query: string;
    limit?: number | undefined;
    offset?: number | undefined;
    language?: "mixed" | "simplified" | "traditional" | undefined;
    response_format?: "markdown" | "json" | undefined;
    time_filter?: string | undefined;
}>;
/**
 * Type inference from search input schema
 */
export type BaiduSearchInput = z.infer<typeof BaiduSearchInputSchema>;
//# sourceMappingURL=schemas.d.ts.map