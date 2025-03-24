-- Add the mfa_enabled column to the profiles table
-- ALTER TABLE public.profiles
-- ALTER TABLE public.profiles
-- ADD COLUMN IF NOT EXISTS mfa_enabled BOOLEAN DEFAULT false;

-- Add a comment to explain the purpose of this column
-- COMMENT ON COLUMN public.profiles.mfa_enabled IS 'Indicates whether the user has enabled multi-factor authentication';
-- COMMENT ON COLUMN public.profiles.mfa_enabled IS 'Indicates whether the user has enabled multi-factor authentication';
