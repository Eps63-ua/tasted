export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
type T<Row, Insert = Partial<Row>, Update = Partial<Insert>> = { Row: Row; Insert: Insert; Update: Update; Relationships: [] };
type Stamp = { created_at: string; updated_at: string };
type ProfileRow = Stamp & { id:string; username:string; display_name:string; avatar_path:string|null; bio:string|null };
type EstablishmentRow = Stamp & { id:string; created_by:string; name:string; normalized_name:string; type:Database['public']['Enums']['establishment_type']; description:string|null; location_text:string|null; city:string|null; country_code:string|null; website:string|null };
type ProductRow = Stamp & { id:string; created_by:string; establishment_id:string; name:string; normalized_name:string; brand:string|null; normalized_brand:string|null; description:string|null };
type EntryRow = Stamp & { id:string; user_id:string; product_id:string; rating:number; review_text:string|null; is_favorite:boolean; price_paid:number|null; currency_code:string; tried_at:string|null; visibility:Database['public']['Enums']['entry_visibility'] };
type CategoryRow = Stamp & { id:string; user_id:string; parent_id:string|null; name:string; normalized_name:string; description:string|null; image_path:string|null };
type ImageRow = { id:string; storage_path:string; is_cover:boolean; position:number; uploaded_by:string; created_at:string };
export interface Database { public:{ Tables:{
  profiles:T<ProfileRow,Pick<ProfileRow,'id'|'username'|'display_name'> & Partial<ProfileRow>>;
  establishments:T<EstablishmentRow,Pick<EstablishmentRow,'created_by'|'name'|'normalized_name'|'type'> & Partial<EstablishmentRow>>;
  establishment_images:T<ImageRow & { establishment_id:string },Pick<ImageRow,'storage_path'|'uploaded_by'> & { establishment_id:string } & Partial<ImageRow>>;
  products:T<ProductRow,Pick<ProductRow,'created_by'|'establishment_id'|'name'|'normalized_name'> & Partial<ProductRow>>;
  product_images:T<ImageRow & { product_id:string },Pick<ImageRow,'storage_path'|'uploaded_by'> & { product_id:string } & Partial<ImageRow>>;
  user_product_entries:T<EntryRow,Pick<EntryRow,'user_id'|'product_id'|'rating'> & Partial<EntryRow>>;
  categories:T<CategoryRow,Pick<CategoryRow,'user_id'|'name'|'normalized_name'> & Partial<CategoryRow>>;
  entry_categories:T<{entry_id:string;category_id:string;user_id:string;created_at:string}, {entry_id:string;category_id:string;user_id:string;created_at?:string}>;
 }; Views:{ [_ in never]:never }; Functions:{
  save_product_with_entry:{ Args:{ payload:Json }; Returns:{ product_id:string; entry_id:string }[] };
  remove_product_from_diary:{ Args:{ target_product_id:string }; Returns:undefined };
  delete_product_if_unused:{ Args:{ target_product_id:string }; Returns:undefined };
  delete_establishment_if_empty:{ Args:{ target_establishment_id:string }; Returns:undefined };
  delete_category_safe:{ Args:{ target_category_id:string }; Returns:undefined };
  prepare_establishment_delete:{ Args:{ target_establishment_id:string }; Returns:string[] };
  prepare_category_delete:{ Args:{ target_category_id:string }; Returns:string[] };
 }; Enums:{ establishment_type:'supermarket'|'restaurant'|'cafe'|'ice_cream_shop'|'bakery'|'bar'|'food_shop'|'other'; entry_visibility:'private'|'public' }; CompositeTypes:{[_ in never]:never} } }
