import { Box, Typography } from "@mui/material";
import { useState } from "react";
import AppTabs from "../UsefeulComponents/Tabs";
import PurchaseInvoice from "./PurchaseInvoice";


const TABS = [
    { value: 'purchaseInvoice', label: 'Facture D\'achat' },
    { value: 'inventaire', label: 'Inventaire' },
    { value: 'autres', label: 'Autres' },
] as const;

type StockInTabValue = typeof TABS[number]['value'];

function StockInTabs() {
    const [activeTab, setActiveTab] = useState<StockInTabValue>('purchaseInvoice');


    return (
        <Box>
            <AppTabs<StockInTabValue>
                tabs={TABS.map(t => ({ value: t.value, label: t.label }))}
                value={activeTab}
                onChange={setActiveTab}
            />

            {activeTab === 'purchaseInvoice' && <PurchaseInvoice />}

            {activeTab === 'inventaire' && (
                <Box sx={{ p: 3 }}>
                    <Typography color="text.secondary">
                        Ajustement d'inventaire (à implémenter).
                    </Typography>
                </Box>
            )}

            {activeTab === 'autres' && (
                <Box sx={{ p: 3 }}>
                    <Typography color="text.secondary">
                        Mouvements de stock manuels (à implémenter).
                    </Typography>
                </Box>
            )}
        </Box>
    );
}

export default StockInTabs;