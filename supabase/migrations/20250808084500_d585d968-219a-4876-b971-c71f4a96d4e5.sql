-- Allow guest book requests by making user_id nullable
ALTER TABLE public.book_requests 
ALTER COLUMN user_id DROP NOT NULL;