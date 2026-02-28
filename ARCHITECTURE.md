# Architecture Documentation: Syllabus Slayer

> **Production-grade monorepo architecture — Phases 1 through 3D complete (with post-3D polish)**

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
┌──────────────────────────────────────────────────────────────────────┐
│                          User Browser                                 │
│                                                                        │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                   Frontend (Next.js 14)                      │    │
│  │                                                               │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐ │    │
│  │  │  Auth Layer  │  │  UI/Dashboard│  │  Analytics/Email  │ │    │
│  │  │  NextAuth.js │  │  Components  │  │  Onboarding       │ │    │
│  │  └──────┬───────┘  └──────┬───────┘  └────────┬──────────┘ │    │
│  │         │                 │                    │             │    │
│  │  ┌──────▼─────────────────▼────────────────────▼──────────┐ │    │
│  │  │         Zustand Store Layer (Planner, Playlists,        │ │    │
│  │  │          Saved, View, UI, Onboarding)                   │ │    │
│  │  └────────────────────────┬───────────────────────────────┘ │    │
│  │                           │                                   │    │
│  │  ┌────────────────────────▼───────────────────────────────┐ │    │
│  │  │              Repository / Data Access Layer             │ │    │
│  │  │  PlaylistRepository  UserRepository  AchievementRepo   │ │    │
│  │  └────────────────────────────────────────────────────────┘ │    │
│  └─────────────────────────────────┬───────────────────────────┘    │
└────────────────────────────────────┼────────────────────────────────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              │ HTTP/REST            │ Supabase SDK          │ Resend API
              ▼                      ▼                       ▼
┌─────────────────────┐  ┌────────────────────────┐  ┌────────────────┐
│  Backend            │  │  Supabase (PostgreSQL)  │  │  Resend Email  │
│  (Node + Express)   │  │  - user_profiles        │  │  - Achievement │
│  - YouTube API      │  │  - playlists            │  │    emails      │
│  - Duration calc    │  │  - achievements         │  │  - Weekly      │
│  - Playlist parse   │  │  - activity_log         │  │    summaries   │
└─────────────────────┘  │  - leaderboard view     │  └────────────────┘
         │               └────────────────────────┘
         ▼
┌─────────────────────┐
│  YouTube Data API   │
│  v3                  │
└─────────────────────┘
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
├── layout.tsx (Root Layout + Providers)
│   ├── page.tsx (Home — playlist analyser)
│   │   ├── PlaylistForm
│   │   ├── LoadingState (conditional)
│   │   ├── ErrorMessage (conditional)
│   │   └── ResultsDisplay (conditional)
│   │
│   ├── auth/signin/page.tsx
│   ├── auth/error/page.tsx
│   │
│   ├── dashboard/layout.tsx (Sidebar + Header + CommandMenu + OnboardingTour)
│   │   ├── dashboard/page.tsx (Stats + ActivePlaylists + ProgressOverview)
│   │   ├── dashboard/playlists/ (PlaylistsClient — filter, search, cards)
│   │   ├── dashboard/search/ (SearchClient — full-text search)
│   │   ├── dashboard/analytics/ (AnalyticsContent client wrapper)
│   │   ├── dashboard/achievements/
│   │   ├── dashboard/settings/
│   │   └── dashboard/help/
│   │
│   ├── planner/page.tsx (back-to-dashboard nav)
│   └── shared/[id]/page.tsx
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

## 🆕 Phase 3 Architecture Additions

### Phase 3A — Authentication & Database

```
NextAuth.js v5 (OAuth)
    ↓
Google / GitHub OAuth providers
    ↓
@auth/supabase-adapter
    ↓
Supabase PostgreSQL
  - user_profiles (RLS-protected)
  - playlists / videos / partitions / schedules
  - achievements / activity_log / templates
    ↓
Repository Layer (type-safe CRUD)
  PlaylistRepository | UserRepository | AchievementRepository
```

**Row-Level Security (RLS):** Every table enforces `user_id = auth.uid()` policies, ensuring strict data isolation.

**Automated Triggers:** Profile auto-creation on signup; stat counters (`total_playlists_created`, `total_hours_planned`) updated via DB triggers.

### Phase 3B — Premium UI & Dark Mode

```
next-themes ThemeProvider
    ↓
CSS custom properties (--background, --primary, etc.)
    ↓
Tailwind sidebar utilities (bg-sidebar, text-sidebar-foreground)
    ↓
Dark / Light / System toggle → persisted in user_profiles.theme_preference
```

Key additions:
- `cmdk` — Cmd+K command palette
- `framer-motion` — sidebar collapse, page transitions, counting numbers
- `sonner` — toast notifications
- `useViewStore` — persistent grid/list/compact view preferences

### Phase 3C — Gamification & Progress

```
AchievementChecker (lib/achievements/checker.ts)
    ↓
Checks 12 achievement definitions against user stats
    ↓
pendingAchievements[] pushed into useSavedPlaylistStore
    ↓
GlobalAchievementNotifier polls store → triggers confetti modal
```

Leaderboard architecture:
```
Supabase materialized view (leaderboard_mv)
    ↓
LeaderboardRepository (opt-in, refresh)
    ↓
LeaderboardTable (tabbed: hours / streak / completion)
```

Progress components read directly from `user_profiles` via `UserRepository`.

### Phase 3D — Analytics, Onboarding & Email

```
AnalyticsService (lib/analytics/service.ts)
    ↓  queries: user_profiles + playlists + activity_log
    ↓  computes: daily avg, productive day, speed distribution,
    ↓            completion rate, streak history, monthly progress
    ↓
AnalyticsPage (server component)
    ↓  fetches data, serialises to plain objects
    ↓
AnalyticsContent (client wrapper)
    ↓  renders lucide icons + InsightCard + MonthlyProgressChart
```

> **Note:** The server → client split was required because lucide icon components
> (functions) cannot be passed from Server Components to Client Components.
> `AnalyticsContent.tsx` is a `'use client'` wrapper that owns the icons.

Onboarding flow:
```
useOnboardingStore (zustand + persist)
    ↓
shepherd.js Tour (direct — replaces react-shepherd)
    ↓
5-step guided tour (auto-starts 1.5s after first login)
    ↓
completeOnboarding() → persisted to localStorage
```

Email system:
```
Resend SDK (lib/email/client.ts)
    ↓
@react-email templates (AchievementUnlocked, WeeklySummary)
    ↓
EmailService.sendAchievementUnlocked() | sendWeeklySummary() | sendStreakReminder()
```

## 🔮 Future Architecture Evolution

### Phase 4: Ecosystem Expansion

```
Browser Extension → Shared API client
Mobile Apps → Same backend API + Supabase Realtime
Premium Features → Stripe integration
AI Insights → OpenAI API for smart playlist categorisation
```

## 📝 Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Monorepo Tool** | npm workspaces | Native, no external tools needed |
| **Backend Framework** | Express | Mature, well-documented, flexible |
| **Frontend Framework** | Next.js 14 | Best-in-class React framework, great DX |
| **Styling** | Tailwind CSS | Rapid development, consistent design |
| **State Management** | Zustand | Minimal boilerplate, hooks-based |
| **Type System** | TypeScript | Catch errors early, better DX |
| **Validation** | Zod | Type-safe runtime validation |
| **Icons** | Lucide | Tree-shakeable, modern icons |
| **Auth** | NextAuth.js v5 | Flexible OAuth, Supabase adapter |
| **Database** | Supabase (PostgreSQL) | RLS, realtime, hosted |
| **Email** | Resend + @react-email | Developer-friendly, React templates |
| **Charts** | Recharts | Composable, SSR-safe |
| **Onboarding** | shepherd.js (direct) | Avoids react-shepherd's bundled React conflicts with Next.js 14 |

## 🎓 Learning Resources

- **Express Best Practices:** https://expressjs.com/en/advanced/best-practice-performance.html
- **Next.js Docs:** https://nextjs.org/docs
- **YouTube Data API:** https://developers.google.com/youtube/v3
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/
- **Supabase Docs:** https://supabase.com/docs
- **NextAuth.js Docs:** https://authjs.dev
- **Resend Docs:** https://resend.com/docs

---

**This architecture is designed to grow with the product — Phases 1–3D (+ post-3D polish) complete, Phase 4 ready.**
