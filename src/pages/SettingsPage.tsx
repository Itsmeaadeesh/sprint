import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Lock,
  Moon,
  Sun,
  Bell,
  Trash2,
  Save,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsPageProps {
  onBackToBoard: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBackToBoard }) => {
  const { user, profile, updateProfile, updatePassword, deleteAccount } = useAuth();
  const { theme, setTheme } = useTheme();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [emailNotifications, setEmailNotifications] = useState(
    profile?.email_notifications ?? true
  );

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSavingProfile(true);

    const { error: err } = await updateProfile({
      full_name: fullName.trim(),
      avatar_url: avatarUrl.trim() || null,
      email_notifications: emailNotifications,
    });

    setSavingProfile(false);
    if (err) {
      setError(err.message || 'Failed to update profile');
    } else {
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSavingPassword(true);
    const { error: err } = await updatePassword(newPassword);
    setSavingPassword(false);

    if (err) {
      setError(err.message || 'Failed to update password');
    } else {
      setPasswordSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    await deleteAccount();
    setDeleting(false);
    setShowDeleteModal(false);
  };

  const avatarDisplay =
    avatarUrl ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      fullName || user?.email || 'User'
    )}&backgroundColor=3b82f6`;

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full">
      {/* Top Breadcrumb Back */}
      <button
        onClick={onBackToBoard}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Board</span>
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings & Preferences</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your profile, account security, and workspace notifications
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* 1. Profile Section */}
        <section className="p-6 rounded-3xl glass-card border border-white/10 shadow-xl">
          <h2 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-400" />
            Profile Details
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            Your name and avatar appear across your board and shared workspaces
          </p>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            {/* Avatar Preview & URL */}
            <div className="flex items-center gap-4 pb-4 border-b border-white/5">
              <div className="relative w-16 h-16 rounded-full ring-2 ring-white/10 overflow-hidden bg-[#16181f]">
                <img
                  src={avatarDisplay}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 rounded-xl glass-input"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Supports any image link or leave empty to use auto-generated initials
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl glass-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl glass-input bg-white/5 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Email Notifications Toggle */}
            <div className="pt-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-violet-400" />
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">
                      Email notifications for due dates
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Receive morning digest when tasks are approaching deadlines
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
                />
              </label>
            </div>

            <div className="flex items-center justify-between pt-2">
              {profileSuccess ? (
                <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Profile changes saved
                </span>
              ) : (
                <span />
              )}

              <button
                type="submit"
                disabled={savingProfile}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingProfile ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </div>
          </form>
        </section>

        {/* 2. Theme Preferences */}
        <section className="p-6 rounded-3xl glass-card border border-white/10 shadow-xl">
          <h2 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <Moon className="w-4 h-4 text-indigo-400" />
            Appearance & Theme
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Choose your preferred workspace aesthetic (Dark is default)
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-sm">
            <button
              onClick={() => setTheme('dark')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                theme === 'dark'
                  ? 'bg-blue-500/10 border-blue-500/40 text-white ring-1 ring-blue-500/40'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <Moon className="w-4 h-4 text-blue-400" />
              <div>
                <div className="text-xs font-bold">Dark Canvas</div>
                <div className="text-[10px] text-slate-500">#0d0e11 near-black</div>
              </div>
            </button>

            <button
              onClick={() => setTheme('light')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                theme === 'light'
                  ? 'bg-blue-500/10 border-blue-500/40 text-white ring-1 ring-blue-500/40'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-xs font-bold">Light Canvas</div>
                <div className="text-[10px] text-slate-500">Clean slate</div>
              </div>
            </button>
          </div>
        </section>

        {/* 3. Password & Security */}
        <section className="p-6 rounded-3xl glass-card border border-white/10 shadow-xl">
          <h2 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            Security & Password
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            Ensure your account is using a secure password
          </p>

          <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl glass-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl glass-input"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {passwordSuccess ? (
                <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Password updated
                </span>
              ) : (
                <span />
              )}

              <button
                type="submit"
                disabled={savingPassword || !newPassword}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                {savingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </section>

        {/* 4. Danger Zone: Delete Account */}
        <section className="p-6 rounded-3xl glass-card border border-rose-500/20 bg-rose-500/[0.02] shadow-xl">
          <h2 className="text-sm font-bold text-rose-400 mb-1 flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-rose-400" />
            Danger Zone
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Permanently delete your account and all associated lists, tasks, and data. This action is irreversible.
          </p>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            Delete Account
          </button>
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-3xl glass-card border border-rose-500/30 p-6 shadow-2xl relative"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Account?</h3>
                <p className="text-xs text-rose-300">All data will be permanently wiped</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              Are you sure you want to delete your Sprint account? All your lists, tasks, and profile settings will be deleted immediately.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete Everything'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
