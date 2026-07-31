import { Box, Fade } from '@mui/material';
import { useState } from 'react';
import type { Customer, Product } from '../../../types';
import CreditNoteHeader from './CreditNoteHeader';
import CreditNoteLines from './CreditNoteLines';
import CreditNoteSummary from './CreditNoteSummary';
import { productService } from '../../../services/productService';

export interface CreditNoteItem {
  product: Product;
  qty: number;
}

interface NewCreditNoteProps {
  currentTask: string,
  setCurrentTask:(value: string | null) => void;
  onClose: () => void;
}

function NewCreditNote({currentTask, setCurrentTask, onClose: _onClose }: NewCreditNoteProps) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [CreditNoteNumber] = useState('NC-001');
  const [items, setItems] = useState<CreditNoteItem[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);


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

  const onValidCreditNote = async () => {
    if(!customer){
      setError('Veuillez sélectionner un client avant de valider la note de crédit.');
      return;
    }

    if(items.length === 0){
      setError('Veuillez ajouter au moins un produit à la note de crédit.');
      return;
    }
    setError(null);
    try {
      const payload = {
        type: 'CREDIT_NOTE' as const,
        customerId: customer?.id ?? 0,
        lines: items.map(i => ({
          productId: i.product.id,
          quantity: i.qty,
        }))
      };
      const doc = await productService.createSaleDocument(payload);
      setIsValid(true);
      console.log('Document créé :', doc);
    } catch (error) {
      console.error('Erreur création CreditNote', error);
    }
  };

  return (
    <>
    {currentTask && !isValid && (
      <Fade in={isVisible} timeout={600} onExited={() => setCurrentTask(null)} >
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f7f8fc' }}>
          
          <Box sx={{ position: 'sticky', top: 0, zIndex: 10, p: 2, backgroundColor: '#f7f8fc' }}>
            <CreditNoteHeader 
              onCancel={handleCancel} 
              CreditNoteNumber={CreditNoteNumber} 
              customer={customer} 
              setCustomer={setCustomer} 
              addProduct={addProduct} 
              onValidCreditNote={onValidCreditNote} 
              errorVal={error} 
              setErrorVal={setError}
            />
          </Box>
          
          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            <CreditNoteLines items={items} onRemove={removeItem} onUpdateQty={updateQty} />
          </Box>
          
          <Box 
            sx={{ 
              position: 'sticky',
              bottom: 0,
              zIndex: 10,
              p: 2,
              backgroundColor: '#f7f8fc' 
              }}
              >
            <CreditNoteSummary items={items} />
          </Box>
        </Box>
      </Fade>
    )}
    {/*{isValid && (
      <Snackbar
        open={isValid}
        autoHideDuration={3500}
        onClose={() => setIsValid(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setIsValid(false)}>
          Le devis a été créé avec succès.
        </Alert>
      </Snackbar>
    )}*/}
    </>
  );
}

export default NewCreditNote;
