import { useEffect, useState } from 'react';
import {
  Box, Chip, CircularProgress, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Typography,
} from '@mui/material';
import { Wallet } from 'lucide-react';
import type { AccountType, FinancialAccount } from '../../../types';
import { financeService } from '../../../services/financeService';

const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  BANK: 'Banque',
  CASH: 'Espèces',
  CREDIT_CARD: 'Carte de crédit',
  SAVINGS: 'Épargne',
  INVESTMENT: 'Investissement',
};

function FinanceOverview() {
  const [accounts, setAccounts] = useState<FinancialAccount[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([financeService.getAccounts(), financeService.getTotalBalance()])
      .then(([acc, tot]) => { setAccounts(acc); setTotal(tot); })
      .catch(() => { setAccounts([]); setTotal(0); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* Carte solde total */}
      <Paper elevation={0} sx={{
        p: 3, mb: 3, borderRadius: 3, color: 'white',
        background: 'linear-gradient(90deg, #1a237e 0%, #3949ab 100%)',
        display: 'flex', alignItems: 'center', gap: 2,
      }}>
        <Wallet size={36} />
        <Box>
          <Typography fontSize="0.85rem" sx={{ opacity: 0.85 }}>Solde total (tous comptes)</Typography>
          <Typography variant="h4" fontWeight={800}>{total.toFixed(2)} €</Typography>
        </Box>
      </Paper>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Compte</strong></TableCell>
              <TableCell><strong>N°</strong></TableCell>
              <TableCell><strong>Type</strong></TableCell>
              <TableCell align="right"><strong>Solde</strong></TableCell>
              <TableCell align="center"><strong>Statut</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  Aucun compte financier.
                </TableCell>
              </TableRow>
            ) : (
              accounts.map(a => (
                <TableRow key={a.id} hover>
                  <TableCell>{a.accountName}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{a.accountNumber}</TableCell>
                  <TableCell>{ACCOUNT_TYPE_LABELS[a.accountType] ?? a.accountType}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: Number(a.balance ?? 0) < 0 ? '#b71c1c' : '#1b5e20' }}>
                    {Number(a.balance ?? 0).toFixed(2)} {a.currency ?? 'EUR'}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={a.active !== false ? 'Actif' : 'Inactif'}
                      size="small"
                      color={a.active !== false ? 'success' : 'default'}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default FinanceOverview;
