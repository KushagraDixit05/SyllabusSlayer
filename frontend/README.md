# Syllabus Slayer Frontend

Modern Next.js 14 application for YouTube playlist time architecture.

**Current Version:** 3.0.0 (Phase 3D+ Complete)

## Tech Stack

- **Framework**: Next.js 14.1+ (App Router)
- **Language**: TypeScript 5.3+ (Strict Mode)
- **Styling**: Tailwind CSS 3.4+
- **UI Components**: Shadcn/UI + Radix UI (22 components)
- **State Management**: Zustand 4.5+ (5 stores with persistence)
- **Animations**: Framer Motion 12.34+
- **Icons**: Lucide React 0.314+
- **Date Handling**: date-fns 2.30+
- **PDF Export**: jsPDF 4.1+ with autotable
- **Notifications**: Sonner 1.3+
- **Auth**: NextAuth.js v5 (Google & GitHub OAuth)
- **Database**: Supabase (PostgreSQL) with @supabase/supabase-js
- **Charts**: Recharts
- **Onboarding**: shepherd.js (direct integration)
- **Command Palette**: cmdk
- **Theme**: next-themes (dark/light/system)
- **Email**: @react-email + Resend SDK

## Features

### Phase 1 (MVP) ✅
- ✅ YouTube playlist URL and ID support
- ✅ Real-time duration calculations
- ✅ Multiple playback speed options (1.0x - 2.0x)
- ✅ Clean, modern UI with responsive design
- ✅ Copy-to-clipboard functionality
- ✅ Loading and error states

### Phase 2 (Architect Engine) ✅
- ✅ Intelligent session partitioning (15-300 min sessions)
- ✅ Break duration configuration
- ✅ Time-to-finish calculator with daily hours
- ✅ Schedule breakdown (weekday/weekend hours, rest days)
- ✅ Speed comparison table with time saved metrics
- ✅ Manual video entry (single + bulk)
- ✅ Flexible time format parsing (8+ formats)
- ✅ PDF export for study plans
- ✅ CSV export for partitions
- ✅ Shareable links with base64 encoding
- ✅ Smooth animations and micro-interactions

### Phase 3A (Auth & Database) ✅
- ✅ NextAuth.js v5 with Google & GitHub OAuth
- ✅ Supabase PostgreSQL with Row-Level Security
- ✅ Repository layer (Playlist, User, Achievement, Leaderboard)
- ✅ Protected dashboard with sidebar navigation
- ✅ Middleware-based route protection

### Phase 3B (Premium UI) ✅
- ✅ Dark mode with next-themes (system/light/dark)
- ✅ Command palette (Cmd+K) via cmdk
- ✅ Framer Motion page & sidebar transitions
- ✅ Grid / list / compact view controls
- ✅ Toast notifications (sonner)

### Phase 3C (Gamification) ✅
- ✅ 12 achievements with automated unlock detection
- ✅ Leaderboard (materialized view, opt-in, tabbed)
- ✅ Progress tracking (streaks, heatmap, circular progress)
- ✅ Milestone celebrations with confetti

### Phase 3D (Analytics, Onboarding & Email) ✅
- ✅ Analytics dashboard (InsightCards + MonthlyProgressChart)
- ✅ Guided onboarding tour (shepherd.js, 5 steps)
- ✅ Email templates (@react-email/components + Resend)
- ✅ Error boundary, settings, help pages

### Post-3D Polish ✅
- ✅ Playlist library page with filter tabs & search
- ✅ Dashboard search page with full-text filtering
- ✅ 8-item sidebar navigation
- ✅ Analytics server→client split (AnalyticsContent wrapper)
- ✅ Planner ↔ Dashboard navigation

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx                 # Root layout (Providers)
│   ├── page.tsx                   # Home page (playlist analysis)
│   ├── providers.tsx              # SessionProvider + ThemeProvider + Toaster
│   ├── globals.css
│   ├── api/auth/[...nextauth]/    # NextAuth API route
│   ├── auth/
│   │   ├── signin/page.tsx
│   │   └── error/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx             # Sidebar + Header + CommandMenu + OnboardingTour
│   │   ├── page.tsx               # Stats + ActivePlaylists + ProgressOverview
│   │   ├── playlists/
│   │   │   ├── page.tsx           # Server component
│   │   │   └── PlaylistsClient.tsx # Filter tabs, search, playlist cards
│   │   ├── search/
│   │   │   ├── page.tsx           # Server component
│   │   │   └── SearchClient.tsx   # Full-text search UI
│   │   ├── analytics/page.tsx     # → AnalyticsContent client wrapper
│   │   ├── achievements/page.tsx
│   │   ├── settings/page.tsx
│   │   └── help/page.tsx
│   ├── planner/page.tsx           # Planner + back-to-dashboard nav
│   └── shared/[id]/page.tsx       # Shared plan viewer
│
├── components/
│   ├── ui/                        # Shadcn/UI components (22)
│   │   ├── accordion.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── interactive-card.tsx
│   │   ├── label.tsx
│   │   ├── progress.tsx
│   │   ├── scroll-area.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── skeleton-variants.tsx
│   │   ├── slider.tsx
│   │   ├── switch.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   └── tooltip.tsx
│   │
│   ├── achievements/              # Phase 3C
│   │   ├── AchievementCard.tsx
│   │   ├── AchievementUnlockedModal.tsx
│   │   ├── AchievementsClientSection.tsx
│   │   └── GlobalAchievementNotifier.tsx
│   │
│   ├── analytics/                 # Phase 3D
│   │   ├── AnalyticsContent.tsx   # Client wrapper (owns icon refs)
│   │   ├── InsightCard.tsx
│   │   └── MonthlyProgressChart.tsx
│   │
│   ├── animations/
│   │   ├── CountingNumber.tsx
│   │   ├── PageTransition.tsx
│   │   └── ProgressRing.tsx
│   │
│   ├── auth/
│   │   ├── ProtectedRoute.tsx
│   │   ├── SignInForm.tsx
│   │   └── UserMenu.tsx
│   │
│   ├── celebrations/              # Phase 3C
│   │   └── MilestoneCelebration.tsx
│   │
│   ├── dashboard/
│   │   ├── ActivePlaylists.tsx
│   │   ├── CommandMenu.tsx
│   │   ├── DashboardHeader.tsx
│   │   ├── DashboardSidebar.tsx   # 8 nav items
│   │   ├── DashboardStats.tsx
│   │   ├── ProgressOverview.tsx
│   │   ├── QuickActions.tsx
│   │   ├── RecentActivity.tsx
│   │   ├── StatsCard.tsx
│   │   └── ViewControls.tsx
│   │
│   ├── export/
│   │   └── ExportMenu.tsx
│   │
│   ├── landing/
│   │   ├── FeaturesSection.tsx
│   │   ├── HeroSection.tsx
│   │   ├── HowItWorks.tsx
│   │   └── LandingFooter.tsx
│   │
│   ├── leaderboard/               # Phase 3C
│   │   ├── LeaderboardTable.tsx
│   │   └── OptInDialog.tsx
│   │
│   ├── manual/
│   │   └── ManualEntrySection.tsx
│   │
│   ├── onboarding/                # Phase 3D
│   │   ├── OnboardingTour.tsx     # shepherd.js guided tour (direct)
│   │   └── FeatureTooltip.tsx
│   │
│   ├── partition/
│   │   ├── PartitionControls.tsx
│   │   └── PartitionList.tsx
│   │
│   ├── progress/                  # Phase 3C
│   │   ├── ActivityHeatmap.tsx
│   │   ├── CircularProgress.tsx
│   │   ├── SessionCheckIn.tsx
│   │   └── StreakDisplay.tsx
│   │
│   ├── providers/
│   │   ├── ThemeProvider.tsx
│   │   └── ToastProvider.tsx
│   │
│   ├── schedule/
│   │   └── ScheduleCalculator.tsx
│   │
│   ├── speed/
│   │   ├── SpeedSelector.tsx
│   │   └── SpeedComparisonTable.tsx
│   │
│   ├── theme/
│   │   └── ThemeToggle.tsx
│   │
│   ├── ErrorBoundary.tsx
│   ├── ErrorMessage.tsx
│   ├── LoadingState.tsx
│   ├── PlaylistForm.tsx
│   └── ResultsDisplay.tsx
│
├── emails/                        # @react-email templates
│   ├── AchievementUnlocked.tsx
│   └── WeeklySummary.tsx
│
├── hooks/
│   ├── usePlaylist.ts
│   ├── useUserTheme.ts
│   └── useWindowSize.ts
│
├── lib/
│   ├── api.ts                     # Backend API integration
│   ├── auth.ts                    # NextAuth config
│   ├── auth-helpers.ts
│   ├── utils.ts
│   ├── helpers.ts
│   ├── partitioning.ts
│   ├── timeParser.ts
│   ├── speed.ts
│   ├── scheduling.ts
│   ├── pdfExport.ts
│   ├── csvExport.ts
│   ├── shareableLink.ts
│   ├── achievements/
│   │   ├── checker.ts
│   │   └── definitions.ts
│   ├── analytics/
│   │   └── service.ts
│   ├── email/
│   │   ├── client.ts
│   │   └── service.ts
│   ├── milestones/
│   │   └── checker.ts
│   ├── onboarding/
│   │   └── samplePlaylists.ts
│   ├── repositories/
│   │   ├── index.ts
│   │   ├── playlistRepository.ts
│   │   ├── userRepository.ts
│   │   ├── achievementRepository.ts
│   │   └── leaderboardRepository.ts
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   └── utils/
│       └── performance.ts
│
├── store/
│   ├── usePlannerStore.ts         # Main planner state
│   ├── useSavedPlaylistStore.ts   # DB-synced playlists + achievements
│   ├── useUIStore.ts              # Global UI state
│   ├── useViewStore.ts            # View preferences (grid/list/compact)
│   └── useOnboardingStore.ts      # Onboarding state
│
├── types/
│   ├── index.ts
│   ├── database.ts
│   ├── partition.ts
│   ├── schedule.ts
│   ├── manual.ts
│   ├── export.ts
│   ├── speed.ts
│   └── next-auth.d.ts
│
├── middleware.ts                   # NextAuth route protection
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
└── next.config.js
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update the backend API URL if needed:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Development

```bash
# Start development server
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

The app will be available at `http://localhost:3000`.

## Component Architecture

### Phase 1 Components

#### PlaylistForm
- Handles user input (URL or playlist ID)
- Form validation and submission
- Clear/reset functionality

#### ResultsDisplay
- Displays playlist metadata (title, video count, avg length)
- Shows duration at all playback speeds
- Copy-to-clipboard for each speed option
- Navigation to planner

#### LoadingState
- Loading spinner during API calls
- User feedback during data fetching

#### ErrorMessage
- User-friendly error display
- Consistent error UI

### Phase 2 Components

#### Partition System
- **PartitionControls**: Session length configuration with presets and custom slider
- **PartitionList**: Accordion view of study sessions with video breakdowns

#### Schedule System
- **ScheduleCalculator**: Daily hours input, rest days, completion date display

#### Speed System
- **SpeedSelector**: Preset speed buttons + custom slider (0.25x - 3.0x)
- **SpeedComparisonTable**: Visual comparison with time savings

#### Manual Entry
- **ManualEntrySection**: Single + bulk video entry with flexible time parsing

#### Export
- **ExportMenu**: PDF/CSV export + shareable link generation
- **ToastProvider**: Toast notifications for feedback

## State Management

### Zustand Stores (5 total)

#### usePlannerStore
Comprehensive state management for the planner:
- **Videos**: YouTube playlist + manual entries
- **Partitions**: Session configuration and generated partitions
- **Schedule**: Daily hours, rest days, completion dates
- **Speed**: Current playback speed selection
- **Templates**: Saved video entry templates
- **Persistence**: LocalStorage sync for user preferences

#### useSavedPlaylistStore
DB-synced state for authenticated users:
- Saved playlists from Supabase
- Achievement detection on playlist save
- Pending achievement queue for notification

#### useUIStore
Global UI state:
- Loading states
- Error messages
- UI preferences

#### useViewStore
View preferences (persisted):
- Grid / list / compact modes

#### useOnboardingStore
Onboarding tour state (persisted):
- `hasCompletedOnboarding` flag
- `completeOnboarding()` action

## Dashboard Navigation

The sidebar provides 8 navigation entries:

| Route | Label | Description |
|-------|-------|-------------|
| `/dashboard` | Dashboard | Stats, active playlists, progress overview |
| `/dashboard/playlists` | Playlists | Saved playlist library with filter tabs & search |
| `/planner` | Planner | Main planner interface |
| `/dashboard/search` | Search | Full-text search across playlists |
| `/dashboard/achievements` | Achievements | 12 achievements grid |
| `/dashboard/analytics` | Analytics | Insight cards + monthly chart |
| `/dashboard/settings` | Settings | User preferences |
| `/dashboard/help` | Help | Help center |

## Styling Approach

### Tailwind CSS
- Utility-first approach for rapid development
- Custom design tokens via `tailwind.config.ts`
- Consistent spacing, colors, and typography

### Design System
```css
:root {
  --primary: Blue 600
  --secondary: Purple 600
  --background: White with gradient
  --foreground: Gray 900
}
```

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Grid layouts adapt to screen size

## User Experience Features

### Animations
- Fade-in for results
- Smooth transitions on hover
- Loading spinner animation

### Accessibility
- Semantic HTML
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus states for all interactive elements

### Error Handling
- Clear, actionable error messages
- Graceful degradation
- Network error recovery

## Performance Optimizations

### Next.js Features
- Automatic code splitting
- Image optimization (future)
- Font optimization (Inter font)
- Edge runtime ready

### React Best Practices
- Minimal re-renders
- Efficient state updates
- Memoization where needed (future)

## Key Architectural Notes

### Server → Client Component Boundary
The analytics page uses a **server → client split pattern**:
- `analytics/page.tsx` (server) fetches data and serialises it
- `AnalyticsContent.tsx` (client) renders with lucide icons

This is required because lucide icon components are functions and cannot be passed from Server Components to Client Components in Next.js 14.

### Onboarding Tour
Uses **shepherd.js directly** (not react-shepherd) due to react-shepherd v7 bundling its own React copy, which conflicts with Next.js 14's React instance. The `OnboardingTour.tsx` component creates a `new Shepherd.Tour()` inside a `useEffect`.

### Authentication Flow
- `middleware.ts` protects `/dashboard/*` routes
- NextAuth.js v5 with `@auth/supabase-adapter`
- Google & GitHub OAuth providers
- Session available via `auth()` (server) or `useSession()` (client)

## API Integration

The frontend communicates with the backend via:

```typescript
// Fetch playlist data
GET /api/playlist?url=https://youtube.com/playlist?list=PLxxx

// Response
{
  "success": true,
  "data": {
    "title": "...",
    "videoCount": 42,
    "totalDurationFormatted": "4h 17m",
    "speeds": { ... }
  }
}
```

## License

MIT
