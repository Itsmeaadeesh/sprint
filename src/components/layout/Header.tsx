import React, { useState } from 'react';
import { Plus, Share2, Search, ChevronRight, Settings, LogOut, Command } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { WindowChromeDots } from './WindowChrome';
import { ThemeToggle } from '../ui/ThemeToggle';

interface HeaderProps {
  currentView: 'board' | 'settings';
  onNavigateView: (view: 'board' | 'settings') => void;
  onOpenCommandPalette: () => void;
  onOpenQuickAdd: () => void;
  onOpenShareModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigateView,
  onOpenCommandPalette,
  onOpenQuickAdd,
  onOpenShareModal,
}) => {
  const { user, profile, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Avatar resolution: profile avatar_url > Gravatar / Dicebear fallback
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const avatarUrl =
    profile?.avatar_url ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}&backgroundColor=3b82f6`;

  return (
    <header className="h-14 border-b border-white/10 glass-panel sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 bg-[#0d0e11]/80 backdrop-blur-xl">
      {/* Left: Window Chrome Dots + Breadcrumbs */}
      <div className="flex items-center gap-4">
        <WindowChromeDots className="hidden sm:flex" />

        <div className="hidden sm:block w-px h-4 bg-white/10" />

        <div className="flex items-center gap-1.5 text-xs font-medium">
          <button
            onClick={() => onNavigateView('board')}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
              Sprint
            </span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-200 capitalize font-semibold">
            {currentView === 'board' ? 'Board' : 'Settings'}
          </span>
        </div>
      </div>

      {/* Center: "Ask AI or search anything…" bar with ⌘K hint */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-white/20 text-slate-400 hover:text-slate-200 text-xs transition-all shadow-inner cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400 transition-colors" />
            <span>Ask AI or search anything…</span>
          </div>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </button>
      </div>

      {/* Right: Actions (Share, Gradient +, Theme Toggle, Avatar Menu) */}
      <div className="flex items-center gap-2.5">
        {/* Mobile search trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Share Button */}
        <button
          onClick={onOpenShareModal}
          title="Share workspace"
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Gradient "+" Button */}
        <button
          onClick={onOpenQuickAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white font-medium text-xs shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Task</span>
        </button>

        {/* Avatar Menu */}
        <div className="relative ml-1">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-8 h-8 rounded-full ring-2 ring-white/10 hover:ring-blue-500 transition-all overflow-hidden cursor-pointer"
          >
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          </button>

          {showUserMenu && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-full mt-2 w-56 p-1.5 rounded-2xl bg-[#14161d] border border-white/10 shadow-2xl z-50 text-xs backdrop-blur-2xl"
            >
              <div className="px-3 py-2 border-b border-white/5">
                <p className="font-semibold text-white truncate">{displayName}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    onNavigateView('settings');
                    setShowUserMenu(false);
                  }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 text-left transition-colors cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  Settings & Profile
                </button>
              </div>

              <div className="pt-1 border-t border-white/5">
                <button
                  onClick={async () => {
                    setShowUserMenu(false);
                    await signOut();
                  }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 text-left transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
