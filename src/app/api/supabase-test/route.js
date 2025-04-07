import { NextResponse } from 'next/server';
import { supabase, validateSupabaseConnection } from '@/lib/supabase';

export async function GET() {
  try {
    // Verificar las variables de entorno
    const envStatus = {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseUrlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
      supabaseAnonKeyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0
    };

    // Verificar la conexión a Supabase
    const isConnected = await validateSupabaseConnection();

    // Intentar una consulta simple
    const { data, error } = await supabase
      .from('api_keys')
      .select('count');

    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      environment: envStatus,
      connection: {
        isConnected,
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