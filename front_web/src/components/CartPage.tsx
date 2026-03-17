 import { Box, Button, Container, Divider, Typography } from
  '@mui/material';
  import type { CartItem } from '../types';

  function CartPage({
    cartItems,
    onBack,
    onCancel,
    onValidate,
  }: {
    cartItems: CartItem[];
    onBack: () => void;
    onCancel: () => void;
    onValidate: () => void;
  }) {
    const total = cartItems.reduce((sum, item) => sum +
  item.product.salePrice * item.quantity, 0);

    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>Mon Panier</Typography>

        {cartItems.length === 0 ? (
          <Typography color="text.secondary">Le panier est vide.</Typography>) : (
          <>
            {cartItems.map((item) => (
              <Box key={item.product.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>{item.product.name}x{item.quantity}</Typography>
                <Typography>{(item.product.salePrice * item.quantity).toFixed(2)} €</Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography fontWeight="bold">Total</Typography>
              <Typography fontWeight="bold">{total.toFixed(2)} €</Typography>
            </Box>
          </>
        )}

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="outlined" onClick={onBack}>Continuer les achats</Button>
          <Button variant="contained" color="success" onClick={onValidate} disabled={cartItems.length === 0}>Valider</Button>
          <Button variant="contained" color="error"  onClick={onCancel}>Annuler</Button>
        </Box>
      </Container>
    );
  }

  export default CartPage;