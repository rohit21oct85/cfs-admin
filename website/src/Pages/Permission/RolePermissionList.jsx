import React, {useContext, useEffect, useState} from 'react'
import '../mainDash.css';
import {  useHistory, Link, useParams  } from "react-router-dom";
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faPlus, faLock } from '@fortawesome/free-solid-svg-icons'

import {AuthContext} from '../../context/AuthContext';
import {AdminContext} from '../../context/AdminContext';
import {ErrorContext} from '../../context/ErrorContext';
import {Notification} from '../../components/Notification';
import {LoadingComp} from '../../components/LoadingComp';
import {useFormData} from '../../hooks/useFormData';
import * as api from '../../Helper/ApiHelper.jsx';
import useAxios from '../../hooks/useAxios';

export default function RolePermissionList() {

    const history = useHistory();
    const params = useParams();
    const {state} = useContext(AuthContext);
    const {state: adminState, dispatch: adminDispatch} = useContext(AdminContext);
    const {state: errorState, dispatch: errorDispatch} = useContext(ErrorContext);
    const {formData, handleChange} = useFormData();
    
    const {response, isLoading} = useAxios({
        method: 'get', url: 'master-permission-group/view-all'
    });

    const {response:roleResponse} = useAxios({
        method: 'get', url: 'master-role/view-all'
    });


    const [permissionGroup, setPermissionGroup] = useState();
    const [Roles, setRoles] = useState();
    useEffect(() => {
        if(response !== null){
            const PermissionGroupRes = response.data;
            adminDispatch({ type: 'GET_ALL_PERMISSION_GROUPS', payload: PermissionGroupRes})
            if(PermissionGroupRes){
                setPermissionGroup(PermissionGroupRes);
            }
        }

        if(roleResponse !== null){
            const Roles = roleResponse.data;
            adminDispatch({type: 'GET_ALL_ROLE', payload: Roles});
            if(Roles){
                setRoles(Roles);
            }
        }

    }, [response,permissionGroup, roleResponse, Roles]);
    useEffect( () => {
        let timerError = setTimeout(() => errorDispatch({type: 'SET_ERROR', payload: ''}), 1500);
        let timerSuccess = setTimeout(() => errorDispatch({type: 'SET_SUCCESS', payload: ''}), 1500);
        return () => {
            clearTimeout(timerError)
            clearTimeout(timerSuccess)
        }
    },[errorState.error, errorState.success]);
    
    const handleCheckAll = async () => {
        const checkAll = document.getElementById('checkAll').checked; 
        
        if(checkAll){
            var ele = document.getElementsByName('permissions');  
            for(var i=0; i<ele.length; i++){  
                if(ele[i].type=='checkbox')  
                    ele[i].checked=true;  
            }
            
            var modEle = document.getElementsByName('moduleAll');  
            for(var i=0; i<modEle.length; i++){  
                if(modEle[i].type=='checkbox')  
                modEle[i].checked=true;  
            }

        }else{
            
            var ele=document.getElementsByName('permissions');  
            for(var i=0; i<ele.length; i++){  
                if(ele[i].type=='checkbox')  
                    ele[i].checked=false;  
            }
            var modEle = document.getElementsByName('moduleAll');  
            for(var i=0; i<modEle.length; i++){  
                if(modEle[i].type=='checkbox')  
                modEle[i].checked=false;  
            }
        }
         
    }

    const handleModuleAll = async (e) => {
        const checModule = document.getElementById(e).checked;
        if(checModule){
            
            var modEle = document.getElementsByClassName(e);  
            for(var i=0; i<modEle.length; i++){  
                if(modEle[i].type=='checkbox')  
                modEle[i].checked=true;  
            }
        }else{
            
            var modEle = document.getElementsByClassName(e);  
            for(var i=0; i<modEle.length; i++){  
                if(modEle[i].type=='checkbox')  
                modEle[i].checked=false;  
            }
        }
    }
    function clearFields(){
        document.getElementById("role").selectedIndex = '0';
        const cbs = document.querySelectorAll('input[type=checkbox]');
        cbs.forEach((cb) => {
            cb.checked = false;
        });
    }
    const handleSubmit = async () => {
        if(formData.role_name === undefined){
            errorDispatch({type: 'SET_ERROR', payload: "Please Select role to give permissions"});
        } else if(formData.permissions === undefined){
            errorDispatch({type: 'SET_ERROR', payload: "Please click on atleast single permission."});
        }else{
            const response = await api.post(`/master-role-permission/create`, formData);
            if(response.data.status === 200){
                adminDispatch({ type: 'GET_ALL_ROLE_PERMISSION', payload: response.data.data})
                errorDispatch({type: 'SET_SUCCESS', payload: response.data.message});
                clearFields()
                history.push('/role-permission');
            }else{
                errorDispatch({type: 'SET_ERROR', payload: response.data.message});
            }
        }
    }

return (

<>
{state.isLoggedIn && (
<div className="col-lg-10 col-md-10 main_dash_area">
<div className="main-area-all">
    <div className="dashboard_main-container">
        <div className="dash-main-head">
            <h2>Permission List</h2>
            
        </div>
        {errorState.success && ( <Notification>{errorState.success}</Notification>)}
        {errorState.error && ( <Notification>{errorState.error}</Notification>)}
        {isLoading && (<LoadingComp />)}
        {!isLoading && (
        <div className="dash-con-heading">
            <div className="col-md-12 row">
                <select 
                    name="role"
                    id="role"
                    className="roles col-md-6 form-control"
                    onChange={handleChange}
                >
                <option value="">Select Roles</option>
                    
                {adminState.Roles.map( role => { return(
                    <option 
                        selected={role._id === params.role_id ? 'selected':''}
                        value={`${role.name.toLowerCase().trim().replaceAll(' ','-')}_${role._id}`}
                        key={role._id}>{role.name}</option>
                )})}
                </select>
                <Button 
                onClick={handleSubmit}
                className="btn btn-sm dark">Save Permission</Button>
            </div>    
        </div>
        )}
        {!isLoading && (
        <div className="dash-cont-start">
        <h4 className="mt-2">All Permission Groups</h4>    
        <div className="col-md-12 row">
            <input type="checkbox" className="checkall" id="checkAll" name="CheckAll" 
            onChange={handleCheckAll}/>
            <label htmlFor="checkAll">Check All </label>
        </div>
        <hr />
        {adminState.permissionGroups.map(permission => { return (
            <div 
                key={permission._id} 
                className="mb-2"
            >
            <h5 className="module_name cursor">
            <input type="checkbox" className="moduleAll" id={permission._id} name="moduleAll" 
            onChange={handleModuleAll.bind(this, permission._id)}/>
            <label 
                style={{ marginLeft: '5px' }}
                htmlFor={permission._id}
                >{permission.module_name.replaceAll('-',' ')}</label>
            
            </h5>
            <hr />
            <div className="col-md-12 row">
            {permission.module_method.map( method => {
                return (
                <div className="col-md-2 subject-card" key={method._id}>
                    <input 
                            className={permission._id}
                            type="checkbox"
                            name="permissions"
                            onChange={handleChange}
                            id={method._id}
                            value={`${method.name}_${permission.module_name}`}
                            
                        /> 
                    <label htmlFor={method._id} style={{ marginBottom: '0px', marginLeft: '5px' }}>
                        {method.name}</label>

                </div>
                );
                })}
                </div>
            </div>
        )})}
        </div>
        )}
        
    </div>
</div>
</div>

)}  
</>
)
}
