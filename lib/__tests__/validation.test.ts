import { establishmentSchema, productSchema } from '@/lib/validation';
const valid = { name: 'Queso', brand: '', description: '', establishmentId: 'est-1', rating: 4.5, reviewText: '', price: '2.50', triedAt: '2026-09-04', isFavorite: false, images: [], categoryIds: [] };
describe('productSchema', () => {
  test.each([0.5, 1, 2.5, 4.5, 5])('acepta %s estrellas', (rating) => expect(productSchema.safeParse({ ...valid, rating }).success).toBe(true));
  test.each([0, 0.7, 5.1])('rechaza %s estrellas', (rating) => expect(productSchema.safeParse({ ...valid, rating }).success).toBe(false));
  it('rechaza precio negativo y nombre vacío', () => expect(productSchema.safeParse({ ...valid, name: ' ', price: '-1' }).success).toBe(false));
  it('rechaza una fecha mal formada', () => expect(productSchema.safeParse({ ...valid, triedAt: '04/09/2026' }).success).toBe(false));
});
describe('establishmentSchema', () => {
  const base = { name: 'Café', type: 'cafe', locationText: '', description: '', images: [] } as const;
  it('valida el protocolo web', () => { expect(establishmentSchema.safeParse({ ...base, website: 'https://example.com' }).success).toBe(true); expect(establishmentSchema.safeParse({ ...base, website: 'example.com' }).success).toBe(false); });
});
