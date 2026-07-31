import { Box } from "@mui/material";
import type { OrderItem } from "./NewOrder";
import OrderLine from "./OrderLine";
import Skeleton from '@mui/material/Skeleton';

interface OrderLinesProps{
    items: OrderItem[];
    onRemove: (productId: number) => void;
    onUpdateQty: (productId: number, qty: number) => void;
}

function OrderLines({items, onRemove, onUpdateQty} : OrderLinesProps) {
    return (
        <Box>
            { items.length != 0 && items.map(item => (
                <OrderLine
                    key={item.product.id}
                    item={item}
                    onRemove={() => onRemove(item.product.id)}
                    onUpdateQty={(qty) => onUpdateQty(item.product.id, qty)}
                />
            ))}

            {items.length === 0 && 
                Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} height={72} />
                ))
            }
        </Box>
    );
}
export default  OrderLines;