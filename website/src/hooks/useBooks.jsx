import {useContext}  from 'react'
import {useParams} from 'react-router-dom'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../context/AuthContext.jsx';
import {AdminContext} from '../context/AdminContext.jsx';
import * as cons from '../Helper/Cons.jsx'

export default function useBooks() {
    const {state } = useContext(AuthContext);
    const params = useParams();
    const {state:adminState } = useContext(AdminContext);
    let API_URL = '';
    if(process.env.NODE_ENV === 'development'){
        API_URL = cons.LOCAL_API_URL;
    }else{
        API_URL = cons.LIVE_API_URL;
    }
    let limit = 30;
    let pageno = (adminState.CurrentPage === null ) ? 1 : adminState.CurrentPage;
    let url = '';
    if(params.sub_subject_id){
        url = `${API_URL}books/view-all/${params.sub_subject_id}/${pageno}/${limit}`;
    }else{
        url = `${API_URL}books/view-all/${pageno}/${limit}`;
    }
    return useQuery([`books/${params.sub_subject_id}`,pageno], async () => {
        
        const result = await axios.get(url,{
            headers: {
                'Content-Type': 'Application/json',
                'Authorization':'Bearer '+state.access_token
            }
        });
        return {
            data: result.data.data, 
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
