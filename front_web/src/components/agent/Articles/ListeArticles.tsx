import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, CircularProgress,
  IconButton, Tooltip, Drawer, Divider, TextField, InputAdornment,
} from '@mui/material';
import { Eye, X, Search } from 'lucide-react';
import type { Product } from '../../../types';
import { productService } from '../../../services/productService';
import AppTabs from '../UsefeulComponents/Tabs';

const TABS = [
  { value: 'ALL', label: 'Tous' },
  { value: 'LOW_STOCK', label: 'Stock bas' },
  { value: 'OUT_OF_STOCK', label: 'Rupture' },
  { value: 'INACTIVE', label: 'Inactifs' },
] as const;

type TabValue = typeof TABS[number]['value'];

const money = (value?: number) => `${Number(value ?? 0).toFixed(2)} €`;

// Dans ce projet salePrice est un prix TTC : QuoteLine calcule le HTVA en divisant
// par (1 + tva/100), et compare ce HTVA au purchasePrice. On garde la même convention.
const priceExclVat = (product: Product) =>
  Number(product.salePrice ?? 0) / (1 + Number(product.tva ?? 0) / 100);

const margin = (product: Product) => priceExclVat(product) - Number(product.purchasePrice ?? 0);

// Même règle que findLowStockProducts() côté backend : stockQuantity <= minStockLevel
const isLowStock = (product: Product) =>
  product.minStockLevel != null && Number(product.stockQuantity ?? 0) <= Number(product.minStockLevel);

const isOutOfStock = (product: Product) => Number(product.stockQuantity ?? 0) <= 0;

function ListeArticles() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabValue>('ALL');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Product | null>(null);

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

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return products.filter(product => {
      const matchesTab =
        activeTab === 'ALL' ? true
          : activeTab === 'LOW_STOCK' ? isLowStock(product)
          : activeTab === 'OUT_OF_STOCK' ? isOutOfStock(product)
          : product.active === false;

      if (!matchesTab) return false;
      if (!needle) return true;

      return [product.name, product.code, product.barcode, product.category?.name]
        .some(field => field?.toLowerCase().includes(needle));
    });
  }, [products, activeTab, query]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" color="#1a237e" mb={3}>
        Articles
      </Typography>

      <AppTabs<TabValue>
        tabs={TABS.map(t => ({ value: t.value, label: t.label }))}
        value={activeTab}
        onChange={setActiveTab}
      />

      <TextField
        size="small"
        placeholder="Rechercher par nom, code, code-barres ou catégorie…"
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
          <Typography>Aucun article trouvé.</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><strong>Code</strong></TableCell>
                <TableCell><strong>Nom</strong></TableCell>
                <TableCell><strong>Catégorie</strong></TableCell>
                <TableCell align="right"><strong>Prix achat</strong></TableCell>
                <TableCell align="right"><strong>Vente TTC</strong></TableCell>
                <TableCell align="right"><strong>Marge</strong></TableCell>
                <TableCell align="right"><strong>Stock</strong></TableCell>
                <TableCell align="center"><strong>État</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(product => (
                <TableRow key={product.id} hover>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#1a237e' }}>
                    {product.code ?? '—'}
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category?.name ?? '—'}</TableCell>
                  <TableCell align="right">{money(product.purchasePrice)}</TableCell>
                  <TableCell align="right">{money(product.salePrice)}</TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: margin(product) <= 0 ? '#b71c1c' : '#1b5e20', fontWeight: 600 }}
                  >
                    {money(margin(product))}
                  </TableCell>
                  <TableCell align="right">
                    {Number(product.stockQuantity ?? 0)} {product.unit ?? ''}
                  </TableCell>
                  <TableCell align="center">
                    {product.active === false ? (
                      <Chip label="Inactif" size="small" color="default" />
                    ) : isOutOfStock(product) ? (
                      <Chip label="Rupture" size="small" color="error" />
                    ) : isLowStock(product) ? (
                      <Chip label="Stock bas" size="small" color="warning" />
                    ) : (
                      <Chip label="OK" size="small" color="success" variant="outlined" />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Voir le détail">
                      <IconButton size="small" onClick={() => setSelected(product)}>
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

            <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
              {selected.category?.name && (
                <Chip label={selected.category.name} size="small" variant="outlined" color="primary" />
              )}
              {selected.active === false && <Chip label="Inactif" size="small" />}
              {isOutOfStock(selected) && <Chip label="Rupture" size="small" color="error" />}
              {!isOutOfStock(selected) && isLowStock(selected) && (
                <Chip label="Stock bas" size="small" color="warning" />
              )}
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Typography fontWeight="bold" mb={1.5}>Identification</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
              <Row label="Code" value={selected.code ?? '—'} />
              <Row label="Code-barres" value={selected.barcode ?? '—'} />
              <Row label="Catégorie" value={selected.category?.name ?? '—'} />
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Typography fontWeight="bold" mb={1.5}>Tarification</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
              <Row label="Prix d'achat" value={money(selected.purchasePrice)} />
              <Row label="Prix de vente TTC" value={money(selected.salePrice)} />
              <Row label="TVA" value={`${Number(selected.tva ?? 0)} %`} />
              <Row label="Prix de vente HTVA" value={money(priceExclVat(selected))} />
              <Row label="Marge unitaire" value={money(margin(selected))} />
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Typography fontWeight="bold" mb={1.5}>Stock</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
              <Row label="Quantité" value={`${Number(selected.stockQuantity ?? 0)} ${selected.unit ?? ''}`} />
              <Row label="Seuil minimum" value={selected.minStockLevel != null ? String(selected.minStockLevel) : '—'} />
              <Row label="Seuil maximum" value={selected.maxStockLevel != null ? String(selected.maxStockLevel) : '—'} />
              <Row label="Quantité par colis" value={selected.qteColis != null ? String(selected.qteColis) : '—'} />
            </Box>

            {selected.description && (
              <>
                <Divider sx={{ mb: 2 }} />
                <Typography fontWeight="bold" mb={1}>Description</Typography>
                <Typography fontSize="0.875rem" color="text.secondary">
                  {selected.description}
                </Typography>
              </>
            )}
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

export default ListeArticles;
