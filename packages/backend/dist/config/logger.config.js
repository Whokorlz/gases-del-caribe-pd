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
exports.logInfo = exports.logError = exports.httpLogger = exports.logger = void 0;
const winston = __importStar(require("winston"));
const path = __importStar(require("path"));
require("winston-daily-rotate-file");
/**
 * Configuración del sistema de logging
 * Utiliza winston para logging estructurado con rotación de archivos
 */
// Formato para los logs
const logFormat = winston.format.combine(winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
}), winston.format.errors({ stack: true }), winston.format.splat(), winston.format.json());
// Configuración para desarrollo (consola con colores)
const consoleFormat = winston.format.combine(winston.format.colorize(), winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
}), winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}` +
    (info.stack ? `\n${info.stack}` : '')));
// Crear el logger principal
exports.logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    defaultMeta: { service: 'gases-caribe-api' },
    transports: [
        // Escribir todos los logs con nivel 'error' y menores a 'error.log'
        new winston.transports.DailyRotateFile({
            filename: path.join('logs', 'error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxSize: '20m',
            maxFiles: '14d',
        }),
        // Escribir todos los logs con nivel 'info' y menores a 'combined.log'
        new winston.transports.DailyRotateFile({
            filename: path.join('logs', 'combined-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d',
        }),
    ],
});
// Si no estamos en producción, también mostramos los logs en la consola
if (process.env.NODE_ENV !== 'production') {
    exports.logger.add(new winston.transports.Console({
        format: consoleFormat,
        level: 'debug',
    }));
}
// Middleware para registrar las solicitudes HTTP
exports.httpLogger = {
    write: (message) => {
        const logMessage = message.trim();
        if (logMessage.includes(' 500 ') || logMessage.includes(' 4')) {
            exports.logger.error('HTTP ' + logMessage);
        }
        else {
            exports.logger.info('HTTP ' + logMessage);
        }
    },
};
/**
 * Función para registrar errores inesperados
 * @param error Error capturado
 * @param context Contexto opcional para identificar el origen del error
 */
const logError = (error, context) => {
    const errorContext = context ? `[${context}] ` : '';
    exports.logger.error(`${errorContext}${error.message}`, { stack: error.stack });
};
exports.logError = logError;
/**
 * Función para registrar información de depuración
 * @param message Mensaje a registrar
 * @param meta Metadatos adicionales
 */
const logInfo = (message, meta) => {
    exports.logger.info(message, meta);
};
exports.logInfo = logInfo;
