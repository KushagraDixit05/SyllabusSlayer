# Phase 3A: Foundation & Authentication

## Overview

This phase establishes the authentication and data persistence foundation for Syllabus Slayer, enabling user accounts, saved playlists, and gamification features.

## What's Implemented

### ✅ Authentication System
- **NextAuth.js v5** with OAuth providers (Google, GitHub)
- Session management with secure cookies
- Protected routes with middleware
- Sign-in/sign-out flows
- User menu and profile integration

### ✅ Database Schema (Supabase)
- **user_profiles** - User data and gamification stats
- **playlists** - Saved playlists with metadata
- **videos** - Individual videos in playlists
- **partitions** - Study session partitions
- **schedules** - Study schedules
- **daily_schedules** - Calendar entries
- **achievements** - Gamification badges
- **activity_log** - User activity tracking
- **templates** - Reusable playlist templates

### ✅ Row-Level Security (RLS)
- Users can only access their own data
- Automatic profile creation on signup
- Cascade deletes for data integrity
- Automated triggers for stats updates

### ✅ Data Access Layer
- Type-safe repository pattern
- **PlaylistRepository** - CRUD for playlists
- **UserRepository** - Profile management
- **AchievementRepository** - Achievement tracking

### ✅ State Management
- **useSavedPlaylistStore** - Database-synced playlists
- **usePlannerStore** - Local planning state (existing)
- Zustand with persistence middleware

### ✅ Dashboard
- Overview with stats (playlists, hours, streaks)
- Active playlists view
- Quick actions menu
- Recent activity feed
- Responsive sidebar navigation

### ✅ UI Components
- Sign-in page with OAuth buttons
- User menu with profile dropdown
- Protected route wrapper
- Dashboard layout with header/sidebar
- Activity indicators and stats cards

## Getting Started

### 1. Install Dependencies

All dependencies are already installed:
```bash
cd frontend
# Dependencies installed: next-auth@beta, @auth/supabase-adapter, @supabase/ssr
```

### 2. Setup Supabase

1. **Create a Supabase Project:**
   - Go to https://supabase.com
   - Create new project
   - Wait for database to be ready

2. **Run Database Schema:**
   - Open Supabase SQL Editor
   - Copy contents of `/supabase/schema.sql`
   - Execute the SQL
   - Verify tables are created

3. **Get Credentials:**
   - Go to Project Settings > API
   - Copy:
     - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
     - `anon/public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Setup OAuth Providers

#### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create project → Create OAuth 2.0 Client ID
3. Application type: Web application
4. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google` (production)
5. Copy Client ID and Client Secret

#### GitHub OAuth:
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. New OAuth App
3. Application name: `Syllabus Slayer Dev`
4. Homepage URL: `http://localhost:3000`
5. Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
6. Copy Client ID and Client Secret

### 4. Configure Environment Variables

```bash
cd frontend
cp .env.example .env.local
```

Edit `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_this_with_openssl

# Google OAuth
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx

# GitHub OAuth
GITHUB_CLIENT_ID=xxxxx
GITHUB_CLIENT_SECRET=xxxxx

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Generate NextAuth secret:
```bash
openssl rand -base64 32
```

### 5. Run the Application

```bash
cd frontend
npm run dev
```

Visit http://localhost:3000

## Testing Checklist

### Authentication
- [ ] Visit `/auth/signin`
- [ ] Click "Continue with Google"
- [ ] Successfully authenticate
- [ ] Redirected to `/dashboard`
- [ ] User profile created in Supabase

### Database
- [ ] Check `user_profiles` table for new user
- [ ] Verify `display_name` and `avatar_url` populated
- [ ] Test RLS policies (try accessing other users' data)

### Dashboard
- [ ] Dashboard loads without errors
- [ ] Stats show correct default values (all zeros)
- [ ] Sidebar navigation works
- [ ] User menu displays correctly
- [ ] Sign out works

### Playlists (Integration with existing features)
- [ ] Go to `/planner`
- [ ] Create a playlist from YouTube URL
- [ ] Save playlist (when implemented)
- [ ] View saved playlist on dashboard

## Architecture

```
┌─────────────────────────────────────────────┐
│           Next.js App (Frontend)            │
│  ┌────────────┐           ┌──────────────┐ │
│  │  Auth UI   │───────────│  NextAuth.js │ │
│  └────────────┘           └──────────────┘ │
│                                  │          │
│  ┌────────────────────────────┐  │          │
│  │   Repository Layer         │  │          │
│  │  • PlaylistRepository      │  │          │
│  │  • UserRepository          │  │          │
│  │  • AchievementRepository   │  │          │
│  └────────────────────────────┘  │          │
│             │                     │          │
└─────────────┼─────────────────────┼──────────┘
              │                     │
              ▼                     ▼
        ┌──────────────────────────────┐
        │    Supabase Backend          │
        │  ┌────────────────────────┐  │
        │  │  PostgreSQL Database   │  │
        │  │  • Row-Level Security  │  │
        │  │  • Auto Triggers       │  │
        │  └────────────────────────┘  │
        │  ┌────────────────────────┐  │
        │  │  Auth Service          │  │
        │  │  • OAuth Integration   │  │
        │  │  • Session Management  │  │
        │  └────────────────────────┘  │
        └──────────────────────────────┘
```

## File Structure

```
frontend/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/route.ts    # NextAuth API routes
│   ├── auth/
│   │   ├── signin/page.tsx               # Sign-in page
│   │   └── error/page.tsx                # Auth error page
│   ├── dashboard/
│   │   ├── layout.tsx                    # Dashboard layout
│   │   └── page.tsx                      # Dashboard home
│   ├── providers.tsx                     # SessionProvider wrapper
│   └── layout.tsx                        # Root layout
├── components/
│   ├── auth/
│   │   ├── SignInForm.tsx                # OAuth sign-in form
│   │   ├── UserMenu.tsx                  # User dropdown menu
│   │   └── ProtectedRoute.tsx            # Route protection
│   └── dashboard/
│       ├── DashboardHeader.tsx           # Top header
│       ├── DashboardSidebar.tsx          # Side navigation
│       ├── DashboardStats.tsx            # Stats cards
│       ├── ActivePlaylists.tsx           # Playlist list
│       ├── QuickActions.tsx              # Action buttons
│       └── RecentActivity.tsx            # Activity feed
├── lib/
│   ├── auth.ts                           # NextAuth config
│   ├── repositories/
│   │   ├── playlistRepository.ts         # Playlist CRUD
│   │   ├── userRepository.ts             # User CRUD
│   │   ├── achievementRepository.ts      # Achievement CRUD
│   │   └── index.ts                      # Exports
│   └── supabase/
│       ├── client.ts                     # Browser client
│       └── server.ts                     # Server client
├── store/
│   └── useSavedPlaylistStore.ts          # DB-synced state
├── types/
│   ├── database.ts                       # Supabase types
│   └── next-auth.d.ts                    # NextAuth types
└── middleware.ts                         # Route protection

supabase/
└── schema.sql                            # Database schema
```

## Common Issues & Solutions

### Issue: "Invalid authentication credentials"
**Solution:** Check that Supabase keys in `.env.local` are correct

### Issue: OAuth redirect fails
**Solution:** Verify redirect URIs match exactly in OAuth provider settings

### Issue: User profile not created
**Solution:** Check Supabase logs, verify trigger is enabled

### Issue: RLS blocks all queries
**Solution:** Ensure you're authenticated and using `auth.uid()` in policies

### Issue: TypeScript errors with next-auth
**Solution:** Install `@types/next-auth` if needed, restart TS server

## Next Steps: Phase 3B

Once Phase 3A is complete and tested:
- Premium UI redesign
- Dark mode implementation
- Enhanced animations with Framer Motion
- Improved mobile responsiveness
- Advanced data visualizations

## Support

For issues or questions:
1. Check [PHASE_3A_CHECKLIST.md](./PHASE_3A_CHECKLIST.md)
2. Review Supabase logs for database errors
3. Check browser console for client-side errors
4. Verify all environment variables are set correctly
