import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Usar una URL real de Supabase con la nueva API key
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;  // URL real
    const supabaseAnonKey = 'dk_K0RcR9uWz7YHLAtS1mTXzPClMkfeYD2K';  // Nueva API key

    const envStatus = {
      supabaseUrl: !!supabaseUrl,
      supabaseAnonKey: true,
      supabaseUrlLength: supabaseUrl?.length || 0,
      supabaseAnonKeyLength: supabaseAnonKey.length
    };

    // Si falta la URL, retornar error
    if (!supabaseUrl) {
      return NextResponse.json({
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'URL de Supabase no configurada',
        environment: envStatus
      }, { status: 500 });
    }

    console.log('Intentando conexión con nueva API key:', {
      url: supabaseUrl,
      keyLength: supabaseAnonKey.length,
      keyFormat: supabaseAnonKey.startsWith('dk_')
    });

    // Crear cliente de Supabase con la nueva key
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Intentar una consulta simple
    const start = Date.now();
    const { data, error } = await supabase
      .from('api_keys')
      .select('count');
    const duration = Date.now() - start;

    console.log('Resultado de consulta con nueva API key:', {
      error,
      duration,
      hasData: !!data
    });

    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      environment: envStatus,
      connection: {
        isConnected: !error,
        duration,
        hasError: !!error,
        errorMessage: error?.message || error?.code || 'Error desconocido',
        errorDetails: error,
        data: data
      }
    });
  } catch (error) {
    console.error('Error en prueba de Supabase con nueva API key:', error);
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
} 