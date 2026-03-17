import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import AgentSidebar, { type SectionKey } from '../components/agent/AgentSidebar';
import AgentHeader from '../components/agent/AgentHeader';
import WelcomeScreen from '../components/agent/WelcomeScreen';
import type { AuthResponse } from '../services/authService';

interface AgentPageProps {
  user: AuthResponse;
  onLogout: () => void;
}

function AgentPage({ user, onLogout }: AgentPageProps) {
  const [activeSection, setActiveSection] = useState<SectionKey | null>(null);

  const handleAction = (action: string) => {
    console.log('Action:', action);
    // Les actions seront branchées dans les prochaines étapes
  };

  const renderContent = () => {
    if (!activeSection) return <WelcomeScreen />;

    // Les sections seront ajoutées progressivement
    return (
      <Box sx={{ p: 3 }}>
        {/* Section {activeSection} — à venir */}
        <Typography variant="h5" fontWeight="bold" color="#1a237e">
          Section {activeSection} — à venir
        </Typography>
        <Typography variant="body1" color="#9e9e9e" sx={{ mt: 1 }}>
          Le contenu de cette section sera développé dans les prochaines étapes.
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Sidebar */}
      <AgentSidebar
        role={user.role}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Contenu principal */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AgentHeader
          activeSection={activeSection}
          username={user.username}
          onLogout={onLogout}
          onAction={handleAction}
        />
        <Box sx={{ flex: 1, display: 'flex', overflow: 'auto' }}>
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
}

export default AgentPage;
