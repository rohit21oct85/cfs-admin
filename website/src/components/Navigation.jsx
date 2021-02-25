import React, { useState, useEffect, useContext } from 'react'
import { Link, useHistory ,NavLink } from "react-router-dom";
import './loginNav.css';
import { Navbar,Nav} from 'react-bootstrap'
import {AuthContext} from '../context/AuthContext.jsx';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPowerOff } from '@fortawesome/free-solid-svg-icons'

export default function Navigation() {
    const history = useHistory();
    const { state, dispatch } = useContext(AuthContext);
    
    const HandleRoute = (e) => {
        history.push('/my-profile');
    }
    function logout(){
        dispatch({type: 'LOGOUT'})
        history.push('/')
    }
return (
<>

{state.isLoggedIn && (
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
            {state.role == 1 && (
            <>    
            <li>
                <Nav className="ml-auto">
                    <NavLink to="/master-admin" >Manage Admin</NavLink>
                </Nav>
            </li>
            
            <li>
                <Nav className="ml-auto">
                    <NavLink to="/master-role" >Manage Role</NavLink>
                </Nav>
            </li>
            
            <li>
                <Nav className="ml-auto">
                    <NavLink to="/master-permission-group">Manage Permission Group</NavLink>
                </Nav>
            </li>
            
            <li>
                <Nav className="ml-auto">
                    <NavLink to="/master-permission" >Manage Permission</NavLink>
                </Nav>
            </li>

            </>
            )}

            <li>
                <Nav className="ml-auto">
                    <NavLink to="/subject" >Subject</NavLink>
                </Nav> 
            </li>
            
            <li>
                <Nav className="ml-auto">
                    <NavLink to="/sub-subject" >Sub Subject</NavLink>
                </Nav> 
            </li>

            <li>
            <Nav className="ml-auto">
                    <NavLink to="/reports" >Reports</NavLink>
                </Nav> 
            </li>
            
        </ul>
    </div>
            
            
</div>
)}
        
</>             
)
}
