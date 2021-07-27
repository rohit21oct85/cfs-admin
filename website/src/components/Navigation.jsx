import React, { useState, useEffect, useContext } from 'react'
import { Link, useHistory ,NavLink, useParams } from "react-router-dom";
import './loginNav.css';
import { Navbar,Nav} from 'react-bootstrap'
import {AuthContext} from '../context/AuthContext.jsx';
import * as utils from '../utils/MakeSlug';
import useMainModules from '../hooks/useMainModules';

export default function Navigation() {
    const history = useHistory();
    const params  = useParams();
    const { state, dispatch } = useContext(AuthContext);
    function logout(){
        dispatch({type: 'LOGOUT'})
        history.push('/')
    }
    const {data:routes} = useMainModules(state.role,state.email);
return (
<>

{state.isLoggedIn && (
<div className="login_menu col-lg-2 col-md-2 col-12" bg="dark" variant="dark" expand="lg">
    <div className="webLogo col-md-2 pt-2 pb-2">
        <img src="/logo_2.png" className="img-responsive" style={{ width:'180px'}}  alt="User"/>
    </div>
    <div className="user_area">
        <div className="user_icon">
            <img src="/user.png" alt="User"/>
        </div>
        <div className="user_details">
            <span className="user_name">{state.fullname}</span>
            <span className="user_name"></span>
        </div>
        <div className="user_options flex pl-2 pr-2 pb-3">
            <button className="btn btn-sm pt-0 pb-0 dark bg-success br-15" as={Link} alt="Logout">
                {(state.role == "1") ? (
                        <>
                        <span className="fa fa-lock"></span> Master Admin
                        </>
                    ):(
                        <>
                        {(state.role == "2") ? (
                            <><span className="fa fa-lock"></span> Admin</>
                        ): (
                            <><span className="fa fa-lock"></span> Other Admin</>
                        )}
                        </>
                    )}
            </button>
            <button className="btn btn-sm pt-0 pb-0 bg-danger br-15" as={Link} onClick={logout} alt="Logout">
                <span className="fa fa-power-off mr-2"></span>
                Logout
            </button>
            
        </div>
    </div>
    <div className="navbar_menus">
        <ul>
            <li>
                <Nav className="ml-auto">
                    <NavLink to="/dashboard" > <span className="fa fa-dashboard"></span> Dashboard</NavLink>
                </Nav>
            </li>
            {state?.role == '1' && (
            <>
            <li>
                <Nav className="ml-auto">
                    <NavLink to="/app-modules" > <span className="fa fa-gears"></span> App Modules</NavLink>
                </Nav>
            </li>
            <li>
                <Nav className="ml-auto">
                    <NavLink to="/role-modules" > <span className="fa fa-gears"></span> Role Modules</NavLink>
                </Nav>
            </li>
            </>
            )}
            
            {routes?.map(routes => { 
                return (
                <li key={routes?._id}>
                <Nav className="ml-auto">
                    <NavLink to={`/${utils.MakeSlug(routes?.module_name)}`} >
                    <span className={`fa ${routes?.module_icon} mr-2 mt-1`}></span>
                        {routes?.module_name}</NavLink>
                </Nav>
                </li>
                )
            })}
           
        </ul>
    </div>
            
            
</div>
)}
        
</>             
)
}
