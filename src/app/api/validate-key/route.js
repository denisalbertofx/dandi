import { NextResponse } from 'next/server';
import { apiKeysService } from '@/services/supabase/apiKeys';

// Configuración de CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
};

// Función para manejar errores
const handleError = (error) => {
  console.error('Error:', error);
  return NextResponse.json(
    { isValid: false, error: 'Error al validar la API Key' },
    { status: 500, headers: corsHeaders }
  );
};

// Manejador de OPTIONS para CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Manejador de GET
export async function GET(req) {
  try {
    const apiKey = req.headers.get('x-api-key');
    
    if (!apiKey) {
      return NextResponse.json(
        { isValid: false, error: 'API Key no proporcionada' },
        { status: 400, headers: corsHeaders }
      );
    }

    const result = await apiKeysService.validateKey(apiKey);
    return NextResponse.json(result, { headers: corsHeaders });
  } catch (error) {
    return handleError(error);
  }
}

// Manejador de POST
export async function POST(req) {
  try {
    const body = await req.json();
    const apiKey = body.apiKey || req.headers.get('x-api-key');

    if (!apiKey) {
      return NextResponse.json(
        { isValid: false, error: 'API Key no proporcionada' },
        { status: 400, headers: corsHeaders }
      );
    }

    const result = await apiKeysService.validateKey(apiKey);
    return NextResponse.json(result, { headers: corsHeaders });
  } catch (error) {
    return handleError(error);
  }
}
