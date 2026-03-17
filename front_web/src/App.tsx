import { useCallback, useState } from 'react';
import type { CartItem, Product } from './types';
import type { AuthResponse } from './services/authService';
import AppRouter from './router/AppRouter';

function App() {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [view, setView] = useState<'shop' | 'cart'>('shop');

  const handleAddToCart = useCallback((product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const handleLogout = () => {
    setUser(null);
    setCartItems([]);
  };

  return (
    <AppRouter
      user={user}
      cartItems={cartItems}
      view={view}
      setView={setView}
      onLogin={(u) => setUser(u)}
      onLogout={handleLogout}
      onAddToCart={handleAddToCart}
      setCartItems={setCartItems}
    />
  );
}

export default App;
