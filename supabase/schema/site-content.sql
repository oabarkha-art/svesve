create table public.site_content (
 key text primary key,
 section text not null,
 kind text not null check(kind in ('text','image','link','email')),
 de text not null default '' check(length(de)<=12000),
 en text not null default '' check(length(en)<=12000),
 constraint safe_content_value check (
  kind='text' or
  (kind='image' and de ~ '^(/images/|https://)') or
  (kind='link' and de ~ '^https://') or
  (kind='email' and de ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$')
 )
);
create table public.books (
 id uuid primary key default gen_random_uuid(),
 title_de text not null check(length(trim(title_de)) between 1 and 200), title_en text not null default '',
 meta_de text not null default '', meta_en text not null default '',
 description_de text not null default '', description_en text not null default '',
 cover text not null default '' check(cover='' or cover ~ '^(/images/|https://)'),
 teasers jsonb not null default '[]' check(jsonb_typeof(teasers)='array' and jsonb_array_length(teasers)<=4),
 published boolean not null default true, sort_order integer not null default 0
);
alter table public.site_content enable row level security;
alter table public.books enable row level security;
revoke all on public.site_content,public.books from anon,authenticated;
grant select on public.site_content,public.books to anon,authenticated;
grant update(de,en) on public.site_content to authenticated;
grant insert,update,delete on public.books to authenticated;
grant all on public.site_content,public.books to service_role;
create policy content_read on public.site_content for select to anon,authenticated using(true);
create policy content_edit on public.site_content for update to authenticated using((select private.is_admin())) with check((select private.is_admin()));
create policy books_read on public.books for select to anon,authenticated using(published);
create policy books_admin on public.books for all to authenticated using((select private.is_admin())) with check((select private.is_admin()));
