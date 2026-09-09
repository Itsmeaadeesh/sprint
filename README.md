# Sprint ⚡
> A premium, production-ready multi-list task & project board combining Google Tasks' functionality with modern SaaS dashboard polish (Linear, Flowith, Atlasflow-style).

Built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, **Framer Motion**, and **Supabase (PostgreSQL + Auth + Real-time)**.

---

## ✨ Features

- 🌌 **Aesthetic & Micro-interactions**: Deep near-black background (`#0d0e11`), subtle animated gradient glows, glassmorphism (`backdrop-blur-xl`, `bg-white/5`), traffic-light window chrome motif, animated SVG draw-in checkmarks, task slide animations, and toast undo banners.
- 🔐 **Production-grade Authentication**:
  - Email/Password signup and login with inline error handling.
  - Google OAuth sign-in integration.
  - Password recovery flow (request reset link + reset password).
  - Protected routing with session persistence and clean logout.
  - Profile settings (display name, avatar, email, theme, email notification toggles).
- 🗄️ **Supabase Backend & RLS**:
  - Real-time multi-tab synchronization with Supabase Realtime subscriptions.
  - Strict Row Level Security (RLS) policies on all tables (`profiles`, `lists`, `tasks`, `tags`, `task_tags`).
  - Zero-state onboarding: Every new account starts completely empty with a guided "Create your first list" empty state.
- 📋 **Main Board View**:
  - Horizontal multi-list glassmorphic cards with user-assignable list colors.
  - Drag-and-drop task and list reordering powered by `@dnd-kit`.
  - Task priority tags (Low, Medium, High), due dates, starring, and notes.
  - Collapsible completed tasks accordion with smooth height transitions.
- 📅 **Weekly Calendar View**:
  - Weekly timeline grid with live current-time indicator line.
  - Draggable & reschedulable task blocks color-coded by list.
- 📊 **Dashboard Summary Widgets**:
  - "Today's Tasks" interactive circular progress ring.
  - Upcoming deadlines widget with countdowns.
  - Focus streak counter and quick note scratchpad.
- ⚡ **Productivity Shortcuts**:
  - `⌘K` / `Ctrl+K` Global Command Palette and Quick Add modal.
  - Inline quick-add on list cards.
  - Bottom-center glassmorphic undo toasts for task completion/deletion.
  - Light & Dark theme toggle with persistent user preference.

---

## 🚀 Quick Start

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/Itsmeaadeesh/sprint.git
cd sprint
npm install
```

### 2. Configure Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **Project Settings** -> **API** and copy your **Project URL** and **anon public key**.
3. Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Open the **SQL Editor** in your Supabase dashboard, paste the contents of `supabase/schema.sql`, and click **Run**. This will create the required tables, triggers, Row Level Security policies, and enable Realtime subscriptions.
5. *(Optional)* In **Authentication** -> **Providers**, enable the Google provider if you want to support Google OAuth login.

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to experience Sprint!

---

## 🛠️ Supabase Schema

The complete database migration is located at [`supabase/schema.sql`](supabase/schema.sql).

Tables:
- `profiles`: User information, avatar, preferences (`auth.users` trigger)
- `lists`: Custom task lists with colors and positions
- `tasks`: Task details (list, priority, due date, status, position)
- `tags` & `task_tags`: Multi-tag categorization

---

## 🚢 Deploy to Vercel

Sprint is configured for seamless deployment to Vercel:

```bash
npm run build
npx vercel --prod
```

Make sure to add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your Vercel Project Environment Variables.

---

## 📄 License
MIT License. Built with passion for high-velocity teams.