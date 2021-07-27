
import { useHistory, useLocation } from 'react-router-dom';
import {useContext}  from 'react'
import {AuthContext} from '../context/AuthContext.jsx';
import useUserPermission from './useUserPermission.jsx';

export default function useAccessModulePermission(action) {
    const {state } = useContext(AuthContext);
    const location = useLocation();
    const path = location?.pathname?.split('/');
    const urls = path[1];
    const {data:permission} = useUserPermission(state.role,state.email);
    return permission && permission.some( per => per.method_name == `${action}-${urls}`);    
    
}
