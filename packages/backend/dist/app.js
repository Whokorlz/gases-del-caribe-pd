"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const database_1 = require("./config/database");
const auth_routes_1 = require("./routes/auth.routes");
const error_handler_1 = require("./middlewares/error-handler");
const logger_config_1 = require("./config/logger.config");
const swagger_config_1 = require("./config/swagger.config");
const app = (0, express_1.default)();
// Configuración de middlewares básicos
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Configuración de logging de solicitudes HTTP
app.use((0, morgan_1.default)(':remote-addr - :remote-user [:date[clf]] \":method :url HTTP/:http-version\" :status :res[content-length] \":referrer\" \":user-agent\" - :response-time ms', { stream: logger_config_1.httpLogger }));
// Configuración de Swagger
(0, swagger_config_1.setupSwagger)(app);
// Middleware para registrar información de la solicitud
app.use((req, res, next) => {
    logger_config_1.logger.info(`[${req.method}] ${req.originalUrl}`, {
        ip: req.ip,
        userAgent: req.get('user-agent'),
        body: req.body,
        query: req.query,
    });
    next();
});
// Rutas de la API
app.use("/api/auth", auth_routes_1.authRouter);
// Ruta de prueba
app.get("/", (_req, res) => {
    res.json({
        success: true,
        message: "API de Gases del Caribe - Panel de Control"
    });
});
// Manejador de rutas no encontradas
app.use(error_handler_1.notFoundHandler);
// Manejador de errores global
app.use(error_handler_1.errorHandler);
// Inicializar la base de datos
const startServer = async () => {
    try {
        logger_config_1.logger.info('Iniciando la aplicación...');
        // Inicializar la conexión a la base de datos
        await (0, database_1.initializeDatabase)();
        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => {
            logger_config_1.logger.info(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
            logger_config_1.logger.info(`📚 Documentación de la API disponible en http://localhost:${PORT}/api-docs`);
            // Registrar información del entorno
            logger_config_1.logger.info('Configuración del entorno:', {
                nodeEnv: process.env.NODE_ENV || 'development',
                port: PORT,
                dbHost: process.env.DB_HOST,
                dbName: process.env.DB_NAME,
            });
        });
        // Manejar cierre limpio del servidor
        process.on('SIGTERM', () => {
            logger_config_1.logger.info('Recibida señal SIGTERM. Cerrando servidor...');
            process.exit(0);
        });
        process.on('uncaughtException', (error) => {
            logger_config_1.logger.error('Excepción no capturada:', error);
            process.exit(1);
        });
        process.on('unhandledRejection', (reason) => {
            logger_config_1.logger.error('Promesa rechazada no manejada:', reason);
        });
    }
    catch (error) {
        logger_config_1.logger.error('Error crítico al iniciar el servidor:', error);
        process.exit(1);
    }
};
// Iniciar el servidor
startServer();
exports.default = app;
