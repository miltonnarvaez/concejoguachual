import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      // Establecer usuario desde localStorage inmediatamente para no bloquear la UI
      setUser(JSON.parse(savedUser));
      // Verificar token en segundo plano (no bloquea la carga)
      verifyToken(token);
    } else {
      // Si no hay token, no hay sesión - cargar inmediatamente
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await api.get('/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.valid) {
        setUser(response.data.user);
      } else {
        // Token inválido - limpiar pero no bloquear
        logout();
      }
    } catch (error) {
      // Si hay error de red o servidor, no bloquear el frontend
      // Solo limpiar si es un error de autenticación (401)
      if (error.response?.status === 401) {
        logout();
      }
      // Para otros errores (red, servidor caído, etc.), mantener el usuario
      // pero marcar como no cargando para no bloquear la UI
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      if (!token || !user) {
        return {
          success: false,
          error: 'Respuesta inválida del servidor'
        };
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return { success: true };
    } catch (error) {
      console.error('Error completo de login:', error);
      
      // Mensajes de error más específicos
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        return {
          success: false,
          error: 'No se puede conectar al servidor. Verifica que el backend esté corriendo en http://localhost:5000'
        };
      }
      
      if (error.response) {
        // Error del servidor
        const status = error.response.status;
        const errorMsg = error.response.data?.error || 'Error del servidor';
        
        if (status === 401) {
          return {
            success: false,
            error: 'Credenciales incorrectas. Verifica tu email y contraseña.'
          };
        }
        
        if (status === 429) {
          return {
            success: false,
            error: 'Demasiados intentos. Espera unos minutos e intenta de nuevo.'
          };
        }
        
        return {
          success: false,
          error: errorMsg
        };
      }
      
      return {
        success: false,
        error: error.message || 'Error al iniciar sesión. Intenta nuevamente.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
















