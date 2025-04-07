import fetch from 'node-fetch';

/**
 * Valida una API key usando el endpoint local o remoto
 * @param {string} apiKey - La API key a validar
 * @param {boolean} useLocal - Si es true, usa el endpoint local, si es false usa el endpoint remoto
 * @returns {Promise<{isValid: boolean, data?: object, error?: string}>}
 */
async function validateApiKey(apiKey, useLocal = true) {
  const localUrl = 'http://localhost:3000/api/validate-key-simple';
  const remoteUrl = 'https://dandi-r9ji1nqun-denis-projects-2bbb460d.vercel.app/api/validate-key-simple';
  
  const url = useLocal ? localUrl : remoteUrl;

  try {
    console.log('🔍 Validando API key...');
    console.log('URL:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ apiKey })
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        isValid: false,
        error: data.error || 'Error al validar la API key'
      };
    }

    return data;
  } catch (error) {
    return {
      isValid: false,
      error: error.message
    };
  }
}

// Ejemplo de uso
const apiKey = 'mjxXj9cGUR10eVe0-1sfBUnoe-SPsGeJrJ-PSa2UXEc-fseAcmBb7pIVMNY23SkYms5k';

// Para usar el endpoint remoto, cambia el segundo parámetro a false
validateApiKey(apiKey, false)
  .then(result => {
    if (result.isValid) {
      console.log('✅ API key válida:', result.data);
    } else {
      console.log('❌ API key inválida:', result.error);
    }
  })
  .catch(error => {
    console.error('💥 Error:', error);
  }); 