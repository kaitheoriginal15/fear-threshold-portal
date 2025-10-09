-- Remove the public SELECT policy on quiz_results table
-- IP addresses are PII and should not be publicly accessible
-- Edge functions use service role key which bypasses RLS, so this won't break functionality

DROP POLICY IF EXISTS "Anyone can view quiz results" ON public.quiz_results;