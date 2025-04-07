import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Usar credenciales falsas
    const supabaseUrl = 'https://fake-project.supabase.co';
    const supabaseAnonKey = 'fake_key_123456789';

    const envStatus = {
      supabaseUrl: true,
      supabaseAnonKey: true,
      supabaseUrlLength: supabaseUrl.length,
      supabaseAnonKeyLength: supabaseAnonKey.length
    };

    // Crear cliente de Supabase con credenciales falsas
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