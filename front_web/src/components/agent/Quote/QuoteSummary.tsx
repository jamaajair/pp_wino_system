import type { QuoteItem } from "./NewQuote";
import { Box, Typography, Divider } from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
interface QuoteSummaryProps{
    items: QuoteItem[];
}


function QuoteSummary({ items }: QuoteSummaryProps) {

    const nmbr_colis = items.reduce((acc, item) => acc + item.qty, 0);
    const total_htva = items.reduce((acc, item) => acc + item.qty * item.product.salePrice, 0);
    const total_ttc = items.reduce((acc, item) => acc + (item.qty * item.product.salePrice)*(1+item.product.tva/100), 0);

    return (
        <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1.25rem 1.5rem",
            border: "0.5px solid",
            borderColor: "divider",
            borderRadius: 3,
            backgroundColor: "background.paper",
        }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box sx={{
                    width: 36, height: 36, borderRadius: "50%",
                    backgroundColor: "info.50",
                    display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                    <ShoppingCartIcon sx={{ fontSize: 16, color: "info.main" }} />
                </Box>
                <Box>
                    <Typography variant="body1" fontWeight={500}>{nmbr_colis} articles</Typography>
                </Box>
            </Box>

            <Divider orientation="vertical" flexItem />

            
            <Box sx={{ display: "flex", gap: 4 }}>
                <Box sx={{ textAlign: "right" }}>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>HTVA</Typography>
                    <Typography variant="h6" fontWeight={500}>{total_htva.toFixed(2)} €</Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>TVA</Typography>
                    <Typography variant="h6" fontWeight={500}>{(total_ttc - total_htva).toFixed(2)} €</Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>A Payer</Typography>
                    <Typography variant="h6" fontWeight={500} color="info.main">{total_ttc.toFixed(2)} €</Typography>
                </Box>
            </Box>

        </Box>
        
    );
}

export default QuoteSummary;