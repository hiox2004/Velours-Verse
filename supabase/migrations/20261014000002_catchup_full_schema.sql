-- ==============================================================================
-- Velours & Verse Production Catch-up Schema & Automation
-- Migration: 20261014000002_catchup_full_schema.sql
-- Description:
--   1. Ensures all tables (profiles, pieces, penpals, comments) exist with full columns.
--   2. Installs automatic trigger on auth.users (handle_new_user) to populate profiles on OAuth signup.
--   3. Backfills all existing auth.users into public.profiles.
--   4. Inserts authoritative architectural starter piece into public.pieces.
--   5. Configures complete, permissive Row Level Security (RLS) policies for all 4 tables.
-- ==============================================================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL,
  penpal_id TEXT UNIQUE NOT NULL,
  avatar TEXT,
  bio TEXT,
  favorite_drink TEXT DEFAULT 'Vanilla Chai Latte',
  favorite_quote TEXT DEFAULT '“Words that refuse to be rushed.”',
  writing_goal_words INTEGER DEFAULT 500,
  role TEXT DEFAULT 'writer',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all columns exist in case table was created with partial schema earlier
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'email') THEN
    ALTER TABLE public.profiles ADD COLUMN email TEXT NOT NULL DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'avatar') THEN
    ALTER TABLE public.profiles ADD COLUMN avatar TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
    ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'writer';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'favorite_drink') THEN
    ALTER TABLE public.profiles ADD COLUMN favorite_drink TEXT DEFAULT 'Vanilla Chai Latte';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'favorite_quote') THEN
    ALTER TABLE public.profiles ADD COLUMN favorite_quote TEXT DEFAULT '“Words that refuse to be rushed.”';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'writing_goal_words') THEN
    ALTER TABLE public.profiles ADD COLUMN writing_goal_words INTEGER DEFAULT 500;
  END IF;
END;
$$;

-- 2. PIECES TABLE
CREATE TABLE IF NOT EXISTS public.pieces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  mood_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  card_tint TEXT DEFAULT 'default',
  stars INTEGER DEFAULT 0,
  word_count INTEGER DEFAULT 0,
  read_time_minutes INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure constraints allow all app writing types
ALTER TABLE public.pieces DROP CONSTRAINT IF EXISTS pieces_type_check;
ALTER TABLE public.pieces ADD CONSTRAINT pieces_type_check CHECK (type IN ('poem', 'story', 'journal', 'prose', 'letter'));

ALTER TABLE public.pieces DROP CONSTRAINT IF EXISTS pieces_status_check;
ALTER TABLE public.pieces ADD CONSTRAINT pieces_status_check CHECK (status IN ('draft', 'published', 'penpals'));

-- 3. PENPALS TABLE
CREATE TABLE IF NOT EXISTS public.penpals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  penpal_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, penpal_id)
);

-- 4. COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  piece_id UUID REFERENCES public.pieces(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. AUTHOR_NOTES TABLE (Creator Dispatches)
CREATE TABLE IF NOT EXISTS public.author_notes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL,
  author_avatar TEXT,
  target_audience TEXT DEFAULT 'all',
  target_user_name TEXT DEFAULT 'All Writers & Dreamers',
  tag TEXT DEFAULT 'Creator Dispatch',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. AUTOMATIC PROFILE CREATION TRIGGER ON AUTH.USERS (SECURITY DEFINER)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  clean_name TEXT;
  user_avatar TEXT;
  code_part TEXT;
  assigned_role TEXT;
BEGIN
  -- Extract display name from metadata or fallback to email
  clean_name := COALESCE(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(new.email, '@', 1)
  );
  
  -- Extract avatar
  user_avatar := COALESCE(
    new.raw_user_meta_data->>'avatar_url',
    'https://api.dicebear.com/7.x/notionists/svg?seed=' || new.id || '&backgroundColor=ffdfbf,ffd5dc,d1d4f9'
  );

  -- Generate unique 5-char code
  code_part := UPPER(SUBSTRING(REPLACE(gen_random_uuid()::text, '-', '') FROM 1 FOR 5));

  -- Assign role based on developer email
  IF LOWER(new.email) = 'hiox2004@gmail.com' THEN
    assigned_role := 'developer';
  ELSE
    assigned_role := 'writer';
  END IF;

  INSERT INTO public.profiles (
    id,
    email,
    display_name,
    penpal_id,
    avatar,
    bio,
    favorite_drink,
    favorite_quote,
    writing_goal_words,
    role
  ) VALUES (
    new.id,
    new.email,
    clean_name,
    'PEN-' || code_part,
    user_avatar,
    'Creative writer on Velours & Verse. Drafting quiet verses and unhurried thoughts.',
    'Vanilla Chai Latte',
    '“I write to find out what I’m talking about.” — Edward Albee',
    500,
    assigned_role
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    display_name = COALESCE(public.profiles.display_name, EXCLUDED.display_name),
    avatar = COALESCE(public.profiles.avatar, EXCLUDED.avatar);

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 6. BACKFILL ALL EXISTING AUTH.USERS INTO PUBLIC.PROFILES
-- ==============================================================================
DO $$
DECLARE
  u RECORD;
  clean_name TEXT;
  user_avatar TEXT;
  code_part TEXT;
  assigned_role TEXT;
BEGIN
  FOR u IN SELECT * FROM auth.users LOOP
    clean_name := COALESCE(
      u.raw_user_meta_data->>'full_name',
      u.raw_user_meta_data->>'name',
      split_part(u.email, '@', 1)
    );
    user_avatar := COALESCE(
      u.raw_user_meta_data->>'avatar_url',
      'https://api.dicebear.com/7.x/notionists/svg?seed=' || u.id || '&backgroundColor=ffdfbf,ffd5dc,d1d4f9'
    );
    code_part := UPPER(SUBSTRING(REPLACE(u.id::text, '-', '') FROM 1 FOR 5));
    
    IF LOWER(u.email) = 'hiox2004@gmail.com' THEN
      assigned_role := 'developer';
    ELSE
      assigned_role := 'writer';
    END IF;

    INSERT INTO public.profiles (
      id, email, display_name, penpal_id, avatar, bio, favorite_drink, favorite_quote, writing_goal_words, role
    ) VALUES (
      u.id, u.email, clean_name, 'PEN-' || code_part, user_avatar,
      'Creative writer on Velours & Verse. Drafting quiet verses and unhurried thoughts.',
      'Vanilla Chai Latte', '“Words that refuse to be rushed.”', 500, assigned_role
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      role = assigned_role;
  END LOOP;
END;
$$;

-- ==============================================================================
-- 7. BACKFILL STARTER MANIFESTO PIECE INTO PUBLIC.PIECES
-- ==============================================================================
DO $$
DECLARE
  dev_user_id UUID;
BEGIN
  SELECT id INTO dev_user_id FROM public.profiles WHERE LOWER(email) = 'hiox2004@gmail.com' LIMIT 1;
  IF dev_user_id IS NULL THEN
    SELECT id INTO dev_user_id FROM public.profiles LIMIT 1;
  END IF;

  IF dev_user_id IS NOT NULL THEN
    -- Check if already exists to avoid duplicate
    IF NOT EXISTS (SELECT 1 FROM public.pieces WHERE title = 'An Architect’s Guide to Creative Expression on Velours & Verse') THEN
      INSERT INTO public.pieces (
        author_id,
        title,
        content,
        type,
        status,
        mood_tags,
        card_tint,
        stars,
        word_count,
        read_time_minutes
      ) VALUES (
        dev_user_id,
        'An Architect’s Guide to Creative Expression on Velours & Verse',
        'Welcome to Velours & Verse. We designed this quiet sanctuary for words that refuse to be rushed—an antidote to algorithms, character limits, and fleeting timelines.

Here is how you can explore your literary voice and showcase your creativity across our sanctuary:

1. Write Freely Across Formats
Whether you are drafting an unhurried poem, an honest journal reflection, a miniature short story, or midnight prose—give yourself permission to write without perfectionism. Set a gentle daily word goal and write in morning sunlight or late-night glow.

2. Frame Your Atmosphere with Card Tints & Moods
Words carry their own emotional temperature. Tint your manuscript cards in Rose Silk, Cyber Indigo, Matcha Foam, Midnight Violet, or Y2K Honey. Tag your thoughts with evocative moods like #Nocturnal, #RainyAfternoon, #TeaAndRain, or #Botanical so your voice resonates uniquely.

3. The Sacred Penpal Circle (Private Letters)
Creativity flourishes when shared with trusted minds. Exchange your unique Penpal Code (found in your Profile) with fellow writers. When saving a piece with "Penpal Circle" status, it is encrypted in slow literary confidence: strictly visible to you and your connected penpals, never leaking to the public sanctuary.

4. Publish to the Sanctuary
When a verse is ready to meet the world, mark it "Published". It joins the global writing log for thinkers across the world to read, star, and reflect upon with quiet appreciation.

5. Tangible Archival Keepsakes (PDF & Print)
Turn your digital verses into physical artifacts. Open the Print Preview on any piece to generate vibrant, publication-grade prints and archival PDFs—complete with your bespoke author stamp, typographic framing, and tint palette.

Settle in, brew a warm cup, and write what matters.',
        'prose',
        'published',
        ARRAY['Welcome Guide', 'Creative Expression', 'Writing Rituals', 'Penpal Letters'],
        'rose',
        48,
        285,
        2
      );
    END IF;
  END IF;
END;
$$;

-- ==============================================================================
-- 8. CONFIGURE COMPLETE ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- A. PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id) 
  WITH CHECK (auth.uid() = id);

-- B. PIECES
ALTER TABLE public.pieces ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public pieces are viewable by everyone" ON public.pieces;
CREATE POLICY "Public pieces are viewable by everyone" 
  ON public.pieces FOR SELECT 
  USING (status = 'published' OR auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can insert pieces" ON public.pieces;
CREATE POLICY "Users can insert pieces" 
  ON public.pieces FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can update their own pieces" ON public.pieces;
CREATE POLICY "Users can update their own pieces" 
  ON public.pieces FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = author_id) 
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can delete their own pieces" ON public.pieces;
CREATE POLICY "Users can delete their own pieces" 
  ON public.pieces FOR DELETE 
  TO authenticated 
  USING (auth.uid() = author_id);

-- C. PENPALS
ALTER TABLE public.penpals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their penpals" ON public.penpals;
CREATE POLICY "Users can view their penpals" 
  ON public.penpals FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert penpals" ON public.penpals;
CREATE POLICY "Users can insert penpals" 
  ON public.penpals FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete penpals" ON public.penpals;
CREATE POLICY "Users can delete penpals" 
  ON public.penpals FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- D. COMMENTS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public comments are readable by everyone" ON public.comments;
CREATE POLICY "Public comments are readable by everyone" 
  ON public.comments FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can post comments" ON public.comments;
CREATE POLICY "Authenticated users can post comments" 
  ON public.comments FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;
CREATE POLICY "Users can delete their own comments" 
  ON public.comments FOR DELETE 
  TO authenticated 
  USING (auth.uid() = author_id);

-- E. AUTHOR_NOTES
ALTER TABLE public.author_notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Active author notes viewable by everyone" ON public.author_notes;
CREATE POLICY "Active author notes viewable by everyone" 
  ON public.author_notes FOR SELECT 
  USING (active = true);

DROP POLICY IF EXISTS "Developers can manage author notes" ON public.author_notes;
CREATE POLICY "Developers can manage author notes" 
  ON public.author_notes FOR ALL 
  TO authenticated 
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'developer')
  );

-- F. DEVELOPER GOD MODE MODERATION ACCESS ON PIECES
DROP POLICY IF EXISTS "Developers full access to all pieces" ON public.pieces;
CREATE POLICY "Developers full access to all pieces" 
  ON public.pieces FOR ALL 
  TO authenticated 
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'developer')
  );
