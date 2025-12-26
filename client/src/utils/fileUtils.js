// Función helper para construir URL completa del archivo
export const getFileUrl = (path) => {
  if (!path) return null;
  
  // Si ya es una URL completa, retornarla tal cual
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Detectar si estamos en producción o desarrollo
  const isProduction = process.env.NODE_ENV === 'production' || 
                       (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');
  
  // Si la ruta es de API (empieza con /api/), siempre usar la URL completa del servidor en desarrollo
  if (path.startsWith('/api/')) {
    if (isProduction) {
      // En producción, agregar el prefijo /concejoguachucal
      const basename = '/concejoguachucal';
      return path.startsWith(basename) ? path : `${basename}${path}`;
    } else {
      // En desarrollo, usar la base URL del API
      const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      return `${baseURL}${path}`;
    }
  }
  
  // Para otras rutas (uploads, etc.)
  if (isProduction) {
    const basename = '/concejoguachucal';
    return path.startsWith(basename) ? path : `${basename}${path}`;
  } else {
    const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseURL}${cleanPath}`;
  }
};






















