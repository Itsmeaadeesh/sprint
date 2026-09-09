-- ==============================================================================
-- SPRINT SUPABASE SCHEMA & POLICIES
-- Multi-list task & project board with Row Level Security & Real-time support
-- ==============================================================================

-- 1. Create Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    theme TEXT DEFAULT 'dark' CHECK (theme IN ('dark', 'light')),
    email_notifications BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Lists Table
CREATE TABLE IF NOT EXISTS public.lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#3b82f6',
    icon TEXT DEFAULT 'list',
    position INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    list_id UUID NOT NULL REFERENCES public.lists(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT false NOT NULL,
    completed_at TIMESTAMPTZ,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    due_date TIMESTAMPTZ,
    starred BOOLEAN DEFAULT false NOT NULL,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Tags Table
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#8b5cf6',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Task-Tags Junction Table
CREATE TABLE IF NOT EXISTS public.task_tags (
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, tag_id)
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Ensure users can strictly access only their own records
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_tags ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- Lists Policies
CREATE POLICY "Users can view own lists" 
    ON public.lists FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own lists" 
    ON public.lists FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lists" 
    ON public.lists FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own lists" 
    ON public.lists FOR DELETE 
    USING (auth.uid() = user_id);

-- Tasks Policies
CREATE POLICY "Users can view own tasks" 
    ON public.tasks FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tasks" 
    ON public.tasks FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" 
    ON public.tasks FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks" 
    ON public.tasks FOR DELETE 
    USING (auth.uid() = user_id);

-- Tags Policies
CREATE POLICY "Users can view own tags" 
    ON public.tags FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tags" 
    ON public.tags FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tags" 
    ON public.tags FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tags" 
    ON public.tags FOR DELETE 
    USING (auth.uid() = user_id);

-- Task Tags Policies
CREATE POLICY "Users can view own task_tags" 
    ON public.task_tags FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.tasks 
            WHERE tasks.id = task_tags.task_id 
            AND tasks.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own task_tags" 
    ON public.task_tags FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.tasks 
            WHERE tasks.id = task_tags.task_id 
            AND tasks.user_id = auth.uid()
        )
    );

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER
-- Triggers when a new user registers through Supabase Auth
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        COALESCE(new.raw_user_meta_data->>'avatar_url', '')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- REALTIME REPLICATION CONFIGURATION
-- Enables live sync across multiple browser tabs / devices
-- ==============================================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'lists'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.lists;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'tasks'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'profiles'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
    END IF;
END $$;
