import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Declaramos una variable fuera para guardar la instancia
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const getSupabase = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true, // Esto asegura que la sesión se guarde
        autoRefreshToken: true,
      }
    });
  }
  return supabaseInstance;
};

// Exportamos la instancia directamente para que sea fácil de usar
export const supabase = getSupabase();