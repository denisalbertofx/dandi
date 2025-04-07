import { NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabase/server';

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
  try {
    const { apiKey } = await request.json();
    
    if (!apiKey) {
      return NextResponse.json({ 
        message: 'API Key es requerida',
        timestamp: new Date().toISOString()
      }, { 
        status: 400,
        headers: corsHeaders
      });
    }

    // Obtener el cliente Supabase centralizado
    const supabase = getServerSupabaseClient();

    // Validación simple de la API key
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', apiKey)
      .maybeSingle();

    if (error) {
      console.error('Error de Supabase:', error);
      return NextResponse.json({ 
        message: 'Error al validar API key',
        details: error.message,
        timestamp: new Date().toISOString()
      }, { 
        status: 500,
        headers: corsHeaders
      });
    }

    if (!data) {
      return NextResponse.json({ 
        message: 'API Key no encontrada',
        timestamp: new Date().toISOString()
      }, { 
        status: 404,
        headers: corsHeaders
      });
    }

    return NextResponse.json({ 
      message: 'API Key válida',
      data: {
        id: data.id,
        name: data.name,
        is_active: data.is_active
      },
      timestamp: new Date().toISOString()
    }, { 
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Error inesperado:', error);
    return NextResponse.json({ 
      message: 'Error interno del servidor',
      details: error.message,
      timestamp: new Date().toISOString()
    }, { 
      status: 500,
      headers: corsHeaders
    });
  }
}