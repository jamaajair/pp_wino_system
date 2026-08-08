import { useMemo, useState } from 'react';
import {
  Alert, Autocomplete, Box, Button, Chip, CircularProgress, Divider, IconButton,
  InputAdornment, Paper, Snackbar, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Typography,
} from '@mui/material';
import { CalendarDays, FileText, Hash, Package, StickyNote, Trash2, Truck } from 'lucide-react';
import type { Product, Supplier, PurchaseDocumentRequest } from '../../../types';
import { supplierService } from '../../../services/supplierService';
import { productService } from '../../../services/productService';
import { purchaseDocumentService } from '../../../services/purchaseDocumentService';

interface PurchaseLine {
  product: Product;
  qty: number;
  unitPrice: number;
}

const pad = (n: number) => String(n).padStart(2, '0');
const toIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// Construction en heure locale : passer par toISOString() décalerait la date d'un jour
// pour tout fuseau à l'est de UTC.
const addDays = (isoDate: string, days: number) => {
  const [y, m, d] = isoDate.split('-').map(Number);
  return toIso(new Date(y, m - 1, d + days));
};

const money = (value: number) => `${value.toFixed(2)} €`;

function PurchaseInvoice() {
  const today = useMemo(() => toIso(new Date()), []);

  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [supplierInvoiceNumber, setSupplierInvoiceNumber] = useState('');
  const [documentDate, setDocumentDate] = useState(today);
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<PurchaseLine[]>([]);

  const [supplierOptions, setSupplierOptions] = useState<Supplier[]>([]);
  const [productOptions, setProductOptions] = useState<Product[]>([]);
  const [productInputKey, setProductInputKey] = useState(0);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const searchSuppliers = async (_: unknown, value: string) => {
    if (!value) { setSupplierOptions([]); return; }
    setLoadingSearch(true);
    try {
      setSupplierOptions(await supplierService.search(value));
    } finally {
      setLoadingSearch(false);
    }
  };

  const searchProducts = async (_: unknown, value: string) => {
    if (!value) { setProductOptions([]); return; }
    setLoadingSearch(true);
    try {
      setProductOptions(await productService.searchProducts(value));
    } finally {
      setLoadingSearch(false);
    }
  };

  // Le délai de paiement du fournisseur est déjà en base : autant s'en servir
  // pour préremplir l'échéance plutôt que de la faire saisir à la main.
  const selectSupplier = (value: Supplier | null) => {
    setSupplier(value);
    if (value?.paymentTerms != null) {
      setDueDate(addDays(documentDate, value.paymentTerms));
    }
  };

  const changeDocumentDate = (value: string) => {
    setDocumentDate(value);
    if (value && supplier?.paymentTerms != null) {
      setDueDate(addDays(value, supplier.paymentTerms));
    }
  };

  const removeItem = (productId: number) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  };

  const addProduct = (product: Product) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { product, qty: 1, unitPrice: product.purchasePrice ?? 0 }];
    });
  };

  const updateQty = (productId: number, qty: number) => {
    if (qty <= 0) { removeItem(productId); return; }
    setItems(prev => prev.map(i => i.product.id === productId ? { ...i, qty } : i));
  };

  const updateUnitPrice = (productId: number, unitPrice: number) => {
    setItems(prev => prev.map(i => i.product.id === productId ? { ...i, unitPrice } : i));
  };

  const total = items.reduce((sum, i) => sum + i.qty * i.unitPrice, 0);
  const totalQty = items.reduce((sum, i) => sum + i.qty, 0);

  const reset = () => {
    setSupplier(null);
    setSupplierInvoiceNumber('');
    setDocumentDate(today);
    setDueDate('');
    setNotes('');
    setItems([]);
    setSupplierOptions([]);
    setProductOptions([]);
  };

  const handleValidate = async () => {
    if (!supplier?.id) { setError('Veuillez sélectionner un fournisseur.'); return; }
    if (items.length === 0) { setError('Veuillez ajouter au moins un article.'); return; }
    setError(null);
    setSubmitting(true);
    try {
      const payload: PurchaseDocumentRequest = {
        type: 'INVOICE',
        supplier: { id: supplier.id },
        supplierInvoiceNumber: supplierInvoiceNumber.trim() || undefined,
        documentDate: documentDate || undefined,
        dueDate: dueDate || undefined,
        notes: notes.trim() || undefined,
        status: 'RECEIVED',
        lines: items.map(i => ({
          product: { id: i.product.id },
          quantity: i.qty,
          unitPrice: i.unitPrice,
        })),
      };
      const doc = await purchaseDocumentService.create(payload);
      await purchaseDocumentService.updateStock(doc.id);
      setSuccess(`Facture d'achat ${doc.documentNumber} créée — stock mis à jour.`);
      reset();
    } catch (e) {
      console.error("Erreur création facture d'achat", e);
      setError("Erreur lors de la création de la facture d'achat.");
    } finally {
      setSubmitting(false);
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
          background: 'linear-gradient(90deg, #0d3b66 0%, #1976a5 55%, #0d3b66 100%)',
          boxShadow: '0 8px 18px rgba(13,59,102,0.25)',
        }}
      >
        <FileText size={22} color="white" />
        <Box sx={{ flex: 1 }}>
          <Typography color="white" fontWeight={800} letterSpacing={1} fontSize="1rem">
            FACTURE D'ACHAT
          </Typography>
          <Typography color="rgba(255,255,255,0.75)" fontSize="0.78rem">
            {supplier ? supplier.name : 'Aucun fournisseur sélectionné'}
          </Typography>
        </Box>
        <Chip
          label={`${totalQty} article${totalQty > 1 ? 's' : ''}`}
          size="small"
          sx={{ backgroundColor: 'rgba(255,255,255,0.18)', color: 'white', fontWeight: 600 }}
        />
        <Typography color="white" fontWeight={800} fontSize="1.15rem">
          {money(total)}
        </Typography>
      </Box>

      {/* Informations facture */}
      <Paper elevation={0} sx={{ p: 2.5, mb: 2, borderRadius: 3, border: '1px solid #e8eaf6' }}>
        <Typography fontWeight={700} color="#1a237e" fontSize="0.9rem" mb={2}>
          Informations facture
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '2fr 1fr 1fr 1fr' },
            gap: 1.5,
          }}
        >
          <Autocomplete
            value={supplier}
            options={supplierOptions}
            loading={loadingSearch}
            onInputChange={searchSuppliers}
            onChange={(_, value) => selectSupplier(value)}
            getOptionLabel={(o) => `${o.name} (${o.code})`}
            isOptionEqualToValue={(o, v) => o.id === v.id}
            filterOptions={(x) => x}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                label="Fournisseur"
                placeholder="Rechercher un fournisseur…"
                required
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <InputAdornment position="start"><Truck size={16} /></InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

          <TextField
            size="small"
            label="N° facture fournisseur"
            placeholder="Ex. FA-2026-0142"
            value={supplierInvoiceNumber}
            onChange={e => setSupplierInvoiceNumber(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Hash size={15} /></InputAdornment>,
            }}
          />

          <TextField
            size="small"
            type="date"
            label="Date de facture"
            value={documentDate}
            onChange={e => changeDocumentDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><CalendarDays size={15} /></InputAdornment>,
            }}
          />

          <TextField
            size="small"
            type="date"
            label="Échéance"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            helperText={supplier?.paymentTerms != null ? `Délai fournisseur : ${supplier.paymentTerms} j` : ' '}
            InputProps={{
              startAdornment: <InputAdornment position="start"><CalendarDays size={15} /></InputAdornment>,
            }}
          />
        </Box>

        <TextField
          size="small"
          label="Notes"
          placeholder="Remarque interne, n° de bon de livraison, litige…"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          fullWidth
          multiline
          minRows={2}
          sx={{ mt: 1.5 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.2 }}>
                <StickyNote size={15} />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Articles */}
      <Paper elevation={0} sx={{ p: 2.5, mb: 2, borderRadius: 3, border: '1px solid #e8eaf6' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, gap: 2 }}>
          <Typography fontWeight={700} color="#1a237e" fontSize="0.9rem">
            Articles reçus
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
                placeholder="Rechercher un article à ajouter…"
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
                <TableCell align="right"><strong>Quantité</strong></TableCell>
                <TableCell align="right"><strong>Prix d'achat (€)</strong></TableCell>
                <TableCell align="right"><strong>Total (€)</strong></TableCell>
                <TableCell align="center"><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ color: 'text.secondary', py: 5 }}>
                    Aucun article. Utilisez la recherche ci-dessus pour en ajouter.
                  </TableCell>
                </TableRow>
              ) : (
                items.map(i => (
                  <TableRow key={i.product.id} hover>
                    <TableCell>{i.product.name}</TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#5c6bc0' }}>
                      {i.product.code ?? '—'}
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        type="number"
                        size="small"
                        value={i.qty}
                        onChange={e => updateQty(i.product.id, Number(e.target.value))}
                        inputProps={{ min: 1, style: { textAlign: 'right', width: 70 } }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        type="number"
                        size="small"
                        value={i.unitPrice}
                        onChange={e => updateUnitPrice(i.product.id, Number(e.target.value))}
                        inputProps={{ min: 0, step: 0.01, style: { textAlign: 'right', width: 90 } }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      {(i.qty * i.unitPrice).toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small" color="error" onClick={() => removeItem(i.product.id)}>
                        <Trash2 size={16} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Barre de validation */}
      <Paper
        elevation={0}
        sx={{
          position: 'sticky',
          bottom: 16,
          p: 2,
          borderRadius: 3,
          border: '1px solid #e8eaf6',
          backgroundColor: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
        }}
      >
        <Box>
          <Typography fontSize="0.72rem" color="text.secondary" textTransform="uppercase" letterSpacing={0.6}>
            Total facture
          </Typography>
          <Typography variant="h6" fontWeight={800} color="#1a237e">{money(total)}</Typography>
        </Box>

        <Divider orientation="vertical" flexItem />

        <Typography fontSize="0.8rem" color="text.secondary">
          {items.length} ligne{items.length > 1 ? 's' : ''} · {totalQty} article{totalQty > 1 ? 's' : ''}
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
            onClick={handleValidate}
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : undefined}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 2,
              px: 3,
              backgroundColor: '#1a237e',
              '&:hover': { backgroundColor: '#0d1757' },
            }}
          >
            {submitting ? 'Validation…' : 'Valider et entrer en stock'}
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={error !== null}
        autoHideDuration={4000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
      </Snackbar>
      <Snackbar
        open={success !== null}
        autoHideDuration={4000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccess(null)}>{success}</Alert>
      </Snackbar>
    </Box>
  );
}

export default PurchaseInvoice;
