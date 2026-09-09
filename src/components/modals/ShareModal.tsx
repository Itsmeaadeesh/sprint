import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Copy, Check, Shield } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = window.location.origin;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-md editorial-card shadow-2xl p-4 sm:p-6 relative bg-[var(--bg)] text-[var(--fg)]"
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[var(--line)]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 border-2 border-[var(--line)] bg-[var(--surface)] flex items-center justify-center text-[var(--accent)]">
                  <Share2 className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-black uppercase tracking-wider text-[var(--fg)]">
                    Share Workspace
                  </h3>
                  <p className="text-[10px] font-bold uppercase text-[var(--muted)]">Access Link Distribution</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 border border-transparent hover:border-[var(--line)] text-[var(--muted)] hover:text-[var(--fg)] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                  Workspace Permanent URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="editorial-input flex-1 text-xs select-all bg-[var(--surface)]"
                  />
                  <button
                    onClick={handleCopy}
                    className="editorial-btn-secondary flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500 stroke-[3]" /> : <Copy className="w-4 h-4 stroke-[2.5]" />}
                    <span>{copied ? 'COPIED' : 'COPY'}</span>
                  </button>
                </div>
              </div>

              <div className="p-4 border-2 border-[var(--line)] bg-[var(--surface)] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--fg)]">
                  <Shield className="w-4 h-4 text-[var(--accent)] stroke-[2.5]" />
                  <span>Row Level Security (RLS) Active</span>
                </div>
                <p className="text-[11px] text-[var(--muted)] leading-relaxed">
                  Your tasks and lists are protected by Supabase Row-Level Security policies. Only authorized account holders can read or modify data.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end pt-4 mt-4 border-t-2 border-[var(--line)]">
              <button
                onClick={onClose}
                className="editorial-btn-primary"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
