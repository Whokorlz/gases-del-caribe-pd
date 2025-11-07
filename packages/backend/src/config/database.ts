import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Usuario } from '@models/Usuario';
import { Sesion } from '@models/Sesion';

// Cargar variables de entorno
const {
  DB_HOST = 'localhost',
  DB_PORT = '5432',
  POSTGRES_USER = 'gases-del-caribe',
  POSTGRES_PASSWORD = 'db-gases-del-caribe-pass',
  POSTGRES_DB = 'gases-del-caribe',
  NODE_ENV = 'development'
} = process.env;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: parseInt(DB_PORT),
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  synchronize: NODE_ENV !== 'production', // No usar en producción
  logging: NODE_ENV === 'development',
  entities: [Usuario, Sesion],
  migrations: [],
  subscribers: [],
  ssl: NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  extra: {
    // Configuración adicional para conexión
    connectionLimit: 10,
  },
});

// Función para inicializar la conexión a la base de datos
export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Conexión a la base de datos establecida correctamente');
    return AppDataSource;
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
    process.exit(1);
  }
};

// Función para cerrar la conexión a la base de datos
export const closeDatabase = async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    console.log('🔌 Conexión a la base de datos cerrada');
  }
};

// Manejar cierre de la aplicación
process.on('SIGTERM', async () => {
  await closeDatabase();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await closeDatabase();
  process.exit(0);
});