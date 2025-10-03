-- Create characters table if not exists
CREATE TABLE IF NOT EXISTS public.characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  birth_date TEXT,
  status TEXT,
  gender TEXT,
  rank TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;

-- Create character_years table for year-specific data
CREATE TABLE IF NOT EXISTS public.character_years (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID REFERENCES public.characters(id) ON DELETE CASCADE NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1990 AND year <= 1995),
  image_url TEXT,
  stats JSONB,
  UNIQUE (character_id, year)
);

ALTER TABLE public.character_years ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view characters" ON public.characters;
DROP POLICY IF EXISTS "Only admins can insert characters" ON public.characters;
DROP POLICY IF EXISTS "Only admins can update characters" ON public.characters;
DROP POLICY IF EXISTS "Only admins can delete characters" ON public.characters;
DROP POLICY IF EXISTS "Anyone can view character years" ON public.character_years;
DROP POLICY IF EXISTS "Only admins can insert character years" ON public.character_years;
DROP POLICY IF EXISTS "Only admins can update character years" ON public.character_years;
DROP POLICY IF EXISTS "Only admins can delete character years" ON public.character_years;

-- RLS Policies for characters
CREATE POLICY "Anyone can view characters"
  ON public.characters
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert characters"
  ON public.characters
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update characters"
  ON public.characters
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete characters"
  ON public.characters
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for character_years
CREATE POLICY "Anyone can view character years"
  ON public.character_years
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert character years"
  ON public.character_years
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update character years"
  ON public.character_years
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete character years"
  ON public.character_years
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger to update updated_at
DROP TRIGGER IF EXISTS update_characters_updated_at ON public.characters;

CREATE TRIGGER update_characters_updated_at
  BEFORE UPDATE ON public.characters
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();