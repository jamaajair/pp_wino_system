import { useCallback, useEffect, useState } from 'react';
import {
  Alert, Box, Button, Chip, CircularProgress, Paper, Snackbar, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Typography,
} from '@mui/material';
import { Plus } from 'lucide-react';
import type { FinancialTransaction } from '../../../types';
import { financeService } from '../../../services/financeService';
import { getStoredUser } from '../../../services/authService';
import NewTransaction from './NewTransaction';

function TransactionsList() {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    financeService.getAccounts()
      .then(async accounts => {
        const perAccount = await Promise.all(
          accounts.map(a =>
            a.id
              ? financeService.getTransactionsByAccount(a.id)
                  .then(txns => txns.map(t => ({ ...t, accountId: a.id, accountName: a.accountName })))
                  .catch(() => [] as FinancialTransaction[])
              : Promise.resolve([] as FinancialTransaction[])
          )
        );
        const all = perAccount.flat();
        all.sort((x, y) => (y.transactionDate ?? '').localeCompare(x.transactionDate ?? ''));
        setTransactions(all);
      })
      .catch(() => setTransactions([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleApply = async (id: number) => {
    try {
      await financeService.applyTransaction(id, getStoredUser()?.id);
      load();
    } catch {
      setError("Impossible d'appliquer la transaction (solde insuffisant ?).");
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography fontWeight={700} color="#1a237e">Historique des transactions</Typography>
        <Button
          variant={showForm ? 'outlined' : 'contained'}
          startIcon={showForm ? undefined : <Plus size={16} />}
          onClick={() => setShowForm(s => !s)}
          sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, backgroundColor: showForm ? undefined : '#1a237e', '&:hover': showForm ? undefined : { backgroundColor: '#0d1757' } }}
        >
          {showForm ? 'Masquer le formulaire' : 'Nouvelle transaction'}
        </Button>
      </Box>

      {showForm && (
        <Paper elevation={0} sx={{ mb: 3, borderRadius: 3, border: '1px solid #e8eaf6' }}>
          <NewTransaction onDone={() => { setShowForm(false); load(); }} />
        </Paper>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><strong>N°</strong></TableCell>
                <TableCell><strong>Compte</strong></TableCell>
                <TableCell><strong>Type</strong></TableCell>
                <TableCell align="right"><strong>Montant</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Catégorie</strong></TableCell>
                <TableCell align="center"><strong>Statut</strong></TableCell>
                <TableCell align="center"><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>Aucune transaction.</TableCell></TableRow>
              ) : (
                transactions.map(t => (
                  <TableRow key={t.id} hover>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{t.transactionNumber}</TableCell>
                    <TableCell>{t.accountName ?? '—'}</TableCell>
                    <TableCell>
                      <Chip
                        label={t.transactionType === 'CREDIT' ? 'Crédit' : 'Débit'}
                        size="small"
                        color={t.transactionType === 'CREDIT' ? 'success' : 'error'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: t.transactionType === 'CREDIT' ? '#1b5e20' : '#b71c1c' }}>
                      {t.transactionType === 'CREDIT' ? '+' : '−'}{Number(t.amount).toFixed(2)} €
                    </TableCell>
                    <TableCell>{t.transactionDate}</TableCell>
                    <TableCell>{t.category ?? '—'}</TableCell>
                    <TableCell align="center">
                      <Chip label={t.applied ? 'Appliquée' : 'En attente'} size="small" color={t.applied ? 'primary' : 'default'} />
                    </TableCell>
                    <TableCell align="center">
                      {!t.applied && (
                        <Button size="small" onClick={() => handleApply(t.id)} sx={{ textTransform: 'none' }}>
                          Appliquer
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Snackbar open={error !== null} autoHideDuration={4500} onClose={() => setError(null)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
      </Snackbar>
    </Box>
  );
}

export default TransactionsList;
