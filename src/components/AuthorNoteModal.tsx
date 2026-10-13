import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { AuthorNote } from '../types/writing';
import { ThemeMotifIcon } from './ThemeIllustrations';
import {
  X,
  Sparkles,
  Check,
  Send,
  MailCheck,
  Award,
  Calendar,
  UserCheck
} from 'lucide-react';

interface AuthorNoteModalProps {
  note: AuthorNote | null;
  isOpen: boolean;
  onClose: () => void;
  onDismiss: () => void;
}

export const AuthorNoteModal: React.FC<AuthorNoteModalProps> = ({
  note,
  isOpen,
  onClose,
  onDismiss
}) => {
  const { themeId, mode } = useTheme();
  const [isClosing, setIsClosing] = useState(false);

  if (!note || !isOpen) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onDismiss();
      onClose();
    }, 220);
  };

  const formattedDate = new Date(note.createdAt).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Distinct Theme Aesthetics for the "Most Well Worked Card"
  const themeCardStyles = {
    coquette: {
      wrapperBg: mode === 'light'
        ? 'bg-gradient-to-br from-[#FFF5F8] via-[#FFE4EC] to-[#FFF0F5]'
        : 'bg-gradient-to-br from-zinc-950 via-rose-950/70 to-zinc-900',
      border: 'border-4 border-[#BE185D] dark:border-rose-400',
      shadow: 'shadow-[8px_8px_0px_0px_#BE185D] dark:shadow-[8px_8px_0px_0px_rgba(244,63,94,0.4)]',
      accentColor: 'text-[#BE185D] dark:text-rose-400',
      badgeBg: 'bg-[#BE185D] text-white',
      recipientBadge: 'bg-rose-100 text-[#BE185D] dark:bg-rose-900/50 dark:text-rose-200 border-2 border-[#BE185D]/30',
      sealBg: 'bg-[#BE185D] text-white shadow-md',
      watermark: (
        <svg viewBox="0 0 140 100" className="w-32 h-auto text-[#BE185D] dark:text-rose-400 opacity-20 pointer-events-none" fill="none">
          <path
            d="M70 45 C50 15 15 20 15 45 C15 70 50 65 70 52 C90 65 125 70 125 45 C125 20 90 15 70 45 Z"
            fill="currentColor"
            fillOpacity="0.4"
            stroke="currentColor"
            strokeWidth="3"
          />
          <ellipse cx="70" cy="48" rx="8" ry="10" fill="currentColor" />
        </svg>
      ),
      buttonStyle: 'bg-[#BE185D] hover:bg-[#9D174D] text-white border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_#000]'
    },
    y2k: {
      wrapperBg: mode === 'light'
        ? 'bg-gradient-to-br from-[#EEF2FF] via-[#E0E7FF] to-[#EDE9FE]'
        : 'bg-gradient-to-br from-zinc-950 via-indigo-950/70 to-zinc-900',
      border: 'border-4 border-[#4338CA] dark:border-indigo-400',
      shadow: 'shadow-[8px_8px_0px_0px_#4338CA] dark:shadow-[8px_8px_0px_0px_rgba(99,102,241,0.5)]',
      accentColor: 'text-[#4338CA] dark:text-indigo-400',
      badgeBg: 'bg-[#4338CA] text-white',
      recipientBadge: 'bg-indigo-100 text-[#4338CA] dark:bg-indigo-900/50 dark:text-indigo-200 border-2 border-[#4338CA]/30',
      sealBg: 'bg-[#4338CA] text-white shadow-md',
      watermark: (
        <svg viewBox="0 0 100 100" className="w-28 h-auto text-[#4338CA] dark:text-indigo-400 opacity-25 pointer-events-none" fill="none">
          <polygon points="50,5 62,38 95,50 62,62 50,95 38,62 5,50 38,38" fill="currentColor" />
          <circle cx="50" cy="50" r="14" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      buttonStyle: 'bg-[#4338CA] hover:bg-[#3730A3] text-white border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_#000]'
    },
    matcha: {
      wrapperBg: mode === 'light'
        ? 'bg-gradient-to-br from-[#F4F9F2] via-[#EAF4E8] to-[#DEF0DC]'
        : 'bg-gradient-to-br from-zinc-950 via-emerald-950/70 to-zinc-900',
      border: 'border-4 border-[#15803D] dark:border-emerald-500',
      shadow: 'shadow-[8px_8px_0px_0px_#15803D] dark:shadow-[8px_8px_0px_0px_rgba(34,197,94,0.4)]',
      accentColor: 'text-[#15803D] dark:text-emerald-400',
      badgeBg: 'bg-[#15803D] text-white',
      recipientBadge: 'bg-emerald-100 text-[#15803D] dark:bg-emerald-900/50 dark:text-emerald-200 border-2 border-[#15803D]/30',
      sealBg: 'bg-[#15803D] text-white shadow-md',
      watermark: (
        <svg viewBox="0 0 100 100" className="w-28 h-auto text-[#15803D] dark:text-emerald-400 opacity-25 pointer-events-none" fill="none">
          <path
            d="M50 15 C30 35 30 70 50 85 C70 70 70 35 50 15 Z"
            fill="currentColor"
            fillOpacity="0.4"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path d="M50 15 L50 85" stroke="currentColor" strokeWidth="2.5" />
        </svg>
      ),
      buttonStyle: 'bg-[#15803D] hover:bg-[#166534] text-white border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_#000]'
    },
    midnight: {
      wrapperBg: mode === 'light'
        ? 'bg-gradient-to-br from-[#F5F3FF] via-[#EDE9FE] to-[#DDD6FE]'
        : 'bg-gradient-to-br from-zinc-950 via-purple-950/70 to-zinc-900',
      border: 'border-4 border-[#6B21A8] dark:border-purple-400',
      shadow: 'shadow-[8px_8px_0px_0px_#6B21A8] dark:shadow-[8px_8px_0px_0px_rgba(168,85,247,0.4)]',
      accentColor: 'text-[#6B21A8] dark:text-purple-400',
      badgeBg: 'bg-[#6B21A8] text-white',
      recipientBadge: 'bg-purple-100 text-[#6B21A8] dark:bg-purple-900/50 dark:text-purple-200 border-2 border-[#6B21A8]/30',
      sealBg: 'bg-[#6B21A8] text-white shadow-md',
      watermark: (
        <svg viewBox="0 0 100 100" className="w-28 h-auto text-[#6B21A8] dark:text-purple-400 opacity-25 pointer-events-none" fill="none">
          <path
            d="M70 20 C42 20 20 42 20 70 C20 78 22 85 25 91 C15 80 10 65 10 50 C10 25 30 5 55 5 C62 5 69 7 75 10 C73 13 71 16 70 20 Z"
            fill="currentColor"
          />
          <polygon points="80,40 83,50 93,53 83,56 80,66 77,56 67,53 77,50" fill="currentColor" />
        </svg>
      ),
      buttonStyle: 'bg-[#6B21A8] hover:bg-[#581C87] text-white border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_#000]'
    }
  };

  const style = themeCardStyles[themeId] || themeCardStyles.coquette;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-md transition-opacity">
        {/* Animated Pop-Up Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 25 }}
          animate={{
            opacity: isClosing ? 0 : 1,
            scale: isClosing ? 0.92 : 1,
            y: isClosing ? 20 : 0
          }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          style={{
            backgroundClip: 'padding-box',
            WebkitBackgroundClip: 'padding-box',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)'
          }}
          className={`relative w-full max-w-xl my-auto rounded-3xl ${style.wrapperBg} ${style.border} ${style.shadow} p-6 sm:p-8 flex flex-col justify-between overflow-hidden transition-all duration-200`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="author-note-title"
        >
          {/* Top Decorative Postmark / Corner Watermark */}
          <div className="absolute right-4 top-4 flex items-center gap-2">
            <div className="hidden sm:block">
              {style.watermark}
            </div>
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-2xl bg-white dark:bg-zinc-800 text-black dark:text-white border-2 border-black dark:border-zinc-700 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-sm z-20"
              title="Close note"
              aria-label="Close author note"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Letter Header */}
          <div className="relative z-10 space-y-4 pr-10">
            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${style.badgeBg} shadow-2xs`}>
                <ThemeMotifIcon themeId={themeId} className="w-3.5 h-3.5" />
                <span>{note.tag || 'Creator Dispatch'}</span>
              </span>

              <span className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 ${style.recipientBadge}`}>
                <UserCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>To: {note.targetUserName || (note.targetAudience === 'all' ? 'All Writers' : note.targetAudience)}</span>
              </span>

              <span className="hidden md:flex items-center gap-1 text-[11px] font-black text-black/70 dark:text-zinc-300">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formattedDate}</span>
              </span>
            </div>

            {/* Note Title (Solid Black in Light Mode) */}
            <h2
              id="author-note-title"
              className="font-display-chic text-2xl sm:text-3xl font-black text-black dark:text-white tracking-tight leading-tight"
            >
              {note.title}
            </h2>
          </div>

          {/* Note Content / Prose (Solid Black, High Contrast, Literary Spacing) */}
          <div className="relative z-10 my-6">
            <div className="p-5 sm:p-6 rounded-2xl bg-white/85 dark:bg-zinc-900/85 border-2 border-black/25 dark:border-white/20 backdrop-blur-xs shadow-inner">
              <p className="font-serif-literary text-base sm:text-lg text-black dark:text-zinc-100 font-bold leading-relaxed whitespace-pre-line">
                {note.content}
              </p>
            </div>
          </div>

          {/* Author Sign-Off & Wax Seal Block */}
          <div className="relative z-10 pt-4 border-t-3 border-black/20 dark:border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Author Credit */}
            <div className="flex items-center gap-3">
              <img
                src={note.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={note.authorName}
                className="w-11 h-11 rounded-full object-cover ring-3 ring-black dark:ring-white shadow-sm shrink-0"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display-chic text-base font-black text-black dark:text-white">
                    {note.authorName}
                  </span>
                  <span className={`w-4 h-4 rounded-full ${style.sealBg} flex items-center justify-center text-[10px]`}>
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                </div>
                <span className="text-xs font-black text-black/80 dark:text-zinc-300 block">
                  {note.authorRole}
                </span>
              </div>
            </div>

            {/* Dismiss / Fold Letter Action */}
            <button
              onClick={handleClose}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all ${style.buttonStyle}`}
            >
              <MailCheck className="w-4 h-4 stroke-[2.5]" />
              <span>Fold Letter & Continue</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
