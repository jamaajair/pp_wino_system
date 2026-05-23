import { useState } from 'react';
import { Box } from '@mui/material';
import AgentSidebar, { type SectionKey } from '../components/agent/Agent/AgentSidebar';
import AgentHeader from '../components/agent/Agent/AgentHeader';
import type { AuthResponse } from '../services/authService';
import type { Customer } from '../types';
import AgentHome from '../components/agent/Agent/AgentHome';

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

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <AgentSidebar
        role={user.role}
        activeSection={activeSection}
        onSectionChange={(section) => {
          setActiveSection(section);
          setCurrentTask(null);
        }}
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
          <AgentHome
            currentTask={currentTask}
            setCurrentTask={setCurrentTask}
            activeSection={activeSection}
            onClientCreated={handleClientCreated}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default AgentPage;
