import { Box, Typography } from '@mui/material';

function WelcomeScreen() {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          backgroundColor: '#1a237e',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          color: 'white',
          fontSize: '2.2rem',
          boxShadow: '0 4px 20px rgba(26,35,126,0.3)',
        }}
      >
        W
      </Box>
      <Typography variant="h4" fontWeight="bold" color="#1a237e">
        Wino Webshop
      </Typography>
      <Typography variant="body1" color="#9e9e9e">
        Sélectionnez une section dans le menu pour commencer
      </Typography>
    </Box>
  );
}

export default WelcomeScreen;
