import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

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

    console.log('🔍 Consultando API key:', {
      keyLength: apiKey.length,
      keyFormat: apiKey.includes('-')
    });

    // Primera consulta para debugging
    const { count } = await supabaseServer
      .from('api_keys')
      .select('*', { count: 'exact' });
    
    console.log(`📊 Total de API keys en la base de datos: ${count}`);

    // Consulta principal
    const { data, error } = await supabaseServer
      .from('api_keys')
      .select('*')
      .eq('key', apiKey)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('❌ Error de Supabase:', error);
      return NextResponse.json(
        { 
          isValid: false,
          error: 'Error al validar la API Key',
          details: error.message,
          debug: {
            errorCode: error.code,
            hint: error.hint,
            details: error.details
          },
          timestamp: new Date().toISOString()
        },
        { 
          status: 500,
          headers: corsHeaders
        }
      );
    }

    if (!data) {
      console.log('⚠️ API Key no encontrada o inactiva');
      
      // Consulta adicional para debugging
      const keyExists = await supabaseServer
        .from('api_keys')
        .select('is_active')
        .eq('key', apiKey)
        .single();
      
      return NextResponse.json(
        { 
          isValid: false,
          error: 'API Key inválida o inactiva',
          debug: {
            exists: !!keyExists.data,
            isActive: keyExists.data?.is_active
          },
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
          created_at: data.created_at,
          updated_at: data.updated_at
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