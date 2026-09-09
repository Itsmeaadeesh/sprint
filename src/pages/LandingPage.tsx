import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2, Shield, Zap, Calendar } from 'lucide-react';
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
    <div className="min-h-screen bg-[#0d0e11] text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Gradient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-header-glow pointer-events-none -z-10" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-60 -left-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Navigation Bar */}
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 sm:px-12 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-violet-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
            ⚡
          </div>
          <span className="text-lg font-extrabold tracking-tight text-white">
            Sprint
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onNavigateLogin}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Log in
          </button>
          <button
            onClick={onNavigateSignup}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white text-xs font-semibold shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Sign up free</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center px-6 max-w-6xl mx-auto w-full pt-16 pb-24 text-center">
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300 mb-8 backdrop-blur-md shadow-inner"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Combining Google Tasks velocity with Linear-grade polish</span>
        </motion.div>

        {/* Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1] mb-6"
        >
          High-velocity project boards for{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400">
            modern execution.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg text-slate-400 max-w-2xl mb-10 leading-relaxed"
        >
          Organize across multi-list workflows, drag-and-drop seamlessly with fluid physics, schedule in a weekly calendar, and sync changes across tabs in real-time.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          <button
            onClick={onNavigateSignup}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white font-semibold text-sm shadow-xl shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Start using Sprint free</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onNavigateLogin}
            className="px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 font-semibold text-sm border border-white/10 transition-all cursor-pointer"
          >
            Live Demo Login
          </button>
        </motion.div>

        {/* Window Chrome Mockup Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="w-full max-w-5xl rounded-3xl glass-card border border-white/10 p-2 shadow-2xl relative overflow-hidden group"
        >
          {/* Subtle Outer Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-violet-500/20 rounded-3xl blur-2xl -z-10 group-hover:from-blue-500/30 group-hover:to-violet-500/30 transition-all" />

          {/* Window Chrome Top Header */}
          <div className="h-10 px-4 rounded-t-2xl bg-white/[0.03] border-b border-white/5 flex items-center justify-between">
            <WindowChromeDots />
            <div className="text-[11px] font-mono text-slate-500">
              sprint.app/board
            </div>
            <div className="w-12" />
          </div>

          {/* Inner Mockup UI */}
          <div className="p-6 bg-[#0d0e11]/80 rounded-b-2xl grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {/* Mock List 1: Product Launch */}
            <div className="p-4 rounded-2xl glass-card border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="text-xs font-bold text-white">Q4 Product Launch</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-slate-400 font-mono">
                  3
                </span>
              </div>
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs text-slate-200">
                  <div className="w-4 h-4 rounded-full border border-blue-400 bg-blue-500/20 flex items-center justify-center text-white">
                    <CheckCircle2 className="w-3 h-3 text-blue-400" />
                  </div>
                  <span className="line-through text-slate-500">Design token primitives</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs text-slate-200">
                  <div className="w-4 h-4 rounded-full border border-white/30" />
                  <span>Interactive weekly calendar</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs text-slate-200">
                  <div className="w-4 h-4 rounded-full border border-white/30" />
                  <span>Real-time multi-tab sync</span>
                </div>
              </div>
            </div>

            {/* Mock List 2: Growth Engine */}
            <div className="p-4 rounded-2xl glass-card border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                  <span className="text-xs font-bold text-white">Growth & Marketing</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-slate-400 font-mono">
                  2
                </span>
              </div>
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs text-slate-200">
                  <div className="w-4 h-4 rounded-full border border-white/30" />
                  <span>Write product changelog</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs text-slate-200">
                  <div className="w-4 h-4 rounded-full border border-white/30" />
                  <span>Record feature walkthrough</span>
                </div>
              </div>
            </div>

            {/* Mock List 3: Personal Focus */}
            <div className="p-4 rounded-2xl glass-card border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-white">Personal Focus</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-slate-400 font-mono">
                  1
                </span>
              </div>
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs text-slate-200">
                  <div className="w-4 h-4 rounded-full border border-white/30" />
                  <span>Review weekly achievements</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mt-24 text-left">
          <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-3 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Zero Friction Speed</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Global ⌘K command palette, inline quick-add, keyboard navigation, and instant undo actions keep you in flow state.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-3 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Board & Weekly Calendar</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Switch effortlessly between horizontal multi-list columns and a 7-day calendar view with drag-to-reschedule support.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-3 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Supabase Realtime & RLS</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Backed by PostgreSQL with Row Level Security. Changes reflect instantly across multiple tabs and devices.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-500">
        <p>© 2026 Sprint. Engineered for velocity.</p>
      </footer>
    </div>
  );
};
