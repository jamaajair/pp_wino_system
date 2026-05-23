import { useState, useRef } from 'react';
import {
  Alert, Box, Button, Chip, CircularProgress,
  Divider, InputAdornment, Paper, TextField, Typography,
} from '@mui/material';
import { Search, User, Building2, Phone, Mail, MapPin, Hash, X } from 'lucide-react';
import { customerService } from '../../../services/customerService';
import type { Customer } from '../../../types';

interface SearchClientFormProps {
  onClose: () => void;
  onSelected?: (customer: Customer) => void;
}

function CustomerCard({
  customer,
  selected,
  onClick,
}: {
  customer: Customer;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        p: 2,
        borderRadius: 2,
        border: selected ? '2px solid #1a237e' : '1px solid #e8eaf6',
        cursor: 'pointer',
        backgroundColor: selected ? '#f0f2ff' : 'white',
        transition: 'all 0.15s ease',
        '&:hover': { borderColor: '#1a237e', backgroundColor: '#f0f2ff' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 36, height: 36, borderRadius: '50%',
            backgroundColor: selected ? '#1a237e' : '#e8eaf6',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}
        >
          {customer.customerType === 'COMPANY'
            ? <Building2 size={16} color={selected ? 'white' : '#1a237e'} />
            : <User size={16} color={selected ? 'white' : '#1a237e'} />}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography fontWeight={600} fontSize="0.875rem" color="#1a237e" noWrap>
            {customer.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 0.25 }}>
            <Typography fontSize="0.75rem" color="#757575" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Hash size={11} /> {customer.code}
            </Typography>
            {customer.email && (
              <Typography fontSize="0.75rem" color="#757575" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }} noWrap>
                <Mail size={11} /> {customer.email}
              </Typography>
            )}
            {customer.phone && (
              <Typography fontSize="0.75rem" color="#757575" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Phone size={11} /> {customer.phone}
              </Typography>
            )}
          </Box>
        </Box>
        <Chip
          label={customer.customerType === 'COMPANY' ? 'Société' : 'Particulier'}
          size="small"
          sx={{
            fontSize: '0.68rem', height: 20, flexShrink: 0,
            backgroundColor: customer.customerType === 'COMPANY' ? '#e8eaf6' : '#fce4ec',
            color: customer.customerType === 'COMPANY' ? '#1a237e' : '#880e4f',
          }}
        />
      </Box>
    </Paper>
  );
}

function CustomerDetail({ customer }: { customer: Customer }) {
  const row = (icon: React.ReactNode, label: string, value?: string | number) =>
    value ? (
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', py: 0.75 }}>
        <Box sx={{ color: '#9e9e9e', mt: 0.1, flexShrink: 0 }}>{icon}</Box>
        <Box>
          <Typography fontSize="0.7rem" color="#9e9e9e" textTransform="uppercase" letterSpacing={0.6}>{label}</Typography>
          <Typography fontSize="0.875rem" color="#212121">{value}</Typography>
        </Box>
      </Box>
    ) : null;

  return (
    <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e8eaf6', height: '100%' }}>
      {/* En-tête */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <Box sx={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: '#1a237e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {customer.customerType === 'COMPANY'
            ? <Building2 size={20} color="white" />
            : <User size={20} color="white" />}
        </Box>
        <Box>
          <Typography fontWeight={700} fontSize="1rem" color="#1a237e">{customer.name}</Typography>
          <Chip
            label={customer.customerType === 'COMPANY' ? 'Société' : 'Particulier'}
            size="small"
            sx={{ fontSize: '0.68rem', height: 18, backgroundColor: '#e8eaf6', color: '#1a237e' }}
          />
        </Box>
      </Box>

      <Divider sx={{ mb: 1.5 }} />

      {row(<Hash size={14} />, 'Code client', customer.code)}
      {row(<Mail size={14} />, 'Email', customer.email)}
      {row(<Phone size={14} />, 'Téléphone', customer.phone)}
      {row(<Hash size={14} />, 'N° TVA', customer.taxId)}
      {row(
        <MapPin size={14} />,
        'Adresse',
        [customer.address, customer.city, customer.postalCode, customer.country].filter(Boolean).join(', '),
      )}
      {customer.creditLimit !== undefined &&
        row(<Hash size={14} />, 'Limite de crédit', `${customer.creditLimit} €`)}
      {customer.balance !== undefined &&
        row(<Hash size={14} />, 'Solde', `${customer.balance} €`)}
    </Paper>
  );
}

function SearchClientForm({ onClose, onSelected }: SearchClientFormProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Customer[]>([]);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async () => {
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    setSelected(null);
    try {
      const data = await customerService.search(q);
      setResults(data);
      setSearched(true);
    } catch {
      setError('Erreur lors de la recherche. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setSelected(null);
    setSearched(false);
    setError(null);
    inputRef.current?.focus();
  };

  const handleSelect = (customer: Customer) => {
    setSelected(prev => prev?.code === customer.code ? null : customer);
  };

  const handleConfirm = () => {
    if (selected) onSelected?.(selected);
    onClose();
  };

  return (
    <Box sx={{ height: '100%', overflow: 'auto', backgroundColor: '#f5f5f5', p: 3 }}>
      <Box sx={{ maxWidth: 960, mx: 'auto' }}>

        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={700} color="#1a237e">
            Recherche Rapide Client
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Recherchez par nom, code, email ou téléphone.
          </Typography>
        </Box>

        {/* Search bar */}
        <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid #e8eaf6', mb: 2.5 }}>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <TextField
              inputRef={inputRef}
              placeholder="Nom, code, email, téléphone…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              size="small"
              fullWidth
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={17} color="#9e9e9e" />
                  </InputAdornment>
                ),
                endAdornment: query ? (
                  <InputAdornment position="end">
                    <Box
                      component="span"
                      onClick={handleClear}
                      sx={{ cursor: 'pointer', display: 'flex', color: '#bdbdbd', '&:hover': { color: '#757575' } }}
                    >
                      <X size={15} />
                    </Box>
                  </InputAdornment>
                ) : undefined,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': { borderColor: '#1a237e' },
                  '&.Mui-focused fieldset': { borderColor: '#1a237e' },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              startIcon={loading ? <CircularProgress size={14} color="inherit" /> : <Search size={15} />}
              sx={{
                backgroundColor: '#1a237e',
                textTransform: 'none',
                fontWeight: 500,
                borderRadius: 2,
                px: 2.5,
                whiteSpace: 'nowrap',
                '&:hover': { backgroundColor: '#0d1757' },
              }}
            >
              {loading ? 'Recherche…' : 'Rechercher'}
            </Button>
          </Box>
        </Paper>

        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

        {/* Results + detail */}
        {searched && (
          results.length === 0 ? (
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e8eaf6', textAlign: 'center' }}>
              <Search size={36} color="#bdbdbd" />
              <Typography color="#9e9e9e" mt={1.5}>Aucun client trouvé pour « {query} »</Typography>
            </Paper>
          ) : (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>

              {/* Liste */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography fontSize="0.75rem" color="#9e9e9e" fontWeight={600} textTransform="uppercase" letterSpacing={0.8} mb={0.5}>
                  {results.length} résultat{results.length > 1 ? 's' : ''}
                </Typography>
                {results.map(c => (
                  <CustomerCard
                    key={c.code}
                    customer={c}
                    selected={selected?.code === c.code}
                    onClick={() => handleSelect(c)}
                  />
                ))}
              </Box>

              {/* Fiche détail */}
              {selected && (
                <Box sx={{ width: 300, flexShrink: 0 }}>
                  <Typography fontSize="0.75rem" color="#9e9e9e" fontWeight={600} textTransform="uppercase" letterSpacing={0.8} mb={0.5}>
                    Détail client
                  </Typography>
                  <CustomerDetail customer={selected} />
                  {onSelected && (
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleConfirm}
                      sx={{
                        mt: 1.5,
                        backgroundColor: '#1a237e',
                        textTransform: 'none',
                        fontWeight: 500,
                        borderRadius: 2,
                        '&:hover': { backgroundColor: '#0d1757' },
                      }}
                    >
                      Sélectionner ce client
                    </Button>
                  )}
                </Box>
              )}
            </Box>
          )
        )}

        {/* Fermer */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ textTransform: 'none', borderColor: '#c5cae9', color: '#1a237e', borderRadius: 2, px: 3 }}
          >
            Fermer
          </Button>
        </Box>

      </Box>
    </Box>
  );
}

export default SearchClientForm;
