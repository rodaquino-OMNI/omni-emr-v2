
-- Create the user_role enum type
CREATE TYPE public.user_role AS ENUM (
  'admin', 
  'doctor', 
  'nurse', 
  'caregiver', 
  'patient', 
  'specialist', 
  'administrative', 
  'pharmacist',
  'lab_technician',
  'radiology_technician',
  'system_administrator'
);

-- Update existing profiles table to use the new role type
ALTER TABLE public.profiles ALTER COLUMN role TYPE public.user_role USING role::text::public.user_role;
