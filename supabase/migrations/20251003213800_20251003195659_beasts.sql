-- Criar tabela de bestas
CREATE TABLE IF NOT EXISTS public.beasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  sighting TEXT,
  status TEXT,
  gender TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.beasts ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para beasts
CREATE POLICY "Anyone can view beasts"
ON public.beasts
FOR SELECT
USING (true);

CREATE POLICY "Only admins can insert beasts"
ON public.beasts
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update beasts"
ON public.beasts
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete beasts"
ON public.beasts
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_beasts_updated_at
BEFORE UPDATE ON public.beasts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Criar tabela de anos das bestas (sem anos específicos, só uma entrada genérica)
CREATE TABLE IF NOT EXISTS public.beast_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  beast_id UUID NOT NULL REFERENCES public.beasts(id) ON DELETE CASCADE,
  image_url TEXT,
  stats JSONB,
  UNIQUE(beast_id)
);

-- Habilitar RLS
ALTER TABLE public.beast_stats ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para beast_stats
CREATE POLICY "Anyone can view beast stats"
ON public.beast_stats
FOR SELECT
USING (true);

CREATE POLICY "Only admins can insert beast stats"
ON public.beast_stats
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update beast stats"
ON public.beast_stats
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete beast stats"
ON public.beast_stats
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));