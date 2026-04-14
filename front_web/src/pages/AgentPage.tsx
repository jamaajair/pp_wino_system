import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import AgentSidebar, { type SectionKey } from '../components/agent/AgentSidebar';
import AgentHeader from '../components/agent/AgentHeader';
import WelcomeScreen from '../components/agent/WelcomeScreen';
import AddClientForm from '../components/agent/AddClientForm';
import type { AuthResponse } from '../services/authService';
import type { Customer } from '../types';
import SearchClientForm from '../components/agent/SearchClientForm';
import NewQuote from '../components/agent/Quote/NewQuote';

interface AgentPageProps {
  user: AuthResponse;
  onLogout: () => void;
}

function AgentPage({ user, onLogout }: AgentPageProps) {
  const [activeSection, setActiveSection] = useState<SectionKey | null>(null);
  const [currentTask, setCurrentTask] = useState<string | null>(null);

  const handleClientCreated = (_customer: Customer) => {
    // sera utilisé pour rafraîchir la liste clients
  };

  const handleAction = (action: string) => {
    if (action === 'add-client') setCurrentTask('add-client');
    if (action === 'new-quote') setCurrentTask('new-quote');
  };

  const renderContent = () => {
    if (!activeSection && !currentTask) return <WelcomeScreen />;

    if(currentTask){
      if (currentTask === 'add-client') {
        return (
          <AddClientForm
            onClose={() => setCurrentTask(null)}
            onCreated={handleClientCreated}
          />
        );
      }
      else if (currentTask === 'Trouver Client') {
        return (
          <SearchClientForm
            onClose={() => setCurrentTask(null)}
            onSelected={(_customer) => {
              // sera utilisé pour pré-remplir une commande/facture avec ce client
            }}
          />
        );
      }
      else if (currentTask == "new-quote" ) {
        return (
          <NewQuote currentTask={currentTask} setCurrentTask={setCurrentTask} onClose={() => setCurrentTask(null)} />
        );
      }
    }else{
      if(activeSection ==='ventes'){
        return (
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight="bold" color="#1a237e">
            La liste des devis {activeSection} — à venir
          </Typography>
        </Box>
      );
      }
    }
    

    // return (
    //   <Box sx={{ p: 3 }}>
    //     <Typography variant="h5" fontWeight="bold" color="#1a237e">
    //       Section {activeSection} — à venir
    //     </Typography>
    //     <Typography variant="body1" color="#9e9e9e" sx={{ mt: 1 }}>
    //       Le contenu de cette section sera développé dans les prochaines étapes.
    //     </Typography>
    //   </Box>
    // );
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <AgentSidebar
        role={user.role}
        activeSection={activeSection}
        onSectionChange={(section) => { setActiveSection(section); setCurrentTask(null); }}
      />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AgentHeader
          activeSection={activeSection}
          username={user.username}
          onLogout={onLogout}
          onAction={handleAction}
          setCurrentTask={setCurrentTask}
        />
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {
            renderContent()
          }
        </Box>
      </Box>
    </Box>
  );
}

export default AgentPage;
