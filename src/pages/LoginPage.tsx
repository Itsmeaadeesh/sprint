import React, { useState } from 'react';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginPageProps {
  onNavigateSignup: () => void;
  onNavigateForgotPassword: () => void;
  onSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateSignup,
  onNavigateForgotPassword,
  onSuccess,
}) => {
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    const { error: authError } = await signInWithEmail(email, password);
    setLoading(false);

    if (authError) {
      setError(authError.message || 'Invalid email or password.');
    } else {
      onSuccess();
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    const { error: authError } = await signInWithGoogle();
    setGoogleLoading(false);

    if (authError) {
      setError(authError.message || 'Google sign-in failed.');
    } else {
      onSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex flex-col font-mono selection:bg-[var(--accent)] selection:text-[var(--bg)]">
      {/* Top Bar */}
      <nav className="flex items-center justify-between px-4 sm:px-10 py-4 sm:py-5 editorial-border-b-thick">
        <div className="font-heading text-lg tracking-tight">SPRINT⚡</div>
        <div className="flex items-center gap-4 text-xs">
          <button
            onClick={onNavigateSignup}
            className="text-[var(--fg)] uppercase tracking-wider font-bold hover:underline cursor-pointer bg-transparent border-0"
          >
            Create account
          </button>
        </div>
      </nav>

      {/* Main Login Card */}
      <div className="flex-1 flex items-center justify-center p-3 sm:p-8">
        <div className="w-full max-w-md bg-[var(--card-bg)] editorial-border-thick p-5 sm:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="text-[11px] uppercase tracking-widest text-[var(--accent)] font-bold mb-2">
              Authentication
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl uppercase tracking-tight text-[var(--fg)]">
              Sign In
            </h1>
            <p className="text-xs text-[var(--muted)] mt-2">
              Enter your credentials to access your task board.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-3 bg-[var(--bg)] border-2 border-[var(--accent)] text-[var(--accent)] text-xs flex items-center gap-2.5 font-bold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            type="button"
            className="w-full py-3 px-4 editorial-border font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-3 transition-colors mb-6 hover:bg-[var(--hover-bg)] cursor-pointer text-[var(--fg)]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
              />
            </svg>
            <span>{googleLoading ? 'Connecting...' : 'Sign in with Google'}</span>
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 border-t-2 border-[var(--line)]" />
            <span className="text-[10px] uppercase font-bold text-[var(--muted-3)] tracking-widest">
              or with email
            </span>
            <div className="flex-1 border-t-2 border-[var(--line)]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-[var(--muted)] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[var(--muted-3)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2.5 editorial-input"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs uppercase tracking-wider font-bold text-[var(--muted)]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={onNavigateForgotPassword}
                  className="text-[11px] uppercase tracking-wider text-[var(--muted-3)] hover:text-[var(--accent)] font-bold cursor-pointer"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[var(--muted-3)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2.5 editorial-input"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 editorial-btn-primary cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In →'}</span>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t-2 border-[var(--line)] text-center text-xs text-[var(--muted)]">
            Don't have an account?{' '}
            <button
              onClick={onNavigateSignup}
              className="text-[var(--fg)] hover:text-[var(--accent)] font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
