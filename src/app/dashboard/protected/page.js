'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/shared/hooks/useNotification';
import { apiKeysService } from '@/services/supabase/apiKeys';

export default function Protected() {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(true);
  const [apiKeyDetails, setApiKeyDetails] = useState(null);

  useEffect(() => {
    const validateAccess = async () => {
      const storedApiKey = document.cookie
        .split('; ')
        .find(row => row.startsWith('apiKey='))
        ?.split('=')[1];
      
      if (!storedApiKey) {
        showNotification({
          message: 'Acceso denegado. API Key no encontrada.',
          type: 'error'
        });
        router.push('/dashboard/playground');
        return;
      }

      try {
        const { isValid, data } = await apiKeysService.validateKey(storedApiKey);
        
        if (!isValid) {
          showNotification({
            message: 'API Key inválida. Acceso denegado.',
            type: 'error'
          });
          router.push('/dashboard/playground');
          return;
        }

        setApiKeyDetails(data);
      } catch (error) {
        showNotification({
          message: 'Error al validar el acceso.',
          type: 'error'
        });
        router.push('/dashboard/playground');
      } finally {
        setIsLoading(false);
      }
    };

    validateAccess();
  }, [router, showNotification]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black p-8 flex items-center justify-center">
        <div className="flex items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          <span className="text-gray-400">Validando acceso...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
          <div className="relative bg-gray-900/40 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-6">
              Área Protegida
            </h1>
            <p className="text-gray-300 mb-8">
              ¡Bienvenido! Has accedido correctamente con una API Key válida.
            </p>
            
            <div className="space-y-6">
              <div className="bg-black/40 rounded-xl p-6 border border-gray-700/30">
                <h2 className="text-xl font-semibold text-indigo-400 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Detalles de Acceso
                </h2>
                <div className="space-y-4">
                  <div className="bg-black/60 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-gray-300">
                      {JSON.stringify({
                        status: 'authenticated',
                        access_level: 'full',
                        timestamp: new Date().toISOString(),
                        permissions: ['read', 'write', 'execute'],
                        key_details: apiKeyDetails
                      }, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 rounded-xl p-6 border border-gray-700/30">
                <h2 className="text-xl font-semibold text-indigo-400 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Acciones Disponibles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-300 hover:bg-indigo-500/20 transition-all duration-200">
                    Ejecutar Prueba
                  </button>
                  <button className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-300 hover:bg-purple-500/20 transition-all duration-200">
                    Ver Documentación
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
