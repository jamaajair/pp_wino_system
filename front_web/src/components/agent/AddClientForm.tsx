import { useState } from 'react';
import {
  Alert, Box, Button, Chip, MenuItem, Paper,
  TextField, Typography,
} from '@mui/material';
import { User, Building2, Phone, Mail, MapPin, CreditCard, Hash } from 'lucide-react';
import { customerService } from '../../services/customerService';
import type { Customer, CustomerType } from '../../types';

interface AddClientFormProps {
  onClose: () => void;
  onCreated: (customer: Customer) => void;
}

const EMPTY: Customer = {
  code: '',
  name: '',
  customerType: 'COMPANY',
  email: '',
  phone: '',
  taxId: '',
  address: '',
  city: '',
  postalCode: '',
  country: '',
  creditLimit: undefined,
};

const FIELD_SX = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    '&:hover fieldset': { borderColor: '#1a237e' },
    '&.Mui-focused fieldset': { borderColor: '#1a237e' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#1a237e' },
};

function SectionTitle({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
      <Box sx={{ color: '#1a237e', display: 'flex' }}>{icon}</Box>
      <Typography variant="subtitle2" fontWeight={600} color="#1a237e" textTransform="uppercase" letterSpacing={0.8} fontSize="0.7rem">
        {label}
      </Typography>
      <Box sx={{ flex: 1, height: '1px', backgroundColor: '#e8eaf6', ml: 1 }} />
    </Box>
  );
}

function AddClientForm({ onClose, onCreated }: AddClientFormProps) {
  const [form, setForm] = useState<Customer>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof Customer) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleTypeToggle = (type: CustomerType) => {
    setForm(prev => ({ ...prev, customerType: type }));
  };

  const handleSubmit = async () => {
    if (!form.code.trim() || !form.name.trim()) {
      setError('Le code et le nom sont obligatoires.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      form.active = true;
      const created = await customerService.create(form);
      onCreated(created);
      setForm(EMPTY);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Erreur lors de la création.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm(EMPTY);
    setError(null);
    onClose();
  };

  return (
    <Box sx={{ height: '100%', overflow: 'auto', backgroundColor: '#f5f5f5', p: 3 }}>
      <Box sx={{ maxWidth: 720, mx: 'auto' }}>

        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={700} color="#1a237e">
            Nouveau Client
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Remplissez les informations pour créer un nouveau client.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

          {/* Identité */}
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e8eaf6' }}>
            <SectionTitle icon={<Building2 size={15} />} label="Identité" />
            <Box sx={{ display: 'flex', gap: 2, mt: 2, mb: 2 }}>
              <Chip
                label="Société"
                icon={<Building2 size={14} />}
                onClick={() => handleTypeToggle('COMPANY')}
                variant={form.customerType === 'COMPANY' ? 'filled' : 'outlined'}
                sx={{
                  fontWeight: 500,
                  cursor: 'pointer',
                  ...(form.customerType === 'COMPANY'
                    ? { backgroundColor: '#1a237e', color: 'white', '& .MuiChip-icon': { color: 'white' } }
                    : { borderColor: '#c5cae9', color: '#555' }),
                }}
              />
              <Chip
                label="Particulier"
                icon={<User size={14} />}
                onClick={() => handleTypeToggle('INDIVIDUAL')}
                variant={form.customerType === 'INDIVIDUAL' ? 'filled' : 'outlined'}
                sx={{
                  fontWeight: 500,
                  cursor: 'pointer',
                  ...(form.customerType === 'INDIVIDUAL'
                    ? { backgroundColor: '#1a237e', color: 'white', '& .MuiChip-icon': { color: 'white' } }
                    : { borderColor: '#c5cae9', color: '#555' }),
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Code *"
                value={form.code}
                onChange={handleChange('code')}
                size="small"
                sx={{ flex: 1, ...FIELD_SX }}
                InputProps={{ startAdornment: <Hash size={15} color="#9e9e9e" style={{ marginRight: 6 }} /> }}
              />
              <TextField
                label="N° TVA / Tax ID"
                value={form.taxId}
                onChange={handleChange('taxId')}
                size="small"
                sx={{ flex: 1, ...FIELD_SX }}
              />
            </Box>
            <TextField
              label="Nom complet *"
              value={form.name}
              onChange={handleChange('name')}
              size="small"
              fullWidth
              sx={FIELD_SX}
            />
          </Paper>

          {/* Contact */}
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e8eaf6' }}>
            <SectionTitle icon={<Phone size={15} />} label="Contact" />
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TextField
                label="Email"
                value={form.email}
                onChange={handleChange('email')}
                size="small"
                sx={{ flex: 1, ...FIELD_SX }}
                InputProps={{ startAdornment: <Mail size={15} color="#9e9e9e" style={{ marginRight: 6 }} /> }}
              />
              <TextField
                label="Téléphone"
                value={form.phone}
                onChange={handleChange('phone')}
                size="small"
                sx={{ flex: 1, ...FIELD_SX }}
                InputProps={{ startAdornment: <Phone size={15} color="#9e9e9e" style={{ marginRight: 6 }} /> }}
              />
            </Box>
          </Paper>

          {/* Adresse */}
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e8eaf6' }}>
            <SectionTitle icon={<MapPin size={15} />} label="Adresse" />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="Adresse"
                value={form.address}
                onChange={handleChange('address')}
                size="small"
                fullWidth
                multiline
                rows={2}
                sx={FIELD_SX}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Ville"
                  value={form.city}
                  onChange={handleChange('city')}
                  size="small"
                  sx={{ flex: 2, ...FIELD_SX }}
                />
                <TextField
                  label="Code postal"
                  value={form.postalCode}
                  onChange={handleChange('postalCode')}
                  size="small"
                  sx={{ flex: 1, ...FIELD_SX }}
                />
                <TextField
                  label="Pays"
                  value={form.country}
                  onChange={handleChange('country')}
                  size="small"
                  sx={{ flex: 1.5, ...FIELD_SX }}
                />
              </Box>
            </Box>
          </Paper>

          {/* Finance */}
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e8eaf6' }}>
            <SectionTitle icon={<CreditCard size={15} />} label="Finance" />
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Limite de crédit (€)"
                value={form.creditLimit ?? ''}
                onChange={handleChange('creditLimit')}
                size="small"
                type="number"
                sx={{ width: 240, ...FIELD_SX }}
                InputProps={{ startAdornment: <CreditCard size={15} color="#9e9e9e" style={{ marginRight: 6 }} /> }}
              />
            </Box>
          </Paper>

          {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', pb: 2 }}>
            <Button
              variant="outlined"
              onClick={handleClose}
              disabled={loading}
              sx={{ textTransform: 'none', borderColor: '#c5cae9', color: '#1a237e', borderRadius: 2, px: 3 }}
            >
              Annuler
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                textTransform: 'none',
                backgroundColor: '#1a237e',
                borderRadius: 2,
                px: 3,
                '&:hover': { backgroundColor: '#0d1757' },
              }}
            >
              {loading ? 'Enregistrement…' : 'Enregistrer le client'}
            </Button>
          </Box>

        </Box>
      </Box>
    </Box>
  );
}

export default AddClientForm;
