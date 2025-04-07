import { NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    // Obtener el cliente Supabase
    const supabase = getServerSupabaseClient();
    
    // Verificar la configuración
    const config = {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_KEY,
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json({ 
      status: 'Supabase está configurado correctamente',
      config
    });
  } catch (error) {
    console.error('Error al inicializar Supabase:', error);
    return NextResponse.json({ 
      error: 'Error al inicializar Supabase',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
} 