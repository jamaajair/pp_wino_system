import { useState } from 'react';
import { Box } from '@mui/material';
import AppTabs from '../UsefeulComponents/Tabs';
import { EMPTY_ARTICLE, type ArticleForm } from './articleShared';
import General from './General';
import Emballage from './Emballage';
import Photos from './Photos';

const TABS = [
    { value: 'general', label: 'Général' },
    { value: 'packaging', label: 'Emballage' },
    { value: 'photos', label: 'Photos' },
] as const;

type ArticleTabValue = typeof TABS[number]['value'];

function NewArticleTabs() {
    const [activeTab, setActiveTab] = useState<ArticleTabValue>('general');
    const [form, setForm] = useState<ArticleForm>(EMPTY_ARTICLE);

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
        </Box>
    );
}

export default NewArticleTabs;
