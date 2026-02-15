import { supabase } from '../lib/supabaseClient';
import { Profile } from '../types';

export async function createUserProfile(
  userId: string,
  email: string,
  fullName?: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        email,
        full_name: fullName || '',
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}

export async function getUserProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Profile doesn't exist
      throw error;
    }

    return data as Profile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<Profile>
): Promise<void> {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

