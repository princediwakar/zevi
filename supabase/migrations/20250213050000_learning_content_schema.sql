-- Learning Paths, Units, and Lessons tables
-- Also add framework_name to questions for AI feedback

-- Create learning_paths table
CREATE TABLE IF NOT EXISTS public.learning_paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    difficulty_level INTEGER DEFAULT 1,
    estimated_hours INTEGER DEFAULT 1,
    prerequisites UUID[] DEFAULT '{}',
    order_index INTEGER DEFAULT 0,
    is_premium BOOLEAN DEFAULT false,
    icon_name TEXT,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create units table
CREATE TABLE IF NOT EXISTS public.units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    learning_path_id UUID REFERENCES public.learning_paths(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    framework_name TEXT,
    order_index INTEGER DEFAULT 0,
    estimated_minutes INTEGER DEFAULT 30,
    xp_reward INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('learn', 'drill', 'pattern', 'full_practice', 'quiz')),
    order_index INTEGER DEFAULT 0,
    content JSONB DEFAULT '{}',
    estimated_minutes INTEGER DEFAULT 10,
    xp_reward INTEGER DEFAULT 10,
    is_locked BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add framework columns to questions table if not exist
ALTER TABLE public.questions 
ADD COLUMN IF NOT EXISTS framework_name TEXT,
ADD COLUMN IF NOT EXISTS framework_steps JSONB,
ADD COLUMN IF NOT EXISTS expert_outline JSONB;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_learning_paths_category ON public.learning_paths(category);
CREATE INDEX IF NOT EXISTS idx_units_path_id ON public.units(learning_path_id);
CREATE INDEX IF NOT EXISTS idx_lessons_unit_id ON public.lessons(unit_id);

-- Enable RLS
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- RLS Policies for learning content (public read)
CREATE POLICY "Anyone can view learning_paths" ON public.learning_paths FOR SELECT USING (true);
CREATE POLICY "Anyone can view units" ON public.units FOR SELECT USING (true);
CREATE POLICY "Anyone can view lessons" ON public.lessons FOR SELECT USING (true);
