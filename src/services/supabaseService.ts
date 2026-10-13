import { supabase } from './supabase';
import { WritingPiece, UserProfile, CommentItem } from '../types/writing';
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
  public static async savePiece(piece: WritingPiece, authorId: string): Promise<boolean> {
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

      // Check if it exists or has UUID format
      const isExistingUuid = piece.id && piece.id.includes('-');
      if (isExistingUuid && !piece.id.startsWith('piece-')) {
        const { error } = await supabase
          .from('pieces')
          .update(payload)
          .eq('id', piece.id);
        if (!error) return true;
      }

      // Insert new piece
      const { error: insertError } = await supabase
        .from('pieces')
        .insert({
          ...payload,
          author_id: authorId
        });

      return !insertError;
    } catch {
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
        .single();

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
      await supabase.from('profiles').upsert({
        id: profile.id,
        email: profile.email,
        display_name: profile.displayName || profile.email.split('@')[0],
        penpal_id: profile.penpalId,
        avatar: profile.avatar,
        bio: profile.bio,
        favorite_drink: profile.favoriteDrink,
        favorite_quote: profile.favoriteQuote,
        writing_goal_words: profile.writingGoalWords,
        role: profile.role || 'writer'
      });
    } catch (err) {
      console.warn('Upsert profile error:', err);
    }
  }

  /**
   * Add Penpal by penpal code
   */
  public static async addPenpal(userId: string, targetPenpalId: string): Promise<{ success: boolean; message: string }> {
    try {
      // 1. Verify target exists
      const { data: targetProfile, error: targetError } = await supabase
        .from('profiles')
        .select('display_name, penpal_id')
        .eq('penpal_id', targetPenpalId)
        .single();

      if (targetError || !targetProfile) {
        return { success: false, message: `No writer found with Penpal ID "${targetPenpalId}".` };
      }

      // 2. Insert into penpals table
      const { error: insertError } = await supabase
        .from('penpals')
        .insert({
          user_id: userId,
          penpal_id: targetPenpalId
        });

      if (insertError) {
        if (insertError.code === '23505') {
          return { success: false, message: 'This Penpal is already in your circle.' };
        }
        return { success: false, message: insertError.message };
      }

      return { success: true, message: `Added ${targetProfile.display_name} to your Penpal Circle!` };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to add penpal.' };
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
}
