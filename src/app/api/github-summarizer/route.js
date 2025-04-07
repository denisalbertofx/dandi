import { NextResponse } from 'next/server';
<<<<<<< HEAD
import { apiKeysService } from '@/services/supabase/apiKeys';

// Configuración de CORS
=======
import { getServerSupabaseClient } from '@/lib/supabase/server';

// Configurar CORS headers
>>>>>>> yarn-migration
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
};

<<<<<<< HEAD
// Función para validar el formato de la URL de GitHub
const isValidGitHubUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname === 'github.com' && parsedUrl.pathname.split('/').length >= 3;
  } catch {
    return false;
  }
};

// Función para crear respuesta de error
const createErrorResponse = (message, status = 400) => {
  return NextResponse.json(
    { 
      success: false, 
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
=======
// Manejar OPTIONS request para CORS
>>>>>>> yarn-migration
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

<<<<<<< HEAD
// Función común para procesar la solicitud
async function processGitHubSummary(apiKey, githubUrl) {
  console.log('Iniciando proceso de resumen de GitHub');

  // Validación básica
  if (!apiKey) {
    return createErrorResponse('API Key no proporcionada', 400);
  }

  if (!githubUrl) {
    return createErrorResponse('URL de GitHub no proporcionada', 400);
  }

  // Validación de URL
  if (!isValidGitHubUrl(githubUrl)) {
    return createErrorResponse('URL de GitHub inválida', 400);
  }

  try {
    // Primero validamos la API key
    console.log('Validando API key');
    const keyValidation = await apiKeysService.validateKey(apiKey);

    if (!keyValidation.isValid) {
      return createErrorResponse(keyValidation.error || 'API Key inválida', 401);
    }

    // TODO: Aquí iría la lógica para obtener y procesar el contenido de GitHub
    // Por ahora retornamos una respuesta de ejemplo
    return NextResponse.json({
      success: true,
      data: {
        url: githubUrl,
        summary: "Resumen pendiente de implementar",
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    }, { 
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('Error en el proceso:', error);
    return createErrorResponse(
      'Error interno del servidor', 
      500
    );
  }
}

// Manejador de GET
export async function GET(req) {
  const apiKey = req.headers.get('x-api-key');
  const url = req.nextUrl.searchParams.get('url');
  return processGitHubSummary(apiKey, url);
}

// Manejador de POST
export async function POST(req) {
  try {
    const body = await req.json();
    const apiKey = body.apiKey || req.headers.get('x-api-key');
    const url = body.url;
    return processGitHubSummary(apiKey, url);
  } catch (error) {
    console.error('Error procesando request:', error);
    return createErrorResponse(
      'Error procesando la solicitud. Asegúrate de enviar un JSON válido con las propiedades "apiKey" y "url"', 
      400
    );
  }
} 
=======
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
>>>>>>> yarn-migration
