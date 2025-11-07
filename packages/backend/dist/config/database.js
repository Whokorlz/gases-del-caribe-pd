"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDatabase = exports.initializeDatabase = exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Usuario_1 = require("@models/Usuario");
const Sesion_1 = require("@models/Sesion");
// Cargar variables de entorno
const { DB_HOST = 'localhost', DB_PORT = '5432', POSTGRES_USER = 'gases-del-caribe', POSTGRES_PASSWORD = 'db-gases-del-caribe-pass', POSTGRES_DB = 'gases-del-caribe', NODE_ENV = 'development' } = process.env;
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: DB_HOST,
    port: parseInt(DB_PORT),
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB,
    synchronize: NODE_ENV !== 'production', // No usar en producción
    logging: NODE_ENV === 'development',
    entities: [Usuario_1.Usuario, Sesion_1.Sesion],
    migrations: [],
    subscribers: [],
    ssl: NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    extra: {
        // Configuración adicional para conexión
        connectionLimit: 10,
    },
});
// Función para inicializar la conexión a la base de datos
const initializeDatabase = async () => {
    try {
        await exports.AppDataSource.initialize();
        console.log('✅ Conexión a la base de datos establecida correctamente');
        return exports.AppDataSource;
    }
    catch (error) {
        console.error('❌ Error al conectar a la base de datos:', error);
        process.exit(1);
    }
};
exports.initializeDatabase = initializeDatabase;
// Función para cerrar la conexión a la base de datos
const closeDatabase = async () => {
    if (exports.AppDataSource.isInitialized) {
        await exports.AppDataSource.destroy();
        console.log('🔌 Conexión a la base de datos cerrada');
    }
};
exports.closeDatabase = closeDatabase;
// Manejar cierre de la aplicación
process.on('SIGTERM', async () => {
    await (0, exports.closeDatabase)();
    process.exit(0);
});
process.on('SIGINT', async () => {
    await (0, exports.closeDatabase)();
    process.exit(0);
});
