import {useParams} from 'react-router-dom'
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../context/AuthContext.jsx';

import {AdminContext} from '../context/AdminContext.jsx';
import * as cons from '../Helper/Cons.jsx'

export default function useSingleTutor() {
    const params = useParams();
    const {state } = useContext(AuthContext);
    const {state:adminState } = useContext(AdminContext);

    let API_URL = '';

    if(process.env.NODE_ENV === 'development'){
        API_URL = cons.LOCAL_API_URL;
    }else{
        API_URL = cons.LIVE_API_URL;
    }

    let url = '';
    if(params.tutor_id){
        url = `${API_URL}tutor/details/${params?.tutor_id}`;
    }

    return useQuery([`tutor/${params?.tutor_id}`], async () => {
        const result = await axios.get(`${url}`,{
            headers: {
                'Content-Type': 'Application/json',
                'Authorization':'Bearer '+state.access_token
            }
        });
        return result.data;
    });
    
}
