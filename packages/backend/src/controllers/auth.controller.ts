import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Usuario } from '../models/Usuario';
import { Sesion } from '../models/Sesion';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { nombre, email, password } = req.body;
      const usuarioRepository = getRepository(Usuario);
      
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
    } catch (error) {
      console.error('Error en el registro:', error);
      res.status(500).json({ message: 'Error al registrar el usuario' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const usuarioRepository = getRepository(Usuario);
      const sesionRepository = getRepository(Sesion);
      
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
      const token = jwt.sign(
        { id: usuario.id, email: usuario.email, rol: usuario.rol },
        JWT_SECRET,
        { 
          expiresIn: process.env.JWT_EXPIRES_IN ? parseInt(process.env.JWT_EXPIRES_IN, 10) : '24h'
        } as jwt.SignOptions
      );

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
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      res.status(500).json({ message: 'Error al iniciar sesión' });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        return res.status(400).json({ message: 'Token no proporcionado' });
      }

      const sesionRepository = getRepository(Sesion);
      await sesionRepository.update(
        { token, activa: true },
        { activa: false, fechaCierre: new Date() }
      );

      res.json({ message: 'Sesión cerrada exitosamente' });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      res.status(500).json({ message: 'Error al cerrar sesión' });
    }
  }

  static async getPerfil(req: Request, res: Response) {
    try {
      // El middleware de autenticación ya agregó el usuario a la solicitud
      const usuario = (req as any).usuario;
      
      // Eliminar la contraseña del objeto de respuesta
      const { password, ...usuarioSinPassword } = usuario;
      
      res.json(usuarioSinPassword);
    } catch (error) {
      console.error('Error al obtener el perfil:', error);
      res.status(500).json({ message: 'Error al obtener el perfil' });
    }
  }
}
