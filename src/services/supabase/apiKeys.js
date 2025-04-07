import { supabase } from '@/lib/supabase';

// Constantes de validación
const API_KEY_REGEX = /^dk_[a-zA-Z0-9]{32}$/;
const MAX_REQUESTS_PER_MINUTE = 60;
const requestCounts = new Map();

// Función para validar el formato de la API Key
function isValidApiKeyFormat(apiKey) {
  return API_KEY_REGEX.test(apiKey);
}

// Rate limiting simple
function checkRateLimit(apiKey) {
  const now = Date.now();
  const minute = Math.floor(now / 60000);
  const key = `${apiKey}:${minute}`;
  
  const count = requestCounts.get(key) || 0;
  if (count >= MAX_REQUESTS_PER_MINUTE) {
    return false;
  }
  
  requestCounts.set(key, count + 1);
  // Limpiar entradas antiguas cada minuto
  setTimeout(() => requestCounts.delete(key), 60000);
  return true;
}

export const apiKeysService = {
  async fetchAll() {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(keyData) {
    const { data, error } = await supabase
      .from('api_keys')
      .insert([keyData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, keyData) {
    const { data, error } = await supabase
      .from('api_keys')
      .update({
        ...keyData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  async regenerateKey(id, newKey) {
    const { data, error } = await supabase
      .from('api_keys')
      .update({ 
        key: newKey,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async validateKey(apiKey) {
    try {
      // Validar inicialización de Supabase
      if (!supabase) {
        console.error('Error de validación: Cliente Supabase no inicializado');
        return { 
          isValid: false, 
          error: 'Error de configuración del servidor',
          timestamp: new Date().toISOString()
        };
      }

      // Validar formato de API Key
      if (!isValidApiKeyFormat(apiKey)) {
        console.warn('API Key con formato inválido:', apiKey);
        return { 
          isValid: false, 
          error: 'Formato de API Key inválido',
          timestamp: new Date().toISOString()
        };
      }

      // Verificar rate limit
      if (!checkRateLimit(apiKey)) {
        console.warn('Rate limit excedido para API Key:', apiKey);
        return {
          isValid: false,
          error: 'Demasiadas solicitudes. Por favor, intenta más tarde.',
          timestamp: new Date().toISOString()
        };
      }

      const start = Date.now();
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('key', apiKey)
        .eq('is_active', true)
        .single();
      const duration = Date.now() - start;

      if (error) {
        console.error('Error de Supabase:', {
          error,
          duration,
          timestamp: new Date().toISOString()
        });
        return { 
          isValid: false, 
          error: 'Error al validar la API Key',
          timestamp: new Date().toISOString()
        };
      }

      if (!data) {
        console.warn('API Key no encontrada:', apiKey);
        return { 
          isValid: false, 
          error: 'API Key no encontrada o inactiva',
          timestamp: new Date().toISOString()
        };
      }

      console.log('API Key validada exitosamente:', {
        keyId: data.id,
        duration,
        timestamp: new Date().toISOString()
      });

      return { 
        isValid: true, 
        data: {
          id: data.id,
          name: data.name,
          is_active: data.is_active,
          created_at: data.created_at,
          updated_at: data.updated_at
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error inesperado en validación:', {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      return { 
        isValid: false, 
        error: 'Error interno del servidor',
        timestamp: new Date().toISOString()
      };
    }
  }
}; 