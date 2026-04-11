INSERT INTO public.user_roles (user_id, role)
VALUES ('f4d774cb-53ad-4c72-be28-ae6fee9dfffb', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;