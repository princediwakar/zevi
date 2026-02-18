-- Migration: Add total_xp and current_level to user_profiles
-- Run this to add XP tracking to existing profiles

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS total_xp INTEGER DEFAULT 0;

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS current_level INTEGER DEFAULT 1;

-- Update the handle_new_user trigger to include default values
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, subscription_tier, total_xp, current_level)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), 'free', 0, 1);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
