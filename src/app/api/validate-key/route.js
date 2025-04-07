import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Configuración específica para el servidor
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zknrpqrxiqmgsxfhjjtx.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprbnJwcXJ4aXFtZ3N4ZmhqanR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI0NDgyMzMsImV4cCI6MjAyODAyNDIzM30.YL4NuCzs5D-DTOhT-9N4yQbXxkEQFIvWMTe5PMwEMWQ';

// Cliente de Supabase optimizado para el servidor
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

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
  console.log('🔍 Iniciando validación de API key');

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

    // Validación directa con Supabase
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', apiKey)
      .eq('is_active', true)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Error validando API key:', error);
      throw error;
    }

    if (!data) {
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