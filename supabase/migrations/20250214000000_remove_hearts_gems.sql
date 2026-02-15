-- Migration: Remove hearts and gems features completely
-- This removes the gamification elements (hearts/lives and gems) from the database

-- 1. Remove gems and lives columns from user_profiles table
ALTER TABLE public.user_profiles DROP COLUMN IF EXISTS gems;
ALTER TABLE public.user_profiles DROP COLUMN IF EXISTS lives;

-- 2. Remove lives_lost column from practice_sessions table
ALTER TABLE public.practice_sessions DROP COLUMN IF EXISTS lives_lost;

-- 3. Drop RPC functions related to hearts (if they exist)
DROP FUNCTION IF EXISTS public.get_last_heart_refill(UUID);
DROP FUNCTION IF EXISTS public.refill_user_life(UUID);
DROP FUNCTION IF EXISTS public.initialize_user_hearts(UUID);
DROP FUNCTION IF EXISTS public.reset_user_hearts(UUID);
DROP FUNCTION IF EXISTS public.can_refill_life(UUID);

-- 4. Drop streaks table if it exists (was only used for freeze count, related to hearts)
DROP TABLE IF EXISTS public.streaks;

-- 5. Clean up any remaining references in other tables
-- (These columns may not exist, so we use IF EXISTS to avoid errors)
ALTER TABLE public.user_progress DROP COLUMN IF EXISTS lives_lost;
ALTER TABLE public.learning_paths DROP COLUMN IF EXISTS gems_earned;
ALTER TABLE public.units DROP COLUMN IF EXISTS gems_reward;
ALTER TABLE public.lessons DROP COLUMN IF EXISTS gems_reward;
