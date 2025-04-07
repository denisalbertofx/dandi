import { useState, useCallback } from 'react';
import { useNotification } from '@/shared/hooks/useNotification';
import { apiKeysService } from '@/services/supabase/apiKeys';
import { generateApiKey } from '@/shared/utils/api-helpers';

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showNotification } = useNotification();

  const fetchApiKeys = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await apiKeysService.fetchAll();
      setApiKeys(data);
    } catch (error) {
      console.error('Error detallado:', error);
      showNotification({
        message: 'Error al cargar las API keys. Verifica tu conexión.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  const createApiKey = async (keyData) => {
    try {
      const newKey = {
        ...keyData,
        key: generateApiKey(),
        is_active: true
      };

      const data = await apiKeysService.create(newKey);
      setApiKeys(prev => [data, ...prev]);
      showNotification({
        message: '✨ Nueva API Key creada exitosamente',
        type: 'success'
      });
      return data;
    } catch (error) {
      showNotification({
        message: 'Error al crear la API key',
        type: 'error'
      });
      console.error('Error:', error);
      throw error;
    }
  };

  const updateApiKey = async (id, keyData) => {
    try {
      const data = await apiKeysService.update(id, keyData);
      setApiKeys(prev => prev.map(key => 
        key.id === data.id ? data : key
      ));
      showNotification({
        message: '🔄 API Key actualizada correctamente',
        type: 'success'
      });
      return data;
    } catch (error) {
      showNotification({
        message: 'Error al actualizar la API key',
        type: 'error'
      });
      console.error('Error:', error);
      throw error;
    }
  };

  const deleteApiKey = async (id) => {
    try {
      await apiKeysService.delete(id);
      setApiKeys(prev => prev.filter(key => key.id !== id));
      showNotification({
        message: '¡API Key eliminada permanentemente!',
        type: 'error',
        duration: 4000
      });
    } catch (error) {
      showNotification({
        message: 'Error al eliminar la API key',
        type: 'error'
      });
      console.error('Error:', error);
      throw error;
    }
  };

  const regenerateApiKey = async (id) => {
    try {
      const newKey = generateApiKey();
      const data = await apiKeysService.regenerateKey(id, newKey);
      setApiKeys(prev => prev.map(key => 
        key.id === data.id ? data : key
      ));
      showNotification({
        message: '🔑 API Key regenerada exitosamente',
        type: 'success'
      });
      return data;
    } catch (error) {
      showNotification({
        message: 'Error al regenerar la API key',
        type: 'error'
      });
      console.error('Error:', error);
      throw error;
    }
  };

  return {
    apiKeys,
    isLoading,
    fetchApiKeys,
    createApiKey,
    updateApiKey,
    deleteApiKey,
    regenerateApiKey
  };
} 