import React, { useState, useEffect, useRef } from 'react';
import { Plus, Share2, Search, Settings, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ThemeToggle } from '../ui/ThemeToggle';

interface HeaderProps {
  currentView: 'board' | 'settings';
  onNavigateView: (view: 'board' | 'settings') => void;
  onOpenCommandPalette: () => void;
  onOpenQuickAdd: () => void;
  onOpenShareModal: () => void;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigateView,
  onOpenCommandPalette,
  onOpenQuickAdd,
  onOpenShareModal,
  onToggleSidebar,
}) => {
  const { user, profile, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showUserMenu]);

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const avatarUrl =
    profile?.avatar_url ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}&backgroundColor=27272a&textColor=ffffff`;

  return (
    <header className="min-h-[52px] sm:min-h-[56px] pt-[env(safe-area-inset-top)] editorial-border-b-thick bg-[var(--bg)] sticky top-0 z-30 flex items-center justify-between px-2.5 sm:px-6 select-none font-mono">
      {/* Left: Workspace / App Logo */}
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            title="Toggle sidebar"
            aria-label="Open sidebar navigation"
            className="md:hidden p-2 editorial-border text-[var(--fg)] hover:bg-[var(--hover-bg)] cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center flex-shrink-0"
          >
            <Menu className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}

        <button
          onClick={() => onNavigateView('board')}
          className="flex items-center gap-1.5 text-[var(--fg)] cursor-pointer group bg-transparent border-0 flex-shrink-0"
        >
          <span className="font-heading text-base sm:text-lg tracking-tight">SPRINT⚡</span>
        </button>

        <span className="text-[var(--muted-3)] hidden xs:inline">/</span>

        <span className="text-[10px] sm:text-xs uppercase tracking-wider font-bold text-[var(--muted-2)] truncate max-w-[60px] sm:max-w-none hidden xs:inline">
          {currentView === 'board' ? 'Board' : 'Settings'}
        </span>
      </div>

      {/* Center: Search / Jump to bar (Desktop) */}
      <div className="flex-1 max-w-sm mx-4 hidden md:block">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3 py-1.5 editorial-border bg-[var(--input-bg)] text-[var(--muted)] hover:text-[var(--fg)] text-xs transition-colors cursor-pointer min-h-[38px]"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[var(--muted-3)]" />
            <span className="text-[11px] uppercase tracking-wider">Search or jump to...</span>
          </div>
          <div className="px-1.5 py-0.5 border border-[var(--line)] text-[10px] font-bold">
            ⌘K
          </div>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
        {/* Mobile search */}
        <button
          onClick={onOpenCommandPalette}
          aria-label="Search"
          className="md:hidden p-2 editorial-border text-[var(--fg)] hover:bg-[var(--hover-bg)] cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Share (Desktop & Tablet) */}
        <button
          onClick={onOpenShareModal}
          title="Share workspace"
          aria-label="Share workspace"
          className="hidden sm:flex p-2 editorial-border text-[var(--fg)] hover:bg-[var(--hover-bg)] transition-colors cursor-pointer min-w-[38px] min-h-[38px] items-center justify-center"
        >
          <Share2 className="w-4 h-4" />
        </button>

        <ThemeToggle />

        {/* Primary Action: Editorial Button */}
        <button
          onClick={onOpenQuickAdd}
          aria-label="New Issue"
          className="editorial-btn-primary py-2 px-2.5 sm:py-1.5 sm:px-3 text-xs min-h-[38px] min-w-[38px] flex items-center justify-center"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span className="hidden sm:inline">New Issue</span>
        </button>

        {/* User Avatar Menu */}
        <div ref={userMenuRef} className="relative ml-0.5">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-label="User account menu"
            className="w-9 h-9 sm:w-8 sm:h-8 editorial-border overflow-hidden cursor-pointer block"
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
              className="absolute right-0 top-full mt-2 w-56 editorial-card editorial-border-thick text-xs z-50 p-2 font-mono shadow-2xl"
            >
              <div className="px-2 py-2 editorial-border-b">
                <p className="font-bold text-[var(--fg)] truncate uppercase text-xs">{displayName}</p>
                <p className="text-[10px] text-[var(--muted-3)] truncate mt-0.5">{user?.email}</p>
              </div>

              <div className="py-1">
                {/* Mobile-accessible share option */}
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenShareModal();
                  }}
                  className="sm:hidden flex items-center gap-2.5 w-full px-2 py-2.5 text-[var(--fg)] hover:bg-[var(--hover-bg)] text-left font-bold uppercase text-[11px] tracking-wider cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Share Workspace
                </button>

                <button
                  onClick={() => {
                    onNavigateView('settings');
                    setShowUserMenu(false);
                  }}
                  className="flex items-center gap-2.5 w-full px-2 py-2.5 text-[var(--fg)] hover:bg-[var(--hover-bg)] text-left font-bold uppercase text-[11px] tracking-wider cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Settings
                </button>
              </div>

              <div className="pt-1 editorial-border-t">
                <button
                  onClick={async () => {
                    setShowUserMenu(false);
                    await signOut();
                  }}
                  className="flex items-center gap-2.5 w-full px-2 py-2.5 text-[var(--accent)] hover:bg-[var(--hover-bg)] text-left font-bold uppercase text-[11px] tracking-wider cursor-pointer"
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
