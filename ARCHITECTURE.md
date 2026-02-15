# Architecture Documentation: Syllabus Slayer

> **Production-grade monorepo architecture for Phase 1 MVP**

## 🎯 Architecture Philosophy

### Core Principles

1. **Separation of Concerns**
   - Backend handles all business logic and external API integration
   - Frontend focuses purely on presentation and user interaction
   - Clear API contract between layers

2. **Scalability from Day One**
   - Monorepo structure allows independent scaling
   - Backend can serve multiple clients (web, mobile, extension)
   - Clean architecture enables easy feature addition in future phases

3. **Type Safety Throughout**
   - TypeScript in both backend and frontend
   - Shared type definitions for API contracts
   - Compile-time error catching

4. **Developer Experience**
   - Hot reload in both environments
   - Clear folder structure
   - Comprehensive error handling
   - Self-documenting code

## 🏛️ System Architecture

```
┌──────────────────────────────────────────────────────┐
│                    User Browser                       │
│                                                       │
│  ┌─────────────────────────────────────────────┐   │
│  │         Frontend (Next.js 14)                │   │
│  │  - React Components                          │   │
│  │  - Zustand State Management                  │   │
│  │  - Tailwind CSS Styling                      │   │
│  │  - API Client Layer                          │   │
│  └─────────────────┬───────────────────────────┘   │
└────────────────────┼──────────────────────────────────┘
                     │
                     │ HTTP/REST
                     │
┌────────────────────▼──────────────────────────────────┐
│             Backend (Node + Express)                   │
│                                                        │
│  ┌──────────────────────────────────────────────┐   │
│  │  API Layer                                    │   │
│  │  - Routes (URL mapping)                       │   │
│  │  - Controllers (Request handling)             │   │
│  │  - Middleware (Rate limit, CORS, errors)     │   │
│  └──────────────────┬───────────────────────────┘   │
│                     │                                 │
│  ┌──────────────────▼───────────────────────────┐   │
│  │  Business Logic Layer                         │   │
│  │  - Services (YouTube integration)             │   │
│  │  - Utils (Parsing, calculation)               │   │
│  └──────────────────┬───────────────────────────┘   │
└────────────────────┼──────────────────────────────────┘
                     │
                     │ HTTPS
                     │
┌────────────────────▼──────────────────────────────────┐
│            YouTube Data API v3                         │
│  - Playlist metadata                                   │
│  - Video details and durations                         │
└───────────────────────────────────────────────────────┘
```

## 📂 Backend Architecture

### MVC Pattern Implementation

```
backend/src/
├── config/           # Configuration & environment
│   └── config.ts     # Centralized config management
│
├── routes/           # URL routing
│   └── playlistRoutes.ts
│
├── controllers/      # Request/Response handling
│   └── playlistController.ts
│
├── services/         # Business logic
│   └── youtubeService.ts
│
├── utils/            # Helper functions
│   ├── urlParser.ts
│   └── durationCalculator.ts
│
├── middleware/       # Express middleware
│   ├── rateLimiter.ts
│   └── errorHandler.ts
│
├── types/            # TypeScript definitions
│   └── index.ts
│
├── app.ts            # Express app setup
└── server.ts         # Server entry point
```

### Request Flow

```
1. HTTP Request
   ↓
2. Rate Limiter Middleware
   ↓
3. CORS Middleware
   ↓
4. Router (playlistRoutes.ts)
   ↓
5. Controller (playlistController.ts)
   - Validate request (Zod schema)
   - Extract playlist ID
   ↓
6. Service (youtubeService.ts)
   - Fetch from YouTube API
   - Parse durations
   - Calculate speeds
   ↓
7. Controller formats response
   ↓
8. HTTP Response (JSON)
```

### Error Handling Strategy

**3-Layer Error Handling:**

1. **Service Layer:** Throws `AppError` for known issues
2. **Controller Layer:** Catches and forwards to error middleware
3. **Middleware Layer:** Formats errors for client consumption

```typescript
// Custom error with context
throw new AppError('Playlist not found', 404, 'PLAYLIST_NOT_FOUND');

// Error middleware transforms to:
{
  "success": false,
  "error": {
    "message": "Playlist not found",
    "code": "PLAYLIST_NOT_FOUND"
  }
}
```

### YouTube API Integration

**Quota-Efficient Design:**

- Batch video detail requests (50 videos per API call)
- Pagination handling for large playlists
- Error handling for quota exceeded

**Cost Analysis:**
```
Playlist with 200 videos:
- Playlist details: 1 unit
- Playlist items (4 pages × 50): 4 units
- Video details (4 batches × 50): 4 units
Total: 9 units (0.09% of daily quota)
```

## 📱 Frontend Architecture

### Component Hierarchy

```
app/
├── layout.tsx (Root Layout)
│   └── page.tsx (Main Page)
│       ├── PlaylistForm
│       ├── LoadingState (conditional)
│       ├── ErrorMessage (conditional)
│       └── ResultsDisplay (conditional)
```

### State Management Strategy

**Local State (useState):**
- Component-specific UI state
- Form input values
- Temporary UI states (copied tooltip)

**Global State (Zustand):**
- Loading states (shared across components)
- Error messages
- Future: User preferences, theme

**Server State (Custom Hook):**
- `usePlaylist` hook encapsulates API calls
- Manages playlist data lifecycle
- Coordinates with global loading/error states

### Data Flow

```
User Input (PlaylistForm)
   ↓
usePlaylist.fetchPlaylist()
   ↓
lib/api.ts → Backend API
   ↓
useUIStore.setLoading(true)
   ↓
Success: setPlaylistData()
Error: useUIStore.setError()
   ↓
ResultsDisplay renders data
```

### Component Design Principles

**Single Responsibility:**
- `PlaylistForm`: Input and submission only
- `ResultsDisplay`: Data presentation only
- `LoadingState`: Loading UI only
- `ErrorMessage`: Error UI only

**Composition over Inheritance:**
- Small, reusable components
- Props for configuration
- No deep nesting

**Type Safety:**
```typescript
// Props interfaces for all components
interface PlaylistFormProps {
  onSubmit: (input: string) => void;
  onClear: () => void;
}
```

## 🔄 API Contract

### Endpoint: GET /api/playlist

**Request:**
```
Query Parameters:
- url: string (YouTube playlist URL) OR
- playlistId: string (Direct playlist ID)
```

**Response (Success):**
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
    "videos": [...]
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": {
    "message": "Playlist not found or is private",
    "code": "PLAYLIST_NOT_FOUND"
  }
}
```

## 🔐 Security Measures

### Backend

1. **Helmet.js** - HTTP security headers
2. **CORS** - Restricted origins
3. **Rate Limiting** - 100 requests per 15 minutes per IP
4. **Input Validation** - Zod schema validation
5. **Error Sanitization** - No stack traces in production

### Frontend

1. **Environment Variables** - API URL never hardcoded
2. **XSS Prevention** - React auto-escaping
3. **Type Safety** - TypeScript prevents runtime errors

## 🚀 Performance Optimizations

### Backend

1. **Minimal Dependencies** - Only essential packages
2. **Native Fetch** - No Axios overhead
3. **Efficient Algorithms** - Single-pass duration aggregation
4. **Future: Redis Caching** - Cache playlist data (Phase 2+)

### Frontend

1. **Next.js Optimizations:**
   - Automatic code splitting
   - Image optimization (when images added)
   - Font optimization (Inter font)

2. **Component Optimizations:**
   - Conditional rendering (only show what's needed)
   - Efficient state updates
   - Future: React.memo for expensive renders

3. **Bundle Size:**
   - Minimal dependencies
   - Lucide icons (tree-shakeable)
   - Tailwind purges unused CSS

## 📊 Scalability Considerations

### Current Capacity

- **Backend:** Can handle 1000+ requests/hour comfortably
- **Frontend:** Statically deployed, scales infinitely
- **YouTube API:** 10,000 units/day = ~1,000 playlists/day

### Future Scaling Paths

**Phase 2-3:**
- Add Redis for playlist caching
- Implement database for user data (Supabase)
- Increase YouTube API quota (paid tier)

**Phase 4:**
- Microservices for heavy features
- CDN for static assets
- Load balancer for backend instances

## 🧩 Why This Architecture?

### Why Monorepo?

✅ **Single source of truth**
✅ **Shared types between frontend/backend**
✅ **Coordinated versioning**
✅ **Easier development workflow**

❌ **Alternative (Separate Repos):**
- More complex CI/CD
- Type sync issues
- Harder to maintain consistency

### Why Separate Backend/Frontend?

✅ **Independent deployment**
✅ **Technology flexibility**
✅ **Clear responsibilities**
✅ **Multi-client support** (web, mobile, extension)

❌ **Alternative (Next.js API Routes):**
- Tight coupling
- Harder to add mobile clients later
- Less flexible deployment

### Why Express over Fastify/Hono?

✅ **Industry standard** - More resources/examples
✅ **Mature ecosystem** - Well-tested middleware
✅ **Team familiarity** - Lower learning curve

### Why Zustand over Redux?

✅ **Minimal boilerplate** - Less code, same functionality
✅ **Simple mental model** - Hooks-based API
✅ **Sufficient for Phase 1** - No complex state requirements

## 🔮 Future Architecture Evolution

### Phase 2: Persistence Layer

```
Backend → PostgreSQL (Supabase)
- Store playlist calculations
- User preferences (no auth yet)
```

### Phase 3: Authentication & Real-time

```
Frontend → NextAuth.js
Backend → Supabase Auth
Real-time → WebSockets for progress sync
```

### Phase 4: Ecosystem

```
Browser Extension → Shared API client
Mobile Apps → Same backend API
Premium Features → Stripe integration
```

## 📝 Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Monorepo Tool** | npm workspaces | Native, no external tools needed |
| **Backend Framework** | Express | Mature, well-documented, flexible |
| **Frontend Framework** | Next.js 14 | Best-in-class React framework, great DX |
| **Styling** | Tailwind CSS | Rapid development, consistent design |
| **State Management** | Zustand | Minimal, sufficient for Phase 1 |
| **Type System** | TypeScript | Catch errors early, better DX |
| **Validation** | Zod | Type-safe runtime validation |
| **Icons** | Lucide | Tree-shakeable, modern icons |

## 🎓 Learning Resources

- **Express Best Practices:** https://expressjs.com/en/advanced/best-practice-performance.html
- **Next.js Docs:** https://nextjs.org/docs
- **YouTube Data API:** https://developers.google.com/youtube/v3
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/

---

**This architecture is designed to grow with the product while maintaining simplicity in Phase 1.**
