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

import useAxios from '../../hooks/useAxios';
export default function PermissionList() {

    const history = useHistory();
    const {state} = useContext(AuthContext);
    const {state: adminState, dispatch: adminDispatch} = useContext(AdminContext);
    const {state: errorState, dispatch: errorDispatch} = useContext(ErrorContext);
    const {response, isLoading, error} = useAxios({
        method: 'get', url: 'master-module/view-all'
    });
    
    const [appModule, setAppModule] = useState();
    const handleDelete = async (e) => {
        history.push(`delete-data/master-module/delete/${e}`) 
    }
    const handleUpdate = async (e) => {
        history.push(`/master-module/update/${e}`);
    }
    
    const handleLock = async (e) => {
        const module_id = e.id;
        const module_name = e.module_name.toLowerCase().replace(' ','-');
        history.push(`/master-module/password/${module_name}/${module_id}`);
    }

    useEffect(() => {
        if(response !== null){
            const ModuleRes = response.data;
            adminDispatch({ type: 'GET_ALL_MODLISTS', payload: ModuleRes})
            if(ModuleRes){
                setAppModule(ModuleRes);
            }
        }
    }, [response,appModule]);
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
    {state.isLoggedIn && errorState && adminState.ModLists && (
      <div className="col-lg-10 col-md-10 main_dash_area">
        <div className="main-area-all">
            <div className="dashboard_main-container">
                <div className="dash-main-head">
                    <h2>Permission List</h2>
                </div>
                
                <div className="dash-cont-start">

                </div>
            </div>
        </div>
    </div>
        
    )}  
    </>
)
}
