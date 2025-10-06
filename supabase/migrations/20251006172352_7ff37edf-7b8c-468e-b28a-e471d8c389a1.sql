-- Add rank column to beasts table and remove gender
ALTER TABLE public.beasts 
ADD COLUMN rank text;