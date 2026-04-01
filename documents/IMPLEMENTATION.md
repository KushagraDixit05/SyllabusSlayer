# Syllabus Slayer - Monorepo

> **YouTube Time Architecture Platform** - Transform content consumption chaos into calculated mastery.

This is the monorepo for Syllabus Slayer, containing both backend API and frontend application.

## 📁 Project Structure

```
SyllabusSlayer/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── config/         # Configuration management
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic (YouTube API)
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Helper functions
│   │   ├── middleware/     # Express middleware
│   │   ├── types/          # TypeScript types
│   │   ├── app.ts          # Express app setup
│   │   └── server.ts       # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/               # Next.js 14 Application
│   ├── app/               # Next.js App Router
│   ├── components/        # React components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities and API client
│   ├── store/             # Zustand state management
│   ├── types/             # TypeScript types
│   ├── package.json
│   └── tsconfig.json
│
├── package.json           # Root workspace config
├── .env.example           # Environment variables template
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- YouTube Data API v3 key ([Get one here](https://console.cloud.google.com))

### Installation

1. **Clone the repository**

```bash
cd SyllabusSlayer
```

2. **Install all dependencies**

```bash
npm install
```

This will install dependencies for both backend and frontend workspaces.

3. **Set up environment variables**

**Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env and add your YOUTUBE_API_KEY
```

**Frontend:**
```bash
cd frontend
cp .env.example .env.local
# Edit .env.local if you changed the backend port
```

### Development

**Run both backend and frontend simultaneously:**

```bash
# From root directory
npm run dev
```

This starts:
- Backend API at `http://localhost:5000`
- Frontend app at `http://localhost:3000`

**Or run individually:**

```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend
```

### Production Build

```bash
# Build both applications
npm run build

# Build individually
npm run build:backend
npm run build:frontend
```

## 🏗️ Architecture Overview

### Backend (Node.js + Express)

**Responsibility:** YouTube Data API integration and business logic

**Key Features:**
- ✅ YouTube playlist URL parsing
- ✅ Video duration aggregation via YouTube API
- ✅ Speed multiplier calculations (1x - 2x)
- ✅ Rate limiting and error handling
- ✅ RESTful API endpoints

**Tech Stack:**
- Express.js
- TypeScript
- YouTube Data API v3
- Zod (validation)
- Rate limiting middleware

**API Endpoints:**
- `GET /api/playlist?url={playlistUrl}` - Analyze playlist
- `GET /api/health` - Health check

### Frontend (Next.js 14)

**Responsibility:** User interface and experience

**Key Features:**
- ✅ Clean, modern UI with Tailwind CSS
- ✅ Responsive design (mobile-first)
- ✅ Real-time loading and error states
- ✅ Copy-to-clipboard functionality
- ✅ Smooth animations and transitions

**Tech Stack:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Zustand (state management)
- Lucide Icons

## 📖 Documentation

- [Backend README](./backend/README.md) - Backend API documentation
- [Frontend README](./frontend/README.md) - Frontend application guide
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed architecture decisions

## 🎯 Phase 1 MVP Scope

This implementation strictly follows **Phase 1** requirements:

### ✅ Implemented Features

1. **YouTube Data API Integration**
   - Playlist URL parsing
   - Duration calculation
   - Video metadata fetching

2. **Duration Calculation Engine**
   - Total time calculation
   - Speed multipliers (1x, 1.25x, 1.5x, 1.75x, 2x)
   - Human-readable formatting

3. **Basic UI/UX**
   - Single-page application
   - URL input with validation
   - Results display
   - Responsive design

4. **Essential Interactions**
   - Copy to clipboard
   - Clear/reset
   - Loading states
   - Error messages

### ❌ NOT Implemented (Future Phases)

- ❌ Authentication/Database (Phase 3)
- ❌ Partitioning system (Phase 2)
- ❌ Time-to-finish calculator (Phase 2)
- ❌ Gamification/Progress tracking (Phase 3)
- ❌ Browser extension (Phase 4)
- ❌ Premium tiers/Payments (Phase 4)

## 🔑 Environment Variables

### Backend (.env)

```env
YOUTUBE_API_KEY=your_youtube_api_key_here
PORT=5000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🧪 Testing

```bash
# Backend type check
cd backend
npm run type-check

# Frontend type check
cd frontend
npm run type-check
```

## 📦 Workspace Management

This project uses npm workspaces for monorepo management.

**Install package in specific workspace:**

```bash
npm install <package> -w backend
npm install <package> -w frontend
```

**Run commands in specific workspace:**

```bash
npm run <script> --workspace=backend
npm run <script> --workspace=frontend
```

## 🚀 Deployment

### Backend

Deploy to:
- Railway
- Fly.io
- DigitalOcean App Platform
- Heroku

Requirements:
- Node.js 18+
- Set `YOUTUBE_API_KEY` environment variable

### Frontend

Deploy to:
- **Vercel** (recommended for Next.js)
- Netlify
- Cloudflare Pages

Requirements:
- Set `NEXT_PUBLIC_API_URL` to your backend URL

## 📊 API Usage & Costs

### YouTube Data API Quota

- **Daily Limit:** 10,000 units (free tier)
- **Per Playlist Analysis:** ~3-10 units (depending on video count)
- **Cost:** FREE for reasonable usage

### Rate Limiting

- **Window:** 15 minutes
- **Max Requests:** 100 per IP

## 🤝 Contributing

This project is in active Phase 1 development. Contributions welcome!

**Please:**
- Follow the existing code structure
- Respect Phase 1 scope (no Phase 2+ features)
- Write clean, documented TypeScript
- Test your changes locally

## 📝 License

MIT

## 🔗 Related Files

- [ROADMAP.md](./ROADMAP.md) - Full development roadmap
- [TECH_STACK.md](./TECH_STACK.md) - Technology choices explained
- [README.md](./README.md) - Original project vision

---

**Built for learners, by learners. Time is finite. Make it count.**
