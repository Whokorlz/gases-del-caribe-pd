# Caribbean Gases - Control Panel

Web application for user management with secure authentication and an administrative control panel.

## 🚀 Main Features

### Authentication and Security
- New user registration with validation
- Secure login with JWT
- Protected routes
- Session management
- Secure authentication tokens

### Frontend
- Modern interface with React and TypeScript
- Responsive design with Material UI
- Forms with real-time validation
- State management with Context API
- Navigation with React Router

### Backend
- RESTful API with Express and TypeScript
- PostgreSQL database with TypeORM
- Migrations for schema control
- Server-side data validation
- Centralized error handling

### Development
- Docker configuration for development and production
- Environment variables for configuration
- Useful scripts for development
- Detailed documentation

## 🛠️ Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- Docker and Docker Compose (optional but recommended)
- PostgreSQL 14 or higher (if not using Docker)

## 🚀 Quick Installation

1. **Clone the repository**

```bash

git clone https://github.com/Whokorlz/gases-del-caribe-pd.git

cd gases-del-caribe-PD

``

2. **Environment configuration**
```bash

# Copy example environment variable files

cp packages/backend/.env.example

cp packages/frontend/.env.example

``

Edit the `.env` files as needed.

3. **Installing Dependencies**
```bash

# Install backend dependencies

cd packages/backend

npm install

# Install frontend dependencies

cd ../frontend

npm install

cd ../..

``

## 🏃 Running with Docker (Recommended)

```bash
# Build and start all services

docker-compose up --build

# Run in the background

docker-compose up -d

# View logs in real time

docker-compose logs -f

# Stop services

docker-compose down

# Force rebuild images

docker-compose up --build --force-recreate
```

## 🖥️ Local Run

### Backend
```bash

cd packages/backend

# Install dependencies (if they haven't been installed) (installed)
npm install

# Start in development mode
npm run dev

# Or for production
npm run build
npm start
```

### Frontend
```bash
cd packages/frontend

# Install dependencies (if not already installed)
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 🌐 Access

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
- **Database**: PostgreSQL on localhost:5432
- **API documentation**: http://localhost:3001/api-docs (under development)

## 📊 Project Structure

```
gases-del-caribe-PD/
├── packages/
│ ├── backend/ # Backend (Node.js + Express + TypeORM)
│ │ ├── src/
│ │ │ ├── config/ # Configurations
│ │ │ ├── controllers/ # Controllers
│ │ │ ├── middlewares/ # Middlewares
│ │ │ ├── models/ # Database Models
│ │ │ ├── routes/ # API Routes
│ │ │ ├── services/ # Business Logic
│ │ │ ├── app.ts # Express Application
│ │ │ └── index.ts # Entry Point
│ │ └── package.json
│ │
│ └── frontend/ # Frontend (React + TypeScript + Material-UI)
│ ├── public/
│ └── src/
│ ├── components/ # Reusable Components
│ ├── pages/ # Application Pages
│ ├── services/ # API Services
│ ├── styles/ # Global Styles
│ ├── App.tsx # Main Component
│ └── index.tsx # Entry Point
│
├── docker-compose.yml # Docker Compose Configuration
└── README.md # This File
```

## 🔧 Environment Variables

Create a `.env` file in `packages/backend/` based on `.env.example`:

```env
# Database
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
POSTGRES_DB=database_name
DB_HOST=localhost
DB_PORT=5432

# Server
PORT=3001
NODE_ENV=development

# Authentication
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h
```

## 📝 API Documentation

The API documentation will be available at `http://localhost:3001/api-docs` once the server is running.


## 🧪 Testing

```bash
# Run backend tests
cd packages/backend
npm test

# Run frontend tests
cd ../frontend
npm test
```

## 🛡️ Security

- Input validation on all endpoints
- SQL injection protection using TypeORM
- JWT-based authentication
- CORS configured for development/production
- Sensitive variables in .env files

## 🤝 Contribution

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch

## Author: Keshia Lambis