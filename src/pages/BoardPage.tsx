import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { TabRow } from '../components/layout/TabRow';
import { DashboardWidgets } from '../components/dashboard/DashboardWidgets';
import { BoardView } from '../components/board/BoardView';
import { CalendarView } from '../components/calendar/CalendarView';
import { SettingsPage } from './SettingsPage';
import { QuickAddModal } from '../components/modals/QuickAddModal';
import { CommandPalette } from '../components/modals/CommandPalette';
import { CreateListModal } from '../components/modals/CreateListModal';
import { ShareModal } from '../components/modals/ShareModal';
import { Toast } from '../components/ui/Toast';
import { BoardSkeleton } from '../components/ui/Skeleton';
import { useBoard } from '../contexts/BoardContext';
import { useAuth } from '../contexts/AuthContext';

export const BoardPage: React.FC = () => {
  const { viewMode, loading, toast, dismissToast } = useBoard();
  const { isConfigured } = useAuth();

  const [currentAppView, setCurrentAppView] = useState<'board' | 'settings'>('board');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Modals
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isCreateListOpen, setIsCreateListOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [quickAddDefaultDate, setQuickAddDefaultDate] = useState<string | null>(null);

  // Keyboard shortcut listener for ⌘K and N
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing inside an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setQuickAddDefaultDate(null);
        setIsQuickAddOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleQuickAddForCalendarDate = (dateIso: string) => {
    setQuickAddDefaultDate(dateIso);
    setIsQuickAddOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0d0e11] text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Gradient Glow behind header */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-80 bg-header-glow pointer-events-none -z-10" />

      {/* Configuration Advisory Banner (only if placeholder keys are used in dev) */}
      {!isConfigured && (
        <div className="bg-gradient-to-r from-blue-900/60 to-violet-900/60 border-b border-blue-500/20 px-4 py-2 text-center text-xs text-blue-200 backdrop-blur-md flex items-center justify-center gap-2">
          <span>⚡ Running in local development mode. Plug in Supabase keys in <code>.env</code> to connect live cloud PostgreSQL.</span>
        </div>
      )}

      {/* Top Slim Header */}
      <Header
        currentView={currentAppView}
        onNavigateView={(view) => setCurrentAppView(view)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenQuickAdd={() => {
          setQuickAddDefaultDate(null);
          setIsQuickAddOpen(true);
        }}
        onOpenShareModal={() => setIsShareOpen(true)}
      />

      {/* Main Body Area: Sidebar + Board/Calendar/Settings */}
      <div className="flex-1 flex overflow-hidden">
        {/* Collapsible Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          onCreateList={() => setIsCreateListOpen(true)}
          onNavigateSettings={() => setCurrentAppView('settings')}
        />

        {/* Dynamic Content View with crossfade */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {currentAppView === 'settings' ? (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <SettingsPage onBackToBoard={() => setCurrentAppView('board')} />
              </motion.div>
            ) : (
              <motion.div
                key="board"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                {/* Horizontal Tab Row */}
                <TabRow onCreateList={() => setIsCreateListOpen(true)} />

                {/* Dashboard Summary Widgets */}
                <DashboardWidgets
                  onQuickAdd={() => {
                    setQuickAddDefaultDate(null);
                    setIsQuickAddOpen(true);
                  }}
                />

                {/* Main View: Board vs Calendar with Skeleton Loading */}
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                  {loading ? (
                    <BoardSkeleton />
                  ) : viewMode === 'board' ? (
                    <BoardView onCreateListModalOpen={() => setIsCreateListOpen(true)} />
                  ) : (
                    <CalendarView onQuickAddForDate={handleQuickAddForCalendarDate} />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Modals & Overlays */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        defaultDate={quickAddDefaultDate}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenQuickAdd={() => {
          setQuickAddDefaultDate(null);
          setIsQuickAddOpen(true);
        }}
        onOpenCreateList={() => setIsCreateListOpen(true)}
        onNavigateSettings={() => setCurrentAppView('settings')}
      />

      <CreateListModal
        isOpen={isCreateListOpen}
        onClose={() => setIsCreateListOpen(false)}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />

      {/* Toast Notification Container */}
      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  );
};
