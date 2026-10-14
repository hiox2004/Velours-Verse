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
    penpalIds: [],
    role: 'developer',
    createdAt: '2026-09-01T10:00:00Z'
  }
];

export const DEVELOPER_START_LOG: WritingPiece = {
  id: 'dev-manifesto-1',
  title: 'An Architect’s Guide to Creative Expression on Velours & Verse',
  content: `Welcome to Velours & Verse. We designed this quiet sanctuary for words that refuse to be rushed—an antidote to algorithms, character limits, and fleeting timelines.

Here is how you can explore your literary voice and showcase your creativity across our sanctuary:

1. Write Freely Across Formats
Whether you are drafting an unhurried poem, an honest journal reflection, a miniature short story, or midnight prose—give yourself permission to write without perfectionism. Set a gentle daily word goal and write in morning sunlight or late-night glow.

2. Frame Your Atmosphere with Card Tints & Moods
Words carry their own emotional temperature. Tint your manuscript cards in Rose Silk, Cyber Indigo, Matcha Foam, Midnight Violet, or Y2K Honey. Tag your thoughts with evocative moods like #Nocturnal, #RainyAfternoon, #TeaAndRain, or #Botanical so your voice resonates uniquely.

3. The Sacred Penpal Circle (Private Letters)
Creativity flourishes when shared with trusted minds. Exchange your unique Penpal Code (found in your Profile) with fellow writers. When saving a piece with "Penpal Circle" status, it is encrypted in slow literary confidence: strictly visible to you and your connected penpals, never leaking to the public sanctuary.

4. Publish to the Sanctuary
When a verse is ready to meet the world, mark it "Published". It joins the global writing log for thinkers across the world to read, star, and reflect upon with quiet appreciation.

5. Tangible Archival Keepsakes (PDF & Print)
Turn your digital verses into physical artifacts. Open the Print Preview on any piece to generate vibrant, publication-grade prints and archival PDFs—complete with your bespoke author stamp, typographic framing, and tint palette.

Settle in, brew a warm cup, and write what matters.`,
  type: 'prose',
  status: 'published',
  authorId: 'dev_architect',
  authorDisplayName: 'Lead Developer · Aura',
  authorPenpalId: 'PEN-8V2M9',
  authorEmail: SUPER_ADMIN_EMAIL,
  authorAvatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=velours_creator&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede,b6e3f4',
  createdAt: '2026-10-14T00:00:00Z',
  updatedAt: '2026-10-14T00:00:00Z',
  stars: 48,
  starredByMe: false,
  comments: [
    {
      id: 'c-welcome-1',
      authorDisplayName: 'Velours Editorial',
      authorPenpalId: 'PEN-ED01',
      authorAvatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=editorial&backgroundColor=ffd5dc',
      text: 'Every great writer began with a single unhurried sentence. Welcome to the sanctuary!',
      createdAt: '2026-10-14T00:15:00Z'
    }
  ],
  moodTags: ['Welcome Guide', 'Creative Expression', 'Writing Rituals', 'Penpal Letters'],
  cardTint: 'rose',
  wordCount: 285,
  readTimeMinutes: 2,
  synced: true
};

const SEED_PIECES: WritingPiece[] = [DEVELOPER_START_LOG];

export class StorageService {
  public static getPieces(): WritingPiece[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PIECES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PIECES, JSON.stringify(SEED_PIECES));
        return SEED_PIECES;
      }
      let parsed: WritingPiece[] = JSON.parse(data);
      if (!Array.isArray(parsed)) {
        return SEED_PIECES;
      }
      // Purge obsolete Clara Delacroix & Julian K testing entries
      const cleaned = parsed.filter(p => 
        p.authorId !== 'user_clara' && 
        p.authorId !== 'user_julian' &&
        p.authorDisplayName !== 'Clara Delacroix' &&
        p.authorDisplayName !== 'Julian K.'
      );
      // Ensure the authoritative developer start log is present
      if (!cleaned.some(p => p.id === DEVELOPER_START_LOG.id)) {
        cleaned.unshift(DEVELOPER_START_LOG);
      }
      if (cleaned.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEYS.PIECES, JSON.stringify(cleaned));
      }
      return cleaned;
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
      const parsed: UserProfile[] = JSON.parse(data);
      if (!Array.isArray(parsed)) return SEED_USERS;
      const cleaned = parsed.filter(u => u.id !== 'user_clara' && u.id !== 'user_julian');
      if (cleaned.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(cleaned));
      }
      return cleaned;
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
