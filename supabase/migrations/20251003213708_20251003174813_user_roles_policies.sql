-- Fix security warnings

-- Add RLS policies for user_roles table
CREATE POLICY "Users can view their own role"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Only system can insert roles"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "Only system can update roles"
  ON public.user_roles
  FOR UPDATE
  USING (false);

CREATE POLICY "Only system can delete roles"
  ON public.user_roles
  FOR DELETE
  USING (false);

-- Fix function search_path for update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;