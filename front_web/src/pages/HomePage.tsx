// front_web/src/pages/HomePage.tsx

import { useState } from 'react';
import { Box, Container } from '@mui/material';
import Sidebar from '../components/Sidebar';
import ProductGrid from '../components/ProductGrid';
import type { Product } from '../components/ProductCard';

// Données mockées par catégorie
const mockProducts: Record<number, Product[]> = {
  1: [
    { id: 1,  name: 'Mineral Water 500ml', price: 1.50  },
    { id: 2,  name: 'Ground Coffee',       price: 12.99 },
    { id: 3,  name: 'Organic Tea',         price: 8.50  },
    { id: 4,  name: 'Energy Drink Can',    price: 2.75  },
    { id: 5,  name: 'Mineral Water 500ml', price: 1.50  },
    { id: 6,  name: 'Organic Green Tea',   price: 8.50  },
    { id: 7,  name: 'Organic Drink Tea',   price: 8.50  },
    { id: 8,  name: 'Energy Drink Can',    price: 2.75  },
  ],
  2: [
    { id: 9,  name: 'Whole Milk 1L',       price: 1.20  },
    { id: 10, name: 'Brown Bread',         price: 2.50  },
    { id: 11, name: 'Free Range Eggs x12', price: 3.99  },
    { id: 12, name: 'Cheddar Cheese',      price: 4.50  },
  ],
  3: [
    { id: 13, name: 'Scented Candle',      price: 9.99  },
    { id: 14, name: 'Cushion Cover',       price: 7.50  },
    { id: 15, name: 'Wall Clock',          price: 19.99 },
  ],
  4: [
    { id: 16, name: 'Ballpoint Pens x10', price: 3.50  },
    { id: 17, name: 'A4 Notebook',        price: 5.99  },
    { id: 18, name: 'Sticky Notes Pack',  price: 2.99  },
    { id: 19, name: 'Stapler',            price: 8.50  },
  ],
  5: [
    { id: 20, name: 'Office Chair',       price: 129.99 },
    { id: 21, name: 'Bookshelf',          price: 89.99  },
    { id: 22, name: 'Coffee Table',       price: 149.99 },
  ],
};

const categoryNames: Record<number, string> = {
  1: 'Beverages',
  2: 'Groceries',
  3: 'Home',
  4: 'Office Supplies',
  5: 'Furniture',
};

function HomePage() {
  // State : catégorie sélectionnée (Beverages par défaut)
  const [selectedCategory, setSelectedCategory] = useState<number>(1);

  // Handler : ajout au panier (console.log pour l'instant)
  const handleAddToCart = (product: Product) => {
    console.log('Added to cart:', product);
  };

  // Produits filtrés selon la catégorie sélectionnée
  const currentProducts = mockProducts[selectedCategory] ?? [];
  const currentCategoryName = categoryNames[selectedCategory] ?? '';

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
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          
        />
        
        {/* Zone produits droite */}
        <ProductGrid
          products={currentProducts}
          categoryName={currentCategoryName}
          onAddToCart={handleAddToCart}
        />
      </Box>
    </Container>
  );
}

export default HomePage;