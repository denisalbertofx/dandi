import fetch from 'node-fetch';

const apiKey = 'mjxXj9cGUR10eVe0-1sfBUnoe-SPsGeJrJ-PSa2UXEc-fseAcmBb7pIVMNY23SkYms5k';
const url = 'https://dandi-r9ji1nqun-denis-projects-2bbb460d.vercel.app/api/validate-key-simple';

async function testApi() {
  try {
    console.log('🔍 Probando validación de API key simplificada...');
    console.log('URL:', url);
    console.log('API Key:', apiKey);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ apiKey })
    });

    console.log('Estado:', response.status);
    
    const data = await response.json();
    console.log('✅ Respuesta:', data);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testApi(); 