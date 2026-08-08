import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert, AlertTitle, Box, Button, Chip, CircularProgress, Divider, FormControlLabel,
  InputAdornment, MenuItem, Paper, Snackbar, Switch, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Typography,
} from '@mui/material';
import { ClipboardCheck, Hash, Search, StickyNote } from 'lucide-react';
import axios from 'axios';
import type { Category, Product } from '../../../types';
import { productService } from '../../../services/productService';
import { getCategories } from '../../../services/categoryService';
import { stockMovementService } from '../../../services/stockMovementService';

interface CountedRow {
  product: Product;
  theoretical: number;
  counted: number | null;
  gap: number | null;
  value: number;
}

const money = (value: number) => `${value.toFixed(2)} €`;

function movementErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.message ?? error.response?.data?.error;
    if (typeof detail === 'string' && detail.length > 0) return detail;
  }
  return 'Erreur inconnue';
}

function Inventaire() {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [label, setLabel] = useState(`Inventaire annuel ${currentYear}`);
  const [reference, setReference] = useState('');
  // Chaîne vide = article pas encore compté. À distinguer de « 0 compté ».
  const [counts, setCounts] = useState<Record<number, string>>({});

  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState<number | 'ALL'>('ALL');
  const [onlyGaps, setOnlyGaps] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [partialFailures, setPartialFailures] = useState<string[]>([]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      setProducts(await productService.getAll());
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);
  useEffect(() => { getCategories().then(setCategories).catch(() => setCategories([])); }, []);

  const rows: CountedRow[] = useMemo(() => products.map(product => {
    const raw = counts[product.id] ?? '';
    const theoretical = Number(product.stockQuantity ?? 0);
    const counted = raw.trim() === '' ? null : Number(raw);
    const gap = counted === null || Number.isNaN(counted) ? null : counted - theoretical;
    return {
      product,
      theoretical,
      counted,
      gap,
      value: gap === null ? 0 : gap * Number(product.purchasePrice ?? 0),
    };
  }), [products, counts]);

  const visibleRows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rows.filter(row => {
      if (categoryId !== 'ALL' && row.product.category?.id !== categoryId) return false;
      if (onlyGaps && (row.gap === null || row.gap === 0)) return false;
      if (!needle) return true;
      return [row.product.name, row.product.code, row.product.barcode]
        .some(field => field?.toLowerCase().includes(needle));
    });
  }, [rows, query, categoryId, onlyGaps]);

  const countedRows = rows.filter(r => r.gap !== null);
  const gapRows = rows.filter(r => r.gap !== null && r.gap !== 0);
  const totalGapValue = gapRows.reduce((sum, r) => sum + r.value, 0);

  const setCount = (productId: number, value: string) => {
    setCounts(prev => ({ ...prev, [productId]: value }));
  };

  // Raccourci pour le cas courant : la majorité des articles n'a aucun écart.
  const markVisibleAsConform = () => {
    setCounts(prev => {
      const next = { ...prev };
      visibleRows.forEach(row => {
        if ((next[row.product.id] ?? '').trim() === '') {
          next[row.product.id] = String(row.theoretical);
        }
      });
      return next;
    });
  };

  const resetCounts = () => {
    setCounts({});
    setPartialFailures([]);
  };

  const handleValidate = async () => {
    if (gapRows.length === 0) {
      setError("Aucun écart à enregistrer. Saisissez au moins une quantité différente du stock théorique.");
      return;
    }
    if (label.trim().length === 0) {
      setError("Veuillez saisir un libellé d'inventaire.");
      return;
    }

    setError(null);
    setPartialFailures([]);
    setSubmitting(true);

    const reason = (reference.trim()
      ? `${label.trim()} — réf. ${reference.trim()}`
      : label.trim()).slice(0, 255);

    const failures: string[] = [];
    const applied: number[] = [];

    for (const row of gapRows) {
      const gap = row.gap as number;
      try {
        if (gap > 0) {
          // Excédent constaté : ADJUSTMENT ajoute au stock.
          await stockMovementService.adjust({
            productId: row.product.id,
            quantity: gap,
            reason,
          });
        } else {
          // Manquant : ADJUSTMENT ne sait pas décrémenter, on passe par une sortie.
          await stockMovementService.out({
            productId: row.product.id,
            quantity: -gap,
            reason,
            reference: reference.trim() || undefined,
          });
        }
        applied.push(row.product.id);
      } catch (e) {
        failures.push(`${row.product.name} : ${movementErrorMessage(e)}`);
      }
    }

    // Le stock théorique a changé : on le recharge avant de réafficher.
    await loadProducts();
    setSubmitting(false);

    // On efface les comptages appliqués pour ne pas risquer de les rejouer.
    setCounts(prev => {
      const next = { ...prev };
      applied.forEach(id => { delete next[id]; });
      return next;
    });

    if (failures.length === 0) {
      setSuccess(`${applied.length} écart${applied.length > 1 ? 's' : ''} enregistré${applied.length > 1 ? 's' : ''} — ${label.trim()}.`);
    } else {
      setPartialFailures(failures);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ p: 2, pb: 12 }}>
      {/* Bandeau */}
      <Box
        sx={{
          borderRadius: 3,
          px: 3,
          py: 2,
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          background: 'linear-gradient(90deg, #14532d 0%, #1f7a4d 55%, #14532d 100%)',
          boxShadow: '0 8px 18px rgba(20,83,45,0.25)',
        }}
      >
        <ClipboardCheck size={22} color="white" />
        <Box sx={{ flex: 1 }}>
          <Typography color="white" fontWeight={800} letterSpacing={1} fontSize="1rem">
            INVENTAIRE ANNUEL
          </Typography>
          <Typography color="rgba(255,255,255,0.75)" fontSize="0.78rem">
            Comptage physique — seuls les écarts génèrent un mouvement de stock
          </Typography>
        </Box>
        <Chip
          label={`${countedRows.length} / ${products.length} comptés`}
          size="small"
          sx={{ backgroundColor: 'rgba(255,255,255,0.18)', color: 'white', fontWeight: 600 }}
        />
        <Box sx={{ textAlign: 'right' }}>
          <Typography color="rgba(255,255,255,0.75)" fontSize="0.68rem" textTransform="uppercase">
            Valorisation des écarts
          </Typography>
          <Typography color="white" fontWeight={800} fontSize="1.15rem">
            {totalGapValue >= 0 ? '+' : ''}{money(totalGapValue)}
          </Typography>
        </Box>
      </Box>

      {/* Paramètres */}
      <Paper elevation={0} sx={{ p: 2.5, mb: 2, borderRadius: 3, border: '1px solid #e0efe6' }}>
        <Typography fontWeight={700} color="#14532d" fontSize="0.9rem" mb={2}>
          Paramètres de l'inventaire
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 1.5 }}>
          <TextField
            size="small"
            label="Libellé"
            value={label}
            onChange={e => setLabel(e.target.value)}
            required
            InputProps={{
              startAdornment: <InputAdornment position="start"><StickyNote size={15} /></InputAdornment>,
            }}
          />
          <TextField
            size="small"
            label="Référence"
            placeholder="Ex. PV inventaire 2026-01"
            value={reference}
            onChange={e => setReference(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Hash size={15} /></InputAdornment>,
            }}
          />
        </Box>
      </Paper>

      {/* Comptage */}
      <Paper elevation={0} sx={{ p: 2.5, mb: 2, borderRadius: 3, border: '1px solid #e0efe6' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
          <Typography fontWeight={700} color="#14532d" fontSize="0.9rem" sx={{ mr: 'auto' }}>
            Comptage
          </Typography>

          <TextField
            size="small"
            placeholder="Rechercher un article…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            sx={{ width: 260 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search size={15} /></InputAdornment>,
            }}
          />

          <TextField
            select
            size="small"
            label="Catégorie"
            value={categoryId}
            onChange={e => setCategoryId(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
            sx={{ width: 210 }}
          >
            <MenuItem value="ALL">Toutes</MenuItem>
            {categories.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
          </TextField>

          <FormControlLabel
            control={<Switch size="small" checked={onlyGaps} onChange={e => setOnlyGaps(e.target.checked)} />}
            label={<Typography fontSize="0.82rem">Écarts seulement</Typography>}
          />

          <Button size="small" variant="outlined" onClick={markVisibleAsConform} sx={{ textTransform: 'none' }}>
            Marquer conformes
          </Button>
        </Box>

        <TableContainer sx={{ border: '1px solid #eceff1', borderRadius: 2, maxHeight: 560 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: '#f5f5f5' }}><strong>Code</strong></TableCell>
                <TableCell sx={{ backgroundColor: '#f5f5f5' }}><strong>Article</strong></TableCell>
                <TableCell sx={{ backgroundColor: '#f5f5f5' }}><strong>Catégorie</strong></TableCell>
                <TableCell align="right" sx={{ backgroundColor: '#f5f5f5' }}><strong>Stock théorique</strong></TableCell>
                <TableCell align="right" sx={{ backgroundColor: '#f5f5f5' }}><strong>Quantité comptée</strong></TableCell>
                <TableCell align="right" sx={{ backgroundColor: '#f5f5f5' }}><strong>Écart</strong></TableCell>
                <TableCell align="right" sx={{ backgroundColor: '#f5f5f5' }}><strong>Valorisation</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ color: 'text.secondary', py: 5 }}>
                    Aucun article à afficher.
                  </TableCell>
                </TableRow>
              ) : (
                visibleRows.map(row => {
                  const hasGap = row.gap !== null && row.gap !== 0;
                  return (
                    <TableRow
                      key={row.product.id}
                      hover
                      sx={{ backgroundColor: hasGap ? '#fff8e1' : undefined }}
                    >
                      <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#5c6bc0' }}>
                        {row.product.code ?? '—'}
                      </TableCell>
                      <TableCell>{row.product.name}</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.82rem' }}>
                        {row.product.category?.name ?? '—'}
                      </TableCell>
                      <TableCell align="right">
                        {row.theoretical} {row.product.unit ?? ''}
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          size="small"
                          placeholder="—"
                          value={counts[row.product.id] ?? ''}
                          onChange={e => setCount(row.product.id, e.target.value)}
                          inputProps={{ min: 0, style: { textAlign: 'right', width: 80 } }}
                        />
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 700,
                          color: row.gap === null ? 'text.disabled'
                            : row.gap > 0 ? '#1b5e20'
                            : row.gap < 0 ? '#b71c1c'
                            : 'text.secondary',
                        }}
                      >
                        {row.gap === null ? '—' : row.gap > 0 ? `+${row.gap}` : row.gap}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ color: row.value < 0 ? '#b71c1c' : row.value > 0 ? '#1b5e20' : 'text.disabled' }}
                      >
                        {row.gap === null || row.gap === 0 ? '—' : `${row.value >= 0 ? '+' : ''}${money(row.value)}`}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {partialFailures.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setPartialFailures([])}>
          <AlertTitle>Certains écarts n'ont pas pu être enregistrés</AlertTitle>
          {partialFailures.map((f, i) => (
            <Typography key={i} fontSize="0.85rem">• {f}</Typography>
          ))}
          <Typography fontSize="0.8rem" sx={{ mt: 1, fontStyle: 'italic' }}>
            Les autres écarts ont bien été appliqués et leur comptage a été effacé.
          </Typography>
        </Alert>
      )}

      {/* Barre de validation */}
      <Paper
        elevation={0}
        sx={{
          position: 'sticky',
          bottom: 16,
          p: 2,
          borderRadius: 3,
          border: '1px solid #e0efe6',
          backgroundColor: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
        }}
      >
        <Box>
          <Typography fontSize="0.72rem" color="text.secondary" textTransform="uppercase" letterSpacing={0.6}>
            Valorisation des écarts
          </Typography>
          <Typography
            variant="h6"
            fontWeight={800}
            color={totalGapValue < 0 ? '#b71c1c' : '#14532d'}
          >
            {totalGapValue >= 0 ? '+' : ''}{money(totalGapValue)}
          </Typography>
        </Box>

        <Divider orientation="vertical" flexItem />

        <Typography fontSize="0.8rem" color="text.secondary">
          {countedRows.length} article{countedRows.length > 1 ? 's' : ''} compté{countedRows.length > 1 ? 's' : ''} ·{' '}
          {gapRows.length} écart{gapRows.length > 1 ? 's' : ''} à enregistrer
        </Typography>

        <Box sx={{ ml: 'auto', display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            onClick={resetCounts}
            disabled={submitting}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Effacer le comptage
          </Button>
          <Button
            variant="contained"
            onClick={handleValidate}
            disabled={submitting || gapRows.length === 0}
            startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <ClipboardCheck size={16} />}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 2,
              px: 3,
              backgroundColor: '#14532d',
              '&:hover': { backgroundColor: '#0e3a20' },
            }}
          >
            {submitting ? 'Enregistrement…' : "Valider l'inventaire"}
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={error !== null}
        autoHideDuration={5000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
      </Snackbar>
      <Snackbar
        open={success !== null}
        autoHideDuration={5000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccess(null)}>{success}</Alert>
      </Snackbar>
    </Box>
  );
}

export default Inventaire;
