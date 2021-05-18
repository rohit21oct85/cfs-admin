import {useParams} from 'react-router-dom'
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../context/AuthContext.jsx';
import * as cons from '../Helper/Cons.jsx'


export default function useGetChieldSubjects() {
    const params = useParams();
    const subject_id = params.subject_id;
    const sub_subject_id = params.sub_subject_id;
    const status = params?.status;
    const {state } = useContext(AuthContext);
    let API_URL = '';
    if(process.env.NODE_ENV === 'development'){
        API_URL = cons.LOCAL_API_URL;
    }else{
        API_URL = cons.LIVE_API_URL;
    }
    return useQuery([`chield_subjects-${subject_id}-${sub_subject_id}-${status}`], async () => {
        if(status !== undefined){
            const result = await axios.get(`${API_URL}chield-subject/all/${subject_id}/${sub_subject_id}/${status}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+state.access_token
                }
            });
            return result.data.data; 
        }
    });
}
