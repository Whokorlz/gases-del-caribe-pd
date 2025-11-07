import React from 'react';
import { Box, Typography, Container, Paper, Tabs, Tab } from '@mui/material';

/**
 * Página de configuración de la aplicación
 * Permite ajustar los parámetros del sistema y preferencias del usuario
 */
const Configuracion: React.FC = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Configuración
        </Typography>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="configuracion tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="General" />
            <Tab label="Usuarios" />
            <Tab label="Permisos" />
            <Tab label="Empresa" />
          </Tabs>
        </Paper>
        <Typography variant="body1">
          Ajusta las configuraciones del sistema según tus necesidades.
        </Typography>
      </Box>
    </Container>
  );
};

export default Configuracion;
