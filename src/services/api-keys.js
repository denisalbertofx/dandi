import { createClient } from '@supabase/supabase-js';

// Configuración específica para el servidor
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zknrpqrxiqmgsxfhjjtx.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprbnJwcXJ4aXFtZ3N4ZmhqanR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI0NDgyMzMsImV4cCI6MjAyODAyNDIzM30.YL4NuCzs5D-DTOhT-9N4yQbXxkEQFIvWMTe5PMwEMWQ';

// Cliente de Supabase optimizado para el servidor
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export const apiKeysService = {
  async validateKey(apiKey) {
    try {
      console.log('🔍 Validando API key en Supabase:', apiKey);
      
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('key', apiKey)
        .eq('is_active', true)
        .single();

      if (error) {
        console.log('⚠️ Error al validar API key:', error.message);
        return { isValid: false, error: error.message };
      }

      if (!data) {
        console.log('⚠️ API key no encontrada o inactiva');
        return { isValid: false, error: 'API key no encontrada o inactiva' };
      }

      console.log('✅ API key válida encontrada:', {
        id: data.id,
        name: data.name,
        isActive: data.is_active
      });

      return { isValid: true, data };
    } catch (error) {
      console.error('💥 Error inesperado:', error);
      return { isValid: false, error: error.message };
    }
  }
}; 