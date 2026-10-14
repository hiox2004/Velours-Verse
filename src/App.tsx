/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navigation } from './components/Navigation';
import { WritingCard } from './components/WritingCard';
import { WritingEditor } from './components/WritingEditor';
import { ReaderModal } from './components/ReaderModal';
import { PrintPreview } from './components/PrintPreview';
import { PenpalHub } from './components/PenpalHub';
import { SoundWidget } from './components/SoundWidget';
import { ProfileModal } from './components/ProfileModal';
import { DevAcademy } from './components/DevAcademy';
import { ThemeMotifIcon, ThemeHeroIllustration } from './components/ThemeIllustrations';
import { AuthorNoteModal } from './components/AuthorNoteModal';
import { StorageService } from './services/storage';
import { SupabaseService } from './services/supabaseService';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import {
  WritingPiece,
  AppView,
  FeedFilterStatus,
  WritingType,
  AuthorNote
} from './types/writing';
import {
  Search,
  Globe,
  Lock,
  Mail,
  Star,
  Plus
} from 'lucide-react';

function MainApp() {
  const { theme, themeId, activeTokens } = useTheme();
  const { currentUser, isAuthenticated, isAuthLoading, isDeveloper } = useAuth();

  // Navigation and Modal states (Clean URL routing)
  const getInitialRoute = (): AppView => {
    const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
    if (path === 'feed') return 'feed';
    if (path === 'penpals') return 'penpals';
    if (path === 'widgets') return 'widgets';
    if (path === 'auth') return 'auth';
    if (path === 'dev' || path === 'dev_academy') return 'dev_academy';
    return 'landing'; // Default root '/' lands on bespoke Sanctuary page
  };

  const [currentView, setCurrentView] = useState<AppView>(getInitialRoute);

  const navigateTo = (view: AppView) => {
    // Access control: Guest users trying to navigate to anything other than landing/auth are asked to sign in
    if (!isAuthenticated && view !== 'landing' && view !== 'auth') {
      setCurrentView('auth');
      window.history.pushState(null, '', '/auth');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Access control: Dev Academy strictly restricted to hiox2004@gmail.com
    if (view === 'dev_academy' && !isDeveloper) {
      alert('Access restricted: Developer Academy is only accessible to administrator (hiox2004).');
      return;
    }

    setCurrentView(view);
    const targetPath = view === 'landing' ? '/' : `/${view === 'dev_academy' ? 'dev' : view}`;
    window.history.pushState(null, '', targetPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentView(getInitialRoute());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // When user completes Google OAuth or hash contains access_token, route to feed seamlessly
  useEffect(() => {
    if (isAuthenticated && (currentView === 'auth' || window.location.hash.includes('access_token'))) {
      setCurrentView('feed');
      window.history.replaceState(null, '', '/feed');
    }
  }, [isAuthenticated, currentView]);
  const [pieces, setPieces] = useState<WritingPiece[]>(() => StorageService.getPieces());
  const [selectedPieceForReader, setSelectedPieceForReader] = useState<WritingPiece | null>(null);
  const [pieceToEdit, setPieceToEdit] = useState<WritingPiece | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [pieceToPrint, setPieceToPrint] = useState<WritingPiece | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Author Note Modal state (Users can open it via the banner or letter button)
  const [activeAuthorNote, setActiveAuthorNote] = useState<AuthorNote | null>(() => StorageService.getAuthorNote());
  const [isAuthorNoteModalOpen, setIsAuthorNoteModalOpen] = useState<boolean>(false);

  // Refresh active author note on view switch
  useEffect(() => {
    const note = StorageService.getAuthorNote();
    setActiveAuthorNote(note);
  }, [currentView]);

  const handleCloseAuthorNote = () => {
    setIsAuthorNoteModalOpen(false);
    if (activeAuthorNote) {
      StorageService.dismissNote(activeAuthorNote.id);
    }
  };

  // Search & Filtering state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FeedFilterStatus>('all');
  const [typeFilter, setTypeFilter] = useState<WritingType | 'all'>('all');

  // Network & Sync status
  const [isOnline, setIsOnline] = useState<boolean>(() => navigator.onLine);
  const [syncState, setSyncState] = useState<'synced' | 'syncing' | 'offline'>(() => (navigator.onLine ? 'synced' : 'offline'));

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncState('syncing');
      setTimeout(() => setSyncState('synced'), 700);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setSyncState('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial load from Supabase
    SupabaseService.getPieces(currentUser?.id).then(fetched => {
      if (fetched && fetched.length > 0) {
        setPieces(fetched);
      }
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [currentUser?.id]);

  // Filtered pieces based on search, status, and type
  const filteredPieces = useMemo(() => {
    // Strict access control: private drafts and penpal letters are only visible to authorized viewers
    const canAccessPiece = (p: WritingPiece) => {
      // 1. Published pieces are public to the entire sanctuary
      if (p.status === 'published') {
        return true;
      }

      // 2. Drafts are private to author (or developer/admin)
      if (p.status === 'draft') {
        if (isDeveloper) return true;
        if (!currentUser) return false;
        return (
          p.authorId === currentUser.id ||
          (Boolean(p.authorEmail) && Boolean(currentUser.email) && p.authorEmail.toLowerCase() === currentUser.email.toLowerCase())
        );
      }

      // 3. Penpal pieces are private to author, connected penpals, or developer/admin
      if (p.status === 'penpals') {
        // Author can always see their own penpal letters
        if (currentUser && (
          p.authorId === currentUser.id ||
          (Boolean(p.authorEmail) && Boolean(currentUser.email) && p.authorEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
          (Boolean(p.authorPenpalId) && Boolean(currentUser.penpalId) && p.authorPenpalId === currentUser.penpalId)
        )) {
          return true;
        }

        // Developer moderation access
        if (isDeveloper) return true;

        // Must be in current user's penpal circle
        if (currentUser && currentUser.penpalIds && currentUser.penpalIds.length > 0) {
          return currentUser.penpalIds.includes(p.authorPenpalId) || currentUser.penpalIds.includes(p.authorId);
        }

        return false;
      }

      return false;
    };

    // Filter by access permission first
    let result = pieces.filter(canAccessPiece);

    // 1. Status Filter
    if (statusFilter === 'published') {
      result = result.filter(p => p.status === 'published');
    } else if (statusFilter === 'drafts') {
      result = result.filter(p => p.status === 'draft');
    } else if (statusFilter === 'penpals') {
      result = result.filter(p => p.status === 'penpals');
    } else if (statusFilter === 'starred') {
      result = result.filter(p => p.starredByMe);
    }

    // 2. Type Filter
    if (typeFilter !== 'all') {
      result = result.filter(p => p.type === typeFilter);
    }

    // 3. Instant Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.authorDisplayName.toLowerCase().includes(q) ||
        p.authorPenpalId.toLowerCase().includes(q) ||
        p.moodTags?.some(tag => tag.toLowerCase().includes(q))
      );
    }

    return result;
  }, [pieces, statusFilter, typeFilter, searchQuery, isDeveloper, currentUser]);

  // Handlers
  const handleSavePiece = (piece: WritingPiece) => {
    setSyncState('syncing');
    const updated = StorageService.savePiece(piece);
    setPieces(updated);

    if (currentUser?.id && !currentUser.id.startsWith('user_') && !currentUser.id.startsWith('guest')) {
      SupabaseService.savePiece(piece, currentUser.id).then((cloudResult) => {
        if (typeof cloudResult === 'string' && cloudResult !== piece.id) {
          // Re-index piece with assigned cloud UUID so future edits and comments map to this record
          const syncedPiece = { ...piece, id: cloudResult };
          StorageService.deletePiece(piece.id);
          const finalPieces = StorageService.savePiece(syncedPiece);
          setPieces(finalPieces);
          if (selectedPieceForReader && selectedPieceForReader.id === piece.id) {
            setSelectedPieceForReader(syncedPiece);
          }
        }
        setSyncState('synced');
      });
    } else {
      setTimeout(() => setSyncState('synced'), 400);
    }

    if (selectedPieceForReader && selectedPieceForReader.id === piece.id) {
      setSelectedPieceForReader(piece);
    }
  };

  const handleDeletePiece = (id: string) => {
    const updated = StorageService.deletePiece(id);
    setPieces(updated);
    if (currentUser?.id && !currentUser.id.startsWith('user_') && !currentUser.id.startsWith('guest')) {
      SupabaseService.deletePiece(id);
    }
    if (selectedPieceForReader && selectedPieceForReader.id === id) {
      setSelectedPieceForReader(null);
    }
  };

  const handleToggleStar = (pieceId: string) => {
    const updated = StorageService.toggleStar(pieceId);
    setPieces(updated);
    if (selectedPieceForReader && selectedPieceForReader.id === pieceId) {
      const p = updated.find(x => x.id === pieceId);
      if (p) setSelectedPieceForReader(p);
    }
  };

  const handleAddComment = (pieceId: string, text: string) => {
    const comment = {
      id: `c_${Date.now()}`,
      authorDisplayName: currentUser?.displayName || 'Anonymous Reader',
      authorPenpalId: currentUser?.penpalId || 'PEN-????',
      authorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      text,
      createdAt: new Date().toISOString()
    };
    const updated = StorageService.addComment(pieceId, comment);
    setPieces(updated);
    if (selectedPieceForReader && selectedPieceForReader.id === pieceId) {
      const p = updated.find(x => x.id === pieceId);
      if (p) setSelectedPieceForReader(p);
    }
  };

  const handleDownloadQuick = (e: React.MouseEvent, piece: WritingPiece) => {
    e.stopPropagation();
    const formattedDate = new Date(piece.createdAt).toLocaleDateString();
    const textToExport = `# ${piece.title}\n*by ${piece.authorDisplayName} (${piece.authorPenpalId})*\n*Date: ${formattedDate}*\n\n${piece.content}\n\n---\n*Archived in Velours & Verse*`;
    const blob = new Blob([textToExport], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${piece.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-200"
      style={{
        backgroundColor: activeTokens.bg,
        color: activeTokens.textPrimary
      }}
    >
      {/* Top Header & Mobile Bottom Tab Navigation */}
      <div className="no-print">
        <Navigation
          currentView={currentView}
          onSelectView={v => navigateTo(v)}
          onOpenNewPiece={() => {
            if (!isAuthenticated) {
              navigateTo('auth');
              return;
            }
            setPieceToEdit(null);
            setIsEditorOpen(true);
          }}
          onOpenProfile={() => {
            if (!isAuthenticated) {
              navigateTo('auth');
              return;
            }
            setIsProfileModalOpen(true);
          }}
          onOpenAuth={() => navigateTo('auth')}
          isOnline={isOnline}
          syncState={syncState}
        />
      </div>

      {/* Main Content View Switcher */}
      <main className="flex-1 pb-24 md:pb-12 print:hidden">
        {currentView === 'feed' && (
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6">
            {/* Thematic Gen Z Humanlike Art Illustration Banner */}
            <ThemeHeroIllustration themeId={themeId} />

            {/* Note from the Author Interactive Themed Card Banner */}
            {activeAuthorNote && activeAuthorNote.active && (
              <div
                onClick={() => setIsAuthorNoteModalOpen(true)}
                className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border-3 border-pink-500/80 dark:border-pink-500 shadow-[4px_4px_0px_0px_#EC4899] dark:shadow-none flex items-center justify-between gap-3 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 transition-all group overflow-hidden"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 flex items-center justify-center shrink-0 border-2 border-pink-400 group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-pink-600 text-white shadow-2xs">
                        {activeAuthorNote.tag || 'Author Dispatch'}
                      </span>
                      <span className="text-xs sm:text-sm font-black text-black dark:text-white truncate">
                        {activeAuthorNote.title}
                      </span>
                    </div>
                    <p className="text-xs text-black/90 dark:text-zinc-200 font-bold truncate mt-0.5 font-serif-literary">
                      {activeAuthorNote.content}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    className="px-3.5 py-1.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-black border-2 border-black dark:border-white shadow-xs group-hover:opacity-90 flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <span>Read Letter 💌</span>
                  </button>
                </div>
              </div>
            )}

            {/* Feed Control Bar: Title & Instant Search Bar */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b-3 border-black/20 dark:border-white/20">
              <div>
                <h1 className="font-display-chic text-3xl md:text-4xl font-black tracking-tight text-black dark:text-white">
                  Writing Log & Discovery
                </h1>
                <p className="font-serif-literary text-black dark:text-zinc-200 text-base font-bold mt-1">
                  Explore published verses, drafts, and letters from your penpals.
                </p>
              </div>

              {/* Instant Search Bar (High contrast 3px border, bold black text) */}
              <div className="relative w-full md:w-80 shrink-0">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-black dark:text-zinc-300 stroke-[2.5]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search titles, verse, moods..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs font-black rounded-xl bg-white dark:bg-zinc-900 border-3 border-black dark:border-zinc-600 text-black dark:text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-xs font-black text-black dark:text-white hover:opacity-70"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Filter Tabs & Type Selector (Responsive Tablet and Mobile) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              {/* Status Tabs */}
              <div className="flex items-center gap-1.5 p-1.5 bg-white dark:bg-zinc-800 rounded-2xl overflow-x-auto border-3 border-black dark:border-zinc-700 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-none max-w-full">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap font-black ${
                    statusFilter === 'all'
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                      : 'text-black dark:text-white hover:bg-black/10'
                  }`}
                >
                  All Logs
                </button>
                <button
                  onClick={() => setStatusFilter('published')}
                  className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap font-black ${
                    statusFilter === 'published'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-black dark:text-white hover:bg-black/10'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Published</span>
                </button>
                <button
                  onClick={() => setStatusFilter('drafts')}
                  className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap font-black ${
                    statusFilter === 'drafts'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-black dark:text-white hover:bg-black/10'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Drafts</span>
                </button>
                <button
                  onClick={() => setStatusFilter('penpals')}
                  className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap font-black ${
                    statusFilter === 'penpals'
                      ? 'bg-pink-600 text-white shadow-xs'
                      : 'text-black dark:text-white hover:bg-black/10'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Penpal Circle</span>
                </button>
                <button
                  onClick={() => setStatusFilter('starred')}
                  className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap font-black ${
                    statusFilter === 'starred'
                      ? 'bg-amber-500 text-black shadow-xs'
                      : 'text-black dark:text-white hover:bg-black/10'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 fill-current stroke-[3]" />
                  <span>Starred</span>
                </button>
              </div>

              {/* Literary Format Dropdown / Badges */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <span className="text-black dark:text-white text-xs font-black mr-1">Format:</span>
                {(['all', 'poem', 'story', 'prose', 'journal'] as (WritingType | 'all')[]).map(t => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`px-3 py-1.5 rounded-xl text-xs capitalize transition-colors font-black border-2 ${
                      typeFilter === t
                        ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                        : 'bg-white dark:bg-zinc-800 text-black dark:text-white border-zinc-400 dark:border-zinc-600 hover:border-black'
                    }`}
                  >
                    {t === 'all' ? 'All' : t === 'story' ? 'Short Story' : t}
                  </button>
                ))}
              </div>
            </div>

            {/* Writing Cards Grid (Responsive Mobile 1-col, Desktop 2 or 3-cols) */}
            {filteredPieces.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredPieces.map(piece => (
                  <WritingCard
                    key={piece.id}
                    piece={piece}
                    onClick={() => setSelectedPieceForReader(piece)}
                    onToggleStar={e => {
                      e.stopPropagation();
                      handleToggleStar(piece.id);
                    }}
                    onPrint={e => {
                      e.stopPropagation();
                      setPieceToPrint(piece);
                    }}
                    onDownload={e => handleDownloadQuick(e, piece)}
                    onDelete={e => {
                      e.stopPropagation();
                      if (window.confirm(`Delete "${piece.title}"?`)) {
                        handleDeletePiece(piece.id);
                      }
                    }}
                  />
                ))}
              </div>
            ) : (
              /* Empty Search State */
              <div className="p-12 rounded-3xl bg-white dark:bg-zinc-900 border-3 border-black dark:border-zinc-700 text-center space-y-4 max-w-lg mx-auto my-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-none">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto border-2 border-black dark:border-zinc-700 text-black dark:text-white">
                  <ThemeMotifIcon themeId={themeId} className="w-6 h-6" />
                </div>
                <h3 className="font-display-chic text-xl font-black text-black dark:text-white">
                  No writings found
                </h3>
                <p className="font-serif-literary text-sm text-black dark:text-zinc-300 font-bold max-w-sm mx-auto">
                  {searchQuery
                    ? `No pieces match "${searchQuery}". Try different keywords or clear your search.`
                    : statusFilter === 'penpals'
                    ? 'No letters from your penpal circle yet. Add penpals via Penpal Hub to read their private letters here!'
                    : 'There are no pieces in this category yet. Begin your creative log today!'}
                </p>
                <button
                  onClick={() => {
                    setPieceToEdit(null);
                    setIsEditorOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-black text-white bg-black dark:bg-white dark:text-black border-2 border-black dark:border-white shadow-xs"
                >
                  Write Your First Piece
                </button>
              </div>
            )}
          </div>
        )}

        {/* View: Penpals Circle */}
        {currentView === 'penpals' && (
          <PenpalHub
            onOpenFeedForPenpals={() => {
              setStatusFilter('penpals');
              setCurrentView('feed');
            }}
            onOpenProfile={() => setIsProfileModalOpen(true)}
          />
        )}

        {/* View: Atmospheric Sound & Daily Habits */}
        {currentView === 'widgets' && (
          <SoundWidget
            pieces={pieces}
            onSelectPrompt={promptText => {
              setPieceToEdit({
                id: `piece_${Date.now()}`,
                title: 'Untitled Reflection',
                content: `Prompt: ${promptText}\n\n`,
                type: 'prose',
                status: 'draft',
                authorId: currentUser?.id || 'guest',
                authorDisplayName: currentUser?.displayName || 'Quiet Writer',
                authorPenpalId: currentUser?.penpalId || 'PEN-????',
                authorEmail: currentUser?.email || '',
                authorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                stars: 0,
                starredByMe: false,
                comments: [],
                moodTags: ['Inspiration'],
                cardTint: 'default',
                wordCount: 0,
                readTimeMinutes: 1,
                synced: true
              });
              setIsEditorOpen(true);
            }}
          />
        )}

        {/* View: Landing Sanctuary Homepage */}
        {currentView === 'landing' && (
          <LandingPage
            onEnterSanctuary={() => navigateTo('auth')}
            onExploreFeed={() => navigateTo('feed')}
            onOpenPiecePreview={(title, excerpt, author) => {
              setSelectedPieceForReader({
                id: `snippet-${Date.now()}`,
                title,
                content: excerpt,
                type: 'poem',
                status: 'published',
                authorId: 'curated',
                authorDisplayName: author,
                authorPenpalId: 'CLASSIC',
                authorEmail: '',
                authorAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                stars: 99,
                starredByMe: false,
                comments: [],
                moodTags: ['Anthology', 'Classic Verse'],
                cardTint: 'default',
                wordCount: excerpt.split(/\s+/).length,
                readTimeMinutes: 1,
                synced: true
              });
            }}
          />
        )}

        {/* View: Authentication & Registration */}
        {currentView === 'auth' && (
          <AuthPage
            onBack={() => navigateTo('landing')}
            onSuccess={() => navigateTo('feed')}
          />
        )}

        {/* View: Developer God Mode & Academy (Strictly restricted to hiox2004) */}
        {currentView === 'dev_academy' && isDeveloper && (
          <DevAcademy
            pieces={pieces}
            onDeletePiece={handleDeletePiece}
            onOpenPiece={p => setSelectedPieceForReader(p)}
          />
        )}
      </main>

      {/* Reader Modal */}
      <ReaderModal
        piece={selectedPieceForReader}
        isOpen={Boolean(selectedPieceForReader)}
        onClose={() => setSelectedPieceForReader(null)}
        onEdit={p => {
          setSelectedPieceForReader(null);
          setPieceToEdit(p);
          setIsEditorOpen(true);
        }}
        onToggleStar={handleToggleStar}
        onAddComment={handleAddComment}
        onPrintPreview={p => setPieceToPrint(p)}
      />

      {/* Writing Studio Editor */}
      <WritingEditor
        initialPiece={pieceToEdit}
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setPieceToEdit(null);
        }}
        onSave={handleSavePiece}
        onPrintPreview={p => setPieceToPrint(p)}
      />

      {/* Print Preview & Publication Print Output */}
      {pieceToPrint && (
        <PrintPreview
          piece={pieceToPrint}
          onClose={() => setPieceToPrint(null)}
        />
      )}

      {/* Profile & Google Auth Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Note from the Author Modal Card (Theme-styled pop-up with smooth folding exit) */}
      <AuthorNoteModal
        note={activeAuthorNote}
        isOpen={isAuthorNoteModalOpen}
        onClose={handleCloseAuthorNote}
        onDismiss={handleCloseAuthorNote}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </AuthProvider>
  );
}
