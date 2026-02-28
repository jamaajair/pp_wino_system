// ========================================
// COMPOSANT HEADER - En-tête de l'application
// ========================================

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import {
  ShoppingCart,
  ShoppingCartOutlined,
  AccountCircle,
} from '@mui/icons-material';

// ========================================
// COMPOSANT HEADER
// ========================================
const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        {/* Logo + Nom */}
        <IconButton color="inherit" edge="start">
          <ShoppingCart />
        </IconButton>
        
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          MB Food
        </Typography>

        {/* Actions utilisateur */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton color="inherit">
            <ShoppingCartOutlined />
          </IconButton>
          
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;