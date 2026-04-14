import { Box, Fade } from '@mui/material';
import { useState } from 'react';
import type { Customer, Product } from '../../../types';
import QuoteHeader from './QuoteHeader';
import QuoteLines from './QuoteLines';
import QuoteSummary from './QuoteSummary';

export interface QuoteItem {
  product: Product;
  qty: number;
}

interface NewQuoteProps {
  currentTask: string,
  setCurrentTask:(value: string | null) => void;
  onClose: () => void;
}

function NewQuote({currentTask, setCurrentTask, onClose: _onClose }: NewQuoteProps) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [quoteNumber] = useState('DEV-001');
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  const handleCancel = () => setIsVisible(false);

  const addProduct = (product: Product) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
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

  return (
    currentTask && (
      <Fade in={isVisible} timeout={600} onExited={() => setCurrentTask(null)} >
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f7f8fc' }}>
          <Box sx={{ position: 'sticky', top: 0, zIndex: 10, p: 2, backgroundColor: '#f7f8fc' }}>
            <QuoteHeader onCancel={handleCancel} quoteNumber={quoteNumber} customer={customer} setCustomer={setCustomer} addProduct={addProduct} />
          </Box>

          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            <QuoteLines items={items} onRemove={removeItem} onUpdateQty={updateQty} />
          </Box>

          <Box sx={{ position: 'sticky', bottom: 0, zIndex: 10, p: 2, backgroundColor: '#f7f8fc' }}>
            <QuoteSummary items={items} />
          </Box>
        </Box>
      </Fade>
    )
  );
}

export default NewQuote;
