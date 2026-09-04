-- The function returns columns named product_id and entry_id. PostgreSQL also sees
-- columns with those names inside the statements below, so prefer table columns
-- whenever a name could refer to either one.

create or replace function public.save_product_with_entry(payload jsonb)
returns table(product_id uuid, entry_id uuid)
language plpgsql security definer set search_path = '' as $$
#variable_conflict use_column
declare
  uid uuid := auth.uid();
  pid uuid;
  eid uuid;
  category_value text;
begin
  if uid is null then raise exception 'Autenticación requerida'; end if;
  if (payload->>'rating')::numeric not between 0.5 and 5
    or mod((payload->>'rating')::numeric * 2, 1) <> 0
  then raise exception 'Valoración inválida'; end if;

  if not exists(
    select 1 from public.establishments establishment
    where establishment.id = (payload->>'establishment_id')::uuid
  ) then raise exception 'Establecimiento no válido'; end if;

  pid := nullif(payload->>'id','')::uuid;
  if pid is null then
    select product.id into pid
    from public.products product
    where product.establishment_id = (payload->>'establishment_id')::uuid
      and product.normalized_name = payload->>'normalized_name'
      and coalesce(product.normalized_brand,'') = coalesce(payload->>'normalized_brand','')
    limit 1;
  end if;

  if pid is null then
    insert into public.products(
      created_by, establishment_id, name, normalized_name,
      brand, normalized_brand, description
    ) values(
      uid, (payload->>'establishment_id')::uuid, payload->>'name',
      payload->>'normalized_name', nullif(payload->>'brand',''),
      nullif(payload->>'normalized_brand',''), nullif(payload->>'description','')
    ) returning products.id into pid;
  elsif payload->>'id' is not null and exists(
    select 1 from public.products product
    where product.id = pid and product.created_by = uid
  ) then
    update public.products product set
      establishment_id=(payload->>'establishment_id')::uuid,
      name=payload->>'name', normalized_name=payload->>'normalized_name',
      brand=nullif(payload->>'brand',''),
      normalized_brand=nullif(payload->>'normalized_brand',''),
      description=nullif(payload->>'description','')
    where product.id=pid and product.created_by=uid;
  end if;

  insert into public.user_product_entries(
    user_id, product_id, rating, review_text, is_favorite,
    price_paid, currency_code, tried_at, visibility
  ) values(
    uid, pid, (payload->>'rating')::numeric,
    nullif(payload->>'review_text',''),
    coalesce((payload->>'is_favorite')::boolean,false),
    nullif(payload->>'price_paid','')::numeric,
    coalesce(payload->>'currency_code','EUR'),
    coalesce(nullif(payload->>'tried_at','')::date,current_date),
    'private'
  )
  on conflict(user_id, product_id) do update set
    rating=excluded.rating,
    review_text=excluded.review_text,
    is_favorite=excluded.is_favorite,
    price_paid=excluded.price_paid,
    currency_code=excluded.currency_code,
    tried_at=excluded.tried_at
  returning user_product_entries.id into eid;

  delete from public.entry_categories link where link.entry_id = eid;
  for category_value in
    select jsonb_array_elements_text(coalesce(payload->'category_ids','[]'::jsonb))
  loop
    insert into public.entry_categories(entry_id, category_id, user_id)
    select eid, category_value::uuid, uid
    from public.categories category
    where category.id=category_value::uuid and category.user_id=uid;
    if not found then raise exception 'Categoría no válida'; end if;
  end loop;

  return query select pid, eid;
end $$;

revoke all on function public.save_product_with_entry(jsonb) from public;
grant execute on function public.save_product_with_entry(jsonb) to authenticated;

notify pgrst, 'reload schema';
