import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { containerStyles, paperStyles } from '../styles/Messaggi.styles';

const Messaggi = () => {
  return (
    <Box sx={containerStyles}>
      <Paper sx={paperStyles}>
        <Typography variant="h6" gutterBottom>
          Messaggi
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Nessun messaggio da visualizzare
        </Typography>
      </Paper>
    </Box>
  );
};

export default Messaggi; 