# Syllabus Slayer Backend

Backend API service for YouTube playlist analysis and duration calculation.

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **API**: YouTube Data API v3

## Features

- ✅ YouTube playlist ID parsing and validation
- ✅ Fetch playlist metadata via YouTube Data API
- ✅ Duration calculation and aggregation
- ✅ Speed multiplier calculations (1x, 1.25x, 1.5x, 1.75x, 2x)
- ✅ Rate limiting protection
- ✅ Comprehensive error handling
- ✅ CORS configuration

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration management
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic (YouTube API integration)
│   ├── routes/          # API route definitions
│   ├── utils/           # Helper functions
│   ├── middleware/      # Express middleware
│   ├── types/           # TypeScript type definitions
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── package.json
├── tsconfig.json
└── .env.example
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Add your YouTube Data API key:

```env
YOUTUBE_API_KEY=your_actual_api_key_here
PORT=5000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000
```

### 3. Get YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable YouTube Data API v3
4. Create credentials (API Key)
5. Copy the API key to `.env`

## Development

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type check
npm run type-check

# Lint
npm run lint
```

## API Endpoints

### GET /api/playlist

Fetch and analyze YouTube playlist data.

**Query Parameters:**
- `url` (string, optional): Full YouTube playlist URL
- `playlistId` (string, optional): Direct playlist ID

**Response:**

```json
{
  "success": true,
  "data": {
    "title": "Playlist Title",
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
    }
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "error": {
    "message": "Invalid YouTube playlist URL",
    "code": "INVALID_URL"
  }
}
```

### GET /api/health

Health check endpoint.

**Response:**

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-02-15T10:30:00.000Z"
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Invalid request parameters |
| `INVALID_URL` | Invalid YouTube URL format |
| `INVALID_PLAYLIST_ID` | Invalid playlist ID format |
| `PLAYLIST_NOT_FOUND` | Playlist doesn't exist or is private |
| `EMPTY_PLAYLIST` | Playlist contains no videos |
| `QUOTA_EXCEEDED` | YouTube API quota limit reached |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_ERROR` | Server error |

## Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per IP

## YouTube API Quota

- **Daily Limit**: 10,000 units
- **Cost per Request**:
  - Playlist details: 1 unit
  - Playlist items: 1 unit per page
  - Video details: 1 unit per batch (50 videos)

**Example**: A 200-video playlist costs ~7 units

## Architecture Decisions

### Why Express over Next.js API Routes?

- **Separation of Concerns**: Clean backend/frontend split
- **Deployment Flexibility**: Backend can scale independently
- **Caching Strategy**: Easier to implement API-level caching
- **Multi-client Support**: Same backend can serve web, mobile, extension

### Why Native Fetch over Axios?

- **No Dependencies**: Reduced bundle size
- **Modern Standard**: Built into Node.js 18+
- **Sufficient Features**: Adequate for simple API calls

### Why Zod for Validation?

- **Type Safety**: Auto-inferred TypeScript types
- **Runtime Validation**: Catches invalid requests
- **Better Error Messages**: Clear validation feedback

## License

MIT
