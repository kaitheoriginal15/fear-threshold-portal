-- Create books table
CREATE TABLE IF NOT EXISTS public.books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  pdf_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- Create policies for books
CREATE POLICY "Anyone can view books" 
ON public.books 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert books" 
ON public.books 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update books" 
ON public.books 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete books" 
ON public.books 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_books_updated_at
BEFORE UPDATE ON public.books
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for book PDFs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('books', 'books', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for books
CREATE POLICY "Anyone can view book PDFs" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'books');

CREATE POLICY "Only admins can upload book PDFs" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'books' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update book PDFs" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'books' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete book PDFs" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'books' AND has_role(auth.uid(), 'admin'::app_role));