import React, {useContext, useEffect, useState} from 'react'
import '../mainDash.css';
import {  useHistory, Link  } from "react-router-dom";
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faPlus, faLock,faEye } from '@fortawesome/free-solid-svg-icons'

import {AuthContext} from '../../context/AuthContext';
import {AdminContext} from '../../context/AdminContext';
import {ErrorContext} from '../../context/ErrorContext';
import {Notification} from '../../components/Notification';
import {LoadingComp} from '../../components/LoadingComp';

import useAxios from '../../hooks/useAxios';
import * as utils from '../../utils/MakeSlug'

export default function ModuleList() {

    const history = useHistory();
    const {state} = useContext(AuthContext);
    const {state: adminState, dispatch: adminDispatch} = useContext(AdminContext);
    const {state: errorState, dispatch: errorDispatch} = useContext(ErrorContext);
    
    const {response, isLoading, error} = useAxios({
        method: 'get', url: 'master-module/view-all'
    });
    
    const [appModule, setAppModule] = useState();
    const handleDelete = async (e) => {
        const module_id = e.id;
        history.push(`delete-data/master-module/delete/${module_id}`) 
    }
    const handleUpdate = async (e) => {
        history.push(`/master-module/update/${e}`);
    }
    
    const handlePage = async (e) => {
        history.push(`/${utils.MakeSlug(e)}`);
    }

    
    const handleLock = async (e) => {
        const module_id = e.id;
        const module_name = e.module_name.toLowerCase().replace(' ','-');
        history.push(`/view-data/master-module/${module_name}/view/${module_id}`);
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
    },[errorState])
return (

    <>
    {state.isLoggedIn && errorState && adminState.ModLists && (
      
    <div className="col-lg-10 col-md-10 main_dash_area">
        <div className="main-area-all">
            <div className="dashboard_main-container">
                <div className="dash-main-head">
                    <h2>Module List</h2>
                </div>
                {errorState.success && ( <Notification>{errorState.success}</Notification>)}
                {isLoading && (<LoadingComp />)}
                <div className="dash-con-heading">
                    <div className="col-md-3 pl-0">
                    <Link to={`/master-module/create`} className="btn btn-sm dark">
                        <FontAwesomeIcon icon={faPlus} />
                        Add New Module
                    </Link>
                    </div>    
                </div>
                <div className="dash-cont-start">
                    <div className="org-main-area">
                        
                        
                        {!isLoading && (
                        <div className="subject-main-container">
                            
                        {adminState.ModLists.map( module => (
                            <div className="subject-card" key={module._id} id={`card-${module._id}`}>
                                <div className="subject-card-body mt-2">
                                    <div className="admin-name"> 
                                        <div className="name-label">
                                            Module Name: 
                                        </div>
                                        <div className="name-main">
                                            {module.module_name}
                                        </div>
                                    </div> 
                                    
                                    <div className="admin-name"> 
                                        <div className="name-label">
                                            Status: 
                                        </div>
                                        <div className="name-main">
                                            {(module.status == 1) ? 'Active':'Inactive'}
                                        </div>
                                    </div> 
                                    
                                    
                                    <div className="admin-name"> 
                                        <div className="name-label">
                                            Created On: 
                                        </div>
                                        <div className="name-main">
                                            {module.create_at.split('T')[0]}
                                        </div>
                                    </div> 
                                    <div className="admin-name"> 
                                        <div className="name-label">
                                            Description: 
                                        </div>
                                        <div className="name-main desc">
                                            {utils.GetString(module.description,30)}
                                        </div>
                                    </div> 
                                </div>

                                <hr className="mt-1 mb-1"/>
                                <div className="subject-card-heading">
                                    <div></div>
                                    <div>
                                    
                                        <Button className="delBtn pl-1 pr-1 " onClick={handlePage.bind(this,module.module_name)}>
                                            <FontAwesomeIcon icon={faEye} className="text-success mr-2"  varient="solid"/>
                                        </Button>
                                        <Button className="delBtn pl-1 pr-1" onClick={handleUpdate.bind(this,module._id)}>
                                            <FontAwesomeIcon icon={faEdit} className="text-danger mr-2"  varient="solid"/>
                                        </Button>
                                        
                                        <Button className="delBtn pl-1 pr-1" onClick={handleLock.bind(this,{id: module._id,module_name: module.module_name})}>
                                            <FontAwesomeIcon icon={faLock} className="text-success mr-2"  varient="solid"/>
                                        </Button>
                    
                                        <Button className="delBtn pl-1 pr-1" onClick={handleDelete.bind(this,{id: module._id,module_name: module.module_name})}>
                                            <FontAwesomeIcon icon={faTrash} className="text-danger"  varient="solid"/>
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
