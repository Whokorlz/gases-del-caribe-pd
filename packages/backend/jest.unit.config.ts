import type { Config } from '@jest/types';
import baseConfig from './jest.config';

// Configuración específica para pruebas unitarias
const config: Config.InitialOptions = {
  ...baseConfig,
  testMatch: ['**/__tests__/unit/**/*.test.ts'],
  testTimeout: 10000, // Tiempo de espera para pruebas unitarias
};

export default config;
