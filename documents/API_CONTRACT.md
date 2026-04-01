# API Contract: Syllabus Slayer

> **Formal specification of the backend API endpoints**

## Base URL

**Development:** `http://localhost:5000/api`  
**Production:** `https://api.syllabusslayer.com/api` (future)

## Authentication

Phase 1 MVP does not require authentication. All endpoints are public with rate limiting.

## Rate Limiting

- **Window:** 15 minutes
- **Max Requests:** 100 per IP address
- **Headers:**
  - `RateLimit-Limit`: Maximum requests allowed
  - `RateLimit-Remaining`: Requests remaining
  - `RateLimit-Reset`: Time when limit resets (Unix timestamp)

## Response Format

All responses follow a consistent structure:

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE"
  }
}
```

---

## Endpoints

### 1. Get Playlist Data

Fetch and analyze a YouTube playlist.

**Endpoint:** `GET /api/playlist`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | string | Conditional* | Full YouTube playlist URL |
| `playlistId` | string | Conditional* | Direct YouTube playlist ID |

*Either `url` OR `playlistId` must be provided, not both.

**Example Requests:**

```bash
# Using URL
GET /api/playlist?url=https://www.youtube.com/playlist?list=PLWKjhJtqVAbnqBxcdjVGgT3uVR10bzTEB

# Using playlist ID
GET /api/playlist?playlistId=PLWKjhJtqVAbnqBxcdjVGgT3uVR10bzTEB
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "title": "Complete Python Course",
    "videoCount": 42,
    "totalDuration": 15430,
    "totalDurationFormatted": "4h 17m",
    "averageVideoLength": 367,
    "averageVideoLengthFormatted": "6m 7s",
    "speeds": {
      "1": "4h 17m",
      "1.25": "3h 26m",
      "1.5": "2h 51m",
      "1.75": "2h 27m",
      "2": "2h 8m"
    },
    "videos": [
      {
        "id": "xyz123",
        "title": "Introduction to Python",
        "duration": 600
      },
      ...
    ]
  }
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Playlist title from YouTube |
| `videoCount` | number | Total number of videos in playlist |
| `totalDuration` | number | Total duration in seconds |
| `totalDurationFormatted` | string | Human-readable total duration (e.g., "4h 17m") |
| `averageVideoLength` | number | Average video length in seconds |
| `averageVideoLengthFormatted` | string | Human-readable average length |
| `speeds` | object | Duration at different playback speeds |
| `speeds["1"]` | string | Duration at 1x speed |
| `speeds["1.25"]` | string | Duration at 1.25x speed |
| `speeds["1.5"]` | string | Duration at 1.5x speed |
| `speeds["1.75"]` | string | Duration at 1.75x speed |
| `speeds["2"]` | string | Duration at 2x speed |
| `videos` | array | Array of video objects (optional) |
| `videos[].id` | string | YouTube video ID |
| `videos[].title` | string | Video title |
| `videos[].duration` | number | Video duration in seconds |

**Error Responses:**

**400 Bad Request - Invalid URL:**
```json
{
  "success": false,
  "error": {
    "message": "Invalid YouTube playlist URL",
    "code": "INVALID_URL"
  }
}
```

**400 Bad Request - Invalid Playlist ID:**
```json
{
  "success": false,
  "error": {
    "message": "Invalid playlist ID format",
    "code": "INVALID_PLAYLIST_ID"
  }
}
```

**400 Bad Request - Missing Parameters:**
```json
{
  "success": false,
  "error": {
    "message": "Either url or playlistId must be provided",
    "code": "VALIDATION_ERROR"
  }
}
```

**400 Bad Request - Empty Playlist:**
```json
{
  "success": false,
  "error": {
    "message": "Playlist is empty",
    "code": "EMPTY_PLAYLIST"
  }
}
```

**404 Not Found - Playlist Not Found:**
```json
{
  "success": false,
  "error": {
    "message": "Playlist not found or is private",
    "code": "PLAYLIST_NOT_FOUND"
  }
}
```

**429 Too Many Requests - Rate Limit:**
```json
{
  "success": false,
  "error": {
    "message": "Too many requests from this IP. Please try again later.",
    "code": "RATE_LIMIT_EXCEEDED"
  }
}
```

**429 Too Many Requests - YouTube Quota:**
```json
{
  "success": false,
  "error": {
    "message": "YouTube API quota exceeded. Please try again later.",
    "code": "QUOTA_EXCEEDED"
  }
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": {
    "message": "An unexpected error occurred. Please try again.",
    "code": "INTERNAL_ERROR"
  }
}
```

---

### 2. Health Check

Check API server status.

**Endpoint:** `GET /api/health`

**Query Parameters:** None

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-02-15T10:30:45.123Z"
  }
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Server status ("healthy") |
| `timestamp` | string | Current server time (ISO 8601) |

---

## Error Codes Reference

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `INVALID_URL` | 400 | Invalid YouTube URL format |
| `INVALID_PLAYLIST_ID` | 400 | Invalid playlist ID format |
| `EMPTY_PLAYLIST` | 400 | Playlist contains no videos |
| `PLAYLIST_NOT_FOUND` | 404 | Playlist doesn't exist or is private |
| `NOT_FOUND` | 404 | Route not found |
| `QUOTA_EXCEEDED` | 429 | YouTube API quota limit reached |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests from IP |
| `API_ERROR` | 500 | YouTube API communication error |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## Supported Playlist URL Formats

The API accepts the following YouTube playlist URL formats:

```
✅ https://www.youtube.com/playlist?list=PLxxxxxx
✅ https://youtube.com/playlist?list=PLxxxxxx
✅ www.youtube.com/playlist?list=PLxxxxxx
✅ https://www.youtube.com/watch?v=xxxxx&list=PLxxxxxx
✅ PLxxxxxx (direct playlist ID)
```

**Playlist ID Prefixes:**
- `PL` - Regular playlists
- `UU` - User uploads
- `LL` - Liked videos
- `RD` - Radio mixes
- `OL` - Ordered lists

---

## Usage Examples

### cURL

```bash
# Get playlist data
curl "http://localhost:5000/api/playlist?url=https://www.youtube.com/playlist?list=PLWKjhJtqVAbnqBxcdjVGgT3uVR10bzTEB"

# Health check
curl "http://localhost:5000/api/health"
```

### JavaScript (Fetch)

```javascript
// Get playlist data
const response = await fetch(
  'http://localhost:5000/api/playlist?url=https://www.youtube.com/playlist?list=PLWKjhJtqVAbnqBxcdjVGgT3uVR10bzTEB'
);
const data = await response.json();

if (data.success) {
  console.log('Playlist:', data.data);
} else {
  console.error('Error:', data.error);
}
```

### TypeScript (with types)

```typescript
import type { ApiResponse, PlaylistData } from './types';

async function fetchPlaylist(url: string): Promise<PlaylistData> {
  const params = new URLSearchParams({ url });
  const response = await fetch(`http://localhost:5000/api/playlist?${params}`);
  
  if (!response.ok) {
    const error: ApiResponse = await response.json();
    throw new Error(error.error?.message || 'API request failed');
  }
  
  const data: ApiResponse<PlaylistData> = await response.json();
  
  if (!data.success || !data.data) {
    throw new Error('Invalid response');
  }
  
  return data.data;
}
```

---

## Performance Characteristics

### Response Times

- **Typical:** 1-3 seconds
- **Large playlists (100+ videos):** 3-5 seconds
- **Depends on:** YouTube API response time, network latency, playlist size

### Caching (Future Phase)

Phase 1 does not implement caching. Future phases will add:
- Redis caching for playlist metadata
- Cache TTL: 24 hours
- Cache invalidation on user request

---

## Versioning

**Current Version:** v1 (Phase 1 MVP)

Future versions will use URL-based versioning:
- `/api/v1/playlist`
- `/api/v2/playlist`

---

## CORS Configuration

**Allowed Origins (Development):**
- `http://localhost:3000`

**Allowed Origins (Production):**
- `https://syllabusslayer.com`
- Future: Browser extension origins

**Allowed Methods:**
- `GET`

**Allowed Headers:**
- `Content-Type`

---

## Rate Limit Details

**Algorithm:** Sliding window

**Limits:**
- 100 requests per 15 minutes per IP
- Applies to all `/api/*` routes

**Headers in Response:**
```
RateLimit-Limit: 100
RateLimit-Remaining: 87
RateLimit-Reset: 1707996645
```

**Exceeding Limit:**
- Returns 429 status code
- Retry after window expires
- No progressive throttling

---

## Future Enhancements

### Phase 2 Additions

- `POST /api/playlist/partition` - Partition playlists into sessions
- `POST /api/playlist/schedule` - Calculate completion timeline

### Phase 3 Additions

- Authentication required endpoints
- User-specific playlist history
- Progress tracking endpoints

---

**This contract is the source of truth for Phase 1 MVP API implementation.**
