import {useParams, useLocation} from 'react-router-dom'
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../context/AuthContext';
import * as cons from '../Helper/Cons.jsx'


export default function useUserAllPermission() {
    const params = useParams();
    const location = useLocation();
    const {state } = useContext(AuthContext);
    let API_URL = '';

    if(process.env.NODE_ENV === 'development'){
        API_URL = cons.LOCAL_API_URL;
    }else{
        API_URL = cons.LIVE_API_URL;
    }
    
    const role = params?.role
    const email = params?.email
    return useQuery(`all-permissions-${role}-${email}`, async () => {
        if(role !== undefined){
            const result = await axios.get(`${API_URL}role-module/all-permissions/${role}/${email}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+state.access_token
                }
            });
            
            return result.data.data; 
        }
        
    });
    
}
