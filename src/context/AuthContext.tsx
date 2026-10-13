import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types/writing';
import { StorageService, SUPER_ADMIN_EMAIL, SEED_USERS } from '../services/storage';

interface AuthContextType {
  currentUser: UserProfile;
  isDeveloper: boolean;
  isSuperAdmin: boolean;
  devRoster: string[];
  loginAs: (user: UserProfile) => void;
  loginWithGoogle: (email: string, displayName?: string) => void;
  logout: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  addPenpal: (penpalId: string) => { success: boolean; message: string };
  removePenpal: (penpalId: string) => void;
  addDevEmail: (email: string) => void;
  removeDevEmail: (email: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Generate random 7-character Penpal ID
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

  // Check developer status
  const normalizedEmail = (currentUser.email || '').toLowerCase().trim();
  const isDeveloper = devRoster.some(e => e.toLowerCase().trim() === normalizedEmail);
  const isSuperAdmin = normalizedEmail === SUPER_ADMIN_EMAIL.toLowerCase();

  useEffect(() => {
    StorageService.saveActiveProfile(currentUser);
  }, [currentUser]);

  useEffect(() => {
    StorageService.saveDevRoster(devRoster);
  }, [devRoster]);

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

    // Create new profile for this Google Account
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

  const logout = () => {
    // Fallback to guest or first seed user
    const guestUser: UserProfile = {
      id: 'guest',
      email: 'guest@veloursverse.app',
      displayName: 'Guest Writer',
      penpalId: generatePenpalId(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'Browsing through the journal archives.',
      favoriteDrink: 'Earl Grey Tea',
      favoriteQuote: 'Words are sacred.',
      writingGoalWords: 300,
      penpalIds: [],
      role: 'writer',
      createdAt: new Date().toISOString()
    };
    setCurrentUser(guestUser);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setCurrentUser(prev => {
      const next = { ...prev, ...updated };
      StorageService.saveActiveProfile(next);
      return next;
    });
  };

  const addPenpal = (penpalIdInput: string): { success: boolean; message: string } => {
    const cleanId = penpalIdInput.trim().toUpperCase();
    if (!cleanId) return { success: false, message: 'Please enter a valid Penpal ID.' };
    if (cleanId === currentUser.penpalId) return { success: false, message: 'You cannot add your own Penpal ID!' };

    if (currentUser.penpalIds.includes(cleanId)) {
      return { success: false, message: 'This Penpal is already in your circle.' };
    }

    const allUsers = StorageService.getAllUsers();
    const targetUser = allUsers.find(u => u.penpalId.toUpperCase() === cleanId);

    if (!targetUser) {
      return { success: false, message: `No penpal found with ID ${cleanId}. Make sure the code is correct.` };
    }

    const nextPenpals = [...currentUser.penpalIds, cleanId];
    updateProfile({ penpalIds: nextPenpals });
    return { success: true, message: `Added ${targetUser.displayName} to your Penpal Circle!` };
  };

  const removePenpal = (penpalIdToRemove: string) => {
    const nextPenpals = currentUser.penpalIds.filter(id => id !== penpalIdToRemove);
    updateProfile({ penpalIds: nextPenpals });
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
    if (clean === SUPER_ADMIN_EMAIL.toLowerCase()) {
      return; // Cannot remove super admin
    }
    const next = devRoster.filter(e => e.toLowerCase() !== clean);
    setDevRoster(next);
    StorageService.saveDevRoster(next);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isDeveloper,
        isSuperAdmin,
        devRoster,
        loginAs,
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
