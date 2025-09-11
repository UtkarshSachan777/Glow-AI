-- 1) Tighten profiles policies: restrict to authenticated users only
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
CREATE POLICY "Users can delete own profile"
ON public.profiles
FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- 2) Fix SECURITY DEFINER functions: set immutable search_path
CREATE OR REPLACE FUNCTION public.log_email_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.email IS DISTINCT FROM NEW.email THEN
    INSERT INTO public.audit_logs (table_name, operation, user_id, created_at, details)
    VALUES ('profiles', 'email_update', auth.uid(), NOW(), 
            jsonb_build_object('old_email', OLD.email, 'new_email', NEW.email));
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE OR REPLACE FUNCTION public.mask_email(email_address TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF email_address IS NULL THEN
    RETURN NULL;
  END IF;
  RETURN 
    LEFT(split_part(email_address, '@', 1), 2) || 
    REPEAT('*', GREATEST(0, LENGTH(split_part(email_address, '@', 1)) - 2)) ||
    '@' || split_part(email_address, '@', 2);
END;
$$;

CREATE OR REPLACE FUNCTION public.check_profile_access_rate()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  access_count INTEGER;
BEGIN
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
$$;