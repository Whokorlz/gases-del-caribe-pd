import app from './app';
import { sequelize } from './config/database';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Sincronizar modelos con la base de datos
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
    
    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados con la base de datos.');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();