
CREATE OR REPLACE FUNCTION public.auto_confirm_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE auth.users
  SET email_confirmed_at = now(),
      confirmed_at = now(),
      updated_at = now()
  WHERE id = NEW.id AND email_confirmed_at IS NULL;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_confirm
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_user();
