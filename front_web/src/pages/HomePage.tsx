// front_web/src/pages/HomePage.tsx

import { useEffect, useState } from 'react';
import { Box, CircularProgress, Container, Typography } from '@mui/material';
import Sidebar from '../components/Sidebar';
import ProductGrid from '../components/ProductGrid';
import type { Product } from '../components/ProductCard';
import type { Category } from '../types';
import { getCategories } from '../services/categoryService';
import { getProductsByCategory } from '../services/productService';

function HomePage() {
  // State : catégorie sélectionnée (Beverages par défaut)
  const [categories, setCategories]         = useState<Category[]>([]);
  const [products, setProducts]             = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading]               = useState<boolean>(true);
  const [error, setError]                   = useState<string | null>(null);

  // Handler : ajout au panier (console.log pour l'instant)
  const handleAddToCart = (product: Product) => {
    console.log('Added to cart:', product);
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
    getProductsByCategory(selectedCategory!)
    .then((data) => {
      // if (data.length === 0) {
      //   console.log('No products found for category ID:', selectedCategory);
      // }else {
      //   console.log('Products loaded for category ID:', selectedCategory, data);
      // }
      console.log('Products loaded for category ID:', data[0]);
      setProducts(data);
      setLoading(false);
    })
    .catch(() => {
      setError('Failed to load products');
      setLoading(false);
    });
  },[]);

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
        />
        {/* Zone produits droite */}
        <ProductGrid
          products={products}
          categoryName={currentCategoryName}
        />
      </Box>
    </Container>
  );
}

export default HomePage;