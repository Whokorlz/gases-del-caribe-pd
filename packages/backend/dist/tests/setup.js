"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Configuración global para las pruebas de Jest
const dotenv_1 = __importDefault(require("dotenv"));
const logger_config_1 = require("../config/logger.config");
// Cargar variables de entorno desde el archivo .env
dotenv_1.default.config({ path: '.env.test' });
// Configuración global antes de las pruebas
beforeAll(async () => {
    // Configurar cualquier configuración global necesaria antes de las pruebas
    logger_config_1.logger.info('Configurando entorno de pruebas...');
});
// Configuración después de todas las pruebas
afterAll(async () => {
    // Limpiar cualquier recurso después de las pruebas
    logger_config_1.logger.info('Limpieza después de las pruebas...');
});
// Configuración antes de cada prueba
beforeEach(() => {
    // Configuración antes de cada prueba
    jest.clearAllMocks();
});
// Configuración después de cada prueba
afterEach(() => {
    // Limpieza después de cada prueba
});
// Configurar entorno de prueba global
const globalAny = global;
globalAny.__TEST_ENV__ = 'test';
