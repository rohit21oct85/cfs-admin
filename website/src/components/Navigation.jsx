import React, { useState, useEffect, useContext } from 'react'
import { Link, useHistory ,NavLink, useParams } from "react-router-dom";
import './loginNav.css';
import { Navbar,Nav} from 'react-bootstrap'
import {AuthContext} from '../context/AuthContext.jsx';
import * as utils from '../utils/MakeSlug';
import useMainModules from '../hooks/useMainModules';
import useRoles from '../hooks/useRoles';
import axios from 'axios'
import * as cons from '../Helper/Cons'
import { useToasts } from 'react-toast-notifications';


export default function Navigation() {
    const history = useHistory();
    const params  = useParams();
    const { state, dispatch } = useContext(AuthContext);
    const {data: roles, isLoading: roleLoading } = useRoles();
    const [roleName, setRoleName] = useState(null);
    const [formData, setFormData] = useState({})
    useEffect(() => {
        let rol = roles?.filter(r => r?.role == state.role);
        if(roles !== undefined){
            setRoleName(rol[0]?.name)
        }
    },[state,roles])
    let API_URL = '';
    if(process.env.NODE_ENV === 'development'){
        API_URL = cons.LOCAL_API_URL;
    }else{
        API_URL = cons.LIVE_API_URL;
    }
    const { addToast } = useToasts();
    async function logout(){
        formData.email = state.email
        let response = await axios.delete(`${API_URL}admin/logout`,{
            headers: {
                'Content-Type': 'Application/json',
                'Authorization':'Bearer '+state.access_token
            }
        });
        if(response.status === 201){
            addToast(response.data.message, { 
                appearance: 'error',
                autoDismiss: true
            });
            setTimeout(()=> {
                dispatch({type: 'LOGOUT'})
                history.push('/')
            },1000)
        }
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
            <img src="/user.jpg" alt="User"/>
        </div>
        <div className="user_details">
            <p className="user_name mb-0 mt-1">{state.fullname}</p>
            <p className="user_name mb-1 mt-1">{state.email}</p>
        </div>
        <div className="user_options flex pl-2 pr-2 pb-3">
            <button className="btn btn-sm pt-0 pb-0 dark bg-success br-15" as={Link} alt="Logout">
            <span className="fa fa-lock mr-2"></span>
                {roleName}
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
