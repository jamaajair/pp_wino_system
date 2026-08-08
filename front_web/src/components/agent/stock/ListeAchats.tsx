import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, CircularProgress,
  IconButton, Tooltip, Drawer, Divider, TextField, InputAdornment,
  Button, Snackbar, Alert,
} from '@mui/material';
import { Eye, X, Search, Truck } from 'lucide-react';
import axios from 'axios';
import type { PurchaseDocumentResponse } from '../../../types';
import { purchaseDocumentService } from '../../../services/purchaseDocumentService';

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Brouillon',
  SENT: 'Envoyé',
  RECEIVED: 'Reçu',
  PAID: 'Payé',
};

const money = (value?: number) => `${Number(value ?? 0).toFixed(2)} €`;

// La liste ne contient que des factures d'achat, que updateStock() accepte : reste
// à vérifier que le stock n'a pas déjà été entré, sinon l'entité refuse le second passage.
const canUpdateStock = (doc: PurchaseDocumentResponse) => !doc.stockUpdated;

function stockUpdateErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.error ?? error.response?.data?.message;
    if (typeof detail === 'string' && detail.length > 0) return detail;
  }
  return 'La mise à jour du stock a échoué.';
}

function ListeAchats() {
  const [documents, setDocuments] = useState<PurchaseDocumentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<PurchaseDocumentResponse | null>(null);
  const [updating, setUpdating] = useState(false);
  const [feedback, setFeedback] = useState<{ severity: 'success' | 'error'; text: string } | null>(null);

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    try {
      setDocuments(await purchaseDocumentService.getAll());
    } catch {
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadDocuments(); }, [loadDocuments]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return documents
      .filter(doc => doc.type === 'INVOICE')
      .filter(doc => {
        if (!needle) return true;
        return [doc.documentNumber, doc.supplierInvoiceNumber, doc.supplier?.name, doc.supplier?.code]
          .some(field => field?.toLowerCase().includes(needle));
      });
  }, [documents, query]);

  const handleUpdateStock = async (doc: PurchaseDocumentResponse) => {
    setUpdating(true);
    try {
      await purchaseDocumentService.updateStock(doc.id);
      await loadDocuments();
      setSelected(null);
      setFeedback({
        severity: 'success',
        text: `Stock mis à jour à partir de ${doc.documentNumber}.`,
      });
    } catch (error) {
      setFeedback({ severity: 'error', text: stockUpdateErrorMessage(error) });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" color="#1a237e" mb={0.5}>
        Factures d'achat
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Entrées de stock enregistrées auprès des fournisseurs
      </Typography>

      <TextField
        size="small"
        placeholder="Rechercher par n° de document, n° fournisseur ou fournisseur…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        sx={{ mb: 2, width: 440 }}
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
          <Typography>Aucune facture d'achat.</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><strong>N° Document</strong></TableCell>
                <TableCell><strong>N° Fournisseur</strong></TableCell>
                <TableCell><strong>Fournisseur</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Échéance</strong></TableCell>
                <TableCell align="right"><strong>Total</strong></TableCell>
                <TableCell align="center"><strong>Stock</strong></TableCell>
                <TableCell align="center"><strong>Statut</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(doc => (
                <TableRow key={doc.id} hover>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#1a237e' }}>
                    {doc.documentNumber}
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                    {doc.supplierInvoiceNumber ?? '—'}
                  </TableCell>
                  <TableCell>{doc.supplier?.name ?? '—'}</TableCell>
                  <TableCell>{doc.documentDate}</TableCell>
                  <TableCell>{doc.dueDate ?? '—'}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>{money(doc.totalAmount)}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={doc.stockUpdated ? 'Entré' : 'En attente'}
                      color={doc.stockUpdated ? 'success' : 'warning'}
                      size="small"
                      variant={doc.stockUpdated ? 'filled' : 'outlined'}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={doc.status ? (STATUS_LABELS[doc.status] ?? doc.status) : '—'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Voir le détail">
                      <IconButton size="small" onClick={() => setSelected(doc)}>
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
        PaperProps={{ sx: { width: 900, p: 3 } }}
      >
        {selected && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold" color="#1a237e">
                {selected.documentNumber}
              </Typography>
              <IconButton size="small" onClick={() => setSelected(null)}>
                <X size={18} />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mb: 3, alignItems: 'center' }}>
              <Chip
                label={selected.status ? (STATUS_LABELS[selected.status] ?? selected.status) : '—'}
                size="small"
              />
              <Chip
                label={selected.stockUpdated ? 'Stock entré' : 'Stock en attente'}
                color={selected.stockUpdated ? 'success' : 'warning'}
                size="small"
                variant={selected.stockUpdated ? 'filled' : 'outlined'}
              />
              {canUpdateStock(selected) && (
                <Box sx={{ ml: 'auto' }}>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    disabled={updating}
                    startIcon={updating
                      ? <CircularProgress size={14} color="inherit" />
                      : <Truck size={16} />}
                    onClick={() => handleUpdateStock(selected)}
                  >
                    Entrer en stock
                  </Button>
                </Box>
              )}
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Typography fontWeight="bold" mb={1.5}>Fournisseur</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
              <Row label="Nom" value={selected.supplier?.name ?? '—'} />
              <Row label="Code" value={selected.supplier?.code ?? '—'} />
              <Row label="Contact" value={selected.supplier?.contactPerson ?? '—'} />
              <Row label="Téléphone" value={selected.supplier?.phone ?? '—'} />
              <Row label="Email" value={selected.supplier?.email ?? '—'} />
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Typography fontWeight="bold" mb={1.5}>Document</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
              <Row label="N° facture fournisseur" value={selected.supplierInvoiceNumber ?? '—'} />
              <Row label="Date" value={selected.documentDate} />
              <Row label="Échéance" value={selected.dueDate ?? '—'} />
              {selected.notes && <Row label="Notes" value={selected.notes} />}
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Typography fontWeight="bold" mb={1.5}>
              Lignes ({selected.lines?.length ?? 0})
            </Typography>

            {!selected.lines || selected.lines.length === 0 ? (
              <Typography color="text.secondary" fontSize="0.875rem">Aucune ligne.</Typography>
            ) : (
              <>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell><strong>Article</strong></TableCell>
                      <TableCell><strong>Code</strong></TableCell>
                      <TableCell align="right"><strong>Qté</strong></TableCell>
                      <TableCell align="right"><strong>Prix d'achat</strong></TableCell>
                      <TableCell align="right"><strong>Total</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selected.lines.map((line, i) => (
                      <TableRow key={line.id ?? i}>
                        <TableCell>{line.product?.name ?? '—'}</TableCell>
                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                          {line.product?.code ?? '—'}
                        </TableCell>
                        <TableCell align="right">
                          {Number(line.quantity)} {line.product?.unit ?? ''}
                        </TableCell>
                        <TableCell align="right">{money(Number(line.unitPrice))}</TableCell>
                        <TableCell align="right">{money(Number(line.lineTotal))}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Typography fontWeight="bold" color="#1a237e">
                    Total : {money(selected.totalAmount)}
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        )}
      </Drawer>

      <Snackbar
        open={feedback !== null}
        autoHideDuration={5000}
        onClose={() => setFeedback(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {feedback ? (
          <Alert severity={feedback.severity} onClose={() => setFeedback(null)}>
            {feedback.text}
          </Alert>
        ) : undefined}
      </Snackbar>
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

export default ListeAchats;
