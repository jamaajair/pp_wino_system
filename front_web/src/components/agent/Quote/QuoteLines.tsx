import { Box, Typography } from '@mui/material';
import type { QuoteItem } from './NewQuote';
import QuoteLine from './QuoteLine';

interface QuoteLinesProps {
  items: QuoteItem[];
  onRemove: (productId: number) => void;
  onUpdateQty: (productId: number, qty: number) => void;
}

function QuoteLines({ items, onRemove, onUpdateQty }: QuoteLinesProps) {
  if (items.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
        Aucun article sélectionné
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 0.5 }}>
        <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ flex: 1 }}>
          Nom d'article
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ width: 90, textAlign: 'center' }}>
            Qté
          </Typography>
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ width: 90, textAlign: 'center' }}>
            Qté Colis
          </Typography>
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ width: 90, textAlign: 'center' }}>
            Prix
          </Typography>
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ minWidth: 70, textAlign: 'right' }}>
            Prix de revient
          </Typography>
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ minWidth: 70, textAlign: 'right' }}>
            TVA
          </Typography>
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ minWidth: 70, textAlign: 'right' }}>
            Prix HTVA
          </Typography>
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ minWidth: 70, textAlign: 'right' }}>
            Prix TTC
          </Typography>
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ minWidth: 70, textAlign: 'right' }}>
            Bénifice
          </Typography>
          <Box sx={{ width: 34 }} />
        </Box>
      </Box>

      {items.map(item => (
        <QuoteLine
          key={item.product.id}
          item={item}
          onRemove={() => onRemove(item.product.id)}
          onUpdateQty={(qty) => onUpdateQty(item.product.id, qty)}
        />
      ))}
    </Box>
  );
}

export default QuoteLines;
