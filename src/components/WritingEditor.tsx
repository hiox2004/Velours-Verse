import React, { useState, useEffect } from 'react';
import { WritingPiece, WritingType, WritingStatus } from '../types/writing';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { CARD_TINT_OPTIONS, getThemeGlassCardStyle } from '../types/theme';
import { ThemeMotifIcon } from './ThemeIllustrations';
import {
  X,
  Check,
  Lock,
  Globe,
  Mail,
  Printer,
  Sparkles,
  Tag,
  Palette
} from 'lucide-react';

interface WritingEditorProps {
  initialPiece?: WritingPiece | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (piece: WritingPiece) => void;
  onPrintPreview?: (piece: WritingPiece) => void;
}

const PRESET_MOOD_TAGS = [
  'Ethereal',
  'Melancholy',
  'Nostalgic',
  'Midnight Thoughts',
  'Autumn Rain',
  'Matcha Calm',
  'Cyber Dream',
  'Romantic',
  'Hopeful'
];

export const WritingEditor: React.FC<WritingEditorProps> = ({
  initialPiece,
  isOpen,
  onClose,
  onSave,
  onPrintPreview
}) => {
  const { currentUser } = useAuth();
  const { mode, theme, themeId } = useTheme();

  const cardStyle = mode === 'light' ? theme.light.card : theme.dark.card;
  const glassStyle = getThemeGlassCardStyle(themeId, mode);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<WritingType>('poem');
  const [status, setStatus] = useState<WritingStatus>('published');
  const [cardTint, setCardTint] = useState('default');
  const [moodTags, setMoodTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [hasRestoredDraft, setHasRestoredDraft] = useState(false);
  const [lastAutoSavedAt, setLastAutoSavedAt] = useState<string | null>(null);

  const DRAFT_KEY = 'velours_editor_autosave_draft';

  useEffect(() => {
    if (initialPiece) {
      setTitle(initialPiece.title);
      setContent(initialPiece.content);
      setType(initialPiece.type);
      setStatus(initialPiece.status);
      setCardTint(initialPiece.cardTint || 'default');
      setMoodTags(initialPiece.moodTags || []);
      setHasRestoredDraft(false);
    } else {
      // Check if there is an unsaved draft from a previous session
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.title || parsed.content) {
            setTitle(parsed.title || '');
            setContent(parsed.content || '');
            setType(parsed.type || 'poem');
            setStatus(parsed.status || 'published');
            setCardTint(parsed.cardTint || 'default');
            setMoodTags(parsed.moodTags || ['Ethereal']);
            setHasRestoredDraft(true);
            setLastAutoSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            return;
          }
        } catch {
          // ignore error
        }
      }
      setTitle('');
      setContent('');
      setType('poem');
      setStatus('published');
      setCardTint('default');
      setMoodTags(['Ethereal']);
      setHasRestoredDraft(false);
    }
  }, [initialPiece, isOpen]);

  // Autosave draft to localStorage so writers never lose their work
  useEffect(() => {
    if (!isOpen || initialPiece) return;
    if (title.trim() || content.trim()) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({
        title,
        content,
        type,
        status,
        cardTint,
        moodTags,
        updatedAt: Date.now()
      }));
      setLastAutoSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  }, [title, content, type, status, cardTint, moodTags, isOpen, initialPiece]);

  // Tab close & reload warning guard if user has unsaved text
  useEffect(() => {
    if (!isOpen) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (title.trim() || content.trim()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isOpen, title, content]);

  if (!isOpen) return null;

  const handleDiscardDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setTitle('');
    setContent('');
    setMoodTags(['Ethereal']);
    setHasRestoredDraft(false);
    setLastAutoSavedAt(null);
  };

  const handleClose = () => {
    if (!initialPiece && (title.trim() || content.trim())) {
      // Piece is already safely cached in localStorage
    }
    onClose();
  };

  // Live writing metrics
  const cleanContent = content.trim();
  const wordCount = cleanContent ? cleanContent.split(/\s+/).length : 0;
  const charCount = content.length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));

  const handleToggleTag = (tag: string) => {
    if (moodTags.includes(tag)) {
      setMoodTags(moodTags.filter(t => t !== tag));
    } else {
      setMoodTags([...moodTags, tag]);
    }
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    const tag = newTagInput.trim().replace(/^#/, '');
    if (tag && !moodTags.includes(tag)) {
      setMoodTags([...moodTags, tag]);
      setNewTagInput('');
    }
  };

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;

    const piece: WritingPiece = {
      id: initialPiece ? initialPiece.id : `piece_${Date.now()}`,
      title: title.trim() || 'Untitled Piece',
      content: content,
      type,
      status,
      authorId: initialPiece ? initialPiece.authorId : currentUser.id,
      authorDisplayName: initialPiece ? initialPiece.authorDisplayName : currentUser.displayName,
      authorPenpalId: initialPiece ? initialPiece.authorPenpalId : currentUser.penpalId,
      authorEmail: initialPiece ? initialPiece.authorEmail : currentUser.email,
      authorAvatar: initialPiece ? initialPiece.authorAvatar : currentUser.avatar,
      createdAt: initialPiece ? initialPiece.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stars: initialPiece ? initialPiece.stars : 0,
      starredByMe: initialPiece ? initialPiece.starredByMe : false,
      comments: initialPiece ? initialPiece.comments : [],
      moodTags,
      cardTint,
      wordCount,
      readTimeMinutes,
      synced: true
    };

    localStorage.removeItem(DRAFT_KEY);
    setHasRestoredDraft(false);
    onSave(piece);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 no-print">
      <div
        style={glassStyle}
        className={`w-full h-full md:h-auto md:max-h-[92vh] md:max-w-3xl md:rounded-3xl border-3 ${cardStyle.border} ${cardStyle.shadow} flex flex-col overflow-hidden relative shadow-2xl backdrop-blur-xl`}
      >
        {/* Frosted Glass Sheen Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-white/35 dark:from-white/10 to-transparent pointer-events-none md:rounded-3xl"
          style={{ backgroundClip: 'padding-box', WebkitBackgroundClip: 'padding-box' }}
        />

        {/* Top Accent Strip Bar matching active theme */}
        <div className={`h-2 w-full ${cardStyle.accentBar} shrink-0`} />

        {/* Top Header Bar */}
        <div className="px-5 py-4 border-b-2 border-black/15 dark:border-white/10 flex items-center justify-between gap-4 shrink-0 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center border-2 border-black/30 dark:border-white/20 shadow-2xs">
              <ThemeMotifIcon themeId={themeId} className="w-4 h-4 text-black dark:text-white" />
            </div>
            <h2 className="font-display-chic text-lg font-black text-black dark:text-white">
              {initialPiece ? 'Edit Creative Piece' : 'Compose New Piece'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {lastAutoSavedAt && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Draft Autosaved ({lastAutoSavedAt})</span>
              </span>
            )}

            {onPrintPreview && (
              <button
                type="button"
                onClick={() => {
                  const piece: WritingPiece = {
                    id: initialPiece ? initialPiece.id : 'preview',
                    title: title || 'Untitled Piece',
                    content,
                    type,
                    status,
                    authorId: currentUser.id,
                    authorDisplayName: currentUser.displayName,
                    authorPenpalId: currentUser.penpalId,
                    authorEmail: currentUser.email,
                    authorAvatar: currentUser.avatar,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    stars: 0,
                    starredByMe: false,
                    comments: [],
                    moodTags,
                    cardTint,
                    wordCount,
                    readTimeMinutes,
                    synced: true
                  };
                  onPrintPreview(piece);
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 border border-zinc-300 dark:border-zinc-700 flex items-center gap-1.5 transition-colors"
                title="Print preview"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-zinc-950 dark:bg-white dark:text-zinc-950 hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-sm border border-zinc-800 dark:border-white"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Save Piece</span>
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Restored Unfinished Draft Alert */}
        {hasRestoredDraft && (
          <div className="px-5 py-2.5 bg-amber-100/90 dark:bg-amber-950/60 border-b-2 border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-200 text-xs font-bold flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Restored your unfinished draft from your last session ({lastAutoSavedAt}).</span>
            </div>
            <button
              type="button"
              onClick={handleDiscardDraft}
              className="text-amber-800 dark:text-amber-300 hover:underline font-black text-xs cursor-pointer"
            >
              Discard Draft
            </button>
          </div>
        )}

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-6">
          {/* Format & Visibility Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b-2 border-black/15 dark:border-zinc-800 text-xs">
            {/* Format Selector */}
            <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl border-2 border-black/20 dark:border-zinc-700">
              {(['poem', 'story', 'prose', 'journal'] as WritingType[]).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`px-3 py-1.5 rounded-lg font-black transition-all capitalize ${
                    type === t
                      ? 'bg-black dark:bg-white text-white dark:text-black shadow-xs'
                      : 'text-black dark:text-zinc-300 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {t === 'story' ? 'Short Story' : t}
                </button>
              ))}
            </div>

            {/* Visibility Selector: Draft, Penpals, Published */}
            <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl border-2 border-black/20 dark:border-zinc-700">
              <button
                type="button"
                onClick={() => setStatus('draft')}
                className={`px-3 py-1.5 rounded-lg font-black flex items-center gap-1.5 transition-all ${
                  status === 'draft'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-black dark:text-zinc-300 hover:text-black dark:hover:text-white'
                }`}
              >
                <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Draft</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('penpals')}
                className={`px-3 py-1.5 rounded-lg font-black flex items-center gap-1.5 transition-all ${
                  status === 'penpals'
                    ? 'bg-pink-600 text-white shadow-xs'
                    : 'text-black dark:text-zinc-300 hover:text-black dark:hover:text-white'
                }`}
              >
                <Mail className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Penpals</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('published')}
                className={`px-3 py-1.5 rounded-lg font-black flex items-center gap-1.5 transition-all ${
                  status === 'published'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-black dark:text-zinc-300 hover:text-black dark:hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Published</span>
              </button>
            </div>
          </div>

          {/* Title Input (High Contrast, Bold) */}
          <div>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Title of your poem, story or verse..."
              className="w-full text-2xl md:text-3xl font-display-chic font-black text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-zinc-500 bg-transparent border-none outline-none focus:ring-0 px-0"
            />
          </div>

          {/* Main Textarea (High Contrast, Deep Readable Color) */}
          <div>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={
                type === 'poem'
                  ? 'Pour your verses here...\n\nEvery line break a breath,\nEvery word a quiet sanctuary.'
                  : 'Start writing your narrative or journal reflection...'
              }
              rows={12}
              className="w-full font-serif-literary text-lg md:text-xl text-black dark:text-zinc-100 placeholder:text-black/50 dark:placeholder:text-zinc-500 bg-transparent border-none outline-none focus:ring-0 p-0 resize-none leading-relaxed font-medium"
            />
          </div>

          {/* Aesthetic Customization Controls */}
          <div className="pt-4 border-t-2 border-black/15 dark:border-white/10 space-y-4">
            {/* Card Tint Selection */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black text-black dark:text-zinc-200 mb-2">
                <Palette className="w-3.5 h-3.5" />
                <span>Card Accent Tint</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {CARD_TINT_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setCardTint(opt.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 border-2 transition-all font-black ${
                      cardTint === opt.id
                        ? 'border-black dark:border-white shadow-2xs scale-105 bg-black text-white dark:bg-white dark:text-black'
                        : 'border-black/30 dark:border-white/20 bg-white/80 dark:bg-zinc-800/80 text-black dark:text-zinc-200 hover:border-black'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full shrink-0 ring-1 ring-black/30"
                      style={{ backgroundColor: opt.colorDot }}
                    />
                    <span>{opt.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mood Tags Selection */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black text-black dark:text-zinc-200 mb-2">
                <Tag className="w-3.5 h-3.5" />
                <span>Mood Tags</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {PRESET_MOOD_TAGS.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleToggleTag(t)}
                    className={`px-3 py-1 rounded-lg text-xs font-black border-2 transition-all ${
                      moodTags.includes(t)
                        ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-2xs'
                        : 'bg-white/80 dark:bg-zinc-800/80 text-black dark:text-zinc-200 border-black/20 dark:border-white/10 hover:border-black'
                    }`}
                  >
                    #{t}
                  </button>
                ))}
              </div>

              {/* Add Custom Tag */}
              <form onSubmit={handleAddCustomTag} className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={e => setNewTagInput(e.target.value)}
                  placeholder="Add custom tag (e.g. Moonlight)..."
                  className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-white/90 dark:bg-zinc-800/90 text-black dark:text-white border-2 border-black/30 dark:border-white/20 outline-none focus:border-black placeholder:text-black/40"
                />
                <button
                  type="submit"
                  disabled={!newTagInput.trim()}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-black text-white dark:bg-white dark:text-black hover:opacity-90 disabled:opacity-40 border-2 border-black dark:border-white shadow-2xs"
                >
                  Add Tag
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Metrics Bar (Live Word Count, Characters, Read Time) */}
        <div className="px-6 py-3 border-t-2 border-black/15 dark:border-white/10 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md flex items-center justify-between text-xs text-black dark:text-zinc-200 font-black shrink-0 relative z-10">
          <div className="flex items-center gap-3">
            <span className="font-mono tabular-nums font-black text-black dark:text-white">{wordCount}</span> words
            <span aria-hidden="true" className="text-black/50 dark:text-zinc-400 font-black">·</span>
            <span className="font-mono tabular-nums font-black text-black dark:text-white">{charCount}</span> chars
            <span aria-hidden="true" className="text-black/50 dark:text-zinc-400 font-black">·</span>
            <span>~{readTimeMinutes} min read</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-black dark:text-zinc-400 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
            <span>Auto-saving to offline cache</span>
          </div>
        </div>
      </div>
    </div>
  );
};
