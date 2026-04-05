/**
 * Baidu Search MCP tool implementation
 */

import type { BaiduSearchInput } from '../schemas.js';
import type { BaiduSearchResponse, BaiduSearchOutput, BaiduOrganicResult } from '../types.js';
import { baiduSearch } from '../services/baidu-api.js';
import { CHARACTER_LIMIT } from '../constants.js';

/**
 * Format search results as Markdown for human readability
 */
function formatMarkdown(
  query: string,
  data: BaiduSearchResponse,
  limit: number,
  offset: number
): string {
  const organicResults = data.organic_results || [];
  const total = organicResults.length;
  const count = organicResults.slice(0, limit).length;

  const lines: string[] = [
    `# Search Results: '${query}'`,
    '',
    `Found ${total} results (showing ${offset + 1}-${offset + count})`,
    ''
  ];

  // Organic results
  for (const result of organicResults.slice(0, limit)) {
    lines.push(`## ${result.title} (${result.position})`);
    lines.push(`- **URL**: ${result.link}`);
    lines.push(`- **Display URL**: ${result.displayed_link}`);
    if (result.snippet) {
      lines.push(`- **Snippet**: ${result.snippet}`);
    }
    lines.push('');
  }

  // Answer box
  if (data.answer_box) {
    lines.push('## Answer Box');
    lines.push(`**Type**: ${data.answer_box.type}`);
    if (data.answer_box.title) {
      lines.push(`**Title**: ${data.answer_box.title}`);
    }
    if ('answer' in data.answer_box && data.answer_box.answer) {
      lines.push(`**Answer**: ${data.answer_box.answer}`);
    }
    lines.push('');
  }

  // Knowledge graph
  if (data.knowledge_graph) {
    lines.push('## Knowledge Graph');
    lines.push(`**Title**: ${data.knowledge_graph.title}`);
    lines.push(`**Source**: ${data.knowledge_graph.displayed_link}`);
    if (data.knowledge_graph.snippet) {
      lines.push(`**Summary**: ${data.knowledge_graph.snippet}`);
    }
    lines.push('');
  }

  // Related searches
  if (data.related_searches && data.related_searches.length > 0) {
    lines.push('## Related Searches');
    for (const search of data.related_searches.slice(0, 5)) {
      lines.push(`- ${search.query}`);
    }
    lines.push('');
  }

  // Top searches
  if (data.top_searches && data.top_searches.length > 0) {
    lines.push('## Top Searches');
    for (const search of data.top_searches.slice(0, 5)) {
      lines.push(`- ${search.query}`);
    }
    lines.push('');
  }

  // Top stories
  if (data.top_stories && data.top_stories.length > 0) {
    lines.push('## Top Stories');
    for (const story of data.top_stories.slice(0, 3)) {
      lines.push(`### ${story.title}`);
      lines.push(`- **Source**: ${story.source}`);
      lines.push(`- **Date**: ${story.date}`);
      if (story.snippet) {
        lines.push(`- **Summary**: ${story.snippet}`);
      }
      lines.push('');
    }
  }

  // Blogs
  if (data.blogs && data.blogs.length > 0) {
    lines.push('## Blog Posts');
    for (const blog of data.blogs.slice(0, 3)) {
      lines.push(`### ${blog.title}`);
      lines.push(`- **Source**: ${blog.source}`);
      if (blog.reads) {
        lines.push(`- **Reads**: ${blog.reads}`);
      }
      if (blog.snippet) {
        lines.push(`- **Snippet**: ${blog.snippet}`);
      }
      lines.push('');
    }
  }

  // Shopping
  if (data.inline_shopping && data.inline_shopping.length > 0) {
    lines.push('## Shopping Results');
    for (const item of data.inline_shopping.slice(0, 3)) {
      lines.push(`### ${item.title}`);
      lines.push(`- **Seller**: ${item.seller}`);
      lines.push(`- **Price**: ${item.price}`);
      lines.push(`- **Link**: ${item.link}`);
      lines.push('');
    }
  }

  return lines.join('\n');
}

/**
 * Prepare structured output with pagination metadata
 */
function prepareStructuredOutput(
  data: BaiduSearchResponse,
  limit: number,
  offset: number
): BaiduSearchOutput {
  const organicResults = data.organic_results || [];
  const total = organicResults.length;
  const results = organicResults.slice(0, limit);

  const output: BaiduSearchOutput = {
    total,
    count: results.length,
    offset,
    results,
    has_more: total > offset + limit,
    ...(total > offset + limit ? { next_offset: offset + limit } : {})
  };

  // Add optional fields if present
  if (data.answer_box) {
    output.answer_box = data.answer_box;
  }

  if (data.knowledge_graph) {
    output.knowledge_graph = data.knowledge_graph;
  }

  if (data.related_searches && data.related_searches.length > 0) {
    output.related_searches = data.related_searches;
  }

  if (data.top_searches && data.top_searches.length > 0) {
    output.top_searches = data.top_searches;
  }

  if (data.top_stories && data.top_stories.length > 0) {
    output.top_stories = data.top_stories;
  }

  if (data.blogs && data.blogs.length > 0) {
    output.blogs = data.blogs;
  }

  if (data.inline_shopping && data.inline_shopping.length > 0) {
    output.inline_shopping = data.inline_shopping;
  }

  if (data.inline_images) {
    output.inline_images = data.inline_images;
  }

  if (data.inline_videos && data.inline_videos.length > 0) {
    output.inline_videos = data.inline_videos;
  }

  return output;
}

/**
 * Check character limit and truncate if needed
 */
function checkCharacterLimit(text: string): string {
  if (text.length > CHARACTER_LIMIT) {
    const truncatedMessage =
      `\n\n---\n` +
      `Response truncated due to character limit (${text.length} > ${CHARACTER_LIMIT}). ` +
      `Use the 'offset' parameter or add filters to see more results.`;
    return text.substring(0, CHARACTER_LIMIT - truncatedMessage.length) + truncatedMessage;
  }
  return text;
}

/**
 * Export search tool for MCP server registration
 */
export async function baiduSearchTool(params: BaiduSearchInput) {
  try {
    // Call Baidu Search API
    const data = await baiduSearch(params.query, {
      limit: params.limit,
      offset: params.offset,
      language: params.language,
      timeFilter: params.time_filter
    });

    // Check for empty results
    const organicResults = data.organic_results || [];
    if (organicResults.length === 0) {
      return {
        content: [{
          type: 'text' as const,
          text: `No results found for query: '${params.query}'`
        }]
      };
    }

    // Prepare structured output
    const structuredOutput = prepareStructuredOutput(
      data,
      params.limit,
      params.offset
    );

    // Format based on response format preference
    let textContent: string;
    if (params.response_format === 'json') {
      textContent = JSON.stringify(structuredOutput, null, 2);
    } else {
      textContent = formatMarkdown(params.query, data, params.limit, params.offset);
    }

    // Check character limit
    textContent = checkCharacterLimit(textContent);

    // Return text content only (structuredContent not supported in v1 SDK)
    return {
      content: [{ type: 'text' as const, text: textContent }]
    };
  } catch (error) {
    // Return error as text content
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [{
        type: 'text' as const,
        text: errorMessage
      }]
    };
  }
}
