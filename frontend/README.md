# Syllabus Slayer Frontend

Modern Next.js 14 application for YouTube playlist time architecture.

**Current Version:** 2.0.0 (Phase 2 Complete)

## Tech Stack

- **Framework**: Next.js 14.1+ (App Router)
- **Language**: TypeScript 5.3+ (Strict Mode)
- **Styling**: Tailwind CSS 3.4+
- **UI Components**: Shadcn/UI + Radix UI
- **State Management**: Zustand 4.5+ with persistence
- **Animations**: Framer Motion 12.34+
- **Icons**: Lucide React 0.314+
- **Date Handling**: date-fns 2.30+
- **PDF Export**: jsPDF 4.1+ with autotable
- **Notifications**: Sonner 1.3+

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
- ✅ 11 Shadcn/UI components integrated
- ✅ Smooth animations and micro-interactions

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Home page (playlist analysis)
│   ├── planner/
│   │   └── page.tsx            # Main planner interface
│   ├── shared/
│   │   └── [id]/page.tsx       # Shared plan viewer
│   └── globals.css             # Global styles
├── components/
│   ├── ui/                     # Shadcn/UI components (11 components)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── checkbox.tsx
│   │   ├── dialog.tsx
│   │   ├── textarea.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── accordion.tsx
│   │   └── slider.tsx
│   ├── partition/              # Partitioning components
│   │   ├── PartitionControls.tsx
│   │   └── PartitionList.tsx
│   ├── schedule/               # Scheduling components
│   │   └── ScheduleCalculator.tsx
│   ├── speed/                  # Speed optimization components
│   │   ├── SpeedSelector.tsx
│   │   └── SpeedComparisonTable.tsx
│   ├── manual/                 # Manual entry components
│   │   └── ManualEntrySection.tsx
│   ├── export/                 # Export components
│   │   └── ExportMenu.tsx
│   ├── PlaylistForm.tsx        # Phase 1 playlist input
│   ├── ResultsDisplay.tsx      # Phase 1 results display
│   ├── LoadingState.tsx
│   ├── ErrorMessage.tsx
│   └── ToastProvider.tsx       # Toast notifications
├── lib/
│   ├── api.ts                  # Backend API integration
│   ├── utils.ts                # Utility functions
│   ├── helpers.ts              # Helper utilities
│   ├── partitioning.ts         # Partitioning algorithm
│   ├── timeParser.ts           # Time format parsing
│   ├── speed.ts                # Speed calculations
│   ├── scheduling.ts           # Schedule calculator
│   ├── pdfExport.ts            # PDF generation
│   ├── csvExport.ts            # CSV export
│   └── shareableLink.ts        # Link encoding/decoding
├── store/
│   ├── useUIStore.ts           # UI state
│   └── usePlannerStore.ts      # Main planner state (Zustand)
├── types/
│   ├── index.ts                # General types
│   ├── partition.ts            # Partition types
│   ├── schedule.ts             # Schedule types
│   ├── manual.ts               # Manual entry types
│   ├── export.ts               # Export types
│   └── speed.ts                # Speed types
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── components.json             # Shadcn/UI config
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

### Zustand Store (usePlannerStore)
Comprehensive state management for:
- **Videos**: YouTube playlist + manual entries
- **Partitions**: Session configuration and generated partitions
- **Schedule**: Daily hours, rest days, completion dates
- **Speed**: Current playback speed selection
- **Templates**: Saved video entry templates
- **Persistence**: LocalStorage sync for user preferences

**Key Methods:**
```typescript
// Video management
setPlaylistData(title, videos)
addManualVideo(title, duration)
removeVideo(id)

// Partitioning
updatePartitionConfig(config)
createPartitionsFromConfig(config)

// Scheduling
calculateSchedule(config?)

// Speed
setPlaybackSpeed(speed)
```

### UI Store (useUIStore)
Global UI state for:
- Loading states
- Error messages
- UI preferences (theme, settings)

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

## Future Enhancements (Post-MVP)

Phase 2 and beyond will add:
- Partitioning system
- Time-to-finish calculator
- Export functionality
- Manual entry mode

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
