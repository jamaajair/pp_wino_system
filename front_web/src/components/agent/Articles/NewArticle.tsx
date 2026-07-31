import Box from "@mui/material/Box/Box";
import NewArticleBody from "./NewArticleBody";
import NewArticleHeader from "./NewArticleHeader";


function NewArticle(){
    return(
        <>
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f7f8fc' }}>
            <NewArticleHeader />
            <NewArticleBody />
        </Box>
        </>
    );
}

export default NewArticle;
