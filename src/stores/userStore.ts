import { create } from 'zustand';
import { SubscriptionTier } from '../types';

interface UserState {
  // User data
  user: {
    id: string;
    email: string;
    display_name?: string;
    subscription_tier: SubscriptionTier;
    total_xp: number;
    current_level: number;
    current_streak: number;
  } | null;

  // Loading state
  loading: boolean;
  error: string | null;

  // Actions
  initializeUser: (userData: any) => void;
  updateUser: (updates: Partial<UserState['user']>) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>((set, get) => {
  return {
    user: null,
    loading: false,
    error: null,

    initializeUser: async (userData: any, _isGuest: boolean = false) => {
      set({ loading: true, error: null });

      try {
        // Handle case where userData is null/undefined
        if (!userData) {
          console.warn('initializeUser called with null/undefined userData');
          set({ loading: false });
          return;
        }

        // For authenticated users, initialize with provided data
        const newUser = {
          id: userData?.id || '',
          email: userData?.email || '',
          display_name: userData?.user_metadata?.full_name || userData?.email || 'User',
          subscription_tier: userData?.subscription_tier || 'free',
          total_xp: userData?.total_xp || 0,
          current_level: userData?.current_level || 1,
          current_streak: userData?.current_streak || 0,
        };

        set({
          user: newUser,
          loading: false
        });
      } catch (error) {
        console.error('Error initializing user:', error);
        set({
          loading: false,
          error: 'Failed to initialize user data'
        });
      }
    },

    updateUser: async (updates: Partial<UserState['user']>) => {
      const { user } = get();
      if (!user) return;

      const updatedUser = { ...user, ...updates };
      set({ user: updatedUser });
    },

    reset: () => {
      set({
        user: null,
        loading: false,
        error: null,
      });
    },
  };
});
