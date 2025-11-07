"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
// Opciones de configuración de Swagger
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Gases del Caribe',
            version: '1.0.0',
            description: 'Documentación de la API para el panel de control de Gases del Caribe',
            contact: {
                name: 'Soporte Técnico',
                email: 'soporte@gasesdelcaribe.com',
            },
        },
        servers: [
            {
                url: 'http://localhost:3001',
                description: 'Servidor de desarrollo',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    name: 'JWT',
                    description: 'Ingrese el token JWT',
                    in: 'header',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    // Ruta a los archivos que contienen anotaciones de Swagger
    apis: ['./src/routes/*.ts', './src/models/*.ts'],
};
// Inicializar Swagger
const specs = (0, swagger_jsdoc_1.default)(options);
/**
 * Configura las rutas de Swagger UI
 * @param app Instancia de la aplicación Express
 */
const setupSwagger = (app) => {
    // Ruta para la documentación de la API
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs, {
        explorer: true,
        customSiteTitle: 'API Gases del Caribe',
        customCss: '.swagger-ui .topbar { display: none }',
        customfavIcon: 'https://www.gasesdelcaribe.com/favicon.ico',
    }));
    // Ruta para el JSON de la especificación OpenAPI
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(specs);
    });
};
exports.setupSwagger = setupSwagger;
exports.default = specs;
