import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// Client for public operations (inserting applications)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client for admin operations (bypasses RLS)
export const getAdminSupabase = () => {
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;
  if (!supabaseSecretKey) throw new Error("Missing SUPABASE_SECRET_KEY");
  return createClient(supabaseUrl, supabaseSecretKey);
};
