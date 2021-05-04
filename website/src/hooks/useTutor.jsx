import {useParams} from 'react-router-dom'
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../context/AuthContext.jsx';

import {AdminContext} from '../context/AdminContext.jsx';
import * as cons from '../Helper/Cons.jsx'

export default function useTutor() {
    const params = useParams();
    const {state } = useContext(AuthContext);
    const {state:adminState } = useContext(AdminContext);

    let API_URL = '';

    if(process.env.NODE_ENV === 'development'){
        API_URL = cons.LOCAL_API_URL;
    }else{
        API_URL = cons.LIVE_API_URL;
    }

    let limit = 12;
    let pageno = (adminState.CurrentPage === null ) ? 1 : adminState.CurrentPage;
    let url = '';
    if(params.status && params.master_subject){
        url = `${API_URL}tutor/all/${params?.status}/${params?.master_subject}/${params?.type}/${pageno}/${limit}`;
    }
    else{
        url = `${API_URL}tutor/all/all/all/all/${pageno}/${limit}`;
    }

    return useQuery([`tutors/${params?.status}/${params?.master_subject}/${params?.type}`,pageno], async () => {
        const result = await axios.get(`${url}`,{
            headers: {
                'Content-Type': 'Application/json',
                'Authorization':'Bearer '+state.access_token
            }
        });
        
        return {
            data: result.data.data, 
            newTutor: {
                count: result.data.newTutorCount,
                tutor: result.data.newTutor,
            },
            pagination: {
                currentPage: result.data.currentPage,
                hasNextPage: result.data.hasNextPage,
                hasPrevPage: result.data.hasPrevPage,
                next: result.data.next,
                pageCount: result.data.pageCount,
                itemCount: result.data.itemCount,
                prev: result.data.prev,
            }
        };  
    });
    
}
