import { useState } from 'react';
import { Box } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TopBand from '../Articles/topbandcompenent';
import AppTabs from '../UsefeulComponents/Tabs';
import FinanceOverview from './FinanceOverview';
import AccountsManager from './AccountsManager';
import TransactionsList from './TransactionsList';

const TABS = [
  { value: 'overview', label: "Vue d'ensemble" },
  { value: 'accounts', label: 'Comptes' },
  { value: 'transactions', label: 'Transactions' },
] as const;

type FinanceTabValue = typeof TABS[number]['value'];

function Finances() {
  const [activeTab, setActiveTab] = useState<FinanceTabValue>('overview');

  return (
    <Box>
      <TopBand TextToDisplay="Finances" Icon={AttachMoneyIcon} />
      <AppTabs<FinanceTabValue>
        tabs={TABS.map(t => ({ value: t.value, label: t.label }))}
        value={activeTab}
        onChange={setActiveTab}
      />
      {activeTab === 'overview' && <FinanceOverview />}
      {activeTab === 'accounts' && <AccountsManager />}
      {activeTab === 'transactions' && <TransactionsList />}
    </Box>
  );
}

export default Finances;
