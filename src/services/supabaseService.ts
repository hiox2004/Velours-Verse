import { supabase } from './supabase';
import { WritingPiece, UserProfile, CommentItem, AuthorNote } from '../types/writing';
import { StorageService } from './storage';

export class SupabaseService {
  /**
   * Fetch all published pieces + pieces belonging to the current user
   */
  public static async getPieces(currentUserId?: string): Promise<WritingPiece[]> {
    try {
      const { data, error } = await supabase
        .from('pieces')
        .select(`
          *,
          profiles:author_id (
            display_name,
            penpal_id,
            email,
            avatar
          ),
          comments (
            id,
            author_id,
            text,
            created_at,
            profiles:author_id (
              display_name,
              penpal_id,
              avatar
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase getPieces error, falling back to local storage:', error.message);
        return StorageService.getPieces();
      }

      if (!data || data.length === 0) {
        return StorageService.getPieces();
      }

      return data.map((item: any) => ({
        id: item.id,
        title: item.title,
        content: item.content,
        type: item.type,
        status: item.status,
        authorId: item.author_id,
        authorDisplayName: item.profiles?.display_name || 'Anonymous Writer',
        authorPenpalId: item.profiles?.penpal_id || 'PEN-????',
        authorEmail: item.profiles?.email || '',
        authorAvatar: item.profiles?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        stars: item.stars || 0,
        starredByMe: false,
        comments: (item.comments || []).map((c: any) => ({
          id: c.id,
          authorDisplayName: c.profiles?.display_name || 'Unknown',
          authorPenpalId: c.profiles?.penpal_id || '',
          authorAvatar: c.profiles?.avatar || '',
          text: c.text,
          createdAt: c.created_at
        })),
        moodTags: item.mood_tags || [],
        cardTint: item.card_tint || 'default',
        wordCount: item.word_count || 0,
        readTimeMinutes: item.read_time_minutes || 1,
        synced: true
      }));
    } catch (err) {
      console.warn('Supabase fetch failed:', err);
      return StorageService.getPieces();
    }
  }

  /**
   * Save piece (Insert or Update in Supabase)
   */
  public static async savePiece(piece: WritingPiece, authorId: string): Promise<string | boolean> {
    try {
      const payload = {
        title: piece.title,
        content: piece.content,
        type: piece.type,
        status: piece.status,
        mood_tags: piece.moodTags,
        card_tint: piece.cardTint,
        word_count: piece.wordCount,
        read_time_minutes: piece.readTimeMinutes,
        updated_at: new Date().toISOString()
      };

      const isValidUuid = (id?: string) => {
        return !!id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      };

      // Check if profile exists; if not, proactively create to satisfy foreign key constraint
      const { data: profileCheck } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', authorId)
        .maybeSingle();

      if (!profileCheck) {
        const localProfile = StorageService.getActiveProfile();
        await SupabaseService.upsertProfile({
          id: authorId,
          email: localProfile.email || '',
          displayName: localProfile.displayName || 'Writer',
          penpalId: localProfile.penpalId,
          avatar: localProfile.avatar,
          bio: localProfile.bio,
          role: localProfile.role
        });
      }

      // Check if it exists and has a valid Supabase UUID format
      if (isValidUuid(piece.id)) {
        const { error } = await supabase
          .from('pieces')
          .update(payload)
          .eq('id', piece.id);
        if (!error) return piece.id;
      }

      // Insert new piece into Supabase
      const { data, error: insertError } = await supabase
        .from('pieces')
        .insert({
          ...payload,
          author_id: authorId
        })
        .select('id')
        .single();

      if (insertError) {
        console.warn('Supabase piece insert notice:', insertError.message);
        return false;
      }

      return data?.id || true;
    } catch (err) {
      console.warn('Supabase savePiece exception:', err);
      return false;
    }
  }

  /**
   * Delete piece
   */
  public static async deletePiece(pieceId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('pieces')
        .delete()
        .eq('id', pieceId);
      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Fetch user profile from Supabase profiles table
   */
  public static async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error || !data) return null;

      // Also get their penpal IDs
      const { data: penpalsData } = await supabase
        .from('penpals')
        .select('penpal_id')
        .eq('user_id', userId);

      const penpalIds = (penpalsData || []).map((p: any) => p.penpal_id);

      return {
        id: data.id,
        email: data.email,
        displayName: data.display_name,
        penpalId: data.penpal_id,
        avatar: data.avatar || '',
        bio: data.bio || '',
        favoriteDrink: data.favorite_drink || 'Tea',
        favoriteQuote: data.favorite_quote || '',
        writingGoalWords: data.writing_goal_words || 500,
        penpalIds,
        role: data.role || 'writer',
        createdAt: data.created_at
      };
    } catch {
      return null;
    }
  }

  /**
   * Upsert user profile
   */
  public static async upsertProfile(profile: Partial<UserProfile> & { id: string; email: string }): Promise<void> {
    try {
      const payload: Record<string, any> = {
        id: profile.id,
        email: profile.email,
        display_name: profile.displayName || profile.email.split('@')[0],
        avatar: profile.avatar || '',
        bio: profile.bio || '',
        favorite_drink: profile.favoriteDrink || 'Tea',
        favorite_quote: profile.favoriteQuote || '',
        writing_goal_words: profile.writingGoalWords || 500,
        role: profile.role || 'writer'
      };
      if (profile.penpalId) {
        payload.penpal_id = profile.penpalId;
      }

      // Check if profile already exists in DB to perform targeted operation
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', profile.id)
        .maybeSingle();

      if (existing) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update(payload)
          .eq('id', profile.id);
        if (updateError) {
          console.warn('Profile update notice (RLS):', updateError.message);
        }
      } else {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert(payload);
        if (insertError) {
          console.warn('Profile insert notice (RLS):', insertError.message);
        }
      }
    } catch (err) {
      console.warn('Profile sync exception:', err);
    }
  }

  /**
   * Add Penpal by penpal code
   */
  public static async addPenpal(userId: string, targetPenpalId: string): Promise<{ success: boolean; message: string; profile?: UserProfile }> {
    try {
      // 1. Verify target exists in profiles (case-insensitive matching)
      const { data: targetProfile, error: targetError } = await supabase
        .from('profiles')
        .select('*')
        .ilike('penpal_id', targetPenpalId)
        .maybeSingle();

      if (targetError || !targetProfile) {
        return { success: false, message: `No writer found with Penpal ID "${targetPenpalId}".` };
      }

      const fullProfile: UserProfile = {
        id: targetProfile.id,
        email: targetProfile.email || '',
        displayName: targetProfile.display_name,
        penpalId: targetProfile.penpal_id,
        avatar: targetProfile.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${targetProfile.penpal_id}&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede,b6e3f4`,
        bio: targetProfile.bio || '',
        favoriteDrink: targetProfile.favorite_drink || 'Tea',
        favoriteQuote: targetProfile.favorite_quote || '',
        writingGoalWords: targetProfile.writing_goal_words || 500,
        penpalIds: [],
        role: targetProfile.role || 'writer',
        createdAt: targetProfile.created_at
      };

      // 2. Insert into penpals table
      const { error: insertError } = await supabase
        .from('penpals')
        .insert({
          user_id: userId,
          penpal_id: targetProfile.penpal_id
        });

      if (insertError && insertError.code !== '23505') {
        console.warn('Penpals cloud insert notice:', insertError.message);
      }

      return {
        success: true,
        message: `Added ${targetProfile.display_name} to your Penpal Circle!`,
        profile: fullProfile
      };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to add penpal.' };
    }
  }

  /**
   * Fetch profiles for a list of Penpal IDs
   */
  public static async getProfilesByPenpalIds(penpalIds: string[]): Promise<UserProfile[]> {
    if (!penpalIds || penpalIds.length === 0) return [];
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('penpal_id', penpalIds);

      if (error || !data) return [];

      return data.map((p: any) => ({
        id: p.id,
        email: p.email || '',
        displayName: p.display_name,
        penpalId: p.penpal_id,
        avatar: p.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${p.penpal_id}&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede,b6e3f4`,
        bio: p.bio || '',
        favoriteDrink: p.favorite_drink || 'Tea',
        favoriteQuote: p.favorite_quote || '',
        writingGoalWords: p.writing_goal_words || 500,
        penpalIds: [],
        role: p.role || 'writer',
        createdAt: p.created_at
      }));
    } catch {
      return [];
    }
  }

  /**
   * Remove Penpal
   */
  public static async removePenpal(userId: string, targetPenpalId: string): Promise<void> {
    try {
      await supabase
        .from('penpals')
        .delete()
        .eq('user_id', userId)
        .eq('penpal_id', targetPenpalId);
    } catch (err) {
      console.warn('Remove penpal error:', err);
    }
  }

  /**
   * Fetch all registered profiles directly from Supabase (for Developer God Mode)
   */
  public static async getAllProfiles(): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return [];

      return data.map((p: any) => ({
        id: p.id,
        email: p.email || '',
        displayName: p.display_name,
        penpalId: p.penpal_id,
        avatar: p.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${p.penpal_id}&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede,b6e3f4`,
        bio: p.bio || '',
        favoriteDrink: p.favorite_drink || 'Tea',
        favoriteQuote: p.favorite_quote || '',
        writingGoalWords: p.writing_goal_words || 500,
        penpalIds: [],
        role: p.role || 'writer',
        createdAt: p.created_at
      }));
    } catch {
      return [];
    }
  }

  /**
   * Update profile role in Supabase (God Mode Promotion / Demotion)
   */
  public static async updateProfileRole(userId: string, role: 'developer' | 'writer'): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);
      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Fetch live Supabase connection status, query latency, and exact table counts
   */
  public static async getDatabaseMetrics(): Promise<{
    connected: boolean;
    latencyMs: number;
    counts: { profiles: number; pieces: number; penpals: number; comments: number };
  }> {
    const start = performance.now();
    try {
      const [profilesRes, piecesRes, penpalsRes, commentsRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('pieces').select('id', { count: 'exact', head: true }),
        supabase.from('penpals').select('id', { count: 'exact', head: true }),
        supabase.from('comments').select('id', { count: 'exact', head: true }),
      ]);
      const latencyMs = Math.round(performance.now() - start);
      return {
        connected: !profilesRes.error,
        latencyMs,
        counts: {
          profiles: profilesRes.count ?? 0,
          pieces: piecesRes.count ?? 0,
          penpals: penpalsRes.count ?? 0,
          comments: commentsRes.count ?? 0
        }
      };
    } catch {
      return {
        connected: false,
        latencyMs: 0,
        counts: { profiles: 0, pieces: 0, penpals: 0, comments: 0 }
      };
    }
  }

  /**
   * Fetch active Creator Note from cloud database
   */
  public static async getLatestAuthorNote(): Promise<AuthorNote | null> {
    try {
      const { data, error } = await supabase
        .from('author_notes')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !data) return null;

      return {
        id: data.id,
        title: data.title,
        content: data.content,
        authorName: data.author_name,
        authorRole: data.author_role,
        authorAvatar: data.author_avatar,
        targetAudience: data.target_audience || 'all',
        targetUserName: data.target_user_name || 'All Writers & Dreamers',
        tag: data.tag || 'Creator Dispatch',
        createdAt: data.created_at,
        active: data.active
      };
    } catch {
      return null;
    }
  }

  /**
   * Dispatch Creator Note to cloud database
   */
  public static async saveAuthorNote(note: AuthorNote): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('author_notes')
        .upsert({
          id: note.id,
          title: note.title,
          content: note.content,
          author_name: note.authorName,
          author_role: note.authorRole,
          author_avatar: note.authorAvatar,
          target_audience: note.targetAudience,
          target_user_name: note.targetUserName,
          tag: note.tag,
          active: note.active,
          created_at: note.createdAt
        });
      return !error;
    } catch {
      return false;
    }
  }
}
