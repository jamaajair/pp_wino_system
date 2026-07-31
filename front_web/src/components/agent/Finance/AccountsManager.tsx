import { useEffect, useState } from 'react';
import {
  Alert, Box, Button, Chip, CircularProgress, FormControl, InputLabel,
  MenuItem, Paper, Select, Snackbar, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Typography,
} from '@mui/material';
import type { AccountType, FinancialAccount, FinancialAccountRequest } from '../../../types';
import { financeService } from '../../../services/financeService';

const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
  { value: 'BANK', label: 'Banque' },
  { value: 'CASH', label: 'Espèces' },
  { value: 'CREDIT_CARD', label: 'Carte de crédit' },
  { value: 'SAVINGS', label: 'Épargne' },
  { value: 'INVESTMENT', label: 'Investissement' },
];

const TYPE_LABEL: Record<AccountType, string> = {
  BANK: 'Banque', CASH: 'Espèces', CREDIT_CARD: 'Carte de crédit',
  SAVINGS: 'Épargne', INVESTMENT: 'Investissement',
};

function AccountsManager() {
  const [accounts, setAccounts] = useState<FinancialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('BANK');
  const [currency, setCurrency] = useState('EUR');
  const [balance, setBalance] = useState('0');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    financeService.getAccounts()
      .then(setAccounts)
      .catch(() => setAccounts([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async () => {
    if (!accountNumber.trim() || !accountName.trim()) {
      setError('Le numéro et le nom du compte sont obligatoires.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const payload: FinancialAccountRequest = {
        accountNumber: accountNumber.trim(),
        accountName: accountName.trim(),
        accountType,
        currency: currency || 'EUR',
        balance: Number(balance) || 0,
        description: description || undefined,
      };
      await financeService.createAccount(payload);
      setSuccess('Compte créé avec succès.');
      setAccountNumber(''); setAccountName(''); setBalance('0'); setDescription('');
      load();
    } catch (e) {
      console.error('Erreur création compte', e);
      setError('Erreur lors de la création (numéro déjà existant ?).');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id?: number) => {
    if (!id) return;
    try {
      await financeService.toggleAccountActive(id);
      load();
    } catch {
      setError('Impossible de changer le statut du compte.');
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Formulaire création */}
      <Paper elevation={0} sx={{ p: 2.5, mb: 3, borderRadius: 3, border: '1px solid #e8eaf6' }}>
        <Typography fontWeight={700} color="#1a237e" mb={1.5}>Nouveau compte</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          <TextField label="N° de compte" size="small" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} />
          <TextField label="Nom du compte" size="small" value={accountName} onChange={e => setAccountName(e.target.value)} />
          <FormControl size="small">
            <InputLabel id="acc-type">Type</InputLabel>
            <Select labelId="acc-type" label="Type" value={accountType} onChange={e => setAccountType(e.target.value as AccountType)}>
              {ACCOUNT_TYPES.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="Devise" size="small" value={currency} onChange={e => setCurrency(e.target.value)} sx={{ width: 120 }} />
            <TextField label="Solde initial" type="number" size="small" value={balance} onChange={e => setBalance(e.target.value)} fullWidth inputProps={{ step: 0.01 }} />
          </Box>
          <TextField label="Description" size="small" value={description} onChange={e => setDescription(e.target.value)} sx={{ gridColumn: { md: '1 / -1' } }} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="contained" onClick={handleCreate} disabled={submitting}
            startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : undefined}
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2, backgroundColor: '#1a237e', '&:hover': { backgroundColor: '#0d1757' } }}>
            {submitting ? 'Création…' : 'Créer le compte'}
          </Button>
        </Box>
      </Paper>

      {/* Liste */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><strong>Compte</strong></TableCell>
                <TableCell><strong>N°</strong></TableCell>
                <TableCell><strong>Type</strong></TableCell>
                <TableCell align="right"><strong>Solde</strong></TableCell>
                <TableCell align="center"><strong>Statut</strong></TableCell>
                <TableCell align="center"><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.length === 0 ? (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>Aucun compte.</TableCell></TableRow>
              ) : (
                accounts.map(a => (
                  <TableRow key={a.id} hover>
                    <TableCell>{a.accountName}</TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{a.accountNumber}</TableCell>
                    <TableCell>{TYPE_LABEL[a.accountType] ?? a.accountType}</TableCell>
                    <TableCell align="right">{Number(a.balance ?? 0).toFixed(2)} {a.currency ?? 'EUR'}</TableCell>
                    <TableCell align="center">
                      <Chip label={a.active !== false ? 'Actif' : 'Inactif'} size="small" color={a.active !== false ? 'success' : 'default'} />
                    </TableCell>
                    <TableCell align="center">
                      <Button size="small" onClick={() => handleToggle(a.id)} sx={{ textTransform: 'none' }}>
                        {a.active !== false ? 'Désactiver' : 'Activer'}
                      </Button>
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
      <Snackbar open={success !== null} autoHideDuration={3500} onClose={() => setSuccess(null)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="success" onClose={() => setSuccess(null)}>{success}</Alert>
      </Snackbar>
    </Box>
  );
}

export default AccountsManager;
