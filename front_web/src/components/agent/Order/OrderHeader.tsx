import { Alert, Autocomplete, Box, Button, Chip, CircularProgress, InputAdornment, Paper, Snackbar, TextField, Typography } from '@mui/material'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { useState } from 'react';
import type { Customer, Product } from '../../../types';
import { productService } from '../../../services/productService';
import { customerService } from '../../../services/customerService';

interface OrderHeaderProps {
  addProduct: (value: Product) => void;
  customer: Customer | null;
  setCustomer: (value: Customer | null) => void;
  errorVal?: string | null;
  setErrorVal: (value: string | null) => void;
  onValidateOrder: () => void;
  onCancelOrder: () => void;
}


function OrderHeader({ addProduct, customer, setCustomer, errorVal, setErrorVal, onValidateOrder, onCancelOrder }: OrderHeaderProps) {
  const [optionsCustomer, setOptionsCustomer] = useState<Customer[]>([]);
  const [optionsProduct, setOptionsProduct] = useState<Product[]>([]);
  const [productInputKey, setProductInputKey] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleInputChangeProduct = async (_: unknown, value: string) => {
      if (!value) { setOptionsProduct([]); return; }
      setLoading(true);
      try {
        const results = await productService.searchProducts(value);
        setOptionsProduct(results);
      } finally {
        setLoading(false);
      }
  };
  const handleInputChangeCustomer = async (_: unknown, value: string) => {
      if (!value) { setOptionsCustomer([]); return; }
      setLoading(true);
      try {
        const results = await customerService.search(value);
        setOptionsCustomer(results);
      } finally {
        setLoading(false);
      }
    };
  
  const handleValider = () => {
    onValidateOrder();
  }

  const handleCancel = () => {
    onCancelOrder();
  }

  return (
    <Box sx={{ position: 'relative'  }}>
      <Box sx={{
        height: 78,
        borderRadius: 3,
        px: 3,        
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: 'white',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)',
        boxShadow: '0 4px 20px rgba(59, 130, 246, 0.15)',
      }}>
        {/* Display flex pour */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <DescriptionOutlinedIcon />
            <Typography sx={{ fontWeight: 800, letterSpacing: 0.8 }}>
                CREATION COMMANDE
            </Typography>
        </Box>

        <Chip
          label="Brouillon"
          size="small"
          sx={{
            height: 26,
            fontWeight: 700,
            color: 'white',
            border: '1px solid rgba(255,255,255,0.55)',
            backgroundColor: 'rgba(25, 0, 255, 0.97)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.10)',
          }}
        />
      </Box>
      {/*    */} 
      <Paper 
        elevation={0}
        sx={{
                mt: -2.6,
                mx: 1.5,
                p: 2,
                borderRadius: 4, 
                backgroundColor: 'white',
                boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
            }} 
        >
        <Box 
        sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '320px 1fr' }, 
            gap: 1.5, 
            mb: 1.25 
            }}>
            <TextField
                size="small"
                value={'ORD-001'}
                label="Numero"
                InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <EditOutlinedIcon fontSize="small" />
                    </InputAdornment>
                ),
                readOnly: true,
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
            />
            <Autocomplete
            key={productInputKey}
            options={optionsProduct}
            loading={loading}
            onInputChange={handleInputChangeProduct}
            onChange={(_, value) => {
              if (value) { addProduct(value); setProductInputKey(k => k + 1); }
            }}
            getOptionLabel={(option) => `${option.name}`}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            filterOptions={(x) => x}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                label="Article"
                placeholder="Rechercher un Article..."
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <InputAdornment position="start">
                        <PersonOutlineRoundedIcon fontSize="small" />
                      </InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                  ),
                  endAdornment: (
                    <>
                      {loading && <CircularProgress size={16} />}
                                {params.InputProps.endAdornment}
                    </>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }} 
              />
            )}
            /> 
        </Box>

      <Box 
        sx={{
          display: 'grid',
          gap: 1.5, 
          gridTemplateColumns: { xs: '1fr', md: '240px 1fr' },
          alignItems: 'center',
          }}
        >
          <TextField
            size="small"
            label="Date"
            value="31/03/2026"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarMonthOutlinedIcon fontSize="small" />
                </InputAdornment>
              ),
              readOnly: true,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2.5,
                backgroundColor: '#f5f7fb',
              },
            }}
          />
        <Autocomplete
            key={productInputKey}
            value={customer}
            options={optionsCustomer}
            loading={loading}
            onInputChange={handleInputChangeCustomer}
            onChange={(_, value) => setCustomer(value)}
            getOptionLabel={(option) => `${option.name} (${option.code})`}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            filterOptions={(x) => x}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                label="Client"
                placeholder="Rechercher un client..."
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <InputAdornment position="start">
                        <PersonOutlineRoundedIcon fontSize="small" />
                      </InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                  ),
                  endAdornment: (
                    <>
                      {loading && <CircularProgress size={16} />}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5, backgroundColor: '#f5f7fb' } }}
              />
            )}
          />
      </Box>

      {errorVal && (
                <Snackbar
                  open={errorVal !== null}
                  autoHideDuration={3500}
                  onClose={() => setErrorVal(null)}
                  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                  <Alert severity="error" onClose={() => setErrorVal(null)}>
                    {errorVal}
                  </Alert>
                </Snackbar>
         )}

      <Box 
        sx={{
          mt: 1.5,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 1.2,
          px: 2
          }}
        >
        <Button
          variant="contained"
          disableElevation
          onClick={handleValider}
          sx={{
            textTransform: 'none',
            fontWeight: 800,
            borderRadius: 2.5,
            px: 2.5,
            backgroundColor: '#000fdb',
            '&:hover': { backgroundColor: '#000fdb' },
            boxShadow: '0 4px 20px rgba(0, 15, 219, 0.15)',
          }}
        >
          VALIDER
        </Button>
        <Button
          variant="outlined"
          disableElevation
          onClick={handleCancel}
          sx={{
              textTransform: 'none',
              fontWeight: 800,
              borderRadius: 2.5,
              px: 2.5,
              borderColor: '#1857d4',
              color: '#6b7280',
              backgroundColor: 'white',
              '&:hover': { borderColor: '#0f58eb', backgroundColor: '#f8fafc' },
            }}
        >
          ABANDONNER
        </Button>
      </Box>
      </Paper>

    </Box>
  );
}

export default OrderHeader;