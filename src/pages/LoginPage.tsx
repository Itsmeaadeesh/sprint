import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-[#08090c] text-slate-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-sm rounded-xl linear-surface p-7 shadow-2xl"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-8 h-8 rounded-md bg-white text-black flex items-center justify-center font-mono font-bold text-xs mb-3 shadow-xs">
            S
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">Sign in to Sprint</h2>
          <p className="text-xs text-slate-400 mt-1">
            Welcome back to your workspace
          </p>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Google OAuth Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          type="button"
          className="w-full py-2 px-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-200 text-xs font-medium flex items-center justify-center gap-2.5 transition-colors mb-4 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
          <span>{googleLoading ? 'Connecting...' : 'Continue with Google'}</span>
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 border-t border-white/[0.06]" />
          <span className="text-[10px] uppercase font-mono text-slate-500">
            or
          </span>
          <div className="flex-1 border-t border-white/[0.06]" />
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 rounded-lg linear-input text-xs"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-medium text-slate-300">
                Password
              </label>
              <button
                type="button"
                onClick={onNavigateForgotPassword}
                className="text-[10px] text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 rounded-lg linear-input text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-white text-black hover:bg-slate-200 font-medium text-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer mt-1"
          >
            <span>{loading ? 'Signing in...' : 'Sign in'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-400">
          No account yet?{' '}
          <button
            onClick={onNavigateSignup}
            className="text-white hover:underline font-medium transition-colors cursor-pointer"
          >
            Sign up
          </button>
        </p>
      </motion.div>
    </div>
  );
};
