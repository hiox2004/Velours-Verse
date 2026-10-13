import React from 'react';
import { WritingPiece } from '../types/writing';
import { AestheticThemeId } from '../types/theme';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeMotifIcon } from './ThemeIllustrations';
import {
  Star,
  MessageCircle,
  Lock,
  Globe,
  Mail,
  Printer,
  Download,
  Trash2
} from 'lucide-react';

interface WritingCardProps {
  piece: WritingPiece;
  onClick: () => void;
  onToggleStar: (e: React.MouseEvent) => void;
  onPrint: (e: React.MouseEvent) => void;
  onDownload: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
}

export const WritingCard: React.FC<WritingCardProps> = ({
  piece,
  onClick,
  onToggleStar,
  onPrint,
  onDownload,
  onDelete
}) => {
  const { currentUser, isDeveloper } = useAuth();
  const { mode, themeId, theme } = useTheme();

  // Active theme-consistent card styling (No random color switching, 100% theme unified)
  const cardStyle = mode === 'light' ? theme.light.card : theme.dark.card;

  const isOwner = currentUser.id === piece.authorId || currentUser.email === piece.authorEmail;
  const canDelete = isOwner || isDeveloper;

  const formattedDate = new Date(piece.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const typeLabels: Record<string, string> = {
    poem: 'Poem',
    story: 'Short Story',
    prose: 'Prose',
    journal: 'Journal'
  };

  // Dynamic background gradients based on selected theme for glassmorphism
  const themeGradients: Record<AestheticThemeId, { light: string; dark: string; borderGlow: string }> = {
    coquette: {
      light: 'linear-gradient(135deg, rgba(255, 240, 245, 0.94) 0%, rgba(253, 226, 236, 0.82) 50%, rgba(255, 245, 248, 0.92) 100%)',
      dark: 'linear-gradient(135deg, rgba(36, 16, 27, 0.92) 0%, rgba(74, 21, 49, 0.78) 50%, rgba(20, 10, 15, 0.94) 100%)',
      borderGlow: 'rgba(190, 24, 93, 0.35)'
    },
    y2k: {
      light: 'linear-gradient(135deg, rgba(238, 242, 255, 0.94) 0%, rgba(224, 231, 255, 0.82) 50%, rgba(238, 242, 255, 0.92) 100%)',
      dark: 'linear-gradient(135deg, rgba(17, 23, 46, 0.92) 0%, rgba(30, 41, 88, 0.78) 50%, rgba(8, 10, 20, 0.94) 100%)',
      borderGlow: 'rgba(67, 56, 202, 0.35)'
    },
    matcha: {
      light: 'linear-gradient(135deg, rgba(240, 253, 244, 0.94) 0%, rgba(220, 252, 231, 0.82) 50%, rgba(240, 253, 244, 0.92) 100%)',
      dark: 'linear-gradient(135deg, rgba(20, 36, 22, 0.92) 0%, rgba(27, 59, 31, 0.78) 50%, rgba(10, 18, 11, 0.94) 100%)',
      borderGlow: 'rgba(21, 128, 61, 0.35)'
    },
    midnight: {
      light: 'linear-gradient(135deg, rgba(250, 245, 255, 0.94) 0%, rgba(237, 233, 254, 0.82) 50%, rgba(250, 245, 255, 0.92) 100%)',
      dark: 'linear-gradient(135deg, rgba(18, 20, 36, 0.92) 0%, rgba(37, 32, 77, 0.78) 50%, rgba(8, 9, 16, 0.94) 100%)',
      borderGlow: 'rgba(107, 33, 168, 0.35)'
    }
  };

  const dynamicBg = mode === 'light' ? themeGradients[themeId].light : themeGradients[themeId].dark;

  return (
    <article
      onClick={onClick}
      style={{
        backgroundImage: dynamicBg,
        backgroundClip: 'padding-box',
        WebkitBackgroundClip: 'padding-box',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)'
      }}
      className={`group relative rounded-2xl border-3 p-5 transition-all duration-200 cursor-pointer hover:-translate-y-1 ${cardStyle.border} ${cardStyle.shadow} flex flex-col justify-between overflow-hidden backdrop-blur-md`}
    >
      {/* Frosted Glass Sheen Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-white/35 dark:from-white/10 to-transparent pointer-events-none rounded-2xl"
        style={{ backgroundClip: 'padding-box', WebkitBackgroundClip: 'padding-box' }}
      />

      {/* Top Accent Strip Bar matching active theme */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${cardStyle.accentBar}`} />

      {/* Decorative Corner Theme Watermark Stamp */}
      <div className="absolute right-3.5 top-3.5 opacity-30 group-hover:opacity-60 text-black dark:text-white transition-opacity pointer-events-none">
        <ThemeMotifIcon themeId={themeId} className="w-4 h-4" />
      </div>

      <div>
        {/* Top Metadata & Visibility (Solid, High-Contrast Black Text) */}
        <div className="flex items-center justify-between text-xs text-black dark:text-zinc-200 font-bold mb-2.5 pt-1 pr-6">
          {/* Metadata */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${cardStyle.badgeBg} ${cardStyle.badgeText} border border-black/20`}>
              {typeLabels[piece.type] || 'Piece'}
            </span>
            <span aria-hidden="true" className="text-black dark:text-zinc-400 font-black">·</span>
            <span className="text-black dark:text-zinc-200 font-black">{piece.wordCount} words</span>
            <span aria-hidden="true" className="text-black dark:text-zinc-400 font-black">·</span>
            <span className="text-black dark:text-zinc-200 font-black">{piece.readTimeMinutes} min read</span>
          </div>

          {/* Status Visibility Indicator */}
          <div className="flex items-center gap-1 text-[11px] font-black shrink-0">
            {piece.status === 'draft' && (
              <span className="flex items-center gap-1 text-amber-950 dark:text-amber-300 bg-amber-200 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border-2 border-amber-500 font-black">
                <Lock className="w-3 h-3 stroke-[3]" />
                <span>Draft</span>
              </span>
            )}
            {piece.status === 'penpals' && (
              <span className="flex items-center gap-1 text-pink-950 dark:text-pink-200 bg-pink-200 dark:bg-pink-950/60 px-2 py-0.5 rounded-full border-2 border-pink-500 font-black">
                <Mail className="w-3 h-3 stroke-[3]" />
                <span>Penpals</span>
              </span>
            )}
            {piece.status === 'published' && (
              <span className="flex items-center gap-1 text-emerald-950 dark:text-emerald-200 bg-emerald-200 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border-2 border-emerald-500 font-black">
                <Globe className="w-3 h-3 stroke-[3]" />
                <span>Public</span>
              </span>
            )}
          </div>
        </div>

        {/* Title in Deep Solid Black Display Typography */}
        <h3 className="font-display-chic text-xl font-black tracking-tight text-black dark:text-white mb-2 leading-snug line-clamp-1">
          {piece.title}
        </h3>

        {/* Excerpt Snippet with Solid Jet Black Color (Never Gray!) */}
        <p className="font-serif-literary text-base text-black dark:text-zinc-100 font-bold line-clamp-3 leading-relaxed mb-4">
          {piece.content}
        </p>

        {/* Mood Tags (Solid Black Text) */}
        {piece.moodTags && piece.moodTags.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-black dark:text-zinc-200 mb-4 flex-wrap font-black">
            <span className="text-black dark:text-zinc-300 font-black">Mood:</span>
            {piece.moodTags.map((tag, idx) => (
              <span key={idx} className="italic text-black dark:text-white font-black underline decoration-black/40 underline-offset-2">
                #{tag}
                {idx < piece.moodTags.length - 1 && <span className="not-italic ml-1 text-black dark:text-zinc-400 no-underline">·</span>}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Footer: Author credit, Stars, Comments, and Quick Actions */}
      <div className="pt-3 border-t-2 border-black/20 dark:border-white/15 flex items-center justify-between gap-2 mt-auto flex-wrap">
        {/* Author display name & Penpal ID (Privacy Guaranteed: never show email) */}
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={piece.authorAvatar}
            alt={piece.authorDisplayName}
            className="w-7 h-7 rounded-full object-cover shrink-0 ring-2 ring-black dark:ring-white"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0 text-xs">
            <span className="font-black text-black dark:text-white block truncate max-w-[110px] sm:max-w-[140px]">
              {piece.authorDisplayName}
            </span>
            <span className="text-black dark:text-zinc-300 text-[11px] font-black block">
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Interactive Actions (Stars, Comments, Print, Download, Delete) */}
        <div className="flex items-center gap-1 shrink-0 ml-auto" onClick={e => e.stopPropagation()}>
          {/* Star Button */}
          <button
            onClick={onToggleStar}
            className={`min-h-[30px] px-2 sm:px-2.5 py-1 rounded-xl text-xs flex items-center gap-1 sm:gap-1.5 border-2 transition-all font-black ${
              piece.starredByMe
                ? `${cardStyle.starActiveBg} ${cardStyle.starActiveText} border-black shadow-xs`
                : 'text-black dark:text-white bg-white/80 dark:bg-zinc-800/80 border-black/30 dark:border-white/30 hover:border-black'
            }`}
            title="Star piece"
          >
            <Star className={`w-3.5 h-3.5 ${piece.starredByMe ? 'fill-current' : ''}`} />
            <span className="font-mono tabular-nums">{piece.stars}</span>
          </button>

          {/* Comment Count Button */}
          <button
            onClick={onClick}
            className="min-h-[30px] px-2 sm:px-2.5 py-1 rounded-xl text-xs font-black text-black dark:text-white bg-white/80 dark:bg-zinc-800/80 border-2 border-black/30 dark:border-white/30 hover:border-black flex items-center gap-1 sm:gap-1.5 transition-colors"
            title="View comments"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="font-mono tabular-nums">{piece.comments?.length || 0}</span>
          </button>

          {/* Quick Print */}
          <button
            onClick={onPrint}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl text-black dark:text-white bg-white/80 dark:bg-zinc-800/80 border-2 border-black/30 dark:border-white/30 hover:border-black flex items-center justify-center transition-colors"
            title="Print piece cleanly"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>

          {/* Quick Download */}
          <button
            onClick={onDownload}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl text-black dark:text-white bg-white/80 dark:bg-zinc-800/80 border-2 border-black/30 dark:border-white/30 hover:border-black flex items-center justify-center transition-colors"
            title="Download text / markdown"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Delete Action (Owner or Dev God Mode) */}
          {canDelete && onDelete && (
            <button
              onClick={onDelete}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl text-rose-700 dark:text-rose-400 bg-white/80 dark:bg-zinc-800/80 border-2 border-rose-300 hover:bg-rose-100 flex items-center justify-center transition-colors"
              title="Delete piece"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
