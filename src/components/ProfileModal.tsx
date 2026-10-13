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
  const { currentUser, isDeveloper, updateProfile, loginWithGoogle, loginAs } = useAuth();
  const { mode, theme, themeId } = useTheme();

  const cardStyle = mode === 'light' ? theme.light.card : theme.dark.card;
  const glassStyle = getThemeGlassCardStyle(themeId, mode);

  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [bio, setBio] = useState(currentUser.bio);
  const [favoriteDrink, setFavoriteDrink] = useState(currentUser.favoriteDrink);
  const [favoriteQuote, setFavoriteQuote] = useState(currentUser.favoriteQuote);
  const [copiedId, setCopiedId] = useState(false);

  // Custom Google Login input
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomLogin, setShowCustomLogin] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
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
              onClick={handleCopyId}
              className="px-3 py-1.5 rounded-xl text-xs font-black bg-black text-white dark:bg-white dark:text-black border-2 border-black dark:border-white flex items-center gap-1.5 shadow-2xs hover:opacity-90 active:scale-95 transition-all"
            >
              {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Google Sign-In & Switcher */}
          <div className="space-y-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border-2 border-zinc-200 dark:border-zinc-700">
            <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <LogIn className="w-3.5 h-3.5 text-pink-600" />
                <span>Google Account Sign-In & Dev Mode</span>
              </span>
              <span className="text-[11px] text-zinc-500 font-medium">
                Active: <code className="text-zinc-900 dark:text-zinc-100 font-bold">{currentUser.email}</code>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {/* Lead Developer Quick Button */}
              <button
                type="button"
                onClick={() => loginWithGoogle(SUPER_ADMIN_EMAIL, 'Aura Dev (Lead)')}
                className="p-3 rounded-xl border-2 border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-950/40 text-left hover:bg-indigo-100 transition-colors"
              >
                <div className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1">
                  <Key className="w-3 h-3 text-indigo-600" />
                  <span>Lead Developer ({SUPER_ADMIN_EMAIL})</span>
                </div>
                <div className="text-[10px] text-indigo-700 dark:text-indigo-300 mt-0.5 font-medium">
                  Unlocks Developer God Mode & Academy
                </div>
              </button>

              {/* Clara Penpal Button */}
              <button
                type="button"
                onClick={() => loginAs(SEED_USERS[1])}
                className="p-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-left hover:bg-zinc-100 transition-colors"
              >
                <div className="font-bold text-zinc-950 dark:text-zinc-100">
                  Clara D. (Poet)
                </div>
                <div className="text-[10px] text-zinc-500 mt-0.5 font-medium">
                  PEN-7K3N1 · Regular Writer
                </div>
              </button>
            </div>

            {/* Custom Google Sign-In Form Toggle */}
            <div className="pt-2">
              {!showCustomLogin ? (
                <button
                  type="button"
                  onClick={() => setShowCustomLogin(true)}
                  className="text-xs text-pink-600 dark:text-pink-400 font-bold hover:underline flex items-center gap-1"
                >
                  <span>Or sign in with custom Google Account...</span>
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
          <form onSubmit={handleSave} className="space-y-4">
            {/* Display Name */}
            <div>
              <label className="block text-xs font-black text-black dark:text-zinc-200 mb-1">
                Display Name (Public to Penpals)
              </label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-black rounded-xl bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 border-2 border-black/30 dark:border-zinc-700 outline-none focus:border-black"
              />
            </div>

            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-black text-black dark:text-zinc-200 mb-1">
                Choose Aesthetic Avatar
              </label>
              <div className="flex items-center gap-2">
                {AVATAR_OPTIONS.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAvatar(img)}
                    className={`w-10 h-10 rounded-full overflow-hidden transition-all ${
                      avatar === img ? 'ring-3 ring-pink-700 scale-110' : 'opacity-60 hover:opacity-100 ring-2 ring-black/40'
                    }`}
                  >
                    <img src={img} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-black text-black dark:text-zinc-200 mb-1">
                Get to Know Me — Bio
              </label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={2}
                placeholder="What inspires your writing?"
                className="w-full px-3.5 py-2 text-xs font-bold rounded-xl bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 border-2 border-black/30 dark:border-zinc-700 outline-none focus:border-black resize-none font-serif-literary"
              />
            </div>

            {/* Favorite Beverage */}
            <div>
              <label className="block text-xs font-black text-black dark:text-zinc-200 mb-1">
                Writing Beverage of Choice
              </label>
              <div className="relative">
                <Coffee className="w-3.5 h-3.5 absolute left-3 top-3 text-black dark:text-zinc-400 stroke-[2.5]" />
                <input
                  type="text"
                  value={favoriteDrink}
                  onChange={e => setFavoriteDrink(e.target.value)}
                  placeholder="e.g. Iced Matcha Latte with Oat Milk"
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

            <div className="pt-2 flex items-center justify-end gap-2">
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
          </form>
        </div>
      </div>
    </div>
  );
};
