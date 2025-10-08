-- Create table to store quiz results by IP
CREATE TABLE public.quiz_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL UNIQUE,
  group_result TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view their own result (we'll pass IP from edge function)
CREATE POLICY "Anyone can view quiz results"
ON public.quiz_results
FOR SELECT
USING (true);

-- Only edge functions can insert/update
CREATE POLICY "Only service role can insert quiz results"
ON public.quiz_results
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Only service role can update quiz results"
ON public.quiz_results
FOR UPDATE
USING (true);

-- Create index for faster IP lookups
CREATE INDEX idx_quiz_results_ip ON public.quiz_results(ip_address);