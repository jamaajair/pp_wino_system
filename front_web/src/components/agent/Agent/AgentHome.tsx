
import { Box, Typography } from '@mui/material';
import type { SectionKey } from './AgentSidebar';
import WelcomeScreen from '../WelcomeScreen';
import AddClientForm from '../AddClientForm';
import SearchClientForm from '../SearchClientForm';
import NewQuote from '../Quote/NewQuote';
import type { Customer } from '../../../types';
import ListeVentes from './ListeVentes';

interface AgentHomeProps {
  currentTask: string | null;
  setCurrentTask: (value: string | null) => void;
  activeSection: SectionKey | null;
  onClientCreated?: (customer: Customer) => void;
}

function AgentHome({ currentTask, setCurrentTask, activeSection, onClientCreated }: AgentHomeProps) {
  if (!activeSection && !currentTask) return <WelcomeScreen />;

  
  if (currentTask) {
    if (currentTask === 'add-client') {
      return (
        <AddClientForm
          onClose={() => setCurrentTask(null)}
          onCreated={(customer) => {
            onClientCreated?.(customer);
            setCurrentTask(null);
          }}
        />
      );
    }
    if (currentTask === 'Trouver Client') {
      return (
        <SearchClientForm
          onClose={() => setCurrentTask(null)}
          onSelected={(_customer) => {
            // sera utilisé pour pré-remplir une commande/facture avec ce client
          }}
        />
      );
    }
    if (currentTask === 'new-quote') {
      return (
        <NewQuote
          currentTask={currentTask}
          setCurrentTask={setCurrentTask}
          onClose={() => setCurrentTask(null)}
        />
      );
    }
  }

  // ici apres je vais avoir la liste des devis, commandes, factures...
  if (activeSection === 'ventes') {
    return (
        <ListeVentes />
    //   <Box sx={{ p: 3 }}>
    //     <Typography variant="h5" fontWeight="bold" color="#1a237e">
    //       La liste des devis {activeSection}
    //     </Typography>
    //   </Box>
    );
  }

  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" color="#1a237e">
        Bienvenue dans la section -- {activeSection}
      </Typography>
    </Box>
  );
}

export default AgentHome;