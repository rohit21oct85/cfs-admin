import {useParams} from 'react-router-dom'
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../context/AuthContext.jsx';
import * as cons from '../Helper/Cons.jsx'

export default function useBartelbyChapters() {
    const params = useParams();
    const isbn = params.isbn;
    const {state } = useContext(AuthContext);
    let API_URL = '';
    if(process.env.NODE_ENV === 'development'){
        API_URL = cons.LOCAL_API_URL;
    }else{
        API_URL = cons.LIVE_API_URL;
    }
    return useQuery('chapters-bartelby', async () => {
        const result = await axios.get(`${API_URL}chapter/bartelby-chapters/${isbn}`,{
            headers: {
                'Content-Type': 'Application/json',
                'Authorization':'Bearer '+state.access_token
            }
        });
        return result.data; 
    });
    
}
