// Script para probar el endpoint de validación de API keys
// Usar importación ESM para node-fetch
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// URL del endpoint
const endpointUrl = 'https://dandi-git-yarn-migration-denis-projects-2bbb460d.vercel.app/api/validate-key';

// API key a validar
const apiKeyToValidate = 'mjxXj9cGUR10eVe0-1sfBUnoe-SPsGeJrJ-PSa2UXEc-fseAcmBb7pIVMNY23SkYms5k';

async function testApiEndpoint() {
  console.log('🔍 Iniciando prueba del endpoint de validación');
  console.log(`URL: ${endpointUrl}`);
  console.log(`API Key a validar: ${apiKeyToValidate}`);

  try {
    // Realizar petición POST al endpoint
    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ apiKey: apiKeyToValidate }),
    });

    // Obtener datos de la respuesta
    const data = await response.json();
    const status = response.status;

    console.log(`Estado de la respuesta: ${status}`);
    console.log('Respuesta:');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('💥 Error al realizar la petición:', error);
  }
}

// Ejecutar la prueba
testApiEndpoint(); 