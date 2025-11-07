"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.AppError = exports.errorHandler = void 0;
const typeorm_1 = require("typeorm");
const errorHandler = (err, _req, res, _next) => {
    var _a, _b;
    console.error('❌ Error:', err);
    // Error de validación
    if (err.name === 'ValidationError' || Array.isArray(err.errors)) {
        return res.status(400).json({
            success: false,
            message: 'Error de validación',
            errors: (err.errors || []).map((e) => ({
                field: e.param || 'general',
                message: e.msg || e.message,
            })),
        });
    }
    // Error de base de datos (duplicados, etc.)
    if (err instanceof typeorm_1.QueryFailedError) {
        // Error de duplicado de clave única
        if (((_a = err.driverError) === null || _a === void 0 ? void 0 : _a.code) === '23505') {
            const detail = err.driverError.detail;
            const field = ((_b = detail.match(/\(([^)]+)\)/)) === null || _b === void 0 ? void 0 : _b[1]) || 'campo';
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
exports.errorHandler = errorHandler;
// Clase para errores personalizados
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
// Middleware para manejar rutas no encontradas
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Ruta no encontrada: ${req.originalUrl}`,
    });
};
exports.notFoundHandler = notFoundHandler;
