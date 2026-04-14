// front_web/src/pages/HomePage.tsx

import { useEffect, useState } from 'react';
import { Box, CircularProgress, Container, Typography } from '@mui/material';
import Sidebar from '../components/Sidebar';
import ProductGrid from '../components/ProductGrid';
import type { Product } from '../components/ProductCard';
import type { CartItem, Category } from '../types';
import { getCategories } from '../services/categoryService';
import { productService } from '../services/productService';
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
            onValidate={() => { alert('Commande validée !');
            setCartItems([]); setView('shop'); }}
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
    </Container>
  );
}

export default HomePage;