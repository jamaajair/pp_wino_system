// front_web/src/pages/HomePage.tsx

//---------------------------------------------------
// Ceci est une page pour le client pas pour l'agent
//---------------------------------------------------

import { useEffect, useState } from 'react';
import { Alert, Box, CircularProgress, Container, Snackbar, Typography } from '@mui/material';
import Sidebar from '../components/Sidebar';
import ProductGrid from '../components/ProductGrid';
import type { CartItem, Category, Product, SaleDocumentRequest } from '../types';
import { getCategories } from '../services/categoryService';
import { productService } from '../services/productService';
import { getStoredUser } from '../services/authService';
import CartPage from '../components/CartPage';

interface HomePageProps {
  onAddToCart: (product: Product) => void;
  view: 'shop' | 'cart';
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  setView: React.Dispatch<React.SetStateAction<'shop' | 'cart'>>;
}

function HomePage({ onAddToCart, view, cartItems, setCartItems, setView }: HomePageProps) {
  const [categories, setCategories]         = useState<Category[]>([]);
  const [products, setProducts]             = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading]               = useState<boolean>(true);
  const [error, setError]                   = useState<string | null>(null);
  const [feedback, setFeedback]             = useState<{ severity: 'success' | 'error'; text: string } | null>(null);

  const handleValidateOrder = async () => {
    const user = getStoredUser();
    if (!user?.customerId) {
      setFeedback({ severity: 'error', text: "Votre compte n'est pas relié à une fiche client. Contactez un agent." });
      return;
    }
    if (cartItems.length === 0) return;
    try {
      const request: SaleDocumentRequest = {
        type: 'ORDER',
        status: 'SENT',
        customerId: user.customerId,
        lines: cartItems.map(i => ({ productId: i.product.id, quantity: i.quantity })),
      };
      await productService.createSaleDocument(request);
      setFeedback({ severity: 'success', text: 'Commande envoyée ! Un agent va la traiter.' });
      setCartItems([]);
      setView('shop');
    } catch (e) {
      console.error('Erreur envoi commande', e);
      setFeedback({ severity: 'error', text: "Erreur lors de l'envoi de la commande." });
    }
  };

  useEffect(() => {
    getCategories()
    .then((data) => {
      setCategories(data);
      setSelectedCategory(data[0]?.id ?? null); 
      setLoading(false);
    })
    .catch(() => {
      setError('Failed to load categories');
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selectedCategory === null) return;
    productService.getProductsByCategory(selectedCategory!)
    .then((data) => {
      setProducts(data);
      setLoading(false);
    })
    .catch(() => {
      setError('Failed to load products');
      setLoading(false);
    });
  },[selectedCategory]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }
  {
    console.log('Products loaded for category ID:', selectedCategory, products);
  }
  // Produits filtrés selon la catégorie sélectionnée
  const currentCategoryName = categories.find(c => c.id === selectedCategory)?.name ?? '';

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          alignItems: 'flex-start',
        }}
      >
        {/* Sidebar gauche */}
        <Sidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          setView={setView}
        />
        {/* Zone produits droite */}
        { view === 'cart' && (
          <CartPage
            cartItems={cartItems}
            onBack={() => setView('shop')}
            onCancel={() => { setCartItems([]); setView('shop'); }}
            onValidate={handleValidateOrder}
            />
          )
        }
        { view === 'shop' && (
          <ProductGrid
          products={products}
          categoryName={currentCategoryName}
          onAddToCart={onAddToCart}
          />
      )
        }

      </Box>

      <Snackbar
        open={feedback !== null}
        autoHideDuration={4000}
        onClose={() => setFeedback(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {feedback ? (
          <Alert severity={feedback.severity} onClose={() => setFeedback(null)}>
            {feedback.text}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Container>
  );
}

export default HomePage;