// src/components/Sidebar.tsx

import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import type { Category } from '../types/index';

interface SidebarProps {
  categories: Category[];
  selectedCategory: number | null;
  onSelectCategory: (id: number) => void;
}

function Sidebar({ categories, selectedCategory, onSelectCategory }: SidebarProps) {
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
      <Typography
        variant="subtitle2"
        fontWeight="bold"
        sx={{ mb: 1, color: '#555', textTransform: 'uppercase', letterSpacing: 1 }}
      >
        Product Categories
      </Typography>

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
              '&:hover': { backgroundColor: '#e8eaf6' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText primary={cat.name} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}

export default Sidebar;