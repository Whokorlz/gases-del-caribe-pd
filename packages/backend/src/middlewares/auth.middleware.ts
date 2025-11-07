import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { Usuario } from '../models/Usuario';
import { Sesion } from '../models/Sesion';

declare global {
  namespace Express {
    interface Request {
      usuario?: Usuario;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Obtener el token del encabezado de autorización
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No se proporcionó un token de autenticación' });
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { id: string };
    
    // Buscar el usuario en la base de datos
    const usuarioRepository = getRepository(Usuario);
    const usuario = await usuarioRepository.findOne({ 
      where: { id: decoded.id },
      select: ['id', 'nombre', 'email', 'rol', 'activo', 'fechaCreacion']
    });

    if (!usuario) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si la sesión está activa
    const sesionRepository = getRepository(Sesion);
    const sesionActiva = await sesionRepository.findOne({ 
      where: { 
        token,
        activa: true,
        usuario: { id: usuario.id }
      } 
    });

    if (!sesionActiva) {
      return res.status(401).json({ message: 'Sesión expirada o inválida' });
    }

    // Agregar el usuario a la solicitud
    req.usuario = usuario;
    next();
  } catch (error) {
    console.error('Error en la autenticación:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Token inválido' });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expirado' });
    }
    res.status(500).json({ message: 'Error de autenticación' });
  }
};

export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.usuario) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    next();
  };
};
