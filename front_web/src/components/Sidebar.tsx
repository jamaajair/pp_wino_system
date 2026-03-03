// front_web/src/components/Sidebar.tsx

import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import HomeIcon from '@mui/icons-material/Home';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ChairIcon from '@mui/icons-material/Chair';

// Données statiques des catégories
const categories = [
  { id: 1, label: 'Beverages',        icon: <LocalDrinkIcon /> },
  { id: 2, label: 'Groceries',        icon: <ShoppingBasketIcon /> },
  { id: 3, label: 'Home',             icon: <HomeIcon /> },
  { id: 4, label: 'Office Supplies',  icon: <BusinessCenterIcon /> },
  { id: 5, label: 'Furniture',        icon: <ChairIcon /> },
];

interface SidebarProps {
  selectedCategory: number;
  onSelectCategory: (id: number) => void;
}

function Sidebar({ selectedCategory, onSelectCategory }: SidebarProps) {
  return (
    <Box
      sx={{
        width: 220,
        minWidth: 220,
        backgroundColor: 'white',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        p: 2,
        alignSelf: 'flex-start',
      }}
    >
      {/* Titre */}
      <Typography
        variant="subtitle2"
        fontWeight="bold"
        sx={{ mb: 1, color: '#555', textTransform: 'uppercase', letterSpacing: 1 }}
      >
        Product Categories
      </Typography>

      {/* Liste des catégories */}
      <List disablePadding>
        {categories.map((cat) => (
          <ListItemButton
            key={cat.id}
            selected={selectedCategory === cat.id}
            onClick={() => onSelectCategory(cat.id)}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              '&.Mui-selected': {
                backgroundColor: '#1a237e',
                color: 'white',
                '& .MuiListItemIcon-root': { color: 'white' },
                '&:hover': { backgroundColor: '#1a237e' },
              },
              '&:hover': {
                backgroundColor: '#e8eaf6',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              {cat.icon}
            </ListItemIcon>
            <ListItemText primary={cat.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}

export default Sidebar;