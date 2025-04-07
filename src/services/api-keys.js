import { getServerSupabaseClient } from '@/lib/supabase/server';

export const apiKeysService = {
  async validateKey(apiKey) {
    try {
      console.log('🔍 Validando API key en Supabase:', apiKey);
      
      // Obtener el cliente Supabase centralizado
      const supabase = getServerSupabaseClient();
      
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