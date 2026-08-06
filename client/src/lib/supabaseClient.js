import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export function createClerkSupabaseClient(getToken) {
  return createClient(supabaseUrl, supabasePublishableKey, {
    async accessToken() {
      return (await getToken()) ?? null;
    },
  });
}
