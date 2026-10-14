import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { StorageService } from '../services/storage';
import { SupabaseService } from '../services/supabaseService';
import { UserProfile } from '../types/writing';
import { getThemeGlassCardStyle } from '../types/theme';
import { ThemeMotifIcon } from './ThemeIllustrations';
import {
  Mail,
  UserPlus,
  Copy,
  Check,
  Coffee,
  Quote,
  Sparkles,
  Users,
  ShieldAlert,
  ArrowRight,
  Trash2
} from 'lucide-react';

interface PenpalHubProps {
  onOpenFeedForPenpals: () => void;
  onOpenProfile: () => void;
}

export const PenpalHub: React.FC<PenpalHubProps> = ({
  onOpenFeedForPenpals,
  onOpenProfile
}) => {
  const { currentUser, addPenpal, removePenpal } = useAuth();
  const { mode, theme, themeId } = useTheme();

  const [inputPenpalId, setInputPenpalId] = useState('');
  const [copiedMyId, setCopiedMyId] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [cloudPenpals, setCloudPenpals] = useState<UserProfile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cardStyle = mode === 'light' ? theme.light.card : theme.dark.card;
  const glassStyle = getThemeGlassCardStyle(themeId, mode);

  // Sync penpal profiles from Supabase whenever penpalIds change
  useEffect(() => {
    let isMounted = true;
    if (currentUser?.penpalIds && currentUser.penpalIds.length > 0) {
      SupabaseService.getProfilesByPenpalIds(currentUser.penpalIds).then(profiles => {
        if (!isMounted) return;
        if (profiles && profiles.length > 0) {
          profiles.forEach(p => StorageService.updateUserInDirectory(p));
          setCloudPenpals(profiles);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [currentUser?.penpalIds]);

  // Combine local and cloud penpals, with a resilient fallback card for any connected ID
  const renderedPenpals = useMemo(() => {
    const local = StorageService.getAllUsers();
    const map = new Map<string, UserProfile>();
    local.forEach(u => map.set(u.penpalId.toUpperCase(), u));
    cloudPenpals.forEach(u => map.set(u.penpalId.toUpperCase(), u));

    return (currentUser.penpalIds || []).map(id => {
      const cleanId = id.toUpperCase();
      const existing = map.get(cleanId);
      if (existing) return existing;

      return {
        id: `penpal_${cleanId}`,
        email: '',
        displayName: `Penpal Writer`,
        penpalId: cleanId,
        avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${cleanId}&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede,b6e3f4`,
        bio: 'Connected creative thinker on Velours & Verse.',
        favoriteDrink: 'Chai / Coffee',
        favoriteQuote: '“Words that refuse to be rushed.”',
        writingGoalWords: 500,
        penpalIds: [],
        role: 'writer' as const,
        createdAt: new Date().toISOString()
      };
    });
  }, [cloudPenpals, currentUser.penpalIds]);

  const handleCopyId = () => {
    navigator.clipboard.writeText(currentUser.penpalId);
    setCopiedMyId(true);
    setTimeout(() => setCopiedMyId(false), 2000);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPenpalId.trim()) return;
    setStatusMessage(null);
    setIsSubmitting(true);
    try {
      const res = await addPenpal(inputPenpalId);
      setStatusMessage({
        text: res.message,
        isError: !res.success
      });
      if (res.success) {
        setInputPenpalId('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Hero Banner with Theme Motif and Writing Log Glass Depth */}
      <div
        style={glassStyle}
        className={`group relative p-6 md:p-8 rounded-3xl border-3 ${cardStyle.border} ${cardStyle.shadow} overflow-hidden backdrop-blur-xl shadow-xl transition-all`}
      >
        {/* Frosted Glass Sheen Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-white/35 dark:from-white/10 to-transparent pointer-events-none rounded-3xl"
          style={{ backgroundClip: 'padding-box', WebkitBackgroundClip: 'padding-box' }}
        />

        {/* Top Accent Strip Bar matching active theme */}
        <div className={`absolute top-0 left-0 right-0 h-2 ${cardStyle.accentBar}`} />

        <div className="relative z-10 max-w-xl space-y-3 pt-1">
          <div className="flex items-center gap-2 text-xs font-black">
            <span className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-black tracking-wider ${cardStyle.badgeBg} ${cardStyle.badgeText} border border-black/20 flex items-center gap-1.5`}>
              <Mail className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Penpal Circle & Creative Network</span>
            </span>
          </div>

          <h2 className="font-display-chic text-2xl md:text-3xl font-black text-black dark:text-white">
            Letters & Verses Between Kindred Spirits
          </h2>

          <p className="font-serif-literary text-black dark:text-zinc-100 text-base leading-relaxed font-bold">
            Exchange writings exclusively with chosen friends. Connect through uniquely generated Penpal IDs with complete email privacy.
          </p>
        </div>

        <div className="absolute right-4 bottom-2 text-black/15 dark:text-white/15 opacity-60 pointer-events-none" aria-hidden="true">
          <ThemeMotifIcon themeId={themeId} className="w-28 h-28" />
        </div>
      </div>

      {/* Grid: My Penpal Identity Card & Add Penpal Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: My Personal Penpal Identity */}
        <div
          style={glassStyle}
          className={`group relative p-6 rounded-2xl border-3 ${cardStyle.border} ${cardStyle.shadow} space-y-5 overflow-hidden backdrop-blur-md transition-all hover:-translate-y-0.5`}
        >
          {/* Frosted Glass Sheen Overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-white/30 dark:from-white/10 to-transparent pointer-events-none rounded-2xl"
            style={{ backgroundClip: 'padding-box', WebkitBackgroundClip: 'padding-box' }}
          />

          {/* Top Accent Strip Bar */}
          <div className={`absolute top-0 left-0 right-0 h-1.5 ${cardStyle.accentBar}`} />

          {/* Decorative Corner Theme Watermark Stamp */}
          <div className="absolute right-3.5 top-3.5 opacity-25 group-hover:opacity-50 text-black dark:text-white transition-opacity pointer-events-none">
            <ThemeMotifIcon themeId={themeId} className="w-4 h-4" />
          </div>

          <div className="flex items-start justify-between relative z-10 pt-1">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.displayName}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-black dark:ring-white shadow-sm"
                referrerPolicy="no-referrer"
              />
              <div>
                <h3 className="font-display-chic text-lg font-black text-black dark:text-white flex items-center gap-1.5">
                  {currentUser.displayName}
                  <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-black ${cardStyle.badgeBg} ${cardStyle.badgeText} border border-black/10`}>
                    You
                  </span>
                </h3>
                <p className="text-xs text-black dark:text-zinc-200 font-bold">Your Public Identity</p>
              </div>
            </div>

            <button
              onClick={onOpenProfile}
              className="text-xs font-black text-black dark:text-white underline decoration-2 hover:opacity-80 transition-opacity"
            >
              Edit Bio
            </button>
          </div>

          {/* Penpal ID Copy Box */}
          <div
            style={glassStyle}
            className={`relative z-10 p-4 rounded-xl border-2 ${cardStyle.border} space-y-2 backdrop-blur-md`}
          >
            <div className="text-[11px] font-black text-black dark:text-zinc-200 uppercase tracking-wider">
              Your Unique Penpal ID
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xl font-black text-black dark:text-white tracking-wider">
                {currentUser.penpalId}
              </span>
              <button
                onClick={handleCopyId}
                className="px-3.5 py-1.5 rounded-lg text-xs font-black bg-black text-white dark:bg-white dark:text-black border-2 border-black dark:border-white flex items-center gap-1.5 hover:opacity-90 active:scale-95 transition-all shadow-2xs"
              >
                {copiedMyId ? <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMyId ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
            <p className="text-[11px] text-black dark:text-zinc-200 font-bold">
              Share this code with fellow writers so they can add you to their circle.
            </p>
          </div>

          {/* Get To Know Me Snippet */}
          <div className="relative z-10 space-y-2 text-xs text-black dark:text-zinc-100 pt-2 border-t-2 border-black/15 dark:border-white/10 font-bold">
            <div className="flex items-center gap-2">
              <Coffee className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Beverage of choice: <strong className="text-black dark:text-white font-black">{currentUser.favoriteDrink || 'Matcha Latte'}</strong></span>
            </div>
            <div className="flex items-start gap-2">
              <Quote className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
              <span className="italic text-black dark:text-zinc-100 font-bold">“{currentUser.favoriteQuote || 'Writing is thinking made visible.'}”</span>
            </div>
          </div>
        </div>

        {/* Card 2: Add Penpal Form */}
        <div
          style={glassStyle}
          className={`group relative p-6 rounded-2xl border-3 ${cardStyle.border} ${cardStyle.shadow} flex flex-col justify-between overflow-hidden backdrop-blur-md transition-all hover:-translate-y-0.5`}
        >
          {/* Frosted Glass Sheen Overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-white/30 dark:from-white/10 to-transparent pointer-events-none rounded-2xl"
            style={{ backgroundClip: 'padding-box', WebkitBackgroundClip: 'padding-box' }}
          />

          {/* Top Accent Strip Bar */}
          <div className={`absolute top-0 left-0 right-0 h-1.5 ${cardStyle.accentBar}`} />

          {/* Decorative Corner Theme Watermark Stamp */}
          <div className="absolute right-3.5 top-3.5 opacity-25 group-hover:opacity-50 text-black dark:text-white transition-opacity pointer-events-none">
            <ThemeMotifIcon themeId={themeId} className="w-4 h-4" />
          </div>

          <div className="space-y-4 relative z-10 pt-1">
            <div className="flex items-center gap-2 text-black dark:text-white font-display-chic text-lg font-black">
              <UserPlus className="w-5 h-5 text-pink-600 dark:text-pink-400 stroke-[2.5]" />
              <span>Connect with a Penpal</span>
            </div>

            <p className="text-xs text-black dark:text-zinc-200 font-bold leading-relaxed">
              Enter a friend's unique Penpal code (e.g. <code className="font-mono text-black dark:text-zinc-100 font-black bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded border border-black/20">PEN-8V2M9</code>). You can type with or without the "PEN-" prefix.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={inputPenpalId}
                  onChange={e => setInputPenpalId(e.target.value.toUpperCase())}
                  placeholder="e.g. PEN-8V2M9 or 8V2M9"
                  className="w-full sm:flex-1 min-w-0 px-4 py-2.5 rounded-xl text-sm font-mono uppercase font-black bg-white/90 dark:bg-zinc-800/90 text-black dark:text-white border-2 border-black/30 dark:border-white/20 outline-none focus:border-black dark:focus:border-white shadow-2xs placeholder:text-black/40"
                />
                <button
                  type="submit"
                  disabled={!inputPenpalId.trim() || isSubmitting}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-black bg-black text-white dark:bg-white dark:text-black disabled:opacity-40 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-xs border-2 border-black dark:border-white"
                >
                  <UserPlus className="w-4 h-4 stroke-[2.5]" />
                  <span>{isSubmitting ? 'Connecting...' : 'Add Friend'}</span>
                </button>
              </div>

              {statusMessage && (
                <div
                  className={`p-3 rounded-xl text-xs font-black border-2 ${
                    statusMessage.isError
                      ? 'bg-rose-100 text-rose-950 dark:bg-rose-950/70 dark:text-rose-200 border-rose-500'
                      : 'bg-emerald-100 text-emerald-950 dark:bg-emerald-950/70 dark:text-emerald-200 border-emerald-500'
                  }`}
                >
                  {statusMessage.text}
                </div>
              )}
            </form>
          </div>

          {/* Privacy Guarantee Note */}
          <div className="relative z-10 mt-6 pt-4 border-t-2 border-black/15 dark:border-white/10 flex items-start gap-2 text-[11px] text-black dark:text-zinc-200 font-bold">
            <ShieldAlert className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
            <span>
              <strong className="text-black dark:text-white font-black">Privacy Protection:</strong> Your email address is strictly hidden and never exposed to other writers. Only your display name, Penpal ID, and bio are shared.
            </span>
          </div>
        </div>
      </div>

      {/* Penpal Friends Roster */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-black dark:text-white stroke-[2.5]" />
            <h3 className="font-display-chic text-xl font-black text-black dark:text-white">
              My Penpal Circle ({renderedPenpals.length})
            </h3>
          </div>

          {renderedPenpals.length > 0 && (
            <button
              onClick={onOpenFeedForPenpals}
              className="text-xs font-black text-black dark:text-white underline decoration-2 hover:opacity-80 flex items-center gap-1"
            >
              <span>View Shared Pieces</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          )}
        </div>

        {renderedPenpals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {renderedPenpals.map(friend => (
              <div
                key={friend.id}
                style={glassStyle}
                className={`group relative p-5 rounded-2xl border-3 ${cardStyle.border} ${cardStyle.shadow} space-y-4 overflow-hidden backdrop-blur-md hover:-translate-y-1 transition-all duration-200`}
              >
                {/* Frosted Glass Sheen Overlay */}
                <div
                  className="absolute inset-0 bg-gradient-to-b from-white/35 dark:from-white/10 to-transparent pointer-events-none rounded-2xl"
                  style={{ backgroundClip: 'padding-box', WebkitBackgroundClip: 'padding-box' }}
                />

                {/* Top Accent Strip Bar matching active theme */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${cardStyle.accentBar}`} />

                {/* Decorative Corner Theme Watermark Stamp */}
                <div className="absolute right-3.5 top-3.5 opacity-25 group-hover:opacity-55 text-black dark:text-white transition-opacity pointer-events-none">
                  <ThemeMotifIcon themeId={themeId} className="w-4 h-4" />
                </div>

                <div className="flex items-center justify-between relative z-10 pt-1">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={friend.avatar}
                      alt={friend.displayName}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-black dark:ring-white shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-black text-sm text-black dark:text-white">
                        {friend.displayName}
                      </h4>
                      <span className="font-mono text-xs font-black text-pink-700 dark:text-pink-400">
                        {friend.penpalId}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removePenpal(friend.penpalId)}
                    className="p-1 rounded-lg text-black/60 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-100/50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Remove penpal"
                  >
                    <Trash2 className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>

                <p className="relative z-10 text-xs text-black dark:text-zinc-100 line-clamp-2 italic font-serif-literary font-bold">
                  “{friend.bio}”
                </p>

                <div className="relative z-10 pt-2 border-t-2 border-black/15 dark:border-white/10 space-y-1 text-[11px] text-black dark:text-zinc-200 font-bold">
                  <div>Coffee/Tea: <span className="text-black dark:text-white font-black">{friend.favoriteDrink}</span></div>
                  <div>Quote: <span className="text-black dark:text-white italic truncate block font-bold">“{friend.favoriteQuote}”</span></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={glassStyle}
            className={`p-8 rounded-2xl border-3 border-dashed ${cardStyle.border} text-center space-y-3 backdrop-blur-md`}
          >
            <Mail className="w-8 h-8 text-black/50 dark:text-zinc-400 mx-auto stroke-[2]" />
            <h4 className="text-sm font-black text-black dark:text-white">
              No Penpals in your circle yet
            </h4>
            <p className="text-xs text-black dark:text-zinc-200 max-w-sm mx-auto font-bold">
              Enter a writer's unique Penpal code above (e.g. <code className="font-mono text-pink-700 dark:text-pink-400 font-black">PEN-H</code> for Lead Developer H) to exchange slow letters!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

