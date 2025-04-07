import { NextResponse } from 'next/server';
import { apiKeysService } from '@/services/supabase/apiKeys';

// Headers CORS siguiendo el patrón del proyecto de referencia
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request) {
  console.log('🔑 Iniciando validación de API key');

  try {
    const { apiKey } = await request.json();

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

    // Usar el mismo servicio que usa la web
    const { isValid, data, error } = await apiKeysService.validateKey(apiKey);

    if (!isValid) {
      console.log('⚠️ API Key inválida:', error);
      return NextResponse.json(
        { 
          isValid: false,
          error: error || 'API Key inválida o inactiva',
          timestamp: new Date().toISOString()
        },
        { 
          status: 401,
          headers: corsHeaders
        }
      );
    }

    console.log('✅ API Key válida encontrada:', {
      id: data.id,
      name: data.name,
      isActive: data.is_active
    });

    return NextResponse.json(
      {
        isValid: true,
        data: {
          id: data.id,
          name: data.name,
          description: data.description,
          key: data.key,
          created_at: data.created_at,
          updated_at: data.updated_at,
          is_active: data.is_active
        },
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