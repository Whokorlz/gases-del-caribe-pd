import React from 'react';
import { Box, Typography, Container } from '@mui/material';

/**
 * Página de gestión de proveedores
 * Permite administrar la información de los proveedores de la empresa
 */
const Proveedores: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestión de Proveedores
        </Typography>
        <Typography variant="body1">
          Administra la información de los proveedores de la empresa.
        </Typography>
      </Box>
    </Container>
  );
};

export default Proveedores;
