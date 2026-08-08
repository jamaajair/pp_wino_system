
import { Box, Typography } from '@mui/material';
import type { SectionKey } from './AgentSidebar';
import WelcomeScreen from '../Welcome/WelcomeScreen';
import AddClientForm from '../Client/AddClientForm';
import SearchClientForm from '../Client/SearchClientForm';
import NewQuote from '../Quote/NewQuote';
import type { Customer } from '../../../types';
import ListeVentes from './ListeVentes';
import ListeClients from '../Client/ListeClients';
import ListeArticles from '../Articles/ListeArticles';
import ListeFournisseurs from '../Supplier/ListeFournisseurs';
import ListeAchats from '../stock/ListeAchats';
import NewOrder from '../Order/NewOrder';
import NewInvoice from '../Invoice/NewInvoice';
import NewCreditNote from '../CreditNote/NewCreditNote';
import NewArticle from '../Articles/NewArticle';
import SearchArticle from '../Articles/SearchArticle';
import AddSupplierForm from '../Supplier/AddSupplierForm';
import StockIn from '../stock/Stock';
import StockOut from '../stock/StockOut';
import Finances from '../Finance/Finances';
import NewTransaction from '../Finance/NewTransaction';
import Dashboard from '../Dashboard/Dashboard';

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
      console.log("Ajt un clientb ");
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
    if (currentTask === 'find-client') {
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
    if (currentTask === 'new-transaction') {
      return <NewTransaction onDone={() => setCurrentTask(null)} />;
    }
    
    if (currentTask === 'new-order') {
      return (
        <NewOrder 
          currentTask={currentTask}
          setCurrentTask={setCurrentTask}
          onClose={() => setCurrentTask(null)}
        />
      );
    }
    
    if (currentTask === 'new-invoice') {
      return (
        <NewInvoice
          currentTask={currentTask}
          setCurrentTask={setCurrentTask}
          onClose={() => setCurrentTask(null)}
        />
      );
    }
    if (currentTask === 'new-credit-note') {
      return (
        <NewCreditNote
          currentTask={currentTask}
          setCurrentTask={setCurrentTask}
          onClose={() => setCurrentTask(null)}
        />
      );
    }
    
    if (currentTask === 'new-article') {
      return (
        <NewArticle
        />
      );
    }

    if (currentTask === 'search-article') {
      return (
        <SearchArticle
          onClose={() => setCurrentTask(null)}
        />
      );
    }

    if (currentTask === 'add-supplier') {
      return (
        <AddSupplierForm
          onClose={() => setCurrentTask(null)}
          onCreated={() => setCurrentTask(null)}
        />
      );
    }

    if (currentTask === 'stock-in') {
      return (
        <StockIn
        />
      );
    }

    if (currentTask === 'stock-out') {
      return <StockOut />;
    }

    if (currentTask === 'search-article') {
      return (
        <SearchArticle 
          onClose={() => setCurrentTask(null)}
          onSelected={(_customer) => {
            // sera utilisé pour pré-remplir une commande/facture avec ce client
        }}
        />
      );
    }
  }

  // ici apres je vais avoir la liste des devis, commandes, factures...
  console.log("la section active est : ", activeSection);
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

  if (activeSection === 'clients') {
    return <ListeClients />;
  }

  if (activeSection === 'articles') {
    return <ListeArticles />;
  }

  if (activeSection === 'fournisseurs') {
    return <ListeFournisseurs />;
  }

  if (activeSection === 'stock') {
    return <ListeAchats />;
  }

  if (activeSection === 'finances') {
    return <Finances />;
  }

  if (activeSection === 'dashboard') {
    return <Dashboard />;
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