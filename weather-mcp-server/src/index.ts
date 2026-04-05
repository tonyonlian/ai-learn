#!/usr/bin/env node
/**
 * MCP Server for Open-Meteo Weather API.
 *
 * Provides tools to query weather information for any city worldwide,
 * including current conditions, today/tomorrow forecasts, and wind data.
 * No API key required — Open-Meteo is free and open.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from "axios";

// ─── Constants ───────────────────────────────────────────────────────────────

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";
const CHARACTER_LIMIT = 25000;

// ─── WMO Weather Code Mapping ────────────────────────────────────────────────

const WMO_WEATHER: Record<number, { cn: string; icon: string }> = {
  0: { cn: "晴", icon: "☀️" },
  1: { cn: "大部晴朗", icon: "🌤️" },
  2: { cn: "多云", icon: "⛅" },
  3: { cn: "阴天", icon: "☁️" },
  45: { cn: "雾", icon: "🌫️" },
  48: { cn: "雾凇", icon: "🌫️" },
  51: { cn: "小毛毛雨", icon: "🌦️" },
  53: { cn: "中毛毛雨", icon: "🌦️" },
  55: { cn: "大毛毛雨", icon: "🌧️" },
  56: { cn: "冻毛毛雨", icon: "🌧️" },
  57: { cn: "重冻毛毛雨", icon: "🌧️" },
  61: { cn: "小雨", icon: "🌧️" },
  63: { cn: "中雨", icon: "🌧️" },
  65: { cn: "大雨", icon: "🌧️" },
  66: { cn: "冻雨", icon: "🌧️" },
  67: { cn: "重冻雨", icon: "🌧️" },
  71: { cn: "小雪", icon: "🌨️" },
  73: { cn: "中雪", icon: "🌨️" },
  75: { cn: "大雪", icon: "❄️" },
  77: { cn: "雪粒", icon: "🌨️" },
  80: { cn: "小阵雨", icon: "🌦️" },
  81: { cn: "中阵雨", icon: "🌧️" },
  82: { cn: "大阵雨", icon: "⛈️" },
  85: { cn: "小阵雪", icon: "🌨️" },
  86: { cn: "大阵雪", icon: "❄️" },
  95: { cn: "雷暴", icon: "⛈️" },
  96: { cn: "雷暴冰雹", icon: "⛈️" },
  99: { cn: "强雷暴冰雹", icon: "⛈️" },
};

function getWeatherInfo(code: number): { cn: string; icon: string } {
  return WMO_WEATHER[code] ?? { cn: `未知(${code})`, icon: "🌡️" };
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface GeoResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  admin2?: string;
  timezone?: string;
}

interface GeocodingResponse {
  results?: GeoResult[];
}

interface OpenMeteoCurrent {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  weather_code: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  pressure_msl: number;
  precipitation: number;
}

interface OpenMeteoDaily {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  wind_speed_10m_max: number[];
  precipitation_sum: number[];
  uv_index_max: number[];
}

interface OpenMeteoHourly {
  time: string[];
  temperature_2m: number[];
  weather_code: number[];
}

interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current: OpenMeteoCurrent;
  daily: OpenMeteoDaily;
  hourly: OpenMeteoHourly;
}

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

const WeatherInputSchema = z.object({
  place: z
    .string()
    .min(1, "城市名称不能为空")
    .max(50, "城市名称不能超过50个字符")
    .describe("城市名称，例如：上海、北京、深圳、Tokyo、London"),
  sheng: z
    .string()
    .optional()
    .describe("省份/州名称（可选，用于消除歧义），例如：广东、California"),
  forecast_days: z
    .number()
    .int()
    .min(1)
    .max(16)
    .default(7)
    .describe("预报天数（1-16天，默认: 7）"),
  response_format: z
    .enum(["markdown", "json"])
    .default("markdown")
    .describe("输出格式：'markdown' 为人类可读格式，'json' 为机器可读格式"),
}).strict();

type WeatherInput = z.infer<typeof WeatherInputSchema>;

// ─── Shared Utilities ────────────────────────────────────────────────────────

/**
 * Geocode city name to latitude/longitude using Open-Meteo Geocoding API.
 */
async function geocodeCity(
  place: string,
  sheng?: string
): Promise<GeoResult> {
  const params: Record<string, string> = {
    name: place,
    count: "5",
    language: "zh",
    format: "json",
  };
  if (sheng) params.admin1 = sheng;

  const response = await axios.get<GeocodingResponse>(GEOCODING_URL, {
    params,
    timeout: 15000,
  });

  if (!response.data.results || response.data.results.length === 0) {
    const query = sheng ? `${place}, ${sheng}` : place;
    throw new Error(`未找到城市 "${query}"。请检查名称是否正确，或使用英文拼音重试。`);
  }

  return response.data.results[0];
}

/**
 * Fetch weather data from Open-Meteo API.
 */
async function fetchWeather(
  latitude: number,
  longitude: number,
  forecastDays: number
): Promise<OpenMeteoResponse> {
  const response = await axios.get<OpenMeteoResponse>(WEATHER_URL, {
    params: {
      latitude,
      longitude,
      current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl,precipitation",
      daily: "weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,precipitation_sum,uv_index_max",
      hourly: "temperature_2m,weather_code",
      timezone: "auto",
      forecast_days: forecastDays,
    },
    timeout: 30000,
  });
  return response.data;
}

/**
 * Handle API and network errors with actionable messages.
 */
function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      return `错误：API 请求失败，状态码 ${error.response.status}`;
    } else if (error.code === "ECONNABORTED") {
      return "错误：请求超时，请检查网络连接后重试。";
    } else if (error.code === "ENOTFOUND") {
      return "错误：无法连接到天气 API 服务器，请检查网络连接。";
    }
  }
  if (error instanceof Error) {
    return `错误：${error.message}`;
  }
  return `错误：发生意外错误：${String(error)}`;
}

/**
 * Get wind direction name from degrees.
 */
function getWindDirection(degrees: number): string {
  const dirs = ["北", "东北", "东", "东南", "南", "西南", "西", "西北"];
  const index = Math.round(degrees / 45) % 8;
  return dirs[index];
}

/**
 * Get wind scale from speed (km/h).
 */
function getWindScale(speedKmh: number): string {
  const speed = speedKmh / 3.6; // convert to m/s
  if (speed < 0.3) return "无风";
  if (speed < 1.6) return "软风";
  if (speed < 3.4) return "轻风";
  if (speed < 5.5) return "微风";
  if (speed < 8.0) return "和风";
  if (speed < 10.8) return "清风";
  if (speed < 13.9) return "强风";
  if (speed < 17.2) return "劲风";
  if (speed < 20.8) return "大风";
  if (speed < 24.5) return "烈风";
  return "狂风";
}

/**
 * Get UV level description.
 */
function getUVLevel(uv: number): string {
  if (uv <= 2) return "低";
  if (uv <= 5) return "中等";
  if (uv <= 7) return "高";
  if (uv <= 10) return "很高";
  return "极高";
}

/**
 * Format weather response as markdown.
 */
function formatMarkdown(
  data: OpenMeteoResponse,
  location: GeoResult,
  forecastDays: number
): string {
  const lines: string[] = [];
  const now = data.current;
  const daily = data.daily;
  const weatherNow = getWeatherInfo(now.weather_code);

  // Header
  const locationParts = [location.name];
  if (location.admin1) locationParts.push(location.admin1);
  if (location.country) locationParts.push(location.country);

  lines.push(`# ${weatherNow.icon} ${locationParts.join("，")} 天气预报`);
  lines.push("");
  lines.push(`**位置**: ${location.latitude.toFixed(2)}°N, ${location.longitude.toFixed(2)}°E`);
  lines.push(`**海拔**: ${data.elevation}m`);
  lines.push(`**时区**: ${data.timezone}`);
  lines.push(`**更新时间**: ${now.time}`);
  lines.push("");

  // Current weather
  lines.push("## 实时天气");
  lines.push("");
  lines.push(`| 指标 | 数值 |`);
  lines.push(`|------|------|`);
  lines.push(`| 天气 | ${weatherNow.icon} ${weatherNow.cn} |`);
  lines.push(`| 温度 | ${now.temperature_2m}°C |`);
  lines.push(`| 体感温度 | ${now.apparent_temperature}°C |`);
  lines.push(`| 湿度 | ${now.relative_humidity_2m}% |`);
  lines.push(`| 气压 | ${now.pressure_msl} hPa |`);
  lines.push(`| 降水 | ${now.precipitation} mm |`);
  lines.push(`| 风向 | ${getWindDirection(now.wind_direction_10m)} (${now.wind_direction_10m}°) |`);
  lines.push(`| 风速 | ${(now.wind_speed_10m / 3.6).toFixed(1)} m/s (${getWindScale(now.wind_speed_10m)}) |`);
  lines.push("");

  // Daily forecast
  lines.push("## 天气预报");
  lines.push("");
  lines.push("| 日期 | 天气 | 最高温 | 最低温 | 降水 | UV | 最大风速 |");
  lines.push("|------|------|--------|--------|------|-----|----------|");

  for (let i = 0; i < Math.min(daily.time.length, forecastDays); i++) {
    const w = getWeatherInfo(daily.weather_code[i]);
    const date = daily.time[i];
    lines.push(
      `| ${date} | ${w.icon} ${w.cn} | ${daily.temperature_2m_max[i]}°C | ${daily.temperature_2m_min[i]}°C | ${daily.precipitation_sum[i]}mm | ${daily.uv_index_max[i]}(${getUVLevel(daily.uv_index_max[i])}) | ${(daily.wind_speed_10m_max[i] / 3.6).toFixed(1)}m/s |`
    );
  }
  lines.push("");

  // Today's hourly temperature trend
  const today = daily.time[0];
  const todayHours = data.hourly.time
    .map((t, i) => ({ time: t, temp: data.hourly.temperature_2m[i], code: data.hourly.weather_code[i] }))
    .filter((h) => h.time.startsWith(today));

  if (todayHours.length > 0) {
    lines.push("## 今日逐时温度");
    lines.push("");
    lines.push("| 时间 | 温度 | 天气 |");
    lines.push("|------|------|------|");
    for (const h of todayHours) {
      const w = getWeatherInfo(h.code);
      const hour = h.time.split("T")[1]?.slice(0, 5) ?? h.time;
      lines.push(`| ${hour} | ${h.temp}°C | ${w.icon} ${w.cn} |`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

/**
 * Format weather response as structured JSON.
 */
function formatJson(
  data: OpenMeteoResponse,
  location: GeoResult,
  forecastDays: number
): Record<string, unknown> {
  const now = data.current;
  const daily = data.daily;

  return {
    location: {
      name: location.name,
      admin1: location.admin1 ?? null,
      country: location.country,
      latitude: location.latitude,
      longitude: location.longitude,
      elevation: data.elevation,
      timezone: data.timezone,
    },
    current: {
      time: now.time,
      weather: getWeatherInfo(now.weather_code),
      temperature: now.temperature_2m,
      feelsLike: now.apparent_temperature,
      humidity: now.relative_humidity_2m,
      pressure: now.pressure_msl,
      precipitation: now.precipitation,
      wind: {
        direction: getWindDirection(now.wind_direction_10m),
        degrees: now.wind_direction_10m,
        speed: now.wind_speed_10m,
        scale: getWindScale(now.wind_speed_10m),
      },
    },
    forecast: daily.time.slice(0, forecastDays).map((date, i) => ({
      date,
      weather: getWeatherInfo(daily.weather_code[i]),
      tempMax: daily.temperature_2m_max[i],
      tempMin: daily.temperature_2m_min[i],
      precipitation: daily.precipitation_sum[i],
      uvMax: daily.uv_index_max[i],
      uvLevel: getUVLevel(daily.uv_index_max[i]),
      windMax: daily.wind_speed_10m_max[i],
    })),
  };
}

// ─── MCP Server Setup ────────────────────────────────────────────────────────

const server = new McpServer({
  name: "weather-mcp-server",
  version: "2.0.0",
});

server.registerTool(
  "weather_get_forecast",
  {
    title: "查询城市天气预报",
    description: `查询全球任意城市的天气预报信息，包括实时天气、未来多日预报、逐时温度等。

数据来源于 Open-Meteo（免费开源，无需 API Key），支持全球范围内的城市查询。

Args:
  - place (string): 城市名称，例如：上海、北京、深圳、Tokyo、London
  - sheng (string, 可选): 省份/州名称，用于消除歧义，例如：广东、California
  - forecast_days (number): 预报天数（1-16天，默认: 7）
  - response_format ('markdown' | 'json'): 输出格式（默认: 'markdown'）

Returns:
  包含以下信息的天气预报：
  - 实时天气：温度、体感温度、湿度、气压、降水、风向风速、天气状况
  - 逐日预报：天气状况、最高/最低温、降水、UV指数、最大风速
  - 今日逐时温度变化

Examples:
  - 查询上海天气：place="上海"
  - 查询广东深圳天气：place="深圳", sheng="广东"
  - 查询东京天气：place="Tokyo"
  - 查询伦敦10天预报：place="London", forecast_days=10

Error Handling:
  - 返回 "错误：未找到城市" 如果城市名称无法识别
  - 返回 "错误：请求超时" 如果网络问题`,
    inputSchema: WeatherInputSchema,
    outputSchema: {
      location: z.object({
        name: z.string(),
        admin1: z.string().nullable(),
        country: z.string(),
        latitude: z.number(),
        longitude: z.number(),
        elevation: z.number(),
        timezone: z.string(),
      }),
      current: z.object({
        time: z.string(),
        weather: z.object({ cn: z.string(), icon: z.string() }),
        temperature: z.number(),
        feelsLike: z.number(),
        humidity: z.number(),
        pressure: z.number(),
        precipitation: z.number(),
        wind: z.object({
          direction: z.string(),
          degrees: z.number(),
          speed: z.number(),
          scale: z.string(),
        }),
      }),
      forecast: z.array(
        z.object({
          date: z.string(),
          weather: z.object({ cn: z.string(), icon: z.string() }),
          tempMax: z.number(),
          tempMin: z.number(),
          precipitation: z.number(),
          uvMax: z.number(),
          uvLevel: z.string(),
          windMax: z.number(),
        })
      ),
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  async (params: WeatherInput) => {
    try {
      // Step 1: Geocode
      const geo = await geocodeCity(params.place, params.sheng);

      // Step 2: Fetch weather
      const data = await fetchWeather(
        geo.latitude,
        geo.longitude,
        params.forecast_days
      );

      // Step 3: Format output
      const structuredOutput = formatJson(data, geo, params.forecast_days);
      let textContent: string;

      if (params.response_format === "markdown") {
        textContent = formatMarkdown(data, geo, params.forecast_days);
      } else {
        textContent = JSON.stringify(structuredOutput, null, 2);
      }

      // Check character limit
      if (textContent.length > CHARACTER_LIMIT) {
        textContent = textContent.slice(0, CHARACTER_LIMIT) + "\n\n[响应已截断]";
      }

      return {
        content: [{ type: "text", text: textContent }],
        structuredContent: structuredOutput,
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: handleApiError(error),
          },
        ],
      };
    }
  }
);

// ─── Main Entry Point ────────────────────────────────────────────────────────

async function runStdio() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Weather MCP server running via stdio (Open-Meteo API)");
}

runStdio().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
