import { seedData } from '@/data/seed';
import { categoryDescendants, filterProducts, type ProductFilters } from '@/lib/search';
const defaults: ProductFilters = { query: '', establishmentIds: [], categoryIds: [], minimumRating: 0, favoritesOnly: false, sort: 'recent' };
describe('categoryDescendants', () => { it('incluye toda la rama', () => expect(categoryDescendants(seedData.categories, 'cat-asian')).toEqual(['cat-asian', 'cat-gyoza', 'cat-chicken-gyoza'])); });
describe('filterProducts', () => {
  it('busca en la crítica y el establecimiento', () => { expect(filterProducts(seedData, { ...defaults, query: 'cena rápida' }).map((p) => p.id)).toEqual(['prod-gyoza']); expect(filterProducts(seedData, { ...defaults, query: 'mercadona' })).toHaveLength(2); });
  it('combina filtros con AND', () => expect(filterProducts(seedData, { ...defaults, establishmentIds: ['est-mercadona'], favoritesOnly: true, minimumRating: 4 }).map((p) => p.id)).toEqual(['prod-cheese']));
  it('incluye descendientes', () => expect(filterProducts(seedData, { ...defaults, categoryIds: ['cat-asian'] }).map((p) => p.id)).toEqual(['prod-gyoza']));
  it('usa AND entre categorías', () => { expect(filterProducts(seedData, { ...defaults, categoryIds: ['cat-asian', 'cat-chicken-gyoza'] }).map((p) => p.id)).toEqual(['prod-gyoza']); expect(filterProducts(seedData, { ...defaults, categoryIds: ['cat-asian', 'cat-cheese'] })).toEqual([]); });
  it('ordena por valoración', () => expect(filterProducts(seedData, { ...defaults, sort: 'rating' })[0].id).toBe('prod-gelato'));
});
