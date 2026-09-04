export type DataSource = 'local' | 'supabase';

const source = process.env.EXPO_PUBLIC_DATA_SOURCE ?? 'local';
if (source !== 'local' && source !== 'supabase') throw new Error('EXPO_PUBLIC_DATA_SOURCE debe ser "local" o "supabase".');

export const env = {
  dataSource: source as DataSource,
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
  supabasePublishableKey: process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
} as const;

export function requireSupabaseEnv() {
  if (!env.supabaseUrl || !env.supabasePublishableKey) {
    throw new Error('Faltan EXPO_PUBLIC_SUPABASE_URL o EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY en el archivo .env local.');
  }
  return { url: env.supabaseUrl, key: env.supabasePublishableKey };
}

export const isSupabaseMode = env.dataSource === 'supabase';
