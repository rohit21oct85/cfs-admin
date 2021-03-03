import React, {useContext, useEffect, useState} from 'react'
import '../mainDash.css';
import {  useHistory, Link  } from "react-router-dom";
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faPlus, faLock } from '@fortawesome/free-solid-svg-icons'

import {AuthContext} from '../../context/AuthContext';
import {AdminContext} from '../../context/AdminContext';
import {ErrorContext} from '../../context/ErrorContext';
import {Notification} from '../../components/Notification';
import {LoadingComp} from '../../components/LoadingComp';

import useAxios from '../../hooks/useAxios';
export default function PermissionList() {

    const history = useHistory();
    const {state} = useContext(AuthContext);
    const {state: adminState, dispatch: adminDispatch} = useContext(AdminContext);
    const {state: errorState, dispatch: errorDispatch} = useContext(ErrorContext);
    const {response, isLoading} = useAxios({
        method: 'get', url: 'master-permission-group/view-all'
    });
    
    const [permissionGroup, setPermissionGroup] = useState();
    useEffect(() => {
        if(response !== null){
            const PermissionGroupRes = response.data;
            adminDispatch({ type: 'GET_ALL_PERMISSION_GROUPS', payload: PermissionGroupRes})
            if(PermissionGroupRes){
                setPermissionGroup(PermissionGroupRes);
            }
        }
    }, [response,permissionGroup]);
    useEffect( () => {
        let timerError = setTimeout(() => errorDispatch({type: 'SET_ERROR', payload: ''}), 1500);
        let timerSuccess = setTimeout(() => errorDispatch({type: 'SET_SUCCESS', payload: ''}), 1500);
        return () => {
        clearTimeout(timerError)
        clearTimeout(timerSuccess)
        }
    },[errorState]);
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
                    <div className="dash-cont-start">
                    {adminState.permissionGroups.map(permission => { return (
                        <div 
                            key={permission._id} 
                            className="mb-2"
                        >
                            <h5 className="module_name">  {permission.module_name.replaceAll('-',' ')}</h5>
                            <hr />
                            <div className="col-md-12 row">
                            {permission.module_method.map( method => {
                                return (
                                    <div className="col-md-2 subject-card">
                                        <label htmlFor={method._id}>
                                            <input 
                                                type="checkbox"
                                                id={method._id} 
                                            /> 
                                            {method.name}
                                        </label>
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
