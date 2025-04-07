import { NextResponse } from 'next/server';

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
];

// Configurar CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
};

// Manejar OPTIONS request para CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request) {
  console.log('🔍 Iniciando validación de API key simple');

  try {
    const { apiKey } = await request.json();
    console.log('API Key recibida:', apiKey);

    if (!apiKey) {
      console.log('❌ API Key no proporcionada');
      return NextResponse.json(
        { 
          isValid: false, 
          error: 'API Key es requerida',
          timestamp: new Date().toISOString()
        },
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    // Buscar la API key en la lista de keys válidas
    const apiKeyData = validApiKeys.find(key => key.key === apiKey && key.is_active);

    if (!apiKeyData) {
      console.log('⚠️ API Key inválida o no encontrada');
      return NextResponse.json(
        { 
          isValid: false,
          error: 'API Key inválida o inactiva',
          timestamp: new Date().toISOString()
        },
        { 
          status: 401,
          headers: corsHeaders
        }
      );
    }

    console.log('✅ API Key válida encontrada:', {
      id: apiKeyData.id,
      name: apiKeyData.name,
      isActive: apiKeyData.is_active
    });

    return NextResponse.json(
      {
        isValid: true,
        data: apiKeyData,
        timestamp: new Date().toISOString()
      },
      { 
        headers: corsHeaders
      }
    );

  } catch (error) {
    console.error('💥 Error inesperado:', error);
    return NextResponse.json(
      { 
        isValid: false,
        error: 'Error interno del servidor',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
} 