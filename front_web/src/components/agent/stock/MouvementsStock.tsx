import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box, Chip, CircularProgress, InputAdornment, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TextField, Typography,
} from '@mui/material';
import { ArrowDownLeft, ArrowUpRight, History, Search, SlidersHorizontal } from 'lucide-react';
import type { MovementType, StockMovement } from '../../../types';
import { stockMovementService } from '../../../services/stockMovementService';
import AppTabs from '../UsefeulComponents/Tabs';

const TYPE_LABELS: Record<MovementType, string> = {
  IN: 'Entrée',
  OUT: 'Sortie',
  ADJUSTMENT: 'Ajustement',
};

const TYPE_COLORS: Record<MovementType, 'success' | 'error' | 'info'> = {
  IN: 'success',
  OUT: 'error',
  ADJUSTMENT: 'info',
};

const TABS = [
  { value: 'ALL', label: 'Tous' },
  { value: 'IN', label: 'Entrées' },
  { value: 'OUT', label: 'Sorties' },
  { value: 'ADJUSTMENT', label: 'Ajustements' },
] as const;

type TabValue = typeof TABS[number]['value'];

// createdAt arrive en ISO-8601 depuis Jackson. On reste tolérant si le format change.
const formatDateTime = (iso?: string) => {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString('fr-BE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

// OUT retire du stock ; IN et ADJUSTMENT y ajoutent (cf. StockMovement.apply()).
const signedQuantity = (movement: StockMovement) =>
  movement.type === 'OUT' ? -Number(movement.quantity ?? 0) : Number(movement.quantity ?? 0);

function MouvementsStock() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabValue>('ALL');
  const [query, setQuery] = useState('');

  const loadMovements = useCallback(async () => {
    setLoading(true);
    try {
      // /recent trie déjà par date décroissante.
      setMovements(await stockMovementService.getRecent());
    } catch {
      setMovements([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadMovements(); }, [loadMovements]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return movements.filter(movement => {
      if (activeTab !== 'ALL' && movement.type !== activeTab) return false;
      if (!needle) return true;
      return [
        movement.product?.name,
        movement.product?.code,
        movement.reason,
        movement.referenceDocument,
      ].some(field => field?.toLowerCase().includes(needle));
    });
  }, [movements, activeTab, query]);

  const totalIn = filtered
    .filter(m => m.type !== 'OUT')
    .reduce((sum, m) => sum + Number(m.quantity ?? 0), 0);
  const totalOut = filtered
    .filter(m => m.type === 'OUT')
    .reduce((sum, m) => sum + Number(m.quantity ?? 0), 0);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
        <History size={22} color="#1a237e" />
        <Typography variant="h5" fontWeight="bold" color="#1a237e">
          Historique des mouvements
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Toutes les entrées, sorties et corrections d'inventaire, de la plus récente à la plus ancienne
      </Typography>

      <AppTabs<TabValue>
        tabs={TABS.map(t => ({ value: t.value, label: t.label }))}
        value={activeTab}
        onChange={setActiveTab}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Rechercher par article, code, motif ou référence…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          sx={{ width: 420 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start"><Search size={16} /></InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
          <Chip
            icon={<ArrowUpRight size={14} />}
            label={`+${totalIn} entrées`}
            color="success"
            variant="outlined"
            size="small"
          />
          <Chip
            icon={<ArrowDownLeft size={14} />}
            label={`−${totalOut} sorties`}
            color="error"
            variant="outlined"
            size="small"
          />
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      ) : filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 8, color: 'text.secondary' }}>
          <Typography>Aucun mouvement de stock.</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Article</strong></TableCell>
                <TableCell><strong>Code</strong></TableCell>
                <TableCell align="center"><strong>Type</strong></TableCell>
                <TableCell align="right"><strong>Quantité</strong></TableCell>
                <TableCell><strong>Motif</strong></TableCell>
                <TableCell><strong>Référence</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(movement => {
                const quantity = signedQuantity(movement);
                return (
                  <TableRow key={movement.id} hover>
                    <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '0.82rem' }}>
                      {formatDateTime(movement.createdAt)}
                    </TableCell>
                    <TableCell>{movement.product?.name ?? '—'}</TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#5c6bc0' }}>
                      {movement.product?.code ?? '—'}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        icon={
                          movement.type === 'OUT' ? <ArrowDownLeft size={13} />
                            : movement.type === 'IN' ? <ArrowUpRight size={13} />
                            : <SlidersHorizontal size={13} />
                        }
                        label={TYPE_LABELS[movement.type]}
                        color={TYPE_COLORS[movement.type]}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontWeight: 700, color: quantity < 0 ? '#b71c1c' : '#1b5e20' }}
                    >
                      {quantity > 0 ? `+${quantity}` : quantity} {movement.product?.unit ?? ''}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.82rem' }}>{movement.reason ?? '—'}</TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>
                      {movement.referenceDocument ?? '—'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default MouvementsStock;
