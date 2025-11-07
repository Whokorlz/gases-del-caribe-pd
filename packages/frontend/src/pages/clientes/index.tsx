import React from 'react';
import { Box, Typography, Container } from '@mui/material';

/**
 * Página de gestión de clientes
 * Muestra el listado de clientes y permite su administración
 */
const Clientes: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestión de Clientes
        </Typography>
        <Typography variant="body1">
          Administra la información de los clientes de la empresa.
        </Typography>
      </Box>
    </Container>
  );
};

export default Clientes;
