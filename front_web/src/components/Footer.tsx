// ========================================
// COMPOSANT FOOTER - Pied de page
// ========================================

import { Box, Typography, Container } from '@mui/material';

// ========================================
// COMPOSANT FOOTER
// ========================================
const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        py: 3,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} MB Food - Tous droits réservés
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;