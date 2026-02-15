# Syllabus Slayer Frontend

Modern Next.js 14 application for YouTube playlist time architecture.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React

## Features

- ✅ Clean, modern UI with responsive design
- ✅ YouTube playlist URL and ID support
- ✅ Real-time duration calculations
- ✅ Multiple playback speed options
- ✅ Copy-to-clipboard functionality
- ✅ Loading and error states
- ✅ Smooth animations and transitions

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx       # Root layout with metadata
│   ├── page.tsx         # Main page
│   └── globals.css      # Global styles
├── components/
│   ├── PlaylistForm.tsx
│   ├── ResultsDisplay.tsx
│   ├── LoadingState.tsx
│   └── ErrorMessage.tsx
├── hooks/
│   └── usePlaylist.ts   # Playlist data fetching hook
├── lib/
│   ├── api.ts           # Backend API integration
│   └── utils.ts         # Utility functions
├── store/
│   └── useUIStore.ts    # Global UI state
├── types/
│   └── index.ts         # TypeScript definitions
├── package.json
├── tsconfig.json
├── tailwind.config.ts
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

### PlaylistForm
- Handles user input (URL or playlist ID)
- Form validation and submission
- Clear/reset functionality

### ResultsDisplay
- Displays playlist metadata (title, video count, avg length)
- Shows duration at all playback speeds
- Copy-to-clipboard for each speed option

### LoadingState
- Loading spinner during API calls
- User feedback during data fetching

### ErrorMessage
- User-friendly error display
- Consistent error UI

## State Management

### Zustand Store (useUIStore)
Global UI state for:
- Loading states
- Error messages
- UI preferences (future: theme, settings)

### Custom Hooks (usePlaylist)
Encapsulates:
- Playlist data fetching logic
- Error handling
- Loading state management

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
