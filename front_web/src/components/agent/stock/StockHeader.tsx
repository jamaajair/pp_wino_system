import TopBand from "../Articles/topbandcompenent";
import WarehouseIcon from '@mui/icons-material/Warehouse';

function StockHeader() {
    return (
        <TopBand 
            TextToDisplay="Stock Management"
            Icon={WarehouseIcon }
        />
    );
}

export default StockHeader;