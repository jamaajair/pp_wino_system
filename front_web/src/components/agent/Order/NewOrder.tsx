import { useState } from 'react';
import { Box, Fade } from '@mui/material';
import OrderHeader from './OrderHeader';
import type { Customer, Product } from '../../../types';
import OrderLines from './OrderLines';
import OrderSummary from './OrderSummary';
import { productService } from '../../../services/productService';


export interface OrderItem {
  product: Product;
  qty: number;
}

interface NewOrderProps {
  currentTask: string,
  setCurrentTask:(value: string | null) => void;
  onClose: () => void;
}


function NewOrder({currentTask, setCurrentTask, onClose: _onClose }: NewOrderProps) {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isValid, setIsValid] = useState(false);

  
  const addProduct = (product: Product) => {
      console.log('Adding product:', product);
      setItems(prev => {
        const existing = prev.find(i => i.product.id === product.id);
        if (existing) return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
        return [...prev, { product, qty: 1 }];
      });
  };

  const onValidateOrder = async () => {
    if(!customer){
      setError('Veuillez sélectionner un client avant de valider le devis.');
      return;
    }

    if (items.length === 0) {
      setError('Veuillez ajouter au moins un produit au devis.');
      return;
    }
    setError(null);

    try {
          const payload = {
            type: 'ORDER' as const,
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
          console.error('Erreur création quote', error);
        }
  };

  const onCancelOrder = () => {
    setIsVisible(false);
  }

  const removeItem = (productId: number) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  };

  const updateQty = (productId: number, qty: number) => {
    if (qty <= 0) { removeItem(productId); return; }
    setItems(prev => prev.map(i => i.product.id === productId ? { ...i, qty } : i));
  };

  return (
    <>
    {currentTask && !isValid && (
      <Fade in={isVisible} timeout={600} onExited={() => setCurrentTask(null)}>
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f7f8fc' }}>
          <Box sx={{ position: 'sticky', top: 0, zIndex: 10, p: 2, backgroundColor: '#f7f8fc' }}>
              <OrderHeader 
                addProduct={addProduct} 
                customer={customer} 
                setCustomer={setCustomer}
                errorVal={error} 
                setErrorVal={setError}
                onValidateOrder={onValidateOrder}
                onCancelOrder={onCancelOrder}
              />
          </Box>

          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              <OrderLines 
                items={items}
                onRemove={removeItem}
                onUpdateQty={updateQty}
              />
          </Box>

          <Box sx={{ 
              position: 'sticky',
              bottom: 0,
              zIndex: 10,
              p: 2,
              backgroundColor: '#f7f8fc' 
              }}>
              <OrderSummary 
                items={items}
              />
          </Box>
        </Box>
      </Fade>
    )}
    </>
  );
}

export default NewOrder;