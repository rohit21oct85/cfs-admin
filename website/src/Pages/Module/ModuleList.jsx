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
                
                <div className="dash-cont-start">
                    <div className="org-main-area">
                        <div className="col-md-3 pl-0">
                        <Link to={`/master-module/create`} className="btn btn-sm dark mb-3">
                            <FontAwesomeIcon icon={faPlus} />
                               Add New Module
                        </Link>
                        </div>
                        {errorState.success && ( 
                            <Notification>{errorState.success}</Notification>
                        )}
                        <div className="subject-main-container">
                            
                        {adminState.ModLists.map( module => (
                            <div className="module-card" key={module._id} id={`card-${module._id}`}>
                                <div className="subject-card-heading">
                                    <div>
                                        <Link to={`sub-subject/${module.module_name.replace(' ','-').toLowerCase().trim()}/${module._id}`}>
                                        #{module._id}
                                        </Link>
                                    </div>
                                    <div>
                                        <Button className="delBtn" onClick={handleUpdate.bind(this,module._id)}>
                                            <FontAwesomeIcon icon={faEdit} className="text-danger mr-2"  varient="solid"/>
                                        </Button>
                                        
                                        <Button className="delBtn" onClick={handleLock.bind(this,{id: module._id,module_name: module.module_name})}>
                                            <FontAwesomeIcon icon={faLock} className="text-success mr-2"  varient="solid"/>
                                        </Button>
                    
                                        <Button className="delBtn" onClick={handleDelete.bind(this,module._id)}>
                                            <FontAwesomeIcon icon={faTrash} className="text-danger"  varient="solid"/>
                                        </Button>
                                    </div>
                                </div>
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
                                            {module.description}
                                        </div>
                                    </div> 
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
        
    )}  
    </>

)
}
