import { createClient } from '@supabase/supabase-js';

// Configuración específica para el servidor
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('🚫 Variables de entorno de Supabase no configuradas');
}

// Cliente de Supabase optimizado para el servidor
export const supabaseServer = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
