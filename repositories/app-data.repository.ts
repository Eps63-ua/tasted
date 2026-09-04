import type { AppData, CategoryDraft, EstablishmentDraft, ProductDraft, ProfileDraft } from '@/types/domain';

export interface AppDataRepository {
  load(userId: string, email?: string): Promise<AppData>;
  saveProduct(userId: string, draft: ProductDraft): Promise<string>;
  saveEstablishment(userId: string, draft: EstablishmentDraft): Promise<string>;
  saveCategory(userId: string, draft: CategoryDraft): Promise<string>;
  saveProfile(userId: string, draft: ProfileDraft): Promise<void>;
  deleteProduct(userId: string, id: string): Promise<void>;
  deleteEstablishment(userId: string, id: string): Promise<void>;
  deleteCategory(userId: string, id: string): Promise<void>;
  reset?(): Promise<AppData>;
}
