export type AestheticThemeId = 'coquette' | 'y2k' | 'matcha' | 'midnight';

export type ThemeMode = 'light' | 'dark';

export interface ThemeCardStyle {
  bg: string;
  border: string;
  accentBar: string;
  badgeBg: string;
  badgeText: string;
  starActiveBg: string;
  starActiveText: string;
  shadow: string;
}

export interface AestheticTheme {
  id: AestheticThemeId;
  name: string;
  tagline: string;
  motifName: string;
  light: {
    bg: string;
    surface: string;
    border: string;
    borderStrong: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
    accentHover: string;
    card: ThemeCardStyle;
  };
  dark: {
    bg: string;
    surface: string;
    border: string;
    borderStrong: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
    accentHover: string;
    card: ThemeCardStyle;
  };
}

export const THEMES: Record<AestheticThemeId, AestheticTheme> = {
  coquette: {
    id: 'coquette',
    name: 'Coquette Blush',
    tagline: 'Silk ribbons, delicate prose & sweet melancholia',
    motifName: 'Silk Bow',
    light: {
      bg: '#FFF0F5', // Soft coquette blush aura
      surface: '#FCE7F3',
      border: '#BE185D', // Bold deep berry ribbon border
      borderStrong: '#9D174D',
      textPrimary: '#000000', // Solid Jet Black
      textSecondary: '#000000', // Solid Jet Black
      accent: '#BE185D',
      accentHover: '#9D174D',
      card: {
        bg: 'bg-[#FDF2F8]', // Coquette pastel blush shade
        border: 'border-[#BE185D]', // Bold rich berry ribbon border
        accentBar: 'bg-[#BE185D]',
        badgeBg: 'bg-[#FCE7F3]',
        badgeText: 'text-[#9D174D]',
        starActiveBg: 'bg-[#BE185D]',
        starActiveText: 'text-white',
        shadow: 'shadow-[4px_4px_0px_0px_#BE185D]'
      }
    },
    dark: {
      bg: '#140A0F',
      surface: '#24101B',
      border: '#831843',
      borderStrong: '#FB7185',
      textPrimary: '#FFFFFF',
      textSecondary: '#FCE7F3',
      accent: '#FB7185',
      accentHover: '#F43F5E',
      card: {
        bg: 'bg-[#24101B]',
        border: 'border-[#FB7185]',
        accentBar: 'bg-[#FB7185]',
        badgeBg: 'bg-[#4A1531]',
        badgeText: 'text-[#FCE7F3]',
        starActiveBg: 'bg-[#FB7185]',
        starActiveText: 'text-[#140A0F]',
        shadow: 'shadow-[4px_4px_0px_0px_#FB7185]'
      }
    }
  },
  y2k: {
    id: 'y2k',
    name: 'Cyber Y2K Stars',
    tagline: 'Holographic starlight, chrome vibes & twilight verse',
    motifName: 'Chrome Star',
    light: {
      bg: '#EEF2FF', // Cyber icy lilac starlight aura
      surface: '#E0E7FF',
      border: '#4338CA', // Bold electric indigo border
      borderStrong: '#3730A3',
      textPrimary: '#000000', // Solid Jet Black
      textSecondary: '#000000', // Solid Jet Black
      accent: '#4338CA',
      accentHover: '#3730A3',
      card: {
        bg: 'bg-[#E0E7FF]', // Cyber icy lilac shade
        border: 'border-[#4338CA]', // Bold electric indigo border
        accentBar: 'bg-[#4338CA]',
        badgeBg: 'bg-[#C7D2FE]',
        badgeText: 'text-[#312E81]',
        starActiveBg: 'bg-[#4338CA]',
        starActiveText: 'text-white',
        shadow: 'shadow-[4px_4px_0px_0px_#4338CA]'
      }
    },
    dark: {
      bg: '#080A14',
      surface: '#11172E',
      border: '#314073',
      borderStrong: '#818CF8',
      textPrimary: '#FFFFFF',
      textSecondary: '#E2E8F0',
      accent: '#818CF8',
      accentHover: '#A5B4FC',
      card: {
        bg: 'bg-[#11172E]',
        border: 'border-[#818CF8]',
        accentBar: 'bg-[#818CF8]',
        badgeBg: 'bg-[#1E2958]',
        badgeText: 'text-[#E0E7FF]',
        starActiveBg: 'bg-[#818CF8]',
        starActiveText: 'text-[#080A14]',
        shadow: 'shadow-[4px_4px_0px_0px_#818CF8]'
      }
    }
  },
  matcha: {
    id: 'matcha',
    name: 'Matcha Latte',
    tagline: 'Cozy steam, botanical serenity & mindful journal',
    motifName: 'Tea Leaf',
    light: {
      bg: '#F0FDF4', // Gentle matcha mist aura
      surface: '#DCFCE7',
      border: '#15803D', // Bold deep ceremonial matcha green border
      borderStrong: '#166534',
      textPrimary: '#000000', // Solid Jet Black
      textSecondary: '#000000', // Solid Jet Black
      accent: '#15803D',
      accentHover: '#166534',
      card: {
        bg: 'bg-[#DCFCE7]', // Creamy matcha foam shade
        border: 'border-[#15803D]', // Bold deep matcha green border
        accentBar: 'bg-[#15803D]',
        badgeBg: 'bg-[#BBF7D0]',
        badgeText: 'text-[#14532D]',
        starActiveBg: 'bg-[#15803D]',
        starActiveText: 'text-white',
        shadow: 'shadow-[4px_4px_0px_0px_#15803D]'
      }
    },
    dark: {
      bg: '#0A120B',
      surface: '#142416',
      border: '#2C4A2F',
      borderStrong: '#4ADE80',
      textPrimary: '#FFFFFF',
      textSecondary: '#F1F9F1',
      accent: '#4ADE80',
      accentHover: '#86EFAC',
      card: {
        bg: 'bg-[#142416]',
        border: 'border-[#4ADE80]',
        accentBar: 'bg-[#4ADE80]',
        badgeBg: 'bg-[#1B3B1F]',
        badgeText: 'text-[#DCFCE7]',
        starActiveBg: 'bg-[#4ADE80]',
        starActiveText: 'text-[#0A120B]',
        shadow: 'shadow-[4px_4px_0px_0px_#4ADE80]'
      }
    }
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Muse',
    tagline: 'Nocturnal thoughts, ink shadows & celestial poetry',
    motifName: 'Crescent Moon',
    light: {
      bg: '#FAF5FF', // Soft twilight lilac mist aura
      surface: '#F3E8FF',
      border: '#6B21A8', // Bold midnight royal purple border
      borderStrong: '#581C87',
      textPrimary: '#000000', // Solid Jet Black
      textSecondary: '#000000', // Solid Jet Black
      accent: '#6B21A8',
      accentHover: '#581C87',
      card: {
        bg: 'bg-[#EDE9FE]', // Soft twilight lavender shade
        border: 'border-[#6B21A8]', // Bold midnight purple border
        accentBar: 'bg-[#6B21A8]',
        badgeBg: 'bg-[#DDD6FE]',
        badgeText: 'text-[#4C1D95]',
        starActiveBg: 'bg-[#6B21A8]',
        starActiveText: 'text-white',
        shadow: 'shadow-[4px_4px_0px_0px_#6B21A8]'
      }
    },
    dark: {
      bg: '#080910',
      surface: '#121424',
      border: '#2A2E4E',
      borderStrong: '#A78BFA',
      textPrimary: '#FFFFFF',
      textSecondary: '#F8FAFC',
      accent: '#A78BFA',
      accentHover: '#C4B5FD',
      card: {
        bg: 'bg-[#121424]',
        border: 'border-[#A78BFA]',
        accentBar: 'bg-[#A78BFA]',
        badgeBg: 'bg-[#25204D]',
        badgeText: 'text-[#ECE9FE]',
        starActiveBg: 'bg-[#A78BFA]',
        starActiveText: 'text-[#080910]',
        shadow: 'shadow-[4px_4px_0px_0px_#A78BFA]'
      }
    }
  }
};

export interface CardTintOption {
  id: string;
  name: string;
  colorDot: string;
  accentBar: string;
}

export const CARD_TINT_OPTIONS: CardTintOption[] = [
  { id: 'default', name: 'Theme Native', colorDot: '#BE185D', accentBar: 'bg-zinc-950 dark:bg-white' },
  { id: 'rose', name: 'Rose Silk', colorDot: '#F43F5E', accentBar: 'bg-rose-500' },
  { id: 'starlight', name: 'Cyber Indigo', colorDot: '#6366F1', accentBar: 'bg-indigo-500' },
  { id: 'matcha', name: 'Matcha Foam', colorDot: '#22C55E', accentBar: 'bg-emerald-500' },
  { id: 'lavender', name: 'Midnight Violet', colorDot: '#A855F7', accentBar: 'bg-purple-500' },
  { id: 'sunflower', name: 'Y2K Honey', colorDot: '#EAB308', accentBar: 'bg-amber-400' }
];

export const THEME_DYNAMIC_GRADIENTS: Record<AestheticThemeId, { light: string; dark: string; borderGlow: string; accentColor: string }> = {
  coquette: {
    light: 'linear-gradient(135deg, rgba(255, 240, 245, 0.95) 0%, rgba(253, 226, 236, 0.84) 50%, rgba(255, 245, 248, 0.93) 100%)',
    dark: 'linear-gradient(135deg, rgba(36, 16, 27, 0.94) 0%, rgba(74, 21, 49, 0.82) 50%, rgba(20, 10, 15, 0.95) 100%)',
    borderGlow: 'rgba(190, 24, 93, 0.35)',
    accentColor: '#BE185D'
  },
  y2k: {
    light: 'linear-gradient(135deg, rgba(238, 242, 255, 0.95) 0%, rgba(224, 231, 255, 0.84) 50%, rgba(238, 242, 255, 0.93) 100%)',
    dark: 'linear-gradient(135deg, rgba(17, 23, 46, 0.94) 0%, rgba(30, 41, 88, 0.82) 50%, rgba(8, 10, 20, 0.95) 100%)',
    borderGlow: 'rgba(67, 56, 202, 0.35)',
    accentColor: '#4338CA'
  },
  matcha: {
    light: 'linear-gradient(135deg, rgba(240, 253, 244, 0.95) 0%, rgba(220, 252, 231, 0.84) 50%, rgba(240, 253, 244, 0.93) 100%)',
    dark: 'linear-gradient(135deg, rgba(20, 36, 22, 0.94) 0%, rgba(27, 59, 31, 0.82) 50%, rgba(10, 18, 11, 0.95) 100%)',
    borderGlow: 'rgba(21, 128, 61, 0.35)',
    accentColor: '#15803D'
  },
  midnight: {
    light: 'linear-gradient(135deg, rgba(250, 245, 255, 0.95) 0%, rgba(237, 233, 254, 0.84) 50%, rgba(250, 245, 255, 0.93) 100%)',
    dark: 'linear-gradient(135deg, rgba(18, 20, 36, 0.94) 0%, rgba(37, 32, 77, 0.82) 50%, rgba(8, 9, 16, 0.95) 100%)',
    borderGlow: 'rgba(107, 33, 168, 0.35)',
    accentColor: '#6B21A8'
  }
};

export const getThemeGlassCardStyle = (themeId: AestheticThemeId, mode: 'light' | 'dark') => {
  const gradient = THEME_DYNAMIC_GRADIENTS[themeId] || THEME_DYNAMIC_GRADIENTS.coquette;
  return {
    backgroundImage: mode === 'light' ? gradient.light : gradient.dark,
    backgroundClip: 'padding-box',
    WebkitBackgroundClip: 'padding-box',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)'
  } as React.CSSProperties;
};

