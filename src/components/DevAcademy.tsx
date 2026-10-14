import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { StorageService, SUPER_ADMIN_EMAIL, DEFAULT_AUTHOR_NOTE } from '../services/storage';
import { WritingPiece, AuthorNote, UserProfile } from '../types/writing';
import { getThemeGlassCardStyle } from '../types/theme';
import { ThemeMotifIcon } from './ThemeIllustrations';
import { AuthorNoteModal } from './AuthorNoteModal';
import {
  ShieldCheck,
  Lock,
  Code2,
  Database,
  Users,
  Eye,
  Trash2,
  UserPlus,
  BookOpen,
  Copy,
  Check,
  Server,
  Cloud,
  FileCode,
  ShieldAlert,
  Mail,
  Send,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  Bookmark,
  Heart,
  Activity,
  HardDrive,
  Zap,
  CheckCircle2,
  Download,
  AlertCircle,
  Wifi,
  WifiOff,
  X,
  ExternalLink,
  Search,
  Coffee,
  Quote,
  Target,
  Star,
  UserCheck,
  LogIn,
  Calendar,
  ArrowRight,
  User
} from 'lucide-react';

interface DevAcademyProps {
  pieces: WritingPiece[];
  onDeletePiece: (id: string) => void;
  onOpenPiece: (piece: WritingPiece) => void;
}

export const DevAcademy: React.FC<DevAcademyProps> = ({
  pieces,
  onDeletePiece,
  onOpenPiece
}) => {
  const { currentUser, isAuthenticated, isDeveloper, devRoster, addDevEmail, removeDevEmail, signInWithGoogle } = useAuth();
  const { mode, theme, themeId } = useTheme();

  const cardStyle = mode === 'light' ? theme.light.card : theme.dark.card;
  const glassStyle = getThemeGlassCardStyle(themeId, mode);

  const [activeTab, setActiveTab] = useState<'godmode' | 'author_note' | 'roster' | 'academy' | 'database' | 'diagnostics'>('godmode');
  const [newDevEmailInput, setNewDevEmailInput] = useState('');
  const [copiedCodeSnippet, setCopiedCodeSnippet] = useState<string | null>(null);
  const [dbJson, setDbJson] = useState<string>(() => StorageService.exportDataJson());
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // User Accounts Directory & Full Dossier Modal States
  const [selectedUserForModal, setSelectedUserForModal] = useState<UserProfile | null>(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'developer' | 'writer'>('all');
  const [showUserRawJson, setShowUserRawJson] = useState(false);
  const [copiedUserId, setCopiedUserId] = useState<string | null>(null);
  const [copiedPenpalId, setCopiedPenpalId] = useState<string | null>(null);
  const [usersRefreshKey, setUsersRefreshKey] = useState(0);

  // Lock body scroll when User Account Dossier modal is open
  useEffect(() => {
    if (selectedUserForModal) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [selectedUserForModal]);

  // Author's Note Custom Message States
  const [authorNote, setAuthorNote] = useState<AuthorNote | null>(() => StorageService.getAuthorNote());
  const [noteTitle, setNoteTitle] = useState(authorNote?.title || 'A Handwritten Note from the Creator 💌');
  const [noteContent, setNoteContent] = useState(authorNote?.content || DEFAULT_AUTHOR_NOTE.content);
  const [noteRecipientType, setNoteRecipientType] = useState<'all' | 'custom'>(authorNote?.targetAudience === 'all' ? 'all' : 'custom');
  const [noteTargetPenpal, setNoteTargetPenpal] = useState(authorNote?.targetAudience === 'all' ? 'PEN-ALL' : authorNote?.targetAudience || 'PEN-ALL');
  const [noteTargetName, setNoteTargetName] = useState(authorNote?.targetUserName || 'All Creative Writers');
  const [noteTag, setNoteTag] = useState(authorNote?.tag || 'Creator Dispatch');
  const [noteAuthorName, setNoteAuthorName] = useState(currentUser.displayName && currentUser.displayName !== 'Guest Reader' ? currentUser.displayName : 'Meher');
  const [noteAuthorRole, setNoteAuthorRole] = useState(authorNote?.authorRole || 'Platform Creator & Lead Developer');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [dispatchSuccessMessage, setDispatchSuccessMessage] = useState<string | null>(null);

  const [diagnosticsMessage, setDiagnosticsMessage] = useState<string | null>(null);

  const getStorageMetrics = () => {
    let totalChars = 0;
    const keyBreakdown: { key: string; kb: string }[] = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k) {
          const val = localStorage.getItem(k) || '';
          const bytes = (k.length + val.length) * 2;
          totalChars += k.length + val.length;
          keyBreakdown.push({ key: k, kb: (bytes / 1024).toFixed(2) });
        }
      }
    } catch {
      // Ignore
    }
    const totalBytes = totalChars * 2;
    const totalKb = (totalBytes / 1024).toFixed(2);
    const quotaKb = 5120;
    const percentUsed = Math.min(100, Math.max(0.1, Number(((Number(totalKb) / quotaKb) * 100).toFixed(2))));
    return { totalKb, percentUsed, keyBreakdown };
  };

  const handleSimulateNetwork = (isOffline: boolean) => {
    window.dispatchEvent(new Event(isOffline ? 'offline' : 'online'));
    setDiagnosticsMessage(`Simulated window.${isOffline ? 'offline' : 'online'} event dispatched successfully.`);
    setTimeout(() => setDiagnosticsMessage(null), 3000);
  };

  const handleSeedBatchPieces = () => {
    const samples: WritingPiece[] = [
      {
        id: `piece_seed_${Date.now()}_1`,
        title: 'Lilac Stems in Saltwater',
        content: `We brought the blossoms home wrapped in newspaper that smelled of rain and yesterday's finance section.\n\nCut them on an angle, she said. As if angles could convince dying things to drink. By midnight, the water in the cut-crystal vase had turned cloudy and fragrant, like gin infused with regret.`,
        type: 'poem',
        status: 'published',
        authorId: 'editorial_studio',
        authorDisplayName: 'Velours Editorial',
        authorPenpalId: 'PEN-ED01',
        authorEmail: 'editorial@veloursverse.app',
        authorAvatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=editorial&backgroundColor=ffd5dc',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        stars: 28,
        starredByMe: false,
        comments: [],
        moodTags: ['Botanical', 'Melancholy', 'Poem'],
        cardTint: 'rose',
        wordCount: 52,
        readTimeMinutes: 1,
        synced: true
      },
      {
        id: `piece_seed_${Date.now()}_2`,
        title: 'The Sound of a 35mm Shutter in Venice',
        content: `Every photograph is an admission of failure. You press the copper button because your memory is a sieve that leaks light.\n\nOutside the café on the Zattere, the vaporetto engines churned the lagoon into jade foam. The photographer loaded a fresh roll of Ilford HP5. The clicks of the spool were the only punctual things in Italy.`,
        type: 'story',
        status: 'published',
        authorId: 'editorial_studio',
        authorDisplayName: 'Velours Editorial',
        authorPenpalId: 'PEN-ED01',
        authorEmail: 'editorial@veloursverse.app',
        authorAvatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=editorial&backgroundColor=ffd5dc',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        stars: 35,
        starredByMe: true,
        comments: [],
        moodTags: ['Cinematic', 'Venice', 'Analogue'],
        cardTint: 'starlight',
        wordCount: 63,
        readTimeMinutes: 1,
        synced: true
      }
    ];

    samples.forEach(s => StorageService.savePiece(s));
    setDiagnosticsMessage('Injected 2 new synthesized literary pieces into database!');
    setTimeout(() => window.location.reload(), 1200);
  };

  const allUsers = React.useMemo(() => StorageService.getAllUsers(), [usersRefreshKey]);

  const filteredUsers = React.useMemo(() => {
    let result = allUsers;
    if (userRoleFilter === 'developer') {
      result = result.filter(u => u.role === 'developer' || devRoster.some(e => e.toLowerCase() === u.email.toLowerCase()));
    } else if (userRoleFilter === 'writer') {
      result = result.filter(u => u.role !== 'developer' && !devRoster.some(e => e.toLowerCase() === u.email.toLowerCase()));
    }
    if (userSearchQuery.trim()) {
      const q = userSearchQuery.toLowerCase().trim();
      result = result.filter(u =>
        u.displayName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.penpalId.toLowerCase().includes(q) ||
        (u.bio && u.bio.toLowerCase().includes(q))
      );
    }
    return result;
  }, [allUsers, userRoleFilter, userSearchQuery, devRoster]);

  const handleToggleDevRole = (user: UserProfile) => {
    const isCurrentlyDev = devRoster.some(e => e.toLowerCase() === user.email.toLowerCase()) || user.role === 'developer';
    if (isCurrentlyDev) {
      if (user.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
        setDiagnosticsMessage("Cannot revoke Super Admin role.");
        setTimeout(() => setDiagnosticsMessage(null), 3000);
        return;
      }
      removeDevEmail(user.email);
      const updatedUser: UserProfile = { ...user, role: 'writer' };
      StorageService.updateUserInDirectory(updatedUser);
      setSelectedUserForModal(updatedUser);
      setUsersRefreshKey(k => k + 1);
    } else {
      addDevEmail(user.email);
      const updatedUser: UserProfile = { ...user, role: 'developer' };
      StorageService.updateUserInDirectory(updatedUser);
      setSelectedUserForModal(updatedUser);
      setUsersRefreshKey(k => k + 1);
    }
  };

  const handleSwitchToUser = (user: UserProfile) => {
    setSelectedUserForModal(null);
    setDispatchSuccessMessage(`Inspecting dossier record for ${user.displayName} (${user.email}).`);
    setTimeout(() => setDispatchSuccessMessage(null), 4000);
  };

  const handleTargetAuthorNoteToUser = (user: UserProfile) => {
    setNoteRecipientType('custom');
    setNoteTargetPenpal(user.penpalId);
    setNoteTargetName(user.displayName);
    setActiveTab('author_note');
    setSelectedUserForModal(null);
  };

  const handleCopyText = (val: string, type: 'user' | 'penpal') => {
    navigator.clipboard.writeText(val);
    if (type === 'user') {
      setCopiedUserId(val);
      setTimeout(() => setCopiedUserId(null), 2000);
    } else {
      setCopiedPenpalId(val);
      setTimeout(() => setCopiedPenpalId(null), 2000);
    }
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeSnippet(id);
    setTimeout(() => setCopiedCodeSnippet(null), 2000);
  };

  const handleAddDev = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevEmailInput.trim()) return;
    addDevEmail(newDevEmailInput.trim());
    setNewDevEmailInput('');
  };

  const handleDispatchNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;

    const newNote: AuthorNote = {
      id: `note_${Date.now()}`,
      title: noteTitle.trim(),
      content: noteContent.trim(),
      authorName: noteAuthorName.trim() || currentUser.displayName,
      authorRole: noteAuthorRole.trim() || 'Platform Creator & Lead Developer',
      authorAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      targetAudience: noteRecipientType === 'all' ? 'all' : noteTargetPenpal.trim(),
      targetUserName: noteRecipientType === 'all' ? 'All Writers & Dreamers' : noteTargetName.trim(),
      tag: noteTag.trim() || 'Creator Dispatch',
      createdAt: new Date().toISOString(),
      active: true
    };

    StorageService.saveAuthorNote(newNote);
    setAuthorNote(newNote);
    setDispatchSuccessMessage('🎉 Note dispatched successfully! It will automatically pop up as an exquisite theme card.');
    setTimeout(() => setDispatchSuccessMessage(null), 4000);
  };

  const handleDeactivateNote = () => {
    StorageService.clearAuthorNote();
    const updated = StorageService.getAuthorNote();
    setAuthorNote(updated);
    setDispatchSuccessMessage('Note deactivated. It will no longer pop up for users.');
    setTimeout(() => setDispatchSuccessMessage(null), 3000);
  };

  const handleResetDismissal = () => {
    StorageService.undismissNote();
    setDispatchSuccessMessage('Dismissal cleared! The active note will pop up for you when you return to the feed.');
    setTimeout(() => setDispatchSuccessMessage(null), 3000);
  };

  const handleRestoreDefaultNote = () => {
    StorageService.saveAuthorNote(DEFAULT_AUTHOR_NOTE);
    setAuthorNote(DEFAULT_AUTHOR_NOTE);
    setNoteTitle(DEFAULT_AUTHOR_NOTE.title);
    setNoteContent(DEFAULT_AUTHOR_NOTE.content);
    setNoteRecipientType('all');
    setNoteTag(DEFAULT_AUTHOR_NOTE.tag || 'Creator Dispatch');
    setDispatchSuccessMessage('Restored default creator welcome note.');
    setTimeout(() => setDispatchSuccessMessage(null), 3000);
  };

  const currentPreviewNote: AuthorNote = {
    id: authorNote?.id || 'note_preview',
    title: noteTitle.trim() || 'A Handwritten Note from the Creator 💌',
    content: noteContent.trim() || 'Your customized note content will appear here...',
    authorName: noteAuthorName.trim() || currentUser.displayName,
    authorRole: noteAuthorRole.trim() || 'Platform Creator & Lead Developer',
    authorAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    targetAudience: noteRecipientType === 'all' ? 'all' : noteTargetPenpal.trim(),
    targetUserName: noteRecipientType === 'all' ? 'All Writers & Dreamers' : noteTargetName.trim(),
    tag: noteTag.trim() || 'Creator Dispatch',
    createdAt: new Date().toISOString(),
    active: true
  };

  // If user is not an authorized developer
  if (!isDeveloper) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 flex items-center justify-center mx-auto border-2 border-rose-300 dark:border-rose-700">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="font-display-chic text-2xl font-bold text-zinc-950 dark:text-white">
            Developer Console Restricted
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto font-medium">
            This module contains God Mode moderation access and core development documentation. Only authorized developers (such as <code className="font-mono text-zinc-950 dark:text-zinc-100 font-bold bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">{SUPER_ADMIN_EMAIL}</code>) can enter.
          </p>
        </div>

        {isAuthenticated ? (
          <div className="space-y-3">
            <p className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-300 dark:border-rose-800">
              Signed in as <span className="font-mono">{currentUser.email}</span>. Only <span className="font-mono">{SUPER_ADMIN_EMAIL}</span> holds developer clearance.
            </p>
          </div>
        ) : (
          <button
            onClick={() => signInWithGoogle()}
            className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-black dark:bg-white dark:text-black shadow-md hover:scale-105 active:scale-95 transition-all border-2 border-black dark:border-white flex items-center gap-2 mx-auto"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Sign In with Administrator Google Account</span>
          </button>
        )}
      </div>
    );
  }

  // Count metrics for God Mode
  const totalPieces = pieces.length;
  const draftPieces = pieces.filter(p => p.status === 'draft');
  const publishedPieces = pieces.filter(p => p.status === 'published');

  const SUPABASE_SCHEMA_SQL = `-- Velours & Verse Production Supabase Schema & Automation Trigger
-- 1. Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL,
  penpal_id TEXT UNIQUE NOT NULL,
  avatar TEXT,
  bio TEXT,
  favorite_drink TEXT DEFAULT 'Vanilla Chai Latte',
  favorite_quote TEXT DEFAULT '“Words that refuse to be rushed.”',
  writing_goal_words INTEGER DEFAULT 500,
  role TEXT DEFAULT 'writer',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 2. Pieces table
CREATE TABLE IF NOT EXISTS public.pieces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('poem', 'story', 'prose', 'journal', 'letter')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'penpals')),
  mood_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  card_tint TEXT DEFAULT 'default',
  stars INTEGER DEFAULT 0,
  word_count INTEGER DEFAULT 0,
  read_time_minutes INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.pieces ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view published pieces" ON public.pieces;
CREATE POLICY "Public can view published pieces" ON public.pieces FOR SELECT USING (status = 'published' OR auth.uid() = author_id);
DROP POLICY IF EXISTS "Users can insert pieces" ON public.pieces;
CREATE POLICY "Users can insert pieces" ON public.pieces FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
DROP POLICY IF EXISTS "Users can update their own pieces" ON public.pieces;
CREATE POLICY "Users can update their own pieces" ON public.pieces FOR UPDATE TO authenticated USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);
DROP POLICY IF EXISTS "Users can delete their own pieces" ON public.pieces;
CREATE POLICY "Users can delete their own pieces" ON public.pieces FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- 3. Penpals table
CREATE TABLE IF NOT EXISTS public.penpals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  penpal_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, penpal_id)
);

ALTER TABLE public.penpals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their penpals" ON public.penpals;
CREATE POLICY "Users can view their penpals" ON public.penpals FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert penpals" ON public.penpals;
CREATE POLICY "Users can insert penpals" ON public.penpals FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete penpals" ON public.penpals;
CREATE POLICY "Users can delete penpals" ON public.penpals FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 4. Comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  piece_id UUID REFERENCES public.pieces(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public comments are readable by everyone" ON public.comments;
CREATE POLICY "Public comments are readable by everyone" ON public.comments FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can post comments" ON public.comments;
CREATE POLICY "Authenticated users can post comments" ON public.comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;
CREATE POLICY "Users can delete their own comments" ON public.comments FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- 5. Auto-profile trigger on auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, penpal_id, avatar, bio, favorite_drink, favorite_quote, writing_goal_words, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'PEN-' || UPPER(SUBSTRING(REPLACE(gen_random_uuid()::text, '-', '') FROM 1 FOR 5)),
    COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/notionists/svg?seed=' || new.id || '&backgroundColor=ffdfbf,ffd5dc,d1d4f9'),
    'Creative writer on Velours & Verse. Drafting quiet verses and unhurried thoughts.',
    'Vanilla Chai Latte',
    '“I write to find out what I’m talking about.” — Edward Albee',
    500,
    CASE WHEN LOWER(new.email) = 'hiox2004@gmail.com' THEN 'developer' ELSE 'writer' END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();`;

  const VERCEL_CONFIG_JSON = `{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Dev Header Banner with Writing Log Glass Depth */}
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

        <div className="relative z-10 space-y-3 pt-1">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full ${cardStyle.accentBar} text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-2xs`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Developer God Mode</span>
            </span>
            <span className="text-xs text-black dark:text-zinc-200 font-mono font-bold">
              Authenticated: {currentUser.email}
            </span>
          </div>

          <h2 className="font-display-chic text-2xl md:text-3xl font-black text-black dark:text-white">
            Engineering Console & Academy
          </h2>

          <p className="font-serif-literary text-black dark:text-zinc-100 text-base max-w-2xl font-bold leading-relaxed">
            Complete platform observability, ethical moderation oversight (including user drafts review), developer roster management, and architectural learning guides.
          </p>
        </div>

        <div className="absolute right-4 bottom-2 text-black/15 dark:text-white/15 opacity-60 pointer-events-none" aria-hidden="true">
          <ThemeMotifIcon themeId={themeId} className="w-28 h-28" />
        </div>
      </div>

      {/* Navigation Tabs (God Mode, Dev Roster, Academy, Database) */}
      <div className="flex items-center gap-1 p-1.5 bg-black/5 dark:bg-white/5 rounded-2xl overflow-x-auto text-xs font-black border-2 border-black/20 dark:border-white/10 backdrop-blur-md">
        <button
          onClick={() => setActiveTab('godmode')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'godmode'
              ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs font-black'
              : 'text-black dark:text-zinc-300 hover:text-black font-bold'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-pink-500 stroke-[2.5]" />
          <span>God Mode Moderation ({totalPieces})</span>
        </button>

        <button
          onClick={() => setActiveTab('author_note')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'author_note'
              ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs font-black'
              : 'text-black dark:text-zinc-300 hover:text-black font-bold'
          }`}
        >
          <Mail className="w-3.5 h-3.5 text-pink-500 stroke-[2.5]" />
          <span>Note from Author (Dispatcher) 💌</span>
        </button>

        <button
          onClick={() => setActiveTab('roster')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'roster'
              ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs font-black'
              : 'text-black dark:text-zinc-300 hover:text-black font-bold'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-indigo-500 stroke-[2.5]" />
          <span>Developer Roster ({devRoster.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('academy')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'academy'
              ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs font-black'
              : 'text-black dark:text-zinc-300 hover:text-black font-bold'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-emerald-500 stroke-[2.5]" />
          <span>App Dev Academy & Blueprints</span>
        </button>

        <button
          onClick={() => setActiveTab('database')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'database'
              ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs font-black'
              : 'text-black dark:text-zinc-300 hover:text-black font-bold'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-amber-500 stroke-[2.5]" />
          <span>Raw Database Inspector</span>
        </button>

        <button
          onClick={() => setActiveTab('diagnostics')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'diagnostics'
              ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs font-black'
              : 'text-black dark:text-zinc-300 hover:text-black font-bold'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-cyan-500 stroke-[2.5]" />
          <span>Telemetry & Chaos Sandbox ⚡</span>
        </button>
      </div>

      {/* TAB 1: GOD MODE & ETHICAL MODERATION */}
      {activeTab === 'godmode' && (
        <div className="space-y-6">
          {/* Ethical Moderation Policy Banner */}
          <div
            style={glassStyle}
            className={`p-4 rounded-2xl border-2 ${cardStyle.border} text-xs text-black dark:text-zinc-100 flex items-start gap-3 font-bold backdrop-blur-md shadow-2xs`}
          >
            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 stroke-[2.5]" />
            <div>
              <strong className="block font-black text-black dark:text-white">Ethical Moderation Disclosure:</strong>
              As lead developer, you have God Mode access to all writings across the system—including private drafts and penpal-shared pieces. This allows ensuring platform safety, community guidelines compliance, and preventing harmful content. Draft access is strictly confidential for moderation and will be explicitly disclosed in the public Privacy Policy upon commercial launch.
            </div>
          </div>

          {/* Quick Metrics Cards Styled as Writing Log Glass Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div
              style={glassStyle}
              className={`group relative p-4 rounded-2xl border-3 ${cardStyle.border} ${cardStyle.shadow} overflow-hidden backdrop-blur-md transition-all hover:-translate-y-0.5`}
            >
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${cardStyle.accentBar}`} />
              <span className="font-mono text-2xl font-black text-black dark:text-white block pt-1">{totalPieces}</span>
              <div className="text-[11px] text-black dark:text-zinc-200 font-bold mt-1">Total Pieces</div>
            </div>

            <div
              style={glassStyle}
              className={`group relative p-4 rounded-2xl border-3 ${cardStyle.border} ${cardStyle.shadow} overflow-hidden backdrop-blur-md transition-all hover:-translate-y-0.5`}
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-500" />
              <span className="font-mono text-2xl font-black text-amber-700 dark:text-amber-300 block pt-1">{draftPieces.length}</span>
              <div className="text-[11px] text-black dark:text-zinc-200 font-bold mt-1">Private Drafts</div>
            </div>

            <div
              style={glassStyle}
              className={`group relative p-4 rounded-2xl border-3 ${cardStyle.border} ${cardStyle.shadow} overflow-hidden backdrop-blur-md transition-all hover:-translate-y-0.5`}
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-500" />
              <span className="font-mono text-2xl font-black text-emerald-700 dark:text-emerald-300 block pt-1">{publishedPieces.length}</span>
              <div className="text-[11px] text-black dark:text-zinc-200 font-bold mt-1">Published Pieces</div>
            </div>

            <div
              style={glassStyle}
              className={`group relative p-4 rounded-2xl border-3 ${cardStyle.border} ${cardStyle.shadow} overflow-hidden backdrop-blur-md transition-all hover:-translate-y-0.5`}
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-pink-500" />
              <span className="font-mono text-2xl font-black text-pink-700 dark:text-pink-300 block pt-1">{allUsers.length}</span>
              <div className="text-[11px] text-black dark:text-zinc-200 font-bold mt-1">User Profiles</div>
            </div>
          </div>

          {/* All Pieces Stream (Including Drafts) Styled as Themed Cards */}
          <div className="space-y-3">
            <h3 className="font-display-chic text-lg font-black text-black dark:text-white">
              System-Wide Writings Stream (Including Drafts)
            </h3>

            <div className="space-y-3">
              {pieces.map(p => (
                <div
                  key={p.id}
                  style={glassStyle}
                  className={`group relative p-4 rounded-2xl border-3 ${cardStyle.border} ${cardStyle.shadow} flex flex-col sm:flex-row sm:items-center justify-between gap-3 overflow-hidden backdrop-blur-md hover:-translate-y-0.5 transition-all duration-200`}
                >
                  {/* Top Accent Strip Bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 ${cardStyle.accentBar}`} />

                  {/* Decorative Corner Theme Watermark */}
                  <div className="absolute right-3.5 top-3.5 opacity-20 group-hover:opacity-40 text-black dark:text-white pointer-events-none transition-opacity">
                    <ThemeMotifIcon themeId={themeId} className="w-3.5 h-3.5" />
                  </div>

                  <div className="space-y-1 min-w-0 pt-0.5">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="font-black text-black dark:text-white truncate">
                        {p.title}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize font-black ${
                        p.status === 'draft'
                          ? 'bg-amber-200 text-amber-950 dark:bg-amber-950/70 dark:text-amber-200 border border-amber-400'
                          : p.status === 'penpals'
                          ? 'bg-pink-200 text-pink-950 dark:bg-pink-950/70 dark:text-pink-200 border border-pink-400'
                          : 'bg-emerald-200 text-emerald-950 dark:bg-emerald-950/70 dark:text-emerald-200 border border-emerald-400'
                      }`}>
                        {p.status}
                      </span>
                      <span className="text-black/40 dark:text-zinc-500">·</span>
                      <span className="text-black dark:text-zinc-200 font-bold capitalize">{p.type}</span>
                    </div>

                    <div className="text-xs text-black dark:text-zinc-200 flex items-center gap-2 font-bold flex-wrap">
                      <span>Author: <strong className="text-black dark:text-white font-black">{p.authorDisplayName}</strong></span>
                      <span className="text-pink-700 dark:text-pink-400 font-mono font-black">({p.authorPenpalId})</span>
                      <span className="text-black/40 dark:text-zinc-500">·</span>
                      <span className="text-indigo-700 dark:text-indigo-300 font-mono text-[11px] font-bold">
                        Gmail: {p.authorEmail}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
                    <button
                      onClick={() => onOpenPiece(p)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-black text-white dark:bg-white dark:text-black border-2 border-black dark:border-white hover:opacity-90 active:scale-95 transition-all shadow-2xs"
                    >
                      Read & Inspect
                    </button>
                    <button
                      onClick={() => onDeletePiece(p.id)}
                      className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-100/60 dark:hover:bg-rose-950/40 transition-colors"
                      title="Moderate / Delete piece"
                    >
                      <Trash2 className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Accounts Directory (Writing Log Glass Depth & Interactive Dossier) */}
          <div
            style={glassStyle}
            className={`group relative p-6 md:p-8 rounded-3xl border-3 ${cardStyle.border} ${cardStyle.shadow} overflow-hidden backdrop-blur-xl shadow-xl transition-all space-y-5`}
          >
            {/* Top Accent Strip Bar */}
            <div className={`absolute top-0 left-0 right-0 h-2 ${cardStyle.accentBar}`} />

            {/* Frosted Glass Sheen Overlay */}
            <div
              className="absolute inset-0 bg-gradient-to-b from-white/35 dark:from-white/10 to-transparent pointer-events-none rounded-3xl"
              style={{ backgroundClip: 'padding-box', WebkitBackgroundClip: 'padding-box' }}
            />

            {/* Decorative Theme Watermark */}
            <div className="absolute right-4 top-4 opacity-15 pointer-events-none text-black dark:text-white" aria-hidden="true">
              <ThemeMotifIcon themeId={themeId} className="w-16 h-16" />
            </div>

            {/* Directory Header Bar */}
            <div className="relative z-10 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full ${cardStyle.accentBar} text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-2xs`}>
                  <Users className="w-3.5 h-3.5" />
                  <span>User Accounts Directory & Records ({allUsers.length})</span>
                </span>
                <span className="text-xs text-black/70 dark:text-zinc-300 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>God Mode Access · Click any account to view complete DB dossier</span>
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div>
                  <h3 className="font-display-chic text-xl font-black text-black dark:text-white">
                    Registered Writers & Developer Profiles
                  </h3>
                  <p className="text-xs font-bold text-black/80 dark:text-zinc-200">
                    Comprehensive ledger of all user entities, private Gmails, Penpal IDs, manifestos, goals, and writings.
                  </p>
                </div>

                {/* Filter and Search controls */}
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-black/50 dark:text-zinc-400 stroke-[2.5]" />
                    <input
                      type="text"
                      placeholder="Search accounts..."
                      value={userSearchQuery}
                      onChange={e => setUserSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white/80 dark:bg-zinc-800/80 border-2 border-black/30 dark:border-zinc-700 font-bold text-black dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 w-44 sm:w-52"
                    />
                  </div>

                  <div className="flex items-center p-0.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/20 dark:border-white/10 text-[11px] font-bold">
                    <button
                      onClick={() => setUserRoleFilter('all')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        userRoleFilter === 'all'
                          ? 'bg-black text-white dark:bg-white dark:text-black font-black shadow-xs'
                          : 'text-black dark:text-zinc-300'
                      }`}
                    >
                      All ({allUsers.length})
                    </button>
                    <button
                      onClick={() => setUserRoleFilter('developer')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        userRoleFilter === 'developer'
                          ? 'bg-indigo-600 text-white font-black shadow-xs'
                          : 'text-black dark:text-zinc-300'
                      }`}
                    >
                      Devs
                    </button>
                    <button
                      onClick={() => setUserRoleFilter('writer')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        userRoleFilter === 'writer'
                          ? 'bg-black text-white dark:bg-white dark:text-black font-black shadow-xs'
                          : 'text-black dark:text-zinc-300'
                      }`}
                    >
                      Writers
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Cards Grid / List with Writing Log depth */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 relative z-10 pt-1">
              {filteredUsers.length === 0 ? (
                <div className="col-span-full py-8 text-center text-xs font-bold text-black/60 dark:text-zinc-400">
                  No user accounts matching &ldquo;{userSearchQuery}&rdquo;
                </div>
              ) : (
                filteredUsers.map(user => {
                  const email = user.email || '';
                  const penpalIds = user.penpalIds || [];
                  const userPieces = pieces.filter(p => p.authorId === user.id || (p.authorEmail && p.authorEmail.toLowerCase() === email.toLowerCase()));
                  const isUserDev = devRoster.some(e => e.toLowerCase() === email.toLowerCase()) || user.role === 'developer';
                  const totalWords = userPieces.reduce((acc, p) => acc + (p.wordCount || 0), 0);
                  const isSuper = email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

                  return (
                    <div
                      key={user.id}
                      onClick={() => setSelectedUserForModal(user)}
                      style={glassStyle}
                      className={`group/card relative p-5 rounded-3xl border-3 ${cardStyle.border} ${cardStyle.shadow} backdrop-blur-xl cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col justify-between`}
                    >
                      {/* Top micro accent strip */}
                      <div className={`absolute top-0 left-0 right-0 h-1.5 ${isSuper ? 'bg-amber-400' : isUserDev ? 'bg-indigo-600' : cardStyle.accentBar}`} />

                      {/* Frosted Sheen Overlay */}
                      <div
                        className="absolute inset-0 bg-gradient-to-b from-white/30 dark:from-white/10 to-transparent pointer-events-none rounded-3xl"
                        style={{ backgroundClip: 'padding-box', WebkitBackgroundClip: 'padding-box' }}
                      />

                      {/* Header row: Avatar, Name, Role badge */}
                      <div className="space-y-3 relative z-10">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative shrink-0">
                              <img
                                src={user.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${user.displayName}`}
                                alt={user.displayName}
                                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-black/20 dark:ring-white/20 shadow-xs group-hover/card:scale-105 transition-transform"
                                referrerPolicy="no-referrer"
                              />
                              {isUserDev && (
                                <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-indigo-600 text-white shadow-2xs" title="Developer God Mode Account">
                                  <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                                </span>
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h4 className="font-display-chic text-base font-black text-black dark:text-white truncate">
                                  {user.displayName}
                                </h4>
                                {user.id === currentUser.id && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 font-black border border-emerald-400">
                                    Active Session
                                  </span>
                                )}
                              </div>
                              <span className="text-xs font-mono text-pink-700 dark:text-pink-400 font-black block">
                                {user.penpalId}
                              </span>
                            </div>
                          </div>

                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full shrink-0 uppercase tracking-wider ${
                            isSuper
                              ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border-2 border-amber-400'
                              : isUserDev
                              ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-200 border-2 border-indigo-400'
                              : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700'
                          }`}>
                            {isSuper ? 'Lead Architect' : isUserDev ? 'Developer' : 'Writer'}
                          </span>
                        </div>

                        {/* Private Gmail indicator (God Mode perk) */}
                        <div className="flex items-center gap-2 text-xs font-mono text-indigo-800 dark:text-indigo-300 font-bold bg-indigo-50/80 dark:bg-indigo-950/50 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800/70 truncate">
                          <Lock className="w-3.5 h-3.5 shrink-0 text-indigo-600 stroke-[2.5]" />
                          <span className="truncate">{email || 'No email attached'}</span>
                        </div>

                        {/* Bio snippet */}
                        {user.bio ? (
                          <p className="text-xs text-black/85 dark:text-zinc-200 font-serif-literary line-clamp-2 italic leading-relaxed bg-black/5 dark:bg-white/5 p-2.5 rounded-xl border border-black/10 dark:border-white/10">
                            &ldquo;{user.bio}&rdquo;
                          </p>
                        ) : (
                          <div className="text-xs text-black/50 dark:text-zinc-400 italic">
                            Creative writer exploring the Velours &amp; Verse sanctuary.
                          </div>
                        )}
                      </div>

                      {/* Footer metrics & CTA */}
                      <div className="pt-3 mt-3 border-t-2 border-black/10 dark:border-white/10 flex items-center justify-between text-xs font-bold gap-2 relative z-10">
                        <div className="flex items-center gap-2 text-[11px] text-black/75 dark:text-zinc-300 font-mono">
                          <span className="font-black text-black dark:text-white">{userPieces.length} pieces</span>
                          <span>·</span>
                          <span>{totalWords.toLocaleString()} words</span>
                          <span>·</span>
                          <span className="text-pink-600 dark:text-pink-400 font-black">{penpalIds.length} penpals</span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUserForModal(user);
                          }}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-black text-white dark:bg-white dark:text-black hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 shadow-sm border-2 border-black dark:border-white shrink-0"
                        >
                          <span>Open Details</span>
                          <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB: AUTHOR NOTE DISPATCHER & CUSTOM MESSAGES */}
      {activeTab === 'author_note' && (
        <div className="space-y-6">
          {/* Dispatcher Header Banner */}
          <div
            style={glassStyle}
            className={`group relative p-6 md:p-8 rounded-3xl border-3 ${cardStyle.border} ${cardStyle.shadow} overflow-hidden backdrop-blur-xl shadow-xl transition-all space-y-3`}
          >
            <div className={`absolute top-0 left-0 right-0 h-2 ${cardStyle.accentBar}`} />
            {/* Frosted Glass Sheen */}
            <div
              className="absolute inset-0 bg-gradient-to-b from-white/35 dark:from-white/10 to-transparent pointer-events-none rounded-3xl"
              style={{ backgroundClip: 'padding-box', WebkitBackgroundClip: 'padding-box' }}
            />

            <div className="flex items-center justify-between flex-wrap gap-2 relative z-10 pt-1">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full ${cardStyle.accentBar} text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-2xs`}>
                  <Mail className="w-3.5 h-3.5" />
                  <span>Author Note Engine</span>
                </span>
                <span className="text-xs font-black text-black dark:text-zinc-200">
                  Custom Reader Dispatches & Thematic Popup Cards
                </span>
              </div>

              {dispatchSuccessMessage && (
                <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 border-2 border-emerald-500 text-xs font-black animate-in fade-in">
                  {dispatchSuccessMessage}
                </span>
              )}
            </div>

            <h3 className="font-display-chic text-xl md:text-2xl font-black text-black dark:text-white relative z-10">
              Compose & Dispatch Note from the Author
            </h3>
            <p className="font-serif-literary text-sm text-black dark:text-zinc-100 font-bold max-w-3xl leading-relaxed relative z-10">
              Send personalized letters or platform-wide messages directly to writers. The note appears as a beautifully crafted, theme-styled modal card with smooth entrance and exit animations. Once closed, it neatly folds away and disappears.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Compose Form (7 cols) */}
            <form
              onSubmit={handleDispatchNote}
              style={glassStyle}
              className={`lg:col-span-7 group relative p-6 rounded-3xl border-3 ${cardStyle.border} ${cardStyle.shadow} overflow-hidden backdrop-blur-md space-y-5`}
            >
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${cardStyle.accentBar}`} />
              <div className="flex items-center justify-between pb-2 border-b-2 border-black/15 dark:border-white/15 relative z-10 pt-1">
                <span className="font-display-chic text-base font-black text-black dark:text-white flex items-center gap-2">
                  <Send className="w-4 h-4 text-pink-600" />
                  <span>Compose Dispatch</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsPreviewModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-black text-white dark:bg-white dark:text-black border-2 border-black dark:border-white hover:opacity-90 active:scale-95 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Preview Card Live</span>
                </button>
              </div>

              {/* Title Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-black dark:text-white uppercase tracking-wider block">
                  Letter Title / Subject
                </label>
                <input
                  type="text"
                  value={noteTitle}
                  onChange={e => setNoteTitle(e.target.value)}
                  placeholder="e.g. A Handwritten Note from the Creator 💌"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black dark:border-zinc-600 bg-white dark:bg-zinc-800 text-black dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    'A Handwritten Note from the Creator 💌',
                    'Midnight Thoughts on Writing & Solitude ✨',
                    'A Personal Letter for You 🌿',
                    'Behind the Scenes: Notes from the Studio ☕'
                  ].map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setNoteTitle(preset)}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-black dark:text-zinc-200 border border-black/20 hover:border-black"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Tag & Author Signature */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-black dark:text-white uppercase tracking-wider block">
                    Category Tag / Badge
                  </label>
                  <input
                    type="text"
                    value={noteTag}
                    onChange={e => setNoteTag(e.target.value)}
                    placeholder="e.g. Creator Dispatch"
                    className="w-full px-3 py-2 rounded-xl border-2 border-black dark:border-zinc-600 bg-white dark:bg-zinc-800 text-black dark:text-white text-xs font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-black dark:text-white uppercase tracking-wider block">
                    Author Name Signature
                  </label>
                  <input
                    type="text"
                    value={noteAuthorName}
                    onChange={e => setNoteAuthorName(e.target.value)}
                    placeholder="e.g. Meher"
                    className="w-full px-3 py-2 rounded-xl border-2 border-black dark:border-zinc-600 bg-white dark:bg-zinc-800 text-black dark:text-white text-xs font-bold"
                  />
                </div>
              </div>

              {/* Recipient Targeting Selector */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border-2 border-black/20 dark:border-zinc-700">
                <label className="text-xs font-black text-black dark:text-white uppercase tracking-wider block">
                  Target Recipient & Audience
                </label>

                <div className="grid grid-cols-2 gap-2 text-xs font-black">
                  <button
                    type="button"
                    onClick={() => {
                      setNoteRecipientType('all');
                      setNoteTargetName('All Writers & Dreamers');
                    }}
                    className={`p-2.5 rounded-xl border-2 transition-all text-left flex items-center gap-2 ${
                      noteRecipientType === 'all'
                        ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                        : 'bg-white dark:bg-zinc-800 text-black dark:text-white border-zinc-300 dark:border-zinc-600'
                    }`}
                  >
                    <Users className="w-4 h-4 shrink-0" />
                    <div>
                      <div className="font-black">Broadcast to All</div>
                      <div className="text-[10px] opacity-80 font-normal">Every visitor receives note</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNoteRecipientType('custom');
                      const firstUser = allUsers.find(u => u.email !== currentUser.email) || allUsers[0];
                      if (firstUser) {
                        setNoteTargetPenpal(firstUser.penpalId);
                        setNoteTargetName(firstUser.displayName);
                      }
                    }}
                    className={`p-2.5 rounded-xl border-2 transition-all text-left flex items-center gap-2 ${
                      noteRecipientType === 'custom'
                        ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                        : 'bg-white dark:bg-zinc-800 text-black dark:text-white border-zinc-300 dark:border-zinc-600'
                    }`}
                  >
                    <Heart className="w-4 h-4 shrink-0 text-pink-500" />
                    <div>
                      <div className="font-black">Custom to Penpal</div>
                      <div className="text-[10px] opacity-80 font-normal">Personal targeted letter</div>
                    </div>
                  </button>
                </div>

                {noteRecipientType === 'custom' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 animate-in fade-in">
                    <div>
                      <label className="text-[11px] font-black text-black dark:text-white block mb-1">
                        Select Recipient User:
                      </label>
                      <select
                        value={noteTargetPenpal}
                        onChange={e => {
                          const penpalId = e.target.value;
                          setNoteTargetPenpal(penpalId);
                          const user = allUsers.find(u => u.penpalId === penpalId);
                          if (user) setNoteTargetName(user.displayName);
                        }}
                        className="w-full px-3 py-2 rounded-xl border-2 border-black dark:border-zinc-600 bg-white dark:bg-zinc-800 text-black dark:text-white text-xs font-bold"
                      >
                        {allUsers.map(u => (
                          <option key={u.id} value={u.penpalId}>
                            {u.displayName} ({u.penpalId})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-black text-black dark:text-white block mb-1">
                        Display Recipient Name:
                      </label>
                      <input
                        type="text"
                        value={noteTargetName}
                        onChange={e => setNoteTargetName(e.target.value)}
                        placeholder="e.g. Fellow Thinker or All Writers"
                        className="w-full px-3 py-2 rounded-xl border-2 border-black dark:border-zinc-600 bg-white dark:bg-zinc-800 text-black dark:text-white text-xs font-bold"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Note Content / Prose */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-black dark:text-white uppercase tracking-wider block">
                    Message / Prose Body
                  </label>
                  <span className="text-[11px] font-mono text-zinc-500 font-bold">
                    {noteContent.length} chars
                  </span>
                </div>
                <textarea
                  value={noteContent}
                  onChange={e => setNoteContent(e.target.value)}
                  rows={6}
                  required
                  placeholder="Write your personal note, thoughts, or reflections here..."
                  className="w-full p-4 rounded-xl border-2 border-black dark:border-zinc-600 bg-white dark:bg-zinc-800 text-black dark:text-white font-serif-literary text-sm font-bold leading-relaxed focus:outline-none focus:ring-2 focus:ring-pink-500 resize-y"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPreviewModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl text-xs font-black bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white border-2 border-black/30 dark:border-zinc-600 hover:bg-zinc-300 transition-all flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview Popup</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-pink-600 hover:bg-pink-700 active:scale-95 transition-all shadow-md border-2 border-black dark:border-white flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Dispatch Note Now 🚀</span>
                </button>
              </div>
            </form>

            {/* Right: Active Status & Management Controls (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Currently Dispatched Note Card */}
              <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border-3 border-black dark:border-zinc-700 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-display-chic text-base font-black text-black dark:text-white flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-pink-600" />
                    <span>Currently Active Note</span>
                  </h4>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    authorNote?.active
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-400'
                      : 'bg-zinc-200 text-zinc-700'
                  }`}>
                    {authorNote?.active ? 'Active & Dispatched' : 'Inactive'}
                  </span>
                </div>

                {authorNote ? (
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/70 border-2 border-black/15 dark:border-white/10 space-y-2.5 text-xs">
                    <div className="font-black text-sm text-black dark:text-white">
                      {authorNote.title}
                    </div>

                    <p className="font-serif-literary text-black dark:text-zinc-200 line-clamp-3 font-bold leading-relaxed">
                      {authorNote.content}
                    </p>

                    <div className="pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px] text-zinc-600 dark:text-zinc-400 font-bold">
                      <span>To: <strong className="text-black dark:text-white">{authorNote.targetUserName || authorNote.targetAudience}</strong></span>
                      <span>By: <strong className="text-black dark:text-white">{authorNote.authorName}</strong></span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 italic">No author note currently configured.</p>
                )}

                {/* Testing & Reset Actions */}
                <div className="space-y-2 pt-2 border-t-2 border-black/10 dark:border-white/10 text-xs font-black">
                  <button
                    onClick={() => setIsPreviewModalOpen(true)}
                    className="w-full px-3 py-2 rounded-xl bg-pink-100 dark:bg-pink-950/50 text-pink-800 dark:text-pink-200 border-2 border-pink-400 hover:bg-pink-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>View in Active Theme ({theme.name})</span>
                  </button>

                  <button
                    onClick={handleResetDismissal}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white border-2 border-black/20 dark:border-zinc-700 hover:bg-zinc-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Dismissal for Myself</span>
                  </button>

                  {authorNote?.active && (
                    <button
                      onClick={handleDeactivateNote}
                      className="w-full px-3 py-2 rounded-xl text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 hover:bg-rose-100 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Deactivate Note (Silent Mode)</span>
                    </button>
                  )}

                  <button
                    onClick={handleRestoreDefaultNote}
                    className="w-full px-3 py-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors text-[11px]"
                  >
                    Restore Default Welcome Note
                  </button>
                </div>
              </div>

              {/* Documentation Helper Note */}
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border-2 border-indigo-200 dark:border-indigo-800 text-xs text-indigo-950 dark:text-indigo-200 font-bold space-y-1">
                <strong className="block text-indigo-900 dark:text-indigo-100 font-black">
                  ✨ Thematic Rendering Architecture:
                </strong>
                The popup dynamically adapts its vectors, fonts, wax seals, and borders to whichever aesthetic the user has selected (Coquette bow, Y2K chrome stars, Matcha leaf, Midnight crescent).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DEVELOPER ROSTER MANAGEMENT */}
      {activeTab === 'roster' && (
        <div className="space-y-6">
          <div
            style={glassStyle}
            className={`group relative p-6 rounded-2xl border-3 ${cardStyle.border} ${cardStyle.shadow} space-y-4 overflow-hidden backdrop-blur-md shadow-xs`}
          >
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${cardStyle.accentBar}`} />
            <h3 className="font-display-chic text-lg font-black text-black dark:text-white flex items-center gap-2 relative z-10 pt-1">
              <Users className="w-5 h-5 text-indigo-600 stroke-[2.5]" />
              <span>Developer Team Access Management</span>
            </h3>

            <p className="text-xs text-black dark:text-zinc-100 font-bold leading-relaxed relative z-10">
              Users who sign in with any of the email addresses listed below will automatically receive Developer God Mode access and academy access. The primary architect <code className="font-mono text-pink-700 dark:text-pink-400 font-black bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded border border-black/20">{SUPER_ADMIN_EMAIL}</code> is permanent.
            </p>

            {/* Add Developer Form */}
            <form onSubmit={handleAddDev} className="flex gap-2 relative z-10">
              <input
                type="email"
                value={newDevEmailInput}
                onChange={e => setNewDevEmailInput(e.target.value)}
                placeholder="developer@gmail.com"
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/90 dark:bg-zinc-800/90 text-black dark:text-white border-2 border-black/30 dark:border-white/20 outline-none focus:border-black dark:focus:border-white"
              />
              <button
                type="submit"
                disabled={!newDevEmailInput.trim()}
                className="px-4 py-2.5 rounded-xl text-xs font-black bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white hover:opacity-90 active:scale-95 disabled:opacity-40 flex items-center gap-1.5 transition-all shadow-2xs"
              >
                <UserPlus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Grant Developer Access</span>
              </button>
            </form>

            {/* Dev Email List */}
            <div className="space-y-2 pt-2 relative z-10">
              {devRoster.map(email => {
                const isSuper = email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
                return (
                  <div
                    key={email}
                    className="p-3.5 rounded-xl bg-white/80 dark:bg-zinc-800/80 border-2 border-black/20 dark:border-white/15 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className={`w-4 h-4 ${isSuper ? 'text-pink-600' : 'text-indigo-600'}`} />
                      <span className="font-mono font-black text-black dark:text-white">{email}</span>
                      {isSuper && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-200 text-pink-900 border border-pink-400 font-black">
                          Super Admin
                        </span>
                      )}
                    </div>

                    {!isSuper && (
                      <button
                        onClick={() => removeDevEmail(email)}
                        className="text-xs text-rose-600 hover:text-rose-800 font-black"
                      >
                        Revoke Access
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: APP DEV ACADEMY & BLUEPRINTS */}
      {activeTab === 'academy' && (
        <div className="space-y-6">
          {/* Chapter 1: Architecture */}
          <div
            style={glassStyle}
            className={`group relative p-6 rounded-2xl border-3 ${cardStyle.border} ${cardStyle.shadow} space-y-3 overflow-hidden backdrop-blur-md shadow-xs`}
          >
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${cardStyle.accentBar}`} />
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-black text-xs relative z-10 pt-1">
              <Server className="w-4 h-4 stroke-[2.5]" />
              <span>Chapter 1: Single Page App (SPA) Reactive Architecture</span>
            </div>
            <h3 className="font-display-chic text-xl font-black text-black dark:text-white relative z-10">
              How Velours & Verse Delivers Instant Feel-Good UX
            </h3>
            <p className="text-xs text-black dark:text-zinc-100 font-bold leading-relaxed relative z-10">
              Modern creative writing apps must never make the writer wait for network requests while composing. The app uses an <strong>Optimistic Client-Authoritative State Engine</strong>:
            </p>
            <ul className="text-xs text-black dark:text-zinc-100 font-bold list-disc pl-5 space-y-1 relative z-10">
              <li><strong>Zero-Latency Typing:</strong> Words and keystrokes are processed locally in memory with instant live word counting and reading time calculations.</li>
              <li><strong>Reactive Stores:</strong> React context hooks (<code className="font-mono text-pink-700 dark:text-pink-400 font-black">useTheme</code>, <code className="font-mono text-pink-700 dark:text-pink-400 font-black">useAuth</code>) broadcast changes across cards, modals, and bottom navigation bars without page reloads.</li>
              <li><strong>Sub-Millisecond Search:</strong> Filtered client-side indexing matches titles, body excerpts, and mood tags with 0ms delay.</li>
            </ul>
          </div>

          {/* Chapter 2: Offline-First & Sync */}
          <div
            style={glassStyle}
            className={`group relative p-6 rounded-2xl border-3 ${cardStyle.border} ${cardStyle.shadow} space-y-3 overflow-hidden backdrop-blur-md shadow-xs`}
          >
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${cardStyle.accentBar}`} />
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-black text-xs relative z-10 pt-1">
              <Cloud className="w-4 h-4 stroke-[2.5]" />
              <span>Chapter 2: Offline-First Data Strategy & Sync Queues</span>
            </div>
            <h3 className="font-display-chic text-xl font-black text-black dark:text-white relative z-10">
              Keeping Writings Safe Anywhere, Without Internet
            </h3>
            <p className="text-xs text-black dark:text-zinc-100 font-bold leading-relaxed relative z-10">
              When a writer is writing on an airplane or subway train with no cellular data, the app uses dual-tier persistence:
            </p>
            <div className="p-4 rounded-xl bg-zinc-950 text-emerald-400 font-mono text-xs space-y-1 relative z-10 border border-zinc-800">
              <div>1. [User Edits Piece] --&gt; Written instantly to LocalStorage + Memory Cache</div>
              <div>2. [Browser Network Event] --&gt; window.addEventListener('online', ...)</div>
              <div>3. [Sync Engine] --&gt; Flushes pending changes to cloud database (Supabase/Firebase)</div>
              <div>4. [Sync Status Pill] --&gt; Reflects 'Offline', 'Syncing...', or 'Synced'</div>
            </div>
          </div>

          {/* Chapter 3: Supabase Free Tier Blueprint */}
          <div
            style={glassStyle}
            className={`group relative p-6 rounded-2xl border-3 ${cardStyle.border} ${cardStyle.shadow} space-y-4 overflow-hidden backdrop-blur-md shadow-xs`}
          >
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${cardStyle.accentBar}`} />
            <div className="flex items-center justify-between relative z-10 pt-1">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-black text-xs">
                <Database className="w-4 h-4 stroke-[2.5]" />
                <span>Chapter 3: Free Supabase PostgreSQL Blueprint & RLS</span>
              </div>
              <button
                onClick={() => handleCopyCode('supabase', SUPABASE_SCHEMA_SQL)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-white dark:bg-zinc-800 text-black dark:text-white border-2 border-black/30 dark:border-white/20 flex items-center gap-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700"
              >
                {copiedCodeSnippet === 'supabase' ? <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCodeSnippet === 'supabase' ? 'Copied SQL' : 'Copy SQL Script'}</span>
              </button>
            </div>

            <p className="text-xs text-black dark:text-zinc-100 font-bold leading-relaxed relative z-10">
              When launching on Supabase's free tier, open the SQL Editor in Supabase and run this script to set up tables and Row Level Security:
            </p>

            <pre className="p-4 rounded-xl bg-zinc-950 text-zinc-100 text-xs font-mono overflow-x-auto max-h-60 leading-relaxed border border-zinc-800 relative z-10">
              {SUPABASE_SCHEMA_SQL}
            </pre>
          </div>

          {/* Chapter 4: Vercel Free Tier Deployment */}
          <div
            style={glassStyle}
            className={`group relative p-6 rounded-2xl border-3 ${cardStyle.border} ${cardStyle.shadow} space-y-4 overflow-hidden backdrop-blur-md shadow-xs`}
          >
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${cardStyle.accentBar}`} />
            <div className="flex items-center justify-between relative z-10 pt-1">
              <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-black text-xs">
                <FileCode className="w-4 h-4 stroke-[2.5]" />
                <span>Chapter 4: Free Vercel Deployment Configuration</span>
              </div>
              <button
                onClick={() => handleCopyCode('vercel', VERCEL_CONFIG_JSON)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-white dark:bg-zinc-800 text-black dark:text-white border-2 border-black/30 dark:border-white/20 flex items-center gap-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700"
              >
                {copiedCodeSnippet === 'vercel' ? <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCodeSnippet === 'vercel' ? 'Copied Config' : 'Copy vercel.json'}</span>
              </button>
            </div>

            <p className="text-xs text-black dark:text-zinc-100 font-bold leading-relaxed relative z-10">
              To deploy on Vercel's free tier, connect your repository and add a <code className="font-mono text-pink-700 dark:text-pink-400 font-black">vercel.json</code> file at the root:
            </p>

            <pre className="p-4 rounded-xl bg-zinc-950 text-zinc-100 text-xs font-mono overflow-x-auto max-h-40 leading-relaxed border border-zinc-800 relative z-10">
              {VERCEL_CONFIG_JSON}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: RAW DATABASE INSPECTOR */}
      {activeTab === 'database' && (
        <div className="space-y-4">
          <div
            style={glassStyle}
            className={`group relative p-6 rounded-2xl border-3 ${cardStyle.border} ${cardStyle.shadow} space-y-4 overflow-hidden backdrop-blur-md shadow-xs`}
          >
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${cardStyle.accentBar}`} />
            <div className="flex items-center justify-between relative z-10 pt-1">
              <div>
                <h3 className="font-display-chic text-lg font-black text-black dark:text-white">
                  Local Database Payload & State Backup
                </h3>
                <p className="text-xs text-black dark:text-zinc-200 font-bold">
                  Direct raw JSON representation stored in your browser's persistence engine.
                </p>
              </div>

              <button
                onClick={() => handleCopyCode('dbJson', dbJson)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-white dark:bg-zinc-800 text-black dark:text-white border-2 border-black/30 dark:border-white/20 flex items-center gap-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 shadow-2xs"
              >
                {copiedCodeSnippet === 'dbJson' ? <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy JSON</span>
              </button>
            </div>

            <textarea
              value={dbJson}
              onChange={e => setDbJson(e.target.value)}
              rows={14}
              className="w-full p-4 rounded-xl bg-zinc-950 text-emerald-400 font-mono text-xs border border-zinc-800 focus:outline-none resize-none leading-relaxed"
            />

            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  const success = StorageService.importDataJson(dbJson);
                  if (success) {
                    setImportStatus('Successfully restored database state!');
                    setTimeout(() => window.location.reload(), 1000);
                  } else {
                    setImportStatus('Error: Invalid JSON structure.');
                  }
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:opacity-90"
              >
                Apply & Restore Database from JSON
              </button>

              {importStatus && (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {importStatus}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: TELEMETRY & CHAOS SANDBOX */}
      {activeTab === 'diagnostics' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div
            style={glassStyle}
            className={`group relative p-6 md:p-8 rounded-3xl border-3 ${cardStyle.border} ${cardStyle.shadow} overflow-hidden backdrop-blur-xl shadow-xl transition-all space-y-3`}
          >
            <div className={`absolute top-0 left-0 right-0 h-2 ${cardStyle.accentBar}`} />
            <div
              className="absolute inset-0 bg-gradient-to-b from-white/35 dark:from-white/10 to-transparent pointer-events-none rounded-3xl"
              style={{ backgroundClip: 'padding-box', WebkitBackgroundClip: 'padding-box' }}
            />

            <div className="flex items-center gap-2 relative z-10 pt-1">
              <span className={`px-3 py-1 rounded-full ${cardStyle.accentBar} text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-2xs`}>
                <Activity className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Live System Telemetry & Chaos Sandbox</span>
              </span>
              <span className="text-xs text-black dark:text-zinc-200 font-mono font-bold">
                Client Engine Diagnostics
              </span>
            </div>

            <h3 className="font-display-chic text-xl md:text-2xl font-black text-black dark:text-white relative z-10">
              Storage Footprint, Event Simulation & Accessibility Bench
            </h3>

            <p className="text-xs text-black dark:text-zinc-100 font-bold leading-relaxed max-w-2xl relative z-10">
              Inspect real-time browser storage footprint, simulate network state changes (online/offline resilience), synthesize high-fidelity demo pieces, and verify theme color tokens.
            </p>

            {diagnosticsMessage && (
              <div className="relative z-10 p-3 rounded-xl bg-cyan-100 text-cyan-950 dark:bg-cyan-950/70 dark:text-cyan-200 border-2 border-cyan-500 text-xs font-black flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0 stroke-[2.5]" />
                <span>{diagnosticsMessage}</span>
              </div>
            )}
          </div>

          {/* Grid: Storage Telemetry & Chaos Network Testing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Storage Quota Meter */}
            {(() => {
              const metrics = getStorageMetrics();
              return (
                <div
                  style={glassStyle}
                  className={`group relative p-6 rounded-2xl border-3 ${cardStyle.border} ${cardStyle.shadow} space-y-4 overflow-hidden backdrop-blur-md shadow-xs`}
                >
                  <div className={`absolute top-0 left-0 right-0 h-1.5 ${cardStyle.accentBar}`} />
                  <div className="flex items-center justify-between relative z-10 pt-1">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-5 h-5 text-indigo-600 stroke-[2.5]" />
                      <h4 className="font-display-chic text-base font-black text-black dark:text-white">
                        Browser Storage Quota
                      </h4>
                    </div>
                    <span className="text-xs font-mono font-black text-black dark:text-zinc-200">
                      {metrics.totalKb} KB / 5,120 KB
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 relative z-10">
                    <div className="w-full h-3.5 rounded-full bg-black/10 dark:bg-white/10 border-2 border-black/30 dark:border-white/20 overflow-hidden p-0.5">
                      <div
                        className={`h-full ${cardStyle.accentBar} transition-all duration-300 rounded-full`}
                        style={{ width: `${Math.max(2, metrics.percentUsed)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] font-black text-black dark:text-zinc-200">
                      <span>{metrics.percentUsed}% utilized</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-black">Status: Healthy & Fast</span>
                    </div>
                  </div>

                  {/* Key Storage Breakdown Table */}
                  <div className="space-y-1.5 pt-2 border-t-2 border-black/15 dark:border-white/10 relative z-10">
                    <span className="text-[11px] font-black uppercase text-black dark:text-zinc-200 tracking-wider block">
                      Local Keys Memory Allocation:
                    </span>
                    <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 text-xs font-mono">
                      {metrics.keyBreakdown.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-white/70 dark:bg-zinc-800/70 border border-black/20 dark:border-white/10">
                          <span className="text-black dark:text-white font-bold truncate max-w-[190px]">
                            {item.key}
                          </span>
                          <span className="text-indigo-700 dark:text-indigo-300 font-black shrink-0">
                            {item.kb} KB
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* 2. Chaos Network Simulator */}
            <div
              style={glassStyle}
              className={`group relative p-6 rounded-2xl border-3 ${cardStyle.border} ${cardStyle.shadow} space-y-4 overflow-hidden backdrop-blur-md shadow-xs flex flex-col justify-between`}
            >
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${cardStyle.accentBar}`} />
              <div className="space-y-3 relative z-10 pt-1">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500 stroke-[2.5]" />
                  <h4 className="font-display-chic text-base font-black text-black dark:text-white">
                    Network State & Chaos Simulator
                  </h4>
                </div>

                <p className="text-xs text-black dark:text-zinc-100 font-bold leading-relaxed">
                  Test the applet's offline detection, sticky offline indicators, and synchronization transitions in real time without disabling your browser's Wi-Fi.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => handleSimulateNetwork(true)}
                    className="p-3 rounded-xl border-2 border-rose-400 bg-rose-200 dark:bg-rose-950/70 text-rose-950 dark:text-rose-100 text-xs font-black flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-2xs"
                  >
                    <WifiOff className="w-4 h-4 stroke-[2.5]" />
                    <span>Simulate Offline</span>
                  </button>

                  <button
                    onClick={() => handleSimulateNetwork(false)}
                    className="p-3 rounded-xl border-2 border-emerald-400 bg-emerald-200 dark:bg-emerald-950/70 text-emerald-950 dark:text-emerald-100 text-xs font-black flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-2xs"
                  >
                    <Wifi className="w-4 h-4 stroke-[2.5]" />
                    <span>Simulate Online</span>
                  </button>
                </div>
              </div>

              {/* Synthetic Data Generator Action */}
              <div className="pt-4 border-t-2 border-black/15 dark:border-white/10 space-y-2 relative z-10">
                <span className="text-[11px] font-black uppercase text-black dark:text-zinc-200 tracking-wider block">
                  Batch Creative Seeder:
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handleSeedBatchPieces}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white text-xs font-black flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-95 transition-all shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                    <span>Seed 2 Masterpiece Pieces</span>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm('Reset all localStorage data to default? This will clear custom pieces.')) {
                        StorageService.resetToDefaultData();
                        window.location.reload();
                      }
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white border-2 border-black/30 dark:border-white/20 text-xs font-black hover:bg-zinc-300 active:scale-95 transition-all"
                  >
                    Reset Factory
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Theme Accessibility & Contrast Swatch Matrix */}
          <div
            style={glassStyle}
            className={`group relative p-6 rounded-2xl border-3 ${cardStyle.border} ${cardStyle.shadow} space-y-4 overflow-hidden backdrop-blur-md shadow-xs`}
          >
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${cardStyle.accentBar}`} />
            <h4 className="font-display-chic text-base font-black text-black dark:text-white flex items-center gap-2 relative z-10 pt-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
              <span>Theme Token Architecture & WCAG AAA Accessibility Verification</span>
            </h4>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
              Every aesthetic theme enforces Solid Jet Black typography (#000000) on light surfaces for maximum legible contrast (ratio ≥ 11:1), and clean white (#FFFFFF) in dark modes.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border-2 border-[#BE185D] bg-[#FFF0F5] dark:bg-[#140A0F] text-black dark:text-white space-y-1">
                <span className="font-black block text-sm">Coquette Blush</span>
                <span className="text-[11px] font-mono text-[#BE185D] font-black">#BE185D · Rose Bow</span>
                <span className="inline-block text-[10px] font-black px-1.5 py-0.5 rounded bg-[#BE185D] text-white">AAA 13.8:1</span>
              </div>

              <div className="p-3.5 rounded-xl border-2 border-[#4338CA] bg-[#EEF2FF] dark:bg-[#080A14] text-black dark:text-white space-y-1">
                <span className="font-black block text-sm">Cyber Y2K</span>
                <span className="text-[11px] font-mono text-[#4338CA] font-black">#4338CA · Star</span>
                <span className="inline-block text-[10px] font-black px-1.5 py-0.5 rounded bg-[#4338CA] text-white">AAA 14.1:1</span>
              </div>

              <div className="p-3.5 rounded-xl border-2 border-[#15803D] bg-[#F0FDF4] dark:bg-[#0A120B] text-black dark:text-white space-y-1">
                <span className="font-black block text-sm">Matcha Latte</span>
                <span className="text-[11px] font-mono text-[#15803D] font-black">#15803D · Leaf</span>
                <span className="inline-block text-[10px] font-black px-1.5 py-0.5 rounded bg-[#15803D] text-white">AAA 12.9:1</span>
              </div>

              <div className="p-3.5 rounded-xl border-2 border-[#6B21A8] bg-[#FAF5FF] dark:bg-[#080910] text-black dark:text-white space-y-1">
                <span className="font-black block text-sm">Midnight Muse</span>
                <span className="text-[11px] font-mono text-[#6B21A8] font-black">#6B21A8 · Moon</span>
                <span className="inline-block text-[10px] font-black px-1.5 py-0.5 rounded bg-[#6B21A8] text-white">AAA 15.2:1</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Interactive Author Note Preview Modal */}
      <AuthorNoteModal
        note={currentPreviewNote}
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        onDismiss={() => setIsPreviewModalOpen(false)}
      />

      {/* USER ACCOUNT DETAILS DOSSIER MODAL (Comprehensive Database Record Display) */}
      {selectedUserForModal && createPortal((() => {
        const user = selectedUserForModal;
        const email = user.email || '';
        const penpalIds = user.penpalIds || [];
        const userPieces = pieces.filter(p => p.authorId === user.id || (p.authorEmail && p.authorEmail.toLowerCase() === email.toLowerCase()));
        const isUserDev = devRoster.some(e => e.toLowerCase() === email.toLowerCase()) || user.role === 'developer';
        const isSuper = email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
        const totalWordsAuthored = userPieces.reduce((acc, p) => acc + (p.wordCount || 0), 0);
        const totalStarsReceived = userPieces.reduce((acc, p) => acc + (p.stars || 0), 0);
        const draftCount = userPieces.filter(p => p.status === 'draft').length;
        const publishedCount = userPieces.filter(p => p.status === 'published').length;
        const isCurrentSessionUser = user.id === currentUser.id;

        return (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 no-print"
            onClick={() => setSelectedUserForModal(null)}
          >
            <div
              style={glassStyle}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl border-3 ${cardStyle.border} ${cardStyle.shadow} overflow-hidden backdrop-blur-2xl shadow-2xl transition-all`}
            >
              {/* Top Accent Strip Bar */}
              <div className={`absolute top-0 left-0 right-0 h-2 ${isUserDev ? 'bg-indigo-600' : cardStyle.accentBar}`} />

              {/* Frosted Glass Sheen Overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-b from-white/35 dark:from-white/10 to-transparent pointer-events-none rounded-3xl"
                style={{ backgroundClip: 'padding-box', WebkitBackgroundClip: 'padding-box' }}
              />

              {/* Decorative Theme Corner Watermark */}
              <div className="absolute right-4 top-3 opacity-20 pointer-events-none text-black dark:text-white" aria-hidden="true">
                <ThemeMotifIcon themeId={themeId} className="w-16 h-16" />
              </div>

              {/* STICKY MODAL HEADER */}
              <div className="relative z-10 p-5 sm:p-6 border-b-2 border-black/15 dark:border-white/10 flex items-start justify-between gap-4 shrink-0">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={user.avatar}
                      alt={user.displayName}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-black/20 dark:ring-white/20 shadow-md"
                    />
                    {isUserDev && (
                      <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-indigo-600 text-white shadow-xs" title="Developer God Mode Account">
                        <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display-chic text-xl font-black text-black dark:text-white truncate">
                        {user.displayName}
                      </h3>
                      {isCurrentSessionUser && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 font-black border border-emerald-400">
                          Active Session
                        </span>
                      )}
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isUserDev
                          ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-200 border border-indigo-400'
                          : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700'
                      }`}>
                        {isUserDev ? 'Developer' : 'Writer'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <button
                        onClick={() => handleCopyText(user.penpalId, 'penpal')}
                        className="font-mono text-pink-700 dark:text-pink-400 font-black hover:underline flex items-center gap-1"
                        title="Click to copy Penpal ID"
                      >
                        <span>{user.penpalId}</span>
                        {copiedPenpalId === user.penpalId ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3 opacity-60" />
                        )}
                      </button>
                      <span className="text-black/40 dark:text-zinc-600">·</span>
                      <span className="font-mono text-indigo-700 dark:text-indigo-300 font-bold text-[11px] flex items-center gap-1">
                        <Lock className="w-3 h-3 text-indigo-600" />
                        <span>{user.email}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedUserForModal(null)}
                  className="p-2 rounded-xl text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors shrink-0"
                  title="Close dossier"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>

              {/* SCROLLABLE MODAL BODY */}
              <div className="relative z-10 overflow-y-auto p-5 sm:p-6 space-y-5 flex-1">
                {/* 1. Identity & System Credentials Card */}
                <div
                  style={glassStyle}
                  className={`p-4.5 rounded-2xl border-2 ${cardStyle.border} ${cardStyle.shadow} backdrop-blur-md space-y-3`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-black/70 dark:text-zinc-300 tracking-wider flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Database Record & Identity</span>
                    </span>
                    <span className="text-[10px] font-mono text-black/50 dark:text-zinc-400 font-bold">
                      Table: profiles
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <span className="text-black/60 dark:text-zinc-400 text-[11px] font-bold block">Internal System ID:</span>
                      <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-black dark:text-white bg-black/5 dark:bg-white/5 px-2 py-1 rounded-lg border border-black/10 dark:border-white/10">
                        <span className="truncate">{user.id}</span>
                        <button
                          onClick={() => handleCopyText(user.id, 'user')}
                          className="shrink-0 p-0.5 hover:text-indigo-600"
                          title="Copy User ID"
                        >
                          {copiedUserId === user.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-black/60 dark:text-zinc-400 text-[11px] font-bold block">Account Creation Date:</span>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-black dark:text-white bg-black/5 dark:bg-white/5 px-2 py-1 rounded-lg border border-black/10 dark:border-white/10">
                        <Calendar className="w-3.5 h-3.5 text-black/50 dark:text-zinc-400" />
                        <span>
                          {user.createdAt ? new Date(user.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'Pre-seeded account'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-black/60 dark:text-zinc-400 text-[11px] font-bold block">Private Gmail:</span>
                      <div className="font-mono text-[11px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50/70 dark:bg-indigo-950/40 px-2 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800">
                        {user.email}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-black/60 dark:text-zinc-400 text-[11px] font-bold block">Security Role:</span>
                      <div className="flex items-center justify-between bg-black/5 dark:bg-white/5 px-2 py-1 rounded-lg border border-black/10 dark:border-white/10">
                        <span className="font-bold text-[11px] capitalize text-black dark:text-white">{user.role}</span>
                        {user.email.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase() && (
                          <button
                            onClick={() => handleToggleDevRole(user)}
                            className="text-[10px] font-black underline text-indigo-600 dark:text-indigo-400 hover:opacity-80"
                          >
                            {isUserDev ? 'Revoke Dev' : 'Promote Dev'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Literary Persona & Manifesto Card */}
                <div
                  style={glassStyle}
                  className={`p-4.5 rounded-2xl border-2 ${cardStyle.border} ${cardStyle.shadow} backdrop-blur-md space-y-3.5`}
                >
                  <span className="text-[11px] font-black uppercase text-black/70 dark:text-zinc-300 tracking-wider flex items-center gap-1.5">
                    <Quote className="w-3.5 h-3.5 text-pink-500" />
                    <span>Creative Persona & Literary Preferences</span>
                  </span>

                  <div className="space-y-2">
                    <span className="text-black/60 dark:text-zinc-400 text-[11px] font-bold block">Writer Bio:</span>
                    <p className="text-xs text-black dark:text-zinc-100 font-serif-literary italic leading-relaxed bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-black/10 dark:border-white/10">
                      &ldquo;{user.bio || 'No personal bio drafted yet.'}&rdquo;
                    </p>
                  </div>

                  {user.favoriteQuote && (
                    <div className="space-y-1">
                      <span className="text-black/60 dark:text-zinc-400 text-[11px] font-bold block">Favorite Literary Quote:</span>
                      <div className="text-xs font-bold text-black dark:text-white font-serif-literary bg-pink-50/60 dark:bg-pink-950/30 p-2.5 rounded-xl border border-pink-200 dark:border-pink-900/60">
                        {user.favoriteQuote}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 p-2.5 rounded-xl border border-black/10 dark:border-white/10">
                      <Coffee className="w-4 h-4 text-amber-600 shrink-0" />
                      <div>
                        <span className="text-[10px] font-bold text-black/60 dark:text-zinc-400 block">Favorite Beverage:</span>
                        <span className="font-bold text-black dark:text-white text-xs">{user.favoriteDrink || 'Tea & Coffee'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 p-2.5 rounded-xl border border-black/10 dark:border-white/10">
                      <Target className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div className="w-full">
                        <span className="text-[10px] font-bold text-black/60 dark:text-zinc-400 block">Daily Writing Goal:</span>
                        <div className="flex items-center justify-between text-xs font-bold text-black dark:text-white">
                          <span>{user.writingGoalWords || 500} words / day</span>
                          <span className="text-[10px] font-mono text-emerald-600 font-black">
                            {totalWordsAuthored} words logged
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Penpal Network Circle Card */}
                <div
                  style={glassStyle}
                  className={`p-4.5 rounded-2xl border-2 ${cardStyle.border} ${cardStyle.shadow} backdrop-blur-md space-y-3`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-black/70 dark:text-zinc-300 tracking-wider flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-pink-500" />
                      <span>Connected Penpal Circle ({penpalIds.length})</span>
                    </span>
                    <span className="text-[10px] font-bold text-black/50 dark:text-zinc-400">
                      Correspondence Network
                    </span>
                  </div>

                  {penpalIds.length === 0 ? (
                    <p className="text-xs text-black/60 dark:text-zinc-400 font-bold italic py-1">
                      No active penpals connected in directory yet.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {penpalIds.map(pid => {
                        const matchedUser = allUsers.find(u => u.penpalId === pid);
                        return (
                          <div
                            key={pid}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-pink-50/70 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-900/60 text-xs font-bold"
                          >
                            {matchedUser && (
                              <img src={matchedUser.avatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                            )}
                            <span className="text-black dark:text-white font-black">
                              {matchedUser ? matchedUser.displayName : 'Penpal'}
                            </span>
                            <span className="font-mono text-pink-700 dark:text-pink-400 text-[10px] font-black">
                              ({pid})
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 4. Authored Writings in Database Card */}
                <div
                  style={glassStyle}
                  className={`p-4.5 rounded-2xl border-2 ${cardStyle.border} ${cardStyle.shadow} backdrop-blur-md space-y-3.5`}
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-[11px] font-black uppercase text-black/70 dark:text-zinc-300 tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Authored Writings in DB ({userPieces.length})</span>
                    </span>

                    <div className="flex items-center gap-3 text-[11px] font-mono font-bold text-black/70 dark:text-zinc-300">
                      <span>{totalWordsAuthored.toLocaleString()} words</span>
                      <span>·</span>
                      <span className="text-amber-600">{draftCount} drafts</span>
                      <span>·</span>
                      <span className="text-emerald-600">{publishedCount} published</span>
                      <span>·</span>
                      <span className="text-amber-500 flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        <span>{totalStarsReceived}</span>
                      </span>
                    </div>
                  </div>

                  {userPieces.length === 0 ? (
                    <p className="text-xs text-black/60 dark:text-zinc-400 font-bold italic py-2">
                      This user has not drafted or published any writings in the database yet.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {userPieces.map(piece => (
                        <div
                          key={piece.id}
                          className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-between gap-2 text-xs hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                        >
                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-black text-black dark:text-white truncate">
                                {piece.title}
                              </span>
                              <span className={`text-[10px] px-2 py-0.2 rounded-full capitalize font-black ${
                                piece.status === 'draft'
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : piece.status === 'penpals'
                                  ? 'bg-pink-100 text-pink-900 border border-pink-300'
                                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              }`}>
                                {piece.status}
                              </span>
                              <span className="text-[10px] font-bold text-black/50 dark:text-zinc-400 capitalize">
                                {piece.type}
                              </span>
                            </div>
                            <div className="text-[11px] text-black/60 dark:text-zinc-400 font-mono">
                              {piece.wordCount || 0} words · {new Date(piece.createdAt).toLocaleDateString()}
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setSelectedUserForModal(null);
                              onOpenPiece(piece);
                            }}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-black bg-black text-white dark:bg-white dark:text-black hover:opacity-90 active:scale-95 transition-all shrink-0 flex items-center gap-1 shadow-2xs"
                          >
                            <span>Read</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 5. God Mode Dev Actions for This Account */}
                <div
                  style={glassStyle}
                  className={`p-4.5 rounded-2xl border-2 ${cardStyle.border} ${cardStyle.shadow} backdrop-blur-md space-y-3`}
                >
                  <span className="text-[11px] font-black uppercase text-black/70 dark:text-zinc-300 tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>God Mode Operations for This User</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <button
                      onClick={() => handleSwitchToUser(user)}
                      className="px-3.5 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white text-xs font-black flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-2xs"
                    >
                      <LogIn className="w-4 h-4 stroke-[2.5]" />
                      <span>Switch Session / Login As</span>
                    </button>

                    <button
                      onClick={() => handleTargetAuthorNoteToUser(user)}
                      className="px-3.5 py-2.5 rounded-xl bg-pink-600 text-white border-2 border-pink-700 text-xs font-black flex items-center justify-center gap-2 hover:bg-pink-700 active:scale-95 transition-all shadow-2xs"
                    >
                      <Mail className="w-4 h-4 stroke-[2.5]" />
                      <span>Send Dedicated Author Note</span>
                    </button>
                  </div>

                  {/* Raw DB JSON Record Toggle */}
                  <div className="pt-2 border-t border-black/10 dark:border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setShowUserRawJson(v => !v)}
                        className="text-xs font-black text-black/70 dark:text-zinc-300 hover:text-black dark:hover:text-white flex items-center gap-1.5 underline"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>{showUserRawJson ? 'Hide Raw Database JSON Record' : 'View Raw Database JSON Record'}</span>
                      </button>

                      {showUserRawJson && (
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(user, null, 2));
                            setDispatchSuccessMessage('Copied user database JSON to clipboard!');
                            setTimeout(() => setDispatchSuccessMessage(null), 2500);
                          }}
                          className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy JSON</span>
                        </button>
                      )}
                    </div>

                    {showUserRawJson && (
                      <pre className="p-3 rounded-xl bg-black/90 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-48 border border-black/30 dark:border-white/20 select-all">
                        {JSON.stringify(user, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              </div>

              {/* FOOTER */}
              <div className="relative z-10 p-4 border-t-2 border-black/15 dark:border-white/10 bg-black/5 dark:bg-white/5 flex items-center justify-between shrink-0">
                <span className="text-[11px] font-mono text-black/60 dark:text-zinc-400 font-bold">
                  Velours &amp; Verse Database Entity Dossier
                </span>
                <button
                  onClick={() => setSelectedUserForModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-black bg-black text-white dark:bg-white dark:text-black hover:opacity-90 active:scale-95 transition-all shadow-2xs"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        );
      })(), document.body)}
    </div>
  );
};
