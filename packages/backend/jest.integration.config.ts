import type { Config } from '@jest/types';
import baseConfig from './jest.config';

// Configuración específica para pruebas de integración
const config: Config.InitialOptions = {
  ...baseConfig,
  testMatch: ['**/__tests__/integration/**/*.test.ts'],
  testTimeout: 30000, // Tiempo de espera mayor para pruebas de integración
};

export default config;
