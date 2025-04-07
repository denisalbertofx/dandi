#!/bin/bash

# Instalar dependencias necesarias
echo "Instalando dependencias..."
npm install node-fetch dotenv axios

# Ejecutar prueba de validación directa con Supabase
echo "Ejecutando prueba de validación directa con Supabase..."
node scripts/test-api-validation.js

# Ejecutar prueba del endpoint con node-fetch
echo "Ejecutando prueba del endpoint con node-fetch..."
node scripts/test-api-endpoint.js

# Ejecutar prueba del endpoint con axios
echo "Ejecutando prueba del endpoint con axios..."
node scripts/test-api-endpoint-axios.js 