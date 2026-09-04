import type { AppData, Category, Product } from '@/types/domain';

export type ProductSort = 'recent' | 'alpha' | 'rating';
export interface ProductFilters { query: string; establishmentIds: string[]; categoryIds: string[]; minimumRating: number; favoritesOnly: boolean; sort: ProductSort }

export function categoryDescendants(categories: Category[], categoryId: string): string[] {
  const result: string[] = [], pending = [categoryId], visited = new Set<string>();
  while (pending.length) { const id = pending.shift()!; if (visited.has(id)) continue; visited.add(id); result.push(id); pending.push(...categories.filter((category) => category.parentId === id).map((category) => category.id)); }
  return result;
}

export function filterProducts(data: AppData, filters: ProductFilters): Product[] {
  const q = filters.query.trim().toLocaleLowerCase();
  const entries = new Map(data.entries.map((entry) => [entry.productId, entry]));
  const establishments = new Map(data.establishments.map((item) => [item.id, item]));
  const categories = new Map(data.categories.map((item) => [item.id, item]));
  const branches = new Map(filters.categoryIds.map((id) => [id, categoryDescendants(data.categories, id)]));
  const links = new Map<string, string[]>();
  for (const link of data.entryCategories) links.set(link.entryId, [...(links.get(link.entryId) ?? []), link.categoryId]);
  const result = data.products.filter((product) => {
    const entry = entries.get(product.id); if (!entry) return false;
    const assigned = links.get(entry.id) ?? [];
    const text = [product.name, product.brand, establishments.get(product.establishmentId)?.name, entry.reviewText, ...assigned.map((id) => categories.get(id)?.name)].filter(Boolean).join(' ').toLocaleLowerCase();
    return (!q || text.includes(q)) && (!filters.establishmentIds.length || filters.establishmentIds.includes(product.establishmentId))
      && filters.categoryIds.every((id) => assigned.some((categoryId) => branches.get(id)?.includes(categoryId)))
      && entry.rating >= filters.minimumRating && (!filters.favoritesOnly || entry.isFavorite);
  });
  return result.sort((left, right) => filters.sort === 'alpha' ? left.name.localeCompare(right.name) : filters.sort === 'rating'
    ? (entries.get(right.id)?.rating ?? 0) - (entries.get(left.id)?.rating ?? 0) : right.createdAt.localeCompare(left.createdAt));
}
