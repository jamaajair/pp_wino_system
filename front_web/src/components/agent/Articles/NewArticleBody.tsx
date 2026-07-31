import { Box } from '@mui/material';
import NewArticleTabs from './NewArticleTabs';


function NewArticleBody() {
    return (
        <Box sx={{ width: '90%', mx: 'auto', mt: 0 }}>
            
            <NewArticleTabs />

        </Box>
    );
}

export default NewArticleBody;