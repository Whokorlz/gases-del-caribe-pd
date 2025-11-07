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
exports.AuthController = void 0;
const typeorm_1 = require("typeorm");
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const Usuario_1 = require("../models/Usuario");
const Sesion_1 = require("../models/Sesion");
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
class AuthController {
    static async register(req, res) {
        try {
            const { nombre, email, password } = req.body;
            const usuarioRepository = (0, typeorm_1.getRepository)(Usuario_1.Usuario);
            // Verificar si el usuario ya existe
            const usuarioExistente = await usuarioRepository.findOne({ where: { email } });
            if (usuarioExistente) {
                return res.status(400).json({ message: 'El correo electrónico ya está en uso' });
            }
            // Crear nuevo usuario
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const nuevoUsuario = usuarioRepository.create({
                nombre,
                email,
                password: hashedPassword,
                activo: true,
                rol: 'usuario'
            });
            await usuarioRepository.save(nuevoUsuario);
            // Eliminar la contraseña del objeto de respuesta
            const { password: _, ...usuarioSinPassword } = nuevoUsuario;
            res.status(201).json({
                message: 'Usuario registrado exitosamente',
                usuario: usuarioSinPassword
            });
        }
        catch (error) {
            console.error('Error en el registro:', error);
            res.status(500).json({ message: 'Error al registrar el usuario' });
        }
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const usuarioRepository = (0, typeorm_1.getRepository)(Usuario_1.Usuario);
            const sesionRepository = (0, typeorm_1.getRepository)(Sesion_1.Sesion);
            // Buscar usuario por email
            const usuario = await usuarioRepository.findOne({ where: { email } });
            if (!usuario) {
                return res.status(400).json({ message: 'Credenciales inválidas' });
            }
            // Verificar contraseña
            const esContraseñaValida = await bcrypt.compare(password, usuario.password);
            if (!esContraseñaValida) {
                return res.status(400).json({ message: 'Credenciales inválidas' });
            }
            // Verificar si el usuario está activo
            if (!usuario.activo) {
                return res.status(403).json({ message: 'Cuenta deshabilitada' });
            }
            // Crear token JWT
            const token = jwt.sign({ id: usuario.id, email: usuario.email, rol: usuario.rol }, JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN ? parseInt(process.env.JWT_EXPIRES_IN, 10) : '24h'
            });
            // Registrar sesión
            const nuevaSesion = sesionRepository.create({
                usuario,
                token,
                direccionIp: req.ip,
                agenteUsuario: req.headers['user-agent'] || '',
                activa: true
            });
            await sesionRepository.save(nuevaSesion);
            // Eliminar la contraseña del objeto de respuesta
            const { password: _, ...usuarioSinPassword } = usuario;
            res.json({
                message: 'Inicio de sesión exitoso',
                token,
                usuario: usuarioSinPassword
            });
        }
        catch (error) {
            console.error('Error en el inicio de sesión:', error);
            res.status(500).json({ message: 'Error al iniciar sesión' });
        }
    }
    static async logout(req, res) {
        var _a;
        try {
            const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
            if (!token) {
                return res.status(400).json({ message: 'Token no proporcionado' });
            }
            const sesionRepository = (0, typeorm_1.getRepository)(Sesion_1.Sesion);
            await sesionRepository.update({ token, activa: true }, { activa: false, fechaCierre: new Date() });
            res.json({ message: 'Sesión cerrada exitosamente' });
        }
        catch (error) {
            console.error('Error al cerrar sesión:', error);
            res.status(500).json({ message: 'Error al cerrar sesión' });
        }
    }
    static async getPerfil(req, res) {
        try {
            // El middleware de autenticación ya agregó el usuario a la solicitud
            const usuario = req.usuario;
            // Eliminar la contraseña del objeto de respuesta
            const { password, ...usuarioSinPassword } = usuario;
            res.json(usuarioSinPassword);
        }
        catch (error) {
            console.error('Error al obtener el perfil:', error);
            res.status(500).json({ message: 'Error al obtener el perfil' });
        }
    }
}
exports.AuthController = AuthController;
