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
    )}&backgroundColor=ff3d00`;

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 max-w-4xl mx-auto w-full bg-[var(--bg)] text-[var(--fg)]">
      {/* Top Breadcrumb Back */}
      <button
        onClick={onBackToBoard}
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)] hover:text-[var(--fg)] transition-colors mb-6 cursor-pointer border-b-2 border-transparent hover:border-[var(--fg)] pb-0.5"
      >
        <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>Back to Board</span>
      </button>

      {/* Header Banner */}
      <div className="mb-8 pb-4 border-b-3 border-[var(--line)] flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] block mb-1">
            System Preferences
          </span>
          <h1 className="font-heading text-2xl md:text-3xl font-black uppercase tracking-tight text-[var(--fg)]">
            Settings &amp; Profile
          </h1>
        </div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
          UID: {user?.id?.slice(0, 8) || 'GUEST'}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-500/10 border-2 border-red-500 text-red-500 text-xs font-bold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-8">
        {/* 1. Profile Section */}
        <section className="editorial-card p-6">
          <div className="flex items-center justify-between pb-3 mb-5 border-b-2 border-[var(--line)]">
            <h2 className="font-heading text-sm font-black uppercase tracking-wider text-[var(--fg)] flex items-center gap-2">
              <User className="w-4 h-4 text-[var(--accent)] stroke-[2.5]" />
              01 / Profile Details
            </h2>
            <span className="text-[10px] uppercase font-bold text-[var(--muted)]">Identity</span>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            {/* Avatar Preview & URL */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-5 border-b border-[var(--line)]">
              <div className="w-16 h-16 border-2 border-[var(--line)] overflow-hidden bg-[var(--surface)] flex-shrink-0">
                <img
                  src={avatarDisplay}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--fg)] mb-1">
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="editorial-input w-full text-xs"
                />
                <span className="text-[10px] uppercase font-bold text-[var(--muted)] mt-1.5 block">
                  Leave empty to use automatic seed initials
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--fg)] mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="editorial-input w-full text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
                  Email Address (Fixed)
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="editorial-input w-full text-xs opacity-60 cursor-not-allowed bg-[var(--surface)]"
                />
              </div>
            </div>

            {/* Email Notifications Toggle */}
            <div className="pt-2">
              <label className="flex items-center justify-between p-4 border-2 border-[var(--line)] bg-[var(--surface)] cursor-pointer hover:border-[var(--accent)] transition-colors">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-[var(--muted)] stroke-[2.5]" />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--fg)] block">
                      Email notifications for due dates
                    </span>
                    <span className="text-[11px] text-[var(--muted)]">
                      Receive alerts when tasks approach deadlines
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="w-4 h-4 accent-[var(--accent)] cursor-pointer"
                />
              </label>
            </div>

            <div className="flex items-center justify-between pt-2">
              {profileSuccess ? (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  Profile saved
                </span>
              ) : (
                <span />
              )}

              <button
                type="submit"
                disabled={savingProfile}
                className="editorial-btn-primary flex items-center gap-2"
              >
                <Save className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{savingProfile ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </div>
          </form>
        </section>

        {/* 2. Theme Preferences */}
        <section className="editorial-card p-6">
          <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[var(--line)]">
            <h2 className="font-heading text-sm font-black uppercase tracking-wider text-[var(--fg)] flex items-center gap-2">
              <Moon className="w-4 h-4 text-[var(--accent)] stroke-[2.5]" />
              02 / Appearance Mode
            </h2>
            <span className="text-[10px] uppercase font-bold text-[var(--muted)]">Colorway</span>
          </div>
          <p className="text-xs text-[var(--muted)] mb-5">
            Switch between high-contrast editorial light and pitch dark print canvases.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
            <button
              onClick={() => setTheme('dark')}
              className={`p-4 border-2 text-left transition-all cursor-pointer flex items-center gap-3 ${
                theme === 'dark'
                  ? 'border-[var(--accent)] bg-[var(--line)] text-[var(--bg)] font-bold'
                  : 'border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--fg)] hover:border-[var(--fg)]'
              }`}
            >
              <Moon className="w-4 h-4 stroke-[2.5]" />
              <div>
                <div className="font-heading text-xs uppercase tracking-wider">Dark Canvas</div>
                <div className="text-[10px] uppercase font-mono mt-0.5">#121212 Jet Black</div>
              </div>
            </button>

            <button
              onClick={() => setTheme('light')}
              className={`p-4 border-2 text-left transition-all cursor-pointer flex items-center gap-3 ${
                theme === 'light'
                  ? 'border-[var(--accent)] bg-[var(--line)] text-[var(--bg)] font-bold'
                  : 'border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--fg)] hover:border-[var(--fg)]'
              }`}
            >
              <Sun className="w-4 h-4 stroke-[2.5]" />
              <div>
                <div className="font-heading text-xs uppercase tracking-wider">Light Canvas</div>
                <div className="text-[10px] uppercase font-mono mt-0.5">#f2f0e9 Warm Cream</div>
              </div>
            </button>
          </div>
        </section>

        {/* 3. Password & Security */}
        <section className="editorial-card p-6">
          <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[var(--line)]">
            <h2 className="font-heading text-sm font-black uppercase tracking-wider text-[var(--fg)] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[var(--accent)] stroke-[2.5]" />
              03 / Security &amp; Password
            </h2>
            <span className="text-[10px] uppercase font-bold text-[var(--muted)]">Auth</span>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--fg)] mb-1.5">
                New Password
              </label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="editorial-input w-full text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--fg)] mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="editorial-input w-full text-xs"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {passwordSuccess ? (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  Password updated
                </span>
              ) : (
                <span />
              )}

              <button
                type="submit"
                disabled={savingPassword || !newPassword}
                className="editorial-btn-secondary"
              >
                {savingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </section>

        {/* 4. Danger Zone: Delete Account */}
        <section className="border-3 border-red-500 bg-red-500/5 p-6">
          <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-red-500/30">
            <h2 className="font-heading text-sm font-black uppercase tracking-wider text-red-500 flex items-center gap-2">
              <Trash2 className="w-4 h-4 stroke-[2.5]" />
              04 / Danger Zone
            </h2>
            <span className="text-[10px] uppercase font-bold text-red-500 tracking-wider">Irreversible</span>
          </div>
          <p className="text-xs text-[var(--muted)] mb-5">
            Permanently delete your account and all associated lists, tasks, and stored data.
          </p>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Delete Account
          </button>
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[var(--bg)] border-3 border-red-500 p-6 shadow-2xl relative text-[var(--fg)]"
          >
            <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-[var(--line)]">
              <div className="w-8 h-8 border-2 border-red-500 flex items-center justify-center text-red-500 bg-red-500/10">
                <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-black uppercase tracking-wider text-red-500">
                  Delete Account?
                </h3>
                <p className="text-[11px] font-bold uppercase text-[var(--muted)]">Permanent data loss</p>
              </div>
            </div>

            <p className="text-xs text-[var(--muted)] mb-6 leading-relaxed">
              Are you certain you want to delete your Sprint account? All lists, tasks, and preferences will be permanently wiped.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-[var(--line)]">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="editorial-btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 text-white border-2 border-red-600 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
