# Utopia — Setup & Deployment Guide

## Folder Structure

```
utopia-web/
├── app/
│   ├── (auth)/                  # Auth pages (no main header)
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── reset-password/page.tsx
│   ├── (main)/                  # Main app pages
│   │   ├── layout.tsx
│   │   ├── page.tsx             # Home / post list
│   │   └── posts/
│   │       ├── new/page.tsx     # Create post
│   │       └── [id]/page.tsx    # Post detail
│   ├── auth/
│   │   └── callback/route.ts    # Supabase OAuth callback
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── ResetPasswordForm.tsx
│   ├── posts/
│   │   ├── PostCard.tsx
│   │   ├── PostList.tsx
│   │   ├── PostForm.tsx
│   │   └── SortTabs.tsx
│   ├── comments/
│   │   ├── CommentForm.tsx
│   │   └── CommentList.tsx
│   ├── likes/
│   │   └── LikeButton.tsx
│   └── ui/
│       ├── Header.tsx
│       ├── ThemeProvider.tsx
│       ├── ThemeToggle.tsx
│       └── ErrorMessage.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts            # Browser Supabase client
│   │   └── server.ts            # Server Supabase client
│   ├── actions/
│   │   ├── auth.ts              # Server actions: login, signup, logout
│   │   ├── posts.ts             # Server actions: CRUD posts
│   │   ├── comments.ts          # Server actions: CRUD comments
│   │   └── likes.ts             # Server actions: toggle like
│   ├── types.ts
│   └── utils.ts
├── middleware.ts                 # Route protection
├── supabase/
│   └── schema.sql               # Database schema
├── .env.local.example
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 1. Supabase Setup

### Create a project
1. Go to [supabase.com](https://supabase.com) → New project
2. Note your **Project URL** and **anon public key** from Settings → API

### Run the schema
1. In your Supabase dashboard → SQL Editor → New query
2. Copy the contents of `supabase/schema.sql` and run it

### Configure Auth
- Settings → Authentication → Email → enable **Confirm email** (optional for dev)
- Settings → Authentication → URL Configuration:
  - Site URL: `http://localhost:3000` (or your Vercel URL in prod)
  - Redirect URLs: add `http://localhost:3000/auth/callback` and `https://your-app.vercel.app/auth/callback`

---

## 2. Local Development

```bash
# Install dependencies
npm install

# Copy env file
cp .env.local.example .env.local
# Fill in your SUPABASE_URL and SUPABASE_ANON_KEY

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 3. Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**For production**, set `NEXT_PUBLIC_APP_URL` to your Vercel URL.

---

## 4. Deploy to Vercel

### Option A — Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option B — GitHub Integration
1. Push to GitHub
2. Import repo at [vercel.com/new](https://vercel.com/new)
3. Vercel auto-detects Next.js

### Set environment variables in Vercel
- Dashboard → Project → Settings → Environment Variables
- Add all three variables from `.env.local.example`
- Set `NEXT_PUBLIC_APP_URL` to your Vercel deployment URL (e.g. `https://utopia-web.vercel.app`)

### Update Supabase redirect URLs
After deploying, add your Vercel URL to Supabase:
- Settings → Authentication → URL Configuration → Redirect URLs
- Add: `https://your-app.vercel.app/auth/callback`

---

## Features Implemented

| Feature | Status |
|---------|--------|
| Email signup/login | ✅ |
| Password reset | ✅ |
| Session handling (middleware) | ✅ |
| Create post (title, content, anonymous toggle) | ✅ |
| List posts (latest / popular sort) | ✅ |
| View post detail | ✅ |
| Delete own post | ✅ |
| Add comments (anonymous toggle) | ✅ |
| Delete own comment | ✅ |
| Like/unlike posts (optimistic UI) | ✅ |
| Duplicate like prevention (DB unique constraint) | ✅ |
| Dark mode (system/light/dark toggle) | ✅ |
| Mobile responsive | ✅ |
| Row Level Security (RLS) | ✅ |
