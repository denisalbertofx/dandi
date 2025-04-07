'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/shared/hooks/useNotification';
import { apiKeysService } from '@/services/supabase/apiKeys';

export default function Playground() {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { isValid, error } = await apiKeysService.validateKey(apiKey);

      if (isValid) {
        showNotification({
          message: 'API Key válida. Acceso a /protected concedido.',
          type: 'success',
        });
        // Guardar en cookie en lugar de sessionStorage
        document.cookie = `apiKey=${apiKey}; path=/`;
        router.push('/dashboard/protected');
      } else {
        showNotification({
          message: error || 'API Key inválida. Acceso denegado.',
          type: 'error',
        });
      }
    } catch (error) {
      showNotification({
        message: 'Error al validar la API Key.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
            API Playground
          </h1>
          <p className="text-gray-400">
            Ingresa tu API Key para acceder a las funcionalidades protegidas
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
            <div className="relative bg-gray-900/40 backdrop-blur-xl border border-gray-700/30 rounded-lg p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                API Key
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-4 py-3 bg-black/40 border border-gray-700/30 rounded-lg 
                         text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 
                         focus:ring-indigo-500/40 focus:border-transparent transition-all duration-200"
                placeholder="Ingresa tu API Key aquí"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 
                     hover:from-indigo-600 hover:to-purple-600 text-white font-medium 
                     py-3 px-6 rounded-lg transition-all duration-200 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Validando...</span>
              </>
            ) : (
              'Validar API Key'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
