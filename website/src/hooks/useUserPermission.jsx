import {useParams, useLocation} from 'react-router-dom'
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../context/AuthContext';
import * as cons from '../Helper/Cons.jsx'


export default function useUserPermission() {
    const params = useParams();
    const location = useLocation();
    const {state } = useContext(AuthContext);
    let API_URL = '';

    if(process.env.NODE_ENV === 'development'){
        API_URL = cons.LOCAL_API_URL;
    }else{
        API_URL = cons.LIVE_API_URL;
    }


    const module_slug = location.pathname.split('/')[1];
    const role = state?.role
    const email = state?.email
    return useQuery(`user-permissions-${module_slug}`, async () => {
        if(module_slug !== undefined){
            const result = await axios.get(`${API_URL}role-module/permissions/${module_slug}/${role}/${email}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+state.access_token
                }
            });
            
            return result.data.data; 
        }
        
    });
    
}
