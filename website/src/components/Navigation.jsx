import React, { useState, useEffect, useContext } from 'react'
import { Link, useHistory ,NavLink, useParams } from "react-router-dom";
import './loginNav.css';
import { Navbar,Nav} from 'react-bootstrap'
import {AuthContext} from '../context/AuthContext.jsx';
import * as utils from '../utils/MakeSlug';
import useAppModules from '../hooks/useAppModules';

export default function Navigation() {
    const history = useHistory();
    const params  = useParams();
    const { state, dispatch } = useContext(AuthContext);
    function logout(){
        dispatch({type: 'LOGOUT'})
        history.push('/')
    }
    const {data} = useAppModules();

    const [AllRoutes, SetAllRoutes] = useState([]);
    let AllRoutesData = [];
    useEffect(filterRoutes,[state, data]);
    async function filterRoutes(){
        if(state?.role == "1"){
            AllRoutesData = data;
        }else{
            AllRoutesData = await data?.filter( routes => routes.role_access == state.role);
        }
        SetAllRoutes(AllRoutesData);
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
                <li className="btn btn-sm dark-warning p-2 br-5" as={Link} alt="Logout">
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
                </li>
                <li className="btn btn-sm red p-2 br-5" as={Link} onClick={logout} alt="Logout">
                    <span className="fa fa-power-off mr-2"></span>
                    Logout
                </li>
            </ul>
        </div>
    </div>
    <div className="navbar_menus">
        <ul>
            <li>
                <Nav className="ml-auto">
                    <NavLink to="/dashboard" > <span className="fa fa-dashboard"></span> Dashboard</NavLink>
                </Nav>
            </li>
            
            {AllRoutes?.map(routes => { 
                return (
                <li key={routes?._id}>
                <Nav className="ml-auto">
                    <NavLink to={`/${utils.MakeSlug(routes?.module_name)}`} >{routes?.module_name}</NavLink>
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
