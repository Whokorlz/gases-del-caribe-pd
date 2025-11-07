# Gases del Caribe - Panel de Control

Aplicación web para la gestión de usuarios con autenticación segura y panel de control administrativo.

## 🚀 Características Principales

### Autenticación y Seguridad
- Registro de nuevos usuarios con validación
- Inicio de sesión seguro con JWT
- Rutas protegidas
- Manejo de sesiones
- Tokens de autenticación seguros

### Frontend
- Interfaz moderna con React y TypeScript
- Diseño responsivo con Material-UI
- Formularios con validación en tiempo real
- Manejo de estados con Context API
- Navegación con React Router

### Backend
- API RESTful con Express y TypeScript
- Base de datos PostgreSQL con TypeORM
- Migraciones para el control de esquemas
- Validación de datos en el servidor
- Manejo centralizado de errores

### Desarrollo
- Configuración con Docker para desarrollo y producción
- Variables de entorno para configuración
- Scripts útiles para desarrollo
- Documentación detallada

## 🛠️ Requisitos Previos

- Node.js v18 o superior
- npm v9 o superior
- Docker y Docker Compose (opcional pero recomendado)
- PostgreSQL 14 o superior (si no se usa Docker)

## 🚀 Instalación Rápida

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Whokorlz/gases-del-caribe-pd.git
   cd gases-del-caribe-PD
   ```

2. **Configuración del entorno**
   ```bash
   # Copiar archivos de ejemplo de variables de entorno
   cp packages/backend/.env.example packages/backend/.env
   cp packages/frontend/.env.example packages/frontend/.env.local
   ```
   
   Editar los archivos `.env` según sea necesario.

3. **Instalar dependencias**
   ```bash
   # Instalar dependencias del backend
   cd packages/backend
   npm install
   
   # Instalar dependencias del frontend
   cd ../frontend
   npm install
   cd ../..
   ```

## 🏃 Ejecución con Docker (Recomendado)

```bash
# Construir y levantar todos los servicios
docker-compose up --build

# Ejecutar en segundo plano
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Detener los servicios
docker-compose down

# Reconstruir imágenes forzadamente
docker-compose up --build --force-recreate
```

## 🖥️ Ejecución Local

### Backend
```bash
cd packages/backend

# Instalar dependencias (si no se han instalado)
npm install

# Iniciar en modo desarrollo
npm run dev

# O para producción
npm run build
npm start
```

### Frontend
```bash
cd packages/frontend

# Instalar dependencias (si no se han instalado)
npm install

# Iniciar servidor de desarrollo
npm start

# Construir para producción
npm run build
```

## 🌐 Acceso

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
- **Base de datos**: PostgreSQL en localhost:5432
- **Documentación de la API**: http://localhost:3001/api-docs (en desarrollo)

## 📊 Estructura del Proyecto

```
gases-del-caribe-PD/
├── packages/
│   ├── backend/               # Backend (Node.js + Express + TypeORM)
│   │   ├── src/
│   │   │   ├── config/       # Configuraciones
│   │   │   ├── controllers/  # Controladores
│   │   │   ├── middlewares/  # Middlewares
│   │   │   ├── models/       # Modelos de la base de datos
│   │   │   ├── routes/       # Rutas de la API
│   │   │   ├── services/     # Lógica de negocio
│   │   │   ├── app.ts        # Aplicación Express
│   │   │   └── index.ts      # Punto de entrada
│   │   └── package.json
│   │
│   └── frontend/             # Frontend (React + TypeScript + Material-UI)
│       ├── public/
│       └── src/
│           ├── components/   # Componentes reutilizables
│           ├── pages/        # Páginas de la aplicación
│           ├── services/     # Servicios API
│           ├── styles/       # Estilos globales
│           ├── App.tsx       # Componente principal
│           └── index.tsx     # Punto de entrada
│
├── docker-compose.yml        # Configuración de Docker Compose
└── README.md                # Este archivo
```

## 🔧 Variables de Entorno

Crear un archivo `.env` en `packages/backend/` basado en `.env.example`:

```env
# Base de datos
POSTGRES_USER=tu_usuario
POSTGRES_PASSWORD=tu_contraseña
POSTGRES_DB=nombre_base_datos
DB_HOST=localhost
DB_PORT=5432

# Servidor
PORT=3001
NODE_ENV=development

# Autenticación
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=24h
```

## 📝 Documentación de la API

La documentación de la API estará disponible en `http://localhost:3001/api-docs` una vez que el servidor esté en ejecución.

## 🧪 Pruebas

```bash
# Ejecutar pruebas del backend
cd packages/backend
npm test

# Ejecutar pruebas del frontend
cd ../frontend
npm test
```

## 🛡️ Seguridad

- Validación de entrada en todos los endpoints
- Protección contra inyección SQL mediante TypeORM
- Autenticación basada en JWT
- CORS configurado para desarrollo/producción
- Variables sensibles en archivos .env

## 🤝 Contribución

1. Hacer fork del proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Hacer commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Hacer push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

Desarrollado con ❤️ por [Tu Nombre]