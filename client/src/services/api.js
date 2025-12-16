import axios from 'axios';

// Determinar el baseURL según el entorno
const getBaseURL = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  // En desarrollo, usar localhost directamente
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5000/api';
  }
  // En producción, usar el basename
  const basename = process.env.NODE_ENV === 'production' ? '/concejoguachucal' : '';
  return `${basename}/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 segundos de timeout
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // No establecer Content-Type si es FormData (el navegador lo hará automáticamente)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Solo redirigir a login si es un error 401 Y estamos en una ruta de admin
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const basename = process.env.NODE_ENV === 'production' ? '/concejoguachucal' : '';
      const isAdminRoute = currentPath.includes('/admin') && !currentPath.includes('/admin/login');
      
      // Limpiar tokens
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Solo redirigir si estamos en una ruta de admin protegida
      if (isAdminRoute) {
        window.location.href = `${basename}/admin/login`;
      }
    }
    return Promise.reject(error);
  }
);

export default api;


