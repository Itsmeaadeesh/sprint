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

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const avatarUrl =
    profile?.avatar_url ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}&backgroundColor=27272a&textColor=ffffff`;

  return (
    <header className="h-12 border-b border-white/[0.08] bg-[#0c0d12]/95 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-5 backdrop-blur-md">
      {/* Left: Window Dots + Workspace Breadcrumbs */}
      <div className="flex items-center gap-3.5">
        <WindowChromeDots className="hidden sm:flex" />

        <div className="hidden sm:block w-px h-3.5 bg-white/10" />

        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => onNavigateView('board')}
            className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer group"
          >
            <span className="w-5 h-5 rounded-md bg-white/10 group-hover:bg-white/15 border border-white/10 flex items-center justify-center font-mono font-bold text-[11px] text-white">
              S
            </span>
            <span className="font-semibold text-slate-100 tracking-tight">
              Sprint
            </span>
          </button>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className="text-slate-400 capitalize font-medium">
            {currentView === 'board' ? 'Board' : 'Settings'}
          </span>
        </div>
      </div>

      {/* Center: Raycast / Linear style command bar */}
      <div className="flex-1 max-w-sm mx-4 hidden md:block">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] hover:border-white/[0.12] text-slate-400 hover:text-slate-200 text-xs transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
            <span className="text-[11px] text-slate-400">Search or jump to...</span>
          </div>
          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Mobile search */}
        <button
          onClick={onOpenCommandPalette}
          className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Share */}
        <button
          onClick={onOpenShareModal}
          title="Share workspace"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>

        <ThemeToggle />

        {/* Primary Action Button (Linear Style: crisp, deliberate) */}
        <button
          onClick={onOpenQuickAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-black hover:bg-slate-100 font-medium text-xs shadow-xs transition-all active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="hidden sm:inline">New Issue</span>
        </button>

        {/* User Avatar Menu */}
        <div className="relative ml-1">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-7 h-7 rounded-full ring-1 ring-white/10 hover:ring-white/30 transition-all overflow-hidden cursor-pointer"
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
              className="absolute right-0 top-full mt-2 w-52 p-1 rounded-xl linear-surface text-xs z-50 shadow-2xl"
            >
              <div className="px-3 py-2 border-b border-white/[0.06]">
                <p className="font-medium text-white truncate">{displayName}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    onNavigateView('settings');
                    setShowUserMenu(false);
                  }}
                  className="flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 text-left transition-colors cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  Settings
                </button>
              </div>

              <div className="pt-1 border-t border-white/[0.06]">
                <button
                  onClick={async () => {
                    setShowUserMenu(false);
                    await signOut();
                  }}
                  className="flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 text-left transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
