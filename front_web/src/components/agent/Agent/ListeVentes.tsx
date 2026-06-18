import { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, Tabs, Tab, CircularProgress,
  IconButton, Tooltip, Drawer, Divider,
  Button,  Menu, MenuItem
} from '@mui/material';
import { KeyboardArrowUp } from "@mui/icons-material";
import { Eye, X } from 'lucide-react';
import type { SaleDocumentResponse, DocumentType } from '../../../types';
import { saleDocumentService } from '../../../services/saleDocumentService';

const TYPE_LABELS: Record<DocumentType, string> = {
  QUOTE: 'Devis',
  ORDER: 'Commande',
  INVOICE: 'Facture',
  DELIVERY_NOTE: 'Bon de livraison',
};

const TYPE_COLORS: Record<DocumentType, 'info' | 'primary' | 'success' | 'warning'> = {
  QUOTE: 'info',
  ORDER: 'primary',
  INVOICE: 'success',
  DELIVERY_NOTE: 'warning',
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Brouillon',
  SENT: 'Envoyé',
  PAID: 'Payé',
  CANCELLED: 'Annulé',
};

const STATUS_COLORS: Record<string, 'default' | 'info' | 'success' | 'error'> = {
  DRAFT: 'default',
  SENT: 'info',
  PAID: 'success',
  CANCELLED: 'error',
};

const TABS = ['ALL', 'QUOTE', 'ORDER', 'INVOICE', 'DELIVERY_NOTE'] as const;
type TabValue = typeof TABS[number];

const TAB_LABELS: Record<TabValue, string> = {
  ALL: 'Tous',
  QUOTE: 'Devis',
  ORDER: 'Commandes',
  INVOICE: 'Factures',
  DELIVERY_NOTE: 'Bons de livraison',
};

function ListeVentes() {
  const [documents, setDocuments] = useState<SaleDocumentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabValue>('ALL');
  const [selectedDoc, setSelectedDoc] = useState<SaleDocumentResponse | null>(null);

  useEffect(() => {
    saleDocumentService.getAll()
      .then(setDocuments)
      .catch(() => setDocuments([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeTab === 'ALL'
    ? documents
    : documents.filter(d => d.type === activeTab);

  const handleQuoteToOrder = () => {
    console.log("Passons à l'action");
    try{
      const data = saleDocumentService.convertDocument(selectedDoc!.documentNumber, "INVOICE");
      console.log('Document converti :', data);
    } catch (error) {
      console.error('Erreur lors de la conversion :', error);
    }
  }

  const handleQuoteToDelivery = () => {}
  const handleQuoteToInvoice = () => {}

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" color="#1a237e" mb={3}>
        Documents de vente
      </Typography>

      <Tabs
        value={activeTab}
        onChange={(_, v: TabValue) => setActiveTab(v)}
        sx={{ mb: 2, borderBottom: '1px solid #e0e0e0' }}
      >
        {TABS.map(t => (
          <Tab key={t} value={t} label={TAB_LABELS[t]} />
        ))}
      </Tabs>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      ) : filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 8, color: 'text.secondary' }}>
          <Typography>Aucun document trouvé.</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><strong>N° Document</strong></TableCell>
                <TableCell><strong>Type</strong></TableCell>
                <TableCell><strong>Client</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Échéance</strong></TableCell>
                <TableCell><strong>Statut</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(doc => (
                <TableRow key={doc.documentNumber} hover>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#1a237e' }}>
                    {doc.documentNumber}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={TYPE_LABELS[doc.type]}
                      color={TYPE_COLORS[doc.type]}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{doc.customerId}</TableCell>
                  <TableCell>{doc.documentDate}</TableCell>
                  <TableCell>{doc.dueDate ?? '—'}</TableCell>
                  <TableCell>
                    <Chip
                      label={doc.status ? STATUS_LABELS[doc.status] : "—"}
                      color={doc.status ? STATUS_COLORS[doc.status] : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Voir le détail">
                      <IconButton size="small" onClick={() => {setSelectedDoc(doc); console.log('Document sélectionné :', doc);}}>
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
        open={selectedDoc !== null}
        onClose={() => setSelectedDoc(null)}
        PaperProps={{ sx: { width: 1120, p: 3 } }}
      >
        {selectedDoc && (
          <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold" color="#1a237e">
                {selectedDoc.documentNumber}
              </Typography>
              <IconButton size="small" onClick={() => setSelectedDoc(null)}>
                <X size={18} />
              </IconButton>
            </Box>

            {/* Chips type + statut */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <Chip
                label={TYPE_LABELS[selectedDoc.type]}
                color={TYPE_COLORS[selectedDoc.type]}
                variant="outlined"
                size="small"
              />
              <Chip
                label={selectedDoc.status ? STATUS_LABELS[selectedDoc.status] : "—"}
                color={selectedDoc.status ? STATUS_COLORS[selectedDoc.status] : "default"}
                size="small"
              />
              {selectedDoc.convertedFromDocumentNumber && (
                <Chip
                  label={`Converti de ${selectedDoc.convertedFromDocumentNumber}`}
                  color="default"
                  size="small"
                />
              )}
              {selectedDoc.type === 'QUOTE' && (
                <Box sx={{ ml: "auto" }}>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={handleOpen}
                    endIcon={<KeyboardArrowUp />}
                    
                  >
                    Convertir
                  </Button>

                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: "top", horizontal: "left" }}
                    transformOrigin={{ vertical: "bottom", horizontal: "left" }}
                  >
                    <MenuItem onClick={() => { handleQuoteToOrder(); handleClose(); }}>
                      En Commande
                    </MenuItem>
                    <MenuItem onClick={() => { handleQuoteToDelivery(); handleClose(); }}>
                      En Note d'envoi
                    </MenuItem>
                    <MenuItem onClick={() => { handleQuoteToInvoice(); handleClose(); }}>
                      En Facture
                    </MenuItem>
                  </Menu>
                  
                </Box>
              )}
              {
                selectedDoc.type === 'ORDER' && (
                  <Box sx={{ ml: 'auto' }}>
                    <Button variant="contained" size="small" color="success">
                      Convertir en facture
                    </Button>
                  </Box>)
              }
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Infos générales */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
              <Row label="Client ID" value={String(selectedDoc.customerId)} />
              <Row label="Date" value={selectedDoc.documentDate} />
              <Row label="Échéance" value={selectedDoc.dueDate ?? '—'} />
              {selectedDoc.notes && <Row label="Notes" value={selectedDoc.notes} />}
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Lignes du document */}
            <Typography fontWeight="bold" mb={1.5}>
              Lignes ({selectedDoc.lines.length})
            </Typography>

            {selectedDoc.lines.length === 0 ? (
              <Typography color="text.secondary" fontSize="0.875rem">Aucune ligne.</Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><strong>Produit</strong></TableCell>
                    <TableCell align="right"><strong>Qté</strong></TableCell>
                    <TableCell align="right"><strong>P.U.</strong></TableCell>
                    <TableCell align="right"><strong>Total</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedDoc.lines.map((line, i) => (
                    <TableRow key={i}>
                      <TableCell>{line.productName}</TableCell>
                      <TableCell align="right">{Number(line.quantity)}</TableCell>
                      <TableCell align="right">{Number(line.unitPrice).toFixed(2)} €</TableCell>
                      <TableCell align="right">{Number(line.totalPrice).toFixed(2)} €</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Box>
        )}
      </Drawer>
    </Box>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Typography fontSize="0.875rem" color="text.secondary">{label}</Typography>
      <Typography fontSize="0.875rem" fontWeight={500}>{value}</Typography>
    </Box>
  );
}

export default ListeVentes;
