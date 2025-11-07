"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = require("../../controllers/auth.controller");
const typeorm_1 = require("typeorm");
const bcrypt = __importStar(require("bcryptjs"));
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
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
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
            };
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
            typeorm_1.getRepository.mockReturnValue(mockRepo);
            const res = createMockResponse();
            // Ejecutar el método
            await auth_controller_1.AuthController.register(mockRequest, res);
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
            };
            // Configurar mock para usuario existente
            const existingUser = {
                id: 1,
                email: 'existing@example.com'
            };
            const mockRepo = {
                findOne: jest.fn().mockResolvedValue(existingUser),
            };
            typeorm_1.getRepository.mockReturnValue(mockRepo);
            const res = createMockResponse();
            // Ejecutar el método
            await auth_controller_1.AuthController.register(mockRequest, res);
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
