import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';

export const ReloadPrompt: React.FC = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ', r);
    },
    onRegisterError(error) {
      console.error('SW registration error', error);
    },
  });

  const close = () => {
    setNeedRefresh(false);
  };

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 p-4 bg-[var(--bg)] text-[var(--fg)] editorial-border-thick shadow-2xl font-mono text-xs max-w-sm">
      <div className="flex-1">
        <div className="font-heading text-xs uppercase tracking-wider text-[var(--accent)] font-bold mb-1">
          Update Available
        </div>
        <div className="text-[11px] text-[var(--muted)]">
          A new version of Sprint is ready. Reload to update.
        </div>
      </div>

      <button
        onClick={() => updateServiceWorker(true)}
        className="editorial-btn-primary flex items-center gap-1.5 py-1.5 px-3 text-[11px] cursor-pointer"
      >
        <RefreshCw className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>Reload</span>
      </button>

      <button
        onClick={close}
        title="Dismiss"
        className="p-1 text-[var(--muted)] hover:text-[var(--fg)] transition-colors cursor-pointer border border-transparent hover:border-[var(--line)]"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
