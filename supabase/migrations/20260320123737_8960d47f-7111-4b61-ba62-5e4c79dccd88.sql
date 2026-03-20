-- IT Admin can view all profiles
CREATE POLICY "IT admin can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'it_admin'));

-- IT Admin can view all user roles
CREATE POLICY "IT admin can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'it_admin'));

-- IT Admin can insert roles
CREATE POLICY "IT admin can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'it_admin'));

-- IT Admin can update roles
CREATE POLICY "IT admin can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'it_admin'))
WITH CHECK (public.has_role(auth.uid(), 'it_admin'));

-- IT Admin can delete roles
CREATE POLICY "IT admin can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'it_admin'));