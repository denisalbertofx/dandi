// Script para probar la validación de API keys
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Obtener variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no configuradas');
  process.exit(1);
}

// Crear cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// API key a validar
const apiKeyToValidate = 'mjxXj9cGUR10eVe0-1sfBUnoe-SPsGeJrJ-PSa2UXEc-fseAcmBb7pIVMNY23SkYms5k';

async function testApiValidation() {
  console.log('🔍 Iniciando prueba de validación de API key');
  console.log(`API Key a validar: ${apiKeyToValidate}`);

  try {
    // Consultar API key en Supabase
    console.log('Consultando API key en Supabase...');
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', apiKeyToValidate)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('❌ Error al consultar API key:', error);
      return;
    }

    if (!data) {
      console.log('⚠️ API Key no encontrada o inactiva');
      return;
    }

    console.log('✅ API Key válida encontrada:');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('💥 Error inesperado:', error);
  }
}

// Ejecutar la prueba
testApiValidation(); 