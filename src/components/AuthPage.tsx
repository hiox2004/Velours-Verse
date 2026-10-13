import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getThemeGlassCardStyle } from '../types/theme';
import { ThemeMotifIcon } from './ThemeIllustrations';
import { ArrowLeft, Sparkles, Shield, Heart, Feather } from 'lucide-react';

interface AuthPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onBack }) => {
  const { signInWithGoogle } = useAuth();
  const { mode, theme, themeId } = useTheme();
  const [isConnecting, setIsConnecting] = React.useState(false);

  const cardStyle = mode === 'light' ? theme.light.card : theme.dark.card;
  const glassStyle = getThemeGlassCardStyle(themeId, mode);

  const handleGoogleSignIn = async () => {
    setIsConnecting(true);
    await signInWithGoogle();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      <div
        style={glassStyle}
        className={`w-full max-w-md rounded-3xl border-3 ${cardStyle.border} ${cardStyle.shadow} overflow-hidden backdrop-blur-2xl shadow-2xl relative`}
      >
        {/* Accent Strip */}
        <div className={`h-2.5 w-full ${cardStyle.accentBar}`} />

        <div className="p-6 md:p-8 space-y-6">
          {/* Back button */}
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to sanctuary</span>
          </button>

          {/* Heading with Icon */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-white dark:bg-zinc-800 border-2 border-black/20 dark:border-white/10 flex items-center justify-center shadow-md">
              <ThemeMotifIcon themeId={themeId} className="w-7 h-7 text-black dark:text-white" />
            </div>
            <h1 className="font-display-chic text-2xl font-black text-black dark:text-white tracking-tight">
              Enter Velours & Verse
            </h1>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium max-w-xs mx-auto leading-relaxed">
              Sign in or create your penpal profile with Google to save drafts and exchange letters across devices.
            </p>
          </div>

          {/* Features Pill */}
          <div className="space-y-2.5 py-2">
            <div className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
              <Feather className="w-4 h-4 text-pink-500 shrink-0" />
              <span>Your personal inkwell & cloud-synced verses</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
              <Heart className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Receive quiet letters from fellow writers</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
              <Shield className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>Private drafts visible strictly to you</span>
            </div>
          </div>

          {/* Google Sign In CTA */}
          <div className="pt-2">
            <button
              onClick={handleGoogleSignIn}
              disabled={isConnecting}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl border-2 border-black/30 dark:border-white/20 bg-white dark:bg-zinc-900 text-black dark:text-white font-black text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md disabled:opacity-60 disabled:pointer-events-none"
            >
              {isConnecting ? (
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Connecting with Google...</span>
                </div>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[11px] text-center text-zinc-500 font-medium">
            One click signs you in or sets up your new writer profile automatically.
          </p>
        </div>
      </div>
    </div>
  );
};
