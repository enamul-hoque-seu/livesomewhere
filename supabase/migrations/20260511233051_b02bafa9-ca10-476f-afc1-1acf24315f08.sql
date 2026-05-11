
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS mobile_number text,
  ADD COLUMN IF NOT EXISTS date_of_birth date;
