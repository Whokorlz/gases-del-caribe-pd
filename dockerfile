# Usar una imagen base de Node.js
FROM node:18-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de dependencias del backend
COPY packages/backend/package*.json ./

# Instalar dependencias
RUN npm install -g typescript

# Copiar el resto de los archivos del backend
COPY packages/backend/ .

# Construir la aplicación
RUN npm install

# Puerto en el que se ejecutará la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]