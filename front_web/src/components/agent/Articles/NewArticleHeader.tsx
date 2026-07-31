import TopBand from "./topbandcompenent";
import ArticleIcon from '@mui/icons-material/Article';


function NewArticleHeader(){
    return (
        <>
            <TopBand
                TextToDisplay="NOUVEL ARTICLE"
                Icon={ArticleIcon}
            />
        </>
    );
}

export default NewArticleHeader;