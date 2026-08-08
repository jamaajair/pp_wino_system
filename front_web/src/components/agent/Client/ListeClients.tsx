import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, CircularProgress,
  IconButton, Tooltip, Drawer, Divider, TextField, InputAdornment,
} from '@mui/material';
import { Eye, X, Search, User, Building2 } from 'lucide-react';
import type { Customer, CustomerType } from '../../../types';
import { customerService } from '../../../services/customerService';
import AppTabs from '../UsefeulComponents/Tabs';

const TYPE_LABELS: Record<CustomerType, string> = {
  INDIVIDUAL: 'Particulier',
  COMPANY: 'Entreprise',
};

const TABS = [
  { value: 'ALL', label: 'Tous' },
  { value: 'INDIVIDUAL', label: 'Particuliers' },
  { value: 'COMPANY', label: 'Entreprises' },
  { value: 'DEBT', label: 'Avec solde' },
  { value: 'INACTIVE', label: 'Inactifs' },
] as const;

type TabValue = typeof TABS[number]['value'];

const money = (value?: number) => `${Number(value ?? 0).toFixed(2)} €`;

// Le backend expose /api/customers/exceeding-limit, mais la liste complète est déjà
// chargée : autant calculer le dépassement ici plutôt que de refaire un aller-retour.
const isOverCreditLimit = (customer: Customer) =>
  customer.creditLimit != null && Number(customer.balance ?? 0) > Number(customer.creditLimit);

function ListeClients() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabValue>('ALL');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Customer | null>(null);

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    try {
      setCustomers(await customerService.getAll());
    } catch {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadCustomers(); }, [loadCustomers]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return customers.filter(customer => {
      const matchesTab =
        activeTab === 'ALL' ? true
          : activeTab === 'DEBT' ? Number(customer.balance ?? 0) > 0
          : activeTab === 'INACTIVE' ? customer.active === false
          : customer.customerType === activeTab;

      if (!matchesTab) return false;
      if (!needle) return true;

      return [customer.name, customer.code, customer.email, customer.city]
        .some(field => field?.toLowerCase().includes(needle));
    });
  }, [customers, activeTab, query]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" color="#1a237e" mb={3}>
        Clients
      </Typography>

      <AppTabs<TabValue>
        tabs={TABS.map(t => ({ value: t.value, label: t.label }))}
        value={activeTab}
        onChange={setActiveTab}
      />

      <TextField
        size="small"
        placeholder="Rechercher par nom, code, email ou ville…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        sx={{ mb: 2, width: 380 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search size={16} />
            </InputAdornment>
          ),
        }}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      ) : filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 8, color: 'text.secondary' }}>
          <Typography>Aucun client trouvé.</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><strong>Code</strong></TableCell>
                <TableCell><strong>Nom</strong></TableCell>
                <TableCell><strong>Type</strong></TableCell>
                <TableCell><strong>Ville</strong></TableCell>
                <TableCell><strong>Téléphone</strong></TableCell>
                <TableCell align="right"><strong>Solde</strong></TableCell>
                <TableCell align="center"><strong>Statut</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(customer => (
                <TableRow key={customer.id ?? customer.code} hover>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#1a237e' }}>
                    {customer.code}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {customer.customerType === 'COMPANY'
                        ? <Building2 size={14} color="#1a237e" />
                        : <User size={14} color="#1a237e" />}
                      {customer.name}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={TYPE_LABELS[customer.customerType]}
                      color={customer.customerType === 'COMPANY' ? 'primary' : 'info'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{customer.city ?? '—'}</TableCell>
                  <TableCell>{customer.phone ?? '—'}</TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: isOverCreditLimit(customer) ? '#b71c1c' : 'inherit',
                      fontWeight: isOverCreditLimit(customer) ? 700 : 400,
                    }}
                  >
                    {money(customer.balance)}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={customer.active === false ? 'Inactif' : 'Actif'}
                      color={customer.active === false ? 'default' : 'success'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Voir le détail">
                      <IconButton size="small" onClick={() => setSelected(customer)}>
                        <Eye size={16} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Drawer détail */}
      <Drawer
        anchor="right"
        open={selected !== null}
        onClose={() => setSelected(null)}
        PaperProps={{ sx: { width: 520, p: 3 } }}
      >
        {selected && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold" color="#1a237e">
                {selected.name}
              </Typography>
              <IconButton size="small" onClick={() => setSelected(null)}>
                <X size={18} />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <Chip
                label={TYPE_LABELS[selected.customerType]}
                color={selected.customerType === 'COMPANY' ? 'primary' : 'info'}
                variant="outlined"
                size="small"
              />
              <Chip
                label={selected.active === false ? 'Inactif' : 'Actif'}
                color={selected.active === false ? 'default' : 'success'}
                size="small"
              />
              {isOverCreditLimit(selected) && (
                <Chip label="Limite de crédit dépassée" color="error" size="small" />
              )}
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Typography fontWeight="bold" mb={1.5}>Identification</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
              <Row label="Code" value={selected.code} />
              <Row label="N° TVA" value={selected.taxId ?? '—'} />
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Typography fontWeight="bold" mb={1.5}>Contact</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
              <Row label="Email" value={selected.email ?? '—'} />
              <Row label="Téléphone" value={selected.phone ?? '—'} />
              <Row label="Adresse" value={selected.address ?? '—'} />
              <Row label="Ville" value={[selected.postalCode, selected.city].filter(Boolean).join(' ') || '—'} />
              <Row label="Pays" value={selected.country ?? '—'} />
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Typography fontWeight="bold" mb={1.5}>Encours</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Row label="Solde" value={money(selected.balance)} />
              <Row
                label="Limite de crédit"
                value={selected.creditLimit != null ? money(selected.creditLimit) : '—'}
              />
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
      <Typography fontSize="0.875rem" color="text.secondary">{label}</Typography>
      <Typography fontSize="0.875rem" fontWeight={500} sx={{ textAlign: 'right' }}>{value}</Typography>
    </Box>
  );
}

export default ListeClients;
