import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Crea un cliente Supabase optimizado para el entorno del servidor
 * @returns {SupabaseClient} Cliente Supabase configurado
 */
export function createServerSupabaseClient(): SupabaseClient {
  // Obtener las variables de entorno
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Faltan las variables de entorno de Supabase');
  }

  // Crear y retornar el cliente
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

// Cliente Supabase singleton para uso en el servidor
let supabaseServerClient: SupabaseClient | null = null;

/**
 * Obtiene una instancia singleton del cliente Supabase para el servidor
 * @returns {SupabaseClient} Cliente Supabase
 */
export function getServerSupabaseClient(): SupabaseClient {
  if (!supabaseServerClient) {
    supabaseServerClient = createServerSupabaseClient();
  }
  return supabaseServerClient;
}
