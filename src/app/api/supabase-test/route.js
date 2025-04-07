import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Verificar las variables de entorno
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const envStatus = {
      supabaseUrl: !!supabaseUrl,
      supabaseAnonKey: !!supabaseAnonKey,
      supabaseUrlLength: supabaseUrl?.length || 0,
      supabaseAnonKeyLength: supabaseAnonKey?.length || 0
    };

    // Si faltan las variables de entorno, retornar error
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Faltan variables de entorno de Supabase',
        environment: envStatus
      }, { status: 500 });
    }

    // Crear cliente de Supabase para el servidor
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Intentar una consulta simple
    const start = Date.now();
    const { data, error } = await supabase
      .from('api_keys')
      .select('count');
    const duration = Date.now() - start;

    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      environment: envStatus,
      connection: {
        isConnected: !error,
        duration,
        hasError: !!error,
        errorMessage: error?.message,
        data: data
      }
    });
  } catch (error) {
    console.error('Error en prueba de Supabase:', error);
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
} 