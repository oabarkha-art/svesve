-- Check the current Auth session on every privileged read/write.
-- Enrollment stays optional, but a verified factor makes AAL2 mandatory.
create or replace function private.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
 select auth.uid() is not null and exists (
  select 1 from auth.users u
  join private.admin_emails a on a.email=lower(u.email)
  join auth.sessions s on s.user_id=u.id and s.id::text=(auth.jwt()->>'session_id')
  where u.id=auth.uid() and u.email_confirmed_at is not null and u.deleted_at is null
  and (u.banned_until is null or u.banned_until<=now())
  and (s.not_after is null or s.not_after>now())
  and (not exists(select 1 from auth.mfa_factors f where f.user_id=u.id and f.status='verified')
       or (auth.jwt()->>'aal'='aal2' and s.aal='aal2'))
 );
$$;
revoke all on function private.is_admin() from public,anon;
grant execute on function private.is_admin() to authenticated;
