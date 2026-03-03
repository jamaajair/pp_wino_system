// front_web/src/components/Footer.tsx

import { Box, Typography } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#1a237e',
        color: 'white',
        py: 2,
        mt: 'auto',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
    >
      <Typography variant="body2">
        © 2026 Wino Webshop — All rights reserved
      </Typography>
      <Typography variant="body2">
        © 2026 Wino Webshop — All rights reserved
      </Typography>
    </Box>
  );
}

export default Footer;