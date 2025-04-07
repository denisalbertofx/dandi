import fetch from 'node-fetch';

const apiKey = 'mjxXj9cGUR10eVe0-1sfBUnoe-SPsGeJrJ-PSa2UXEc-fseAcmBb7pIVMNY23SkYms5k';
const url = 'https://dandi-r9ji1nqun-denis-projects-2bbb460d.vercel.app/api/validate-key';

async function testApi() {
  try {
    console.log('🔍 Probando validación de API key...');
    console.log('URL:', url);
    console.log('API Key:', apiKey);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Dandi-API-Test'
      },
      body: JSON.stringify({ apiKey })
    });

    console.log('Headers de respuesta:', response.headers);
    console.log('Estado:', response.status);
    
    const text = await response.text();
    console.log('Respuesta en texto:', text);
    
    try {
      const data = JSON.parse(text);
      console.log('✅ Respuesta JSON:', data);
    } catch (parseError) {
      console.error('❌ Error al parsear JSON:', parseError.message);
    }
  } catch (error) {
    console.error('❌ Error de red:', error.message);
  }
}

testApi(); 