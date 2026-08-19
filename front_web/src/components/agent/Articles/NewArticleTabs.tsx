import { useState } from 'react';
import { Alert, Box, Button, Snackbar } from '@mui/material';
import axios from 'axios';
import AppTabs from '../UsefeulComponents/Tabs';
import { EMPTY_ARTICLE, type ArticleForm } from './articleShared';
import type { ProductCreateRequest } from '../../../types';
import { articleService } from '../../../services/articleService';
import General from './General';
import Emballage from './Emballage';
import Photos from './Photos';

const TABS = [
    { value: 'general', label: 'Général' },
    { value: 'packaging', label: 'Emballage' },
    { value: 'photos', label: 'Photos' },
] as const;

type ArticleTabValue = typeof TABS[number]['value'];

// Les champs numériques du formulaire valent '' tant qu'ils n'ont pas été saisis.
const numberOrUndefined = (value: number | '') => (value === '' ? undefined : Number(value));

function creationErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        // ProductController renvoie { success: false, message } sur échec métier
        // (code déjà pris, catégorie inconnue).
        const detail = error.response?.data?.message ?? error.response?.data?.error;
        if (typeof detail === 'string' && detail.length > 0) return detail;
    }
    return "Erreur lors de la création de l'article.";
}

function NewArticleTabs() {
    const [activeTab, setActiveTab] = useState<ArticleTabValue>('general');
    const [form, setForm] = useState<ArticleForm>(EMPTY_ARTICLE);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async () => {
        // Les trois contraintes NOT NULL de la table products.
        if (!form.code.trim()) {
            setError("Le code article est obligatoire.");
            setActiveTab('general');
            return;
        }
        if (!form.name.trim()) {
            setError("Le nom de l'article est obligatoire.");
            setActiveTab('general');
            return;
        }
        if (form.salePrice === '' || Number(form.salePrice) <= 0) {
            setError('Le prix de vente doit être renseigné et positif.');
            setActiveTab('general');
            return;
        }

        setError(null);
        setSubmitting(true);
        try {
            const payload: ProductCreateRequest = {
                code: form.code.trim(),
                name: form.name.trim(),
                description: form.description.trim() || undefined,
                purchasePrice: numberOrUndefined(form.purchasePrice),
                salePrice: Number(form.salePrice),
                // stock_quantity est NOT NULL : un article non compté part à 0.
                stockQuantity: form.stockQuantity === '' ? 0 : Number(form.stockQuantity),
                tva: numberOrUndefined(form.tva),
                qteColis: numberOrUndefined(form.qteColis),
                unit: form.unit.trim() || undefined,
                active: true,
                ...(form.categoryId === '' ? {} : { category: { id: Number(form.categoryId) } }),
            };

            const created = await articleService.create(payload);
            setSuccess(`Article ${created.code} créé avec succès.`);
            setForm(EMPTY_ARTICLE);
            setActiveTab('general');
        } catch (err) {
            setError(creationErrorMessage(err));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box>
            <AppTabs<ArticleTabValue>
                tabs={TABS.map(t => ({ value: t.value, label: t.label }))}
                value={activeTab}
                onChange={setActiveTab}
            />

            {activeTab === 'general' && <General form={form} setForm={setForm} />}
            {activeTab === 'packaging' && <Emballage form={form} setForm={setForm} />}
            {activeTab === 'photos' && <Photos form={form} setForm={setForm} />}

            {/* Hors des onglets : l'enregistrement reste accessible quel que soit
                l'onglet ouvert, puisque le formulaire est un seul et même article. */}
            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', mt: 3, mb: 3 }}>
                <Button
                    variant="outlined"
                    onClick={() => { setForm(EMPTY_ARTICLE); setActiveTab('general'); }}
                    disabled={submitting}
                    sx={{
                        textTransform: 'none',
                        borderColor: '#c5cae9',
                        color: '#1a237e',
                        borderRadius: 2,
                        px: 3,
                    }}
                >
                    Réinitialiser
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={submitting}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        backgroundColor: '#1a237e',
                        borderRadius: 2,
                        px: 3,
                        '&:hover': { backgroundColor: '#0d1757' },
                    }}
                >
                    {submitting ? 'Enregistrement…' : "Enregistrer l'article"}
                </Button>
            </Box>

            <Snackbar
                open={error !== null}
                autoHideDuration={5000}
                onClose={() => setError(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                {error ? (
                    <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
                ) : undefined}
            </Snackbar>

            <Snackbar
                open={success !== null}
                autoHideDuration={4000}
                onClose={() => setSuccess(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                {success ? (
                    <Alert severity="success" onClose={() => setSuccess(null)}>{success}</Alert>
                ) : undefined}
            </Snackbar>
        </Box>
    );
}

export default NewArticleTabs;
