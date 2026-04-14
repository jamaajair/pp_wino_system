import { Delete } from '@mui/icons-material';
import { Box, Typography, IconButton, Paper, TextField } from '@mui/material';
import type { QuoteItem } from './NewQuote';

interface QuoteLineProps {
  item: QuoteItem;
  onRemove: () => void;
  onUpdateQty: (qty: number) => void;
}

function QuoteLine({ item, onRemove, onUpdateQty }: QuoteLineProps) {
  const { product, qty } = item;
  const prixTTC = product.salePrice * qty;
  const prixHTVA = prixTTC / (1 + product.tva / 100);
  const prixRevient = product.purchasePrice * qty;
  const benefice = prixHTVA - prixRevient;

  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2,
        py: 1.5,
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
        backgroundColor: 'white',
      }}
    >
      {/* Nom d'article — flex: 1, matches header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
        {/* <Box sx={{ width: 48, height: 48, borderRadius: 1.5, backgroundColor: '#f0f2f7', flexShrink: 0 }} /> */}
        <Box sx={{ minWidth: 0 }}>
          <Typography fontWeight={700} fontSize={14} noWrap>{product.name}</Typography>
          <Typography variant="body2" color="text.secondary" noWrap>{product.unit}</Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {/* Qté — width: 90, center */}
        <Box sx={{ width: 90, display: 'flex', justifyContent: 'center' }}>
          <TextField
            variant="outlined"
            size="small"
            value={qty}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val)) onUpdateQty(val);
            }}
            slotProps={{ htmlInput: { min: 1, style: { textAlign: 'center', width: 44, padding: '4px 6px' } } }}
          />
        </Box>

        {/* Qté Colis — width: 90, center */}
        <Typography fontSize={14} sx={{ width: 90, textAlign: 'center' }}>
          {product.qteColis}
        </Typography>

        {/* Prix — width: 90, center */}
        <Typography fontSize={14} sx={{ width: 90, textAlign: 'center' }}>
          {product.salePrice.toFixed(2)} €
        </Typography>

        {/* Prix de revient — minWidth: 70, right */}
        <Typography fontSize={14} sx={{ minWidth: 70, textAlign: 'right' }}>
          {prixRevient.toFixed(2)} €
        </Typography>

        {/* TVA — minWidth: 70, right */}
        <Typography fontSize={14} sx={{ minWidth: 70, textAlign: 'right' }}>
          {product.tva} %
        </Typography>

        {/* Prix HTVA — minWidth: 70, right */}
        <Typography fontSize={14} sx={{ minWidth: 70, textAlign: 'right' }}>
          {prixHTVA.toFixed(2)} €
        </Typography>

        {/* Prix TTC — minWidth: 70, right */}
        <Typography fontWeight={700} fontSize={14} sx={{ minWidth: 70, textAlign: 'right' }}>
          {prixTTC.toFixed(2)} €
        </Typography>

        {/* Bénéfice — minWidth: 70, right */}
        <Typography
          fontSize={14}
          fontWeight={600}
          sx={{ minWidth: 70, textAlign: 'right', color: benefice >= 0 ? '#2e7d32' : '#c62828' }}
        >
          {benefice.toFixed(2)} €
        </Typography>

        {/* Delete — width: 34 */}
        <IconButton size="small" onClick={onRemove} sx={{ color: '#e53935', width: 34 }}>
          <Delete fontSize="small" />
        </IconButton>
      </Box>
    </Paper>
  );
}

export default QuoteLine;
