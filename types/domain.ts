export type EstablishmentType = 'supermarket' | 'restaurant' | 'cafe' | 'ice_cream_shop' | 'bakery' | 'bar' | 'food_shop' | 'other';
export type EntryVisibility = 'private' | 'public';

export interface Profile { id: string; username: string; displayName: string; email: string; avatarUri?: string; bio?: string; createdAt: string; updatedAt: string }
export interface Establishment { id: string; createdBy: string; name: string; type: EstablishmentType; locationText?: string; website?: string; description?: string; coverImageUri?: string; images: string[]; createdAt: string; updatedAt: string }
export interface Product { id: string; createdBy: string; establishmentId: string; name: string; brand?: string; description?: string; coverImageUri?: string; images: string[]; createdAt: string; updatedAt: string }
export interface UserProductEntry { id: string; userId: string; productId: string; rating: number; reviewText?: string; isFavorite: boolean; pricePaid?: number; currencyCode: string; triedAt?: string; visibility: EntryVisibility; createdAt: string; updatedAt: string }
export interface Category { id: string; userId: string; parentId?: string; name: string; description?: string; imageUri?: string; createdAt: string; updatedAt: string }
export interface EntryCategory { entryId: string; categoryId: string; userId: string }

export interface AppData { profile: Profile; establishments: Establishment[]; products: Product[]; entries: UserProductEntry[]; categories: Category[]; entryCategories: EntryCategory[] }
export interface ProductDraft { id?: string; name: string; brand?: string; description?: string; establishmentId: string; images: string[]; coverImageUri?: string; rating: number; reviewText?: string; isFavorite: boolean; pricePaid?: number; triedAt?: string; categoryIds: string[] }
export type EstablishmentDraft = Omit<Establishment, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'> & { id?: string };
export type CategoryDraft = Omit<Category, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & { id?: string };
export type ProfileDraft = Pick<Profile, 'displayName' | 'username' | 'email' | 'bio' | 'avatarUri'>;

export const LOCAL_USER_ID = 'local-user';
