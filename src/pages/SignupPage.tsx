import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SignupPageProps {
  onNavigateLogin: () => void;
  onSuccess: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({
  onNavigateLogin,
  onSuccess,
}) => {
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const { error: authError } = await signUpWithEmail(email, password, fullName.trim());
    setLoading(false);

    if (authError) {
      setError(authError.message || 'Signup failed. Please try again.');
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
          <h2 className="text-lg font-bold text-white tracking-tight">Create your account</h2>
          <p className="text-xs text-slate-400 mt-1">
            Start organizing your tasks with high velocity
          </p>
        </div>

        {/* Inline Error Alert */}
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
          <span>{googleLoading ? 'Connecting...' : 'Sign up with Google'}</span>
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex-1 border-t border-white/[0.08]" />
          <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
            or with email
          </span>
          <div className="flex-1 border-t border-white/[0.08]" />
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Aadeesh Jain"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 rounded-lg linear-input text-xs placeholder:text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 rounded-lg linear-input text-xs placeholder:text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-9 pr-3 py-2 rounded-lg linear-input text-xs placeholder:text-slate-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-white text-black font-medium text-xs hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer mt-2 shadow-xs"
          >
            <span>{loading ? 'Creating account...' : 'Create Account'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Footer Link */}
        <p className="mt-5 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <button
            onClick={onNavigateLogin}
            className="text-slate-300 hover:text-white font-medium transition-colors cursor-pointer"
          >
            Sign in
          </button>
        </p>
      </motion.div>
    </div>
  );
};
