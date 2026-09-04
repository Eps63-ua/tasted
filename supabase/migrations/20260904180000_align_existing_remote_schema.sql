-- Aligns the earlier remote schema with the current Expo client.
-- Safe for an empty catalog: it preserves auth users and existing rows.

alter table public.establishments add column if not exists normalized_name text;
alter table public.products add column if not exists normalized_name text;
alter table public.products add column if not exists normalized_brand text;
alter table public.categories add column if not exists normalized_name text;

update public.establishments set normalized_name = lower(trim(name)) where normalized_name is null;
update public.products set normalized_name = lower(trim(name)) where normalized_name is null;
update public.products set normalized_brand = lower(trim(brand)) where normalized_brand is null and brand is not null;
update public.categories set normalized_name = lower(trim(name)) where normalized_name is null;

alter table public.establishments alter column normalized_name set not null;
alter table public.products alter column normalized_name set not null;
alter table public.categories alter column normalized_name set not null;

create index if not exists products_duplicate_lookup on public.products(establishment_id, normalized_name, normalized_brand);
create unique index if not exists categories_root_name on public.categories(user_id, normalized_name) where parent_id is null;
create unique index if not exists categories_sibling_name on public.categories(user_id, parent_id, normalized_name) where parent_id is not null;

alter table public.establishments drop constraint if exists establishments_type_check;
alter table public.establishments add constraint establishments_type_check check (
  type in ('supermarket','restaurant','cafe','ice_cream_shop','bakery','bar','food_shop','store','other')
);

create unique index if not exists entries_user_product_unique on public.user_product_entries(user_id, product_id);
create unique index if not exists categories_id_user_unique on public.categories(id, user_id);
create unique index if not exists entries_id_user_unique on public.user_product_entries(id, user_id);

create or replace function public.create_profile_for_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles(id, username, display_name)
  values(
    new.id,
    coalesce(nullif(lower(new.raw_user_meta_data->>'username'), ''), 'user_' || substr(new.id::text, 1, 8)),
    coalesce(nullif(new.raw_user_meta_data->>'display_name', ''), 'Usuario')
  ) on conflict(id) do nothing;
  return new;
end $$;

drop trigger if exists auth_user_profile on auth.users;
create trigger auth_user_profile after insert on auth.users
for each row execute function public.create_profile_for_user();

insert into public.profiles(id, username, display_name)
select users.id,
  coalesce(nullif(lower(users.raw_user_meta_data->>'username'), ''), 'user_' || substr(users.id::text, 1, 8)),
  coalesce(nullif(users.raw_user_meta_data->>'display_name', ''), 'Usuario')
from auth.users users
on conflict(id) do nothing;

update public.profiles set username = 'user_' || substr(id::text, 1, 8) where username is null or trim(username) = '';

alter table public.profiles enable row level security;
alter table public.establishments enable row level security;
alter table public.establishment_images enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.user_product_entries enable row level security;
alter table public.categories enable row level security;
alter table public.entry_categories enable row level security;

do $$ begin
  if not exists(select 1 from pg_policies where schemaname='public' and tablename='profiles' and policyname='profiles_select_own') then
    create policy profiles_select_own on public.profiles for select to authenticated using(id=auth.uid());
  end if;
  if not exists(select 1 from pg_policies where schemaname='public' and tablename='profiles' and policyname='profiles_update_own') then
    create policy profiles_update_own on public.profiles for update to authenticated using(id=auth.uid()) with check(id=auth.uid());
  end if;
  if not exists(select 1 from pg_policies where schemaname='public' and tablename='establishments' and policyname='establishments_read') then
    create policy establishments_read on public.establishments for select to authenticated using(true);
  end if;
  if not exists(select 1 from pg_policies where schemaname='public' and tablename='establishments' and policyname='establishments_insert') then
    create policy establishments_insert on public.establishments for insert to authenticated with check(created_by=auth.uid());
  end if;
  if not exists(select 1 from pg_policies where schemaname='public' and tablename='establishments' and policyname='establishments_update_creator') then
    create policy establishments_update_creator on public.establishments for update to authenticated using(created_by=auth.uid()) with check(created_by=auth.uid());
  end if;
  if not exists(select 1 from pg_policies where schemaname='public' and tablename='products' and policyname='products_read') then
    create policy products_read on public.products for select to authenticated using(true);
  end if;
  if not exists(select 1 from pg_policies where schemaname='public' and tablename='products' and policyname='products_insert') then
    create policy products_insert on public.products for insert to authenticated with check(created_by=auth.uid());
  end if;
  if not exists(select 1 from pg_policies where schemaname='public' and tablename='products' and policyname='products_update_creator') then
    create policy products_update_creator on public.products for update to authenticated using(created_by=auth.uid()) with check(created_by=auth.uid());
  end if;
  if not exists(select 1 from pg_policies where schemaname='public' and tablename='categories' and policyname='categories_owner_all') then
    create policy categories_owner_all on public.categories for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
  end if;
  if not exists(select 1 from pg_policies where schemaname='public' and tablename='user_product_entries' and policyname='entries_owner_all') then
    create policy entries_owner_all on public.user_product_entries for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
  end if;
  if not exists(select 1 from pg_policies where schemaname='public' and tablename='entry_categories' and policyname='entry_categories_owner_all') then
    create policy entry_categories_owner_all on public.entry_categories for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
  end if;
end $$;

create or replace function public.validate_category_tree() returns trigger
language plpgsql set search_path = '' as $$
declare parent_owner uuid; cycle_found boolean;
begin
  if new.parent_id is null then return new; end if;
  select user_id into parent_owner from public.categories where id = new.parent_id;
  if parent_owner is distinct from new.user_id then raise exception 'La categoría padre no pertenece al usuario'; end if;
  with recursive ancestors as (
    select id, parent_id from public.categories where id = new.parent_id
    union all
    select category.id, category.parent_id from public.categories category join ancestors on category.id = ancestors.parent_id
  ) select exists(select 1 from ancestors where id = new.id) into cycle_found;
  if cycle_found then raise exception 'La jerarquía produciría un ciclo'; end if;
  return new;
end $$;

drop trigger if exists categories_tree on public.categories;
create trigger categories_tree before insert or update of parent_id, user_id on public.categories
for each row execute function public.validate_category_tree();

create or replace function public.save_product_with_entry(payload jsonb)
returns table(product_id uuid, entry_id uuid)
language plpgsql security definer set search_path = '' as $$
declare uid uuid := auth.uid(); pid uuid; eid uuid; category_value text;
begin
  if uid is null then raise exception 'Autenticación requerida'; end if;
  if (payload->>'rating')::numeric not between 0.5 and 5 or mod((payload->>'rating')::numeric * 2, 1) <> 0 then raise exception 'Valoración inválida'; end if;
  if not exists(select 1 from public.establishments where id = (payload->>'establishment_id')::uuid) then raise exception 'Establecimiento no válido'; end if;
  pid := nullif(payload->>'id','')::uuid;
  if pid is null then
    select product.id into pid from public.products product
    where product.establishment_id = (payload->>'establishment_id')::uuid
      and product.normalized_name = payload->>'normalized_name'
      and coalesce(product.normalized_brand,'') = coalesce(payload->>'normalized_brand','') limit 1;
  end if;
  if pid is null then
    insert into public.products(created_by, establishment_id, name, normalized_name, brand, normalized_brand, description)
    values(uid, (payload->>'establishment_id')::uuid, payload->>'name', payload->>'normalized_name', nullif(payload->>'brand',''), nullif(payload->>'normalized_brand',''), nullif(payload->>'description','')) returning id into pid;
  elsif payload->>'id' is not null and exists(select 1 from public.products where id = pid and created_by = uid) then
    update public.products set establishment_id=(payload->>'establishment_id')::uuid, name=payload->>'name', normalized_name=payload->>'normalized_name', brand=nullif(payload->>'brand',''), normalized_brand=nullif(payload->>'normalized_brand',''), description=nullif(payload->>'description','') where id=pid and created_by=uid;
  end if;
  insert into public.user_product_entries(user_id, product_id, rating, review_text, is_favorite, price_paid, currency_code, tried_at, visibility)
  values(uid, pid, (payload->>'rating')::numeric, nullif(payload->>'review_text',''), coalesce((payload->>'is_favorite')::boolean,false), nullif(payload->>'price_paid','')::numeric, coalesce(payload->>'currency_code','EUR'), coalesce(nullif(payload->>'tried_at','')::date,current_date), 'private')
  on conflict(user_id, product_id) do update set rating=excluded.rating, review_text=excluded.review_text, is_favorite=excluded.is_favorite, price_paid=excluded.price_paid, currency_code=excluded.currency_code, tried_at=excluded.tried_at returning id into eid;
  delete from public.entry_categories where entry_categories.entry_id = eid;
  for category_value in select jsonb_array_elements_text(coalesce(payload->'category_ids','[]'::jsonb)) loop
    insert into public.entry_categories(entry_id, category_id, user_id)
    select eid, category_value::uuid, uid from public.categories where id=category_value::uuid and user_id=uid;
    if not found then raise exception 'Categoría no válida'; end if;
  end loop;
  return query select pid, eid;
end $$;

revoke all on function public.save_product_with_entry(jsonb) from public;
grant execute on function public.save_product_with_entry(jsonb) to authenticated;

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types) values
  ('avatars','avatars',true,5242880,array['image/jpeg','image/png','image/webp']),
  ('establishment-images','establishment-images',true,10485760,array['image/jpeg','image/png','image/webp']),
  ('product-images','product-images',true,10485760,array['image/jpeg','image/png','image/webp']),
  ('category-images','category-images',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=excluded.public, file_size_limit=excluded.file_size_limit, allowed_mime_types=excluded.allowed_mime_types;

do $$ begin
  if not exists(select 1 from pg_policies where schemaname='public' and tablename='establishment_images' and policyname='establishment_images_read') then
    create policy establishment_images_read on public.establishment_images for select to authenticated using(true);
  end if;
  if not exists(select 1 from pg_policies where schemaname='public' and tablename='establishment_images' and policyname='establishment_images_insert') then
    create policy establishment_images_insert on public.establishment_images for insert to authenticated with check(uploaded_by=auth.uid() and exists(select 1 from public.establishments where id=establishment_id and created_by=auth.uid()));
  end if;
  if not exists(select 1 from pg_policies where schemaname='public' and tablename='product_images' and policyname='product_images_read') then
    create policy product_images_read on public.product_images for select to authenticated using(true);
  end if;
  if not exists(select 1 from pg_policies where schemaname='public' and tablename='product_images' and policyname='product_images_insert') then
    create policy product_images_insert on public.product_images for insert to authenticated with check(uploaded_by=auth.uid() and exists(select 1 from public.products where id=product_id and created_by=auth.uid()));
  end if;
  if not exists(select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='storage_public_read') then
    create policy storage_public_read on storage.objects for select using(bucket_id in('avatars','establishment-images','product-images','category-images'));
  end if;
  if not exists(select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='storage_owner_insert') then
    create policy storage_owner_insert on storage.objects for insert to authenticated with check(bucket_id in('avatars','establishment-images','product-images','category-images') and (storage.foldername(name))[1]=auth.uid()::text);
  end if;
  if not exists(select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='storage_owner_delete') then
    create policy storage_owner_delete on storage.objects for delete to authenticated using(bucket_id in('avatars','establishment-images','product-images','category-images') and (storage.foldername(name))[1]=auth.uid()::text);
  end if;
end $$;

notify pgrst, 'reload schema';
