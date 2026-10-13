import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { SUPER_ADMIN_EMAIL, SEED_USERS } from '../services/storage';
import { getThemeGlassCardStyle } from '../types/theme';
import { ThemeMotifIcon } from './ThemeIllustrations';
import {
  X,
  User,
  Coffee,
  Quote,
  ShieldCheck,
  Check,
  Copy,
  LogIn,
  LogOut,
  Key
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
];

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, isDeveloper, updateProfile, loginWithGoogle, signInWithGoogle, loginAs, logout } = useAuth();
  const { mode, theme, themeId } = useTheme();

  const cardStyle = mode === 'light' ? theme.light.card : theme.dark.card;
  const glassStyle = getThemeGlassCardStyle(themeId, mode);

  const [displayName, setDisplayName] = useState(currentUser?.displayName || 'Quiet Writer');
  const [avatar, setAvatar] = useState(currentUser?.avatar || AVATAR_OPTIONS[0]);
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [favoriteDrink, setFavoriteDrink] = useState(currentUser?.favoriteDrink || '');
  const [favoriteQuote, setFavoriteQuote] = useState(currentUser?.favoriteQuote || '');
  const [copiedId, setCopiedId] = useState(false);

  // Custom Google Login input
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomLogin, setShowCustomLogin] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    updateProfile({
      displayName: displayName.trim() || currentUser.displayName,
      avatar,
      bio,
      favoriteDrink,
      favoriteQuote
    });
    onClose();
  };

  const handleCopyId = () => {
    if (!currentUser?.penpalId) return;
    navigator.clipboard.writeText(currentUser.penpalId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    loginWithGoogle(customEmail.trim(), customName.trim() || undefined);
    setShowCustomLogin(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 no-print">
      <div
        style={glassStyle}
        className={`w-full max-w-lg rounded-3xl border-3 ${cardStyle.border} ${cardStyle.shadow} flex flex-col max-h-[90vh] overflow-hidden relative shadow-2xl backdrop-blur-xl`}
      >
        {/* Frosted Glass Sheen Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-white/35 dark:from-white/10 to-transparent pointer-events-none rounded-3xl"
          style={{ backgroundClip: 'padding-box', WebkitBackgroundClip: 'padding-box' }}
        />

        {/* Top Accent Strip Bar matching active theme */}
        <div className={`h-2 w-full ${cardStyle.accentBar} shrink-0`} />

        {/* Header */}
        <div className="px-6 py-4 border-b-2 border-black/15 dark:border-white/10 flex items-center justify-between shrink-0 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center border-2 border-black/30 dark:border-white/20 shadow-2xs">
              <ThemeMotifIcon themeId={themeId} className="w-4 h-4 text-black dark:text-white" />
            </div>
            <h2 className="font-display-chic text-lg font-black text-black dark:text-white">
              Writer Profile & Account
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Identity Pill Card */}
          {currentUser && (
            <div
              style={glassStyle}
              className={`p-4 rounded-2xl border-2 ${cardStyle.border} flex items-center justify-between shadow-2xs backdrop-blur-md`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={avatar}
                  alt={currentUser.displayName}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-black dark:ring-white shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-sm text-black dark:text-white">
                      {currentUser.displayName}
                    </h3>
                    {isDeveloper && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-600 text-white font-black flex items-center gap-1 shadow-2xs">
                        <ShieldCheck className="w-3 h-3 stroke-[2.5]" />
                        <span>Developer Mode</span>
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-black dark:text-zinc-200 font-mono mt-0.5 font-black">
                    ID: <span className="text-pink-700 dark:text-pink-400">{currentUser.penpalId}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyId}
                className="px-3 py-1.5 rounded-xl border-2 border-black/20 dark:border-zinc-700 text-xs font-black bg-white dark:bg-zinc-800 hover:bg-zinc-100 flex items-center gap-1.5 text-black dark:text-zinc-100 shadow-2xs transition-colors"
              >
                {copiedId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy ID</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Real Google Account / Sign-in */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border-2 border-black/15 dark:border-zinc-800 space-y-3">
            <div className="text-xs font-black text-black dark:text-zinc-200 uppercase tracking-wider">
              Google Account Authentication
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => signInWithGoogle()}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border-2 border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100 font-bold text-xs hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors shadow-2xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Real Google Account</span>
              </button>

              {!showCustomLogin ? (
                <button
                  type="button"
                  onClick={() => setShowCustomLogin(true)}
                  className="text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 font-medium hover:underline flex items-center gap-1 self-start"
                >
                  <span>Or switch to manual developer email...</span>
                </button>
              ) : (
                <form onSubmit={handleCustomGoogleSubmit} className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-700">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="email"
                      value={customEmail}
                      onChange={e => setCustomEmail(e.target.value)}
                      placeholder="e.g. hiox2004@gmail.com"
                      className="px-3 py-1.5 text-xs font-medium rounded-xl bg-white dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-700 outline-none text-zinc-900 dark:text-white"
                    />
                    <input
                      type="text"
                      value={customName}
                      onChange={e => setCustomName(e.target.value)}
                      placeholder="Display Name"
                      className="px-3 py-1.5 text-xs font-medium rounded-xl bg-white dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-700 outline-none text-zinc-900 dark:text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={!customEmail.trim()}
                      className="px-3 py-1 text-xs font-bold bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-lg hover:opacity-90 disabled:opacity-40"
                    >
                      Authenticate Google Account
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCustomLogin(false)}
                      className="px-3 py-1 text-xs text-zinc-500 hover:text-zinc-700 font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Profile Form */}
          {currentUser && (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-black dark:text-zinc-200 mb-1">
                  Display Name (Public to Penpals)
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-3 text-black dark:text-zinc-400 stroke-[2.5]" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="Your pen name"
                    className="w-full pl-9 pr-3.5 py-2 text-xs font-black rounded-xl bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 border-2 border-black/30 dark:border-zinc-700 outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-black text-black dark:text-zinc-200 mb-1">
                  Short Bio (Writing Aesthetic)
                </label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={2}
                  placeholder="What inspires your words?"
                  className="w-full p-3 text-xs font-black rounded-xl bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 border-2 border-black/30 dark:border-zinc-700 outline-none focus:border-black font-serif-literary"
                />
              </div>

              {/* Favorite Drink */}
              <div>
                <label className="block text-xs font-black text-black dark:text-zinc-200 mb-1">
                  Companion Drink While Writing
                </label>
                <div className="relative">
                  <Coffee className="w-3.5 h-3.5 absolute left-3 top-3 text-black dark:text-zinc-400 stroke-[2.5]" />
                  <input
                    type="text"
                    value={favoriteDrink}
                    onChange={e => setFavoriteDrink(e.target.value)}
                    placeholder="e.g. Lavender London Fog"
                    className="w-full pl-9 pr-3.5 py-2 text-xs font-black rounded-xl bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 border-2 border-black/30 dark:border-zinc-700 outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Favorite Quote */}
              <div>
                <label className="block text-xs font-black text-black dark:text-zinc-200 mb-1">
                  Guiding Literary Quote
                </label>
                <div className="relative">
                  <Quote className="w-3.5 h-3.5 absolute left-3 top-3 text-black dark:text-zinc-400 stroke-[2.5]" />
                  <input
                    type="text"
                    value={favoriteQuote}
                    onChange={e => setFavoriteQuote(e.target.value)}
                    placeholder="e.g. Words are sacred."
                    className="w-full pl-9 pr-3.5 py-2 text-xs font-black rounded-xl bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 border-2 border-black/30 dark:border-zinc-700 outline-none focus:border-black font-serif-literary"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    onClose();
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-black text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-1.5 transition-colors border border-rose-300 dark:border-rose-800"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-xs font-black text-black dark:text-zinc-300 hover:opacity-70"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-black text-white bg-black dark:bg-white dark:text-black hover:opacity-90 active:scale-95 transition-all shadow-sm border-2 border-black dark:border-white"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
