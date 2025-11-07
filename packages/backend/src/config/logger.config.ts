import * as winston from 'winston';
import * as path from 'path';
import 'winston-daily-rotate-file';

/**
 * Configuración del sistema de logging
 * Utiliza winston para logging estructurado con rotación de archivos
 */

// Formato para los logs
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Configuración para desarrollo (consola con colores)
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.printf(
    (info) =>
      `${info.timestamp} ${info.level}: ${info.message}` +
      (info.stack ? `\n${info.stack}` : '')
  )
);

// Crear el logger principal
export const logger = winston.createLogger({
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
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
      level: 'debug',
    })
  );
}

// Middleware para registrar las solicitudes HTTP
export const httpLogger = {
  write: (message: string) => {
    const logMessage = message.trim();
    if (logMessage.includes(' 500 ') || logMessage.includes(' 4')) {
      logger.error('HTTP ' + logMessage);
    } else {
      logger.info('HTTP ' + logMessage);
    }
  },
};

/**
 * Función para registrar errores inesperados
 * @param error Error capturado
 * @param context Contexto opcional para identificar el origen del error
 */
export const logError = (error: Error, context?: string) => {
  const errorContext = context ? `[${context}] ` : '';
  logger.error(`${errorContext}${error.message}`, { stack: error.stack });
};

/**
 * Función para registrar información de depuración
 * @param message Mensaje a registrar
 * @param meta Metadatos adicionales
 */
export const logInfo = (message: string, meta?: any) => {
  logger.info(message, meta);
};
