# Weather MCP Server

MCP server for querying global weather forecasts via [Open-Meteo API](https://open-meteo.com/).

## Features

- ✅ Query weather for any city worldwide (geocoding included)
- ✅ Real-time weather: temperature, humidity, pressure, wind, precipitation
- ✅ Multi-day forecast (1-16 days)
- ✅ Hourly temperature trend for today
- ✅ UV index, precipitation, wind speed data
- ✅ No API key required — free and open
- ✅ Both markdown and JSON output formats
- ✅ Chinese language support

## Available Tools

### `weather_get_forecast`

Query weather forecast for any city.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `place` | string | Yes | City name (e.g., 上海, Beijing, Tokyo, London) |
| `sheng` | string | No | Province/state for disambiguation (e.g., 广东, California) |
| `forecast_days` | number | No | Forecast days 1-16 (default: 7) |
| `response_format` | enum | No | `markdown` (default) or `json` |

**Example:**
```json
{
  "place": "上海",
  "forecast_days": 7,
  "response_format": "markdown"
}
```

## Setup

### Prerequisites

- Node.js >= 18
- npm

### Installation

```bash
npm install
npm run build
```

### Running

```bash
npm start
```

### Configure in MCP Client

```json
{
  "mcpServers": {
    "weather": {
      "command": "node",
      "args": ["path/to/weather-mcp-server/dist/index.js"]
    }
  }
}
```

## API Reference

- **Weather API**: `https://api.open-meteo.com/v1/forecast`
- **Geocoding API**: `https://geocoding-api.open-meteo.com/v1/search`
- **Data Source**: Open-Meteo (free, open-source)
- **License**: CC BY 4.0

## Examples

### Query Shanghai weather
```json
{
  "place": "上海"
}
```

### Query Shenzhen with province
```json
{
  "place": "深圳",
  "sheng": "广东"
}
```

### Query Tokyo 10-day forecast
```json
{
  "place": "Tokyo",
  "forecast_days": 10,
  "response_format": "json"
}
```
