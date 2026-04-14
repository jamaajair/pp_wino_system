import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { LogOut } from 'lucide-react';
import type { SectionKey } from './AgentSidebar';

interface ActionButton {
  label: string;
  onClick: () => void;
}

interface AgentHeaderProps {
  activeSection: SectionKey | null;
  username: string;
  onLogout: () => void;
  onAction?: (action: string) => void;
  setCurrentTask?: (task: string | null) => void;
}

function getHeaderButtons(section: SectionKey | null, onAction?: (action: string) => void): ActionButton[] {
  if (!section || !onAction) return [];

  const config: Record<SectionKey, ActionButton[]> = {
    dashboard: [],
    clients: [
      { label: '+ Ajouter Client',  onClick: () => onAction('add-client') },
      { label: 'Trouver Client',    onClick: () => onAction('find-client') },
    ],
    ventes: [
      { label: '+ Nouveau Devis',      onClick: () => onAction('new-quote') },
      { label: '+ Nouvelle Commande',  onClick: () => onAction('new-order') },
      { label: '+ Nouvelle Facture',   onClick: () => onAction('new-invoice') },
      { label: '+ Note de Crédit',     onClick: () => onAction('new-credit-note') },
    ],
    articles: [
      { label: '+ Nouvel Article', onClick: () => onAction('new-article') },
      { label: 'Rechercher',       onClick: () => onAction('search-article') },
    ],
    fournisseurs: [
      { label: '+ Ajouter Fournisseur', onClick: () => onAction('add-supplier') },
    ],
    stock: [
      { label: '+ Entrée Stock',  onClick: () => onAction('stock-in') },
      { label: '+ Sortie Stock',  onClick: () => onAction('stock-out') },
    ],
    finances: [
      { label: '+ Nouvelle Transaction', onClick: () => onAction('new-transaction') },
    ],
  };

  return config[section] ?? [];
}

function AgentHeader({ activeSection, username, onLogout, onAction, setCurrentTask }: AgentHeaderProps) {
  const buttons = getHeaderButtons(activeSection, onAction);

  const sectionLabels: Record<SectionKey, string> = {
    dashboard:    'Tableau de Bord',
    clients:      'Clients',
    ventes:       'Ventes',
    articles:     'Articles',
    fournisseurs: 'Fournisseurs',
    stock:        'Stock',
    finances:     'Finances',
  };

  // const HandleClickButton(btn){
  //   btn.onClick();
  // };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e0e0e0',
        color: '#1a237e',
      }}
    >
      <Toolbar sx={{ gap: 1.5, minHeight: '64px !important' }}>
        {/* Section title */}
        <Typography
          fontWeight="bold"
          fontSize="1rem"
          color="#1a237e"
          sx={{ mr: 2, minWidth: 140 }}
        >
          {activeSection ? sectionLabels[activeSection] : ''}
        </Typography>

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 1, flex: 1, flexWrap: 'wrap' }}>
          {buttons.map((btn) => (
            <Button
              key={btn.label}
              variant="contained"
              size="small"
              onClick={
                // HandleClickButton(btn);
                () => {
                btn.onClick();
              }}
              sx={{
                backgroundColor: '#1a237e',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.8rem',
                '&:hover': { backgroundColor: '#0d1757' },
              }}
            >
              {btn.label}
            </Button>
          ))}
        </Box>

        {/* User + Logout */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 'auto' }}>
          <Typography fontSize="0.875rem" color="#555">
            {username}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<LogOut size={16} />}
            onClick={onLogout}
            sx={{
              textTransform: 'none',
              borderColor: '#1a237e',
              color: '#1a237e',
              '&:hover': { backgroundColor: '#f0f0ff' },
            }}
          >
            Déconnexion
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default AgentHeader;
