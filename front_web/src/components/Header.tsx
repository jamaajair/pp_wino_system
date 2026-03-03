// front_web/src/components/Header.tsx

import { AppBar, Toolbar, Typography, IconButton, Badge, Box } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

function Header() {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#1a237e' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>

        {/* GAUCHE : Logo + Titre */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              backgroundColor: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: '#1a237e',
              fontSize: '1rem',
            }}
          >
            W
          </Box>
          <Typography variant="h6" fontWeight="bold" color="white">
            Wino Webshop
          </Typography>
        </Box>

        {/* DROITE : Icônes */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="inherit">
            <AccountCircleIcon />
          </IconButton>
          <IconButton color="inherit">
            <Badge badgeContent={3} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          <Typography variant="body2" color="white" sx={{ ml: 1 }}>
            Login / Profile
          </Typography>
        </Box>

      </Toolbar>
    </AppBar>
  );
}

export default Header;