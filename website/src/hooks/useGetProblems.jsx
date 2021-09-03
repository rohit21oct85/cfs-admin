import {useParams} from 'react-router-dom'
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../context/AuthContext.jsx';
import * as cons from '../Helper/Cons.jsx'

export default function useGetProblems() {
    const params = useParams();
    const isbn = params.isbn;
    const section_id = params?.section_id;
    const sub_section_id = params?.sub_section_id;
    const {state } = useContext(AuthContext);
    let API_URL = '';
    if(process.env.NODE_ENV === 'development'){
        API_URL = cons.LOCAL_API_URL;
    }else{
        API_URL = cons.LIVE_API_URL;
    }
    let path;
    if(sub_section_id && params?.solution_type === 'BB'){
        path = `${API_URL}chapter/bartelby-problems/${isbn}/${section_id}/${sub_section_id}`
    }else if(params?.solution_type === 'BB'){
        path = `${API_URL}chapter/bartelby-problems/${isbn}/${section_id}`
    }
    return useQuery([`problems-${section_id}-${sub_section_id}`], async () => {
        if(section_id){
            const result = await axios.get(path,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+state.access_token
                }
            });
            return result.data?.data; 
        }
    });
    
}
