import { Request, Response } from 'express';
import { AuthController } from '../../controllers/auth.controller';
import { getRepository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Usuario } from '../../models/Usuario';

// Mock de typeorm
jest.mock('typeorm', () => ({
  getRepository: jest.fn(),
}));

// Mock de bcrypt
const mockGenSalt = jest.fn().mockResolvedValue('mocked-salt');
const mockHash = jest.fn().mockResolvedValue('mocked-hash');
const mockCompare = jest.fn().mockResolvedValue(true);

// Sobrescribir las funciones de bcrypt
Object.defineProperty(bcrypt, 'genSalt', { value: mockGenSalt });
Object.defineProperty(bcrypt, 'hash', { value: mockHash });
Object.defineProperty(bcrypt, 'compare', { value: mockCompare });

// Función para crear una respuesta simulada simple
const createMockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe('AuthController', () => {
  describe('register', () => {
    it('debería registrar un nuevo usuario exitosamente', async () => {
      // Datos de prueba
      const mockRequest = {
        body: {
          nombre: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        },
      } as Request;

      const mockUser = {
        id: 1,
        nombre: 'Test User',
        email: 'test@example.com',
        password: 'mocked-hash',
        activo: true,
        rol: 'usuario',
      };

      // Configurar mocks
      const mockRepo = {
        findOne: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockReturnValue(mockUser),
        save: jest.fn().mockResolvedValue(mockUser),
      };

      (getRepository as jest.Mock).mockReturnValue(mockRepo);
      const res = createMockResponse();

      // Ejecutar el método
      await AuthController.register(mockRequest, res);

      // Verificar resultados
      expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(mockGenSalt).toHaveBeenCalled();
      expect(mockHash).toHaveBeenCalledWith('password123', 'mocked-salt');
      expect(mockRepo.create).toHaveBeenCalledWith({
        nombre: 'Test User',
        email: 'test@example.com',
        password: 'mocked-hash',
        activo: true,
        rol: 'usuario',
      });
      expect(mockRepo.save).toHaveBeenCalledWith(mockUser);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Usuario registrado exitosamente',
        user: {
          id: 1,
          nombre: 'Test User',
          email: 'test@example.com',
          activo: true,
          rol: 'usuario',
        },
      });
    });

    it('debería devolver un error si el correo ya está en uso', async () => {
      // Datos de prueba
      const mockRequest = {
        body: {
          nombre: 'Test User',
          email: 'existing@example.com',
          password: 'password123',
        },
      } as Request;

      // Configurar mock para usuario existente
      const existingUser = { 
        id: 1, 
        email: 'existing@example.com' 
      };

      const mockRepo = {
        findOne: jest.fn().mockResolvedValue(existingUser),
      };

      (getRepository as jest.Mock).mockReturnValue(mockRepo);
      const res = createMockResponse();

      // Ejecutar el método
      await AuthController.register(mockRequest, res);

      // Verificar resultados
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'El correo electrónico ya está en uso',
      });
    });
  });

  // Limpiar los mocks después de cada prueba
  afterEach(() => {
    jest.clearAllMocks();
  });
});
