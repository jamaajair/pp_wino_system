import { useState, useRef } from 'react';
import {
  Alert, Box, Button, Chip, CircularProgress,
  Divider, InputAdornment, Paper, TextField, Typography,
} from '@mui/material';
import { Search, Hash, Package, Tag, Percent, Boxes, FileText, Ruler, X } from 'lucide-react';
import { articleService } from '../../../services/articleService';
import type { Article } from '../../../types';

interface SearchArticleFormProps {
  onClose: () => void;
  onSelected?: (article: Article) => void;
}

function ArticleCard({
  article,
  selected,
  onClick,
}: {
  article: Article;
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
          <Package size={16} color={selected ? 'white' : '#1a237e'} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography fontWeight={600} fontSize="0.875rem" color="#1a237e" noWrap>
            {article.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 0.25 }}>
            <Typography fontSize="0.75rem" color="#757575" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Hash size={11} /> {article.code}
            </Typography>
            <Typography fontSize="0.75rem" color="#757575" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Tag size={11} /> {article.salePrice} €
            </Typography>
          </Box>
        </Box>
        <Chip
          label={`Stock: ${article.stockQuantity}`}
          size="small"
          sx={{
            fontSize: '0.68rem', height: 20, flexShrink: 0,
            backgroundColor: article.stockQuantity > 0 ? '#e8f5e9' : '#ffebee',
            color: article.stockQuantity > 0 ? '#1b5e20' : '#b71c1c',
          }}
        />
      </Box>
    </Paper>
  );
}

function ArticleDetail({ article }: { article: Article }) {
  const row = (icon: React.ReactNode, label: string, value?: string | number) =>
    value !== undefined && value !== null && value !== '' ? (
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
          <Package size={20} color="white" />
        </Box>
        <Box>
          <Typography fontWeight={700} fontSize="1rem" color="#1a237e">{article.name}</Typography>
          <Chip
            label={`Stock: ${article.stockQuantity}`}
            size="small"
            sx={{ fontSize: '0.68rem', height: 18, backgroundColor: '#e8eaf6', color: '#1a237e' }}
          />
        </Box>
      </Box>

      <Divider sx={{ mb: 1.5 }} />

      {row(<Hash size={14} />, 'Code article', article.code)}
      {row(<FileText size={14} />, 'Description', article.description)}
      {row(<Tag size={14} />, 'Prix de vente', `${article.salePrice} €`)}
      {row(<Tag size={14} />, "Prix d'achat", `${article.purchasePrice} €`)}
      {row(<Percent size={14} />, 'TVA', `${article.tva} %`)}
      {row(<Ruler size={14} />, 'Unité', article.unit)}
      {row(<Boxes size={14} />, 'Quantité par colis', article.qteColis)}
      {row(<Package size={14} />, 'Stock', article.stockQuantity)}
    </Paper>
  );
}

function SearchArticle({ onClose, onSelected }: SearchArticleFormProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Article[]>([]);
  const [selected, setSelected] = useState<Article | null>(null);
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
      const data = await articleService.search(q);
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

  const handleSelect = (article: Article) => {
    setSelected(prev => prev?.code === article.code ? null : article);
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
            Recherche Rapide Article
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Recherchez par nom ou code.
          </Typography>
        </Box>

        {/* Search bar */}
        <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid #e8eaf6', mb: 2.5 }}>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <TextField
              inputRef={inputRef}
              placeholder="Nom, code…"
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
              <Typography color="#9e9e9e" mt={1.5}>Aucun article trouvé pour « {query} »</Typography>
            </Paper>
          ) : (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>

              {/* Liste */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography fontSize="0.75rem" color="#9e9e9e" fontWeight={600} textTransform="uppercase" letterSpacing={0.8} mb={0.5}>
                  {results.length} résultat{results.length > 1 ? 's' : ''}
                </Typography>
                {results.map(a => (
                  <ArticleCard
                    key={a.id ?? a.code}
                    article={a}
                    selected={selected?.code === a.code}
                    onClick={() => handleSelect(a)}
                  />
                ))}
              </Box>

              {/* Fiche détail */}
              {selected && (
                <Box sx={{ width: 300, flexShrink: 0 }}>
                  <Typography fontSize="0.75rem" color="#9e9e9e" fontWeight={600} textTransform="uppercase" letterSpacing={0.8} mb={0.5}>
                    Détail article
                  </Typography>
                  <ArticleDetail article={selected} />
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
                      Sélectionner cet article
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

export default SearchArticle;
