/**
 * TypeScript type definitions for Baidu Search API responses
 * Based on SearchApi.io Baidu Search API documentation
 */
/**
 * Language setting for Baidu Search
 */
export type BaiduLanguage = 'mixed' | 'simplified' | 'traditional';
/**
 * Response format options
 */
export type ResponseFormat = 'markdown' | 'json';
/**
 * Organic search result
 */
export interface BaiduOrganicResult {
    position: number;
    title: string;
    link: string;
    displayed_link: string;
    snippet: string;
    snippet_highlighted_words?: string[];
    thumbnail?: string;
}
/**
 * Answer box types
 */
export type AnswerBoxType = 'ai_content' | 'ai_search' | 'calculator' | 'dictionary';
/**
 * Generic answer box structure
 */
export interface BaiduAnswerBox {
    type: AnswerBoxType;
    title?: string;
    link?: string;
    displayed_link?: string;
}
/**
 * AI content answer box
 */
export interface BaiduAnswerBoxAIContent extends BaiduAnswerBox {
    type: 'ai_content';
    answer: string;
}
/**
 * AI search answer box with references
 */
export interface BaiduAnswerBoxAISearch extends BaiduAnswerBox {
    type: 'ai_search';
    answer: string;
    references?: Array<{
        title: string;
        snippet: string;
        source: string;
    }>;
}
/**
 * Calculator answer box
 */
export interface BaiduAnswerBoxCalculator extends BaiduAnswerBox {
    type: 'calculator';
    query: string;
    answer: string;
}
/**
 * Dictionary answer box
 */
export interface BaiduAnswerBoxDictionary extends BaiduAnswerBox {
    type: 'dictionary';
    title: string;
    displayed_link: string;
    translation_meaning: string;
    pronunciations: {
        uk: {
            phonetic: string;
            chinese_character: string;
            audio_link: string;
        };
        us: {
            phonetic: string;
            chinese_character: string;
            audio_link: string;
        };
    };
    word_definition: Array<{
        part_of_speech: string;
        text: string;
    }>;
    example?: {
        english_text: string;
        translation: string;
        audio_link: string;
    };
}
/**
 * Type union for all answer box types
 */
export type BaiduAnswerBoxAny = BaiduAnswerBoxAIContent | BaiduAnswerBoxAISearch | BaiduAnswerBoxCalculator | BaiduAnswerBoxDictionary;
/**
 * Knowledge graph entry
 */
export interface BaiduKnowledgeGraph {
    title: string;
    link: string;
    displayed_link: string;
    snippet: string;
    snippet_highlighted_words?: string[];
    thumbnail?: string;
    sitelinks?: {
        inline?: Array<{
            title: string;
            link: string;
        }>;
    };
}
/**
 * Top search suggestion
 */
export interface BaiduTopSearch {
    position: number;
    query: string;
    link: string;
}
/**
 * Top story entry
 */
export interface BaiduTopStory {
    title: string;
    link: string;
    source: string;
    date: string;
    snippet: string;
}
/**
 * Blog entry
 */
export interface BaiduBlog {
    title: string;
    link: string;
    source: string;
    snippet: string;
    reads?: string;
}
/**
 * Inline shopping item
 */
export interface BaiduInlineShopping {
    position: number;
    title: string;
    link: string;
    seller: string;
    price: string;
    extracted_price: number;
    thumbnail: string;
}
/**
 * Inline image
 */
export interface BaiduInlineImage {
    title: string;
    original: {
        link: string;
    };
    thumbnail: string;
}
/**
 * Inline videos
 */
export interface BaiduInlineVideo {
    position: number;
    title: string;
    link: string;
    source: string;
    length: string;
    image: string;
}
/**
 * Related search query
 */
export interface BaiduRelatedSearch {
    query: string;
    link: string;
}
/**
 * People also search for query
 */
export interface BaiduPeopleAlsoSearch {
    query: string;
    link: string;
}
/**
 * Complete Baidu Search API response
 */
export interface BaiduSearchResponse {
    organic_results?: BaiduOrganicResult[];
    answer_box?: BaiduAnswerBoxAny;
    ads?: any[];
    knowledge_graph?: BaiduKnowledgeGraph;
    top_searches?: BaiduTopSearch[];
    top_stories?: BaiduTopStory[];
    blogs?: BaiduBlog[];
    inline_shopping?: BaiduInlineShopping[];
    inline_images?: {
        total_images: number;
        suggestions: Array<{
            title: string;
            link: string;
        }>;
        images: BaiduInlineImage[];
    };
    inline_videos?: BaiduInlineVideo[];
    related_searches?: BaiduRelatedSearch[];
    people_also_search_for?: BaiduPeopleAlsoSearch[];
}
/**
 * Structured search result output for MCP tool
 */
export interface BaiduSearchOutput {
    total: number;
    count: number;
    offset: number;
    results: BaiduOrganicResult[];
    has_more: boolean;
    next_offset?: number;
    answer_box?: BaiduAnswerBoxAny;
    knowledge_graph?: BaiduKnowledgeGraph;
    related_searches?: BaiduRelatedSearch[];
    top_searches?: BaiduTopSearch[];
    top_stories?: BaiduTopStory[];
    blogs?: BaiduBlog[];
    inline_shopping?: BaiduInlineShopping[];
    inline_images?: {
        total_images: number;
        suggestions: Array<{
            title: string;
            link: string;
        }>;
        images: BaiduInlineImage[];
    };
    inline_videos?: BaiduInlineVideo[];
}
/**
 * API request parameters
 */
export interface BaiduSearchParams {
    engine: 'baidu';
    q: string;
    ct?: 0 | 1 | 2;
    num?: number;
    page?: number;
    gpc?: string;
    api_key: string;
}
//# sourceMappingURL=types.d.ts.map