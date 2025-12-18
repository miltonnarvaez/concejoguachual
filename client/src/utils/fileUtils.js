// Función helper para construir URL completa del archivo
export const getFileUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // Construir URL completa usando la base URL del API
  const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  return `${baseURL}${path}`;
};















