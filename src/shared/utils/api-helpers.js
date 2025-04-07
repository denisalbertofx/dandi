export function generateApiKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  // Generar 32 caracteres aleatorios
  const randomPart = Array.from(
    { length: 32 }, 
    () => chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('');

  // Agregar el prefijo dk_
  return `dk_${randomPart}`;
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}