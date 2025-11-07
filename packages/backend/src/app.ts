import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { initializeDatabase } from './config/database';
import { authRouter } from './routes/auth.routes';
import { errorHandler, notFoundHandler } from './middlewares/error-handler';
import { logger, httpLogger } from './config/logger.config';
import { setupSwagger } from './config/swagger.config';

const app = express();

// Configuración de middlewares básicos
app.use(cors());
app.use(express.json());

// Configuración de logging de solicitudes HTTP
app.use(
  morgan(
    ':remote-addr - :remote-user [:date[clf]] \":method :url HTTP/:http-version\" :status :res[content-length] \":referrer\" \":user-agent\" - :response-time ms',
    { stream: httpLogger }
  )
);

// Configuración de Swagger
setupSwagger(app);

// Middleware para registrar información de la solicitud
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`[${req.method}] ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
    body: req.body,
    query: req.query,
  });
  next();
});

// Rutas de la API
app.use("/api/auth", authRouter);

// Ruta de prueba
app.get("/", (_req: Request, res: Response) => {
  res.json({ 
    success: true,
    message: "API de Gases del Caribe - Panel de Control" 
  });
});

// Manejador de rutas no encontradas
app.use(notFoundHandler);

// Manejador de errores global
app.use(errorHandler);

// Inicializar la base de datos
const startServer = async () => {
  try {
    logger.info('Iniciando la aplicación...');
    
    // Inicializar la conexión a la base de datos
    await initializeDatabase();
    
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      logger.info(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
      logger.info(`📚 Documentación de la API disponible en http://localhost:${PORT}/api-docs`);
      
      // Registrar información del entorno
      logger.info('Configuración del entorno:', {
        nodeEnv: process.env.NODE_ENV || 'development',
        port: PORT,
        dbHost: process.env.DB_HOST,
        dbName: process.env.DB_NAME,
      });
    });
    
    // Manejar cierre limpio del servidor
    process.on('SIGTERM', () => {
      logger.info('Recibida señal SIGTERM. Cerrando servidor...');
      process.exit(0);
    });
    
    process.on('uncaughtException', (error) => {
      logger.error('Excepción no capturada:', error);
      process.exit(1);
    });
    
    process.on('unhandledRejection', (reason) => {
      logger.error('Promesa rechazada no manejada:', reason);
    });
    
  } catch (error) {
    logger.error('Error crítico al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Iniciar el servidor
startServer();

export default app;