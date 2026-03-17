
-- Drop the broken trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created_confirm ON auth.users;
DROP FUNCTION IF EXISTS public.auto_confirm_user();

-- Use a BEFORE INSERT trigger instead to set confirmed fields before the row is saved
CREATE OR REPLACE FUNCTION public.auto_confirm_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.email_confirmed_at = now();
  NEW.confirmed_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_auto_confirm
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_user();
