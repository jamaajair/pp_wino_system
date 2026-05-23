import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import {
  LayoutDashboard,
  Users,
  FileText,
  Package,
  Truck,
  Warehouse,
  DollarSign,
} from 'lucide-react';

export type SectionKey = 'dashboard' | 'clients' | 'ventes' | 'articles' | 'fournisseurs' | 'stock' | 'finances';

interface SidebarItem {
  key: SectionKey;
  label: string;
  icon: React.ReactNode;
}

const ALL_ITEMS: SidebarItem[] = [
  { key: 'dashboard',    label: 'Tableau de Bord', icon: <LayoutDashboard size={20} /> },
  { key: 'clients',      label: 'Clients',         icon: <Users size={20} /> },
  { key: 'ventes',       label: 'Ventes',          icon: <FileText size={20} /> },
  { key: 'articles',     label: 'Articles',        icon: <Package size={20} /> },
  { key: 'fournisseurs', label: 'Fournisseurs',    icon: <Truck size={20} /> },
  { key: 'stock',        label: 'Stock',           icon: <Warehouse size={20} /> },
  { key: 'finances',     label: 'Finances',        icon: <DollarSign size={20} /> },
];

const ROLE_SECTIONS: Record<string, SectionKey[]> = {
  ADMIN:     ['dashboard', 'clients', 'ventes', 'articles', 'fournisseurs', 'stock', 'finances'],
  MANAGER:   ['dashboard', 'clients', 'ventes', 'articles', 'fournisseurs', 'finances'],
  SALES:     ['dashboard', 'clients', 'ventes', 'articles'],
  WAREHOUSE: ['dashboard', 'articles', 'stock'],
};

interface AgentSidebarProps {
  role: string;
  activeSection: SectionKey | null;
  onSectionChange: (section: SectionKey) => void;
}

function AgentSidebar({ role, activeSection, onSectionChange }: AgentSidebarProps) {
  const allowedSections = ROLE_SECTIONS[role] ?? [];
  const visibleItems = ALL_ITEMS.filter(item => allowedSections.includes(item.key));

  return (
    <Box
      sx={{
        width: 220,
        minHeight: '100vh',
        backgroundColor: '#1a237e',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2.5,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Box
          sx={{
            width: 34,
            height: 34,
            backgroundColor: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            color: '#1a237e',
            fontSize: '1rem',
            flexShrink: 0,
          }}
        >
          W
        </Box>
        <Typography fontWeight="bold" color="white" fontSize="1rem">
          Wino
        </Typography>
      </Box>

      {/* Navigation */}
      <List sx={{ pt: 1, flex: 1 }}>
        {visibleItems.map(item => {
          const isActive = activeSection === item.key;
          return (
            <ListItemButton
              key={item.key}
              onClick={() => onSectionChange(item.key)}
              sx={{
                mx: 1,
                mb: 0.5,
                borderRadius: 2,
                color: isActive ? '#1a237e' : 'rgba(255,255,255,0.75)',
                backgroundColor: isActive ? 'white' : 'transparent',
                '&:hover': {
                  backgroundColor: isActive ? 'white' : 'rgba(255,255,255,0.1)',
                  color: isActive ? '#1a237e' : 'white',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  color: 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: isActive ? 600 : 400 }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}

export default AgentSidebar;
