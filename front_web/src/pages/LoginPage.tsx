import { useState } from 'react';
import {
  Alert, Box, Button, CircularProgress, IconButton,
  InputAdornment, TextField, Typography,
} from '@mui/material';
import { ArrowRight, Eye, EyeOff, FileText, Lock, User, Wallet, Warehouse } from 'lucide-react';
import axios from 'axios';
import { login } from '../services/authService';
import type { AuthResponse } from '../services/authService';

const NAVY = '#1a237e';
const NAVY_DARK = '#0d1757';

// Ce que le produit fait, affiché sur le panneau de marque : l'écran de connexion
// est souvent le premier contact d'un nouvel utilisateur avec le système.
const HIGHLIGHTS = [
  { icon: <FileText size={17} />, label: 'Devis, commandes, factures', hint: 'Chaîne documentaire complète' },
  { icon: <Warehouse size={17} />, label: 'Stock et inventaire', hint: 'Mouvements tracés à la pièce' },
  { icon: <Wallet size={17} />, label: 'Comptes et paiements', hint: 'Trésorerie en temps réel' },
];

function loginErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // Pas de réponse du tout : backend éteint ou injoignable. À distinguer d'un
    // refus d'authentification, sinon l'utilisateur cherche son mot de passe en vain.
    if (!error.response) return 'Serveur injoignable. Vérifiez que le backend est démarré.';
    const detail = error.response.data?.error ?? error.response.data?.message;
    if (typeof detail === 'string' && detail.length > 0) return detail;
    if (error.response.status === 401) return 'Nom d’utilisateur ou mot de passe incorrect.';
  }
  return 'La connexion a échoué.';
}

function LoginPage({ onLogin }: { onLogin: (user: AuthResponse) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      onLogin(await login(username, password));
    } catch (err) {
      setError(loginErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2.5,
      backgroundColor: '#f8f9fc',
      '& fieldset': { borderColor: '#e3e6f0' },
      '&:hover fieldset': { borderColor: '#c5cae9' },
      '&.Mui-focused fieldset': { borderColor: NAVY, borderWidth: '1.5px' },
      '&.Mui-focused': { backgroundColor: 'white' },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: NAVY },
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'white' }}>

      {/* ---------------- Panneau de marque (masqué sous md) ---------------- */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '46%',
          p: 6,
          position: 'relative',
          overflow: 'hidden',
          color: 'white',
          background: `linear-gradient(150deg, ${NAVY} 0%, #283593 45%, ${NAVY_DARK} 100%)`,
        }}
      >
        {/* Cercles décoratifs : donnent de la profondeur sans image à charger. */}
        <Box sx={{
          position: 'absolute', width: 420, height: 420, borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.07)', top: -140, right: -130,
        }} />
        <Box sx={{
          position: 'absolute', width: 300, height: 300, borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.04)', bottom: -110, left: -90,
        }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative' }}>
          <Box sx={{
            width: 40, height: 40, borderRadius: '50%', backgroundColor: 'white',
            color: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '1.15rem',
          }}>
            W
          </Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: 1.5 }}>
            WINO
          </Typography>
        </Box>

        <Box sx={{ position: 'relative' }}>
          <Typography sx={{ fontWeight: 800, fontSize: '2.4rem', lineHeight: 1.15, mb: 2 }}>
            Toute votre activité<br />commerciale au même endroit.
          </Typography>
          <Typography sx={{ fontSize: '1rem', opacity: 0.72, maxWidth: 380, lineHeight: 1.6 }}>
            Un document émis met à jour le stock et alimente les comptes. Plus de
            ressaisie, plus d'écart en fin de mois.
          </Typography>

          <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {HIGHLIGHTS.map(item => (
              <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  width: 38, height: 38, borderRadius: 2, flexShrink: 0,
                  backgroundColor: 'rgba(255,255,255,0.11)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {item.icon}
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.label}</Typography>
                  <Typography sx={{ fontSize: '0.78rem', opacity: 0.6 }}>{item.hint}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Typography sx={{ fontSize: '0.75rem', opacity: 0.45, position: 'relative' }}>
          © {new Date().getFullYear()} WINO — Gestion commerciale
        </Typography>
      </Box>

      {/* ---------------- Formulaire ---------------- */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 3, sm: 6 },
          py: 6,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 380 }}>

          {/* Logo compact : remplace le panneau de marque sur petit écran. */}
          <Box sx={{
            display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5, mb: 4,
          }}>
            <Box sx={{
              width: 38, height: 38, borderRadius: '50%', backgroundColor: NAVY,
              color: 'white', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontWeight: 800,
            }}>
              W
            </Box>
            <Typography sx={{ fontWeight: 800, letterSpacing: 1.5, color: NAVY }}>WINO</Typography>
          </Box>

          <Typography sx={{ fontWeight: 800, fontSize: '1.65rem', color: '#1f2937', mb: 0.5 }}>
            Connexion
          </Typography>
          <Typography sx={{ color: '#6b7280', fontSize: '0.9rem', mb: 4 }}>
            Accédez à votre espace de travail.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#374151', mb: 0.75 }}>
              Nom d'utilisateur
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
              autoFocus
              autoComplete="username"
              sx={{ ...fieldSx, mb: 2.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <User size={17} color="#9ca3af" />
                  </InputAdornment>
                ),
              }}
            />

            <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#374151', mb: 0.75 }}>
              Mot de passe
            </Typography>
            <TextField
              fullWidth
              size="small"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              sx={{ ...fieldSx, mb: 2.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={17} color="#9ca3af" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowPassword(v => !v)}
                      edge="end"
                      aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                      tabIndex={-1}
                    >
                      {showPassword
                        ? <EyeOff size={16} color="#9ca3af" />
                        : <Eye size={16} color="#9ca3af" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {error && (
              <Alert severity="error" sx={{ borderRadius: 2, mb: 2.5, fontSize: '0.85rem' }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disableElevation
              disabled={loading}
              endIcon={loading
                ? <CircularProgress size={15} color="inherit" />
                : <ArrowRight size={17} />}
              sx={{
                py: 1.3,
                borderRadius: 2.5,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.95rem',
                backgroundColor: NAVY,
                boxShadow: '0 8px 20px rgba(26,35,126,0.24)',
                '&:hover': { backgroundColor: NAVY_DARK },
                '&.Mui-disabled': { backgroundColor: '#9fa8da', color: 'white' },
              }}
            >
              {loading ? 'Connexion…' : 'Se connecter'}
            </Button>
          </Box>

          <Typography sx={{ mt: 4, fontSize: '0.78rem', color: '#9ca3af', textAlign: 'center' }}>
            Problème d'accès ? Contactez votre administrateur.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default LoginPage;
