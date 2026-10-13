import React, { useState, useEffect } from 'react';
import { WritingPiece } from '../types/writing';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { soundStudio, AmbientSoundMode } from '../services/soundStudio';
import { getThemeGlassCardStyle } from '../types/theme';
import { ThemeMotifIcon } from './ThemeIllustrations';
import {
  CloudRain,
  Coffee,
  Disc,
  Volume2,
  VolumeX,
  Target,
  Flame,
  Sparkles,
  Shuffle
} from 'lucide-react';

interface SoundWidgetProps {
  pieces: WritingPiece[];
  onSelectPrompt: (promptText: string) => void;
}

const CREATIVE_PROMPTS = [
  "Write about the light filtering through dusty blinds at 5:30 AM.",
  "Describe the exact scent of old paper and rain before a storm arrives.",
  "What if stars only whispered secrets to poets who wrote past midnight?",
  "A letter you penned three years ago that was never dropped into the mail slot.",
  "The quiet rhythm of two teacups touching in an otherwise silent room.",
  "A confession buried beneath four layers of metaphor and velvet ribbons."
];

export const SoundWidget: React.FC<SoundWidgetProps> = ({
  pieces,
  onSelectPrompt
}) => {
  const { currentUser, updateProfile } = useAuth();
  const { mode, theme, themeId } = useTheme();

  const [activeSound, setActiveSound] = useState<AmbientSoundMode>('off');
  const [volume, setVolume] = useState<number>(0.5);
  const [promptIdx, setPromptIdx] = useState(0);

  const cardStyle = mode === 'light' ? theme.light.card : theme.dark.card;
  const glassStyle = getThemeGlassCardStyle(themeId, mode);

  useEffect(() => {
    setActiveSound(soundStudio.getMode());
    setVolume(soundStudio.getVolume());
  }, []);

  const handleToggleSound = (mode: AmbientSoundMode) => {
    if (activeSound === mode) {
      soundStudio.stop();
      setActiveSound('off');
    } else {
      soundStudio.play(mode);
      setActiveSound(mode);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    soundStudio.setVolume(val);
  };

  // Calculate today's word count by active user
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const wordsWrittenToday = pieces
    .filter(p => {
      const isMe = p.authorId === currentUser.id || p.authorEmail === currentUser.email;
      const pieceDate = new Date(p.updatedAt || p.createdAt);
      return isMe && pieceDate >= todayStart;
    })
    .reduce((sum, p) => sum + (p.wordCount || 0), 0);

  const goalWords = currentUser.writingGoalWords || 500;
  const progressPercent = Math.min(100, Math.round((wordsWrittenToday / goalWords) * 100));

  // Writing streak estimation
  const uniqueDates = new Set(
    pieces
      .filter(p => p.authorId === currentUser.id || p.authorEmail === currentUser.email)
      .map(p => new Date(p.createdAt).toDateString())
  );
  const streakCount = Math.max(1, uniqueDates.size);

  const handleNextPrompt = () => {
    setPromptIdx(prev => (prev + 1) % CREATIVE_PROMPTS.length);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Studio Banner with Writing Log Glass Depth */}
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

        <div className="relative z-10 max-w-xl space-y-2 pt-1">
          <div className="flex items-center gap-2 text-xs font-black">
            <span className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-black tracking-wider ${cardStyle.badgeBg} ${cardStyle.badgeText} border border-black/20 flex items-center gap-1.5`}>
              <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Atmospheric Studio & Daily Habits</span>
            </span>
          </div>

          <h2 className="font-display-chic text-2xl md:text-3xl font-black text-black dark:text-white">
            Writing Ambiance & Mindfulness
          </h2>

          <p className="font-serif-literary text-black dark:text-zinc-100 text-base leading-relaxed font-bold">
            Procedural sound synthesis directly in your browser. Fully offline with zero audio downloads.
          </p>
        </div>

        <div className="absolute right-4 bottom-2 text-black/15 dark:text-white/15 opacity-60 pointer-events-none" aria-hidden="true">
          <ThemeMotifIcon themeId={themeId} className="w-28 h-28" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Ambient Sound Synthesizer */}
        <div
          style={glassStyle}
          className={`group relative p-6 rounded-2xl border-3 ${cardStyle.border} ${cardStyle.shadow} space-y-6 overflow-hidden backdrop-blur-md transition-all hover:-translate-y-0.5`}
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

          <div className="flex items-center justify-between relative z-10 pt-1">
            <div className="flex items-center gap-2">
              <Disc className="w-5 h-5 text-indigo-700 dark:text-indigo-400 stroke-[2.5]" />
              <h3 className="font-display-chic text-lg font-black text-black dark:text-white">
                Ambient Sound Studio
              </h3>
            </div>

            <span className={`text-[10px] px-2.5 py-1 rounded-full uppercase font-black ${cardStyle.badgeBg} ${cardStyle.badgeText} border border-black/20`}>
              Web Audio Synth
            </span>
          </div>

          {/* Sound Presets Styled as Mini Glass Cards */}
          <div className="grid grid-cols-3 gap-3 relative z-10">
            {/* Rain */}
            <button
              onClick={() => handleToggleSound('rain')}
              className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 border-2 transition-all font-black shadow-2xs active:scale-95 ${
                activeSound === 'rain'
                  ? 'border-black bg-indigo-500 text-white dark:bg-indigo-600 shadow-sm ring-2 ring-indigo-400/50'
                  : `border-black/30 dark:border-white/20 hover:border-black bg-white/70 dark:bg-zinc-800/70 text-black dark:text-zinc-200`
              }`}
            >
              <CloudRain className="w-6 h-6 stroke-[2.5]" />
              <span className="text-xs">Gentle Rain</span>
              {activeSound === 'rain' && <span className="text-[10px] uppercase font-black tracking-wider">Active</span>}
            </button>

            {/* Cafe */}
            <button
              onClick={() => handleToggleSound('cafe')}
              className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 border-2 transition-all font-black shadow-2xs active:scale-95 ${
                activeSound === 'cafe'
                  ? 'border-black bg-amber-600 text-white dark:bg-amber-600 shadow-sm ring-2 ring-amber-400/50'
                  : `border-black/30 dark:border-white/20 hover:border-black bg-white/70 dark:bg-zinc-800/70 text-black dark:text-zinc-200`
              }`}
            >
              <Coffee className="w-6 h-6 stroke-[2.5]" />
              <span className="text-xs">Cozy Café</span>
              {activeSound === 'cafe' && <span className="text-[10px] uppercase font-black tracking-wider">Active</span>}
            </button>

            {/* Vinyl */}
            <button
              onClick={() => handleToggleSound('vinyl')}
              className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 border-2 transition-all font-black shadow-2xs active:scale-95 ${
                activeSound === 'vinyl'
                  ? 'border-black bg-purple-600 text-white dark:bg-purple-600 shadow-sm ring-2 ring-purple-400/50'
                  : `border-black/30 dark:border-white/20 hover:border-black bg-white/70 dark:bg-zinc-800/70 text-black dark:text-zinc-200`
              }`}
            >
              <Disc className="w-6 h-6 stroke-[2.5]" />
              <span className="text-xs">Lo-Fi Vinyl</span>
              {activeSound === 'vinyl' && <span className="text-[10px] uppercase font-black tracking-wider">Active</span>}
            </button>
          </div>

          {/* Volume Control */}
          <div className="space-y-2 pt-2 border-t-2 border-black/15 dark:border-white/10 relative z-10">
            <div className="flex items-center justify-between text-xs text-black dark:text-zinc-200 font-black">
              <span className="flex items-center gap-1.5">
                {volume > 0 ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span>Volume</span>
              </span>
              <span className="font-mono text-black dark:text-white font-black">{Math.round(volume * 100)}%</span>
            </div>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full accent-black dark:accent-pink-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Card 2: Daily Word Goal & Streak */}
        <div
          style={glassStyle}
          className={`group relative p-6 rounded-2xl border-3 ${cardStyle.border} ${cardStyle.shadow} space-y-6 overflow-hidden backdrop-blur-md transition-all hover:-translate-y-0.5`}
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

          <div className="flex items-center justify-between relative z-10 pt-1">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-pink-600 dark:text-pink-400 stroke-[2.5]" />
              <h3 className="font-display-chic text-lg font-black text-black dark:text-white">
                Daily Word Goal & Streak
              </h3>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-black border-2 border-black text-xs font-black shadow-2xs">
              <Flame className="w-3.5 h-3.5 fill-current stroke-[2]" />
              <span>{streakCount} Day Streak</span>
            </div>
          </div>

          {/* Progress Bar with Theme Accent */}
          <div className="space-y-3 relative z-10">
            <div className="flex items-end justify-between">
              <div>
                <span className="font-mono text-3xl font-black text-black dark:text-white">
                  {wordsWrittenToday}
                </span>
                <span className="text-black/80 dark:text-zinc-300 font-black text-sm ml-1.5">/ {goalWords} words</span>
              </div>
              <span className="font-mono text-sm font-black text-black dark:text-white">
                {progressPercent}%
              </span>
            </div>

            {/* Clean Progress Track */}
            <div className="h-4 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden border-2 border-black/30 dark:border-white/20 p-0.5">
              <div
                className={`h-full ${cardStyle.accentBar} rounded-full transition-all duration-500`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="text-xs text-black dark:text-zinc-200 font-bold">
              {progressPercent >= 100
                ? 'Target reached! Your creative output is shining today.'
                : `${goalWords - wordsWrittenToday} more words to complete today's milestone.`}
            </p>
          </div>

          {/* Quick Target Changer */}
          <div className="flex items-center justify-between pt-4 border-t-2 border-black/15 dark:border-white/10 text-xs text-black dark:text-zinc-200 font-black relative z-10">
            <span>Change goal:</span>
            <div className="flex items-center gap-1.5">
              {[300, 500, 1000].map(words => (
                <button
                  key={words}
                  onClick={() => updateProfile({ writingGoalWords: words })}
                  className={`px-3 py-1.5 rounded-lg border-2 transition-all font-black ${
                    goalWords === words
                      ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-2xs'
                      : 'bg-white/70 dark:bg-zinc-800/70 text-black dark:text-zinc-200 border-black/30 dark:border-white/20 hover:border-black'
                  }`}
                >
                  {words}w
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Writing Prompt Generator Card */}
      <div
        style={glassStyle}
        className={`group relative p-6 rounded-2xl border-3 ${cardStyle.border} ${cardStyle.shadow} space-y-4 overflow-hidden backdrop-blur-md transition-all hover:-translate-y-0.5`}
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

        <div className="flex items-center justify-between relative z-10 pt-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-600 dark:text-pink-400 stroke-[2.5]" />
            <h4 className="font-display-chic text-base font-black text-black dark:text-white">
              Spark of Inspiration
            </h4>
          </div>

          <button
            onClick={handleNextPrompt}
            className="text-xs font-black text-black dark:text-white underline decoration-2 hover:opacity-80 flex items-center gap-1.5"
          >
            <Shuffle className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Next Prompt</span>
          </button>
        </div>

        <blockquote
          style={glassStyle}
          className={`relative z-10 font-serif-literary text-lg md:text-xl text-black dark:text-zinc-100 italic p-5 rounded-xl border-2 ${cardStyle.border} font-bold shadow-2xs backdrop-blur-md`}
        >
          “{CREATIVE_PROMPTS[promptIdx]}”
        </blockquote>

        <div className="flex justify-end relative z-10">
          <button
            onClick={() => onSelectPrompt(CREATIVE_PROMPTS[promptIdx])}
            className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-black dark:bg-white dark:text-black hover:opacity-90 active:scale-95 transition-all shadow-xs border-2 border-black dark:border-white"
          >
            Write from this Prompt
          </button>
        </div>
      </div>
    </div>
  );
};

