import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ResetPasswordPageProps {
  onNavigateLogin: () => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onNavigateLogin }) => {
  const { resetPasswordForEmail, updatePassword } = useAuth();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
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
    <div className="min-h-screen bg-[#08090c] text-slate-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-sm rounded-xl linear-surface p-7 shadow-2xl"
      >
        <button
          onClick={onNavigateLogin}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to login</span>
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-8 h-8 rounded-md bg-white text-black flex items-center justify-center font-mono font-bold text-xs mb-3 shadow-xs">
            S
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">Reset Password</h2>
          <p className="text-xs text-slate-400 mt-1">
            {isResetTokenPresent
              ? 'Enter your new password below'
              : 'Enter your email to receive a recovery link'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {isResetTokenPresent ? (
          <form onSubmit={handleUpdatePassword} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
              <span>{loading ? 'Updating...' : 'Set New Password'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleRequestReset} className="space-y-3.5">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg bg-white text-black font-medium text-xs hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer mt-2 shadow-xs"
            >
              <span>{loading ? 'Sending link...' : 'Send Recovery Link'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
