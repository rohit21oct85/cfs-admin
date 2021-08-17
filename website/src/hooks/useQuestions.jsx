import {useContext}  from 'react'
import {useParams} from 'react-router-dom'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../context/AuthContext.jsx';
import {AdminContext} from '../context/AdminContext.jsx';
import * as cons from '../Helper/Cons.jsx'

export default function useQuestions() {
    const {state } = useContext(AuthContext);
     let API_URL = '';
    if(process.env.NODE_ENV === 'development'){
        API_URL = cons.LOCAL_API_URL;
    }else{
        API_URL = cons.LIVE_API_URL;
    }
    let url = `${API_URL}books/upload-questions`;

    return useQuery([`questions`], async () => {
        
        const result = await axios.get(url,{
            headers: {
                'Content-Type': 'Application/json',
                'Authorization':'Bearer '+state.access_token
            }
        });
        return result.data.data
    });
    
}
