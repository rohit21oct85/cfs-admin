import { useLocation } from 'react-router-dom';
import useMainModules from './useMainModules';
import {useContext}  from 'react'
import {AuthContext} from '../context/AuthContext.jsx';

export default function useAccessModules() {
    const {state } = useContext(AuthContext);
    const {data:modules} = useMainModules(state.role, state.email);
    const location = useLocation();
    const path = location?.pathname;
    const splitData = path.split('/')
    const urls = splitData[1];
    // console.log(urls); return;
    return modules && modules?.some(module => module?.module_slug == urls); 
}
