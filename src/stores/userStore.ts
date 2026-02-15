import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  initializeUser: (userData: any, isGuest: boolean) => void;
  updateUser: (updates: Partial<UserState['user']>) => void;
  reset: () => void;
}

// Constants
const GUEST_USER_STORAGE_KEY = 'guest_user_data';

export const useUserStore = create<UserState>((set, get) => {
  return {
    user: null,
    loading: false,
    error: null,

    initializeUser: async (userData: any, isGuest: boolean = false) => {
      set({ loading: true, error: null });

      try {
        // Handle case where userData is null/undefined
        if (!userData) {
          console.warn('initializeUser called with null/undefined userData');
          set({ loading: false });
          return;
        }

        // For guest users, load from storage or initialize
        if (isGuest) {
          const storedGuest = await AsyncStorage.getItem(GUEST_USER_STORAGE_KEY);
          if (storedGuest) {
            const guestData = JSON.parse(storedGuest);
            set({
              user: guestData,
              loading: false
            });
          } else {
            // Initialize new guest user
            const newUser = {
              id: userData?.id || 'guest',
              email: 'guest@example.com',
              subscription_tier: 'free' as SubscriptionTier,
              total_xp: 0,
              current_level: 1,
              current_streak: 0,
            };

            await AsyncStorage.setItem(GUEST_USER_STORAGE_KEY, JSON.stringify(newUser));
            set({
              user: newUser,
              loading: false
            });
          }
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

      try {
        // Update storage for guest users
        if (updatedUser.subscription_tier === 'free') {
          await AsyncStorage.setItem(GUEST_USER_STORAGE_KEY, JSON.stringify(updatedUser));
        }

        set({ user: updatedUser });
      } catch (error) {
        console.error('Error updating user:', error);
        set({ error: 'Failed to update user data' });
      }
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
