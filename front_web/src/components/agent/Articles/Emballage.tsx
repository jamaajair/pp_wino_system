import { Box, TextField, InputAdornment, Typography } from '@mui/material';
import { Package, Boxes, Ruler } from 'lucide-react';
import { FIELD_SX, SectionTitle, type ArticlePanelProps } from './articleShared';

function Emballage({ form, setForm }: ArticlePanelProps) {
  const handleText = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleNumber = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setForm(prev => ({ ...prev, [field]: v === '' ? '' : Number(v) }));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
      <Box>
        <SectionTitle icon={<Package size={15} />} label="Conditionnement" />
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Quantité par colis"
            type="number"
            value={form.qteColis}
            onChange={handleNumber('qteColis')}
            sx={{ ...FIELD_SX, flex: 1, minWidth: 180 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><Boxes size={16} /></InputAdornment> }}
          />
          <TextField
            label="Unité"
            value={form.unit}
            onChange={handleText('unit')}
            placeholder="pièce, kg, L…"
            sx={{ ...FIELD_SX, flex: 1, minWidth: 180 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><Ruler size={16} /></InputAdornment> }}
          />
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Nombre d'unités contenues dans un colis complet.
        </Typography>
      </Box>
    </Box>
  );
}

export default Emballage;
