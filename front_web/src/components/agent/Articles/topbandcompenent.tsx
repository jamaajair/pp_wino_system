import type { SvgIconComponent } from '@mui/icons-material';
import { Chip, Typography } from '@mui/material';
import { Box } from '@mui/material';


interface TopBandProps {
    TextToDisplay: string;
    Icon: SvgIconComponent;
}

function TopBand({TextToDisplay, Icon } : TopBandProps){
    return(   
    <Box>
        <Box
            sx={{
                height : 78,
                borderRadius: 3,
                px: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: 'bleu',
            }}       
        >
           <Box  sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }} >
            <Icon />
            <Typography
                sx={{
                    fontWeight: 800,
                    letterSpacing: 0.8
                }}
            > 
                {TextToDisplay}
            </Typography>
          </Box>

          <Chip
            label="Brouillon"
            size="small"
            sx={{
                height: 26,
                fontWeight: 700,
                color: 'black',
                border: '1px solid rgba(23, 0, 235, 0.55)',
                backgroundColor: 'rgba(0,0,0,0.12)',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.10)',
            }}
            />

        </Box>
      </Box>  
    );
}

export default TopBand;