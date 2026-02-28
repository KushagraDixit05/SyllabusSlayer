# Quick Start Guide

## Running the Application

```bash
# From project root — starts both backend (port 5000) and frontend (port 3000)
npm run dev
```

Then visit:
- **Home page**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard (requires sign-in)
- **Planner**: http://localhost:3000/planner

### Dashboard Routes (authenticated)

| Route | Description |
|-------|-------------|
| `/dashboard` | Stats, active playlists, progress overview |
| `/dashboard/playlists` | Saved playlist library (filter + search) |
| `/dashboard/search` | Full-text search across your playlists |
| `/dashboard/analytics` | Insight cards + monthly progress chart |
| `/dashboard/achievements` | 12 achievement badges |
| `/dashboard/settings` | User preferences |
| `/dashboard/help` | Help center |

## Using the Planner

### Option 1: Start from Home Page
1. Enter a YouTube playlist URL on the home page
2. Click "Analyze Playlist"
3. Navigate to the planner (button will appear)

### Option 2: Manual Entry
1. Go directly to `/planner`
2. Click "Add Manually" button (or use Manual Entry tab)
3. Add videos using either:
   - Single video form
   - Bulk entry (paste multiple lines)

### Bulk Entry Format Examples
```
React Hooks Tutorial | 15:30
State Management Deep Dive | 20 minutes
Advanced Patterns | 1h 5m
Performance Optimization | 45m
Testing Strategies | 1:15:30
```

## Features to Test

### 1. Partitioning
- **Preset Buttons**: Try 60, 90, 120, 180, 240 minute sessions
- **Custom Slider**: Adjust between 15-300 minutes
- **Break Duration**: Set breaks between sessions
- **Session Display**: Expand accordion to see video breakdowns

### 2. Scheduling
- **Start Date**: Pick when you'll begin
- **Study Hours**: Set different hours for weekdays vs weekends
- **Rest Days**: Click day buttons to mark as rest days
- **View Results**: See completion date and daily breakdown

### 3. Speed Comparison
- **Presets**: Click speed buttons (1.0x - 2.0x)
- **Custom**: Use slider for fine-tuning (0.25x - 3.0x)
- **Comparisons**: View time savings for each speed
- **Fun Facts**: See equivalent Netflix episodes saved

### 4. Manual Entry
- **Single Video**: Title + duration form
- **Bulk Add**: Paste multiple videos at once
- **Edit List**: Remove videos with trash icon
- **Drag to Reorder**: (UI ready, functionality for Phase 3)

### 5. Export & Share
- **PDF Export**: Professional study plan document
- **Partition CSV**: Export just the sessions
- **Schedule CSV**: Export daily calendar
- **Share Link**: Generate public URL (no login needed!)

## Example Workflow

```
1. Click "Add Manually" from empty state
   ↓
2. Paste bulk entries in Manual Entry tab:
   Video 1 | 10:30
   Video 2 | 15 minutes
   Video 3 | 1h 5m
   ↓
3. Go to Partition tab
   ↓
4. Select "90 minutes" preset
   ↓
5. Go to Schedule tab
   ↓
6. Set weekday hours: 2h
   Set weekend hours: 4h
   Mark Sunday as rest day
   ↓
7. See completion date and timeline!
   ↓
8. Export → Share Link
   ↓
9. Copy and share the URL with anyone
```

## Keyboard Shortcuts
- `Cmd+K` / `Ctrl+K`: Command palette (quick navigation)
- `Tab`: Navigate between inputs
- `Enter`: Submit forms

## Troubleshooting

### "No Playlist Loaded" Error
- Make sure you've added videos via home page OR manual entry tab

### PDF Export Not Working
- Check browser console for jsPDF errors
- Ensure you have at least one partition created

### Shareable Link Not Decoding
- Link must be complete (don't truncate URL)
- Data is in URL params, ensure it wasn't modified

### Accordion Not Opening
- Click the entire row, not just the chevron
- Check browser console for React errors

### Numbers Not Updating
- Partitions auto-regenerate on config change
- Schedule recalculates when inputs change
- If stuck, try refreshing the page

## Sample Test Data

Copy/paste this for quick testing:

```
Introduction to React | 12:30
Components and Props | 18:45
State and Lifecycle | 25:00
Handling Events | 15:30
Conditional Rendering | 20:15
Lists and Keys | 22:40
Forms in React | 28:00
Lifting State Up | 30:20
Composition vs Inheritance | 18:00
Thinking in React | 35:45
Hooks Introduction | 40:00
useState Hook | 25:30
useEffect Hook | 32:15
Custom Hooks | 28:45
Context API | 35:00
useReducer Hook | 30:00
useMemo and useCallback | 25:00
useRef Hook | 20:00
Performance Optimization | 45:00
Testing React Apps | 50:30
```

This gives you:
- 20 videos
- ~9 hours total content
- Perfect for testing partitions
- Realistic for scheduling demos

## Browser Compatibility

Tested on:
- ✅ Chrome 120+
- ✅ Firefox 120+
- ✅ Safari 17+
- ✅ Edge 120+

Mobile:
- ✅ iOS Safari
- ✅ Chrome Android

## Performance Tips

- Large playlists (50+ videos): May take a moment to partition
- Shareable links: Keep playlists under 100 videos for URL length
- PDF generation: Larger sessions = more pages (can be slow)

## Next Steps After Testing

1. Configure Supabase & OAuth keys (see SETUP.md)
2. Run database migrations
3. Sign in with Google or GitHub
4. Complete the onboarding tour (auto-starts for new users)
5. Save a playlist and watch achievements unlock

---

Enjoy planning your learning journey! 🚀
