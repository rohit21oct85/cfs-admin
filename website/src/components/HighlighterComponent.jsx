import Highlighter from 'react-text-highlighter';
import DOMPurify from 'dompurify';

const HighlighterComponent = ({highlightedText}) => {
    return (
        <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(highlightedText)}}/>
    )
};

export default Highlighter(HighlighterComponent)