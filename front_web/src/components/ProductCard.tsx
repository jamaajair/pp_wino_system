import { Card, CardContent, CardMedia, CardActions, Typography, Button, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// Interface TypeScript pour un produit
export interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
        },
      }}
    >
      {/* Image du produit */}
      {product.image ? (
        <CardMedia
          component="img"
          height="160"
          image={product.image}
          alt={product.name}
        />
      ) : (
        <Box
          sx={{
            height: 160,
            backgroundColor: '#e8eaf6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body2" color="#9e9e9e">
            No image
          </Typography>
        </Box>
      )}

      {/* Nom et prix */}
      <CardContent sx={{ flex: 1, pb: 0 }}>
        <Typography variant="body1" fontWeight="500" gutterBottom>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight="bold">
          {product.price.toFixed(2)} €
        </Typography>
      </CardContent>

      {/* Bouton Add to Cart */}
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<ShoppingCartIcon />}
          onClick={() => onAddToCart(product)}
          sx={{
            backgroundColor: '#00838f',
            borderRadius: 1.5,
            textTransform: 'none',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#006064',
            },
          }}
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
}

export default ProductCard;