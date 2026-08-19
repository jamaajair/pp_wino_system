import { useEffect, useState } from 'react';
import { Box, MenuItem, TextField, InputAdornment } from '@mui/material';
import { Tag, Layers, FileText, Coins, Percent, Ruler, Boxes, Hash } from 'lucide-react';
import { getCategories } from '../../../services/categoryService';
import type { Category } from '../../../types';
import { FIELD_SX, SectionTitle, type ArticlePanelProps } from './articleShared';

function General({ form, setForm }: ArticlePanelProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

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
        <SectionTitle icon={<Tag size={15} />} label="Identification" />
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Code article"
            value={form.code}
            onChange={handleText('code')}
            required
            placeholder="PRD044"
            helperText="Unique, obligatoire"
            sx={{ ...FIELD_SX, flex: 1, minWidth: 180 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><Hash size={16} /></InputAdornment> }}
          />
          <TextField
            label="Nom de l'article"
            value={form.name}
            onChange={handleText('name')}
            required
            sx={{ ...FIELD_SX, flex: 2, minWidth: 240 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><Tag size={16} /></InputAdornment> }}
          />
          <TextField
            select
            label="Catégorie"
            value={form.categoryId}
            onChange={handleNumber('categoryId')}
            sx={{ ...FIELD_SX, flex: 1, minWidth: 200 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><Layers size={16} /></InputAdornment> }}
          >
            {categories.length === 0 && (
              <MenuItem value="" disabled>Aucune catégorie</MenuItem>
            )}
            {categories.map(c => (
              <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>

      <Box>
        <SectionTitle icon={<FileText size={15} />} label="Description" />
        <TextField
          label="Description"
          value={form.description}
          onChange={handleText('description')}
          multiline
          minRows={3}
          fullWidth
          sx={FIELD_SX}
        />
      </Box>

      <Box>
        <SectionTitle icon={<Coins size={15} />} label="Tarification" />
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Prix d'achat"
            type="number"
            value={form.purchasePrice}
            onChange={handleNumber('purchasePrice')}
            sx={{ ...FIELD_SX, flex: 1, minWidth: 160 }}
            InputProps={{ endAdornment: <InputAdornment position="end">€</InputAdornment> }}
          />
          <TextField
            label="Prix de vente"
            type="number"
            value={form.salePrice}
            onChange={handleNumber('salePrice')}
            sx={{ ...FIELD_SX, flex: 1, minWidth: 160 }}
            InputProps={{ endAdornment: <InputAdornment position="end">€</InputAdornment> }}
          />
          <TextField
            label="TVA"
            type="number"
            value={form.tva}
            onChange={handleNumber('tva')}
            sx={{ ...FIELD_SX, flex: 1, minWidth: 120 }}
            InputProps={{ endAdornment: <InputAdornment position="end"><Percent size={14} /></InputAdornment> }}
          />
        </Box>
      </Box>

      <Box>
        <SectionTitle icon={<Boxes size={15} />} label="Stock & unité" />
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Unité"
            value={form.unit}
            onChange={handleText('unit')}
            placeholder="pièce, kg, L…"
            sx={{ ...FIELD_SX, flex: 1, minWidth: 160 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><Ruler size={16} /></InputAdornment> }}
          />
          <TextField
            label="Quantité en stock"
            type="number"
            value={form.stockQuantity}
            onChange={handleNumber('stockQuantity')}
            sx={{ ...FIELD_SX, flex: 1, minWidth: 160 }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default General;
