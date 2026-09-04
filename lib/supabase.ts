import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

import { env, isSupabaseMode, requireSupabaseEnv } from '@/lib/env';
import type { Database } from '@/types/database.generated';

const config = isSupabaseMode ? requireSupabaseEnv() : { url: env.supabaseUrl ?? 'https://localhost.invalid', key: env.supabasePublishableKey ?? 'local-mode' };
export const supabase = createClient<Database>(config.url, config.key, {
  auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
});
