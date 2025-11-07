import type { Config } from '@jest/types';

// Configuración de Jest para TypeScript
export default async (): Promise<Config.InitialOptions> => {
  return {
    // Directorio raíz de pruebas
    roots: ['<rootDir>/src'],
    
    // Extensión de archivos de prueba
    testMatch: [
      '**/__tests__/**/*.+(ts|tsx|js)',
      '**/?(*.)+(spec|test).+(ts|tsx|js)',
    ],
    
    // Transformar archivos TypeScript
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    
    // Configuración de cobertura
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
    collectCoverageFrom: [
      'src/**/*.{ts,tsx}',
      '!src/**/*.d.ts',
      '!src/index.ts',
      '!src/**/__tests__/**',
      '!**/node_modules/**',
    ],
    
    // Configuración de módulos
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
    },
    
    // Configuración de entorno
    testEnvironment: 'node',
    preset: 'ts-jest',
    
    // Configuración de reportes
    verbose: true,
    
    // Configuración de limpieza
    clearMocks: true,
    resetMocks: true,
    
    // Configuración de rutas
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    
    // Configuración de rutas de búsqueda
    modulePaths: ['<rootDir>/src'],
    
    // Configuración de hooks
    setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  };
};
