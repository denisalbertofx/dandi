import { NextResponse } from 'next/server';
import { apiKeysService } from '@/services/supabase/apiKeys';
import { supabase } from '@/lib/supabase';

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
    const { apiKey } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ 
        isValid: false,
        error: 'API Key no proporcionada',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    console.log('Validando API key:', {
      keyLength: apiKey.length,
      keyFormat: apiKey.startsWith('dk_')
    });

    const { data, error } = await supabase
      .from('api_keys')
      .select('id, name, is_active, created_at')
      .eq('key', apiKey)
      .eq('is_active', true)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Error al validar API key:', error);
      return NextResponse.json({ 
        isValid: false,
        error: 'Error interno al validar la API Key',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    if (data) {
      console.log('API key válida encontrada:', {
        keyId: data.id,
        name: data.name,
        isActive: data.is_active
      });

      return NextResponse.json({ 
        isValid: true,
        data: {
          id: data.id,
          name: data.name,
          is_active: data.is_active,
          created_at: data.created_at
        },
        timestamp: new Date().toISOString()
      }, { status: 200 });
    } else {
      console.log('API key inválida o inactiva');
      return NextResponse.json({ 
        isValid: false,
        error: 'API Key inválida o inactiva',
        timestamp: new Date().toISOString()
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Error inesperado:', error);
    return NextResponse.json({ 
      isValid: false,
      error: 'Error interno del servidor',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
