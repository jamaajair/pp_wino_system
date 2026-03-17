import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import AgentPage from '../pages/AgentPage';
import type { CartItem, Product } from '../types';
import type { AuthResponse } from '../services/authService';

interface AppRouterProps {
  user: AuthResponse | null;
  cartItems: CartItem[];
  view: 'shop' | 'cart';
  setView: React.Dispatch<React.SetStateAction<'shop' | 'cart'>>;
  onLogin: (user: AuthResponse) => void;
  onLogout: () => void;
  onAddToCart: (product: Product) => void;
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

function AppRouter({ user, cartItems, view, setView, onLogin, onLogout, onAddToCart, setCartItems }: AppRouterProps) {
  const totalCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const isAgent = user && user.role !== 'CUSTOMER';
  const isCustomer = user && user.role === 'CUSTOMER';

  return (
    <Routes>
      <Route
        path="/login"
        element={
          !user
            ? <LoginPage onLogin={onLogin} />
            : <Navigate to={isAgent ? '/agent' : '/shop'} />
        }
      />

      <Route
        path="/shop"
        element={
          isCustomer
            ? <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Header count={totalCount} onLogout={onLogout} setView={setView} />
                <Box component="main" sx={{ flex: 1 }}>
                  <HomePage
                    onAddToCart={onAddToCart}
                    view={view}
                    setView={setView}
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                  />
                </Box>
                <Footer />
              </Box>
            : <Navigate to="/login" />
        }
      />

      <Route
        path="/agent"
        element={
          isAgent
            ? <AgentPage user={user!} onLogout={onLogout} />
            : <Navigate to="/login" />
        }
      />

      <Route
        path="*"
        element={<Navigate to={!user ? '/login' : isAgent ? '/agent' : '/shop'} />}
      />
    </Routes>
  );
}

export default AppRouter;
