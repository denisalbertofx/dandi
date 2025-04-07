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
      return NextResponse.json({ isValid: false, error: 'API Key es requerida' }, { status: 400, headers: corsHeaders });
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
        isValid: false, 
        error: 'Error al validar API key',
        details: error.message 
      }, { status: 500, headers: corsHeaders });
    }

    if (!data) {
      return NextResponse.json({ 
        isValid: false, 
        error: 'API Key no encontrada' 
      }, { status: 404, headers: corsHeaders });
    }

    return NextResponse.json({ 
      isValid: true,
      data: {
        id: data.id,
        name: data.name,
        is_active: data.is_active
      }
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error inesperado:', error);
    return NextResponse.json({ 
      isValid: false, 
      error: 'Error interno del servidor',
      details: error.message 
    }, { status: 500, headers: corsHeaders });
  }
} 