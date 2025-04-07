import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Usar una URL real de Supabase pero con credenciales falsas
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;  // URL real
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake.key';  // Key falsa pero con formato válido

    const envStatus = {
      supabaseUrl: !!supabaseUrl,
      supabaseAnonKey: true,
      supabaseUrlLength: supabaseUrl?.length || 0,
      supabaseAnonKeyLength: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake.key'.length
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

    console.log('Intentando conexión con credenciales falsas:', {
      url: supabaseUrl,
      keyLength: supabaseAnonKey.length
    });

    // Crear cliente de Supabase con credenciales falsas
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Intentar una consulta simple
    const start = Date.now();
    const { data, error } = await supabase
      .from('api_keys')
      .select('count');
    const duration = Date.now() - start;

    console.log('Resultado de consulta con credenciales falsas:', {
      error,
      duration
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
    console.error('Error en prueba de Supabase (fake):', error);
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
} 