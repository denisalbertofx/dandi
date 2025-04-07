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

    console.log('🔍 Consultando API key en Supabase');
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

    console.log('✅ API Key válida encontrada');
    return NextResponse.json(
      {
        isValid: true,
        data: {
          id: data.id,
          name: data.name,
          description: data.description,
          created_at: data.created_at,
          updated_at: data.updated_at,
          timestamp: new Date().toISOString()
        }
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