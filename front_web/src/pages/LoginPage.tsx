import { useState } from 'react';
import { Box, Button, Container, TextField, Typography, Alert } from '@mui/material';
import { login } from '../services/authService';
import type { AuthResponse } from '../services/authService';

function LoginPage({ onLogin }: { onLogin: (user: AuthResponse) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(username, password);
      onLogin(user);
    } catch {
      setError('Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          mt: 12,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'white',
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          p: 4,
        }}
      >
        <Box
          sx={{
            width: 52,
            height: 52,
            backgroundColor: '#1a237e',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            color: 'white',
            fontSize: '1.4rem',
            mb: 2,
          }}
        >
          W
        </Box>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Wino Webshop
        </Typography>

        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            label="Nom d'utilisateur"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Mot de passe"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 3,
              backgroundColor: '#1a237e',
              '&:hover': { backgroundColor: '#0d1757' },
              textTransform: 'none',
              fontWeight: 'bold',
              py: 1.2,
            }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;
