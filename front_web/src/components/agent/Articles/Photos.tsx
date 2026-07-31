import { Box, Button, Typography, IconButton } from '@mui/material';
import { ImagePlus, Trash2 } from 'lucide-react';
import { SectionTitle, type ArticlePanelProps } from './articleShared';

function Photos({ form, setForm }: ArticlePanelProps) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm(prev => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => setForm(prev => ({ ...prev, image: '' }));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
      <SectionTitle icon={<ImagePlus size={15} />} label="Photo de l'article" />

      {form.image ? (
        <Box sx={{ position: 'relative', width: 220, height: 220 }}>
          <Box
            component="img"
            src={form.image}
            alt="Aperçu article"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 3,
              border: '1px solid #e0e0e0',
            }}
          />
          <IconButton
            size="small"
            onClick={handleRemove}
            sx={{
              position: 'absolute',
              top: 6,
              right: 6,
              backgroundColor: 'rgba(255,255,255,0.9)',
              '&:hover': { backgroundColor: '#fff' },
            }}
          >
            <Trash2 size={16} color="#c62828" />
          </IconButton>
        </Box>
      ) : (
        <Box
          sx={{
            width: 220,
            height: 220,
            borderRadius: 3,
            border: '2px dashed #c5cae9',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            color: '#9fa8da',
          }}
        >
          <ImagePlus size={36} />
          <Typography variant="caption">Aucune image</Typography>
        </Box>
      )}

      <Box>
        <Button
          component="label"
          variant="outlined"
          startIcon={<ImagePlus size={16} />}
          sx={{
            textTransform: 'none',
            borderColor: '#1a237e',
            color: '#1a237e',
            borderRadius: 2,
          }}
        >
          {form.image ? "Changer l'image" : 'Ajouter une image'}
          <input type="file" accept="image/*" hidden onChange={handleFile} />
        </Button>
      </Box>
    </Box>
  );
}

export default Photos;
