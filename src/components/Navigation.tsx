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
  Check,
  LogIn,
  Feather
} from 'lucide-react';

interface NavigationProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  onOpenNewPiece: () => void;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
  isOnline: boolean;
  syncState: 'synced' | 'syncing' | 'offline';
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onSelectView,
  onOpenNewPiece,
  onOpenProfile,
  onOpenAuth,
  isOnline,
  syncState
}) => {
  const { themeId, setThemeId, mode, toggleMode, theme } = useTheme();
  const { currentUser, isAuthenticated, isDeveloper } = useAuth();
  const [showThemePicker, setShowThemePicker] = useState(false);

  const themeOptions: { id: AestheticThemeId; name: string; motif: string }[] = [
    { id: 'coquette', name: 'Coquette Blush', motif: 'Silk Bow' },
    { id: 'y2k', name: 'Cyber Y2K', motif: 'Chrome Star' },
    { id: 'matcha', name: 'Matcha Latte', motif: 'Tea Leaf' },
    { id: 'midnight', name: 'Midnight Muse', motif: 'Crescent Moon' }
  ];

  return (
    <>
      {/* DESKTOP / TABLET TOP APP BAR (Spacious, Corner-Anchored, Relaxed Layout) */}
      <header className="hidden lg:block sticky top-0 z-40 backdrop-blur-md bg-white/95 dark:bg-zinc-950/95 border-b-2 border-black/15 dark:border-zinc-800 no-print transition-colors duration-200 shadow-2xs">
        <div className="w-full max-w-[1680px] mx-auto px-6 lg:px-12 h-18 flex items-center justify-between gap-6">
          {/* Zone 1: Brand Wordmark (Anchored towards Left Corner) */}
          <div className="flex items-center gap-3.5 shrink-0">
            <button
              onClick={() => onSelectView('landing')}
              className="flex items-center gap-3 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-black dark:text-white border-2 border-black/30 dark:border-zinc-700 group-hover:scale-105 transition-transform shadow-2xs">
                <ThemeMotifIcon themeId={themeId} className="w-4.5 h-4.5 text-black dark:text-white" />
              </div>
              <span className="font-display-chic text-xl lg:text-2xl font-black tracking-tight text-black dark:text-white group-hover:opacity-90 transition-opacity whitespace-nowrap">
                Velours & Verse
              </span>
            </button>

            {/* Offline / Synced Indicator Badge (Only shown when authenticated) */}
            {isAuthenticated && (
              <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 text-xs rounded-full bg-white dark:bg-zinc-800 text-black dark:text-zinc-200 border-2 border-black/20 dark:border-zinc-700 font-black shadow-2xs">
                {isOnline ? (
                  <Wifi className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 stroke-[3]" />
                ) : (
                  <WifiOff className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 stroke-[3]" />
                )}
                <span className="text-[11px] font-black">
                  {syncState === 'synced' ? 'Synced' : syncState === 'syncing' ? 'Syncing...' : 'Offline (Cached)'}
                </span>
              </div>
            )}
          </div>

          {/* Zone 2: Navigation Links (Relaxed, Generous Spacing) */}
          <nav className="flex items-center gap-6 lg:gap-10 text-xs lg:text-sm font-black text-black dark:text-zinc-200">
            <button
              onClick={() => onSelectView('landing')}
              className={`hover:opacity-75 transition-all whitespace-nowrap shrink-0 py-1 ${
                currentView === 'landing'
                  ? 'text-black dark:text-white border-b-2.5 border-black dark:border-white font-black'
                  : 'text-black/70 dark:text-zinc-400 font-bold'
              }`}
            >
              Sanctuary
            </button>

            <button
              onClick={() => onSelectView('feed')}
              className={`hover:opacity-75 transition-all whitespace-nowrap shrink-0 py-1 ${
                currentView === 'feed'
                  ? 'text-black dark:text-white border-b-2.5 border-black dark:border-white font-black'
                  : 'text-black/70 dark:text-zinc-400 font-bold'
              }`}
            >
              Writing Log
            </button>

            <button
              onClick={() => onSelectView('penpals')}
              className={`hover:opacity-75 transition-all whitespace-nowrap shrink-0 py-1 ${
                currentView === 'penpals'
                  ? 'text-black dark:text-white border-b-2.5 border-black dark:border-white font-black'
                  : 'text-black/70 dark:text-zinc-400 font-bold'
              }`}
            >
              Penpals Circle
            </button>

            <button
              onClick={() => onSelectView('widgets')}
              className={`hover:opacity-75 transition-all whitespace-nowrap shrink-0 py-1 ${
                currentView === 'widgets'
                  ? 'text-black dark:text-white border-b-2.5 border-black dark:border-white font-black'
                  : 'text-black/70 dark:text-zinc-400 font-bold'
              }`}
            >
              Sound & Widgets
            </button>

            {/* Developer Mode Icon (Only visible when logged in as hiox2004) */}
            {isDeveloper && (
              <button
                onClick={() => onSelectView('dev_academy')}
                className={`p-1.5 rounded-xl transition-all shrink-0 flex items-center justify-center ${
                  currentView === 'dev_academy'
                    ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400 dark:ring-indigo-300'
                    : 'text-indigo-800 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-zinc-800'
                }`}
                title="Developer Mode (Restricted: hiox2004)"
                aria-label="Developer Mode"
              >
                <ShieldCheck className="w-4.5 h-4.5 stroke-[2.5]" />
              </button>
            )}
          </nav>

          {/* Zone 3: Actions (Anchored towards Right Corner) */}
          <div className="flex items-center gap-2.5 lg:gap-3.5 shrink-0">
            {/* Theme Picker Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowThemePicker(!showThemePicker)}
                className="h-9 px-3 rounded-xl flex items-center gap-2 text-black dark:text-white bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border-2 border-black/25 dark:border-zinc-700 transition-colors font-black text-xs shadow-2xs"
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

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleMode}
              className={`h-9 px-3 rounded-xl flex items-center gap-1.5 transition-all shadow-sm border-2 ${
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
                  <span className="hidden xl:inline text-xs font-black text-white">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-black fill-black stroke-black" />
                  <span className="hidden xl:inline text-xs font-black text-black">Light</span>
                </>
              )}
            </button>

            {/* Conditional Right End: Sign In Button for Guests vs Avatar for Authenticated */}
            {isAuthenticated && currentUser ? (
              <>
                <button
                  onClick={onOpenProfile}
                  className="flex items-center gap-2 p-1 lg:pl-1.5 lg:pr-3 lg:py-1 rounded-xl bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border-2 border-black/25 dark:border-zinc-700 transition-colors shadow-2xs"
                  title="Open profile & account settings"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.displayName}
                    className="w-6 h-6 rounded-full object-cover ring-2 ring-black dark:ring-white shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <span className="hidden lg:inline text-xs font-black text-black dark:text-white max-w-[110px] truncate">
                    {currentUser.displayName}
                  </span>
                </button>

                <button
                  onClick={onOpenNewPiece}
                  className="flex items-center gap-1.5 px-3 lg:px-4 py-2 rounded-xl text-xs font-black text-white bg-black dark:bg-white dark:text-black hover:opacity-90 active:scale-[0.98] transition-all shadow-sm border-2 border-black dark:border-white"
                  title="Compose new piece"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span className="hidden lg:inline">Write Piece</span>
                </button>
              </>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-white bg-black dark:bg-white dark:text-black hover:scale-105 active:scale-95 transition-all shadow-md border-2 border-black dark:border-white"
              >
                <LogIn className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MOBILE & TABLET TOP BAR */}
      <header className="lg:hidden sticky top-0 z-40 backdrop-blur-md bg-white dark:bg-zinc-950 border-b-2 border-black/15 dark:border-zinc-800 px-4 h-14 flex items-center justify-between no-print gap-3">
        <button
          onClick={() => onSelectView('landing')}
          className="flex items-center gap-2 text-left min-w-0"
        >
          <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border-2 border-black/30 dark:border-zinc-700 shrink-0">
            <ThemeMotifIcon themeId={themeId} className="w-3.5 h-3.5 text-black dark:text-white" />
          </div>
          <span className="font-display-chic text-base font-black tracking-tight text-black dark:text-white truncate">
            Velours & Verse
          </span>
        </button>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowThemePicker(!showThemePicker)}
            className="w-8.5 h-8.5 rounded-xl flex items-center justify-center text-black dark:text-white bg-white dark:bg-zinc-800 border-2 border-black/25 dark:border-zinc-700 shrink-0"
            aria-label="Theme"
            title="Change aesthetic theme"
          >
            <ThemeMotifIcon themeId={themeId} className="w-4 h-4" />
          </button>

          <button
            onClick={toggleMode}
            className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center transition-all border-2 shrink-0 ${
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

          {isAuthenticated && currentUser ? (
            <button
              onClick={onOpenProfile}
              className="w-8.5 h-8.5 rounded-xl flex items-center justify-center shrink-0"
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
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-2.5 py-1.5 rounded-xl text-xs font-black text-white bg-black dark:bg-white dark:text-black shrink-0 border border-black dark:border-white"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Theme Popover */}
        {showThemePicker && (
          <div className="absolute top-14 right-4 w-52 py-2 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border-3 border-black dark:border-zinc-700 z-50 animate-in fade-in zoom-in-95 duration-100">
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

      {/* MOBILE FLOATING COMPOSE ACTION BUTTON (Only for authenticated writers) */}
      {isAuthenticated && (
        <div className="lg:hidden fixed bottom-20 right-4 z-40 no-print">
          <button
            onClick={onOpenNewPiece}
            className="w-13 h-13 rounded-full flex items-center justify-center bg-black dark:bg-white text-white dark:text-black shadow-2xl border-2 border-white/40 active:scale-95 transition-transform"
            aria-label="Compose new piece"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
        </div>
      )}

      {/* MOBILE FIXED BOTTOM TAB BAR (Solid Touch Targets) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md bg-white/98 dark:bg-zinc-950/98 border-t-2 border-black/20 dark:border-zinc-800 h-16 grid grid-cols-4 items-center pb-safe no-print">
        <button
          onClick={() => onSelectView('landing')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            currentView === 'landing'
              ? 'text-black dark:text-white font-black'
              : 'text-black/70 dark:text-zinc-400 font-bold'
          }`}
        >
          <Feather className="w-4.5 h-4.5 stroke-[2.5]" />
          <span className="text-[10px] mt-1 font-black">Sanctuary</span>
        </button>

        <button
          onClick={() => onSelectView('feed')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            currentView === 'feed'
              ? 'text-black dark:text-white font-black'
              : 'text-black/70 dark:text-zinc-400 font-bold'
          }`}
        >
          <BookOpen className="w-4.5 h-4.5 stroke-[2.5]" />
          <span className="text-[10px] mt-1 font-black">Logs</span>
        </button>

        <button
          onClick={() => onSelectView('penpals')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            currentView === 'penpals'
              ? 'text-black dark:text-white font-black'
              : 'text-black/70 dark:text-zinc-400 font-bold'
          }`}
        >
          <Mail className="w-4.5 h-4.5 stroke-[2.5]" />
          <span className="text-[10px] mt-1 font-black">Penpals</span>
        </button>

        <button
          onClick={() => onSelectView('widgets')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            currentView === 'widgets'
              ? 'text-black dark:text-white font-black'
              : 'text-black/70 dark:text-zinc-400 font-bold'
          }`}
        >
          <Sparkles className="w-4.5 h-4.5 stroke-[2.5]" />
          <span className="text-[10px] mt-1 font-black">Studio</span>
        </button>
      </nav>
    </>
  );
};
