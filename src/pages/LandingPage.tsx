import React, { useState } from 'react';
import { ThemeToggle } from '../components/ui/ThemeToggle';

interface LandingPageProps {
  onNavigateLogin: () => void;
  onNavigateSignup: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateLogin,
  onNavigateSignup,
}) => {
  const [demoTasks, setDemoTasks] = useState([
    { id: 1, title: 'Ship the landing page', tag: 'Today', done: false },
    { id: 2, title: 'Fix Supabase env vars', tag: 'Done', done: true },
    { id: 3, title: 'Push to GitHub', tag: 'Next', done: false },
    { id: 4, title: 'Deploy to Vercel', tag: 'Next', done: false },
  ]);

  const toggleDemoTask = (id: number) => {
    setDemoTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex flex-col font-mono selection:bg-[var(--accent)] selection:text-[var(--bg)]">
      {/* Navigation */}
      <nav className="grid grid-cols-2 md:grid-cols-[1fr_auto_1fr] items-center px-6 sm:px-10 py-6 editorial-border-b-thick">
        <div className="font-heading text-xl tracking-tight">
          SPRINT⚡
        </div>
        <div className="hidden md:block text-[11px] uppercase tracking-wider text-center text-[var(--muted-3)]">
          No fluff. Just velocity.
        </div>
        <div className="flex gap-4 justify-self-end text-xs items-center">
          <ThemeToggle />
          <button
            onClick={onNavigateLogin}
            className="text-[var(--fg)] uppercase tracking-wider font-bold hover:underline cursor-pointer bg-transparent border-0"
          >
            Log in
          </button>
          <button
            onClick={onNavigateSignup}
            className="editorial-btn-secondary py-1.5 px-4 font-bold cursor-pointer"
          >
            Sign up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="editorial-border-b-thick">
        <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr]">
          {/* Left Column */}
          <div className="p-5 sm:p-14 lg:p-16 lg:editorial-border-r-thick relative flex flex-col justify-between">
            {/* Spinning Stamp Motif */}
            <div className="hidden sm:flex stamp absolute top-10 right-6 md:right-10 pointer-events-none text-[var(--line)]">
              EST. 2026<br />100% REAL
            </div>

            <div>
              <div className="text-xs uppercase tracking-widest flex items-center gap-2.5 mb-8 text-[var(--muted)]">
                <span className="w-2 h-2 rounded-full bg-[var(--accent)] inline-block" />
                <span>Built for people who ship</span>
              </div>

              <h1 className="text-[clamp(44px,5.4vw,90px)] font-heading leading-[0.92] uppercase tracking-tight text-[var(--fg)] mb-6">
                Stop planning.<br />
                <span
                  style={{
                    WebkitTextStroke: '2px var(--line)',
                    color: 'var(--bg)',
                  }}
                >
                  Start
                </span>{' '}
                <em className="font-serif-italic lowercase font-normal tracking-normal text-[var(--fg)]">
                  doing
                </em>
                <br />
                your <span className="text-[var(--accent)]">damn</span> list.
              </h1>

              <p className="max-w-md text-sm sm:text-base leading-relaxed text-[var(--muted)] mt-6">
                Sprint is a task board with no patience for busywork. Multi-list, real-time, drag-and-drop — built to get out of your way.
              </p>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-0">
              <button
                onClick={onNavigateSignup}
                className="bg-[var(--fg)] text-[var(--bg)] px-6 sm:px-7 py-3.5 sm:py-4 font-bold text-xs sm:text-sm uppercase tracking-wider editorial-border-thick hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-white transition-colors cursor-pointer text-center"
              >
                Get started →
              </button>
              <button
                onClick={onNavigateLogin}
                className="text-[var(--fg)] px-6 py-3.5 sm:py-4 font-bold text-xs sm:text-sm uppercase tracking-wider editorial-border-thick sm:border-l-0 hover:bg-[var(--hover-bg)] transition-colors cursor-pointer text-center"
              >
                See it live
              </button>
            </div>
          </div>

          {/* Right Column: Stats & Live Interactive Demo */}
          <div className="flex flex-col">
            {/* Stat Block */}
            <div className="p-6 sm:p-10 editorial-border-b-thick grid grid-cols-2 gap-4 sm:gap-6 bg-[var(--bg)]">
              <div>
                <div className="font-heading text-3xl sm:text-4xl leading-none text-[var(--fg)]">4.2M</div>
                <div className="text-[11px] uppercase tracking-wider text-[var(--muted-2)] mt-2">Tasks completed</div>
              </div>
              <div>
                <div className="font-heading text-3xl sm:text-4xl leading-none text-[var(--fg)]">0.3s</div>
                <div className="text-[11px] uppercase tracking-wider text-[var(--muted-2)] mt-2">Avg sync time</div>
              </div>
              <div>
                <div className="font-heading text-3xl sm:text-4xl leading-none text-[var(--fg)]">18K</div>
                <div className="text-[11px] uppercase tracking-wider text-[var(--muted-2)] mt-2">Active builders</div>
              </div>
              <div>
                <div className="font-heading text-3xl sm:text-4xl leading-none text-[var(--fg)]">100%</div>
                <div className="text-[11px] uppercase tracking-wider text-[var(--muted-2)] mt-2">Your data, yours</div>
              </div>
            </div>

            {/* Interactive Demo Board */}
            <div className="p-5 sm:p-10 flex-1 flex flex-col justify-center">
              <div className="text-[11px] uppercase tracking-widest text-[var(--muted-3)] mb-4 font-bold">
                Try it — click to check off
              </div>
              <div className="space-y-0 editorial-border">
                {demoTasks.map((task, idx) => (
                  <div
                    key={task.id}
                    onClick={() => toggleDemoTask(task.id)}
                    className={`flex items-center gap-3 p-3.5 text-xs font-mono cursor-pointer transition-colors hover:bg-[var(--hover-bg)] ${
                      idx !== demoTasks.length - 1 ? 'editorial-border-b' : ''
                    } ${task.done ? 'text-[var(--gray-soft)] line-through' : 'text-[var(--fg)]'}`}
                  >
                    <span className={`task-box ${task.done ? 'done' : ''}`} />
                    <span className="flex-1 select-none">{task.title}</span>
                    <span className="task-tag">{task.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee Ticker */}
      <div className="marquee-wrap">
        <div className="marquee">
          <span>No gradients here</span>
          <span>No AI slop</span>
          <span>Just a board that works</span>
          <span>Built different</span>
          <span>Zero rounded corners</span>
          <span>Space Mono precision</span>
          <span>No gradients here</span>
          <span>No AI slop</span>
          <span>Just a board that works</span>
          <span>Built different</span>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 editorial-border-b-thick">
        <div className="p-10 md:p-12 md:editorial-border-r-thick">
          <div className="font-heading text-sm text-[var(--accent)] mb-4">01</div>
          <h3 className="font-heading text-2xl uppercase mb-3 text-[var(--fg)]">Board view</h3>
          <p className="text-xs sm:text-sm leading-relaxed text-[var(--muted)]">
            Multiple lists side by side. Drag tasks between them. No nested menus, no clicking six times to reorder something. Flat, razor-sharp panels designed for speed.
          </p>
        </div>
        <div className="p-10 md:p-12">
          <div className="font-heading text-sm text-[var(--accent)] mb-4">02</div>
          <h3 className="font-heading text-2xl uppercase mb-3 text-[var(--fg)]">Calendar sync</h3>
          <p className="text-xs sm:text-sm leading-relaxed text-[var(--muted)]">
            Every task with a due date shows up on a real weekly grid. Drag to reschedule. It just updates instantly across all connected sessions.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-8 text-center text-xs text-[var(--muted-3)] uppercase tracking-wider">
        Sprint © 2026 — Brutalist Task Engine · No gradients · Pure velocity
      </footer>
    </div>
  );
};
