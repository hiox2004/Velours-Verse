import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { AppView } from '../types/writing';
import { AestheticThemeId } from '../types/theme';
import { ThemeMotifIcon } from './ThemeIllustrations';
import {
  BookOpen,
  Mail,
  Sparkles,
  Sun,
  Moon,
  Plus,
  Wifi,
  WifiOff,
  User,
  ShieldCheck,
  Check
} from 'lucide-react';

interface NavigationProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  onOpenNewPiece: () => void;
  onOpenProfile: () => void;
  isOnline: boolean;
  syncState: 'synced' | 'syncing' | 'offline';
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onSelectView,
  onOpenNewPiece,
  onOpenProfile,
  isOnline,
  syncState
}) => {
  const { themeId, setThemeId, mode, toggleMode, theme } = useTheme();
  const { currentUser, isDeveloper } = useAuth();
  const [showThemePicker, setShowThemePicker] = useState(false);

  const themeOptions: { id: AestheticThemeId; name: string; motif: string }[] = [
    { id: 'coquette', name: 'Coquette Blush', motif: 'Silk Bow' },
    { id: 'y2k', name: 'Cyber Y2K', motif: 'Chrome Star' },
    { id: 'matcha', name: 'Matcha Latte', motif: 'Tea Leaf' },
    { id: 'midnight', name: 'Midnight Muse', motif: 'Crescent Moon' }
  ];

  return (
    <>
      {/* DESKTOP / TABLET TOP APP BAR (Crisp, High Contrast, 3-Zone Contract) */}
      <header className="hidden md:block sticky top-0 z-40 backdrop-blur-md bg-white/95 dark:bg-zinc-950/95 border-b-2 border-black/20 dark:border-zinc-800 no-print transition-colors duration-200 shadow-2xs">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark with Theme Vector Icon */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectView('feed')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-black dark:text-white border-2 border-black/30 dark:border-zinc-700 group-hover:scale-105 transition-transform">
                <ThemeMotifIcon themeId={themeId} className="w-4 h-4 text-black dark:text-white" />
              </div>
              <span className="font-display-chic text-xl font-black tracking-tight text-black dark:text-white group-hover:opacity-90 transition-opacity whitespace-nowrap">
                Velours & Verse
              </span>
            </button>

            {/* Offline / Synced Indicator Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 text-xs rounded-full bg-white dark:bg-zinc-800 text-black dark:text-zinc-200 border-2 border-black/30 dark:border-zinc-700 font-black shadow-2xs">
              {isOnline ? (
                <Wifi className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 stroke-[3]" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 stroke-[3]" />
              )}
              <span className="text-[11px] font-black">
                {syncState === 'synced' ? 'Synced' : syncState === 'syncing' ? 'Syncing...' : 'Offline (Cached)'}
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Single-Line, 4-5 Items, Solid Black Text in Light Mode) */}
          <nav className="flex items-center gap-3.5 lg:gap-7 text-xs lg:text-sm font-black text-black dark:text-zinc-200">
            <button
              onClick={() => onSelectView('feed')}
              className={`hover:opacity-75 transition-all whitespace-nowrap shrink-0 pb-1 ${
                currentView === 'feed'
                  ? 'text-black dark:text-white border-b-3 border-black dark:border-white font-black'
                  : 'text-black/80 dark:text-zinc-300 font-bold'
              }`}
            >
              Writing Log
            </button>
            <button
              onClick={() => onSelectView('penpals')}
              className={`hover:opacity-75 transition-all whitespace-nowrap shrink-0 pb-1 ${
                currentView === 'penpals'
                  ? 'text-black dark:text-white border-b-3 border-black dark:border-white font-black'
                  : 'text-black/80 dark:text-zinc-300 font-bold'
              }`}
            >
              Penpals Circle
            </button>
            <button
              onClick={() => onSelectView('widgets')}
              className={`hover:opacity-75 transition-all whitespace-nowrap shrink-0 pb-1 ${
                currentView === 'widgets'
                  ? 'text-black dark:text-white border-b-3 border-black dark:border-white font-black'
                  : 'text-black/80 dark:text-zinc-300 font-bold'
              }`}
            >
              Sound & Widgets
            </button>
            {/* Developer Mode Icon (No words, clickable for devs, unclickable for normal users) */}
            {isDeveloper ? (
              <button
                onClick={() => onSelectView('dev_academy')}
                className={`p-1.5 rounded-xl transition-all shrink-0 flex items-center justify-center ${
                  currentView === 'dev_academy'
                    ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400 dark:ring-indigo-300'
                    : 'text-indigo-800 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-zinc-800'
                }`}
                title="Developer Mode & God Terminal"
                aria-label="Developer Mode"
              >
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              </button>
            ) : (
              <div
                className="p-1.5 rounded-xl text-zinc-400/80 dark:text-zinc-600 cursor-not-allowed select-none opacity-60 flex items-center justify-center"
                title="Developer Mode (Restricted access)"
                aria-disabled="true"
              >
                <ShieldCheck className="w-4 h-4 stroke-[2]" />
              </div>
            )}
          </nav>

          {/* Zone 3: Actions (Theme Picker, Dark Toggle, Profile, New Piece) */}
          <div className="flex items-center gap-2 lg:gap-2.5 shrink-0">
            {/* Theme Picker Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowThemePicker(!showThemePicker)}
                className="h-9 px-2.5 lg:px-3 rounded-xl flex items-center gap-1.5 text-black dark:text-white bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border-2 border-black/30 dark:border-zinc-700 transition-colors font-black text-xs shadow-2xs"
                title="Change aesthetic theme"
                aria-label="Change aesthetic theme"
              >
                <ThemeMotifIcon themeId={themeId} className="w-3.5 h-3.5" />
                <span className="hidden lg:inline font-black">{theme.name.split(' ')[0]}</span>
              </button>

              {showThemePicker && (
                <div className="absolute right-0 mt-2 w-56 py-2 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border-3 border-black dark:border-zinc-700 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3.5 py-1.5 text-[11px] font-black text-black dark:text-zinc-300 uppercase tracking-wider">
                    Select Aesthetic Theme
                  </div>
                  {themeOptions.map(t => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setThemeId(t.id);
                        setShowThemePicker(false);
                      }}
                      className={`w-full px-3.5 py-2.5 text-left text-xs flex items-center justify-between transition-colors ${
                        themeId === t.id
                          ? 'bg-zinc-200 dark:bg-zinc-800 font-black text-black dark:text-white'
                          : 'text-black dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 font-bold'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border-2 border-black/30 dark:border-zinc-700">
                          <ThemeMotifIcon themeId={t.id} className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-black text-black dark:text-white">{t.name}</div>
                          <div className="text-[10px] text-black/70 dark:text-zinc-400 font-bold">{t.motif}</div>
                        </div>
                      </span>
                      {themeId === t.id && <Check className="w-4 h-4 text-black dark:text-white stroke-[3]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark / Light Toggle with explicit White Moon in light mode */}
            <button
              onClick={toggleMode}
              className={`h-9 px-2.5 lg:px-3 rounded-xl flex items-center gap-1.5 transition-all shadow-sm border-2 ${
                mode === 'light'
                  ? 'bg-black text-white border-zinc-700 hover:bg-zinc-900'
                  : 'bg-amber-400 text-black border-amber-300 hover:bg-amber-300'
              }`}
              title={`Switch to ${mode === 'light' ? 'Dark' : 'Light'} Mode`}
              aria-label="Toggle theme mode"
            >
              {mode === 'light' ? (
                <>
                  <Moon className="w-4 h-4 text-white fill-white stroke-white" />
                  <span className="hidden lg:inline text-xs font-black text-white">White Moon</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-black fill-black stroke-black" />
                  <span className="hidden lg:inline text-xs font-black text-black">Light Sun</span>
                </>
              )}
            </button>

            {/* Profile Avatar / Login */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 p-1 lg:pl-1.5 lg:pr-3 lg:py-1 rounded-xl bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border-2 border-black/30 dark:border-zinc-700 transition-colors shadow-2xs"
              title="Open profile & penpal info"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.displayName}
                className="w-6 h-6 rounded-full object-cover ring-2 ring-black dark:ring-white shrink-0"
                referrerPolicy="no-referrer"
              />
              <span className="hidden lg:inline text-xs font-black text-black dark:text-white max-w-[90px] truncate">
                {currentUser.displayName}
              </span>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenNewPiece}
              className="flex items-center gap-1.5 px-2.5 lg:px-4 py-2 rounded-xl text-xs font-black text-white bg-black dark:bg-white dark:text-black hover:opacity-90 active:scale-[0.98] transition-all shadow-sm border-2 border-black dark:border-white"
              title="Compose new piece"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden lg:inline">Write Piece</span>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE TOP BAR (High contrast header with generous touch targets) */}
      <header className="md:hidden sticky top-0 z-40 backdrop-blur-md bg-white dark:bg-zinc-950 border-b-2 border-black/20 dark:border-zinc-800 px-3 sm:px-4 h-14 flex items-center justify-between no-print gap-2">
        <button
          onClick={() => onSelectView('feed')}
          className="flex items-center gap-2 text-left min-w-0"
        >
          <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border-2 border-black/30 dark:border-zinc-700 shrink-0">
            <ThemeMotifIcon themeId={themeId} className="w-3.5 h-3.5 text-black dark:text-white" />
          </div>
          <span className="font-display-chic text-base sm:text-lg font-black tracking-tight text-black dark:text-white truncate">
            Velours & Verse
          </span>
        </button>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setShowThemePicker(!showThemePicker)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-black dark:text-white bg-white dark:bg-zinc-800 border-2 border-black/30 dark:border-zinc-700 shrink-0"
            aria-label="Theme"
            title="Change aesthetic theme"
          >
            <ThemeMotifIcon themeId={themeId} className="w-4 h-4" />
          </button>

          <button
            onClick={toggleMode}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border-2 shrink-0 ${
              mode === 'light'
                ? 'bg-black text-white border-zinc-700'
                : 'bg-amber-400 text-black border-amber-300'
            }`}
            title={`Switch to ${mode === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle dark mode"
          >
            {mode === 'light' ? (
              <Moon className="w-4 h-4 text-white fill-white stroke-white" />
            ) : (
              <Sun className="w-4 h-4 text-black fill-black stroke-black" />
            )}
          </button>

          <button
            onClick={onOpenProfile}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            aria-label="Profile"
            title="Open profile"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.displayName}
              className="w-7 h-7 rounded-full object-cover ring-2 ring-black dark:ring-white"
              referrerPolicy="no-referrer"
            />
          </button>
        </div>

        {/* Mobile Theme Popover */}
        {showThemePicker && (
          <div className="absolute top-14 right-4 w-52 py-2 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border-3 border-black dark:border-zinc-700 z-50">
            <div className="px-3.5 py-1 text-[10px] font-black text-black dark:text-zinc-300 uppercase tracking-wider">
              Aesthetic Styles
            </div>
            {themeOptions.map(t => (
              <button
                key={t.id}
                onClick={() => {
                  setThemeId(t.id);
                  setShowThemePicker(false);
                }}
                className={`w-full px-3.5 py-2.5 text-left text-xs flex items-center justify-between ${
                  themeId === t.id
                    ? 'bg-zinc-200 dark:bg-zinc-800 font-black text-black dark:text-white'
                    : 'text-black dark:text-zinc-200 font-bold'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <ThemeMotifIcon themeId={t.id} className="w-3.5 h-3.5" />
                  <span className="font-black">{t.name}</span>
                </span>
                {themeId === t.id && <Check className="w-4 h-4 text-black dark:text-white stroke-[3]" />}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* MOBILE FLOATING COMPOSE ACTION BUTTON (Pinned above bottom bar) */}
      <div className="md:hidden fixed bottom-20 right-4 z-40 no-print">
        <button
          onClick={onOpenNewPiece}
          className="w-14 h-14 rounded-full flex items-center justify-center bg-black dark:bg-white text-white dark:text-black shadow-2xl border-2 border-white/40 active:scale-95 transition-transform"
          aria-label="Compose new piece"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </button>
      </div>

      {/* MOBILE FIXED BOTTOM TAB BAR (5-column layout, Touch targets >= 44px, Solid Black Text in Light Mode) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md bg-white/98 dark:bg-zinc-950/98 border-t-3 border-black/20 dark:border-zinc-800 h-16 grid grid-cols-5 items-center pb-safe no-print">
        <button
          onClick={() => onSelectView('feed')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            currentView === 'feed'
              ? 'text-black dark:text-white font-black'
              : 'text-black/80 dark:text-zinc-400 font-bold'
          }`}
        >
          <BookOpen className="w-5 h-5 stroke-[2.5]" />
          <span className="text-[10px] mt-1 font-black">Logs</span>
        </button>

        <button
          onClick={() => onSelectView('penpals')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            currentView === 'penpals'
              ? 'text-black dark:text-white font-black'
              : 'text-black/80 dark:text-zinc-400 font-bold'
          }`}
        >
          <Mail className="w-5 h-5 stroke-[2.5]" />
          <span className="text-[10px] mt-1 font-black">Penpals</span>
        </button>

        <button
          onClick={() => onSelectView('widgets')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            currentView === 'widgets'
              ? 'text-black dark:text-white font-black'
              : 'text-black/80 dark:text-zinc-400 font-bold'
          }`}
        >
          <Sparkles className="w-5 h-5 stroke-[2.5]" />
          <span className="text-[10px] mt-1 font-black">Studio</span>
        </button>

        <button
          onClick={onOpenProfile}
          className="min-h-[44px] flex flex-col items-center justify-center text-black/80 dark:text-zinc-400 font-bold"
        >
          <User className="w-5 h-5 stroke-[2.5]" />
          <span className="text-[10px] mt-1 font-black">Profile</span>
        </button>

        {/* Dev Mode Icon (Icon only, no text labels, unclickable for normal users) */}
        {isDeveloper ? (
          <button
            onClick={() => onSelectView('dev_academy')}
            className={`min-h-[44px] flex items-center justify-center transition-colors ${
              currentView === 'dev_academy'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
            title="Developer Mode"
            aria-label="Developer Mode"
          >
            <div className={`p-2 rounded-xl ${currentView === 'dev_academy' ? 'bg-indigo-100 dark:bg-indigo-950/60' : ''}`}>
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
          </button>
        ) : (
          <div
            className="min-h-[44px] flex items-center justify-center text-zinc-300 dark:text-zinc-700 cursor-not-allowed select-none opacity-50"
            title="Developer Mode (Restricted)"
            aria-disabled="true"
          >
            <ShieldCheck className="w-5 h-5 stroke-[1.8]" />
          </div>
        )}
      </nav>
    </>
  );
};
