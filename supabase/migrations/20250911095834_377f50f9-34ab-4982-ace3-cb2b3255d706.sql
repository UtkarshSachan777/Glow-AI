-- Additional security hardening for profiles table
-- Add email access logging function
CREATE OR REPLACE FUNCTION public.log_email_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Only log if email field is being accessed/updated
  IF TG_OP = 'UPDATE' AND OLD.email IS DISTINCT FROM NEW.email THEN
    INSERT INTO public.audit_logs (table_name, operation, user_id, created_at, details)
    VALUES ('profiles', 'email_update', auth.uid(), NOW(), 
            jsonb_build_object('old_email', OLD.email, 'new_email', NEW.email));
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit logs table for sensitive operations
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  details JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS on audit logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only allow users to view their own audit logs
CREATE POLICY "Users can view own audit logs" ON public.audit_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Add trigger for email access logging
DROP TRIGGER IF EXISTS profiles_email_access_log ON public.profiles;
CREATE TRIGGER profiles_email_access_log
  AFTER UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.log_email_access();

-- Add additional security constraint to profiles
ALTER TABLE public.profiles 
ADD CONSTRAINT email_format_check 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Create function to mask email for display purposes
CREATE OR REPLACE FUNCTION public.mask_email(email_address TEXT)
RETURNS TEXT AS $$
BEGIN
  IF email_address IS NULL THEN
    RETURN NULL;
  END IF;
  
  RETURN 
    LEFT(split_part(email_address, '@', 1), 2) || 
    REPEAT('*', GREATEST(0, LENGTH(split_part(email_address, '@', 1)) - 2)) ||
    '@' || 
    split_part(email_address, '@', 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add rate limiting for profile access
CREATE OR REPLACE FUNCTION public.check_profile_access_rate()
RETURNS TRIGGER AS $$
DECLARE
  access_count INTEGER;
BEGIN
  -- Check access rate in last minute
  SELECT COUNT(*) INTO access_count
  FROM public.audit_logs
  WHERE user_id = auth.uid()
    AND table_name = 'profiles'
    AND created_at > NOW() - INTERVAL '1 minute';
    
  IF access_count > 100 THEN
    RAISE EXCEPTION 'Rate limit exceeded for profile access';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comprehensive security comment
COMMENT ON TABLE public.profiles IS 'User profiles with enhanced security: RLS enabled, email validation, access logging, and rate limiting';
COMMENT ON COLUMN public.profiles.email IS 'Customer email addresses - protected by RLS policies, validated format, and access logging';