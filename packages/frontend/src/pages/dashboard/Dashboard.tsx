import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const Dashboard: React.FC = () => {
  const { logout } = useAuth();

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          Bienvenido al Dashboard
        </Typography>
        <Typography variant="body1" paragraph>
          Has iniciado sesión correctamente.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={logout}
          sx={{ mt: 3 }}
        >
          Cerrar Sesión
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;