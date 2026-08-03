import type { Category, EntryCategory, Establishment, Product, Profile, UserProductEntry } from '@/types/domain';

export interface ProfileRepository { getProfile(): Promise<Profile>; saveProfile(profile: Profile): Promise<void> }
export interface EstablishmentRepository { listEstablishments(): Promise<Establishment[]>; saveEstablishment(value: Establishment): Promise<void>; deleteEstablishment(id: string): Promise<void> }
export interface ProductRepository { listProducts(): Promise<Product[]>; saveProduct(value: Product): Promise<void>; deleteProduct(id: string): Promise<void> }
export interface EntryRepository { listEntries(): Promise<UserProductEntry[]>; saveEntry(value: UserProductEntry): Promise<void>; deleteEntry(id: string): Promise<void> }
export interface CategoryRepository { listCategories(): Promise<Category[]>; saveCategory(value: Category): Promise<void>; deleteCategory(id: string): Promise<void> }
export interface EntryCategoryRepository { listEntryCategories(): Promise<EntryCategory[]>; replaceEntryCategories(entryId: string, values: EntryCategory[]): Promise<void> }
export interface ImageRepository { normalizeLocalUris(uris: string[]): Promise<string[]> }

export interface RepositoryContracts {
  profiles: ProfileRepository;
  establishments: EstablishmentRepository;
  products: ProductRepository;
  entries: EntryRepository;
  categories: CategoryRepository;
  entryCategories: EntryCategoryRepository;
  images: ImageRepository;
}
