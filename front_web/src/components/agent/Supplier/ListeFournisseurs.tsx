import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, CircularProgress,
  IconButton, Tooltip, Drawer, Divider, TextField, InputAdornment,
} from '@mui/material';
import { Eye, X, Search } from 'lucide-react';
import type { Supplier } from '../../../types';
import { supplierService } from '../../../services/supplierService';
import AppTabs from '../UsefeulComponents/Tabs';

const TABS = [
  { value: 'ALL', label: 'Tous' },
  { value: 'ACTIVE', label: 'Actifs' },
  { value: 'INACTIVE', label: 'Inactifs' },
] as const;

type TabValue = typeof TABS[number]['value'];

const paymentTermsLabel = (days?: number) =>
  days != null ? `${days} jours` : '—';

function ListeFournisseurs() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabValue>('ALL');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Supplier | null>(null);

  const loadSuppliers = useCallback(async () => {
    setLoading(true);
    try {
      setSuppliers(await supplierService.getAll());
    } catch {
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadSuppliers(); }, [loadSuppliers]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return suppliers.filter(supplier => {
      const matchesTab =
        activeTab === 'ALL' ? true
          : activeTab === 'ACTIVE' ? supplier.active !== false
          : supplier.active === false;

      if (!matchesTab) return false;
      if (!needle) return true;

      return [supplier.name, supplier.code, supplier.email, supplier.city, supplier.contactPerson]
        .some(field => field?.toLowerCase().includes(needle));
    });
  }, [suppliers, activeTab, query]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" color="#1a237e" mb={3}>
        Fournisseurs
      </Typography>

      <AppTabs<TabValue>
        tabs={TABS.map(t => ({ value: t.value, label: t.label }))}
        value={activeTab}
        onChange={setActiveTab}
      />

      <TextField
        size="small"
        placeholder="Rechercher par nom, code, email, ville ou contact…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        sx={{ mb: 2, width: 400 }}
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
          <Typography>Aucun fournisseur trouvé.</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><strong>Code</strong></TableCell>
                <TableCell><strong>Nom</strong></TableCell>
                <TableCell><strong>Contact</strong></TableCell>
                <TableCell><strong>Ville</strong></TableCell>
                <TableCell><strong>Téléphone</strong></TableCell>
                <TableCell align="center"><strong>Délai paiement</strong></TableCell>
                <TableCell align="center"><strong>Statut</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(supplier => (
                <TableRow key={supplier.id ?? supplier.code} hover>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#1a237e' }}>
                    {supplier.code}
                  </TableCell>
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell>{supplier.contactPerson ?? '—'}</TableCell>
                  <TableCell>{supplier.city ?? '—'}</TableCell>
                  <TableCell>{supplier.phone ?? '—'}</TableCell>
                  <TableCell align="center">{paymentTermsLabel(supplier.paymentTerms)}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={supplier.active === false ? 'Inactif' : 'Actif'}
                      color={supplier.active === false ? 'default' : 'success'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Voir le détail">
                      <IconButton size="small" onClick={() => setSelected(supplier)}>
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
                label={selected.active === false ? 'Inactif' : 'Actif'}
                color={selected.active === false ? 'default' : 'success'}
                size="small"
              />
              {selected.paymentTerms != null && (
                <Chip
                  label={`Paiement à ${selected.paymentTerms} jours`}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
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
              <Row label="Personne de contact" value={selected.contactPerson ?? '—'} />
              <Row label="Email" value={selected.email ?? '—'} />
              <Row label="Téléphone" value={selected.phone ?? '—'} />
              <Row label="Adresse" value={selected.address ?? '—'} />
              <Row label="Ville" value={[selected.postalCode, selected.city].filter(Boolean).join(' ') || '—'} />
              <Row label="Pays" value={selected.country ?? '—'} />
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Typography fontWeight="bold" mb={1.5}>Conditions</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Row label="Délai de paiement" value={paymentTermsLabel(selected.paymentTerms)} />
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

export default ListeFournisseurs;
