import { AppBar, Toolbar, Typography, IconButton, Badge, Box } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  count: number;
  onLogout: () => void;
  setView: React.Dispatch<React.SetStateAction<'shop' | 'cart'>>;
}

function Header({ count, onLogout, setView }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1a237e' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>

        {/* GAUCHE : Logo + Titre */}
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
          onClick={() => navigate('/shop')}
        >
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
          <IconButton color="inherit" onClick={() => setView('cart')}>
            <Badge badgeContent={count} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          <Typography
            variant="body2"
            color="white"
            sx={{ ml: 1, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            onClick={onLogout}
          >
            Déconnexion
          </Typography>
        </Box>

      </Toolbar>
    </AppBar>
  );
}

export default Header;
