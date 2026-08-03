import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { appDataRepository } from '@/repositories';
import { AppData, CategoryDraft, EstablishmentDraft, LOCAL_USER_ID, ProductDraft, ProfileDraft } from '@/types/domain';

type State = { data?: AppData; loading: boolean; error?: string };
type Api = State & { saveProduct(draft: ProductDraft): Promise<string>; saveEstablishment(draft: EstablishmentDraft): Promise<string>; saveCategory(draft: CategoryDraft): Promise<string>; saveProfile(draft: ProfileDraft): Promise<void>; deleteProduct(id: string): Promise<void>; deleteEstablishment(id: string): Promise<void>; deleteCategory(id: string): Promise<void>; reset(): Promise<void>; retry(): Promise<void> };
const Context = createContext<Api | null>(null);
const id = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export function AppDataProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<State>({ loading: true });
  const load = useCallback(async () => { try { setState(s => ({ ...s, loading: true, error: undefined })); const stored = await appDataRepository.load(); const data = stored ?? await appDataRepository.reset(); setState({ data, loading: false }); } catch { setState({ loading: false, error: 'No se pudieron cargar tus datos.' }); } }, []);
  useEffect(() => { void load(); }, [load]);
  const commit = useCallback(async (update: (current: AppData) => AppData) => { if (!state.data) throw new Error('Datos no disponibles'); const next = update(state.data); await appDataRepository.save(next); setState({ data: next, loading: false }); }, [state.data]);

  const saveProduct = useCallback(async (draft: ProductDraft) => {
    let result = draft.id ?? '';
    await commit(current => {
      const now = new Date().toISOString();
      const exact = current.products.find(p => p.establishmentId === draft.establishmentId && p.name.trim().toLowerCase() === draft.name.trim().toLowerCase() && (p.brand ?? '').trim().toLowerCase() === (draft.brand ?? '').trim().toLowerCase());
      const productId = draft.id ?? exact?.id ?? id('product'); result = productId;
      const old = current.products.find(p => p.id === productId);
      const product = { id: productId, createdBy: LOCAL_USER_ID, establishmentId: draft.establishmentId, name: draft.name.trim(), brand: draft.brand?.trim(), description: draft.description?.trim(), images: draft.images, coverImageUri: draft.coverImageUri ?? draft.images[0], createdAt: old?.createdAt ?? now, updatedAt: now };
      const products = old ? current.products.map(p => p.id === productId ? product : p) : exact ? current.products : [...current.products, product];
      const oldEntry = current.entries.find(e => e.productId === productId && e.userId === LOCAL_USER_ID); const entryId = oldEntry?.id ?? id('entry');
      const entry = { id: entryId, userId: LOCAL_USER_ID, productId, rating: draft.rating, reviewText: draft.reviewText?.trim(), isFavorite: draft.isFavorite, pricePaid: draft.pricePaid, currencyCode: 'EUR', triedAt: draft.triedAt, visibility: 'private' as const, createdAt: oldEntry?.createdAt ?? now, updatedAt: now };
      return { ...current, products, entries: oldEntry ? current.entries.map(e => e.id === entryId ? entry : e) : [...current.entries, entry], entryCategories: [...current.entryCategories.filter(link => link.entryId !== entryId), ...draft.categoryIds.map(categoryId => ({ entryId, categoryId, userId: LOCAL_USER_ID }))] };
    }); return result;
  }, [commit]);
  const saveEstablishment = useCallback(async (draft: EstablishmentDraft) => { const result = draft.id ?? id('est'); await commit(c => { const now = new Date().toISOString(); const old = c.establishments.find(x => x.id === result); const value = { ...draft, id: result, createdBy: LOCAL_USER_ID, createdAt: old?.createdAt ?? now, updatedAt: now }; return { ...c, establishments: old ? c.establishments.map(x => x.id === result ? value : x) : [...c.establishments, value] }; }); return result; }, [commit]);
  const saveCategory = useCallback(async (draft: CategoryDraft) => { const result = draft.id ?? id('cat'); await commit(c => { const now = new Date().toISOString(); const old = c.categories.find(x => x.id === result); const value = { ...draft, id: result, userId: LOCAL_USER_ID, createdAt: old?.createdAt ?? now, updatedAt: now }; return { ...c, categories: old ? c.categories.map(x => x.id === result ? value : x) : [...c.categories, value] }; }); return result; }, [commit]);
  const saveProfile = useCallback(async (draft: ProfileDraft) => commit(c => ({ ...c, profile: { ...c.profile, ...draft, updatedAt: new Date().toISOString() } })), [commit]);
  const deleteProduct = useCallback(async (productId: string) => commit(c => { const ids = c.entries.filter(e => e.productId === productId && e.userId === LOCAL_USER_ID).map(e => e.id); return { ...c, products: c.products.filter(p => p.id !== productId), entries: c.entries.filter(e => !ids.includes(e.id)), entryCategories: c.entryCategories.filter(x => !ids.includes(x.entryId)) }; }), [commit]);
  const deleteEstablishment = useCallback(async (establishmentId: string) => commit(c => { if (c.products.some(p => p.establishmentId === establishmentId)) throw new Error('Este establecimiento todavía tiene productos.'); return { ...c, establishments: c.establishments.filter(e => e.id !== establishmentId) }; }), [commit]);
  const deleteCategory = useCallback(async (categoryId: string) => commit(c => { if (c.categories.some(x => x.parentId === categoryId)) throw new Error('Esta categoría tiene subcategorías.'); return { ...c, categories: c.categories.filter(x => x.id !== categoryId), entryCategories: c.entryCategories.filter(x => x.categoryId !== categoryId) }; }), [commit]);
  const reset = useCallback(async () => setState({ data: await appDataRepository.reset(), loading: false }), []);
  const value = useMemo<Api>(() => ({ ...state, saveProduct, saveEstablishment, saveCategory, saveProfile, deleteProduct, deleteEstablishment, deleteCategory, reset, retry: load }), [state, saveProduct, saveEstablishment, saveCategory, saveProfile, deleteProduct, deleteEstablishment, deleteCategory, reset, load]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useAppData() { const value = useContext(Context); if (!value) throw new Error('useAppData requiere AppDataProvider'); return value; }
