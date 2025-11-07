import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-validator';
import { QueryFailedError } from 'typeorm';

interface CustomError extends Error {
  statusCode?: number;
  errors?: ValidationError[];
  code?: string;
}

export const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('❌ Error:', err);

  // Error de validación
  if (err.name === 'ValidationError' || Array.isArray(err.errors)) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: (err.errors || []).map((e: any) => ({
        field: e.param || 'general',
        message: e.msg || e.message,
      })),
    });
  }

  // Error de base de datos (duplicados, etc.)
  if (err instanceof QueryFailedError) {
    // Error de duplicado de clave única
    if (err.driverError?.code === '23505') {
      const detail = err.driverError.detail as string;
      const field = detail.match(/\(([^)]+)\)/)?.[1] || 'campo';
      return res.status(409).json({
        success: false,
        message: `El ${field} ya está en uso`,
      });
    }

    return res.status(400).json({
      success: false,
      message: 'Error en la base de datos',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }

  // Error de autenticación
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'No autorizado - Token inválido o expirado',
    });
  }

  // Error personalizado con código de estado
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  }

  // Error no manejado
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};

// Clase para errores personalizados
export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Middleware para manejar rutas no encontradas
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.originalUrl}`,
  });
};
