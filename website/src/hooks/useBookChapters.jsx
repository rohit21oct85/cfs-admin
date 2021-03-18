import {useParams} from 'react-router-dom'
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import {AuthContext} from '../context/AuthContext.jsx';
import axios from 'axios';
import * as cons from '../Helper/Cons.jsx'

export default function useBookChapters() {
    const params = useParams();
    const isbn = params.isbn;
    const {state } = useContext(AuthContext);
    let API_URL = '';
    if(process.env.NODE_ENV === 'development'){
        API_URL = cons.LOCAL_API_URL;
    }else{
        API_URL = cons.LIVE_API_URL;
    }
    return useQuery(['chapters',isbn], async () => {
        const result = await axios.get(`${API_URL}chapter/all/${isbn}`,{
            headers: {
                'Content-Type': 'Application/json',
                'Authorization':'Bearer '+state.access_token
            }
        });
        console.log('chapters hook ', result.data.chapters)
        return result.data.chapters; 
    });
    
}
