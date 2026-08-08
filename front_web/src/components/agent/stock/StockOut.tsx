import { useState } from 'react';
import {
  Alert, AlertTitle, Autocomplete, Box, Button, Chip, CircularProgress, Divider,
  IconButton, InputAdornment, MenuItem, Paper, Snackbar, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TextField, Typography,
} from '@mui/material';
import { AlertTriangle, Hash, Package, PackageMinus, StickyNote, Trash2 } from 'lucide-react';
import axios from 'axios';
import type { Product } from '../../../types';
import { productService } from '../../../services/productService';
import { stockMovementService } from '../../../services/stockMovementService';

interface StockOutLine {
  product: Product;
  qty: number;
}

// Motifs courants d'une sortie sans vente. « Autre » oblige à préciser dans le détail.
const REASONS = [
  'Périmé',
  'Cassé',
  'Abîmé / endommagé',
  'Perte',
  'Vol',
  "Erreur d'inventaire",
  'Échantillon / dégustation',
  'Autre',
] as const;

const stockOf = (product: Product) => Number(product.stockQuantity ?? 0);

function movementErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.message ?? error.response?.data?.error;
    if (typeof detail === 'string' && detail.length > 0) return detail;
  }
  return 'Erreur inconnue';
}

function StockOut() {
  const [reason, setReason] = useState<string>('Périmé');
  const [detail, setDetail] = useState('');
  const [reference, setReference] = useState('');
  const [items, setItems] = useState<StockOutLine[]>([]);

  const [productOptions, setProductOptions] = useState<Product[]>([]);
  const [productInputKey, setProductInputKey] = useState(0);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [partialFailures, setPartialFailures] = useState<string[]>([]);

  const searchProducts = async (_: unknown, value: string) => {
    if (!value) { setProductOptions([]); return; }
    setLoadingSearch(true);
    try {
      setProductOptions(await productService.searchProducts(value));
    } finally {
      setLoadingSearch(false);
    }
  };

  const addProduct = (product: Product) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const removeItem = (productId: number) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  };

  const updateQty = (productId: number, qty: number) => {
    if (qty <= 0) { removeItem(productId); return; }
    setItems(prev => prev.map(i => i.product.id === productId ? { ...i, qty } : i));
  };

  const totalQty = items.reduce((sum, i) => sum + i.qty, 0);
  // Valorisation au prix d'achat : c'est ce que la casse coûte réellement.
  const totalLoss = items.reduce((sum, i) => sum + i.qty * Number(i.product.purchasePrice ?? 0), 0);

  const overStockLines = items.filter(i => i.qty > stockOf(i.product));
  const needsDetail = reason === 'Autre' && detail.trim().length === 0;

  const reset = () => {
    setItems([]);
    setDetail('');
    setReference('');
    setProductOptions([]);
  };

  const handleValidate = async () => {
    if (items.length === 0) { setError('Veuillez ajouter au moins un article.'); return; }
    if (needsDetail) { setError('Veuillez préciser le motif dans le champ détail.'); return; }
    if (overStockLines.length > 0) {
      setError(`Quantité supérieure au stock pour : ${overStockLines.map(i => i.product.name).join(', ')}.`);
      return;
    }

    setError(null);
    setPartialFailures([]);
    setSubmitting(true);

    const fullReason = (detail.trim() ? `${reason} — ${detail.trim()}` : reason).slice(0, 255);
    const failures: string[] = [];
    let applied = 0;

    // L'API ne traite qu'un produit par appel : on boucle et on rapporte ligne par ligne.
    for (const item of items) {
      try {
        await stockMovementService.out({
          productId: item.product.id,
          quantity: item.qty,
          reason: fullReason,
          reference: reference.trim() || undefined,
        });
        applied += 1;
      } catch (e) {
        failures.push(`${item.product.name} : ${movementErrorMessage(e)}`);
      }
    }

    setSubmitting(false);

    if (failures.length === 0) {
      setSuccess(`${applied} sortie${applied > 1 ? 's' : ''} de stock enregistrée${applied > 1 ? 's' : ''} — motif « ${reason} ».`);
      reset();
    } else {
      setPartialFailures(failures);
      if (applied > 0) {
        // Les lignes passées sont déjà appliquées en base : on les retire pour
        // ne pas risquer de les rejouer si l'utilisateur revalide.
        setItems(prev => prev.filter(i => failures.some(f => f.startsWith(`${i.product.name} :`))));
      }
    }
  };

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
          background: 'linear-gradient(90deg, #7f1d1d 0%, #c0392b 55%, #7f1d1d 100%)',
          boxShadow: '0 8px 18px rgba(127,29,29,0.25)',
        }}
      >
        <PackageMinus size={22} color="white" />
        <Box sx={{ flex: 1 }}>
          <Typography color="white" fontWeight={800} letterSpacing={1} fontSize="1rem">
            SORTIE DE STOCK
          </Typography>
          <Typography color="rgba(255,255,255,0.75)" fontSize="0.78rem">
            Retrait sans vente — marchandise périmée, cassée, abîmée ou perdue
          </Typography>
        </Box>
        <Chip
          label={`${totalQty} unité${totalQty > 1 ? 's' : ''}`}
          size="small"
          sx={{ backgroundColor: 'rgba(255,255,255,0.18)', color: 'white', fontWeight: 600 }}
        />
        <Box sx={{ textAlign: 'right' }}>
          <Typography color="rgba(255,255,255,0.75)" fontSize="0.68rem" textTransform="uppercase">
            Perte estimée
          </Typography>
          <Typography color="white" fontWeight={800} fontSize="1.15rem">
            {totalLoss.toFixed(2)} €
          </Typography>
        </Box>
      </Box>

      {/* Motif */}
      <Paper elevation={0} sx={{ p: 2.5, mb: 2, borderRadius: 3, border: '1px solid #f3e0e0' }}>
        <Typography fontWeight={700} color="#7f1d1d" fontSize="0.9rem" mb={2}>
          Motif de la sortie
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 2fr 1fr' },
            gap: 1.5,
          }}
        >
          <TextField
            select
            size="small"
            label="Motif"
            value={reason}
            onChange={e => setReason(e.target.value)}
            required
            InputProps={{
              startAdornment: <InputAdornment position="start"><AlertTriangle size={15} /></InputAdornment>,
            }}
          >
            {REASONS.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
          </TextField>

          <TextField
            size="small"
            label={reason === 'Autre' ? 'Détail (obligatoire)' : 'Détail'}
            placeholder="Ex. lot DLC 12/03, palette tombée au déchargement…"
            value={detail}
            onChange={e => setDetail(e.target.value)}
            required={reason === 'Autre'}
            error={needsDetail && detail.length > 0}
            InputProps={{
              startAdornment: <InputAdornment position="start"><StickyNote size={15} /></InputAdornment>,
            }}
          />

          <TextField
            size="small"
            label="Référence"
            placeholder="Ex. PV destruction 042"
            value={reference}
            onChange={e => setReference(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Hash size={15} /></InputAdornment>,
            }}
          />
        </Box>
      </Paper>

      {/* Articles */}
      <Paper elevation={0} sx={{ p: 2.5, mb: 2, borderRadius: 3, border: '1px solid #f3e0e0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, gap: 2 }}>
          <Typography fontWeight={700} color="#7f1d1d" fontSize="0.9rem">
            Articles à sortir
          </Typography>
          <Autocomplete
            key={productInputKey}
            options={productOptions}
            loading={loadingSearch}
            onInputChange={searchProducts}
            onChange={(_, value) => { if (value) { addProduct(value); setProductInputKey(k => k + 1); } }}
            getOptionLabel={(o) => o.name}
            isOptionEqualToValue={(o, v) => o.id === v.id}
            filterOptions={(x) => x}
            sx={{ width: 340 }}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                placeholder="Rechercher un article à sortir…"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <InputAdornment position="start"><Package size={16} /></InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                  ),
                  endAdornment: (
                    <>
                      {loadingSearch && <CircularProgress size={16} />}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Box>

        <TableContainer sx={{ border: '1px solid #eceff1', borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><strong>Article</strong></TableCell>
                <TableCell><strong>Code</strong></TableCell>
                <TableCell align="right"><strong>Stock actuel</strong></TableCell>
                <TableCell align="right"><strong>Qté sortie</strong></TableCell>
                <TableCell align="right"><strong>Stock après</strong></TableCell>
                <TableCell align="right"><strong>Perte (€)</strong></TableCell>
                <TableCell align="center"><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ color: 'text.secondary', py: 5 }}>
                    Aucun article. Utilisez la recherche ci-dessus pour en ajouter.
                  </TableCell>
                </TableRow>
              ) : (
                items.map(i => {
                  const current = stockOf(i.product);
                  const after = current - i.qty;
                  const tooMuch = i.qty > current;
                  return (
                    <TableRow key={i.product.id} hover>
                      <TableCell>{i.product.name}</TableCell>
                      <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#5c6bc0' }}>
                        {i.product.code ?? '—'}
                      </TableCell>
                      <TableCell align="right">{current} {i.product.unit ?? ''}</TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          size="small"
                          value={i.qty}
                          onChange={e => updateQty(i.product.id, Number(e.target.value))}
                          error={tooMuch}
                          inputProps={{ min: 1, max: current, style: { textAlign: 'right', width: 70 } }}
                        />
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ fontWeight: 700, color: tooMuch ? '#b71c1c' : after === 0 ? '#e65100' : 'inherit' }}
                      >
                        {tooMuch ? 'insuffisant' : after}
                      </TableCell>
                      <TableCell align="right">
                        {(i.qty * Number(i.product.purchasePrice ?? 0)).toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" color="error" onClick={() => removeItem(i.product.id)}>
                          <Trash2 size={16} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {overStockLines.length > 0 && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Le stock disponible est insuffisant pour {overStockLines.length} article
            {overStockLines.length > 1 ? 's' : ''}. Le serveur refuserait ces lignes.
          </Alert>
        )}
      </Paper>

      {partialFailures.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setPartialFailures([])}>
          <AlertTitle>Certaines lignes n'ont pas pu être sorties</AlertTitle>
          {partialFailures.map((f, i) => (
            <Typography key={i} fontSize="0.85rem">• {f}</Typography>
          ))}
          <Typography fontSize="0.8rem" sx={{ mt: 1, fontStyle: 'italic' }}>
            Les autres lignes ont bien été appliquées et ont été retirées du tableau.
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
          border: '1px solid #f3e0e0',
          backgroundColor: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
        }}
      >
        <Box>
          <Typography fontSize="0.72rem" color="text.secondary" textTransform="uppercase" letterSpacing={0.6}>
            Perte estimée
          </Typography>
          <Typography variant="h6" fontWeight={800} color="#7f1d1d">
            {totalLoss.toFixed(2)} €
          </Typography>
        </Box>

        <Divider orientation="vertical" flexItem />

        <Typography fontSize="0.8rem" color="text.secondary">
          {items.length} ligne{items.length > 1 ? 's' : ''} · {totalQty} unité{totalQty > 1 ? 's' : ''} · motif « {reason} »
        </Typography>

        <Box sx={{ ml: 'auto', display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            onClick={reset}
            disabled={submitting}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Réinitialiser
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleValidate}
            disabled={submitting || items.length === 0 || overStockLines.length > 0}
            startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <PackageMinus size={16} />}
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2, px: 3 }}
          >
            {submitting ? 'Enregistrement…' : 'Valider la sortie'}
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

export default StockOut;
