import React, {useContext, useEffect, useState} from 'react'
import '../mainDash.css';
import {  useHistory, Link  } from "react-router-dom";
import { Button } from 'react-bootstrap'
import * as api from '../../Helper/ApiHelper.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons'

import {AuthContext} from '../../context/AuthContext';
import {AdminContext} from '../../context/AdminContext';
import {ErrorContext} from '../../context/ErrorContext';
import {Notification} from '../../components/Notification';
import {LoadingComp} from '../../components/LoadingComp';

import useAxios from '../../hooks/useAxios';

export default function RoleList() {
    const history = useHistory();
    const {state} = useContext(AuthContext);
    const {state: adminState, dispatch: adminDispatch} = useContext(AdminContext);
    const {state: errorState, dispatch: errorDispatch} = useContext(ErrorContext);
    const {response, isLoading} = useAxios({
        method: 'get', url: 'master-role/view-all'
    });
    
    
    const handleDelete = async (e) => {
        history.push(`delete-data/master-role/delete/${e}`) 
        // await api.del(``);
        // document.getElementById('card-'+e).style.display = "none";
    }
    
    const handleUpdate = async (e) => {
        history.push(`/master-role/update/${e}`);
    }

    useEffect(() => {
        if(response !== null){
            const Roles = response.data;
            adminDispatch({type: 'GET_ALL_ROLE', payload: Roles});
        }
    }, [response]);
    useEffect( () => {
        let timerError = setTimeout(() => errorDispatch({type: 'SET_ERROR', payload: ''}), 1500);
        let timerSuccess = setTimeout(() => errorDispatch({type: 'SET_SUCCESS', payload: ''}), 1500);
        return () => {
        clearTimeout(timerError)
        clearTimeout(timerSuccess)
        }
    },[errorState.errror , errorState.success])
return (

    <>
    {state.isLoggedIn && adminState && errorState && (
      
    <div className="col-lg-10 col-md-10 main_dash_area">
        <div className="main-area-all">
            <div className="dashboard_main-container">
                <div className="dash-main-head">
                    <h2>Role List</h2>
                </div>
                
                <div className="dash-cont-start">
                    <div className="org-main-area">
                        <div className="col-md-3 pl-0">
                        <Link to={`/master-role/create`} className="btn btn-sm dark mb-3">
                            <FontAwesomeIcon icon={faPlus} />
                               Add New Role
                        </Link>
                        </div>
                        {errorState.success && ( <Notification>{errorState.success}</Notification>)}
                        {errorState.error && ( <Notification>{errorState.error}</Notification>)}
                        {isLoading && (<LoadingComp />)}
                        {!isLoading && (
                        <div className="subject-main-container">
                        {adminState.Roles.map( role => (
                            <div className="subject-card" key={role._id} id={`card-${role._id}`}>
                                <div className="subject-card-heading">
                                    <div>
                                        <Link to={`view-permission/${role.name.replace(' ','-').toLowerCase().trim()}/${role._id}`}>
                                        #{role._id}
                                        </Link></div>
                                    <div>
                                        <Button className="delBtn" onClick={handleUpdate.bind(this,role._id)}>
                                            <FontAwesomeIcon icon={faEdit} className="text-success mr-2"  varient="solid"/>
                                        </Button>
                                        <Button className="delBtn" onClick={handleDelete.bind(this,role._id)}>
                                            <FontAwesomeIcon icon={faTrash} className="text-danger"  varient="solid"/>
                                        </Button>
                                    </div>
                                </div>
                                <div className="subject-card-body mt-2">
                                    <div className="admin-name"> 
                                        <div className="name-label">
                                            Role: 
                                        </div>
                                        <div className="name-main">
                                            {role.name}
                                        </div>
                                    </div> 
                                    
                                    <div className="admin-name"> 
                                        <div className="name-label">
                                            Role_id: 
                                        </div>
                                        <div className="name-main">
                                            {role.role}
                                        </div>
                                    </div> 
                                    
                                    <div className="admin-name"> 
                                        <div className="name-label">
                                            Status: 
                                        </div>
                                        <div className="name-main">
                                            {(role.status == 1) ? 'Active':'Inactive'}
                                        </div>
                                    </div> 
                                    
                                    
                                    <div className="admin-name"> 
                                        <div className="name-label">
                                            Created On: 
                                        </div>
                                        <div className="name-main">
                                            {role.created_at.split('T')[0]}
                                        </div>
                                    </div> 
                                    <div className="admin-name"> 
                                        <div className="name-label">
                                            Description: 
                                        </div>
                                        <div className="name-main desc">
                                            {role.description}
                                        </div>
                                    </div> 
                                </div>
                            </div>
                        ))}
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
        
    )}  
    </>

)
}
