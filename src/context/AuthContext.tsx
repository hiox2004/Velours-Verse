import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types/writing';
import { StorageService, SUPER_ADMIN_EMAIL, SEED_USERS } from '../services/storage';
import { supabase } from '../services/supabase';
import { SupabaseService } from '../services/supabaseService';

interface AuthContextType {
  currentUser: UserProfile;
  isAuthenticated: boolean;
  isDeveloper: boolean;
  isSuperAdmin: boolean;
  devRoster: string[];
  loginAs: (user: UserProfile) => void;
  signInWithGoogle: () => Promise<void>;
  loginWithGoogle: (email: string, displayName?: string) => void;
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
  const [devRoster, setDevRoster] = useState<string[]>(() => StorageService.getDevRoster());

  const isAuthenticated = Boolean(currentUser && currentUser.id && currentUser.id !== 'guest');
  const normalizedEmail = (currentUser?.email || '').toLowerCase().trim();
  // Developer Academy is strictly restricted to hiox2004@gmail.com
  const isDeveloper = Boolean(
    isAuthenticated && (normalizedEmail.startsWith('hiox2004@gmail.com') || normalizedEmail === 'hiox2004')
  );
  const isSuperAdmin = isDeveloper;

  // Listen for Supabase Auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        await syncUserSession(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await syncUserSession(session.user);
      } else if (event === 'SIGNED_OUT') {
        const guest = StorageService.getActiveProfile();
        setCurrentUser(guest);
        localStorage.removeItem('velours_user_profile_v1');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const syncUserSession = async (user: any) => {
    const email = user.email || '';
    const metadata = user.user_metadata || {};
    const existing = await SupabaseService.getProfile(user.id);

    if (existing) {
      setCurrentUser(existing);
      StorageService.saveActiveProfile(existing);
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
        role: email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase() ? 'developer' : 'writer',
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
          redirectTo: redirectUrl
        }
      });
      if (error) console.error('OAuth Error:', error.message);
    } catch (err) {
      console.error('Sign in error:', err);
    }
  };

  const loginAs = (user: UserProfile) => {
    setCurrentUser(user);
    StorageService.saveActiveProfile(user);
  };

  const loginWithGoogle = (email: string, displayName?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const allUsers = StorageService.getAllUsers();
    const existing = allUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      setCurrentUser(existing);
      StorageService.saveActiveProfile(existing);
      return;
    }

    const defaultName = displayName || (cleanEmail.split('@')[0].charAt(0).toUpperCase() + cleanEmail.split('@')[0].slice(1));
    const newProfile: UserProfile = {
      id: `usr_${Date.now()}`,
      email: cleanEmail,
      displayName: defaultName,
      penpalId: generatePenpalId(),
      avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${cleanEmail}&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede,b6e3f4`,
      bio: 'New creative writer on Velours & Verse. Drafting poems and daily thoughts.',
      favoriteDrink: 'Vanilla Chai Latte',
      favoriteQuote: '“I write to find out what I’m talking about.” — Edward Albee',
      writingGoalWords: 500,
      penpalIds: [],
      role: devRoster.some(e => e.toLowerCase() === cleanEmail) ? 'developer' : 'writer',
      createdAt: new Date().toISOString()
    };

    setCurrentUser(newProfile);
    StorageService.saveActiveProfile(newProfile);
    StorageService.updateUserInDirectory(newProfile);
  };

  const logout = async () => {
    await supabase.auth.signOut().catch(() => {});
    localStorage.removeItem('velours_user_profile_v1');
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
    const cleanId = penpalIdInput.trim().toUpperCase();
    if (!cleanId) return { success: false, message: 'Please enter a valid Penpal ID.' };
    if (cleanId === currentUser.penpalId) return { success: false, message: 'You cannot add your own Penpal ID!' };

    if (currentUser.penpalIds.includes(cleanId)) {
      return { success: false, message: 'This Penpal is already in your circle.' };
    }

    if (currentUser.id && !currentUser.id.startsWith('user_') && !currentUser.id.startsWith('guest')) {
      const res = await SupabaseService.addPenpal(currentUser.id, cleanId);
      if (res.success) {
        const nextPenpals = [...currentUser.penpalIds, cleanId];
        setCurrentUser(prev => ({ ...prev, penpalIds: nextPenpals }));
      }
      return res;
    }

    // Local fallback for seed profiles
    const allUsers = StorageService.getAllUsers();
    const targetUser = allUsers.find(u => u.penpalId.toUpperCase() === cleanId);
    if (!targetUser) {
      return { success: false, message: `No penpal found with ID ${cleanId}.` };
    }

    const nextPenpals = [...currentUser.penpalIds, cleanId];
    updateProfile({ penpalIds: nextPenpals });
    return { success: true, message: `Added ${targetUser.displayName} to your Penpal Circle!` };
  };

  const removePenpal = async (penpalIdToRemove: string) => {
    if (!currentUser) return;
    const nextPenpals = currentUser.penpalIds.filter(id => id !== penpalIdToRemove);
    setCurrentUser(prev => ({ ...prev, penpalIds: nextPenpals }));
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
        isDeveloper,
        isSuperAdmin,
        devRoster,
        loginAs,
        signInWithGoogle,
        loginWithGoogle,
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
