# Setup Guide: Syllabus Slayer

> **Complete development environment setup — Phases 1 through 3D+**

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.0.0 or higher)
- **npm** (version 9.0.0 or higher)
- **Git** (for version control)
- **Code Editor** (VS Code recommended)
- **Supabase account** (free tier: https://supabase.com)
- **Google Cloud Console** project (for YouTube API + OAuth)
- **GitHub OAuth App** (optional, for GitHub sign-in)

Check versions:
```bash
node --version  # Should be v18.x.x or higher
npm --version   # Should be 9.x.x or higher
```

## 🔑 Getting YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable **YouTube Data API v3**:
   - Navigate to "APIs & Services" → "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the API key (you'll need this later)
5. (Optional) Restrict the API key:
   - Click on the created key
   - Under "API restrictions", select "Restrict key"
   - Choose "YouTube Data API v3"
   - Save

## 🚀 Installation Steps

### Step 1: Clone and Navigate

```bash
cd SyllabusSlayer
```

### Step 2: Install Dependencies

Install all dependencies for both backend and frontend:

```bash
npm install
```

This command will:
- Install root dependencies
- Install backend dependencies
- Install frontend dependencies

### Step 3: Backend Configuration

1. **Navigate to backend:**
   ```bash
   cd backend
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` file:**
   Open `backend/.env` and add your YouTube API key:
   
   ```env
   # YouTube Data API Key
   YOUTUBE_API_KEY=your_actual_api_key_here
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # CORS Configuration
   ALLOWED_ORIGINS=http://localhost:3000
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Return to root:**
   ```bash
   cd ..
   ```

### Step 4: Frontend Configuration

1. **Navigate to frontend:**
   ```bash
   cd frontend
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env.local
   ```

3. **Edit `.env.local` file:**
   Open `frontend/.env.local` and configure all keys:
   
   ```env
   # Backend API URL
   NEXT_PUBLIC_API_URL=http://localhost:5000

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # NextAuth.js
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=generate-a-random-secret-here

   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   # GitHub OAuth
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret

   # Resend (email — optional)
   RESEND_API_KEY=your_resend_api_key
   ```

4. **Return to root:**
   ```bash
   cd ..
   ```

### Step 5: Supabase Database Setup

1. Create a Supabase project at https://supabase.com
2. Copy the **Project URL** and **anon key** into `.env.local`
3. Run the schema migration in the Supabase SQL Editor:
   ```sql
   -- Copy and run contents of supabase/schema.sql
   -- Then run supabase/migrations/phase3c-gamification.sql
   ```
4. (Optional) Run `supabase/disable-rls-temp.sql` during development

### Step 6: OAuth Setup

**Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com) → Credentials
2. Create OAuth 2.0 Client ID (Web application)
3. Add `http://localhost:3000/api/auth/callback/google` as Authorized redirect URI
4. Copy Client ID and Secret to `.env.local`

**GitHub OAuth:**
1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Create new app with callback URL: `http://localhost:3000/api/auth/callback/github`
3. Copy Client ID and Secret to `.env.local`

## ▶️ Running the Application

### Development Mode (Recommended)

**Option 1: Run Both Simultaneously (from root)**

```bash
npm run dev
```

This command starts:
- ✅ Backend server at `http://localhost:5000`
- ✅ Frontend app at `http://localhost:3000`

**Option 2: Run Separately**

Terminal 1 (Backend):
```bash
npm run dev:backend
```

Terminal 2 (Frontend):
```bash
npm run dev:frontend
```

### Verify Setup

1. **Check Backend Health:**
   - Open browser: `http://localhost:5000/api/health`
   - Expected response:
     ```json
     {
       "success": true,
       "data": {
         "status": "healthy",
         "timestamp": "2026-02-15T..."
       }
     }
     ```

2. **Check Frontend:**
   - Open browser: `http://localhost:3000`
   - You should see the Syllabus Slayer homepage

3. **Test Playlist Analysis:**
   - Enter this test playlist URL:
     ```
     https://www.youtube.com/playlist?list=PLWKjhJtqVAbnqBxcdjVGgT3uVR10bzTEB
     ```
   - Click "Analyze Playlist"
   - You should see results with video count and durations

## 🔍 Troubleshooting

### Issue: Backend won't start

**Error:** `Missing required environment variable: YOUTUBE_API_KEY`

**Solution:**
1. Verify `backend/.env` file exists
2. Check that `YOUTUBE_API_KEY` is set
3. Ensure no extra spaces around the API key

---

**Error:** `Port 5000 already in use`

**Solution:**
1. Change port in `backend/.env`:
   ```env
   PORT=5001
   ```
2. Update frontend `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001
   ```

---

### Issue: Frontend won't start

**Error:** `Module not found: Can't resolve '@/components/...'`

**Solution:**
```bash
cd frontend
rm -rf node_modules .next
npm install
npm run dev
```

---

### Issue: API calls failing (CORS errors)

**Error:** `Access to fetch blocked by CORS policy`

**Solution:**
1. Check `backend/.env` has correct origin:
   ```env
   ALLOWED_ORIGINS=http://localhost:3000
   ```
2. Restart backend server

---

### Issue: YouTube API errors

**Error:** `YouTube API quota exceeded`

**Solution:**
- Wait until quota resets (midnight PST)
- Or increase quota in Google Cloud Console (paid)

**Error:** `Playlist not found or is private`

**Solution:**
- Verify the playlist is public
- Try a different playlist URL
- Check API key has YouTube Data API v3 enabled

---

### Issue: TypeScript errors

**Error:** Type errors in VS Code

**Solution:**
```bash
# Backend
cd backend
npm run type-check

# Frontend
cd frontend
npm run type-check
```

## 🛠️ Development Tools

### Recommended VS Code Extensions

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript and JavaScript Language Features** - Enhanced TS support
- **Tailwind CSS IntelliSense** - Tailwind autocomplete
- **Error Lens** - Inline error display

Install all:
```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension usernamehw.errorlens
```

### Useful Commands

```bash
# Type checking
npm run type-check --workspace=backend
npm run type-check --workspace=frontend

# Linting
npm run lint --workspace=backend
npm run lint --workspace=frontend

# Build for production
npm run build

# Clean install (if issues)
rm -rf node_modules backend/node_modules frontend/node_modules
npm install
```

## 📦 Project Scripts Reference

### Root Level

| Command | Description |
|---------|-------------|
| `npm run dev` | Run both backend and frontend |
| `npm run dev:backend` | Run backend only |
| `npm run dev:frontend` | Run frontend only |
| `npm run build` | Build both applications |
| `npm run build:backend` | Build backend only |
| `npm run build:frontend` | Build frontend only |

### Backend (from `backend/` directory)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run production build |
| `npm run type-check` | Check TypeScript types |
| `npm run lint` | Run ESLint |

### Frontend (from `frontend/` directory)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run type-check` | Check TypeScript types |
| `npm run lint` | Run Next.js linter |

## 🌐 Testing the Application

### Manual Testing Checklist

- [ ] Backend health check returns 200 OK
- [ ] Frontend loads without errors
- [ ] Can enter playlist URL on home page
- [ ] Loading state appears during fetch
- [ ] Results display correctly with all speeds
- [ ] Copy to clipboard works
- [ ] Clear button resets form
- [ ] Error messages show for invalid URLs
- [ ] Responsive design works on mobile
- [ ] Sign in with Google/GitHub works
- [ ] Dashboard loads after sign-in (`/dashboard`)
- [ ] Onboarding tour auto-starts for new users
- [ ] Playlists page shows saved playlists (`/dashboard/playlists`)
- [ ] Search page filters playlists (`/dashboard/search`)
- [ ] Analytics page shows insight cards (`/dashboard/analytics`)
- [ ] Achievements page loads (`/dashboard/achievements`)
- [ ] Settings & Help pages load
- [ ] Planner has back-to-dashboard link
- [ ] Cmd+K command palette opens
- [ ] Dark mode toggle works

### Sample Playlists for Testing

```
# Small playlist (5-10 videos)
https://www.youtube.com/playlist?list=PLWKjhJtqVAbnqBxcdjVGgT3uVR10bzTEB

# Medium playlist (20-50 videos)
https://www.youtube.com/playlist?list=PLxxxxxx (replace with actual)

# Large playlist (100+ videos)
https://www.youtube.com/playlist?list=PLxxxxxx (replace with actual)

# Invalid URLs to test error handling
https://www.youtube.com/playlist?list=INVALID
not-a-url
```

## 🏗️ Production Build

### Backend Production Build

```bash
cd backend
npm run build
npm start
```

### Frontend Production Build

```bash
cd frontend
npm run build
npm start
```

## 🎓 Next Steps

After successful setup:

1. **Read the documentation:**
   - [ARCHITECTURE.md](./ARCHITECTURE.md) - Understand the system design
   - [backend/README.md](./backend/README.md) - Backend API details
   - [frontend/README.md](./frontend/README.md) - Frontend guide

2. **Explore the code:**
   - Start with `backend/src/app.ts` and `frontend/app/page.tsx`
   - Follow the request flow in ARCHITECTURE.md

3. **Make your first change:**
   - Try adding a new speed multiplier (e.g., 1.75x)
   - Update a component's styling
   - Add a new utility function

## 📞 Getting Help

If you encounter issues not covered here:

1. Check existing documentation
2. Review error logs in terminal
3. Verify environment variables
4. Check YouTube API quota in Google Cloud Console

---

**Happy coding! 🚀**
