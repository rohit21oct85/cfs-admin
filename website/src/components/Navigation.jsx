import React, { useState, useEffect, useContext } from 'react'
import { Link, useHistory ,NavLink } from "react-router-dom";
import './loginNav.css';
import { Navbar,Nav} from 'react-bootstrap'
import {AuthContext} from '../context/AuthContext.jsx';
import {AdminContext} from '../context/AdminContext.jsx';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPowerOff } from '@fortawesome/free-solid-svg-icons'
import useAxios from '../hooks/useAxios';

export default function Navigation() {
    const history = useHistory();
    const { state, dispatch } = useContext(AuthContext);
    const { state:adminState, dispatch:adminDispatch } = useContext(AdminContext);
    
    
    const {response, isLoading, error} = useAxios({
        method: 'get', url: 'master-module/view-all'
    });
    const HandleRoute = (e) => {
        history.push('/my-profile');
    }
    function logout(){
        dispatch({type: 'LOGOUT'})
        history.push('/')
    }
    const [superAdminRoutes, setSuperAdminRoutes] = useState([]);
    const [adminRoutes, setAdminRoutes] = useState([]);
    useEffect(() => {
        if(response !== null){
            const ModuleRoutes = response.data;
            const sRoutes = ModuleRoutes.filter( routes => routes.role_access === 1);
            setSuperAdminRoutes(sRoutes);
            adminDispatch({type: 'SET_SA_ROUTES', payload: sRoutes});
            const aRoutes = ModuleRoutes.filter( routes => routes.role_access === 2);
            adminDispatch({type: 'SET_A_ROUTES', payload: aRoutes});
            setAdminRoutes(aRoutes);
        }
    }, [response, history]);
    
    function logout(){
        dispatch({type: 'LOGOUT'})
        history.push('/')
    }
    
return (
<>

{state.isLoggedIn && adminState.ModLists && (
<div className="login_menu col-lg-2 col-md-2 col-12" bg="dark" variant="dark" expand="lg">
    <div className="webLogo">
        <img src="/logo.png" alt="User"/>
    </div>
    <div className="user_area">
        <div className="user_icon">
            <img src="/user.png" alt="User"/>
        </div>
        <div className="user_details">
            <span className="user_name">{state.fullname}</span>
            <span className="user_name"></span>
        </div>
        <div className="user_options">
            <ul>
                <li as={Link} onClick={HandleRoute}>My Profile</li>
                <li>|</li>
                <li as={Link}>
                    <span className="badge-success p-1 pt-0 pb-0 m-0" style={{ borderRadius: '3px' }}>
                    {(state.role == 1) ? ' S Admin':' Admin'}</span></li>
                <li>|</li>
                <li as={Link} onClick={logout} alt="Logout">
                    <FontAwesomeIcon icon={faPowerOff}/>
                </li>
            </ul>
        </div>
    </div>
    <div className="navbar_menus">
        <ul>
            <li>
                <Nav className="ml-auto">
                    <NavLink to="/dashboard" >Dashboard</NavLink>
                </Nav>
            </li>
            {state.role == 1 && adminState.superAdminRoutes.map(routes => {
                return (
                    <li key={routes._id}>
                    <Nav className="ml-auto">
                        <NavLink to={`/${routes.module_name.trim().toLowerCase().replaceAll(' ','-')}`} >{routes.module_name}</NavLink>
                    </Nav>
                    </li>
                )
            })}
            
            { (state.role == 1 || state.role == 2) && adminState.adminRoutes.map(routes => { return (
                <li key={routes._id}>
                <Nav className="ml-auto">
                    <NavLink to={`/${routes.module_name.trim().toLowerCase().replaceAll(' ','-')}`} >{routes.module_name}</NavLink>
                </Nav>
                </li>
            )})}
            
            
        </ul>
    </div>
            
            
</div>
)}
        
</>             
)
}
