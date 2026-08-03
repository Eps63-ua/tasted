import AsyncStorage from '@react-native-async-storage/async-storage';

import { seedData } from '@/data/seed';
import type { AppData } from '@/types/domain';
import type { AppDataRepository } from './app-data.repository';

const STORAGE_KEY = '@tasted/app-data/v1';
const cloneSeed = (): AppData => JSON.parse(JSON.stringify(seedData)) as AppData;

export class LocalAppDataRepository implements AppDataRepository {
  async load() { const value = await AsyncStorage.getItem(STORAGE_KEY); return value ? JSON.parse(value) as AppData : null; }
  async save(data: AppData) { await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
  async reset() { const data = cloneSeed(); await this.save(data); return data; }
}
