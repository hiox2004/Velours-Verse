import { WritingPiece, UserProfile, CommentItem, AuthorNote } from '../types/writing';

const STORAGE_KEYS = {
  PIECES: 'velours_pieces_v1',
  PROFILE: 'velours_user_profile_v1',
  DEV_ROSTER: 'velours_dev_roster_v1',
  ALL_USERS: 'velours_all_users_v1',
  AUTHOR_NOTE: 'velours_author_note_v1',
  NOTE_DISMISSED: 'velours_note_dismissed_v1'
};

export const SUPER_ADMIN_EMAIL = 'hiox2004@gmail.com';

export const DEFAULT_AUTHOR_NOTE: AuthorNote = {
  id: 'note_welcome_001',
  title: 'A Handwritten Note from the Creator 💌',
  content: 'Welcome to Velours & Verse. I designed this sanctuary for words that refuse to be rushed—for verses scribbled in morning light, stories drafted in train stations, and thoughts that keep you company past midnight.\n\nTreat your prose with kindness, cherish your penpals, and never apologize for the depth of your feeling. May this space inspire your most honest words.',
  authorName: 'Aura Dev',
  authorRole: 'Platform Creator & Lead Developer',
  authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  targetAudience: 'all',
  targetUserName: 'All Writers & Dreamers',
  tag: 'Creator Dispatch',
  createdAt: '2026-10-13T08:00:00Z',
  active: true
};

const INITIAL_DEV_ROSTER = [SUPER_ADMIN_EMAIL, 'developer@veloursverse.app'];

export const ANONYMOUS_GUEST_PROFILE: UserProfile = {
  id: 'guest',
  email: '',
  displayName: 'Guest Reader',
  penpalId: 'PEN-GUEST',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  bio: 'Quietly wandering through the Velours & Verse sanctuary.',
  favoriteDrink: 'Oat Milk Chai',
  favoriteQuote: 'Words are sacred.',
  writingGoalWords: 300,
  penpalIds: [],
  role: 'writer',
  createdAt: '2026-10-14T00:00:00Z'
};

// Sample pre-seeded authors
export const SEED_USERS: UserProfile[] = [
  {
    id: 'user_admin',
    email: 'aura.dev@veloursverse.app',
    displayName: 'Aura Dev',
    penpalId: 'PEN-8V2M9',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Lead architect of Velours & Verse. Writing quiet midnight verses between server builds.',
    favoriteDrink: 'Oat Milk London Fog',
    favoriteQuote: '“Do not go gentle into that good night.” — Dylan Thomas',
    writingGoalWords: 1000,
    penpalIds: ['PEN-7K3N1', 'PEN-4B8W2'],
    role: 'developer',
    createdAt: '2026-09-01T10:00:00Z'
  },
  {
    id: 'user_clara',
    email: 'clara.verse@penpal.org',
    displayName: 'Clara Delacroix',
    penpalId: 'PEN-7K3N1',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    bio: 'Collecting morning mist in coffee cups. Writing about quiet coastal towns and vintage ribbons.',
    favoriteDrink: 'Iced Rose Matcha',
    favoriteQuote: '“Tell me, what is it you plan to do with your one wild and precious life?” — Mary Oliver',
    writingGoalWords: 500,
    penpalIds: ['PEN-8V2M9'],
    role: 'writer',
    createdAt: '2026-09-15T14:20:00Z'
  },
  {
    id: 'user_julian',
    email: 'julian.prose@penpal.org',
    displayName: 'Julian K.',
    penpalId: 'PEN-4B8W2',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Sci-fi short fiction writer & analog film photographer. Searching for starlight in train stations.',
    favoriteDrink: 'Cortado with brown sugar',
    favoriteQuote: '“The stars are not afraid to appear like fireflies.” — Rabindranath Tagore',
    writingGoalWords: 750,
    penpalIds: ['PEN-8V2M9'],
    role: 'writer',
    createdAt: '2026-10-02T08:12:00Z'
  }
];

const SEED_PIECES: WritingPiece[] = [
  {
    id: 'piece-1',
    title: 'The Architecture of Rain',
    content: `Beneath the mansard roof, the drops compose
A fugue of quiet tin and rusted zinc.
No clock remembers where the afternoon goes;
The teacup cools before I dare to think.

A sparrow perches on the fire escape,
Feathers puffed against the autumn chill.
Every fleeting sorrow takes its shape
In shadows pooled along the window sill.

We write because the silence is too wide,
Because the paper keeps what we forgot—
The gentle tide that carried us inside,
The wild, unhurried sweetness of the plot.`,
    type: 'poem',
    status: 'published',
    authorId: 'user_clara',
    authorDisplayName: 'Clara Delacroix',
    authorPenpalId: 'PEN-7K3N1',
    authorEmail: 'clara.verse@penpal.org',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-10-12T09:30:00Z',
    updatedAt: '2026-10-12T11:00:00Z',
    stars: 28,
    starredByMe: true,
    comments: [
      {
        id: 'c-1',
        authorDisplayName: 'Julian K.',
        authorPenpalId: 'PEN-4B8W2',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        text: 'The rhythm in the second stanza is so evocative. I felt the autumn chill immediately.',
        createdAt: '2026-10-12T14:10:00Z'
      }
    ],
    moodTags: ['Melancholy', 'Autumn', 'Tea & Rain'],
    cardTint: 'rose',
    wordCount: 88,
    readTimeMinutes: 1,
    synced: true
  },
  {
    id: 'piece-2',
    title: 'Subway Starlight and 2 AM Transistors',
    content: `The neon tube above car 4 flickered at roughly sixty hertz—a buzz that sounded less like electricity and more like a cicada trapped inside an aluminum can.

Julian turned the cassette over. The magnetic tape was worn thin at the splice, but the piano line was still there, floating across three decades of static.

"Next stop: Atlantic Avenue."

A girl in an oversized sage knit sweater was sketching something into an unlined leather journal across the aisle. She didn't look up when the brakes shrieked against the curved rails. People who make art in public transit possess a specific brand of armor: they can inhabit a cathedral while standing three inches from a spilled energy drink.

He pulled his notebook out. Just three sentences before the doors slid open. Just three words before the city swallowed the cadence whole.`,
    type: 'story',
    status: 'published',
    authorId: 'user_julian',
    authorDisplayName: 'Julian K.',
    authorPenpalId: 'PEN-4B8W2',
    authorEmail: 'julian.prose@penpal.org',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-10-11T20:15:00Z',
    updatedAt: '2026-10-11T20:45:00Z',
    stars: 42,
    starredByMe: false,
    comments: [
      {
        id: 'c-2',
        authorDisplayName: 'Clara Delacroix',
        authorPenpalId: 'PEN-7K3N1',
        authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        text: '“They can inhabit a cathedral while standing three inches from a spilled energy drink” is brilliant writing!',
        createdAt: '2026-10-11T22:30:00Z'
      }
    ],
    moodTags: ['Cyber Y2K', 'Nocturnal', 'Cinematic'],
    cardTint: 'starlight',
    wordCount: 154,
    readTimeMinutes: 1,
    synced: true
  },
  {
    id: 'piece-3',
    title: 'Letters I Kept in the Book of Ferns',
    content: `Dearest Penpal,

I pressed the silver fern we found by the canal between pages 144 and 145 of the botany compendium. It has turned the faint hue of sun-bleached parchment.

Sometimes I wonder whether words gain weight or lose it as years pass. When we write by hand, ink sinks into the wood pulp. In pixels, words remain suspended like dust motes in sunbeams.

If you read this, make yourself a cup of genmaicha. The steam smells like toasted rice and good news.`,
    type: 'journal',
    status: 'penpals',
    authorId: 'user_clara',
    authorDisplayName: 'Clara Delacroix',
    authorPenpalId: 'PEN-7K3N1',
    authorEmail: 'clara.verse@penpal.org',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-10-10T16:00:00Z',
    updatedAt: '2026-10-10T16:20:00Z',
    stars: 19,
    starredByMe: true,
    comments: [],
    moodTags: ['Matcha', 'Penpal Circle', 'Nostalgic'],
    cardTint: 'matcha',
    wordCount: 89,
    readTimeMinutes: 1,
    synced: true
  },
  {
    id: 'piece-4',
    title: 'The Constellation of Unfinished Sentences',
    content: `[DRAFT IN PROGRESS - WORKSHOPPING]

Is it possible that every discarded metaphor finds a home in the ionosphere?

Tonight the observatory dome is open, but instead of tracking Alpha Centauri, I am tracing the shape of our conversation from last July.

Notes to self:
- Expand stanza 2 to describe the brass telescope gears
- Change "indigo" to "obsidian velvet"
- Add the sound of crickets in the background meadow`,
    type: 'poem',
    status: 'draft',
    authorId: 'user_admin',
    authorDisplayName: 'Aura Dev',
    authorPenpalId: 'PEN-8V2M9',
    authorEmail: 'aura.dev@veloursverse.app',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-10-13T04:15:00Z',
    updatedAt: '2026-10-13T04:40:00Z',
    stars: 3,
    starredByMe: false,
    comments: [],
    moodTags: ['Midnight Thoughts', 'Draft', 'Astronomy'],
    cardTint: 'lavender',
    wordCount: 68,
    readTimeMinutes: 1,
    synced: true
  }
];

export class StorageService {
  public static getPieces(): WritingPiece[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PIECES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PIECES, JSON.stringify(SEED_PIECES));
        return SEED_PIECES;
      }
      return JSON.parse(data);
    } catch {
      return SEED_PIECES;
    }
  }

  public static savePiece(piece: WritingPiece): WritingPiece[] {
    const pieces = this.getPieces();
    const existingIndex = pieces.findIndex(p => p.id === piece.id);
    let updated: WritingPiece[];
    if (existingIndex >= 0) {
      updated = [...pieces];
      updated[existingIndex] = { ...piece, updatedAt: new Date().toISOString(), synced: true };
    } else {
      updated = [{ ...piece, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), synced: true }, ...pieces];
    }
    localStorage.setItem(STORAGE_KEYS.PIECES, JSON.stringify(updated));
    return updated;
  }

  public static deletePiece(id: string): WritingPiece[] {
    const pieces = this.getPieces();
    const filtered = pieces.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PIECES, JSON.stringify(filtered));
    return filtered;
  }

  public static toggleStar(pieceId: string): WritingPiece[] {
    const pieces = this.getPieces();
    const updated = pieces.map(p => {
      if (p.id === pieceId) {
        const nextStarred = !p.starredByMe;
        return {
          ...p,
          starredByMe: nextStarred,
          stars: nextStarred ? p.stars + 1 : Math.max(0, p.stars - 1)
        };
      }
      return p;
    });
    localStorage.setItem(STORAGE_KEYS.PIECES, JSON.stringify(updated));
    return updated;
  }

  public static addComment(pieceId: string, comment: CommentItem): WritingPiece[] {
    const pieces = this.getPieces();
    const updated = pieces.map(p => {
      if (p.id === pieceId) {
        return {
          ...p,
          comments: [...p.comments, comment]
        };
      }
      return p;
    });
    localStorage.setItem(STORAGE_KEYS.PIECES, JSON.stringify(updated));
    return updated;
  }

  public static getActiveProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (!data) {
        return ANONYMOUS_GUEST_PROFILE;
      }
      return JSON.parse(data);
    } catch {
      return ANONYMOUS_GUEST_PROFILE;
    }
  }

  public static saveActiveProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    // Also update in all users directory
    this.updateUserInDirectory(profile);
  }

  public static getAllUsers(): UserProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ALL_USERS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(SEED_USERS));
        return SEED_USERS;
      }
      return JSON.parse(data);
    } catch {
      return SEED_USERS;
    }
  }

  public static updateUserInDirectory(profile: UserProfile): void {
    const users = this.getAllUsers();
    const idx = users.findIndex(u => u.id === profile.id || u.email === profile.email);
    let updated: UserProfile[];
    if (idx >= 0) {
      updated = [...users];
      updated[idx] = profile;
    } else {
      updated = [...users, profile];
    }
    localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(updated));
  }

  public static getDevRoster(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DEV_ROSTER);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.DEV_ROSTER, JSON.stringify(INITIAL_DEV_ROSTER));
        return INITIAL_DEV_ROSTER;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_DEV_ROSTER;
    }
  }

  public static saveDevRoster(roster: string[]): void {
    // Keep super admin in roster permanently
    if (!roster.includes(SUPER_ADMIN_EMAIL)) {
      roster.push(SUPER_ADMIN_EMAIL);
    }
    localStorage.setItem(STORAGE_KEYS.DEV_ROSTER, JSON.stringify(roster));
  }

  public static exportDataJson(): string {
    const data = {
      pieces: this.getPieces(),
      profile: this.getActiveProfile(),
      devRoster: this.getDevRoster(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  public static getAuthorNote(): AuthorNote | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTHOR_NOTE);
      if (!data) {
        // Initialize with default author note
        localStorage.setItem(STORAGE_KEYS.AUTHOR_NOTE, JSON.stringify(DEFAULT_AUTHOR_NOTE));
        return DEFAULT_AUTHOR_NOTE;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_AUTHOR_NOTE;
    }
  }

  public static saveAuthorNote(note: AuthorNote): void {
    localStorage.setItem(STORAGE_KEYS.AUTHOR_NOTE, JSON.stringify(note));
    // Clear dismissals so all users receive the updated note!
    localStorage.removeItem(STORAGE_KEYS.NOTE_DISMISSED);
  }

  public static clearAuthorNote(): void {
    const note = this.getAuthorNote();
    if (note) {
      const deactivated = { ...note, active: false };
      localStorage.setItem(STORAGE_KEYS.AUTHOR_NOTE, JSON.stringify(deactivated));
    }
  }

  public static isNoteDismissed(noteId: string): boolean {
    try {
      const dismissed = localStorage.getItem(STORAGE_KEYS.NOTE_DISMISSED);
      return dismissed === noteId;
    } catch {
      return false;
    }
  }

  public static dismissNote(noteId: string): void {
    localStorage.setItem(STORAGE_KEYS.NOTE_DISMISSED, noteId);
  }

  public static undismissNote(): void {
    localStorage.removeItem(STORAGE_KEYS.NOTE_DISMISSED);
  }

  public static importDataJson(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.pieces && Array.isArray(parsed.pieces)) {
        localStorage.setItem(STORAGE_KEYS.PIECES, JSON.stringify(parsed.pieces));
      }
      if (parsed.profile) {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(parsed.profile));
      }
      if (parsed.devRoster && Array.isArray(parsed.devRoster)) {
        this.saveDevRoster(parsed.devRoster);
      }
      return true;
    } catch {
      return false;
    }
  }

  public static resetToDefaultData(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PIECES, JSON.stringify(SEED_PIECES));
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(ANONYMOUS_GUEST_PROFILE));
      localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(SEED_USERS));
      localStorage.setItem(STORAGE_KEYS.AUTHOR_NOTE, JSON.stringify(DEFAULT_AUTHOR_NOTE));
      localStorage.removeItem(STORAGE_KEYS.NOTE_DISMISSED);
    } catch {
      // Ignore
    }
  }
}
