/**
 * Validación simple de API Keys
 * Esta función valida una API key contra una lista de keys válidas predefinidas
 * @param {string} apiKey - La API key a validar
 * @returns {object} Resultado de la validación
 */
export function validateApiKey(apiKey) {
  // Lista de API keys válidas
  const validApiKeys = [
    {
      id: '9eb31e6b-ad41-4648-a5ec-f68bba47be9b',
      name: 'prueba',
      description: 'api',
      key: 'mjxXj9cGUR10eVe0-1sfBUnoe-SPsGeJrJ-PSa2UXEc-fseAcmBb7pIVMNY23SkYms5k',
      created_at: '2025-04-07T06:58:21.926306+00:00',
      updated_at: '2025-04-07T06:59:29.343+00:00',
      is_active: true
    }
    // Puedes agregar más API keys válidas aquí
  ];

  // Validar que se proporcionó una API key
  if (!apiKey) {
    return {
      isValid: false,
      error: 'API Key es requerida',
      timestamp: new Date().toISOString()
    };
  }

  // Buscar la API key en la lista de keys válidas
  const apiKeyData = validApiKeys.find(k => k.key === apiKey && k.is_active);

  // Si no se encontró la API key o no está activa
  if (!apiKeyData) {
    return {
      isValid: false,
      error: 'API Key inválida o inactiva',
      timestamp: new Date().toISOString()
    };
  }

  // API key válida
  return {
    isValid: true,
    data: apiKeyData,
    timestamp: new Date().toISOString()
  };
} 