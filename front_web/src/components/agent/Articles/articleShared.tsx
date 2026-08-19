import { Box, Typography } from '@mui/material';

// Modèle du formulaire article (dérivé de Product). Les champs numériques
// acceptent '' pour permettre un champ vide avant saisie.
export interface ArticleForm {
  // Obligatoire et unique côté base (products.code NOT NULL UNIQUE) :
  // sans lui l'insertion est rejetée par ProductService.createProduct.
  code: string;
  name: string;
  categoryId: number | '';
  description: string;
  purchasePrice: number | '';
  salePrice: number | '';
  tva: number | '';
  unit: string;
  stockQuantity: number | '';
  qteColis: number | '';
  image: string;
}

export const EMPTY_ARTICLE: ArticleForm = {
  code: '',
  name: '',
  categoryId: '',
  description: '',
  purchasePrice: '',
  salePrice: '',
  tva: '',
  unit: '',
  stockQuantity: '',
  qteColis: '',
  image: '',
};

export interface ArticlePanelProps {
  form: ArticleForm;
  setForm: React.Dispatch<React.SetStateAction<ArticleForm>>;
}

export const FIELD_SX = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    '&:hover fieldset': { borderColor: '#1a237e' },
    '&.Mui-focused fieldset': { borderColor: '#1a237e' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#1a237e' },
};

export function SectionTitle({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
      <Box sx={{ color: '#1a237e', display: 'flex' }}>{icon}</Box>
      <Typography
        variant="subtitle2"
        fontWeight={600}
        color="#1a237e"
        textTransform="uppercase"
        letterSpacing={0.8}
        fontSize="0.7rem"
      >
        {label}
      </Typography>
      <Box sx={{ flex: 1, height: '1px', backgroundColor: '#e8eaf6', ml: 1 }} />
    </Box>
  );
}
