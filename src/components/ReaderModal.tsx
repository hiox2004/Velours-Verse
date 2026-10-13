import React, { useState } from 'react';
import { WritingPiece } from '../types/writing';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { CARD_TINT_OPTIONS, getThemeGlassCardStyle } from '../types/theme';
import { ThemeMotifIcon } from './ThemeIllustrations';
import {
  X,
  Star,
  MessageCircle,
  Printer,
  Download,
  Edit3,
  Lock,
  Globe,
  Mail,
  Send,
  Share2,
  Check,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface ReaderModalProps {
  piece: WritingPiece | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (piece: WritingPiece) => void;
  onToggleStar: (pieceId: string) => void;
  onAddComment: (pieceId: string, text: string) => void;
  onPrintPreview: (piece: WritingPiece) => void;
}

export const ReaderModal: React.FC<ReaderModalProps> = ({
  piece,
  isOpen,
  onClose,
  onEdit,
  onToggleStar,
  onAddComment,
  onPrintPreview
}) => {
  const { currentUser, isDeveloper } = useAuth();
  const { mode, themeId, theme } = useTheme();

  const [commentText, setCommentText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'extra'>('large');

  if (!isOpen || !piece) return null;

  const isOwner = currentUser.id === piece.authorId || currentUser.email === piece.authorEmail;
  const canEdit = isOwner || isDeveloper;

  const cardStyle = mode === 'light' ? theme.light.card : theme.dark.card;
  const glassStyle = getThemeGlassCardStyle(themeId, mode);

  const tint = CARD_TINT_OPTIONS.find(t => t.id === piece.cardTint) || CARD_TINT_OPTIONS[0];

  const formattedDate = new Date(piece.createdAt).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const handleDownload = (format: 'md' | 'txt') => {
    let textToExport = '';
    if (format === 'md') {
      textToExport = `# ${piece.title}\n*by ${piece.authorDisplayName} (${piece.authorPenpalId})*\n*Date: ${formattedDate}*\n\n${piece.content}\n\n---\n*Archived in Velours & Verse*`;
    } else {
      textToExport = `${piece.title.toUpperCase()}\nBy ${piece.authorDisplayName} (${piece.authorPenpalId})\nDate: ${formattedDate}\n\n${piece.content}\n\n[Velours & Verse]`;
    }

    const blob = new Blob([textToExport], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${piece.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.${format}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(
      `"${piece.title}" by ${piece.authorDisplayName} on Velours & Verse (${piece.authorPenpalId})\n\n${piece.content.slice(0, 120)}...`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(piece.id, commentText.trim());
    setCommentText('');
  };

  const fontSizeClass =
    fontSize === 'normal'
      ? 'text-base md:text-lg leading-relaxed'
      : fontSize === 'large'
      ? 'text-lg md:text-xl leading-loose'
      : 'text-xl md:text-2xl leading-loose';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 no-print">
      <div
        style={glassStyle}
        className={`w-full h-full md:h-auto md:max-h-[92vh] md:max-w-3xl md:rounded-3xl border-3 ${cardStyle.border} ${cardStyle.shadow} flex flex-col overflow-hidden relative shadow-2xl backdrop-blur-xl`}
      >
        {/* Frosted Glass Sheen Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-white/35 dark:from-white/10 to-transparent pointer-events-none rounded-3xl"
          style={{ backgroundClip: 'padding-box', WebkitBackgroundClip: 'padding-box' }}
        />

        {/* Top Accent Strip Bar matching active theme */}
        <div className={`h-2 w-full ${cardStyle.accentBar} shrink-0`} />

        {/* Corner Theme Motif Watermark */}
        <div className="absolute right-4 top-4 opacity-20 dark:opacity-30 text-black dark:text-white pointer-events-none z-10">
          <ThemeMotifIcon themeId={themeId} className="w-16 h-16" />
        </div>

        {/* Sticky Reader Top Bar */}
        <div className="px-5 py-4 border-b-2 border-black/15 dark:border-white/10 flex items-center justify-between gap-4 shrink-0 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md relative z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center border-2 border-black/30 dark:border-white/20 shadow-2xs">
              <ThemeMotifIcon themeId={themeId} className="w-4 h-4 text-black dark:text-white" />
            </div>
            <div className="text-xs text-black dark:text-zinc-200 font-black">
              <span className={`px-2 py-0.5 rounded-lg text-[10px] uppercase font-black tracking-wider ${cardStyle.badgeBg} ${cardStyle.badgeText} border border-black/20 mr-1.5`}>
                {piece.type}
              </span>
              <span>{piece.wordCount} words</span>
              <span aria-hidden="true" className="mx-1 text-black/50 dark:text-zinc-400">·</span>
              <span>{piece.readTimeMinutes} min read</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Font Size Selector */}
            <div className="hidden sm:flex items-center bg-white/90 dark:bg-zinc-800/90 rounded-xl p-0.5 text-xs font-black border-2 border-black/30 dark:border-white/20 shadow-2xs">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  fontSize === 'normal'
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-2xs'
                    : 'text-black dark:text-zinc-300 hover:text-black'
                }`}
                title="Normal text"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  fontSize === 'large'
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-2xs'
                    : 'text-black dark:text-zinc-300 hover:text-black'
                }`}
                title="Large text"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('extra')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  fontSize === 'extra'
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-2xs'
                    : 'text-black dark:text-zinc-300 hover:text-black'
                }`}
                title="Extra large text"
              >
                A++
              </button>
            </div>

            {/* Print Button */}
            <button
              onClick={() => onPrintPreview(piece)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-black dark:text-zinc-200 bg-white/90 dark:bg-zinc-800/90 border-2 border-black/30 dark:border-white/20 hover:scale-105 active:scale-95 transition-all shadow-2xs"
              title="Print publication page"
            >
              <Printer className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Download */}
            <button
              onClick={() => handleDownload('md')}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-black dark:text-zinc-200 bg-white/90 dark:bg-zinc-800/90 border-2 border-black/30 dark:border-white/20 hover:scale-105 active:scale-95 transition-all shadow-2xs"
              title="Download as Markdown"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Share Snippet */}
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-black dark:text-zinc-200 bg-white/90 dark:bg-zinc-800/90 border-2 border-black/30 dark:border-white/20 hover:scale-105 active:scale-95 transition-all shadow-2xs"
              title="Copy snippet"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> : <Share2 className="w-4 h-4 stroke-[2.5]" />}
            </button>

            {/* Edit Button */}
            {canEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(piece);
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-black bg-black text-white dark:bg-white dark:text-black hover:opacity-90 active:scale-95 flex items-center gap-1.5 transition-all border-2 border-black dark:border-white shadow-2xs"
              >
                <Edit3 className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Edit</span>
              </button>
            )}

            {/* Close */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors ml-1 font-black"
              aria-label="Close"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Scrollable Reader Body with Rich Themed Depth */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 relative z-20">
          {/* Author & Visibility Themed Card */}
          <div
            style={glassStyle}
            className={`p-4 rounded-2xl border-2 ${cardStyle.border} flex items-center justify-between gap-4 shadow-2xs backdrop-blur-md`}
          >
            <div className="flex items-center gap-3">
              <img
                src={piece.authorAvatar}
                alt={piece.authorDisplayName}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-black dark:ring-white shadow-sm"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="font-black text-sm text-black dark:text-white flex items-center gap-1.5">
                  {piece.authorDisplayName}
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${cardStyle.badgeBg} ${cardStyle.badgeText} border border-black/10`}>
                    Author
                  </span>
                </h4>
                <div className="text-xs text-black dark:text-zinc-200 flex items-center gap-1.5 font-bold">
                  <span>Penpal ID: <strong className="font-mono text-pink-700 dark:text-pink-400 font-black">{piece.authorPenpalId}</strong></span>
                  <span aria-hidden="true" className="text-black/50 dark:text-zinc-400">·</span>
                  <span>{formattedDate}</span>
                </div>
              </div>
            </div>

            <div className="text-xs font-black shrink-0">
              {piece.status === 'draft' && (
                <span className="flex items-center gap-1 text-amber-950 dark:text-amber-300 bg-amber-200 dark:bg-amber-950/70 px-2.5 py-1 rounded-full border-2 border-amber-500 font-black shadow-2xs">
                  <Lock className="w-3.5 h-3.5 stroke-[2.5]" /> Draft
                </span>
              )}
              {piece.status === 'penpals' && (
                <span className="flex items-center gap-1 text-pink-950 dark:text-pink-200 bg-pink-200 dark:bg-pink-950/70 px-2.5 py-1 rounded-full border-2 border-pink-500 font-black shadow-2xs">
                  <Mail className="w-3.5 h-3.5 stroke-[2.5]" /> Penpals Only
                </span>
              )}
              {piece.status === 'published' && (
                <span className="flex items-center gap-1 text-emerald-950 dark:text-emerald-200 bg-emerald-200 dark:bg-emerald-950/70 px-2.5 py-1 rounded-full border-2 border-emerald-500 font-black shadow-2xs">
                  <Globe className="w-3.5 h-3.5 stroke-[2.5]" /> Published
                </span>
              )}
            </div>
          </div>

          {/* Piece Title & Mood Ribbon */}
          <div className="space-y-3">
            <h1 className="font-display-chic text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-black dark:text-white leading-tight">
              {piece.title}
            </h1>

            {/* Mood Tags */}
            {piece.moodTags && piece.moodTags.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-black dark:text-zinc-200 flex-wrap font-black">
                <span className="text-black/70 dark:text-zinc-400 font-black flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                  <span>Mood:</span>
                </span>
                {piece.moodTags.map((tag, idx) => (
                  <span key={idx} className="italic text-black dark:text-white font-black underline decoration-black/40">
                    #{tag}
                    {idx < piece.moodTags.length - 1 && <span className="not-italic ml-1 text-black/50 no-underline">·</span>}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Decorative Literary Fleuron Divider */}
          <div className="flex items-center justify-center gap-3 py-2 text-black/40 dark:text-white/40">
            <div className="h-px flex-1 bg-black/15 dark:bg-white/15" />
            <span className="text-sm tracking-widest font-serif-literary">❦ ✦ ❦</span>
            <div className="h-px flex-1 bg-black/15 dark:bg-white/15" />
          </div>

          {/* Literary Body Text with Exquisite Paper Contrast */}
          <div className={`font-serif-literary text-black dark:text-zinc-100 whitespace-pre-wrap ${fontSizeClass} font-medium tracking-normal select-text`}>
            {piece.content}
          </div>

          {/* Closing Fleur-de-lis Motif */}
          <div className="flex items-center justify-center gap-3 py-4 text-black/40 dark:text-white/40">
            <div className="h-px flex-1 bg-black/15 dark:bg-white/15" />
            <ThemeMotifIcon themeId={themeId} className="w-4 h-4 text-black/40 dark:text-white/40" />
            <div className="h-px flex-1 bg-black/15 dark:bg-white/15" />
          </div>

          {/* Interactive Star & Social Strip */}
          <div className="pt-4 border-t-2 border-black/15 dark:border-white/10 flex items-center justify-between">
            <button
              onClick={() => onToggleStar(piece.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 transition-all active:scale-95 border-2 shadow-xs ${
                piece.starredByMe
                  ? `${cardStyle.starActiveBg} ${cardStyle.starActiveText} border-black shadow-md`
                  : 'bg-white/90 dark:bg-zinc-800/90 text-black dark:text-white border-black/30 dark:border-white/20 hover:border-black'
              }`}
            >
              <Star className={`w-4 h-4 stroke-[2.5] ${piece.starredByMe ? 'fill-current' : ''}`} />
              <span>{piece.starredByMe ? 'Starred in Collection' : 'Star this work'}</span>
              <span className="font-mono tabular-nums">({piece.stars})</span>
            </button>

            <span className="text-xs text-black dark:text-zinc-200 font-black flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{piece.comments?.length || 0} thoughtful reflections</span>
            </span>
          </div>

          {/* Comments & Reflections Section */}
          <div className="pt-6 space-y-4">
            <h3 className="font-display-chic text-lg font-black text-black dark:text-white flex items-center gap-2">
              <MessageCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Comments & Reflections</span>
            </h3>

            {/* Comment Input */}
            <form onSubmit={handleSubmitComment} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Leave an encouraging reflection or poetic note..."
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/90 dark:bg-zinc-800/90 text-black dark:text-white border-2 border-black/40 dark:border-white/20 outline-none focus:border-black dark:focus:border-white shadow-2xs placeholder:text-black/50 dark:placeholder:text-zinc-400"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-5 py-2.5 rounded-xl text-xs font-black bg-black text-white dark:bg-white dark:text-black disabled:opacity-40 hover:opacity-90 active:scale-95 flex items-center gap-1.5 transition-all shadow-xs border-2 border-black dark:border-white shrink-0"
              >
                <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Post</span>
              </button>
            </form>

            {/* Comment List Themed Cards */}
            <div className="space-y-3 pt-2">
              {piece.comments && piece.comments.length > 0 ? (
                piece.comments.map(c => (
                  <div
                    key={c.id}
                    style={glassStyle}
                    className={`relative p-4 rounded-2xl border-2 ${cardStyle.border} space-y-1.5 shadow-2xs backdrop-blur-md overflow-hidden`}
                  >
                    {/* Mini Accent Bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1 ${cardStyle.accentBar}`} />

                    <div className="flex items-center justify-between text-xs pt-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-black dark:text-white">
                          {c.authorDisplayName}
                        </span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${cardStyle.badgeBg} ${cardStyle.badgeText} border border-black/10`}>
                          Reflection
                        </span>
                      </div>
                      <span className="text-[11px] text-black/70 dark:text-zinc-400 font-bold">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-black dark:text-zinc-200 leading-relaxed font-bold">
                      {c.text}
                    </p>
                  </div>
                ))
              ) : (
                <div
                  style={glassStyle}
                  className={`p-6 rounded-2xl border-2 ${cardStyle.border} text-center space-y-1 backdrop-blur-md`}
                >
                  <p className="text-xs text-black/80 dark:text-zinc-300 italic font-bold">
                    No reflections yet. Be the first penpal to share a thought!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

