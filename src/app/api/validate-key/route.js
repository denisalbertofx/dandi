import { NextResponse } from 'next/server';
import { supabase, validateSupabaseConnection } from '@/lib/supabase';
import { apiKeysService } from '@/services/supabase/apiKeys';

// Configuración de CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
};

// Función para validar el formato de la API key
const isValidApiKeyFormat = (apiKey) => {
  // Verifica que la API key tenga el formato correcto (4 segmentos separados por guiones)
  const pattern = /^[A-Za-z0-9]{8}-[A-Za-z0-9]{8}-[A-Za-z0-9]{8}-[A-Za-z0-9]{24}$/;
  return pattern.test(apiKey);
};

// Función para manejar errores
const handleError = (error) => {
  console.error('Error:', error);
  return NextResponse.json(
    { isValid: false, error: 'Error al validar la API Key' },
    { status: 500, headers: corsHeaders }
  );
};

// Función común para validar la API key
async function validateApiKey(apiKey) {
  // Primero validamos la conexión
  const isConnected = await validateSupabaseConnection();
  if (!isConnected) {
    return NextResponse.json(
      { isValid: false, error: 'Error de conexión con la base de datos' },
      { status: 500, headers: corsHeaders }
    );
  }

  // Validación de formato
  if (!apiKey || typeof apiKey !== 'string') {
    return NextResponse.json(
      { isValid: false, error: 'API Key no proporcionada o formato inválido' },
      { status: 400, headers: corsHeaders }
    );
  }

  // Validación del patrón
  if (!isValidApiKeyFormat(apiKey)) {
    return NextResponse.json(
      { isValid: false, error: 'Formato de API Key inválido' },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const { data, error } = await apiKeysService.validateKey(apiKey);
    
    if (error || !data) {
      return NextResponse.json(
        { isValid: false, error: 'API Key inválida o no encontrada' },
        { status: 401, headers: corsHeaders }
      );
    }

    // Verificación adicional del estado
    if (!data.is_active) {
      return NextResponse.json(
        { isValid: false, error: 'API Key inactiva' },
        { status: 401, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { 
        isValid: true, 
        data: {
          id: data.id,
          name: data.name,
          is_active: data.is_active,
          created_at: data.created_at
        } 
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    return handleError(error);
  }
}

// Manejador de OPTIONS para CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Manejador de GET
export async function GET(req) {
  const apiKey = req.headers.get('x-api-key');
  return validateApiKey(apiKey);
}

// Manejador de POST
export async function POST(req) {
  try {
    const body = await req.json();
    const apiKey = body.apiKey || req.headers.get('x-api-key');
    return validateApiKey(apiKey);
  } catch (error) {
    return handleError(error);
  }
}
