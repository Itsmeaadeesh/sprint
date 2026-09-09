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
    <div className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto w-full">
      {/* Top Breadcrumb Back */}
      <button
        onClick={onBackToBoard}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Board</span>
      </button>

      <div className="mb-6 pb-4 border-b border-white/[0.07]">
        <h1 className="text-xl font-bold text-white tracking-tight">Settings & Preferences</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your account profile, appearance, and security
        </p>
      </div>

      {error && (
        <div className="mb-6 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* 1. Profile Section */}
        <section className="p-5 rounded-xl linear-surface">
          <h2 className="text-xs font-semibold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-slate-400" />
            Profile Details
          </h2>
          <p className="text-xs text-slate-400 mb-5">
            Your name and avatar appear across your board and tasks
          </p>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            {/* Avatar Preview & URL */}
            <div className="flex items-center gap-4 pb-4 border-b border-white/[0.06]">
              <div className="relative w-12 h-12 rounded-lg border border-white/[0.1] overflow-hidden bg-[#16181f] flex-shrink-0">
                <img
                  src={avatarDisplay}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 rounded-lg linear-input placeholder:text-slate-600"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Leave empty to use automatic initials avatar
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full text-xs px-3 py-1.5 rounded-lg linear-input"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full text-xs px-3 py-1.5 rounded-lg linear-input bg-white/[0.02] text-slate-500 cursor-not-allowed border-white/[0.04]"
                />
              </div>
            </div>

            {/* Email Notifications Toggle */}
            <div className="pt-2">
              <label className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] cursor-pointer hover:bg-white/[0.04] transition-colors">
                <div className="flex items-center gap-3">
                  <Bell className="w-3.5 h-3.5 text-slate-400" />
                  <div>
                    <span className="text-xs font-medium text-slate-200 block">
                      Email notifications for due dates
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Receive alerts when tasks are approaching deadlines
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="w-3.5 h-3.5 accent-white rounded cursor-pointer"
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-black text-xs font-medium hover:bg-slate-200 transition-colors cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingProfile ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </div>
          </form>
        </section>

        {/* 2. Theme Preferences */}
        <section className="p-5 rounded-xl linear-surface">
          <h2 className="text-xs font-semibold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
            <Moon className="w-3.5 h-3.5 text-slate-400" />
            Appearance
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Select interface theme (Dark canvas recommended for high focus)
          </p>

          <div className="grid grid-cols-2 gap-3 max-w-sm">
            <button
              onClick={() => setTheme('dark')}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                theme === 'dark'
                  ? 'bg-white/[0.08] border-white/20 text-white'
                  : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-slate-300" />
              <div>
                <div className="text-xs font-medium">Dark Canvas</div>
                <div className="text-[10px] text-slate-500">#08090c deep matte</div>
              </div>
            </button>

            <button
              onClick={() => setTheme('light')}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                theme === 'light'
                  ? 'bg-white/[0.08] border-white/20 text-white'
                  : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-slate-300" />
              <div>
                <div className="text-xs font-medium">Light Canvas</div>
                <div className="text-[10px] text-slate-500">High contrast light</div>
              </div>
            </button>
          </div>
        </section>

        {/* 3. Password & Security */}
        <section className="p-5 rounded-xl linear-surface">
          <h2 className="text-xs font-semibold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            Security & Password
          </h2>
          <p className="text-xs text-slate-400 mb-5">
            Ensure your account is protected with a strong password
          </p>

          <form onSubmit={handleUpdatePassword} className="space-y-3.5 max-w-sm">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="w-full text-xs px-3 py-1.5 rounded-lg linear-input placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full text-xs px-3 py-1.5 rounded-lg linear-input placeholder:text-slate-600"
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
                className="px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.1] text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                {savingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </section>

        {/* 4. Danger Zone: Delete Account */}
        <section className="p-5 rounded-xl border border-rose-500/20 bg-rose-500/[0.02]">
          <h2 className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1 flex items-center gap-2">
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            Danger Zone
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Permanently delete your account and all associated lists, tasks, and data.
          </p>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-medium transition-colors cursor-pointer"
          >
            Delete Account
          </button>
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm rounded-xl linear-surface border border-rose-500/30 p-5 shadow-2xl relative"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-md bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Delete Account?</h3>
                <p className="text-[11px] text-rose-300">All data will be permanently wiped</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              Are you sure you want to delete your Sprint account? All lists, tasks, and profile settings will be permanently removed.
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                {deleting ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
