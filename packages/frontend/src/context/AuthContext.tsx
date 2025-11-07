import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, setupResponseInterceptors } from '../services/api';

export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (nombre: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Función para cargar el perfil del usuario
  const loadUser = useCallback(async () => {
    try {
      const userData = await authService.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Error al cargar el perfil:', error);
      setUser(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  // Inicializar autenticación
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          await loadUser();
        } catch (error) {
          console.error('Error al inicializar autenticación:', error);
          setUser(null);
          localStorage.removeItem('token');
        }
      } else {
        setLoading(false);
      }
    };

    // Configurar interceptor de respuestas
    setupResponseInterceptors(() => {
      setUser(null);
      localStorage.removeItem('token');
      navigate('/login');
    });

    initializeAuth();
  }, [loadUser, navigate]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      
      // Guardar token en localStorage
      localStorage.setItem('token', data.token);
      
      // Cargar datos del usuario
      await loadUser();
      
      // Redirigir al dashboard
      navigate('/');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (nombre: string, email: string, password: string) => {
    setLoading(true);
    try {
      await authService.register(nombre, email, password);
      // Después de registrar, hacer login automáticamente
      await login(email, password);
    } catch (error) {
      console.error('Error al registrar:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('token');
      setLoading(false);
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        loading,
        login,
        register,
        logout,
        loadUser,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};