import React, { useState } from 'react';
import { WritingPiece } from '../types/writing';
import {
  Printer,
  X,
  Copy,
  Check,
  Calendar,
  Clock,
  Feather,
  BookOpen,
  Globe,
  Mail,
  Tag,
  Sparkles
} from 'lucide-react';

interface PrintPreviewProps {
  piece: WritingPiece | null;
  onClose: () => void;
}

interface TintConfig {
  id: string;
  name: string;
  dotColor: string;
  border: string;
  bgGradient: string;
  accentBar: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  shadowColor: string;
  stampColor: string;
  headerBg: string;
  tagDotColor: string;
}

const TINT_PALETTES: Record<string, TintConfig> = {
  rose: {
    id: 'rose',
    name: 'Rose Silk',
    dotColor: '#F43F5E',
    border: '#E11D48',
    bgGradient: 'linear-gradient(145deg, #FFF1F2 0%, #FFE4E6 45%, #FFF5F7 100%)',
    accentBar: '#F43F5E',
    badgeBg: '#FFE4E6',
    badgeBorder: '#FDA4AF',
    badgeText: '#9F1239',
    shadowColor: '#E11D48',
    stampColor: '#BE123C',
    headerBg: 'linear-gradient(90deg, #FFE4E6 0%, #FECDD3 100%)',
    tagDotColor: '#E11D48'
  },
  matcha: {
    id: 'matcha',
    name: 'Matcha Foam',
    dotColor: '#22C55E',
    border: '#15803D',
    bgGradient: 'linear-gradient(145deg, #F0FDF4 0%, #DCFCE7 45%, #F7FEE7 100%)',
    accentBar: '#16A34A',
    badgeBg: '#DCFCE7',
    badgeBorder: '#86EFAC',
    badgeText: '#14532D',
    shadowColor: '#15803D',
    stampColor: '#166534',
    headerBg: 'linear-gradient(90deg, #DCFCE7 0%, #BBF7D0 100%)',
    tagDotColor: '#15803D'
  },
  starlight: {
    id: 'starlight',
    name: 'Cyber Indigo',
    dotColor: '#6366F1',
    border: '#4338CA',
    bgGradient: 'linear-gradient(145deg, #EEF2FF 0%, #E0E7FF 45%, #F5F3FF 100%)',
    accentBar: '#6366F1',
    badgeBg: '#E0E7FF',
    badgeBorder: '#A5B4FC',
    badgeText: '#312E81',
    shadowColor: '#4338CA',
    stampColor: '#3730A3',
    headerBg: 'linear-gradient(90deg, #E0E7FF 0%, #C7D2FE 100%)',
    tagDotColor: '#4338CA'
  },
  lavender: {
    id: 'lavender',
    name: 'Midnight Violet',
    dotColor: '#A855F7',
    border: '#7E22CE',
    bgGradient: 'linear-gradient(145deg, #FAF5FF 0%, #F3E8FF 45%, #FDF4FF 100%)',
    accentBar: '#A855F7',
    badgeBg: '#F3E8FF',
    badgeBorder: '#D8B4FE',
    badgeText: '#581C87',
    shadowColor: '#7E22CE',
    stampColor: '#6B21A8',
    headerBg: 'linear-gradient(90deg, #F3E8FF 0%, #E9D5FF 100%)',
    tagDotColor: '#7E22CE'
  },
  sunflower: {
    id: 'sunflower',
    name: 'Y2K Honey',
    dotColor: '#EAB308',
    border: '#B45309',
    bgGradient: 'linear-gradient(145deg, #FEFCE8 0%, #FEF3C7 45%, #FFFBEB 100%)',
    accentBar: '#F59E0B',
    badgeBg: '#FEF3C7',
    badgeBorder: '#FDE68A',
    badgeText: '#78350F',
    shadowColor: '#B45309',
    stampColor: '#92400E',
    headerBg: 'linear-gradient(90deg, #FEF3C7 0%, #FDE68A 100%)',
    tagDotColor: '#B45309'
  },
  default: {
    id: 'default',
    name: 'Sanctuary Noir',
    dotColor: '#18181B',
    border: '#18181B',
    bgGradient: 'linear-gradient(145deg, #FFFDF9 0%, #FBF5EE 45%, #FFF9F2 100%)',
    accentBar: '#EC4899',
    badgeBg: '#F4F4F5',
    badgeBorder: '#D4D4D8',
    badgeText: '#18181B',
    shadowColor: '#18181B',
    stampColor: '#18181B',
    headerBg: 'linear-gradient(90deg, #FDF4F7 0%, #FCE7F0 100%)',
    tagDotColor: '#EC4899'
  }
};

export const PrintPreview: React.FC<PrintPreviewProps> = ({ piece, onClose }) => {
  if (!piece) return null;

  const initialTintId = (piece.cardTint && TINT_PALETTES[piece.cardTint]) ? piece.cardTint : 'rose';
  const [activeTintId, setActiveTintId] = useState<string>(initialTintId);
  const [copied, setCopied] = useState<boolean>(false);

  const tint = TINT_PALETTES[activeTintId] || TINT_PALETTES.rose;

  const formattedDate = new Date(piece.createdAt).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const handleTriggerPrint = () => {
    window.print();
  };

  const handleCopyText = async () => {
    try {
      const fullText = `${piece.title}\nBy ${piece.authorDisplayName} (${piece.authorPenpalId})\n\n${piece.content}\n\n— Archived on Velours & Verse (${formattedDate})`;
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Determine drop cap for prose/story
  const isPoem = piece.type === 'poem';
  const rawContent = piece.content.trim();
  const firstChar = rawContent.charAt(0);
  const remainingContent = !isPoem && rawContent.length > 1 ? rawContent.slice(1) : rawContent;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950/85 backdrop-blur-md overflow-y-auto print:static print:bg-white print:overflow-visible print:inset-auto print:z-auto">
      {/* ON-SCREEN TOP ACTION STRIP (HIDDEN WHEN PRINTING) */}
      <div className="sticky top-0 z-20 px-4 sm:px-6 py-3.5 bg-zinc-900 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 shadow-lg no-print">
        {/* Left: Document details */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center border border-pink-500/40 shrink-0">
            <Printer className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-white text-xs sm:text-sm font-black truncate">
              Print Preview & Archival Folio
            </div>
            <div className="text-[11px] text-zinc-400 font-bold truncate">
              {piece.title} · {piece.type.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Center: Tint Selector Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-950 rounded-xl border border-zinc-800 overflow-x-auto max-w-full">
          <span className="text-[10px] uppercase tracking-wider font-black text-zinc-400 px-2">
            Palette:
          </span>
          {Object.values(TINT_PALETTES).map(p => (
            <button
              key={p.id}
              onClick={() => setActiveTintId(p.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-black flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTintId === p.id
                  ? 'bg-white text-zinc-950 shadow-xs'
                  : 'text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/20"
                style={{ backgroundColor: p.dotColor }}
              />
              <span>{p.name}</span>
            </button>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopyText}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 flex items-center gap-1.5 border border-zinc-700 active:scale-95 transition-all"
            title="Copy manuscript text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            onClick={handleTriggerPrint}
            className="px-4 py-2 rounded-xl text-xs font-black bg-white text-zinc-950 hover:bg-zinc-100 flex items-center gap-1.5 shadow-md active:scale-95 transition-transform border border-white"
          >
            <Printer className="w-4 h-4 text-pink-600" />
            <span>Print Page / Save PDF</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Close Preview"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* PAPER SHEET SIMULATION & PRINT TARGET */}
      <div className="flex-1 p-4 sm:p-8 md:p-12 flex justify-center items-start print:p-0 print:m-0 print:block">
        {/* Manuscript Card Frame */}
        <div
          className="print-sheet-root w-full max-w-2xl rounded-3xl p-6 sm:p-10 md:p-12 flex flex-col justify-between transition-all relative overflow-hidden"
          style={{
            background: tint.bgGradient,
            border: `3.5px solid ${tint.border}`,
            boxShadow: `8px 8px 0px 0px ${tint.shadowColor}`,
            color: '#09090B',
            printColorAdjust: 'exact',
            WebkitPrintColorAdjust: 'exact'
          }}
        >
          {/* Top Decorative Header Masthead */}
          <div
            className="p-3.5 sm:p-4 -mx-6 sm:-mx-10 md:-mx-12 -mt-6 sm:-mt-10 md:-mt-12 mb-6 sm:mb-8 flex items-center justify-between gap-3 border-b-3"
            style={{
              background: tint.headerBg,
              borderColor: tint.border,
              printColorAdjust: 'exact',
              WebkitPrintColorAdjust: 'exact'
            }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl bg-white flex items-center justify-center border-2 shadow-2xs shrink-0"
                style={{ borderColor: tint.border }}
              >
                <Feather className="w-4 h-4" style={{ color: tint.stampColor }} />
              </div>
              <div>
                <span className="font-display-chic text-xs sm:text-sm font-black tracking-wider text-black block">
                  VELOURS & VERSE
                </span>
                <span className="text-[10px] uppercase tracking-widest font-sans font-bold text-black/70 block">
                  Creative Literary Sanctuary · Archival Folio
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className="text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg border-2 shadow-2xs"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: tint.border,
                  color: tint.stampColor,
                  printColorAdjust: 'exact',
                  WebkitPrintColorAdjust: 'exact'
                }}
              >
                {piece.type === 'story' ? 'Short Story' : piece.type}
              </span>
              <span
                className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg text-white border-2 border-black/20 shadow-2xs hidden sm:inline-flex items-center gap-1"
                style={{
                  backgroundColor: tint.border,
                  printColorAdjust: 'exact',
                  WebkitPrintColorAdjust: 'exact'
                }}
              >
                {piece.status === 'penpals' ? (
                  <>
                    <Mail className="w-3 h-3" />
                    <span>Penpal Circle</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-3 h-3" />
                    <span>Sanctuary</span>
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Title and Neon Underline */}
          <div className="mb-6 space-y-2">
            <h1 className="font-display-chic text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-zinc-950 leading-tight">
              {piece.title}
            </h1>
            <div
              className="h-1.5 w-24 rounded-full"
              style={{
                backgroundColor: tint.accentBar,
                printColorAdjust: 'exact',
                WebkitPrintColorAdjust: 'exact'
              }}
            />
          </div>

          {/* Author Dossier & Meta Bar */}
          <div
            className="p-3.5 sm:p-4 rounded-2xl bg-white/90 border-2.5 mb-6 sm:mb-8 flex flex-wrap items-center justify-between gap-3 shadow-xs"
            style={{
              borderColor: tint.border,
              printColorAdjust: 'exact',
              WebkitPrintColorAdjust: 'exact'
            }}
          >
            <div className="flex items-center gap-3">
              <img
                src={piece.authorAvatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${piece.authorDisplayName}&backgroundColor=ffdfbf,ffd5dc,d1d4f9`}
                alt={piece.authorDisplayName}
                className="w-10 h-10 rounded-xl object-cover ring-2 border border-black/10 shrink-0"
                style={{ ringColor: tint.border }}
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-black text-zinc-950 font-display-chic">
                    {piece.authorDisplayName}
                  </span>
                  <span
                    className="font-mono text-[10px] font-black px-2 py-0.5 rounded-md border"
                    style={{
                      backgroundColor: tint.badgeBg,
                      borderColor: tint.badgeBorder,
                      color: tint.badgeText,
                      printColorAdjust: 'exact',
                      WebkitPrintColorAdjust: 'exact'
                    }}
                  >
                    {piece.authorPenpalId}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-zinc-600 font-bold mt-0.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 opacity-60" />
                    <span>{formattedDate}</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 opacity-60" />
                    <span>{piece.readTimeMinutes} min read</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-zinc-700 bg-black/5 px-2.5 py-1 rounded-lg border border-black/10">
                {piece.wordCount} words
              </span>
            </div>
          </div>

          {/* Mood Pills Strip */}
          {piece.moodTags && piece.moodTags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap mb-6 sm:mb-8">
              <Tag className="w-3.5 h-3.5 text-zinc-500 mr-1 shrink-0 stroke-[2.5]" />
              {piece.moodTags.map(tag => (
                <span
                  key={tag}
                  className="text-[11px] font-black px-2.5 py-1 rounded-full border flex items-center gap-1 shadow-2xs"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderColor: tint.border,
                    color: tint.stampColor,
                    printColorAdjust: 'exact',
                    WebkitPrintColorAdjust: 'exact'
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: tint.dotColor }}
                  />
                  <span>#{tag}</span>
                </span>
              ))}
            </div>
          )}

          {/* Manuscript Body Content */}
          <div className="my-2 min-h-[220px]">
            {isPoem ? (
              <div
                className="font-serif-literary text-lg sm:text-xl text-zinc-950 whitespace-pre-wrap leading-relaxed max-w-xl mx-auto italic px-2 sm:px-4 border-l-2 py-1"
                style={{ borderColor: tint.accentBar }}
              >
                {piece.content}
              </div>
            ) : (
              <div className="font-serif-literary text-lg sm:text-xl text-zinc-950 whitespace-pre-wrap leading-relaxed">
                <span
                  className="font-display-chic text-4xl sm:text-5xl font-black float-left mr-2.5 leading-none mt-1"
                  style={{ color: tint.stampColor }}
                >
                  {firstChar}
                </span>
                <span>{remainingContent}</span>
              </div>
            )}
          </div>

          {/* Archival Authenticity Wax Seal Stamp */}
          <div className="mt-8 pt-6 border-t-2 border-black/10 flex items-center justify-between gap-4 flex-wrap">
            {/* Publisher Seal Graphic */}
            <div className="flex items-center gap-3">
              <div
                className="w-14 h-14 rounded-full border-2 border-dashed flex items-center justify-center relative p-1 shadow-xs shrink-0"
                style={{
                  borderColor: tint.stampColor,
                  backgroundColor: tint.badgeBg,
                  color: tint.stampColor,
                  printColorAdjust: 'exact',
                  WebkitPrintColorAdjust: 'exact'
                }}
              >
                <div
                  className="w-11 h-11 rounded-full border border-solid flex flex-col items-center justify-center text-center p-0.5"
                  style={{ borderColor: tint.stampColor }}
                >
                  <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span className="text-[7px] font-black uppercase tracking-tighter leading-none mt-0.5">
                    ARCHIVAL
                  </span>
                  <span className="text-[6px] font-bold uppercase tracking-tighter leading-none">
                    PRESS
                  </span>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-zinc-950 font-display-chic">
                  Velours & Verse Archival Press
                </div>
                <div className="text-[10px] text-zinc-600 font-bold font-serif-literary italic">
                  “Words that refuse to be rushed. Preserved in quiet ink.”
                </div>
              </div>
            </div>

            {/* Verification Metadata */}
            <div className="text-right text-[10px] font-mono text-zinc-500 font-bold">
              <div>FOLIO ID: REF-{piece.id.toUpperCase().slice(0, 10)}</div>
              <div>SANCTUARY CANON · velours-verse.vercel.app</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
