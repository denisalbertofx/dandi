export function generateApiKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const segments = [16, 8, 8, 8, 24]; // Formato: xxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  
  const generateSegment = (length) => {
    return Array.from(
      { length }, 
      () => chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
  };

  return segments
    .map(generateSegment)
    .join('-');
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