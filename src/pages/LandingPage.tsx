import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Shield, Zap, Calendar } from 'lucide-react';
import { WindowChromeDots } from '../components/layout/WindowChrome';

interface LandingPageProps {
  onNavigateLogin: () => void;
  onNavigateSignup: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateLogin,
  onNavigateSignup,
}) => {
  return (
    <div className="min-h-screen bg-[#08090c] text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-white">
      {/* Top Subtle Border */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Navigation */}
      <header className="h-14 border-b border-white/[0.06] flex items-center justify-between px-6 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <span className="w-5 h-5 rounded bg-white text-black flex items-center justify-center font-mono font-bold text-xs">
            S
          </span>
          <span className="text-sm font-semibold tracking-tight text-white">
            Sprint
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateLogin}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Sign in
          </button>
          <button
            onClick={onNavigateSignup}
            className="px-3 py-1.5 rounded-md bg-white text-black hover:bg-slate-200 text-xs font-medium transition-colors cursor-pointer"
          >
            Get started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center px-6 max-w-5xl mx-auto w-full pt-20 pb-28 text-center">
        {/* Release Pill */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-slate-400 mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="font-mono text-[11px] text-slate-300">Sprint 1.0</span>
          <span className="text-slate-600">·</span>
          <span>Multi-list task engine</span>
        </motion.div>

        {/* Confident Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-3xl leading-[1.08] mb-6"
        >
          The issue board built for high-velocity teams.
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-base text-slate-400 max-w-xl mb-10 leading-relaxed"
        >
          Combines the speed of Google Tasks with the craft of modern software boards. Multi-list workflows, weekly calendar scheduling, and instant real-time sync.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex items-center justify-center gap-3 mb-16"
        >
          <button
            onClick={onNavigateSignup}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black hover:bg-slate-200 font-medium text-xs shadow-xs transition-colors cursor-pointer"
          >
            <span>Start using Sprint</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onNavigateLogin}
            className="px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 font-medium text-xs border border-white/[0.08] transition-colors cursor-pointer"
          >
            Live Demo
          </button>
        </motion.div>

        {/* Realistic High-Density Product Mockup Window */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-4xl rounded-xl linear-surface overflow-hidden text-left shadow-2xl border border-white/[0.08]"
        >
          {/* Window Chrome Header */}
          <div className="h-9 px-3 bg-[#0d0e14] border-b border-white/[0.06] flex items-center justify-between">
            <WindowChromeDots />
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
              <span>sprint.app</span>
              <span>/</span>
              <span>workspace</span>
            </div>
            <div className="w-10" />
          </div>

          {/* Sub Navigation Bar inside Mockup */}
          <div className="px-4 py-2 border-b border-white/[0.05] bg-[#0a0b10] flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-white">Sprint Core</span>
              <span className="text-slate-600">/</span>
              <span>Board</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
              <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">⌘K</span>
              <span>Command Menu</span>
            </div>
          </div>

          {/* Mock Board Columns */}
          <div className="p-4 bg-[#08090c] grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Column 1 */}
            <div className="rounded-lg bg-[#0d0e14] border border-white/[0.06] p-2.5 space-y-2">
              <div className="flex items-center justify-between px-1 pb-1 border-b border-white/[0.04]">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span className="text-xs font-semibold text-slate-300">Backlog</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">2</span>
              </div>
              <div className="space-y-1.5">
                <div className="p-2 rounded bg-[#12141c] border border-white/[0.05] text-xs">
                  <div className="text-slate-200">Supabase RLS policy audit</div>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500 font-mono">
                    <span className="text-rose-400">High</span>
                    <span>·</span>
                    <span>Due tomorrow</span>
                  </div>
                </div>
                <div className="p-2 rounded bg-[#12141c] border border-white/[0.05] text-xs">
                  <div className="text-slate-200">API rate limiter middleware</div>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500 font-mono">
                    <span className="text-blue-400">Low</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="rounded-lg bg-[#0d0e14] border border-white/[0.06] p-2.5 space-y-2">
              <div className="flex items-center justify-between px-1 pb-1 border-b border-white/[0.04]">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5e6ad2]" />
                  <span className="text-xs font-semibold text-slate-300">In Progress</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">2</span>
              </div>
              <div className="space-y-1.5">
                <div className="p-2 rounded bg-[#12141c] border border-white/[0.05] text-xs">
                  <div className="text-slate-200">Weekly drag-to-reschedule calendar</div>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500 font-mono">
                    <span className="text-amber-400">Med</span>
                    <span>·</span>
                    <span>Today</span>
                  </div>
                </div>
                <div className="p-2 rounded bg-[#12141c] border border-white/[0.05] text-xs">
                  <div className="text-slate-200">Multi-tab realtime sync channel</div>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500 font-mono">
                    <span className="text-rose-400">High</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3 */}
            <div className="rounded-lg bg-[#0d0e14] border border-white/[0.06] p-2.5 space-y-2">
              <div className="flex items-center justify-between px-1 pb-1 border-b border-white/[0.04]">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-semibold text-slate-300">Completed</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">1</span>
              </div>
              <div className="space-y-1.5">
                <div className="p-2 rounded bg-[#101218]/50 border border-white/[0.03] text-xs opacity-60">
                  <div className="line-through text-slate-400">Vite 8 production pipeline</div>
                  <div className="flex items-center gap-1 mt-1.5 text-[10px] text-emerald-400">
                    <Check className="w-3 h-3" />
                    <span>Done</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mt-20 text-left">
          <div className="p-5 rounded-xl linear-surface space-y-2">
            <Zap className="w-4 h-4 text-slate-300" />
            <h3 className="text-xs font-semibold text-white">Keyboard Driven</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Global ⌘K command palette, C for new issue, and inline row creation keep you typing at full speed.
            </p>
          </div>

          <div className="p-5 rounded-xl linear-surface space-y-2">
            <Calendar className="w-4 h-4 text-slate-300" />
            <h3 className="text-xs font-semibold text-white">Calendar Scheduling</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              7-day interactive timeline with drag-and-drop rescheduling and live time indicator lines.
            </p>
          </div>

          <div className="p-5 rounded-xl linear-surface space-y-2">
            <Shield className="w-4 h-4 text-slate-300" />
            <h3 className="text-xs font-semibold text-white">Supabase Postgres & RLS</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Direct cloud PostgreSQL persistence with Row Level Security and sub-second multi-tab sync.
            </p>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-white/[0.06] py-6 text-center text-xs text-slate-500 font-mono">
        Sprint. Engineering velocity.
      </footer>
    </div>
  );
};
