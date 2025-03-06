import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { containerStyles, paperStyles } from '../styles/Utenti.styles';

const Utenti = () => {
  return (
    <Box sx={containerStyles}>
      <Paper sx={paperStyles}>
        <Typography variant="h6" gutterBottom>
          Utenti
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Gestisci gli utenti del sistema
        </Typography>
      </Paper>
    </Box>
  );
};

export default Utenti; 