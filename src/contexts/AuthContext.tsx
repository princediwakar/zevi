import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserStore } from '../stores/userStore';
import { useProgressStore } from '../stores/progressStore';
import { createUserProfile } from '../services/authService';

WebBrowser.maybeCompleteAuthSession();

// Generate a random string for PKCE code verifier
const generateCodeVerifier = async (): Promise<string> => {
  const random = await Crypto.getRandomBytesAsync(32);
  return Buffer.from(random).toString('base64url');
};

// Generate code challenge from verifier
const generateCodeChallenge = async (codeVerifier: string): Promise<string> => {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    codeVerifier
  );
  return Buffer.from(digest).toString('base64url');
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { initializeUser } = useUserStore();

  // Track if we're currently signing out
  const isSigningOut = React.useRef(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);

        // Initialize user store with authenticated user
        if (session?.user) {
          await initializeUser(session.user);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Skip if we're in the process of signing out
      if (isSigningOut.current) {
        console.log('Skipping auth state change during sign out');
        return;
      }      
      setSession(session);
      setUser(session?.user ?? null);

      // Initialize user store
      if (session?.user) {
        await initializeUser(session.user);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      // If sign up successful, create user profile
      if (data.user) {
        setUser(data.user);
        // Create profile in database
        try {
          await createUserProfile(data.user.id, email, fullName);
          console.log('User profile created successfully');
        } catch (profileError) {
          console.warn('Failed to create user profile:', profileError);
          // Don't fail signup if profile creation fails
        }
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // If sign in successful, ensure user profile exists
      if (data.user) {
        setUser(data.user);
        
        // Create profile if it doesn't exist
        try {
          const { getUserProfile } = await import('../services/authService');
          const existingProfile = await getUserProfile(data.user.id);
          if (!existingProfile) {
            await createUserProfile(data.user.id, email);
            console.log('User profile created on sign in');
          }
        } catch (profileError) {
          console.warn('Failed to create profile on sign in:', profileError);
        }
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signInWithGoogle = useCallback(async () => {
    try {
      // Generate PKCE code verifier and challenge
      const codeVerifier = await generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      
      // Store code verifier for the redirect
      await AsyncStorage.setItem('google_code_verifier', codeVerifier);

      // Use the custom scheme for redirect - properly configured for Expo
      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: 'zevi',
        path: 'auth/callback',
      });

      console.log('OAuth Redirect URL:', redirectUrl);

      // Use Supabase's OAuth with PKCE
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
          scopes: 'email profile',
        },
      });

      if (error) throw error;

      // Open the OAuth URL in a browser
      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUrl,
          {
            // Use the native browser in a new session
            toolbarColor: '#ffffff',
            browserPackage: undefined,
            controlsColor: undefined,
            dismissButtonStyle: 'done',
            readerMode: false,
            enableBarCollapsing: false,
          }
        );

        console.log('OAuth result:', result);

        if (result.type === 'success') {
          // Extract the code from the redirect URL
          const { url } = result;
          
          // Parse the URL to get the code parameter
          let code: string | null = null;
          let refreshToken: string | null = null;
          
          // Handle both hash and query parameters
          if (url.includes('#')) {
            const hashParams = new URLSearchParams(url.split('#')[1]);
            code = hashParams.get('code');
            refreshToken = hashParams.get('refresh_token');
          } else if (url.includes('?')) {
            const queryParams = new URLSearchParams(url.split('?')[1]);
            code = queryParams.get('code');
            refreshToken = queryParams.get('refresh_token');
          }

          if (code) {
            // Retrieve the code verifier
            const storedCodeVerifier = await AsyncStorage.getItem('google_code_verifier');
            if (!storedCodeVerifier) {
              throw new Error('Code verifier not found');
            }

            // Exchange code for session
            // @ts-expect-error - Supabase types may not match the SDK version
            const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code, storedCodeVerifier);

            if (sessionError) throw sessionError;

            // Update state for OAuth success
            if (sessionData.user && sessionData.session) {
              setUser(sessionData.user);
              setSession(sessionData.session);
              
              // Create user profile if it doesn't exist
              try {
                const { getUserProfile } = await import('../services/authService');
                const existingProfile = await getUserProfile(sessionData.user.id);
                if (!existingProfile) {
                  await createUserProfile(
                    sessionData.user.id, 
                    sessionData.user.email || '', 
                    sessionData.user.user_metadata?.full_name
                  );
                  console.log('Google OAuth: User profile created');
                }
              } catch (profileError) {
                console.warn('Failed to create profile on OAuth:', profileError);
              }
            }

            // Clean up stored code verifier
            await AsyncStorage.removeItem('google_code_verifier');

            return { error: null };
          } else if (refreshToken) {
            // If we got a refresh token directly, we need both tokens
            // Since we only have refresh token, we'll throw an error and suggest trying the code exchange again
            throw new Error('OAuth flow did not return an authorization code. Please try again.');
          } else {
            throw new Error('No authorization code or refresh token received');
          }
        } else if (result.type === 'cancel') {
          return { error: new Error('User cancelled OAuth flow') };
        }
      }

      return { error: null };
    } catch (error) {
      console.error('Google OAuth error:', error);
      // Clean up on error
      await AsyncStorage.removeItem('google_code_verifier');
      return { error: error as Error };
    }
  }, []);

  const signOut = async () => {
    // Mark that we're signing out
    isSigningOut.current = true;
    
    try {
      // Sign out from Supabase
      try {
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) {
          console.warn('Supabase sign out warning:', signOutError.message);
        }
      } catch (error) {
        console.warn('Supabase sign out error (continuing anyway):', error);
      }
      
      // Update state - reset everything
      setUser(null);
      setSession(null);
      
      // Force reset the user and progress stores
      const { reset: resetUserStore } = useUserStore.getState();
      resetUserStore();
      const { resetProgress } = useProgressStore.getState();
      resetProgress();
    } finally {
      // Allow auth state changes to process again after a short delay
      setTimeout(() => {
        isSigningOut.current = false;
      }, 500);
    }
  };

  const value = {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
