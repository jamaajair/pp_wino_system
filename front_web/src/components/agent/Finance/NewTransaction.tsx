import { useEffect, useState } from 'react';
import {
  Alert, Box, Button, Checkbox, CircularProgress, FormControl, FormControlLabel,
  InputLabel, MenuItem, Paper, Select, Snackbar, TextField, ToggleButton,
  ToggleButtonGroup, Typography,
} from '@mui/material';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import type { FinancialAccount, FinancialTransactionRequest, TransactionType } from '../../../types';
import { financeService } from '../../../services/financeService';
import { getStoredUser } from '../../../services/authService';

interface NewTransactionProps {
  onDone?: () => void;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function NewTransaction({ onDone }: NewTransactionProps) {
  const [accounts, setAccounts] = useState<FinancialAccount[]>([]);
  const [accountId, setAccountId] = useState<number | ''>('');
  const [type, setType] = useState<TransactionType>('CREDIT');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(todayISO());
  const [category, setCategory] = useState('');
  const [reference, setReference] = useState('');
  const [description, setDescription] = useState('');
  const [applyNow, setApplyNow] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    financeService.getAccounts()
      .then(list => setAccounts(list.filter(a => a.active !== false)))
      .catch(() => setError('Impossible de charger les comptes.'));
  }, []);

  const handleSubmit = async () => {
    if (accountId === '') { setError('Veuillez choisir un compte.'); return; }
    const amt = Number(amount);
    if (!amt || amt <= 0) { setError('Le montant doit être positif.'); return; }
    setError(null);
    setSubmitting(true);
    try {
      const user = getStoredUser();
      const payload: FinancialTransactionRequest = {
        account: { id: accountId },
        transactionType: type,
        amount: amt,
        transactionDate: date,
        category: category || undefined,
        reference: reference || undefined,
        description: description || undefined,
        createdBy: user?.id ? { id: user.id } : undefined,
      };
      const created = await financeService.createTransaction(payload);
      if (applyNow) {
        await financeService.applyTransaction(created.id, user?.id);
      }
      setSuccess(`Transaction ${created.transactionNumber} créée${applyNow ? ' et appliquée' : ''}.`);
      setAmount(''); setCategory(''); setReference(''); setDescription('');
      onDone?.();
    } catch (e) {
      console.error('Erreur transaction', e);
      setError("Erreur lors de l'enregistrement de la transaction (solde insuffisant pour un débit ?).");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 640, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={700} color="#1a237e" mb={2}>
        Nouvelle transaction
      </Typography>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e8eaf6', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <ToggleButtonGroup
          exclusive
          value={type}
          onChange={(_, v) => { if (v) setType(v); }}
          fullWidth
        >
          <ToggleButton value="CREDIT" sx={{ textTransform: 'none', gap: 1, color: '#1b5e20' }}>
            <ArrowDownCircle size={18} /> Crédit (entrée)
          </ToggleButton>
          <ToggleButton value="DEBIT" sx={{ textTransform: 'none', gap: 1, color: '#b71c1c' }}>
            <ArrowUpCircle size={18} /> Débit (sortie)
          </ToggleButton>
        </ToggleButtonGroup>

        <FormControl size="small" fullWidth>
          <InputLabel id="account-label">Compte</InputLabel>
          <Select
            labelId="account-label"
            label="Compte"
            value={accountId}
            onChange={e => setAccountId(e.target.value === '' ? '' : Number(e.target.value))}
          >
            {accounts.map(a => (
              <MenuItem key={a.id} value={a.id}>
                {a.accountName} ({a.accountNumber}) — {Number(a.balance ?? 0).toFixed(2)} {a.currency ?? 'EUR'}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Montant (€)"
            type="number"
            size="small"
            fullWidth
            value={amount}
            onChange={e => setAmount(e.target.value)}
            inputProps={{ min: 0, step: 0.01 }}
          />
          <TextField
            label="Date"
            type="date"
            size="small"
            fullWidth
            value={date}
            onChange={e => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField label="Catégorie" size="small" fullWidth value={category}
            onChange={e => setCategory(e.target.value)} placeholder="vente, achat, salaire…" />
          <TextField label="Référence" size="small" fullWidth value={reference}
            onChange={e => setReference(e.target.value)} placeholder="facture, paiement…" />
        </Box>

        <TextField label="Description" size="small" fullWidth multiline minRows={2}
          value={description} onChange={e => setDescription(e.target.value)} />

        <FormControlLabel
          control={<Checkbox checked={applyNow} onChange={e => setApplyNow(e.target.checked)} />}
          label="Appliquer immédiatement (met à jour le solde du compte)"
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
          {onDone && (
            <Button variant="outlined" onClick={onDone} disabled={submitting} sx={{ textTransform: 'none', borderRadius: 2 }}>
              Fermer
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : undefined}
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2, backgroundColor: '#1a237e', '&:hover': { backgroundColor: '#0d1757' } }}
          >
            {submitting ? 'Enregistrement…' : 'Enregistrer'}
          </Button>
        </Box>
      </Paper>

      <Snackbar open={error !== null} autoHideDuration={4500} onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
      </Snackbar>
      <Snackbar open={success !== null} autoHideDuration={4000} onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="success" onClose={() => setSuccess(null)}>{success}</Alert>
      </Snackbar>
    </Box>
  );
}

export default NewTransaction;
