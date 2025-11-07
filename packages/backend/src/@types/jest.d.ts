// Asegurar que TypeScript reconozca los tipos de Jest
declare const describe: jest.Describe;
declare const it: jest.It;
declare const expect: jest.Expect;
declare const beforeAll: jest.Lifecycle;
declare const afterAll: jest.Lifecycle;
declare const beforeEach: jest.Lifecycle;
declare const afterEach: jest.Lifecycle;
declare const jest: any; // Usamos 'any' temporalmente para evitar conflictos
