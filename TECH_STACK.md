# Tech Stack: Syllabus Slayer

> **Premium tools for a premium product. Performance meets aesthetics.**

---

## 🎯 Stack Philosophy

This stack prioritizes:
1. **Developer Experience:** Modern tools that accelerate development without sacrificing quality
2. **User Experience:** Blazing fast performance with buttery smooth interactions
3. **Scalability:** Architecture that grows from MVP to enterprise without rewrites
4. **Visual Excellence:** UI components and animations that create "wow" moments
5. **Maintainability:** Clear patterns, strong typing, excellent documentation

---

## 🏗️ Core Framework

### **Next.js 14.1+ (App Router)**
**Why:** The React framework for production
**Current Version:** `^14.1.0`

**Key Features:**
- **Server Components:** Optimize performance with zero-JS components where possible
- **Server Actions:** Backend logic without separate API routes
- **Built-in Optimization:** Automatic image optimization, font loading, code splitting
- **File-based Routing:** Intuitive project structure
- **Edge Runtime:** Deploy globally with minimal latency

**Alternatives Considered:**
- ❌ Create React App: Outdated, no SSR, poor performance
- ❌ Vite + React: Great DX but lacks Next.js's production optimizations
- ✅ Next.js: Industry standard for modern React applications

---

## 🎨 Styling & UI Components

### **Tailwind CSS 3.4+**
**Why:** Utility-first CSS for rapid, consistent design
**Current Version:** `^3.4.1`

**Benefits:**
- **Speed:** Build interfaces 3x faster than traditional CSS
- **Consistency:** Design system baked into utility classes
- **Performance:** PurgeCSS eliminates unused styles automatically
- **Customization:** Easy theme configuration via `tailwind.config.js`
- **Dark Mode:** First-class support with class-based toggling

### **Shadcn/UI**
**Why:** Beautifully designed, accessible component library
**Implementation Status:** ✅ **27 components integrated**

**Integrated Components:**
- `button.tsx`, `input.tsx`, `label.tsx`
- `card.tsx`, `badge.tsx`, `checkbox.tsx`
- `dialog.tsx`, `textarea.tsx`
- `dropdown-menu.tsx`, `accordion.tsx`, `slider.tsx`
- `avatar.tsx`, `scroll-area.tsx`, `select.tsx`
- `separator.tsx`, `switch.tsx`, `table.tsx`
- `tabs.tsx`, `tooltip.tsx`, `progress.tsx`
- `interactive-card.tsx`, `skeleton.tsx`, `skeleton-variants.tsx`
- `sidebar.tsx`, `background-beams.tsx`, `glowing-effect.tsx`, `wavy-background.tsx`

**Not a Traditional Library:**
- Components are *copied into your project* (full ownership)
- Built on Radix UI primitives (bulletproof accessibility)
- Fully customizable with Tailwind
- No runtime overhead or dependency bloat

**Core Components to Use:**
- `Button`, `Input`, `Select`, `Dialog`, `Popover`
- `Card`, `Tabs`, `Sheet`, `Dropdown Menu`
- `Progress`, `Tooltip`, `Badge`, `Avatar`
- `Calendar`, `Date Picker`, `Command` (for search)

### **Radix UI**
**Why:** Unstyled, accessible component primitives
**Current Packages:**
- `@radix-ui/react-slot` `^1.2.3`
- `@radix-ui/react-label` `^2.1.8`
- `@radix-ui/react-accordion` `^1.1.2`
- `@radix-ui/react-avatar`
- `@radix-ui/react-checkbox` `^1.0.4`
- `@radix-ui/react-dialog` `^1.0.5`
- `@radix-ui/react-dropdown-menu` `^2.0.6`
- `@radix-ui/react-scroll-area`
- `@radix-ui/react-select`
- `@radix-ui/react-slider` `^1.1.2`
- `@radix-ui/react-tabs`
- `@radix-ui/react-tooltip`

**Where Shadcn Doesn't Cover:**
- Complex interactions (Accordion, Slider, Switch)
- Collision detection and positioning
- Focus management and keyboard navigation

---

## ✨ Animation & Motion

### **Framer Motion**
**Why:** Production-ready motion library for React
**Current Version:** `^12.34.0`
**Integration Status:** ✅ **Active in partition/schedule/speed components**

**Use Cases:**
- **Page Transitions:** Smooth navigation between routes
- **Number Animations:** Counting up duration values
- **Progress Indicators:** Animated completion rings and bars
- **Gesture Animations:** Drag, hover, tap interactions
- **Layout Animations:** Automatic element position transitions

**Example Patterns:**
```javascript
// Smooth number counting
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {duration}
</motion.div>

// Progress ring
<motion.circle
  initial={{ pathLength: 0 }}
  animate={{ pathLength: progress }}
  transition={{ duration: 1, ease: "easeInOut" }}
/>
```

### **CSS Variables + Tailwind**
**Why:** Theme-aware animations with minimal JS

**Pattern:**
- Define theme colors as CSS variables
- Animate variables for smooth theme transitions
- No layout thrashing or FOUC (Flash of Unstyled Content)

---

## 🗄️ Backend & Database

### **Supabase** (Primary Recommendation)
**Why:** PostgreSQL + Real-time + Auth + Storage in one platform

**Features:**
- **PostgreSQL Database:** Powerful relational data with JSON support
- **Real-time Subscriptions:** Live progress updates across devices
- **Row Level Security:** Database-level permissions
- **Built-in Auth:** OAuth (Google, GitHub), magic links, email/password
- **Storage Buckets:** User-generated content (profile pictures, PDFs)
- **Edge Functions:** Serverless functions close to users
- **Auto-generated APIs:** Instant REST and GraphQL endpoints

**Schema Design:**
```sql
-- users (managed by Supabase Auth)

-- playlists
id, user_id, youtube_id, title, total_duration, video_count, created_at

-- partitions
id, playlist_id, session_number, start_video, end_video, duration

-- progress
id, user_id, playlist_id, completed_videos[], completion_percentage, last_updated

-- achievements
id, user_id, badge_type, earned_at, metadata
```

**Alternative:** **Firebase**
- ✅ Easier initial setup
- ❌ NoSQL (less flexible querying)
- ❌ More expensive at scale
- ❌ Vendor lock-in concerns

**Our Choice:** Supabase (PostgreSQL + better pricing + OSS)

---

## 🔐 Authentication

### **NextAuth.js (Auth.js)**
**Why:** Flexible authentication for Next.js

**Providers:**
- Google OAuth (primary)
- GitHub OAuth (developer audience)
- Email Magic Links (passwordless)

**Session Strategy:**
- JWT tokens for stateless auth
- Database sessions for enhanced security (post-Phase 3)

**Alternative:** **Clerk**
- ✅ Beautiful pre-built UI components
- ✅ User management dashboard
- ❌ More expensive ($25/month for basic features)
- ❌ Less customization

**Our Choice:** NextAuth.js (cost-effective, flexible, well-documented)

---

## 🌐 API Integration

### **YouTube Data API v3**
**Why:** Official Google API for playlist metadata

**Implementation:**
```javascript
// /lib/youtube.ts
export async function fetchPlaylistData(playlistId: string) {
  const response = await fetch(
    `https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${playlistId}&key=${API_KEY}&maxResults=50`
  );
  // Parse and aggregate durations
}
```

**Rate Limit Management:**
- Quota: 10,000 units/day (free tier)
- Implement caching layer (Redis/Upstash)
- Store playlist data to reduce API calls

### **Axios vs. Fetch API**
**Our Choice:** Native `fetch` with custom wrapper
- No external dependency
- Works in Edge runtime
- Add custom error handling and retries

---

## 📊 State Management

### **Zustand**
**Why:** Minimal, flexible state management
**Current Version:** `^4.5.7`
**Implementation:** ✅ **Full store with persistence middleware**

**Implementation Highlights:**
- `usePlannerStore.ts`: Comprehensive Zustand store
- LocalStorage persistence for user preferences
- Video management (YouTube + manual entries)
- Partition configuration and generation
- Schedule calculation with caching
- Template management for bulk entry
- Playback speed tracking

**When to Use:**
- Global UI state (theme, sidebar open/closed)
- User preferences (default speed, time format)
- Active playlist data
- Temporary calculation state

**Pattern:**
```javascript
// /store/usePlaylistStore.ts
import { create } from 'zustand'

export const usePlaylistStore = create((set) => ({
  playlist: null,
  speed: 1.5,
  setPlaylist: (playlist) => set({ playlist }),
  setSpeed: (speed) => set({ speed }),
}))
```

**Alternatives:**
- ❌ Redux Toolkit: Overkill for this app's complexity
- ✅ Jotai: Atomic state (great alternative, slightly different mental model)
- ✅ React Context: Fine for very simple state, but Zustand is cleaner

---

## 📅 Date & Time Utilities

### **date-fns**
**Why:** Modern, modular date library
**Current Version:** `^2.30.0`
**Usage:** Schedule calculations, completion date estimation

**Use Cases:**
- Calculate completion dates
- Format time ranges
- Schedule partitions across days
- Handle time zones

**Why Not Moment.js:** Deprecated, large bundle size

---

## 📄 PDF Generation

### **jsPDF + jspdf-autotable**
**Why:** Client-side PDF creation
**Current Versions:**
- `jspdf`: `^4.1.0`
- `jspdf-autotable`: `^5.0.7`
**Implementation Status:** ✅ **PDF export functional**

**Use Case:** Export study plans as shareable PDFs

**Note:** jsPDF v4 is older version. Consider upgrading to v2.x in Phase 3 for better features.

**Alternative:** **React-PDF**
- Better for complex layouts
- Requires server-side rendering
- Consider for Phase 3 upgrade

---

## 📈 Analytics & Monitoring

### **PostHog** (Recommended)
**Why:** Open-source product analytics

**Features:**
- Event tracking (playlist calculated, partition created)
- User funnels (signup → first playlist → return visit)
- Session replays (see how users interact)
- Feature flags (A/B testing)
- Self-hostable (data privacy)

**Alternative:** **Mixpanel**
- ✅ More mature platform
- ❌ Expensive beyond free tier
- ❌ Less developer-friendly

### **Sentry**
**Why:** Error tracking and performance monitoring

**Integration:**
- Catch runtime errors
- Track API failures
- Monitor page load times
- Source map support for debugging

---

## 🚀 Deployment & Infrastructure

### **Vercel** (Primary)
**Why:** Built for Next.js, zero-config deployment

**Features:**
- **Edge Network:** Global CDN for instant loads
- **Automatic HTTPS:** SSL certificates included
- **Preview Deployments:** Every git push gets a URL
- **Environment Variables:** Secure secret management
- **Analytics:** Web Vitals tracking built-in

**Free Tier:**
- 100GB bandwidth/month
- Unlimited deployments
- Perfect for MVP → growth stage

**Alternative:** **Railway** or **Fly.io**
- Better for full-stack apps with heavy backend logic
- Consider if moving away from serverless

---

## 🔍 SEO & Metadata

### **Next.js Metadata API**
**Why:** Built-in, type-safe meta tag management

```javascript
// app/layout.tsx
export const metadata = {
  title: 'Syllabus Slayer | YouTube Learning Planner',
  description: 'Transform YouTube playlists into strategic learning plans',
  openGraph: {
    images: ['/og-image.png'],
  },
}
```

### **next-sitemap**
**Why:** Automatic sitemap generation for SEO

---

## 📧 Email Service

### **Resend** (Phase 3+)
**Why:** Modern email API for developers

**Use Cases:**
- Achievement emails ("You completed your first playlist!")
- Weekly progress summaries
- Account notifications

**Why Not SendGrid:** Resend has better DX, simpler pricing

---

## 🔧 Development Tools

### **TypeScript**
**Why:** Catch errors before runtime, better DX

**Configuration:**
- Strict mode enabled
- Path aliases (`@/components`, `@/lib`)
- Type safety for API responses

### **ESLint + Prettier**
**Why:** Consistent code style, catch common bugs

### **Husky + lint-staged**
**Why:** Pre-commit hooks ensure quality

### **Vitest (or Jest)**
**Why:** Fast unit testing for utilities

**Focus Areas:**
- Duration calculation logic
- Partition algorithm
- Speed multiplier math

---

## 📱 Browser Extension (Phase 4)

### **Plasmo Framework**
**Why:** Modern Chrome extension framework

**Features:**
- React support out of the box
- Hot module reloading
- TypeScript support
- Build for Chrome, Firefox, Edge from one codebase

---

## 🎨 UI Utilities & Helpers

### **Lucide Icons**
**Why:** Beautiful, consistent icon set
**Current Version:** `^0.314.0`
**Implementation Status:** ✅ **Used throughout UI**

**Common Icons:**
```javascript
import { Clock, PlayCircle, TrendingUp, Sparkles, TrendingDown } from 'lucide-react'
```

### **class-variance-authority (CVA)**
**Why:** Type-safe component variants
**Current Version:** `^0.7.0`

**Pattern:**
```typescript
const buttonVariants = cva("base-classes", {
  variants: {
    variant: {
      default: "bg-primary",
      outline: "border border-input",
    },
  },
})
```

### **Tailwind Merge & clsx**
**Current Versions:**
- `tailwind-merge`: `^2.2.0`
- `clsx`: `^2.1.0`

**Use Case:** Conditional classes and preventing Tailwind class conflicts

### **Sonner**
**Why:** Beautiful toast notifications
**Current Version:** `^1.3.1`
**Implementation Status:** ✅ **Toast provider configured**

**Features:**
- Beautiful pre-styled toasts
- Promise-based API
- Success/error/loading states
- Auto-dismiss with customizable duration

**Usage:**
```typescript
import { toast } from 'sonner'

toast.success('Plan exported successfully!')
toast.error('Failed to fetch playlist')
```

### **@dnd-kit** (Phase 3)
**Current Versions:**
- `@dnd-kit/core`: `^6.3.1`
- `@dnd-kit/sortable`: `^10.0.0`
**Status:** 📦 **Installed, awaiting full drag-and-drop integration**

**Planned Use:** Drag-and-drop video reordering in manual entry

### **Aceternity UI**
**Status:** ✅ **Integrated via registry**
**Components:** `background-beams.tsx`, `glowing-effect.tsx`, `wavy-background.tsx`
**Config:** Registered in `components.json` under `@aceternity` registry

---

## 🎨 Design Tools Integration

### **Figma**
**Why:** Design system source of truth

**Workflow:**
1. Design components in Figma
2. Export design tokens (colors, spacing, typography)
3. Generate Tailwind theme config
4. Implement with Shadcn/UI

### **Lucide Icons**
**Why:** Beautiful, consistent icon set

**Usage:**
```javascript
import { Clock, PlayCircle, TrendingUp } from 'lucide-react'
```

---

## 📊 Full Stack Overview

```
┌─────────────────────────────────────────┐
│           Frontend (User)               │
│  Next.js 14 + React 18 + TypeScript     │
│  Tailwind CSS + Shadcn/UI               │
│  Framer Motion                          │
└─────────────────┬───────────────────────┘
                  │
                  ├──────────────────────────┐
                  │                          │
┌─────────────────▼─────────┐   ┌───────────▼──────────┐
│   State Management        │   │  External APIs       │
│   Zustand                 │   │  YouTube Data API    │
└─────────────────┬─────────┘   └──────────────────────┘
                  │
┌─────────────────▼──────────────────────┐
│         Backend & Database              │
│  Supabase (PostgreSQL + Auth + Storage) │
│  Edge Functions                         │
└─────────────────┬──────────────────────┘
                  │
┌─────────────────▼──────────────────────┐
│          Infrastructure                 │
│  Vercel (Deployment + Edge Network)    │
│  Sentry (Error Monitoring)             │
│  PostHog (Analytics)                   │
└────────────────────────────────────────┘
```

---

## 💰 Cost Breakdown (Estimated Monthly)

### MVP (Phase 1-2):
- **Vercel:** $0 (Hobby tier)
- **Supabase:** $0 (Free tier: 500MB DB, 1GB bandwidth)
- **YouTube API:** $0 (within quota)
- **Domain:** ~$12/year
- **Total:** ~$1/month

### Growth (Phase 3):
- **Vercel Pro:** $20/month (better limits)
- **Supabase Pro:** $25/month (8GB DB, better support)
- **Resend:** $0-10/month (email)
- **PostHog:** $0 (generous free tier)
- **Total:** ~$55/month

### Scale (Phase 4):
- **Vercel Team:** $100/month
- **Supabase Team:** $599/month (larger DB, dedicated support)
- **Sentry:** $29/month
- **Total:** ~$728/month (at 10K+ users)

---

## 🎯 Why This Stack Wins

### Speed to Market
- **Next.js + Supabase:** Full-stack app in days, not weeks
- **Shadcn/UI:** Pre-built components = no design bottleneck
- **Vercel:** Deploy in seconds, iterate rapidly

### Premium UX
- **Framer Motion:** Animations that rival native apps
- **Tailwind + Shadcn:** Consistent, modern design system
- **Edge Runtime:** Sub-100ms response times globally

### Developer Happiness
- **TypeScript:** Confidence in refactoring
- **Hot Reload:** See changes instantly
- **Great Docs:** All tools have excellent documentation

### Scalability
- **Supabase:** Handles 100K+ users without major changes
- **Next.js:** Code splitting and optimization built-in
- **Vercel Edge:** Auto-scales to traffic spikes

---

## 🚀 Getting Started

```bash
# Create Next.js app with TypeScript
npx create-next-app@latest syllabus-slayer --typescript --tailwind --app

# Install core dependencies
npm install @supabase/supabase-js framer-motion zustand date-fns

# Install UI components
npx shadcn-ui@latest init

# Set up environment variables
cp .env.example .env.local
# Add NEXT_PUBLIC_SUPABASE_URL, YOUTUBE_API_KEY, etc.

# Start development
npm run dev
```

---

**This stack represents the current state-of-the-art in modern web development. Build fast. Ship faster. Scale confidently.**
