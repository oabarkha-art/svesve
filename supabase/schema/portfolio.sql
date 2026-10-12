-- Existing images remain served by Vercel; new uploads use the artwork-images bucket.
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;
create table private.admin_emails(email text primary key);
alter table private.admin_emails enable row level security;
insert into private.admin_emails values ('svea.fritzenkoetter00@gmail.com'), ('oabarkha@gmail.com');
-- Privileged lookup only: requires a current, confirmed Auth user and an explicit allowlist.
create function private.is_admin() returns boolean language sql stable security definer set search_path = '' as $$
 select auth.uid() is not null and exists (
 select 1 from auth.users u join private.admin_emails a on a.email=lower(u.email)
 where u.id=auth.uid() and u.email_confirmed_at is not null and u.deleted_at is null
 );
$$;
revoke all on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated;
create function public.is_admin() returns boolean language sql stable security invoker set search_path = '' as $$ select private.is_admin(); $$;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;
create table public.artworks (
 id text primary key default gen_random_uuid()::text,
 category text not null check(category in ('malerei','illustration')),
 title text not null check(length(trim(title)) between 1 and 200),
 description text not null default '', image text not null check(image ~ '^(/images/|https://)'),
 technique text not null default '', year text, dimensions text,
 sold boolean not null default false, gallery boolean not null default true,
 published boolean not null default true, sort_order integer not null default 0
);
create table public.print_prices(format text primary key check(format in ('A5','A4','A3')), cents integer not null check(cents between 100 and 1000000));
insert into public.print_prices values ('A5',1200),('A4',2400),('A3',5200);
create table public.orders (
 id uuid primary key, created_at timestamptz not null default now(),
 fingerprint text not null, customer jsonb not null, items jsonb not null,
 total_cents integer not null check(total_cents>0),
 status text not null default 'new' check(status in ('new','contacted','completed','cancelled')),
 notification_status text not null default 'pending' check(notification_status in ('pending','sent','failed'))
);
create index orders_created_at on public.orders(created_at desc);
alter table public.artworks enable row level security;
alter table public.print_prices enable row level security;
alter table public.orders enable row level security;
revoke all on public.artworks, public.print_prices, public.orders from anon, authenticated;
grant select on public.artworks, public.print_prices to anon, authenticated;
grant insert, update, delete on public.artworks to authenticated;
grant update on public.print_prices to authenticated;
grant select on public.orders to authenticated;
grant update(status) on public.orders to authenticated;
grant all on public.artworks, public.print_prices, public.orders to service_role;
create policy artwork_read on public.artworks for select to anon, authenticated using(published);
create policy artwork_admin on public.artworks for all to authenticated using((select private.is_admin())) with check((select private.is_admin()));
create policy prices_read on public.print_prices for select to anon, authenticated using(true);
create policy prices_admin on public.print_prices for update to authenticated using((select private.is_admin())) with check((select private.is_admin()));
create policy orders_read on public.orders for select to authenticated using((select private.is_admin()));
create policy orders_status on public.orders for update to authenticated using((select private.is_admin())) with check((select private.is_admin()));
-- Atomic per-minute rate limit, only callable by the order server.
create table public.order_rate_limits(key text primary key, window_start timestamptz not null, attempts integer not null);
alter table public.order_rate_limits enable row level security;
revoke all on public.order_rate_limits from anon, authenticated;
grant all on public.order_rate_limits to service_role;
create function public.consume_order_limit(rate_key text) returns boolean language plpgsql security invoker set search_path = '' as $$
declare n integer;
begin
 insert into public.order_rate_limits as r values(rate_key, now(),1)
 on conflict(key) do update set
 attempts=case when r.window_start < now()-interval '1 minute' then 1 else r.attempts+1 end,
 window_start=case when r.window_start < now()-interval '1 minute' then now() else r.window_start end
 returning attempts into n;
 delete from public.order_rate_limits where window_start < now()-interval '1 day';
 return n<=5;
end; $$;
revoke all on function public.consume_order_limit(text) from public, anon, authenticated;
grant execute on function public.consume_order_limit(text) to service_role;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('artwork-images','artwork-images',true,10485760,array['image/jpeg','image/png','image/webp']);
create policy image_admin_read on storage.objects for select to authenticated using(bucket_id='artwork-images' and (select private.is_admin()));
create policy image_admin_insert on storage.objects for insert to authenticated with check(bucket_id='artwork-images' and (select private.is_admin()));
create policy image_admin_update on storage.objects for update to authenticated using(bucket_id='artwork-images' and (select private.is_admin())) with check(bucket_id='artwork-images' and (select private.is_admin()));
create policy image_admin_delete on storage.objects for delete to authenticated using(bucket_id='artwork-images' and (select private.is_admin()));
