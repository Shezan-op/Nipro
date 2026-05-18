import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Generic client for browser or basic usage
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to get client with correct auth context
export async function getSupabaseClient() {
  if (typeof window !== 'undefined') {
    return supabase; // In browser, use the singleton which handles session automatically
  }

  // Server side (Server Actions or Server Components)
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const token = cookieStore.get('sb-access-token')?.value;

    if (token) {
      return createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });
    }
  } catch (e) {
    console.error('Error creating server Supabase client:', e);
  }

  return supabase; // Fallback to default client
}
