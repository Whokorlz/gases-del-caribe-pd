import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  CircularProgress, 
  Paper,
  useTheme 
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

/**
 * Componente Dashboard
 * Muestra un mensaje de bienvenida al usuario
 */
const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const { logout } = useAuth();

  // Simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container component="main" maxWidth="md">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mt: 4,
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom color="primary">
          ¡Bienvenido a Gases del Caribe!
        </Typography>
        
        <Typography variant="h6" paragraph sx={{ mt: 2, color: 'text.secondary' }}>
          Panel de Administración
        </Typography>
        
        <Typography variant="body1" paragraph>
          Has iniciado sesión correctamente en el sistema de gestión de Gases del Caribe.
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          Último acceso: {new Date().toLocaleString()}
        </Typography>
      </Paper>
    </Container>
  );
};

export default Dashboard;