// front_web/src/components/ProductGrid.tsx

import { Grid, Typography, Box } from '@mui/material';
import ProductCard from './ProductCard';
import type { Product } from '../types';


interface ProductGridProps {
  products: Product[];
  categoryName: string;
}

function ProductGrid({ products, categoryName }: ProductGridProps) {
  {console.log('--- Rendering product in grid:', products);}
  return (
    <Box sx={{ flex: 1 }}>

      {/* Titre de la catégorie sélectionnée */}
      <Typography
        variant="subtitle2"
        fontWeight="bold"
        sx={{
          mb: 2,
          color: '#555',
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}
      >
        Product Listing — {categoryName}
      </Typography>

      {/* Cas : aucun produit */}
      {products.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 200,
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          <Typography variant="body1" color="text.secondary">
            No products found in this category.
          </Typography>
        </Box>
      ) : (
        /* Grille de produits */
        <Grid container spacing={2}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <ProductCard
                product={product}
              />
            </Grid>
          ))}
        </Grid>
      )}

    </Box>
  );
}

export default ProductGrid;