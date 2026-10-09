# SyllabusSlayer Backend

Express + TypeScript API that parses YouTube playlist URLs, fetches video durations from the YouTube Data API v3 and returns totals at several playback speeds. It is stateless and has no authentication; auth, database and user features live in the Next.js frontend.

- Endpoints: `GET /api/playlist?url=… | ?playlistId=…`, `GET /api/health`
- Middleware: helmet, CORS allow-list, Zod validation, per-IP rate limit (100 / 15 min), uniform `{success, data | error}` responses
- Source layout: `src/{config,routes,controllers,services,middleware,utils,types}`, entry `src/server.ts`

## Configuration (`backend/.env`, template in `.env.example`)

| Variable | Required | Default |
|---|---|---|
| `YOUTUBE_API_KEY` | yes | – |
| `PORT` | no | `5000` |
| `NODE_ENV` | no | `development` |
| `ALLOWED_ORIGINS` (comma-separated) | no | `http://localhost:3000` |
| `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX_REQUESTS` | no | `900000` / `100` |

## Commands

```bash
npm run dev          # tsx watch src/server.ts
npm run build        # tsc → dist/
npm start            # node dist/server.js
npm run type-check
npm run lint
```
(Run from `backend/`, or from the repo root with `--workspace=backend`.)

## More

API contract, error codes and quota maths: [ARCHITECTURE.md §5](../documents/ARCHITECTURE.md#5-backend). Deployment and CORS/env guidance: [DEPLOYMENT.md](../documents/DEPLOYMENT.md).
