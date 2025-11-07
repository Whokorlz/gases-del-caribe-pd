import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

// Configuración base de la API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Crear instancia de axios
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
export const setupResponseInterceptors = (onUnauthenticated: () => void) => {
  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        onUnauthenticated();
      }
      return Promise.reject(error);
    }
  );
};

// Servicio de autenticación
export const authService = {
  // Iniciar sesión
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Error al iniciar sesión');
      }
      throw new Error('Error de conexión');
    }
  },

  // Registrar nuevo usuario
  register: async (nombre: string, email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { nombre, email, password });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Error al registrar el usuario');
      }
      throw new Error('Error de conexión');
    }
  },

  // Cerrar sesión
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Aún así continuamos con el cierre de sesión local
    } finally {
      // Limpiar el token del almacenamiento local
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Obtener perfil del usuario
  getProfile: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // No autenticado, redirigir al login
        throw new Error('No autenticado');
      }
      throw new Error('Error al obtener el perfil');
    }
  },
};

export default api;
