import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types/writing';
import { StorageService, SUPER_ADMIN_EMAIL, ANONYMOUS_GUEST_PROFILE } from '../services/storage';
import { supabase } from '../services/supabase';
import { SupabaseService } from '../services/supabaseService';

interface AuthContextType {
  currentUser: UserProfile;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  isDeveloper: boolean;
  isSuperAdmin: boolean;
  devRoster: string[];
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;
  addPenpal: (penpalId: string) => Promise<{ success: boolean; message: string }>;
  removePenpal: (penpalId: string) => Promise<void>;
  addDevEmail: (email: string) => void;
  removeDevEmail: (email: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const generatePenpalId = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `PEN-${code}`;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => StorageService.getActiveProfile());
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [devRoster, setDevRoster] = useState<string[]>(() => StorageService.getDevRoster());

  // In-memory guard to prevent repeated/looping sync calls in the same tab lifecycle
  const syncedUserSessionIds = useRef<Set<string>>(new Set());

  const isAuthenticated = Boolean(currentUser && currentUser.id && currentUser.id !== 'guest');
  const normalizedEmail = (currentUser?.email || '').toLowerCase().trim();
  // Developer Academy is strictly restricted to hiox2004@gmail.com with verified authentication
  const isDeveloper = Boolean(
    isAuthenticated && normalizedEmail === SUPER_ADMIN_EMAIL.toLowerCase()
  );
  const isSuperAdmin = isDeveloper;

  // Listen for Supabase Auth state changes
  useEffect(() => {
    let isMounted = true;

    const handleSession = async (session: any) => {
      if (!isMounted) return;
      if (session?.user) {
        // Prevent redundant/looping syncs for the same user in this session lifecycle
        if (syncedUserSessionIds.current.has(session.user.id)) {
          if (isMounted) setIsAuthLoading(false);
          return;
        }
        syncedUserSessionIds.current.add(session.user.id);
        try {
          await syncUserSession(session.user);
        } catch (err) {
          console.warn('Session sync notice:', err);
        }
      } else {
        const guest = ANONYMOUS_GUEST_PROFILE;
        setCurrentUser(guest);
        StorageService.saveActiveProfile(guest);
        localStorage.removeItem('velours_user_profile_v1');
      }
      if (isMounted) {
        setIsAuthLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await handleSession(session);
    });

    // Fallback safety timeout so app is never stuck in loading state
    const timeout = setTimeout(() => {
      if (isMounted) setIsAuthLoading(false);
    }, 2000);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const syncUserSession = async (user: any) => {
    const email = (user.email || '').toLowerCase().trim();
    const metadata = user.user_metadata || {};
    const existing = await SupabaseService.getProfile(user.id);

    const isSuper = email === SUPER_ADMIN_EMAIL.toLowerCase();

    if (existing) {
      const merged: UserProfile = {
        ...existing,
        email,
        displayName: existing.displayName || metadata.full_name || metadata.name || email.split('@')[0],
        avatar: existing.avatar || metadata.avatar_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${email}&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede,b6e3f4`,
        role: isSuper ? 'developer' : 'writer'
      };
      setCurrentUser(merged);
      StorageService.saveActiveProfile(merged);
    } else {
      const newProfile: UserProfile = {
        id: user.id,
        email,
        displayName: metadata.full_name || metadata.name || email.split('@')[0],
        penpalId: generatePenpalId(),
        avatar: metadata.avatar_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${email}&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede,b6e3f4`,
        bio: 'New creative writer on Velours & Verse. Drafting poems and daily thoughts.',
        favoriteDrink: 'Vanilla Chai Latte',
        favoriteQuote: '“I write to find out what I’m talking about.” — Edward Albee',
        writingGoalWords: 500,
        penpalIds: [],
        role: isSuper ? 'developer' : 'writer',
        createdAt: new Date().toISOString()
      };

      await SupabaseService.upsertProfile(newProfile);
      setCurrentUser(newProfile);
      StorageService.saveActiveProfile(newProfile);
    }
  };

  useEffect(() => {
    if (currentUser) {
      StorageService.saveActiveProfile(currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    StorageService.saveDevRoster(devRoster);
  }, [devRoster]);

  // Real Google OAuth through Supabase
  const signInWithGoogle = async () => {
    try {
      const redirectUrl = window.location.hostname === 'localhost' 
        ? window.location.origin 
        : 'https://velours-verse.vercel.app';

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            prompt: 'select_account',
            access_type: 'offline'
          }
        }
      });
      if (error) console.error('OAuth Error:', error.message);
    } catch (err) {
      console.error('Sign in error:', err);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut().catch(() => {});
    localStorage.removeItem('velours_user_profile_v1');
    syncedUserSessionIds.current.clear();
    const guest = StorageService.getActiveProfile();
    setCurrentUser(guest);
  };

  const updateProfile = async (updated: Partial<UserProfile>) => {
    if (!currentUser) return;
    const next = { ...currentUser, ...updated };
    setCurrentUser(next);
    StorageService.saveActiveProfile(next);
    if (currentUser.id && !currentUser.id.startsWith('user_') && !currentUser.id.startsWith('guest')) {
      await SupabaseService.upsertProfile(next);
    }
  };

  const addPenpal = async (penpalIdInput: string): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) return { success: false, message: 'Please sign in to add penpals.' };
    
    // Normalize Penpal ID: handle missing "PEN-", lowercase, hashtags, spaces
    let cleanId = penpalIdInput.trim().toUpperCase().replace(/^[#\s]+/, '');
    if (!cleanId.startsWith('PEN-') && cleanId.length === 5) {
      cleanId = `PEN-${cleanId}`;
    }
    if (!cleanId) return { success: false, message: 'Please enter a valid Penpal ID.' };
    
    const myCode = (currentUser.penpalId || '').toUpperCase();
    if (cleanId === myCode || cleanId.replace(/^PEN-/, '') === myCode.replace(/^PEN-/, '')) {
      return { success: false, message: 'You cannot add your own Penpal ID!' };
    }

    if (currentUser.penpalIds.includes(cleanId) || currentUser.penpalIds.some(id => id.replace(/^PEN-/, '') === cleanId.replace(/^PEN-/, ''))) {
      return { success: false, message: 'This Penpal is already in your circle.' };
    }

    // 1. Search Supabase Cloud first if authenticated
    if (currentUser.id && !currentUser.id.startsWith('user_') && !currentUser.id.startsWith('guest')) {
      const res = await SupabaseService.addPenpal(currentUser.id, cleanId);
      if (res.success && res.profile) {
        StorageService.updateUserInDirectory(res.profile);
        const resolvedId = res.profile.penpalId || cleanId;
        const nextPenpals = Array.from(new Set([...currentUser.penpalIds, resolvedId]));
        setCurrentUser(prev => ({ ...prev, penpalIds: nextPenpals }));
        StorageService.saveActiveProfile({ ...currentUser, penpalIds: nextPenpals });
        return { success: true, message: res.message };
      }
    }

    // 2. Fallback to local user directory and seeded authors (e.g. Aura Dev PEN-8V2M9)
    const allUsers = StorageService.getAllUsers();
    const targetUser = allUsers.find(u => {
      const uCode = (u.penpalId || '').toUpperCase();
      return uCode === cleanId || 
             uCode.replace(/^PEN-/, '') === cleanId.replace(/^PEN-/, '') ||
             uCode === `PEN-${cleanId}`;
    });

    if (targetUser) {
      const resolvedId = targetUser.penpalId;
      const nextPenpals = Array.from(new Set([...currentUser.penpalIds, resolvedId]));
      setCurrentUser(prev => ({ ...prev, penpalIds: nextPenpals }));
      StorageService.saveActiveProfile({ ...currentUser, penpalIds: nextPenpals });
      StorageService.updateUserInDirectory(targetUser);
      return { success: true, message: `Added ${targetUser.displayName} to your Penpal Circle!` };
    }

    return {
      success: false,
      message: `No writer found with Penpal ID "${cleanId}". Make sure they have shared their 5-character Penpal code from their profile.`
    };
  };

  const removePenpal = async (penpalIdToRemove: string) => {
    if (!currentUser) return;
    const nextPenpals = currentUser.penpalIds.filter(id => id !== penpalIdToRemove);
    setCurrentUser(prev => ({ ...prev, penpalIds: nextPenpals }));
    StorageService.saveActiveProfile({ ...currentUser, penpalIds: nextPenpals });
    if (currentUser.id && !currentUser.id.startsWith('user_') && !currentUser.id.startsWith('guest')) {
      await SupabaseService.removePenpal(currentUser.id, penpalIdToRemove);
    }
  };

  const addDevEmail = (email: string) => {
    const clean = email.trim().toLowerCase();
    if (!clean || devRoster.includes(clean)) return;
    const next = [...devRoster, clean];
    setDevRoster(next);
    StorageService.saveDevRoster(next);
  };

  const removeDevEmail = (email: string) => {
    const clean = email.trim().toLowerCase();
    if (clean === SUPER_ADMIN_EMAIL.toLowerCase()) return;
    const next = devRoster.filter(e => e.toLowerCase() !== clean);
    setDevRoster(next);
    StorageService.saveDevRoster(next);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isAuthLoading,
        isDeveloper,
        isSuperAdmin,
        devRoster,
        signInWithGoogle,
        logout,
        updateProfile,
        addPenpal,
        removePenpal,
        addDevEmail,
        removeDevEmail
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
