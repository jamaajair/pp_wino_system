import { Box } from "@mui/material";
import { useState } from "react";
import AppTabs from "../UsefeulComponents/Tabs";
import PurchaseInvoice from "./PurchaseInvoice";
import Inventaire from "./Inventaire";


const TABS = [
    { value: 'purchaseInvoice', label: 'Facture D\'achat' },
    { value: 'inventaire', label: 'Inventaire' },
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

            {activeTab === 'inventaire' && <Inventaire />}
        </Box>
    );
}

export default StockInTabs;
