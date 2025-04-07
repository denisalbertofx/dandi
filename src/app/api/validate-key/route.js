import { NextResponse } from 'next/server';
import { apiKeysService } from '@/services/supabase/apiKeys';

// Configuración de CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
};

// Función para validar el formato de la API key
const isValidApiKeyFormat = (apiKey) => {
  if (!apiKey || typeof apiKey !== 'string') return false;
  // Verifica el formato: dk_ seguido de 32 caracteres alfanuméricos
  return /^dk_[a-zA-Z0-9]{32}$/.test(apiKey);
};

// Función para crear respuesta de error
const createErrorResponse = (message, status = 400) => {
  return NextResponse.json(
    { 
      isValid: false, 
      error: message,
      timestamp: new Date().toISOString()
    },
    { 
      status: status, 
      headers: corsHeaders 
    }
  );
};

// Manejador de OPTIONS para CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Función común para validar la API key
async function validateApiKey(apiKey) {
  console.log('Iniciando validación de API key');

  // Validación básica
  if (!apiKey) {
    return createErrorResponse('API Key no proporcionada', 400);
  }

  // Validación de formato
  if (!isValidApiKeyFormat(apiKey)) {
    return createErrorResponse('Formato de API Key inválido', 400);
  }

  try {
    console.log('Validando API key con Supabase');
    const result = await apiKeysService.validateKey(apiKey);
    console.log('Resultado de validación:', result);

    if (!result.isValid) {
      return createErrorResponse(result.error || 'API Key inválida', 401);
    }

    return NextResponse.json({
      isValid: true,
      data: result.data,
      timestamp: new Date().toISOString()
    }, { 
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('Error en validación:', error);
    return createErrorResponse(
      'Error interno al validar la API Key', 
      500
    );
  }
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
    console.error('Error procesando request:', error);
    return createErrorResponse(
      'Error procesando la solicitud', 
      500
    );
  }
}
