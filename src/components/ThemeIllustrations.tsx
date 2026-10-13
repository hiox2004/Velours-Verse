import React from 'react';
import { AestheticThemeId } from '../types/theme';

interface IconProps {
  className?: string;
  size?: number;
}

/**
 * Handcrafted Coquette Silk Bow Vector Icon (Replaces 🎀 emoji)
 */
export const CoquetteBowIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    width={size}
    height={size}
    aria-hidden="true"
  >
    {/* Central Knot */}
    <ellipse cx="12" cy="10" rx="2" ry="2.2" />
    {/* Left Loop */}
    <path
      d="M10.2 9.2 C7 5.5 3 6 3 9 C3 12 7.5 12.5 10.2 10.8 Z"
      fillOpacity="0.88"
    />
    <path
      d="M10 9.8 C7.5 7.8 5 8 5 9.5 C5 11 7.8 11.2 10 10.2"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeOpacity="0.4"
    />
    {/* Right Loop */}
    <path
      d="M13.8 9.2 C17 5.5 21 6 21 9 C21 12 16.5 12.5 13.8 10.8 Z"
      fillOpacity="0.88"
    />
    <path
      d="M14 9.8 C16.5 7.8 19 8 19 9.5 C19 11 16.2 11.2 14 10.2"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeOpacity="0.4"
    />
    {/* Left Trailing Ribbon */}
    <path
      d="M11 12 C9.5 15 7.5 18 5.5 21 C7 20 8.5 20.2 10.5 21.5 C11.5 18 12 15 12.2 12.5 Z"
      fillOpacity="0.75"
    />
    {/* Right Trailing Ribbon */}
    <path
      d="M13 12 C14.5 15 16.5 18 18.5 21 C17 20 15.5 20.2 13.5 21.5 C12.5 18 12 15 11.8 12.5 Z"
      fillOpacity="0.75"
    />
  </svg>
);

/**
 * Handcrafted Cyber Y2K Chrome Starburst Icon (Replaces ✧ emoji)
 */
export const Y2kStarIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    width={size}
    height={size}
    aria-hidden="true"
  >
    {/* 4-Point Deep Starburst */}
    <path d="M12 1 C12.8 7.5 16.5 11.2 23 12 C16.5 12.8 12.8 16.5 12 23 C11.2 16.5 7.5 12.8 1 12 C7.5 11.2 11.2 7.5 12 1 Z" />
    {/* Subtle Diagonal Spark Mini-Point */}
    <circle cx="17.5" cy="6.5" r="1.2" fillOpacity="0.7" />
    <circle cx="6.5" cy="17.5" r="1" fillOpacity="0.7" />
  </svg>
);

/**
 * Handcrafted Botanical Matcha Tea Leaf Icon (Replaces 🌿 emoji)
 */
export const MatchaLeafIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    width={size}
    height={size}
    aria-hidden="true"
  >
    {/* Primary Tea Leaf */}
    <path
      d="M20.5 3.5 C14.5 4 8.5 8 6 13.5 C4.5 17 5 20 5 20.5 C5.5 20.5 8.5 21 12 19.5 C17.5 17 21.5 11 22 5 C22 4 21.5 3.5 20.5 3.5 Z"
      fillOpacity="0.9"
    />
    {/* Leaf Stem & Vein */}
    <path
      d="M4 22 C5.5 19 9 14.5 15 10.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeOpacity="0.4"
    />
    {/* Secondary Sprout Leaf */}
    <path
      d="M3 13 C4 10 7 8 10 9 C9 12 6.5 14 3 13 Z"
      fillOpacity="0.6"
    />
  </svg>
);

/**
 * Handcrafted Celestial Crescent Moon Icon (Replaces 🌙 emoji)
 */
export const MidnightMoonIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    width={size}
    height={size}
    aria-hidden="true"
  >
    {/* Crescent with Smooth Silhouette */}
    <path d="M12.3 2 C6.8 2 2.3 6.5 2.3 12 C2.3 17.5 6.8 22 12.3 22 C16.5 22 20.1 19.4 21.5 15.6 C19.2 16.5 16.7 16.5 14.3 15.7 C9.8 14.1 7.2 9.3 8.8 4.8 C9.4 3.2 10.5 2 12.3 2 Z" />
    {/* Orbiting Starlight Speck */}
    <circle cx="18" cy="7" r="1.3" />
    <circle cx="21" cy="10" r="0.9" fillOpacity="0.7" />
  </svg>
);

/**
 * Dynamic Motif Icon Resolver
 */
export const ThemeMotifIcon: React.FC<{ themeId: AestheticThemeId; className?: string; size?: number }> = ({
  themeId,
  className = 'w-5 h-5',
  size
}) => {
  switch (themeId) {
    case 'coquette':
      return <CoquetteBowIcon className={className} size={size} />;
    case 'y2k':
      return <Y2kStarIcon className={className} size={size} />;
    case 'matcha':
      return <MatchaLeafIcon className={className} size={size} />;
    case 'midnight':
      return <MidnightMoonIcon className={className} size={size} />;
    default:
      return <CoquetteBowIcon className={className} size={size} />;
  }
};

/**
 * Rich Thematic Vector Banners with Gen Z Humanlike Art
 */
export const ThemeHeroIllustration: React.FC<{ themeId: AestheticThemeId }> = ({ themeId }) => {
  if (themeId === 'coquette') {
    return (
      <div className="relative w-full min-h-[124px] md:min-h-[140px] h-auto rounded-2xl overflow-hidden bg-gradient-to-r from-[#FFE0EC] via-[#FFF0F6] to-[#FFE0EC] dark:from-rose-950/60 dark:via-pink-900/30 dark:to-rose-950/60 border-3 border-[#BE185D] dark:border-rose-500 p-4 md:p-6 flex items-center justify-between shadow-[4px_4px_0px_0px_#BE185D] dark:shadow-none">
        <div className="z-10 max-w-md">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#BE185D] text-white text-[11px] font-black tracking-wide uppercase shadow-2xs">
            <CoquetteBowIcon className="w-3.5 h-3.5 text-white" />
            <span>Coquette Atelier Edition</span>
          </div>
          <h2 className="font-display-chic text-xl md:text-2xl font-black text-black dark:text-white mt-1.5 leading-tight">
            Poetry of Silk, Ribbons & Melancholy
          </h2>
          <p className="font-serif-literary text-xs md:text-sm text-black dark:text-rose-100 font-extrabold mt-1 line-clamp-1">
            Handwritten letters sealed with vintage wax and pressed rose petals.
          </p>
        </div>

        {/* Hand-Drawn Bow Artwork (Visible in mobile view with responsive scaling) */}
        <div className="flex items-center gap-2 text-[#BE185D] dark:text-rose-400 shrink-0 ml-2">
          <svg viewBox="0 0 140 100" className="w-16 sm:w-28 md:w-36 h-auto" fill="none">
            <path
              d="M70 45 C50 15 15 20 15 45 C15 70 50 65 70 52 C90 65 125 70 125 45 C125 20 90 15 70 45 Z"
              fill="currentColor"
              fillOpacity="0.28"
              stroke="currentColor"
              strokeWidth="3"
            />
            <ellipse cx="70" cy="48" rx="8" ry="10" fill="currentColor" fillOpacity="0.9" />
            <path
              d="M66 55 C55 75 40 92 25 98 C35 92 45 92 58 98 C65 80 67 65 68 55"
              fill="currentColor"
              fillOpacity="0.4"
              stroke="currentColor"
              strokeWidth="2.5"
            />
            <path
              d="M74 55 C85 75 100 92 115 98 C105 92 95 92 82 98 C75 80 73 65 72 55"
              fill="currentColor"
              fillOpacity="0.4"
              stroke="currentColor"
              strokeWidth="2.5"
            />
            <circle cx="20" cy="20" r="3" fill="currentColor" />
            <circle cx="120" cy="22" r="2.5" fill="currentColor" />
          </svg>
        </div>
      </div>
    );
  }

  if (themeId === 'y2k') {
    return (
      <div className="relative w-full min-h-[124px] md:min-h-[140px] h-auto rounded-2xl overflow-hidden bg-gradient-to-r from-[#E0E7FF] via-[#EEF2FF] to-[#E0E7FF] dark:from-indigo-950/60 dark:via-slate-900/40 dark:to-indigo-950/60 border-3 border-[#4338CA] dark:border-indigo-400 p-4 md:p-6 flex items-center justify-between shadow-[4px_4px_0px_0px_#4338CA] dark:shadow-none">
        <div className="z-10 max-w-md">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4338CA] text-white text-[11px] font-black tracking-wide uppercase shadow-2xs">
            <Y2kStarIcon className="w-3.5 h-3.5 text-white" />
            <span>Cyber Twilight Edition</span>
          </div>
          <h2 className="font-display-chic text-xl md:text-2xl font-black text-black dark:text-white mt-1.5 leading-tight">
            Chrome Starlight & Neon Digital Verse
          </h2>
          <p className="font-serif-literary text-xs md:text-sm text-black dark:text-indigo-100 font-extrabold mt-1 line-clamp-1">
            Cassette tapes, holographic dreams, and 2 AM subway signals.
          </p>
        </div>

        {/* Hand-Drawn Cyber Starlight Grid Artwork (Visible in mobile view with responsive scaling) */}
        <div className="flex items-center gap-2 text-[#4338CA] dark:text-indigo-300 shrink-0 ml-2">
          <svg viewBox="0 0 130 90" className="w-16 sm:w-28 md:w-36 h-auto" fill="none">
            <path d="M65 5 L65 85 M10 45 L120 45" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
            <path
              d="M65 15 C68 35 75 42 95 45 C75 48 68 55 65 75 C62 55 55 48 35 45 C55 42 62 35 65 15 Z"
              fill="currentColor"
              fillOpacity="0.35"
              stroke="currentColor"
              strokeWidth="3"
            />
            <circle cx="65" cy="45" r="4.5" fill="currentColor" />
            <circle cx="105" cy="25" r="3.5" fill="currentColor" />
            <circle cx="25" cy="65" r="3" fill="currentColor" />
            <circle cx="95" cy="70" r="2.2" fill="currentColor" />
          </svg>
        </div>
      </div>
    );
  }

  if (themeId === 'matcha') {
    return (
      <div className="relative w-full min-h-[124px] md:min-h-[140px] h-auto rounded-2xl overflow-hidden bg-gradient-to-r from-[#DCFCE7] via-[#F0FDF4] to-[#DCFCE7] dark:from-emerald-950/60 dark:via-stone-900/30 dark:to-emerald-950/60 border-3 border-[#15803D] dark:border-emerald-400 p-4 md:p-6 flex items-center justify-between shadow-[4px_4px_0px_0px_#15803D] dark:shadow-none">
        <div className="z-10 max-w-md">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#15803D] text-white text-[11px] font-black tracking-wide uppercase shadow-2xs">
            <MatchaLeafIcon className="w-3.5 h-3.5 text-white" />
            <span>Café Botanica Edition</span>
          </div>
          <h2 className="font-display-chic text-xl md:text-2xl font-black text-black dark:text-white mt-1.5 leading-tight">
            Earthy Whisk, Morning Foam & Mindful Journal
          </h2>
          <p className="font-serif-literary text-xs md:text-sm text-black dark:text-emerald-100 font-extrabold mt-1 line-clamp-1">
            Ceramic cups, steaming oat milk, and quiet botanical reflections.
          </p>
        </div>

        {/* Hand-Drawn Ceramic Tea Cup & Leaf Artwork (Visible in mobile view with responsive scaling) */}
        <div className="flex items-center gap-2 text-[#15803D] dark:text-emerald-300 shrink-0 ml-2">
          <svg viewBox="0 0 130 90" className="w-16 sm:w-28 md:w-36 h-auto" fill="none">
            <path d="M50 25 Q53 15 50 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            <path d="M62 23 Q66 12 62 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            <path d="M74 25 Q71 14 75 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            <path
              d="M38 32 L86 32 C86 58 76 68 62 68 C48 68 38 58 38 32 Z"
              fill="currentColor"
              fillOpacity="0.3"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              d="M86 38 C96 38 98 52 86 54"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M30 70 Q62 76 94 70"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M102 42 C115 35 125 40 125 48 C120 54 110 52 102 42 Z"
              fill="currentColor"
              fillOpacity="0.5"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    );
  }

  // Midnight
  return (
    <div className="relative w-full min-h-[124px] md:min-h-[140px] h-auto rounded-2xl overflow-hidden bg-gradient-to-r from-[#EDE9FE] via-[#F5F0FF] to-[#EDE9FE] dark:from-purple-950/60 dark:via-zinc-900/40 dark:to-purple-950/60 border-3 border-[#6B21A8] dark:border-purple-400 p-4 md:p-6 flex items-center justify-between shadow-[4px_4px_0px_0px_#6B21A8] dark:shadow-none">
      <div className="z-10 max-w-md">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6B21A8] text-white text-[11px] font-black tracking-wide uppercase shadow-2xs">
          <MidnightMoonIcon className="w-3.5 h-3.5 text-white" />
          <span>Nocturnal Sanctuary Edition</span>
        </div>
        <h2 className="font-display-chic text-xl md:text-2xl font-black text-black dark:text-white mt-1.5 leading-tight">
          Velvet Shadows, Ink Wells & Starlight
        </h2>
        <p className="font-serif-literary text-xs md:text-sm text-black dark:text-purple-100 font-extrabold mt-1 line-clamp-1">
          The deepest verses are poured when the rest of the world is asleep.
        </p>
      </div>

      {/* Hand-Drawn Moon & Constellation Artwork (Visible in mobile view with responsive scaling) */}
      <div className="flex items-center gap-2 text-[#6B21A8] dark:text-purple-300 shrink-0 ml-2">
        <svg viewBox="0 0 130 90" className="w-16 sm:w-28 md:w-36 h-auto" fill="none">
          <path
            d="M60 12 C40 12 25 27 25 47 C25 67 40 82 60 82 C72 82 82 76 88 66 C80 69 72 68 64 63 C51 54 49 37 59 25 C64 19 72 16 80 16 C74 13 67 12 60 12 Z"
            fill="currentColor"
            fillOpacity="0.35"
            stroke="currentColor"
            strokeWidth="3"
          />
          <line x1="88" y1="28" x2="108" y2="20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.8" />
          <line x1="108" y1="20" x2="118" y2="42" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.8" />
          <circle cx="88" cy="28" r="3.5" fill="currentColor" />
          <circle cx="108" cy="20" r="3" fill="currentColor" />
          <circle cx="118" cy="42" r="3.8" fill="currentColor" />
          <circle cx="102" cy="68" r="2.5" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
};
