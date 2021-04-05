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

import CreatePermissionGroup from './CreatePermissionGroup';
import AllPermissionGroup from './AllPermissionGroup';

import useAxios from '../../hooks/useAxios';
export default function PermissionGroupList() {

    const history = useHistory();
    const {state} = useContext(AuthContext);
    const {state: adminState, dispatch: adminDispatch} = useContext(AdminContext);
    const {state: errorState, dispatch: errorDispatch} = useContext(ErrorContext);
    
    
    const {response, isLoading, error} = useAxios({
        method: 'get', url: 'master-module/view-all'
    });

    useEffect(() => {
        if(response !== null){
            adminDispatch({ type: 'GET_ALL_MODLISTS', payload: response.data})
        }
    }, [response]);
    useEffect( () => {
        let timerError = setTimeout(() => errorDispatch({type: 'SET_ERROR', payload: ''}), 1500);
        let timerSuccess = setTimeout(() => errorDispatch({type: 'SET_SUCCESS', payload: ''}), 1500);
        return () => {
        clearTimeout(timerError)
        clearTimeout(timerSuccess)
        }
    },[errorState.errors, errorState.success]);
return (
    <>
    {state.isLoggedIn && errorState && adminState.ModLists && (
      <div className="col-lg-10 col-md-10 main_dash_area">
        <div className="main-area-all">
            <div className="dashboard_main-container">
                <div className="dash-main-head">
                    <h2>Permission Group List</h2>
                </div>
                {isLoading && (<LoadingComp />)}
                {!isLoading && (
                <div className="dash-cont-start">
                    <div className="row col-md-12">
                        <div className="col-md-3 card p-2" style={{ position: 'fixed', width: '320px'}}>
                            <CreatePermissionGroup />
                        </div>
                        <div className="col-md-9" style={{ position: 'relative', left: '330px'}}>
                            <div className="subject-main-container">
                                <AllPermissionGroup />
                            </div>
                        </div>
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
