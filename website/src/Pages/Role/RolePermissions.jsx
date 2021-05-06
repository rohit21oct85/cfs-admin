import React, {useContext, useEffect, useState} from 'react'
import '../mainDash.css';
import {  useHistory,useParams,  Link  } from "react-router-dom";
import { Button } from 'react-bootstrap'

import {AuthContext} from '../../context/AuthContext';
import {AdminContext} from '../../context/AdminContext';
import {ErrorContext} from '../../context/ErrorContext';
import {Notification} from '../../components/Notification';
import {LoadingComp} from '../../components/LoadingComp';
import {useFormData} from '../../hooks/useFormData';
import * as api from '../../Helper/ApiHelper.jsx';
import useAxios from '../../hooks/useAxios';



export default function RolePermissions() {

    const history = useHistory();
    const params = useParams();
    const {state} = useContext(AuthContext);
    const {state: adminState, dispatch: adminDispatch} = useContext(AdminContext);
    const {state: errorState, dispatch: errorDispatch} = useContext(ErrorContext);
    const {formData, handleChange} = useFormData();
    
    const {response, isLoading} = useAxios({
        method: 'get', url: `master-role-permission/view/${params.role_id}/${params.role_name}`
    });


    const [RolePermissions, setRolePermissions] = useState();
    
    useEffect(() => {
        if(response !== null){
            const RolePermissionRes = response.data.permissions;
            adminDispatch({ type: 'GET_ROLE_PERMISSIONS', payload: RolePermissionRes})
            if(RolePermissionRes){
                setRolePermissions(RolePermissionRes);
            }
        }
    }, [response,RolePermissions]);

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
            <h2>Permission List {params.role_name}</h2>
            
        </div>
        {errorState.success && ( <Notification>{errorState.success}</Notification>)}
        {errorState.error && ( <Notification>{errorState.error}</Notification>)}
        {isLoading && (<LoadingComp />)}
        {!isLoading && (
        <div className="dash-con-heading">
            <Link to={`/master-role`}
            className="btn btn-sm dark mr-2">
                <span className="fa fa-arrow-left"></span>
            </Link>
        
            <Link to={`/role-permission/update/${params.role_name}/${params.role_id}`}
            className="btn btn-sm dark">Update Permission</Link>
        
        </div>
        )}
        {!isLoading && (
        <div className="dash-cont-start">
        <h4 className="mt-2">All Role Permissions</h4>    
        <div className="subject-main-container">
            {adminState?.AllRolePermissions.map(permission => { return (
                <div className="small-card" key={permission._id}>
                <div className="subject-card-body mt-2">
                    
                    <div className="admin-name"> 
                        <div className="name-label">
                            Module Name: 
                        </div>
                        <div className="name-main">
                        {permission.module_name.replaceAll('-',' ')}
                        </div>
                    </div> 
                    
                    <div className="admin-name"> 
                        <div className="name-label">
                            Method Name: 
                        </div>
                        <div className="name-main">
                        {permission.method_name.replaceAll('-',' ')}
                        </div>
                    </div> 
                </div>
                </div>
            )})}
        </div>    
        </div>
        )}
        
    </div>
</div>
</div>

)}  
</>
)
}
