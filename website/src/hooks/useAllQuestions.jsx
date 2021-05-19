import {useParams} from 'react-router-dom'
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../context/AuthContext.jsx';
import * as cons from '../Helper/Cons.jsx'


export default function useAllQuestions() {
    const params = useParams();
    const status = params?.status;
    const chield_subject_id = params?.chield_subject_id;
    const {state } = useContext(AuthContext);
    let API_URL = '';
    if(process.env.NODE_ENV === 'development'){
        API_URL = cons.LOCAL_API_URL;
    }else{
        API_URL = cons.LIVE_API_URL;
    }
    return useQuery([`all-questions-${status}-${chield_subject_id}`], async () => {
        if(status == "TRUE" && chield_subject_id !== undefined){
            const result = await axios.get(`${API_URL}question/chield-question/${status}/${chield_subject_id}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+state.access_token
                }
            });
            return result.data.data; 
        }
    });
}
