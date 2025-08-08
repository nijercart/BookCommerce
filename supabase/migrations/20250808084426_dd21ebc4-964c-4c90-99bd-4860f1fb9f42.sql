-- Allow guest book requests by making user_id nullable
ALTER TABLE public.book_requests 
ALTER COLUMN user_id DROP NOT NULL;

-- Create RLS policies for book_requests table
ALTER TABLE public.book_requests ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to see their own requests
CREATE POLICY "Users can view their own book requests" 
ON public.book_requests 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy for authenticated users to create requests
CREATE POLICY "Users can create their own book requests" 
ON public.book_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Policy for guest users to create requests
CREATE POLICY "Allow guest book requests" 
ON public.book_requests 
FOR INSERT 
WITH CHECK (user_id IS NULL AND is_guest = true);

-- Policy for admins to view all requests (assuming admin_roles table exists)
CREATE POLICY "Admins can view all book requests" 
ON public.book_requests 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE admin_roles.user_id = auth.uid()
  )
);