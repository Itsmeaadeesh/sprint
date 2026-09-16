import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from '../components/ui/ThemeToggle';

interface ResetPasswordPageProps {
  onNavigateLogin: () => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onNavigateLogin }) => {
  const { resetPasswordForEmail, updatePassword } = useAuth();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Detect if user landed with hash #access_token= from password reset email
  const isResetTokenPresent = window.location.hash.includes('type=recovery') || window.location.pathname.includes('reset');

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    const { error: resetErr } = await resetPasswordForEmail(email);
    setLoading(false);

    if (resetErr) {
      setError(resetErr.message || 'Failed to send password reset email.');
    } else {
      setSuccessMessage('Password reset link sent! Please check your email inbox.');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const { error: updateErr } = await updatePassword(newPassword);
    setLoading(false);

    if (updateErr) {
      setError(updateErr.message || 'Failed to update password.');
    } else {
      setSuccessMessage('Password updated successfully! You can now log in.');
      setTimeout(() => onNavigateLogin(), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex flex-col font-mono selection:bg-[var(--accent)] selection:text-[var(--bg)] pt-[env(safe-area-inset-top)] pb-[calc(env(safe-area-inset-bottom)+1rem)]">
      {/* Top Bar */}
      <nav className="flex items-center justify-between px-4 sm:px-10 py-3 sm:py-5 editorial-border-b-thick">
        <div className="font-heading text-lg tracking-tight">SPRINT⚡</div>
        <div className="flex items-center gap-2 sm:gap-4 text-xs">
          <ThemeToggle />
          <button
            onClick={onNavigateLogin}
            className="text-[var(--fg)] uppercase tracking-wider font-bold hover:underline cursor-pointer bg-transparent border-0 min-h-[44px] px-2 flex items-center"
          >
            Back to login
          </button>
        </div>
      </nav>

      {/* Main Card */}
      <div className="flex-1 flex items-center justify-center p-3 sm:p-8">
        <div className="w-full max-w-md bg-[var(--card-bg)] editorial-border-thick p-4 sm:p-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[var(--accent)] font-bold mb-2">
              Account Recovery
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl uppercase tracking-tight text-[var(--fg)]">
              Reset Password
            </h1>
            <p className="text-xs text-[var(--muted)] mt-2">
              {isResetTokenPresent
                ? 'Enter your new password below.'
                : 'Enter your email to receive a recovery link.'}
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-6 p-3 bg-[var(--bg)] border-2 border-[var(--accent)] text-[var(--accent)] text-xs flex items-center gap-2.5 font-bold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-3 bg-[var(--bg)] border-2 border-[var(--fg)] text-[var(--fg)] text-xs flex items-center gap-2.5 font-bold">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {isResetTokenPresent ? (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-[var(--muted)] mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[var(--muted-3)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    spellCheck={false}
                    className="w-full pl-9 pr-11 py-2.5 editorial-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-0 top-0 bottom-0 w-11 flex items-center justify-center text-[var(--muted)] hover:text-[var(--fg)] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 editorial-btn-primary cursor-pointer disabled:opacity-50 min-h-[44px] flex items-center justify-center"
              >
                <span>{loading ? 'Updating...' : 'Set New Password →'}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-[var(--muted)] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[var(--muted-3)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2.5 editorial-input"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 editorial-btn-primary cursor-pointer disabled:opacity-50 min-h-[44px] flex items-center justify-center"
              >
                <span>{loading ? 'Sending Link...' : 'Send Recovery Link →'}</span>
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="mt-6 sm:mt-8 pt-6 border-t-2 border-[var(--line)] text-center text-xs text-[var(--muted)]">
            Remember your credentials?{' '}
            <button
              onClick={onNavigateLogin}
              className="text-[var(--fg)] hover:text-[var(--accent)] font-bold uppercase tracking-wider transition-colors cursor-pointer py-1 px-1 inline-flex items-center"
            >
              Back to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
