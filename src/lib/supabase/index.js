'use client';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error de configuración de Supabase:');
  console.error('- URL:', supabaseUrl ? 'Configurada' : 'Falta');
  console.error('- Anon Key:', supabaseAnonKey ? 'Configurada' : 'Falta');
  throw new Error('Configuración incompleta de Supabase. Verifica las variables de entorno.');
}

// Validar formato de URL
try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL no es una URL válida');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Función de ayuda para validar la conexión
export async function validateSupabaseConnection() {
  try {
    const start = Date.now();
    const { data, error } = await supabase.from('api_keys').select('count');
    const duration = Date.now() - start;
    
    if (error) {
      console.error('Error de conexión a Supabase:', {
        error,
        duration,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
    
    console.log('Conexión a Supabase establecida:', {
      duration,
      timestamp: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error crítico conectando con Supabase:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    return false;
  }
} 