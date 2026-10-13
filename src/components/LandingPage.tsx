import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { getThemeGlassCardStyle } from '../types/theme';
import { ThemeMotifIcon } from './ThemeIllustrations';
import { Sparkles, ArrowRight, BookOpen, Feather, Heart, Mail } from 'lucide-react';

interface LandingPageProps {
  onEnterSanctuary: () => void;
  onExploreFeed: () => void;
  onOpenPiecePreview: (title: string, content: string, author: string) => void;
}

// Curated collection of famous and evocative writing snippets & short poems
const CURATED_SNIPPETS = [
  {
    id: 's-1',
    title: 'Wild Geese',
    author: 'Mary Oliver',
    source: 'American Poet, 1986',
    tag: 'Poem',
    accent: 'matcha',
    excerpt: `You do not have to be good.
You do not have to walk on your knees
for a hundred miles through the desert repenting.
You only have to let the soft animal of your body
love what it loves.
Tell me about despair, yours, and I will tell you mine.
Meanwhile the world goes on.`
  },
  {
    id: 's-2',
    title: 'The Raincoats of October',
    author: 'Fernando Pessoa',
    source: 'The Book of Disquiet',
    tag: 'Prose',
    accent: 'midnight',
    excerpt: `My soul is a hidden orchestra; I know not what instruments, what strings and harps, what drums and tympani sound and clash inside me. I know myself only as the symphony.
To write is to forget. Literature is the most agreeable way of ignoring life.`
  },
  {
    id: 's-3',
    title: 'To Be in Love',
    author: 'Gwendolyn Brooks',
    source: 'The Bean Eaters, 1960',
    tag: 'Verse',
    accent: 'coquette',
    excerpt: `To be in love
is to touch with a lighter hand.
In yourself you stretch, you are well.
You look at things
through his eyes.
A cardinal is red.
A sky is blue.
Suddenly you realize
yesterday was only waiting.`
  },
  {
    id: 's-4',
    title: 'Letter to a Young Poet',
    author: 'Rainer Maria Rilke',
    source: 'Paris, February 1903',
    tag: 'Letter',
    accent: 'y2k',
    excerpt: `Search for the depth of things; there irony never descends.
Go into yourself. Find out the reason that commands you to write; see whether it has spread its roots into the very depth of your heart.
A work of art is good if it has arisen out of necessity.`
  },
  {
    id: 's-5',
    title: 'The Architecture of Dust',
    author: 'Virginia Woolf',
    source: 'The Waves, 1931',
    tag: 'Prose Reflection',
    accent: 'midnight',
    excerpt: `I am made and remade continually. Different people draw different words from me.
Against you I will fling myself, unvanquished and unyielding, O Death! The waves broke on the shore.`
  },
  {
    id: 's-6',
    title: 'Nothing Gold Can Stay',
    author: 'Robert Frost',
    source: 'New Hampshire, 1923',
    tag: 'Poem',
    accent: 'matcha',
    excerpt: `Nature’s first green is gold,
Her hardest hue to hold.
Her early leaf’s a flower;
But only so an hour.
Then leaf subsides to leaf.
So Eden sank to grief,
So dawn goes down to day.
Nothing gold can stay.`
  }
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterSanctuary,
  onExploreFeed,
  onOpenPiecePreview
}) => {
  const { mode, theme, themeId } = useTheme();
  const { currentUser } = useAuth();
  const cardStyle = mode === 'light' ? theme.light.card : theme.dark.card;
  const glassStyle = getThemeGlassCardStyle(themeId, mode);

  return (
    <div className="space-y-16 py-6 md:py-12 animate-in fade-in duration-300">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto px-4 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-black/20 dark:border-white/20 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md shadow-xs">
          <ThemeMotifIcon themeId={themeId} className="w-4 h-4 text-black dark:text-white" />
          <span className="text-xs font-black uppercase tracking-wider text-black dark:text-zinc-200">
            A Sanctuary for Writers & Penpals
          </span>
        </div>

        <h1 className="font-display-chic text-4xl sm:text-6xl md:text-7xl font-black text-black dark:text-white tracking-tight leading-[1.08]">
          Words that refuse <br className="hidden sm:inline" />
          <span className="italic underline decoration-pink-400 dark:decoration-pink-500 underline-offset-4">to be rushed.</span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-zinc-700 dark:text-zinc-300 max-w-2xl mx-auto font-medium leading-relaxed">
          Scribble verses in morning sunlight, collect midnight prose, and exchange quiet handwritten letters with fellow thinkers around the globe.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={onEnterSanctuary}
            className="px-6 py-3.5 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black text-sm flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            <span>Enter the Sanctuary</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onExploreFeed}
            className="px-6 py-3.5 rounded-2xl border-2 border-black/30 dark:border-white/20 bg-white/70 dark:bg-zinc-900/70 text-black dark:text-white font-black text-sm hover:bg-black/5 dark:hover:bg-white/10 transition-colors shadow-2xs backdrop-blur-md"
          >
            Browse Public Gallery
          </button>
        </div>
      </section>

      {/* Curated Literature Wall */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between border-b-2 border-black/10 dark:border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <Feather className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            <h2 className="font-display-chic text-xl md:text-2xl font-black text-black dark:text-white">
              Curated Verses & Quiet Reflections
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-zinc-500">Anthology Preview</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CURATED_SNIPPETS.map(snippet => (
            <div
              key={snippet.id}
              style={glassStyle}
              onClick={() => onOpenPiecePreview(snippet.title, snippet.excerpt, snippet.author)}
              className={`p-6 rounded-3xl border-3 ${cardStyle.border} ${cardStyle.shadow} backdrop-blur-xl hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-black tracking-widest px-2.5 py-0.5 rounded-full bg-black/10 dark:bg-white/10 text-black dark:text-white">
                    {snippet.tag}
                  </span>
                  <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                    {snippet.source}
                  </span>
                </div>

                <h3 className="font-display-chic text-lg font-black text-black dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                  {snippet.title}
                </h3>

                <p className="font-serif italic text-xs leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-line border-l-2 border-pink-400/60 dark:border-pink-500/60 pl-3">
                  {snippet.excerpt}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs">
                <span className="font-bold text-black dark:text-white">
                  — {snippet.author}
                </span>
                <span className="text-[11px] font-bold text-pink-600 dark:text-pink-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Read snippet →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The Penpal Philosophy Banner */}
      <section className="max-w-4xl mx-auto px-4">
        <div
          style={glassStyle}
          className={`p-8 md:p-10 rounded-3xl border-3 ${cardStyle.border} ${cardStyle.shadow} backdrop-blur-2xl text-center space-y-4`}
        >
          <div className="w-12 h-12 mx-auto rounded-2xl bg-white dark:bg-zinc-800 border-2 border-black/20 dark:border-white/10 flex items-center justify-center shadow-sm">
            <Mail className="w-6 h-6 text-pink-500" />
          </div>
          <h2 className="font-display-chic text-2xl md:text-3xl font-black text-black dark:text-white">
            Letters You Can Hold in the Mind
          </h2>
          <p className="text-xs md:text-sm text-zinc-700 dark:text-zinc-300 max-w-xl mx-auto leading-relaxed">
            Every writer on Velours & Verse holds a unique Penpal Code. Connect with distant kindred spirits, send letters that sit in personal letterboxes, and step back from endless feeds.
          </p>
          <div className="pt-2">
            <button
              onClick={onEnterSanctuary}
              className="px-6 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              Claim Your Penpal ID
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
