import { mapCategory, mapEntry, mapEntryCategory, mapEstablishment, mapProduct, mapProfile, normalize } from '@/repositories/supabase-mappers';

jest.mock('@/services/storage.service', () => ({ storageService: { publicUrl: (bucket: string, path: string) => `https://storage.test/${bucket}/${path}` } }));

const stamp = { created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-02T00:00:00Z' };

describe('mapeadores de Supabase', () => {
  it('normaliza mayúsculas, espacios y acentos', () => expect(normalize('  Helado de Pistáchó ')).toBe('helado de pistacho'));
  it('mapea perfil y rutas de avatar', () => expect(mapProfile({ ...stamp, id: 'u1', username: 'ana', display_name: 'Ana', avatar_path: null, bio: null }, 'ana@example.com')).toMatchObject({ id: 'u1', email: 'ana@example.com', avatarUri: undefined }));
  it('mapea establecimiento y producto', () => {
    const establishment = mapEstablishment({ ...stamp, id: 'e1', created_by: 'u1', name: 'Café', normalized_name: 'cafe', type: 'cafe', description: null, location_text: null, city: null, country_code: null, website: null }, []);
    const product = mapProduct({ ...stamp, id: 'p1', created_by: 'u1', establishment_id: 'e1', name: 'Tarta', normalized_name: 'tarta', brand: null, normalized_brand: null, description: null }, []);
    expect(establishment).toMatchObject({ id: 'e1', type: 'cafe', images: [] });
    expect(product).toMatchObject({ id: 'p1', establishmentId: 'e1', images: [] });
  });
  it('convierte números y nombres snake_case de la entrada', () => expect(mapEntry({ ...stamp, id: 'd1', user_id: 'u1', product_id: 'p1', rating: 4.5, review_text: null, is_favorite: true, price_paid: 2.5, currency_code: 'EUR', tried_at: '2026-01-01', visibility: 'private' })).toMatchObject({ productId: 'p1', rating: 4.5, isFavorite: true, pricePaid: 2.5 }));
  it('mapea categorías y relaciones', () => {
    expect(mapCategory({ ...stamp, id: 'c1', user_id: 'u1', parent_id: null, name: 'Dulces', normalized_name: 'dulces', description: null, image_path: null })).toMatchObject({ id: 'c1', parentId: undefined });
    expect(mapEntryCategory({ entry_id: 'd1', category_id: 'c1', user_id: 'u1', created_at: stamp.created_at })).toEqual({ entryId: 'd1', categoryId: 'c1', userId: 'u1' });
  });
});
