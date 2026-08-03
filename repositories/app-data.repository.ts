import type { AppData } from '@/types/domain';

export interface AppDataRepository {
  load(): Promise<AppData | null>;
  save(data: AppData): Promise<void>;
  reset(): Promise<AppData>;
}
