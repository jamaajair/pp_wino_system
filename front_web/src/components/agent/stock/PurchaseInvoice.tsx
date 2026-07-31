import { useState } from 'react';
import {
  Alert, Autocomplete, Box, Button, CircularProgress, IconButton,
  InputAdornment, Paper, Snackbar, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Typography,
} from '@mui/material';
import { Package, Trash2, Truck } from 'lucide-react';
import type { Product, Supplier, PurchaseDocumentRequest } from '../../../types';
import { supplierService } from '../../../services/supplierService';
import { productService } from '../../../services/productService';
import { purchaseDocumentService } from '../../../services/purchaseDocumentService';

interface PurchaseLine {
  product: Product;
  qty: number;
  unitPrice: number;
}

function PurchaseInvoice() {
  const [supplier, setSupplier] = useState<Supplier | null>(null);
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

  const reset = () => {
    setSupplier(null);
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
    <Box sx={{ p: 2 }}>
      {/* Fournisseur + recherche article */}
      <Paper elevation={0} sx={{ p: 2, mb: 2, borderRadius: 3, border: '1px solid #e8eaf6' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.5 }}>
          <Autocomplete
            value={supplier}
            options={supplierOptions}
            loading={loadingSearch}
            onInputChange={searchSuppliers}
            onChange={(_, value) => setSupplier(value)}
            getOptionLabel={(o) => `${o.name} (${o.code})`}
            isOptionEqualToValue={(o, v) => o.id === v.id}
            filterOptions={(x) => x}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                label="Fournisseur"
                placeholder="Rechercher un fournisseur…"
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
          <Autocomplete
            key={productInputKey}
            options={productOptions}
            loading={loadingSearch}
            onInputChange={searchProducts}
            onChange={(_, value) => { if (value) { addProduct(value); setProductInputKey(k => k + 1); } }}
            getOptionLabel={(o) => o.name}
            isOptionEqualToValue={(o, v) => o.id === v.id}
            filterOptions={(x) => x}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                label="Ajouter un article"
                placeholder="Rechercher un article…"
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
      </Paper>

      {/* Lignes */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Article</strong></TableCell>
              <TableCell align="right"><strong>Quantité</strong></TableCell>
              <TableCell align="right"><strong>Prix d'achat (€)</strong></TableCell>
              <TableCell align="right"><strong>Total (€)</strong></TableCell>
              <TableCell align="center"><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ color: 'text.secondary', py: 4 }}>
                  Aucun article. Recherchez un article pour l'ajouter.
                </TableCell>
              </TableRow>
            ) : (
              items.map(i => (
                <TableRow key={i.product.id} hover>
                  <TableCell>{i.product.name}</TableCell>
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
                  <TableCell align="right">{(i.qty * i.unitPrice).toFixed(2)}</TableCell>
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

      {/* Total + actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={700} color="#1a237e">
          Total : {total.toFixed(2)} €
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" onClick={reset} disabled={submitting}
            sx={{ textTransform: 'none', borderRadius: 2 }}>
            Réinitialiser
          </Button>
          <Button
            variant="contained"
            onClick={handleValidate}
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : undefined}
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2, backgroundColor: '#1a237e', '&:hover': { backgroundColor: '#0d1757' } }}
          >
            {submitting ? 'Validation…' : 'Valider et entrer en stock'}
          </Button>
        </Box>
      </Box>

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
