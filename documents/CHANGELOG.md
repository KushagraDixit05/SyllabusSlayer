# Changelog

All notable changes to Syllabus Slayer will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned for Phase 4
- Browser extension (Chrome/Firefox/Edge)
- Mobile applications (iOS/Android)
- Premium tier with Stripe integration
- AI-powered insights and recommendations
- Calendar integration (.ics export)
- Collaboration / study group features

## [3.0.0] - 2026-02-28

### Phase 3: Auth, Dashboard, Gamification, Analytics & Polish - COMPLETE ✅

#### Phase 3A — Authentication & Database
- **NextAuth.js v5** with Google & GitHub OAuth providers
- **Supabase (PostgreSQL)** database with Row-Level Security (RLS)
- **Repository layer:** PlaylistRepository, UserRepository, AchievementRepository, LeaderboardRepository
- Database schema with 9 tables (`user_profiles`, `playlists`, `videos`, `partitions`, `schedules`, `achievements`, `activity_log`, `templates`, leaderboard materialized view)
- Automated triggers for profile creation and stat counters
- Protected dashboard with sidebar navigation
- Auth middleware for route protection (`middleware.ts`)

#### Phase 3B — Premium UI & Dark Mode
- **Dark mode** via `next-themes` (system/light/dark toggle, persisted to `user_profiles.theme_preference`)
- **Command palette** (`Cmd+K`) via `cmdk`
- **Framer Motion** page transitions, sidebar collapse animations, counting numbers
- **Toast notifications** via `sonner`
- Grid/list/compact view controls (`useViewStore`)
- Dashboard sidebar with 8 navigation items
- Landing page components (HeroSection, FeaturesSection, HowItWorks, LandingFooter)

#### Phase 3C — Gamification & Progress Tracking
- **12 achievement definitions** with unlock detection engine (`lib/achievements/checker.ts`)
- **Leaderboard** with materialized view, opt-in dialog, tabbed display (hours / streak / completion)
- **Progress tracking:** streaks, activity heatmap, circular progress rings
- **Milestone celebrations** with confetti (`react-confetti`)
- `GlobalAchievementNotifier` component polls store and triggers unlock modals
- Database migration: `supabase/migrations/phase3c-gamification.sql`

#### Phase 3D — Analytics, Onboarding & Email
- **Analytics dashboard:** InsightCards + MonthlyProgressChart (Recharts)
- **Guided onboarding tour** via `shepherd.js` (5-step tour, auto-starts for new users)
- **Email templates** with `@react-email/components` + Resend SDK
  - `AchievementUnlocked.tsx`, `WeeklySummary.tsx`
  - `EmailService` with `sendAchievementUnlocked()`, `sendWeeklySummary()`, `sendStreakReminder()`
- **Error boundary** component for graceful error handling
- **Performance utilities** (`lib/utils/performance.ts`)
- Settings & Help pages

#### Post-3D Polish
- **Playlist library page** (`/dashboard/playlists`) with filter tabs & search
- **Dashboard search page** (`/dashboard/search`) with full-text filtering
- Analytics server→client split (`AnalyticsContent` wrapper — required because lucide icons can't be passed from Server to Client Components)
- Planner ↔ Dashboard navigation link
- `shepherd.js` direct integration (replaced `react-shepherd` bundled React conflicts)

#### New UI Components (27 total, up from 11)
- `avatar.tsx`, `scroll-area.tsx`, `select.tsx`, `separator.tsx`, `switch.tsx`
- `table.tsx`, `tabs.tsx`, `tooltip.tsx`, `progress.tsx`
- `interactive-card.tsx`, `skeleton-variants.tsx`, `skeleton.tsx`
- `sidebar.tsx`, `background-beams.tsx`, `glowing-effect.tsx`, `wavy-background.tsx`

#### New Zustand Stores (5 total)
- `usePlannerStore.ts` — playlist & partition state
- `useSavedPlaylistStore.ts` — DB-synced playlists + achievements
- `useUIStore.ts` — loading/error global state
- `useViewStore.ts` — grid/list/compact view preferences
- `useOnboardingStore.ts` — onboarding tour state (Phase 3D)

#### Dependencies Added
```json
{
  "@auth/supabase-adapter": "latest",
  "@supabase/ssr": "latest",
  "@supabase/supabase-js": "latest",
  "next-auth": "latest",
  "next-themes": "latest",
  "cmdk": "latest",
  "react-confetti": "latest",
  "react-shepherd": "latest",
  "recharts": "latest",
  "resend": "latest",
  "@react-email/components": "latest",
  "@dnd-kit/core": "^6.3.1",
  "@dnd-kit/sortable": "^10.0.0",
  "@tabler/icons-react": "latest",
  "react-icons": "latest",
  "motion": "latest",
  "simplex-noise": "latest"
}
```

## [2.0.0] - 2026-02-15

### Phase 2: The Architect Engine - COMPLETE ✅

#### Added
- **Intelligent Partitioning System**
  - Custom session length configuration (15-300 minutes)
  - Preset session lengths: 60, 90, 120, 180, 240 minutes
  - Break duration configuration (0-60 minutes)
  - Smart video boundary detection for natural breaks
  - Accordion-based session breakdown with video lists
  - Real-time partition generation based on configuration

- **Time-to-Finish Calculator**
  - Daily hours input for weekdays and weekends
  - Rest days configuration with visual day selector
  - Automatic completion date calculation
  - Daily study schedule breakdown
  - Motivational messages based on timeline

- **Advanced Speed Features**
  - Speed comparison table showing all preset speeds (1.0x - 2.0x)
  - Time saved metrics with percentage calculations
  - Custom speed slider (0.25x - 3.0x with 0.05x precision)
  - Visual speed selector with active state highlighting
  - Real-time duration updates based on selected speed

- **Manual Entry Enhancements**
  - Single video entry with flexible time input
  - Bulk entry mode with pipe delimiter support
  - Support for 8+ time formats (HH:MM:SS, "1h 30m", raw seconds, etc.)
  - Video removal functionality
  - Manual video editing

- **Export & Share Capabilities**
  - PDF export with professional formatting (jsPDF)
  - CSV export for partitions and schedules
  - Shareable link generation with base64 URL encoding
  - Read-only shared plan viewer at `/shared/[id]`
  - Toast notifications for export actions

- **UI Components (11 Shadcn/UI Components)**
  - `button.tsx` - Button component with variants
  - `input.tsx` - Text input with focus states
  - `label.tsx` - Accessible form labels
  - `card.tsx` - Card container with header/content/footer
  - `badge.tsx` - Badge component for tags
  - `checkbox.tsx` - Checkbox with Radix UI integration
  - `dialog.tsx` - Modal dialog component
  - `textarea.tsx` - Multi-line text input
  - `dropdown-menu.tsx` - Dropdown menu with submenus
  - `accordion.tsx` - Expandable accordion panels
  - `slider.tsx` - Range slider component

- **State Management**
  - Comprehensive Zustand store (`usePlannerStore.ts`)
  - LocalStorage persistence for user preferences
  - Video management (YouTube + manual entries)
  - Partition configuration and generation
  - Schedule calculation and caching
  - Template management for bulk entry
  - Playback speed tracking

- **Type System (5 Modules)**
  - `partition.ts` - Partition data models and presets
  - `schedule.ts` - Schedule structures and day handling
  - `manual.ts` - Manual entry types and patterns
  - `export.ts` - Export data structures
  - `speed.ts` - Speed comparison types

- **Algorithm Libraries (7 Files)**
  - `partitioning.ts` - Session partitioning algorithm
  - `timeParser.ts` - Flexible time format parsing
  - `speed.ts` - Speed calculations and comparisons
  - `scheduling.ts` - Completion date calculator
  - `pdfExport.ts` - PDF generation logic
  - `csvExport.ts` - CSV export formatting
  - `shareableLink.ts` - URL encoding/decoding

#### Fixed
- **Critical Time Unit Bug**: Fixed session count calculations (seconds vs minutes conversion)
  - Changed formula to properly convert: `totalDuration (seconds) / (sessionLength (minutes) * 60)`
  - Session estimates now accurate
  
- **Property Name Mismatches**: Updated type definitions to match implementation
  - Changed `targetSessionLength` → `sessionLength`
  - Changed `allowVideoBreaks` → `respectVideoBreaks`
  
- **Type Import Errors**: Separated type imports from value imports
  - Fixed `DEFAULT_PARTITION_CONFIG` import in store
  - Fixed `DEFAULT_SCHEDULE_CONFIG` import
  
- **Schedule Calculator Issues**
  - Fixed useEffect dependencies (changed from `partitions` to `totalDuration`)
  - Fixed config property names (`hoursPerWeekday`, `hoursPerWeekend`, `restDaysPerWeek`)
  - Fixed display properties (`schedule.endDate`, `schedule.totalDays`)
  
- **Speed Comparison Tab Crash**: Fixed property name mismatches
  - Changed `percentageSaved` → `timeSavedPercentage`
  - Changed `adjustedDuration` → `totalDuration`
  - Removed non-existent `funComparison` property
  
- **Partition Session Count**: Changed from calculation to actual count
  - Now uses `partitions.length` instead of estimation formula
  - Displays exact number of sessions generated
  
- **Navigation Flow**: Implemented seamless page transitions
  - Added auto-redirect from home to `/planner` after playlist analysis
  - Fixed "Add Manually" button to properly switch tabs
  - Added `setPlaylistData()` method for data transfer

#### Changed
- Enhanced store with new methods:
  - `setPlaylistData(title, videos)` - Bulk video addition with auto-calculation
  - `addManualVideo(title, durationInput)` - Now accepts strings
  - `removeVideo(id)` - Alias for removeManualVideo
  - `updatePartitionConfig(config)` - Update partition settings
  - `createPartitionsFromConfig(config)` - Generate partitions
  - `setPlaybackSpeed(speed)` - Update current speed
  - `calculateSchedule(config?)` - Optional config parameter

#### Dependencies Added
```json
{
  "@radix-ui/react-accordion": "^1.1.2",
  "@radix-ui/react-checkbox": "^1.0.4",
  "@radix-ui/react-dialog": "^1.0.5",
  "@radix-ui/react-dropdown-menu": "^2.0.6",
  "@radix-ui/react-label": "^2.1.8",
  "@radix-ui/react-slider": "^1.1.2",
  "@radix-ui/react-slot": "^1.2.3",
  "class-variance-authority": "^0.7.0",
  "sonner": "^1.3.1",
  "jspdf": "^4.1.0",
  "jspdf-autotable": "^5.0.7"
}
```

#### Technical Improvements
- Implemented TypeScript strict mode throughout
- Added comprehensive JSDoc comments
- Improved error handling and edge cases
- Better state management with proper method signatures
- Consistent property naming across codebase
- Proper time unit handling (seconds ↔ minutes)

#### Documentation
- Updated [ROADMAP.md](./ROADMAP.md) to mark Phase 2 complete
- Enhanced [PHASE_2_IMPLEMENTATION.md](./PHASE_2_IMPLEMENTATION.md) with bug fixes
- Updated [TECH_STACK.md](./TECH_STACK.md) with actual versions
- Created comprehensive [CHANGELOG.md](./CHANGELOG.md)
- Updated [README.md](./README.md) with current status

---

## [1.0.0] - 2026-01

### Phase 1: MVP - Initial Release

#### Added
- YouTube Data API v3 integration
- Playlist URL parsing and validation
- Duration calculation engine
- Speed multiplier logic (1.25x, 1.5x, 1.75x, 2.0x)
- Basic responsive UI
- Copy to clipboard functionality
- Error handling and loading states

#### Technical Stack
- Next.js 14.1+ with App Router
- TypeScript with strict mode
- Tailwind CSS for styling
- React 18.2+

---

## Legend

- **Added** - New features
- **Changed** - Changes to existing functionality
- **Deprecated** - Soon-to-be removed features
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Security fixes

---

**For more details, see:**
- [ROADMAP.md](./ROADMAP.md) - Future development plans
- [PHASE_2_IMPLEMENTATION.md](./PHASE_2_IMPLEMENTATION.md) - Phase 2 details
- [PHASE_3.md](./PHASE_3.md) - Phase 3 details
- [TECH_STACK.md](./TECH_STACK.md) - Technology choices and rationale
