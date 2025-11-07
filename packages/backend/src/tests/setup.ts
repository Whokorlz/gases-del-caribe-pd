// Configuración global para las pruebas de Jest
import dotenv from 'dotenv';
import { logger } from '../config/logger.config';

// Cargar variables de entorno desde el archivo .env
dotenv.config({ path: '.env.test' });

// Configuración global antes de las pruebas
beforeAll(async () => {
  // Configurar cualquier configuración global necesaria antes de las pruebas
  logger.info('Configurando entorno de pruebas...');
});

// Configuración después de todas las pruebas
afterAll(async () => {
  // Limpiar cualquier recurso después de las pruebas
  logger.info('Limpieza después de las pruebas...');
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

// Configuración de variables globales para TypeScript
declare global {
  // eslint-disable-next-line no-var, @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      // Variable para identificar el entorno de prueba
      __TEST_ENV__: string;
    }
  }
}

// Configurar entorno de prueba global
const globalAny = global as any;
globalAny.__TEST_ENV__ = 'test';
