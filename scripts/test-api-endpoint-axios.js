// Script para probar el endpoint de validación de API keys usando axios
import axios from 'axios';

// URL del endpoint
const endpointUrl = 'https://dandi-r9ji1nqun-denis-projects-2bbb460d.vercel.app/api/validate-key';

// API key a validar
const apiKey = 'mjxXj9cGUR10eVe0-1sfBUnoe-SPsGeJrJ-PSa2UXEc-fseAcmBb7pIVMNY23SkYms5k';

async function testApiEndpoint() {
  console.log('🔍 Iniciando prueba del endpoint de validación con axios');
  console.log('URL:', endpointUrl);
  console.log('API Key a validar:', apiKey);

  try {
    // Realizar petición POST al endpoint
    const response = await axios.post(endpointUrl, 
      { apiKey },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        }
      }
    );

    console.log('✅ Respuesta exitosa:');
    console.log('Estado:', response.status);
    console.log('Datos:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('💥 Error al realizar la petición:');
    if (error.response) {
      console.log('Estado:', error.response.status);
      console.log('Datos:', error.response.data);
    } else if (error.request) {
      console.log('Error de red:', error.message);
    } else {
      console.log('Error:', error.message);
    }
  }
}

// Ejecutar la prueba
testApiEndpoint(); 