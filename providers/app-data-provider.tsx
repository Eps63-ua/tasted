import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, type PropsWithChildren, useContext, useMemo } from 'react';

import { appDataRepository, isSupabaseMode } from '@/repositories';
import type { AppData, CategoryDraft, EstablishmentDraft, ProductDraft, ProfileDraft } from '@/types/domain';
import { LOCAL_USER_ID } from '@/types/domain';
import { useAuth } from './auth-provider';

type Api = {
  data?: AppData; loading: boolean; error?: string; isSupabase: boolean;
  saveProduct(draft: ProductDraft): Promise<string>;
  saveEstablishment(draft: EstablishmentDraft): Promise<string>;
  saveCategory(draft: CategoryDraft): Promise<string>;
  saveProfile(draft: ProfileDraft): Promise<void>;
  toggleFavorite(productId: string, isFavorite: boolean): Promise<void>;
  deleteProduct(id: string): Promise<void>;
  deleteEstablishment(id: string): Promise<void>;
  deleteCategory(id: string): Promise<void>;
  reset(): Promise<void>; retry(): Promise<void>;
};

const Context = createContext<Api | null>(null);

export function AppDataProvider({ children }: PropsWithChildren) {
  const auth = useAuth();
  const client = useQueryClient();
  const userId = isSupabaseMode ? auth.user?.id : LOCAL_USER_ID;
  const email = isSupabaseMode ? auth.user?.email : 'esther@example.com';
  const key = ['app-data', isSupabaseMode ? 'supabase' : 'local', userId];
  const invalidate = async () => { await client.invalidateQueries({ queryKey: key }); };
  const query = useQuery({ queryKey: key, queryFn: () => appDataRepository.load(userId!, email), enabled: Boolean(userId), retry: isSupabaseMode ? 2 : 1 });
  const product = useMutation({ mutationFn: (draft: ProductDraft) => appDataRepository.saveProduct(userId!, draft), onSuccess: invalidate });
  const establishment = useMutation({ mutationFn: (draft: EstablishmentDraft) => appDataRepository.saveEstablishment(userId!, draft), onSuccess: invalidate });
  const category = useMutation({ mutationFn: (draft: CategoryDraft) => appDataRepository.saveCategory(userId!, draft), onSuccess: invalidate });
  const profile = useMutation({ mutationFn: (draft: ProfileDraft) => appDataRepository.saveProfile(userId!, draft), onSuccess: invalidate });
  const favorite = useMutation({ mutationFn: ({ productId, isFavorite }: { productId: string; isFavorite: boolean }) => appDataRepository.toggleFavorite(userId!, productId, isFavorite), onSuccess: invalidate });
  const removeProduct = useMutation({ mutationFn: (id: string) => appDataRepository.deleteProduct(userId!, id), onSuccess: invalidate });
  const removeEstablishment = useMutation({ mutationFn: (id: string) => appDataRepository.deleteEstablishment(userId!, id), onSuccess: invalidate });
  const removeCategory = useMutation({ mutationFn: (id: string) => appDataRepository.deleteCategory(userId!, id), onSuccess: invalidate });

  const value = useMemo<Api>(() => ({
    data: query.data,
    loading: query.isLoading || (!userId && auth.status === 'loading'),
    error: query.error instanceof Error ? query.error.message : query.error ? 'No se pudieron cargar tus datos.' : undefined,
    isSupabase: isSupabaseMode,
    saveProduct: (draft) => product.mutateAsync(draft),
    saveEstablishment: (draft) => establishment.mutateAsync(draft),
    saveCategory: (draft) => category.mutateAsync(draft),
    saveProfile: (draft) => profile.mutateAsync(draft),
    toggleFavorite: (productId, isFavorite) => favorite.mutateAsync({ productId, isFavorite }),
    deleteProduct: (id) => removeProduct.mutateAsync(id),
    deleteEstablishment: (id) => removeEstablishment.mutateAsync(id),
    deleteCategory: (id) => removeCategory.mutateAsync(id),
    reset: async () => { if (isSupabaseMode || !appDataRepository.reset) throw new Error('La restauración demo solo está disponible en modo local.'); await appDataRepository.reset(); await invalidate(); },
    retry: async () => { await query.refetch(); },
  }), [query.data, query.isLoading, query.error, userId, auth.status, product, establishment, category, profile, favorite, removeProduct, removeEstablishment, removeCategory]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useAppData() { const value = useContext(Context); if (!value) throw new Error('useAppData requiere AppDataProvider'); return value; }
