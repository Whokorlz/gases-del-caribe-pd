// Asegurar que TypeScript reconozca los tipos de Jest
import '@types/jest';

declare global {
  // Asegurar que los tipos de Jest estén disponibles globalmente
  const describe: typeof jest.Describe;
  const it: jest.It;
  const test: jest.It;
  const expect: jest.Expect;
  const beforeAll: jest.Lifecycle;
  const afterAll: jest.Lifecycle;
  const beforeEach: jest.Lifecycle;
  const afterEach: jest.Lifecycle;
  const jest: jest.Jest;

  // Extender el tipo de jest.Mock para incluir mockResolvedValue y mockRejectedValue
  interface Mock<T = any, Y extends any[] = any> extends jest.Mock<T, Y> {
    mockResolvedValue: (value: T) => this;
    mockRejectedValue: (value: any) => this;
  }
}
