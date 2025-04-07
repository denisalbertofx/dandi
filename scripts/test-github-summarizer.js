import fetch from 'node-fetch';

const apiKey = 'mjxXj9cGUR10eVe0-1sfBUnoe-SPsGeJrJ-PSa2UXEc-fseAcmBb7pIVMNY23SkYms5k';
// Usar la URL local para desarrollo
const url = 'http://localhost:3000/api/github-summarizer';

async function testGitHubSummarizer() {
  try {
    console.log('🔍 Probando GitHub Summarizer...');
    console.log('URL:', url);
    console.log('API Key:', apiKey);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        repository: 'denis/proyecto-ejemplo',
        branch: 'main',
        path: '/src'
      })
    });

    console.log('Estado:', response.status);
    
    const data = await response.json();
    console.log('✅ Respuesta:', data);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testGitHubSummarizer(); 