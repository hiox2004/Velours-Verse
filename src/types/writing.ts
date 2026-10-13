export type WritingType = 'poem' | 'story' | 'prose' | 'journal';

export type WritingStatus = 'draft' | 'published' | 'penpals';

export interface CommentItem {
  id: string;
  authorDisplayName: string;
  authorPenpalId: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
}

export interface WritingPiece {
  id: string;
  title: string;
  content: string;
  type: WritingType;
  status: WritingStatus;
  authorId: string;
  authorDisplayName: string;
  authorPenpalId: string;
  authorEmail: string; // Strictly private: never exposed to other writers; visible only to self & Developer God Mode
  authorAvatar: string;
  createdAt: string;
  updatedAt: string;
  stars: number;
  starredByMe: boolean;
  comments: CommentItem[];
  moodTags: string[];
  cardTint: string;
  wordCount: number;
  readTimeMinutes: number;
  synced: boolean;
}

export interface UserProfile {
  id: string;
  email: string; // Private
  displayName: string;
  penpalId: string; // Unique, e.g. "PEN-9X2M4"
  avatar: string;
  bio: string;
  favoriteDrink: string;
  favoriteQuote: string;
  writingGoalWords: number;
  penpalIds: string[];
  role: 'developer' | 'writer';
  createdAt: string;
}

export interface AuthorNote {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  targetAudience: 'all' | 'penpals' | string; // 'all' or specific penpal ID / user email
  targetUserName?: string; // Optional custom recipient name e.g. "Clara Delacroix" or "All Writers"
  tag?: string; // e.g. "Creator Dispatch", "Behind The Scenes", "Midnight Whisper", "Platform Note"
  createdAt: string;
  active: boolean;
}

export type AppView = 'landing' | 'feed' | 'compose' | 'penpals' | 'widgets' | 'dev_academy' | 'auth';

export type FeedFilterStatus = 'all' | 'published' | 'drafts' | 'penpals' | 'starred';
