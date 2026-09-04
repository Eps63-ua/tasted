import { isSupabaseMode } from '@/lib/env';import type { AppDataRepository } from './app-data.repository';import { LocalAppDataRepository } from './local-app-data.repository';import { SupabaseAppDataRepository } from './supabase-app-data.repository';
export const appDataRepository:AppDataRepository=isSupabaseMode?new SupabaseAppDataRepository():new LocalAppDataRepository();
export { isSupabaseMode } from '@/lib/env';
