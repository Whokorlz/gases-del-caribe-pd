import { DataSource } from 'typeorm';
import { Usuario } from '@models/Usuario';
import { Sesion } from '@models/Sesion';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // Solo para desarrollo
  logging: false,
  entities: [Usuario, Sesion],
  migrations: [],
  subscribers: [],
});