import React, {useContext, useEffect} from 'react'
import '../mainDash.css';
import {  useHistory, Link  } from "react-router-dom";
import { Button } from 'react-bootstrap'

import {AuthContext} from '../../context/AuthContext';
import {AdminContext} from '../../context/AdminContext';
import {ErrorContext} from '../../context/ErrorContext';
import {Notification} from '../../components/Notification';
import {LoadingComp} from '../../components/LoadingComp';

import useAxios from '../../hooks/useAxios';
import TopMenu from './TopMenu';

export default function AdminList() {
    const history = useHistory();
    const {state} = useContext(AuthContext);
    const {state: adminState, dispatch: adminDispatch} = useContext(AdminContext);
    const {state: errorState, dispatch: errorDispatch} = useContext(ErrorContext);
    const {response, isLoading} = useAxios({
        method: 'get', url: 'master-admin/view-all'
    });
    const handleDelete = async (e) => {
        history.push(`delete-data/master-admin/delete/${e}`); 
    }
    
    const handleUpdate = async (e) => {
        history.push(`/master-admin/update/${e}`);
    }

    useEffect(() => {
        if(response !== null){
            const AllAdmins = response.data;
            adminDispatch({type: 'GET_ALL_ADMIN', payload: AllAdmins});
        }
    }, [response]);
    useEffect( () => {
        let timerError = setTimeout(() => errorDispatch({type: 'SET_ERROR', payload: ''}), 1500);
        let timerSuccess = setTimeout(() => errorDispatch({type: 'SET_SUCCESS', payload: ''}), 1500);
        return () => {
        clearTimeout(timerError)
        clearTimeout(timerSuccess)
        }
    },[errorState])
return (

    <>
    {state.isLoggedIn && adminState && errorState && (
      
    <div className="col-lg-10 col-md-10 main_dash_area">
        <div className="main-area-all">
            <div className="dashboard_main-container">
                <div className="dash-main-head">
                    <h2>Admin List</h2>
                </div>
                {errorState.success && ( <Notification>{errorState.success}</Notification>)}        
                {errorState.error && ( <Notification>{errorState.error}</Notification>)}
                {isLoading && (<LoadingComp />)}
                <TopMenu data={adminState.Admins}/>
                <div className="dash-cont-start">
                    <div className="org-main-area">
                        
                       
                        {!isLoading && (
                        <div className="subject-main-container">
                        {adminState.Admins.map( admin => (
                            <div className="small-card" key={admin._id} id={`card-${admin._id}`}>
                                
                                <div className="subject-card-body mt-2">
                                    <div className="admin-name"> 
                                        <div className="name-label">
                                            Name: 
                                        </div>
                                        <div className="name-main">
                                            {admin.fullname}
                                        </div>
                                    </div> 
                                    
                                    <div className="admin-name"> 
                                        <div className="name-label">
                                            Email: 
                                        </div>
                                        <div className="name-main">
                                            {admin.email}
                                        </div>
                                    </div> 
                                    
                                    <div className="admin-name"> 
                                        <div className="name-label">
                                            Role: 
                                        </div>
                                        <div className="name-main">
                                            {(admin.role == 1) ? 'Super Admin':'Admin'}
                                        </div>
                                    </div> 
                                    
                                    
                                    <div className="admin-name"> 
                                        <div className="name-label">
                                            Created On: 
                                        </div>
                                        <div className="name-main">
                                            {admin.created_at.split('T')[0]}
                                        </div>
                                    </div> 
                                </div>
                                <hr className="mt-1 mb-1"/>
                                <div className="subject-card-heading">
                                    <div>
                                    </div>
                                    <div>
                                        <Button className="delBtn" onClick={handleUpdate.bind(this,admin._id)}>
                                            <span className="fa fa-pencil-square-o text-primary mr-2"></span>
                                        </Button>
                                        <Button className="delBtn" onClick={handleDelete.bind(this,admin._id)}>
                                        <span className="fa fa-trash text-danger ml-2"></span>
                                        </Button>
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
