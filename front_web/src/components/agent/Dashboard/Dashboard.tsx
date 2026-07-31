import { useEffect, useState } from 'react';
import {
  Box, Chip, CircularProgress, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Typography,
} from '@mui/material';
import { ClipboardList, FileText, Users, AlertTriangle, Wallet, Package } from 'lucide-react';
import type { Customer, Product, SaleDocumentResponse } from '../../../types';
import { saleDocumentService } from '../../../services/saleDocumentService';
import { customerService } from '../../../services/customerService';
import { productService } from '../../../services/productService';
import { financeService } from '../../../services/financeService';
import { getStoredUser } from '../../../services/authService';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  bg: string;
}

function StatCard({ icon, label, value, color, bg }: StatCardProps) {
  return (
    <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e8eaf6', display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 200 }}>
      <Box sx={{ width: 48, height: 48, borderRadius: 2, backgroundColor: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </Box>
      <Box>
        <Typography fontSize="0.78rem" color="#757575" textTransform="uppercase" letterSpacing={0.5}>{label}</Typography>
        <Typography variant="h5" fontWeight={800} color="#1a237e">{value}</Typography>
      </Box>
    </Paper>
  );
}

function Dashboard() {
  const [docs, setDocs] = useState<SaleDocumentResponse[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [lowStock, setLowStock] = useState<Product[]>([]);
  const [totalBalance, setTotalBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const role = getStoredUser()?.role ?? '';
  const canSeeFinance = role === 'ADMIN' || role === 'MANAGER';

  useEffect(() => {
    const tasks: Promise<unknown>[] = [
      saleDocumentService.getAll().then(setDocs).catch(() => setDocs([])),
      customerService.getAll().then(setCustomers).catch(() => setCustomers([])),
      productService.getAll().then(setProducts).catch(() => setProducts([])),
      productService.getLowStock().then(setLowStock).catch(() => setLowStock([])),
    ];
    if (canSeeFinance) {
      tasks.push(financeService.getTotalBalance().then(setTotalBalance).catch(() => setTotalBalance(null)));
    }
    Promise.all(tasks).finally(() => setLoading(false));
  }, [canSeeFinance]);

  const customerName = (id: number) => customers.find(c => c.id === id)?.name ?? `#${id}`;
  const pendingOrders = docs.filter(d => d.type === 'ORDER' && d.status === 'SENT');

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={800} color="#1a237e" mb={0.5}>Tableau de bord</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>Aperçu de l'activité</Typography>

      {/* KPI cards */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
        <StatCard icon={<ClipboardList size={24} />} label="Commandes à traiter" value={pendingOrders.length} color="#e65100" bg="#fff3e0" />
        <StatCard icon={<FileText size={24} />} label="Documents de vente" value={docs.length} color="#1a237e" bg="#e8eaf6" />
        <StatCard icon={<Users size={24} />} label="Clients" value={customers.length} color="#00695c" bg="#e0f2f1" />
        <StatCard icon={<Package size={24} />} label="Articles" value={products.length} color="#4527a0" bg="#ede7f6" />
        <StatCard icon={<AlertTriangle size={24} />} label="Articles en stock bas" value={lowStock.length} color="#b71c1c" bg="#ffebee" />
        {canSeeFinance && totalBalance !== null && (
          <StatCard icon={<Wallet size={24} />} label="Solde total" value={`${totalBalance.toFixed(2)} €`} color="#1b5e20" bg="#e8f5e9" />
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Commandes à traiter */}
        <Box sx={{ flex: 2, minWidth: 340 }}>
          <Typography fontWeight={700} color="#1a237e" mb={1.5}>Commandes clients à traiter</Typography>
          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell><strong>N°</strong></TableCell>
                  <TableCell><strong>Client</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell align="right"><strong>Articles</strong></TableCell>
                  <TableCell align="center"><strong>Statut</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingOrders.length === 0 ? (
                  <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>Aucune commande en attente.</TableCell></TableRow>
                ) : (
                  pendingOrders.map(o => (
                    <TableRow key={o.documentNumber} hover>
                      <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#1a237e' }}>{o.documentNumber}</TableCell>
                      <TableCell>{customerName(o.customerId)}</TableCell>
                      <TableCell>{o.documentDate}</TableCell>
                      <TableCell align="right">{o.lines.length}</TableCell>
                      <TableCell align="center"><Chip label="À traiter" size="small" color="warning" /></TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Stock bas */}
        <Box sx={{ flex: 1, minWidth: 260 }}>
          <Typography fontWeight={700} color="#1a237e" mb={1.5}>Alertes stock bas</Typography>
          <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 1 }}>
            {lowStock.length === 0 ? (
              <Typography sx={{ p: 2, color: 'text.secondary' }} fontSize="0.875rem">Aucun article en stock bas.</Typography>
            ) : (
              lowStock.slice(0, 8).map(p => (
                <Box key={p.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1.5, py: 1, borderBottom: '1px solid #f0f0f0' }}>
                  <Typography fontSize="0.85rem" noWrap sx={{ maxWidth: 170 }}>{p.name}</Typography>
                  <Chip label={`${p.stockQuantity}`} size="small" color="error" variant="outlined" />
                </Box>
              ))
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
